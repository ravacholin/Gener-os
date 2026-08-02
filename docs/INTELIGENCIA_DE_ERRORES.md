# Inteligencia de errores

El SRS sabe **qué palabra** fallaste. Esto sabe **por qué**, y hace algo al respecto.

Si alguien falla *problema*, *tema*, *idioma* y *sistema*, un motor de repaso espaciado
reprograma cuatro tarjetas independientes. Pero no son cuatro problemas: son uno solo —
no sabe que los helenismos en -ma son masculinos. Detectarlo cambia qué conviene hacer
después.

Todo corre en el dispositivo. No hay red, cuentas ni telemetría: el análisis existe para
el que estudia, no para un dashboard de producto.

## Arquitectura

| Archivo | Rol |
|---|---|
| `src/insights.ts` | Datos: familias lingüísticas, copy, mapa de contraste |
| `src/errors.ts` | Registro de intentos, features, detección, estado de los patrones |
| `src/remediation.ts` | Intervención: boost de selección y tandas de contraste |
| `src/srs.ts` | Sólo suma un parámetro opcional `boost` a `pickNextWord` |

## 1. Qué se registra

Antes se guardaba un booleano. Ahora, por intento: la palabra, el género elegido, si acertó,
la **latencia** y la **caja SRS previa**. Todo en un ring buffer de 400 intentos bajo
`genero_errors_v1` (~22 KB).

Dos de esos campos hacen trabajo que no es obvio:

- **La latencia** separa el error por automatismo (contestó antes de leer) del error por
  duda. Piden cosas distintas. Si la app se ocultó con la tarjeta a la vista, la medición se
  descarta: un teléfono guardado no es una respuesta lenta.
- **La caja previa** separa el olvido de la confusión. Fallar algo que ya estaba dominado no
  es lo mismo que no haber entendido nunca la regla.

La familia y la terminación **no** se guardan: se derivan al leer, así editar el dataset no
invalida el historial.

## 2. Las 12 familias

Las 48 `rule` del dataset son demasiado finas para inferir nada — veinte tienen una sola
palabra. Se agrupan por el mecanismo lingüístico que comparten, que es lo que un hablante
aprende (o no) de una vez:

`estandar-o` · `estandar-a` · `masculino-en-a` · `e-ambigua` · `sufijo-femenino` ·
`sufijo-masculino` · `sis` · `a-tonica` · `homonimo` · `consonante` · `excepcion` · `semantico`

El criterio es pedagógico, no etimológico: *el problema* (griego) y *el día* (latino) van
juntos porque para el que aprende son el mismo hecho. Un test recorre el dataset entero y
falla si aparece una regla sin clasificar.

`a-tonica` es familia propia y no una `estandar-a` más: *el agua* es femenina pero se oye con
"el", y ése es un error distinto del de *la mesa*.

## 3. Los cinco patrones

| Tipo | Qué detecta |
|---|---|
| `family` | Una familia acumula errores por encima de tu línea base |
| `trap` | La terminación miente: *el problema*, *la mano*, *el agua* |
| `bias` | Ante la duda siempre elegís el mismo género |
| `speed` | Fallás en menos de 1,2 s, o acertás tardando más de 6 s |
| `leech` | Palabras falladas muchas veces, u olvidadas tras dominarlas |

### Lo que evita inventar patrones

Tres filtros, y cada uno tapa un agujero distinto:

**Cota inferior de Wilson.** 3 errores en 4 intentos es una tasa cruda del 75%, pero la cota
inferior no llega a 0,5: no alcanza para acusar a nadie. Se usa z = 1,28 (80%) y no 1,96
porque el costo de practicar de más una familia sana es bajo, y el de no detectar una
confusión real es alto.

**Línea base *leave-one-out*.** Comparar contra la tasa global no sirve para los grupos
grandes: `estandar-o` es el 24% del dataset y buena parte del tráfico, así que sus propios
errores dominan la línea base contra la que se lo compara y nunca podría destacarse. Se lo
compara contra el resto.

**Mínimo de errores en palabras distintas.** Wilson controla el ruido en la tasa, no la
concentración. Sin este filtro, alguien que falla siempre *altavoz* haría disparar toda la
familia de terminaciones en -z — y la corrección para eso no es una tanda de contraste, es
repetir la palabra. Es lo que separa "no entendés la regla" de "esta palabra no te entra".

Además hay un **arranque en frío**: por debajo de 20 intentos no se detecta nada. Sin línea
base propia, cualquier agrupación es ruido.

## 4. Cuándo un patrón está superado

`activo` → `mejorando` → `superado`, con histéresis para que no oscile:

- **mejorando**: 5 aciertos seguidos del grupo.
- **superado**: 8 aciertos seguidos **y** que la racha abarque ≥ 30 minutos. La ventana
  temporal es el punto: ocho aciertos dentro de la misma tanda son memoria de trabajo, no
  aprendizaje.
- **recaída**: hacen falta 3 errores nuevos. Un tropiezo aislado no reabre un patrón cerrado.

`analyze()` **clasifica** en lugar de avanzar paso a paso. Correrlo dos veces sobre el mismo
historial da el mismo resultado, así que se puede recalcular en cada render sin que un patrón
se declare superado solo. Hay un test que lo fija.

## 5. La intervención

### Boost de selección

Las palabras del patrón pesan más al elegir la siguiente. Va acotado a 3× y se aplica en
`weightFor`, o sea **después** del sorteo de dificultad, así que no altera las proporciones de
`LEVEL_MIX`. Medido en el navegador: la familia pasa de ~15% a ~28% de los turnos, sin que el
resto del pool desaparezca.

### Tandas de contraste

Es la parte que realmente corrige. Repetir *problema, tema, idioma, sistema* en fila enseña a
decir "masculino" cuatro veces, no a discriminar; lo que arregla una confusión es el **par
mínimo**: alternar la palabra trampa con la vecina que se le parece y va al revés.

El lado del contraste sale, por orden de preferencia:

1. **El par de homónimos del propio dataset** — *el cometa* / *la cometa*. Mismo significante,
   género opuesto: el par mínimo perfecto.
2. **El género opuesto dentro de la familia**, cuando ya tiene los dos — *el puente* / *la llave*.
3. **La familia declarada como contraste** — *el problema* / *la crema*. Para `a-tonica` el
   contraste es `masculino-en-a`: *el agua* y *el problema* llevan las dos "el" y el género es
   opuesto, que es exactamente lo que desarma el error de oído.
4. **La misma terminación con género opuesto**, para patrones sin familia.

Dos cuidados que no son evidentes:

- **El ancla se elige entre palabras ya dominadas.** Si el lado del contraste también falla,
  la tanda deja de ser discriminación y pasa a ser frustración.
- **El orden se baraja con restricciones.** Una tanda que alterna M,F,M,F se resuelve entera
  alternando sin leer una sola palabra. Se exige que no haya corridas de 3 del mismo género
  (se perdería el contraste) pero sí al menos una repetición (se rompe la predicción).

Las tandas existen además por una razón arquitectónica: `pickBucket` sortea la bolsa de
dificultad *antes* de aplicar pesos, así que en los niveles con mezcla el boost queda inerte
parte de los turnos. Una tanda es una lista ya elegida y esquiva ese sorteo.

### Micro-lección y cierre

Al fallar una palabra de un patrón activo, el reveal **nombra el patrón** en lugar de repetir
la regla de la palabra suelta. Reemplaza la fila del título en vez de sumar una: la caja tiene
alto fijo en móvil y una fila más la desbordaría.

Al superarlo, un stamp reusando la animación existente.

## 6. Dónde se ve

En el Diccionario, sección "Tus patrones": label, tip, medidor de tasa de error con la peor
marca alcanzada, y estado. Tocar un patrón filtra la lista a sus palabras. No hay pantallas
nuevas — el Diccionario ya era la superficie de repaso.

## 7. Qué esperar en cada nivel

Las 36 trampas de terminación están **todas** en `difícil`, y `fácil` tiene sólo 6 reglas
(dos familias). En nivel fácil los únicos patrones detectables son el sesgo de género y las
palabras que se resisten. No es una limitación del motor: en `fácil` no hay nada sutil que
diagnosticar.

Un patrón detectado en `difícil` queda **latente** si el usuario baja a `fácil`: se lo sigue
mostrando, con la nota de que no sale en ese nivel, pero no genera tandas. El patrón lo espera.

## 8. Tests

`npm test` — 74 tests, todos sobre lógica pura y sin DOM. Lo que cubren:

- que las 48 reglas del dataset estén clasificadas y que las familias mixtas tengan de verdad
  los dos géneros;
- que Wilson castigue las muestras chicas y que la detección no dispare con ruido uniforme,
  con errores concentrados en una sola palabra, ni antes del arranque en frío;
- la máquina de estado completa, incluida la idempotencia y que 8 aciertos en dos minutos **no**
  den por superado nada;
- que las tandas alternen, nunca salgan del pool y jamás produzcan una secuencia perfectamente
  alternada en 50 semillas;
- **no regresión del SRS**: `pickNextWord` sin `boost` selecciona exactamente igual que antes.

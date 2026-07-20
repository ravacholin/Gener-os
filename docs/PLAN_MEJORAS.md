# Plan de mejoras profundas — Género de Sustantivos

Este documento es la especificación completa y autosuficiente de la próxima ronda de mejoras.
Está pensado para ser ejecutado fase por fase, en orden, con un commit por fase. No requiere
contexto adicional: todas las rutas, tipos y criterios de verificación están acá.

## Filosofía del producto (no negociable)

La app es **deliberadamente minimalista**: una sola pantalla de juego, un solo overlay
(Diccionario), cero configuración más allá de dificultad y mute. Las mejoras de este plan
**no agregan ningún menú, pantalla, tab ni selector nuevo**. Toda la profundidad nueva es
automática e invisible: emerge del motor SRS que ya existe.

### Principio rector: "Una interacción, muchos ejercicios"

Hoy la app tiene un único ejercicio (¿masculino o femenino?) con una interacción binaria
excelente: rieles izquierda/derecha, swipe de la tarjeta, teclado `A`/`D` y `←`/`→`.

La innovación central de este plan: **agregar tres formatos de ejercicio nuevos que usan
exactamente la misma interacción binaria**. No hay selector de modo — **el formato lo elige
automáticamente el motor SRS según la caja Leitner de cada palabra**. A medida que el usuario
domina una palabra, el ejercicio muta y se vuelve más exigente. El usuario nunca configura nada;
solo nota que el juego "se pone más interesante".

## Estado actual (resumen para orientarse)

| Archivo | Líneas | Rol |
|---|---|---|
| `src/nouns.ts` | ~1.772 | Dataset de 479 sustantivos + interfaz `Noun` |
| `src/App.tsx` | ~839 | TODO el UI y la lógica de juego (monolito) |
| `src/srs.ts` | ~173 | Motor SRS Leitner (cajas 0–5), persistencia, migración |
| `src/index.css` | ~74 | Design system Tailwind v4 (`@theme`), monocromo brutalista |
| `src/main.tsx` | 16 | Root render + registro del service worker |

Datos clave:

- `Noun`: `{ word, gender: 'masculino'|'femenino', difficulty: 'fácil'|'medio'|'difícil', translation, rule, explanation, example }`. El campo `example` ya trae artículo + palabra (`"El libro"`). El campo **`translation` (glosa en inglés) existe en las 479 palabras pero hoy no se muestra en ningún lado**.
- SRS (`src/srs.ts`): `SrsCardState { box: 0..5, dueAt, dueRound, lastSeen, firstSeenAt, totalSeen, totalCorrect, totalIncorrect }`. Correcta sube de caja, incorrecta baja a caja 0 y resurge en 3–6 rondas. "Dominado" = caja ≥ 3. `pickNextWord(pool, state, avoidWord)` elige la siguiente palabra (prefiere vencidas/no vistas, si no pick ponderado por caja).
- Validación actual en `App.tsx`: `handleAnswer(answer)` compara `activeNoun.gender === answer` (línea ~168).
- Persistencia: solo `localStorage`. Claves: `genero_score`, `genero_streak`, `genero_max_streak`, `genero_muted`, `genero_difficulty`, `genero_srs_v1`.
- Audio: solo tonos sintetizados de feedback (`playFeedbackSound` con Web Audio). **Las palabras nunca se pronuncian.**
- Dificultad: selector manual fácil/medio/difícil. Sin progresión automática.
- Deps muertas del scaffold de AI Studio: `@google/genai`, `express`, `dotenv`, `motion`, `@types/express`. El script `clean` referencia un `server.js` que no existe. Cero tests.

---

## Fase 0 — Higiene del proyecto

**Objetivo:** limpiar el scaffold muerto y dejar el entorno listo para testear. Bajo riesgo; sirve para validar que build y typecheck funcionan antes de tocar nada.

1. En `package.json`:
   - Quitar de `dependencies`: `@google/genai`, `express`, `dotenv`, `motion`.
   - Quitar de `devDependencies`: `@types/express`.
   - Cambiar `"clean": "rm -rf dist server.js"` por `"clean": "rm -rf dist"`.
   - Agregar `vitest` a `devDependencies` y script `"test": "vitest run"`.
   - Renombrar `"name": "react-example"` a `"name": "genero-de-sustantivos"`.
2. Borrar los restos del template de AI Studio que no cumplen función: `metadata.json` y `.env.example` (verificar antes que nada los importe; según la exploración, nada los usa en runtime).
3. Verificar: `npm install`, `npx tsc --noEmit`, `npm run build`, `npx vitest run` (0 tests, exit 0 con `--passWithNoTests` si hace falta).

**Commit:** `Fase 0: limpiar dependencias muertas del scaffold y agregar Vitest`

---

## Fase 1 — Refactor de arquitectura (sin cambiar el producto)

**Objetivo:** descomponer `src/App.tsx` (839 líneas) en hooks y componentes con límites claros, **manteniendo el render y el comportamiento idénticos**. Esto habilita las fases siguientes y hace el código mantenible.

Estructura destino:

```
src/
  App.tsx               (~150 líneas: composición de componentes + estado compartido mínimo)
  srs.ts                (sin cambios en esta fase)
  nouns.ts              (sin cambios)
  hooks/
    useGameEngine.ts    Estado del juego: palabra activa, score, streak, maxStreak,
                        srsState, handleAnswer, handleNext, reset, persistencia en
                        localStorage (mismas claves). Es la extracción de la lógica
                        que hoy vive en App.tsx líneas ~88–220.
    useSwipe.ts         Gesto de arrastre de la tarjeta: transform/rotación, umbral
                        ±110px, callbacks onCommitLeft/onCommitRight.
    useAudioFeedback.ts Tonos Web Audio (extracción de playFeedbackSound) + estado
                        de mute (clave genero_muted).
    useAppHeight.ts     Hack de --app-height con visualViewport (extracción del
                        useEffect existente; no tocar su lógica, es fix de bugs
                        reales de Android/WebView).
  components/
    Header.tsx          Título + selector de dificultad + mute + botón Diccionario.
    WordCard.tsx        Tarjeta central: palabra, stamp de resultado, reveal
                        (regla/explicación/ejemplo), hint "ver más".
    GenderRails.tsx     Rieles izquierdo/derecho (labels, iconos, texturas) +
                        botones táctiles móviles.
    StatsFooter.tsx     Racha / Puntos / Máx / En cola + barra de progreso de nivel.
    Library.tsx         Overlay Diccionario completo (búsqueda, chips de filtro,
                        lista, footer). Es el bloque más grande y autocontenido.
```

Reglas del refactor:

- **Movimiento, no reescritura.** Copiar el JSX y la lógica tal cual están; solo cambiar lo mínimo para pasar props. Los helpers `Chip`, `Stat` y `wordSizeClass` van al componente que los usa (o a `components/ui.tsx` si los comparten varios).
- Sin Redux/Zustand/Context: hooks y props alcanzan para esta escala.
- Mismas claves de `localStorage`, sin migraciones.
- Hacerlo en pasos chicos (extraer un componente → `npx tsc --noEmit` → siguiente).

Verificación: typecheck verde, `npm run dev` y probar el loop completo (responder por click, swipe y teclado; abrir/cerrar Diccionario; cambiar dificultad; mute; reset) en viewport móvil y desktop. El comportamiento debe ser indistinguible del actual.

**Commit:** `Fase 1: extraer hooks y componentes de App.tsx sin cambios de comportamiento`

---

## Fase 2 — Motor de ejercicios progresivos (la mejora principal)

**Objetivo:** cuatro formatos de ejercicio, todos con la misma interacción binaria, elegidos automáticamente por caja SRS.

### Los cuatro formatos

| Kind | Cajas | La tarjeta muestra | Riel izq. | Riel der. | Qué entrena |
|---|---|---|---|---|---|
| `gender` (actual) | no vista, 0–1 | la palabra (`mapa`) | MASCULINO | FEMENINO | reconocimiento |
| `article` | 2–3 | `___ mapa` | EL | LA | producción del artículo |
| `judgment` | 3–4 | `la mapa` o `el mapa` (50/50 bien/mal) | CORRECTO | ERROR | juicio gramatical |
| `meaning` | 4–5, solo homónimos | la palabra + glosa del sentido en inglés | EL | LA | homónimos por significado |

Notas pedagógicas importantes:

- **`article` y la "a tónica":** palabras como *agua*, *águila* (femeninas pero con artículo "el") son el caso donde `article` difiere de `gender`. El artículo correcto debe derivarse del campo `example` existente (su primera palabra: "El agua" → `el`), **no** del género. Esto convierte al formato `article` en un ejercicio genuinamente distinto y más difícil.
- **`judgment`:** la versión incorrecta se genera invirtiendo el artículo correcto (el↔la). 50/50 correcta/incorrecta con el rng.
- **`meaning`:** solo aplica a los ~39 sustantivos cuyo `rule` contiene "significado"/"Significado" (homónimos tipo *el capital* (dinero) / *la capital* (ciudad)). Usa el campo `translation` (hoy muerto) como glosa del sentido. Para el resto de las palabras en cajas 4–5, usar `judgment` o `article`.
- **Degradación elegante gratis:** fallar un formato avanzado baja la palabra a caja 0 (comportamiento SRS existente), con lo cual vuelve automáticamente al formato fácil. No hay que programar nada para esto.

### Implementación

Nuevo archivo `src/exercises.ts` (lógica pura, sin React, 100% testeable):

```ts
import { Noun } from './nouns';
import { SrsCardState } from './srs';

export type ExerciseKind = 'gender' | 'article' | 'judgment' | 'meaning';

export interface ExercisePrompt {
  kind: ExerciseKind;
  /** Texto principal de la tarjeta (p.ej. "mapa", "___ mapa", "la mapa"). */
  displayText: string;
  /** Línea secundaria opcional (glosa del sentido en `meaning`). */
  subText?: string;
  /** Labels de los rieles/botones. La UI los renderiza tal cual. */
  leftLabel: string;
  rightLabel: string;
  /** Validación uniforme: la UI solo informa "eligió izquierda/derecha". */
  leftIsCorrect: boolean;
  /** Para el reveal y el TTS: artículo correcto + palabra (p.ej. "el", "agua"). */
  reveal: { article: 'el' | 'la'; word: string };
}

/** Artículo correcto derivado del campo `example` ("El agua" -> "el"). */
export function correctArticle(noun: Noun): 'el' | 'la';

/** Mapea caja SRS -> formato, con variedad vía rng. Palabras no vistas: siempre 'gender'. */
export function chooseKind(noun: Noun, card: SrsCardState | undefined, rng: () => number): ExerciseKind;

export function buildExercise(noun: Noun, card: SrsCardState | undefined, rng: () => number): ExercisePrompt;
```

Reglas de `chooseKind` (con `rng: () => number` inyectado para testear):

- Sin card o caja 0–1 → `gender`.
- Caja 2 → 60% `article`, 40% `gender`.
- Caja 3 → 60% `article`, 40% `judgment`.
- Caja 4–5 → si el `rule` de la palabra es de significado → `meaning`; si no → 50% `judgment`, 50% `article`.

Integración en `useGameEngine`:

- Al elegir palabra nueva (`pickNextWord`), construir también el `ExercisePrompt` con `buildExercise` y guardarlo en estado.
- `handleAnswer` deja de recibir `'masculino' | 'femenino'` y pasa a recibir `'left' | 'right'`; correcto = `(side === 'left') === prompt.leftIsCorrect`. El resto (puntos, racha, `recordAnswer` del SRS) no cambia.
- `GenderRails` renderiza `prompt.leftLabel` / `prompt.rightLabel`. Los iconos Mars/Venus y las texturas se muestran solo cuando `kind` es `gender`/`article`/`meaning` (donde izquierda sigue siendo masculino/EL); en `judgment` usar check/cruz de lucide (`Check`, `X`) manteniendo el estilo monocromo.
- El swipe, el teclado (`A`/`←` = izquierda, `D`/`→` = derecha) y el reveal (regla + explicación + ejemplo) funcionan igual para todos los formatos, sin cambios.
- El puntaje puede permanecer igual (por dificultad de la palabra). Opcional simple: +5 extra si el formato no era `gender`.

Tests (`src/exercises.test.ts` y `src/srs.test.ts` con Vitest):

- `correctArticle`: casos normales y de a tónica (*el agua* siendo `gender: 'femenino'`).
- `chooseKind`: no vista → `gender`; cada caja produce solo los formatos permitidos (rng estubeado en distintos valores); homónimos en caja alta → `meaning`.
- `buildExercise`: `leftIsCorrect` consistente con el género/artículo para cada formato; `judgment` genera versión incorrecta con el artículo invertido.
- `srs.ts` (deuda de tests preexistente): promoción/democión de cajas, `isDue` por ronda y por reloj, `recordAnswer` conserva contadores.

**Commit:** `Fase 2: motor de ejercicios progresivos (artículo, juicio, significado) sobre la interacción binaria`

---

## Fase 3 — Pronunciación con Web Speech API (cero UI nuevo)

**Objetivo:** que el oído aprenda el género. Al revelar la respuesta, la app pronuncia **artículo + sustantivo** ("el libro", "la mesa") — que es como el género se adquiere de verdad.

Nuevo archivo `src/speech.ts`:

```ts
/** Pronuncia "el agua", "la mesa"… con voz es-ES/es-*. No-op silencioso si no hay soporte o voz. */
export function speakSpanish(text: string): void;
```

- Usar `window.speechSynthesis` + `SpeechSynthesisUtterance` con `lang: 'es-ES'`, `rate: 0.9`.
- Elegir voz: primera cuyo `lang` empiece con `es` (manejar carga async de `getVoices` con el evento `voiceschanged`). Si no hay ninguna voz `es*`, no hablar (mejor silencio que pronunciación inglesa).
- Cancelar (`speechSynthesis.cancel()`) antes de cada utterance para no encolar si el usuario va rápido.
- Llamarla desde `useGameEngine` en el momento del reveal con `${prompt.reveal.article} ${prompt.reveal.word}`, **solo si no está muteado** (mismo estado `genero_muted` que los tonos). Ningún botón ni setting nuevo.
- Sin dependencias nuevas; funciona offline en la mayoría de los dispositivos.

Verificación: en `npm run dev`, responder una palabra con sonido activado → se oye "el/la + palabra" tras el tono de feedback; con mute activado no se oye nada; en un navegador sin voces `es` no hay errores en consola.

**Commit:** `Fase 3: pronunciación de artículo + sustantivo con Web Speech API`

---

## Fase 4 — Progresión automática de dificultad

**Objetivo:** que el usuario que nunca toca el selector de dificultad progrese igual. Se elimina fricción; no se agrega nada visible.

- Nueva función en `src/srs.ts`:

```ts
/**
 * Pool activo de palabras. Parte del nivel elegido; cuando >=70% del nivel está
 * dominado (caja >= 3), mezcla gradualmente palabras del nivel siguiente
 * (proporción creciente con el % dominado, hasta ~30% del pool).
 */
export function getActivePool(allNouns: Noun[], state: SrsState, tier: 'fácil' | 'medio' | 'difícil'): Noun[];
```

- Orden de niveles: fácil → medio → difícil (difícil no mezcla nada más).
- `useGameEngine` pasa `getActivePool(...)` a `pickNextWord` en lugar del filtro plano por dificultad actual (`currentFilteredNouns`). El selector manual sigue funcionando como override: elegir "medio" a mano arranca ese pool desde cero, igual que hoy.
- **Micro-celebración sin modal:** la primera vez que el pool empieza a mezclar el nivel siguiente, mostrar un stamp breve sobre la tarjeta (reutilizar la animación CSS `stamp` existente) con el texto `NIVEL MEDIO DESBLOQUEADO` / `NIVEL DIFÍCIL DESBLOQUEADO`. Persistir que ya se mostró en una clave nueva `genero_unlocks` para no repetirlo.
- Cuidado con las métricas del footer: "En cola" y la barra de progreso deben calcularse sobre el pool activo para no mentir.

Tests: `getActivePool` con estado vacío devuelve solo el tier; con 70%+ dominado incluye palabras del siguiente; nunca incluye dos niveles arriba; `difícil` no mezcla.

**Commit:** `Fase 4: progresión automática de nivel con desbloqueo silencioso`

---

## Al desplegar

- Bump del `CACHE_NAME` en `public/sw.js` (p.ej. `genero-de-sustantivos-v5`) para que el service worker refresque los assets.

## Qué NO hacer (guardarraíles)

- **No** agregar menús, pantallas, tabs, routing ni selectores de modo. La app sigue siendo una pantalla + un overlay.
- **No** agregar backend, cuentas, analytics ni telemetría.
- **No** cambiar el sistema visual (monocromo brutalista, texturas en lugar de color para el género, sombras duras). Los formatos nuevos reutilizan los estilos existentes.
- **No** tocar el shape de `Noun` ni las claves de `localStorage` existentes (la única clave nueva permitida es `genero_unlocks`).
- **No** agregar dependencias de runtime. Vitest es la única dependencia nueva y es de desarrollo.
- **No** reescribir el SRS: el shape de `SrsState`/`SrsCardState` queda igual (la caja sigue midiendo dominio de la *palabra*, no del formato).

## Verificación final (después de la Fase 4)

1. `npx tsc --noEmit` y `npx vitest run` verdes.
2. `npm run build` sin errores.
3. Smoke test manual en `npm run dev` (móvil y desktop):
   - Responder por click en rieles, por swipe y por teclado en los cuatro formatos.
   - Palabra nueva siempre arranca en formato género; tras varias correctas aparece `___ palabra` (EL/LA); fallar la devuelve al formato simple.
   - *El agua* en formato artículo: la respuesta correcta es EL aunque la palabra sea femenina, y el reveal/pronunciación dicen "el agua".
   - Con sonido: se pronuncia "el/la + palabra" al revelar; con mute, silencio total.
   - Dominar ~70% de fácil hace aparecer palabras de medio y el stamp de desbloqueo (se puede simular editando `genero_srs_v1` en localStorage).
   - Diccionario, reset, cambio manual de dificultad y PWA offline siguen funcionando igual.

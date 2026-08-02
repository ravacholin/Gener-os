# Género de Sustantivos

Aplicación web (PWA) minimalista para practicar el género de los sustantivos en español.
Una sola pantalla, tres niveles de dificultad, repaso espaciado (Leitner) y una capa de
inteligencia de errores que detecta patrones de confusión y los trabaja hasta superarlos.

## Correr en local

**Requisitos:** Node.js

```bash
npm install
npm run dev
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo en el puerto 3000 |
| `npm run build` | Build de producción |
| `npm run preview` | Sirve el build |
| `npm run lint` | Typecheck (`tsc --noEmit`) |
| `npm test` | Suite de tests (Vitest) |

## Documentación

- `docs/PLAN_MEJORAS.md` — plan de mejoras por fases y guardarraíles del producto.
- `docs/INTELIGENCIA_DE_ERRORES.md` — cómo funciona el motor de patrones de error.

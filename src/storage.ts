/**
 * Acceso a localStorage que nunca lanza: en modo privado, con la cuota llena o con
 * el almacenamiento bloqueado, perder la persistencia no debe romper el juego.
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
}

export function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
}

/** Entero no negativo guardado como texto; cualquier otra cosa (null, NaN, negativo) da `fallback`. */
export function parseStoredInt(raw: string | null, fallback = 0): number {
  if (raw === null) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

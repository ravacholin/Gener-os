import { describe, expect, it } from 'vitest';
import { parseStoredInt, safeGetItem, safeSetItem } from './storage';

describe('parseStoredInt', () => {
  it('lee enteros válidos', () => {
    expect(parseStoredInt('42')).toBe(42);
    expect(parseStoredInt('0')).toBe(0);
  });

  it('devuelve el fallback ante valores corruptos', () => {
    expect(parseStoredInt(null)).toBe(0);
    expect(parseStoredInt('abc')).toBe(0);
    expect(parseStoredInt('NaN', 7)).toBe(7);
    expect(parseStoredInt('-5')).toBe(0);
  });
});

describe('acceso seguro a localStorage', () => {
  it('no lanza cuando localStorage no existe o falla', () => {
    // En el entorno de test (node) `localStorage` no está definido.
    expect(safeGetItem('x')).toBeNull();
    expect(() => safeSetItem('x', '1')).not.toThrow();
  });
});

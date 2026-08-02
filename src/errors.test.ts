/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { Noun, nounsData } from './nouns';
import {
  Attempt, emptyErrorsState, endingTrap, logAttempt, LOG_CAPACITY,
  MAX_LATENCY_MS, normalizeLatency, surfaceEnding, wilsonLower,
} from './errors';

const noun = (word: string): Noun => nounsData.find(n => n.word === word)!;

describe('surfaceEnding', () => {
  it('ignora el desambiguador entre paréntesis de los homónimos', () => {
    // Sin esto la terminación de los 41 homónimos del dataset sería ")".
    expect(surfaceEnding('Cometa (espacial)', 3)).toBe('eta');
    expect(surfaceEnding('Capital (dinero)', 1)).toBe('l');
  });

  it('normaliza a minúsculas y conserva las tildes', () => {
    expect(surfaceEnding('Día', 2)).toBe('ía');
    expect(surfaceEnding('LIBRO', 1)).toBe('o');
  });
});

describe('endingTrap', () => {
  it('detecta los masculinos que terminan en -a', () => {
    expect(endingTrap(noun('Problema'))).toBe('a-masculina');
    expect(endingTrap(noun('Mapa'))).toBe('a-masculina');
  });

  it('detecta los femeninos que terminan en -o', () => {
    expect(endingTrap(noun('Mano'))).toBe('o-femenina');
    expect(endingTrap(noun('Foto'))).toBe('o-femenina');
  });

  it('no marca las palabras que respetan su terminación', () => {
    expect(endingTrap(noun('Mesa'))).toBeNull();
    expect(endingTrap(noun('Libro'))).toBeNull();
    // "El agua" es femenina y termina en -a: la terminación no miente, miente el
    // artículo. Es una trampa distinta y se detecta por familia, no por terminación.
    expect(endingTrap(noun('Agua'))).toBeNull();
  });

  it('encuentra exactamente las trampas que tiene el dataset', () => {
    const traps = nounsData.filter(n => endingTrap(n));
    expect(traps.filter(n => endingTrap(n) === 'a-masculina')).toHaveLength(32);
    expect(traps.filter(n => endingTrap(n) === 'o-femenina').map(n => n.word).sort())
      .toEqual(['Foto', 'Mano', 'Moto', 'Radio']);
  });

  it('cuenta como trampa la acepción masculina de un homónimo en -a', () => {
    // Sale gratis de normalizar el paréntesis, y es correcto: "el cometa" termina
    // en -a y es masculino, exactamente el mismo tropiezo que "el problema".
    expect(endingTrap(noun('Cometa (espacial)'))).toBe('a-masculina');
    expect(endingTrap(noun('Cometa (juguete)'))).toBeNull();
  });

  it('todas las trampas viven en el nivel difícil', () => {
    // Consecuencia de diseño, no accidente: en nivel fácil no hay nada sutil que
    // diagnosticar y el motor sólo puede encontrar sesgo o palabras resistentes.
    expect(nounsData.filter(n => endingTrap(n)).every(n => n.difficulty === 'difícil')).toBe(true);
  });
});

describe('wilsonLower', () => {
  it('es 0 sin observaciones', () => {
    expect(wilsonLower(0, 0)).toBe(0);
  });

  it('castiga las muestras chicas', () => {
    // 3 de 4 es una tasa cruda del 75%, pero no alcanza para acusar a nadie.
    expect(wilsonLower(3, 4)).toBeLessThan(0.5);
    // La misma proporción con más volumen sí sostiene la acusación.
    expect(wilsonLower(30, 40)).toBeGreaterThan(0.65);
  });

  it('nunca supera la proporción observada', () => {
    for (let n = 1; n <= 40; n++) {
      for (let k = 0; k <= n; k++) {
        expect(wilsonLower(k, n)).toBeLessThanOrEqual(k / n + 1e-9);
      }
    }
  });

  it('crece con la evidencia a proporción constante', () => {
    expect(wilsonLower(2, 4)).toBeLessThan(wilsonLower(10, 20));
    expect(wilsonLower(10, 20)).toBeLessThan(wilsonLower(50, 100));
  });
});

describe('normalizeLatency', () => {
  it('descarta las latencias que no son una respuesta', () => {
    expect(normalizeLatency(MAX_LATENCY_MS + 1)).toBeNull();
    expect(normalizeLatency(null)).toBeNull();
    expect(normalizeLatency(-5)).toBeNull();
    expect(normalizeLatency(NaN)).toBeNull();
  });

  it('redondea las válidas', () => {
    expect(normalizeLatency(1234.6)).toBe(1235);
  });
});

describe('logAttempt', () => {
  const attempt = (i: number): Attempt => ({ w: `w${i}`, f: 0, k: 1, l: 500, b: 0, t: i });

  it('acumula en orden cronológico', () => {
    let state = emptyErrorsState();
    state = logAttempt(state, attempt(1));
    state = logAttempt(state, attempt(2));
    expect(state.log.map(a => a.t)).toEqual([1, 2]);
  });

  it('recorta al límite descartando lo más viejo', () => {
    let state = emptyErrorsState();
    for (let i = 0; i < LOG_CAPACITY + 50; i++) state = logAttempt(state, attempt(i));
    expect(state.log).toHaveLength(LOG_CAPACITY);
    expect(state.log[0].t).toBe(50);
  });
});

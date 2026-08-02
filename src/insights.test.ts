/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { nounsData } from './nouns';
import {
  CONTRAST_FAMILY, FAMILIES, FAMILY_BY_RULE, FAMILY_INSIGHT,
  familyOf, MIXED_GENDER_FAMILIES,
} from './insights';

describe('taxonomía de familias', () => {
  it('clasifica explícitamente todas las reglas del dataset', () => {
    // Es el test que importa: si alguien agrega una palabra con una regla nueva,
    // acá se entera de que tiene que decidir en qué familia va, en vez de caer
    // silenciosamente en la heurística de emergencia.
    const sinClasificar = [...new Set(nounsData.map(n => n.rule))].filter(r => !(r in FAMILY_BY_RULE));
    expect(sinClasificar).toEqual([]);
  });

  it('le da una familia conocida a los 478 sustantivos', () => {
    for (const noun of nounsData) {
      expect(FAMILIES, `${noun.word} (${noun.rule})`).toContain(familyOf(noun));
    }
  });

  it('agrupa los helenismos en -ma y las excepciones en -a bajo la misma familia', () => {
    // Para el que aprende, "el problema" y "el día" son el mismo hecho: termina en
    // -a y es masculino. Que uno venga del griego es irrelevante para corregirlo.
    expect(familyOf(nounsData.find(n => n.word === 'Problema')!)).toBe('masculino-en-a');
    expect(familyOf(nounsData.find(n => n.word === 'Día')!)).toBe('masculino-en-a');
    expect(familyOf(nounsData.find(n => n.word === 'Mapa')!)).toBe('masculino-en-a');
  });

  it('separa la a tónica de las femeninas en -a corrientes', () => {
    expect(familyOf(nounsData.find(n => n.word === 'Agua')!)).toBe('a-tonica');
    expect(familyOf(nounsData.find(n => n.word === 'Mesa')!)).toBe('estandar-a');
  });

  it('tiene copy para cada familia', () => {
    for (const family of FAMILIES) {
      expect(FAMILY_INSIGHT[family].label.length).toBeGreaterThan(0);
      expect(FAMILY_INSIGHT[family].tip.length).toBeGreaterThan(0);
    }
  });
});

describe('contraste', () => {
  it('las familias marcadas como mixtas contienen los dos géneros', () => {
    for (const family of MIXED_GENDER_FAMILIES) {
      const words = nounsData.filter(n => familyOf(n) === family);
      expect(words.some(n => n.gender === 'masculino'), family).toBe(true);
      expect(words.some(n => n.gender === 'femenino'), family).toBe(true);
    }
  });

  it('toda familia de un solo género tiene contraste declarado', () => {
    for (const family of FAMILIES) {
      if (MIXED_GENDER_FAMILIES.includes(family)) continue;
      expect(CONTRAST_FAMILY[family], `${family} sin contraste`).toBeDefined();
    }
  });

  it('contrasta la a tónica contra los masculinos en -a', () => {
    // Las dos llevan "el" y sin embargo el género es opuesto: es el par que
    // desarma el error de oído, y por eso no se contrasta contra "la mesa".
    expect(CONTRAST_FAMILY['a-tonica']).toBe('masculino-en-a');
  });
});

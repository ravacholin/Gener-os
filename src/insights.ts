/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Datos de la inteligencia de errores: cómo se agrupan las reglas del dataset en
 * familias, qué se le dice al usuario sobre cada una y contra qué familia hay que
 * contrastarla para que aprenda a discriminar.
 *
 * Todo lo de acá son datos, no lógica. La lógica vive en `errors.ts` (detección) y
 * `remediation.ts` (intervención).
 */

import { Noun } from './nouns';

/**
 * Las 48 `rule` del dataset son demasiado finas para inferir nada: veinte de ellas
 * tienen una sola palabra, y con una palabra no hay patrón que valga. Estas doce
 * familias agrupan las reglas por el mecanismo lingüístico que comparten, que es lo
 * que un hablante aprende (o no aprende) de una vez.
 */
export type Family =
  | 'estandar-o'
  | 'estandar-a'
  | 'masculino-en-a'
  | 'e-ambigua'
  | 'sufijo-femenino'
  | 'sufijo-masculino'
  | 'sis'
  | 'a-tonica'
  | 'homonimo'
  | 'consonante'
  | 'excepcion'
  | 'semantico';

export const FAMILIES: Family[] = [
  'estandar-o', 'estandar-a', 'masculino-en-a', 'e-ambigua',
  'sufijo-femenino', 'sufijo-masculino', 'sis', 'a-tonica',
  'homonimo', 'consonante', 'excepcion', 'semantico',
];

/**
 * Mapa explícito regla → familia. Cubre las 48 reglas que existen hoy en
 * `nouns.ts`; un test recorre el dataset entero y falla si aparece una regla nueva
 * sin clasificar, así agregar palabras obliga a decidir dónde va su regla.
 */
export const FAMILY_BY_RULE: Record<string, Family> = {
  // Las dos terminaciones canónicas: el 47% del dataset.
  'Terminación estándar -o': 'estandar-o',
  'Terminación estándar -a': 'estandar-a',

  // Masculinos que terminan en -a. Casi todos son helenismos en -ma; el resto son
  // excepciones sueltas (día). Es la trampa central del español.
  'Origen Griego (-ma)': 'masculino-en-a',
  'Origen Griego (-ta)': 'masculino-en-a',
  'Origen Griego (-pa)': 'masculino-en-a',
  'Terminación en -a (Excepción Masculina)': 'masculino-en-a',

  // -e no informa género: hay que saberse la palabra. Las dos reglas van juntas
  // justamente porque el contraste entre ellas es la lección.
  'Terminación en -e (Femenino)': 'e-ambigua',
  'Terminación en -e (Masculino)': 'e-ambigua',

  // Sufijos que sí predicen género de forma fiable.
  'Terminación en -dad': 'sufijo-femenino',
  'Terminación en -tad': 'sufijo-femenino',
  'Terminación en -tud': 'sufijo-femenino',
  'Terminación en -ción': 'sufijo-femenino',
  'Terminación en -sión': 'sufijo-femenino',
  'Sufijo -umbre': 'sufijo-femenino',
  'Terminación en -or (Masculino)': 'sufijo-masculino',
  'Terminación en -aje': 'sufijo-masculino',
  'Terminación en -ón (Masculino)': 'sufijo-masculino',

  // -sis se reparte: los cultismos griegos de ciencia son femeninos (la crisis) y
  // los de análisis/paréntesis masculinos. Familia propia porque el contraste es interno.
  'Terminación en -sis (Femenino)': 'sis',
  'Terminación en -sis (Masculino)': 'sis',

  // Femeninas que llevan "el" por la a tónica inicial. Suenan masculinas: familia aparte.
  'A tónica inicial': 'a-tonica',
  'A tónica inicial (El agua / Las aguas)': 'a-tonica',

  // La forma no dice nada; el género lo fija la acepción.
  'Homónimo / Significado': 'homonimo',
  'Polisemia': 'homonimo',
  'Abreviación / Polisemia': 'homonimo',

  // Terminaciones consonánticas: cada una tiene su tendencia y sus excepciones.
  'Terminación en consonante -l': 'consonante',
  'Terminación en -l (Excepción)': 'consonante',
  'Terminación en consonante -r': 'consonante',
  'Terminación en consonante -n': 'consonante',
  'Terminación en -z': 'consonante',
  'Terminación en -z (Excepción Masculina)': 'consonante',
  'Terminación en -d': 'consonante',
  'Terminación en -d (Excepción)': 'consonante',
  'Terminación en -s (Masculino)': 'consonante',
  'Terminación en -y': 'consonante',
  'Terminación en -j': 'consonante',
  'Monosílabo en consonante': 'consonante',

  // Irregulares que no forman grupo con nadie.
  'Terminación en -or (Excepción)': 'excepcion',
  'Terminación en -o (Excepción Femenina)': 'excepcion',
  'Terminación en -u (Excepción)': 'excepcion',
  'Abreviación Femenina': 'excepcion',
  'Género vacilante (RAE prefiere femenino)': 'excepcion',
  'Monosílabo / Palabra corta': 'excepcion',

  // El género lo decide el referente, no la forma.
  'Persona masculina': 'semantico',
  'Persona femenina': 'semantico',
  'Filiación masculina': 'semantico',
  'Filiación femenina': 'semantico',
  'Terminación en -r (Profesión)': 'semantico',
  'Nombre de planta (Femenino)': 'semantico',
};

/**
 * Red de contención para reglas que se agreguen al dataset sin pasar por el mapa.
 * No pretende ser buena: sólo evita que una palabra quede sin familia y rompa las
 * cuentas. El test del dataset es el que garantiza que esto no se use en la práctica.
 */
function guessFamily(rule: string, noun: Noun): Family {
  const r = rule.toLowerCase();
  if (r.includes('griego') || r.includes('excepción masculina')) return 'masculino-en-a';
  if (r.includes('tónica')) return 'a-tonica';
  if (r.includes('homónimo') || r.includes('polisemia') || r.includes('significado')) return 'homonimo';
  if (r.includes('-sis')) return 'sis';
  if (r.includes('-e (')) return 'e-ambigua';
  if (r.includes('persona') || r.includes('filiación') || r.includes('profesión')) return 'semantico';
  if (r.includes('excepción') || r.includes('vacilante')) return 'excepcion';
  if (r.includes('estándar -o')) return 'estandar-o';
  if (r.includes('estándar -a')) return 'estandar-a';
  if (/-(dad|tad|tud|ción|sión|umbre)/.test(r)) return 'sufijo-femenino';
  if (/-(or|aje|ón)/.test(r)) return 'sufijo-masculino';
  return /[aeiouáéíóú]$/i.test(noun.word) ? 'excepcion' : 'consonante';
}

/** Familia lingüística de un sustantivo, derivada de su regla. */
export function familyOf(noun: Noun): Family {
  return FAMILY_BY_RULE[noun.rule] ?? guessFamily(noun.rule, noun);
}

export interface FamilyInsight {
  /** Nombre corto de la familia. Se usa en el panel, en el stamp y en la micro-lección. */
  label: string;
  /** La regla en una línea. Es lo que el usuario necesita recordar. */
  tip: string;
  /** Palabras testigo con su artículo, para anclar la regla. */
  examples: string[];
}

export const FAMILY_INSIGHT: Record<Family, FamilyInsight> = {
  'estandar-o': {
    label: 'Terminación -o',
    tip: 'Casi todos los sustantivos en -o son masculinos.',
    examples: ['el libro', 'el vaso', 'el techo'],
  },
  'estandar-a': {
    label: 'Terminación -a',
    tip: 'Casi todos los sustantivos en -a son femeninos.',
    examples: ['la mesa', 'la casa', 'la silla'],
  },
  'masculino-en-a': {
    label: 'Masculinos en -a',
    tip: 'Los sustantivos griegos en -ma son masculinos aunque terminen en -a.',
    examples: ['el problema', 'el tema', 'el idioma'],
  },
  'e-ambigua': {
    label: 'Terminación -e',
    tip: 'La -e no dice el género: hay que aprender cada palabra con su artículo.',
    examples: ['el puente', 'la llave', 'el coche'],
  },
  'sufijo-femenino': {
    label: 'Sufijos femeninos',
    tip: '-ción, -sión, -dad, -tad, -tud y -umbre son siempre femeninos.',
    examples: ['la canción', 'la ciudad', 'la costumbre'],
  },
  'sufijo-masculino': {
    label: 'Sufijos masculinos',
    tip: '-or, -aje y -ón son masculinos.',
    examples: ['el amor', 'el viaje', 'el corazón'],
  },
  'sis': {
    label: 'Terminación -sis',
    tip: '-sis es femenino en las palabras de ciencia y estado, masculino en las de análisis.',
    examples: ['la crisis', 'el análisis', 'la tesis'],
  },
  'a-tonica': {
    label: 'A tónica',
    tip: 'Llevan "el" para evitar la cacofonía, pero son femeninas: el agua fría.',
    examples: ['el agua', 'el águila', 'el alma'],
  },
  'homonimo': {
    label: 'Homónimos',
    tip: 'La misma palabra cambia de significado según el artículo.',
    examples: ['el capital / la capital', 'el orden / la orden'],
  },
  'consonante': {
    label: 'Final en consonante',
    tip: 'La consonante final marca tendencia, no certeza: -l y -r tiran a masculino, -d y -z a femenino.',
    examples: ['el árbol', 'la sal', 'la pared'],
  },
  'excepcion': {
    label: 'Irregulares',
    tip: 'No siguen ninguna regla: se aprenden de memoria.',
    examples: ['la mano', 'la foto', 'la flor'],
  },
  'semantico': {
    label: 'Género por significado',
    tip: 'El género lo decide a quién nombran, no cómo terminan.',
    examples: ['el rey', 'la niña', 'el hermano'],
  },
};

/**
 * Familias que contienen los dos géneros. En ellas el mejor contraste es interno:
 * misma terminación, género opuesto (el puente / la llave). No hace falta salir de
 * la familia para armar el par mínimo.
 */
export const MIXED_GENDER_FAMILIES: Family[] = ['e-ambigua', 'sis', 'consonante', 'homonimo', 'semantico', 'excepcion'];

/**
 * Contra qué familia contrastar cada familia de un solo género. La elección no es
 * decorativa: es la que hace visible la distinción que el usuario no está haciendo.
 *
 * - `masculino-en-a` contra `estandar-a`: misma terminación, géneros opuestos.
 * - `a-tonica` contra `masculino-en-a`: las dos llevan "el" y sin embargo una es
 *   femenina y la otra masculina. Es el contraste que desarma el error de oído.
 * - `estandar-o` contra `excepcion`: el libro frente a la mano.
 * - Los sufijos, uno contra otro.
 */
export const CONTRAST_FAMILY: Partial<Record<Family, Family>> = {
  'masculino-en-a': 'estandar-a',
  'estandar-a': 'masculino-en-a',
  'a-tonica': 'masculino-en-a',
  'estandar-o': 'excepcion',
  'sufijo-femenino': 'sufijo-masculino',
  'sufijo-masculino': 'sufijo-femenino',
};

/** Copy de los patrones que no son de familia. */
export const TRAP_INSIGHT: Record<'a-masculina' | 'o-femenina' | 'a-tonica', FamilyInsight> = {
  'a-masculina': {
    label: 'Termina en -a pero es masculino',
    tip: 'La terminación te está mintiendo: mirá el origen de la palabra, no su final.',
    examples: ['el problema', 'el planeta', 'el día'],
  },
  'o-femenina': {
    label: 'Termina en -o pero es femenino',
    tip: 'Son cuatro y hay que sabérselas: casi todas son abreviaciones de una palabra femenina.',
    examples: ['la mano', 'la foto', 'la moto'],
  },
  'a-tonica': {
    label: 'Lleva "el" pero es femenino',
    tip: 'El artículo "el" delante de a tónica es fonético, no de género: el agua clara.',
    examples: ['el agua', 'el hacha', 'el aula'],
  },
};

export const BIAS_INSIGHT: Record<'falso-masculino' | 'falso-femenino', FamilyInsight> = {
  'falso-masculino': {
    label: 'Sesgo hacia masculino',
    tip: 'Cuando dudás elegís masculino. Frená medio segundo y buscá la terminación antes de responder.',
    examples: [],
  },
  'falso-femenino': {
    label: 'Sesgo hacia femenino',
    tip: 'Cuando dudás elegís femenino. Frená medio segundo y buscá la terminación antes de responder.',
    examples: [],
  },
};

export const SPEED_INSIGHT: Record<'impulsivo' | 'fragil', FamilyInsight> = {
  'impulsivo': {
    label: 'Respuestas impulsivas',
    tip: 'Estás fallando en menos de un segundo: no llegás a leer la palabra entera.',
    examples: [],
  },
  'fragil': {
    label: 'Acertás pero dudando',
    tip: 'Las acertás, pero tardando: la regla la sabés, todavía no la automatizaste.',
    examples: [],
  },
};

export const LEECH_INSIGHT: FamilyInsight = {
  label: 'Palabras que se te resisten',
  tip: 'Las fallaste varias veces o las olvidaste después de dominarlas.',
  examples: [],
};

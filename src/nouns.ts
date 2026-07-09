/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Noun {
  word: string;
  gender: 'masculino' | 'femenino';
  difficulty: 'fácil' | 'medio' | 'difícil';
  translation: string;
  rule: string;
  explanation: string;
  example: string;
}

export const nounsData: Noun[] = [
  // --- FÁCIL (Easy): Ending in -o (M) and -a (F) ---
  {
    word: "Libro",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Book",
    rule: "Terminación estándar -o",
    explanation: "La gran mayoría de los sustantivos que terminan en -o son masculinos.",
    example: "El libro"
  },
  {
    word: "Mesa",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Table",
    rule: "Terminación estándar -a",
    explanation: "La gran mayoría de los sustantivos que terminan en -a son femeninos.",
    example: "La mesa"
  },
  {
    word: "Perro",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Dog",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo masculino estándar que termina en -o y refiere a un animal masculino o especie en general.",
    example: "El perro"
  },
  {
    word: "Gato",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Cat",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El gato"
  },
  {
    word: "Gata",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Female cat",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar femenino acabado en -a.",
    example: "La gata"
  },
  {
    word: "Casa",
    gender: "femenino",
    difficulty: "fácil",
    translation: "House",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La casa"
  },
  {
    word: "Puerta",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Door",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La puerta"
  },
  {
    word: "Ventana",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Window",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La ventana"
  },
  {
    word: "Sombrero",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Hat",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El sombrero"
  },
  {
    word: "Vaso",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Glass",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El vaso"
  },
  {
    word: "Carta",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Letter",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La carta"
  },
  {
    word: "Manzana",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Apple",
    rule: "Terminación estándar -a",
    explanation: "Frutas que terminan en -a suelen ser femeninas.",
    example: "La manzana"
  },
  {
    word: "Zapato",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Shoe",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El zapato"
  },
  {
    word: "Silla",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Chair",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La silla"
  },
  {
    word: "Niño",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Boy",
    rule: "Persona masculina",
    explanation: "Personas de sexo masculino terminan generalmente en -o y toman artículo masculino.",
    example: "El niño"
  },
  {
    word: "Niña",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Girl",
    rule: "Persona femenina",
    explanation: "Personas de sexo femenino terminan en -a y toman artículo femenino.",
    example: "La niña"
  },
  {
    word: "Teléfono",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Phone",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El teléfono"
  },
  {
    word: "Plato",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Plate",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El plato"
  },
  {
    word: "Cuchara",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Spoon",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La cuchara"
  },
  {
    word: "Hermano",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Brother",
    rule: "Filiación masculina",
    explanation: "Miembro masculino de la familia.",
    example: "El hermano"
  },
  {
    word: "Hermana",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Sister",
    rule: "Filiación femenina",
    explanation: "Miembro femenino de la familia.",
    example: "La hermana"
  },
  {
    word: "Pelo",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Hair",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El pelo"
  },
  {
    word: "Plátano",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Banana",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El plátano"
  },
  {
    word: "Pelota",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Ball",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La pelota"
  },
  {
    word: "Bolígrafo",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Pen",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El bolígrafo"
  },
  {
    word: "Camisa",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Shirt",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La camisa"
  },
  {
    word: "Falda",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Skirt",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La falda"
  },
  {
    word: "Cuaderno",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Notebook",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El cuaderno"
  },
  {
    word: "Moqueta",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Carpet",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La moqueta"
  },
  {
    word: "Espejo",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Mirror",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El espejo"
  },
  {
    word: "Maleta",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Suitcase",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La maleta"
  },
  {
    word: "Queso",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Cheese",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El queso"
  },
  {
    word: "Mantequilla",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Butter",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La mantequilla"
  },
  {
    word: "Periódico",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Newspaper",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El periódico"
  },
  {
    word: "Revista",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Magazine",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La revista"
  },
  {
    word: "Viento",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Wind",
    rule: "Terminación estándar -o",
    explanation: "Fenómenos meteorológicos terminados en -o son masculinos.",
    example: "El viento"
  },
  {
    word: "Lluvia",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Rain",
    rule: "Terminación estándar -a",
    explanation: "Fenómenos meteorológicos terminados en -a son femeninos.",
    example: "La lluvia"
  },
  {
    word: "Fuego",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Fire",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El fuego"
  },
  {
    word: "Piedra",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Stone",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La piedra"
  },
  {
    word: "Teclado",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Keyboard",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El teclado"
  },
  {
    word: "Pantalla",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Screen",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La pantalla"
  },
  {
    word: "Pájaro",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Bird",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El pájaro"
  },
  {
    word: "Pluma",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Feather / Pen",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La pluma"
  },
  {
    word: "Regalo",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Gift",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El regalo"
  },
  {
    word: "Sorpresa",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Surprise",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La sorpresa"
  },
  {
    word: "Almohada",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Pillow",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo árabe terminado en -a, es femenino.",
    example: "La almohada"
  },
  {
    word: "Gorro",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Beanie / Cap",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El gorro"
  },
  {
    word: "Estrella",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Star",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La estrella"
  },
  {
    word: "Cielo",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Sky",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El cielo"
  },
  {
    word: "Sopa",
    gender: "femenino",
    difficulty: "fácil",
    translation: "Soup",
    rule: "Terminación estándar -a",
    explanation: "Sustantivo estándar que termina en -a.",
    example: "La sopa"
  },

  // --- MEDIO (Medium): Words ending in -e, -l, -r, -z, -d, -n, -s or abstract ---
  {
    word: "Gente",
    gender: "femenino",
    difficulty: "medio",
    translation: "People",
    rule: "Terminación en -e (Femenino)",
    explanation: "Las palabras acabadas en -e pueden ser masculinas o femeninas. 'Gente' siempre es femenino singular.",
    example: "La gente"
  },
  {
    word: "Árbol",
    gender: "masculino",
    difficulty: "medio",
    translation: "Tree",
    rule: "Terminación en consonante -l",
    explanation: "Los sustantivos acabados en -l suelen ser masculinos (el árbol, el papel, el sol).",
    example: "El árbol"
  },
  {
    word: "Canción",
    gender: "femenino",
    difficulty: "medio",
    translation: "Song",
    rule: "Terminación en -ción",
    explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.",
    example: "La canción"
  },
  {
    word: "Doctor",
    gender: "masculino",
    difficulty: "medio",
    translation: "Doctor",
    rule: "Terminación en -r (Profesión)",
    explanation: "Sustantivo masculino terminado en -r que designa una profesión masculina.",
    example: "El doctor"
  },
  {
    word: "Ciudad",
    gender: "femenino",
    difficulty: "medio",
    translation: "City",
    rule: "Terminación en -dad",
    explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.",
    example: "La ciudad"
  },
  {
    word: "Luz",
    gender: "femenino",
    difficulty: "medio",
    translation: "Light",
    rule: "Terminación en -z",
    explanation: "Muchas palabras que terminan en -z son femeninas (la luz, la paz, la voz, la vejez).",
    example: "La luz"
  },
  {
    word: "Leche",
    gender: "femenino",
    difficulty: "medio",
    translation: "Milk",
    rule: "Terminación en -e (Femenino)",
    explanation: "'Leche' es un sustantivo femenino en español, a diferencia de otros idiomas romances (como el francés o el italiano donde es masculino).",
    example: "La leche"
  },
  {
    word: "Clase",
    gender: "femenino",
    difficulty: "medio",
    translation: "Class",
    rule: "Terminación en -e (Femenino)",
    explanation: "'Clase' termina en -e y es femenina.",
    example: "La clase"
  },
  {
    word: "Papel",
    gender: "masculino",
    difficulty: "medio",
    translation: "Paper",
    rule: "Terminación en consonante -l",
    explanation: "Los sustantivos acabados en -l suelen ser masculinos.",
    example: "El papel"
  },
  {
    word: "Nieve",
    gender: "femenino",
    difficulty: "medio",
    translation: "Snow",
    rule: "Terminación en -e (Femenino)",
    explanation: "Sustantivo acabado en -e de género femenino.",
    example: "La nieve"
  },
  {
    word: "Puente",
    gender: "masculino",
    difficulty: "medio",
    translation: "Bridge",
    rule: "Terminación en -e (Masculino)",
    explanation: "'Puente' termina en -e y es de género masculino.",
    example: "El puente"
  },
  {
    word: "Calor",
    gender: "masculino",
    difficulty: "medio",
    translation: "Heat",
    rule: "Terminación en -or (Masculino)",
    explanation: "Las palabras terminadas en -or suelen ser masculinas (el calor, el dolor, el amor). Nota: En algunas zonas costeras o dialectos antiguos se usa 'la calor', pero la RAE prefiere el masculino.",
    example: "El calor"
  },
  {
    word: "Sal",
    gender: "femenino",
    difficulty: "medio",
    translation: "Salt",
    rule: "Monosílabo en consonante",
    explanation: "'Sal' es una excepción común, es un sustantivo femenino.",
    example: "La sal"
  },
  {
    word: "Llave",
    gender: "femenino",
    difficulty: "medio",
    translation: "Key",
    rule: "Terminación en -e (Femenino)",
    explanation: "Palabra terminada en -e de género femenino.",
    example: "La llave"
  },
  {
    word: "Flor",
    gender: "femenino",
    difficulty: "medio",
    translation: "Flower",
    rule: "Terminación en -or (Excepción)",
    explanation: "A diferencia de la mayoría de palabras en -or (que son masculinas), 'flor' es femenina.",
    example: "La flor"
  },
  {
    word: "Reloj",
    gender: "masculino",
    difficulty: "medio",
    translation: "Watch / Clock",
    rule: "Terminación en -j",
    explanation: "Palabras que terminan en -j son masculinas.",
    example: "El reloj"
  },
  {
    word: "Sol",
    gender: "masculino",
    difficulty: "medio",
    translation: "Sun",
    rule: "Terminación en consonante -l",
    explanation: "Los astros masculinos y palabras terminadas en -l suelen ser masculinos.",
    example: "El sol"
  },
  {
    word: "Paz",
    gender: "femenino",
    difficulty: "medio",
    translation: "Peace",
    rule: "Terminación en -z",
    explanation: "Los sustantivos abstractos en -z son femeninos.",
    example: "La paz"
  },
  {
    word: "Voz",
    gender: "femenino",
    difficulty: "medio",
    translation: "Voice",
    rule: "Terminación en -z",
    explanation: "'Voz' es un sustantivo femenino terminado en -z.",
    example: "La voz"
  },
  {
    word: "Dolor",
    gender: "masculino",
    difficulty: "medio",
    translation: "Pain",
    rule: "Terminación en -or (Masculino)",
    explanation: "La mayoría de las palabras en -or son masculinas (el dolor, el color, el olor).",
    example: "El dolor"
  },
  {
    word: "Color",
    gender: "masculino",
    difficulty: "medio",
    translation: "Color",
    rule: "Terminación en -or (Masculino)",
    explanation: "Sustantivo masculino terminado en -or.",
    example: "El color"
  },
  {
    word: "Pared",
    gender: "femenino",
    difficulty: "medio",
    translation: "Wall",
    rule: "Terminación en -d",
    explanation: "Muchas palabras que terminan en -d son femeninas (la pared, la red, la verdad).",
    example: "La pared"
  },
  {
    word: "Red",
    gender: "femenino",
    difficulty: "medio",
    translation: "Net / Network",
    rule: "Terminación en -d",
    explanation: "Sustantivo femenino terminado en -d.",
    example: "La red"
  },
  {
    word: "Verdad",
    gender: "femenino",
    difficulty: "medio",
    translation: "Truth",
    rule: "Terminación en -dad",
    explanation: "Sustantivos abstractos terminados en -dad son femeninos.",
    example: "La verdad"
  },
  {
    word: "Juventud",
    gender: "femenino",
    difficulty: "medio",
    translation: "Youth",
    rule: "Terminación en -tud",
    explanation: "Sustantivos abstractos terminados en -tud son femeninos.",
    example: "La juventud"
  },
  {
    word: "Libertad",
    gender: "femenino",
    difficulty: "medio",
    translation: "Freedom",
    rule: "Terminación en -tad",
    explanation: "Sustantivos abstractos acabados en -tad son femeninos.",
    example: "La libertad"
  },
  {
    word: "Coche",
    gender: "masculino",
    difficulty: "medio",
    translation: "Car",
    rule: "Terminación en -e (Masculino)",
    explanation: "Muchos nombres de transportes terminados en -e son masculinos (el coche, el tren -consonante, el viaje).",
    example: "El coche"
  },
  {
    word: "Viaje",
    gender: "masculino",
    difficulty: "medio",
    translation: "Trip",
    rule: "Terminación en -aje",
    explanation: "Todos los sustantivos que terminan en -aje son masculinos (el viaje, el equipaje, el mensaje).",
    example: "El viaje"
  },
  {
    word: "Equipaje",
    gender: "masculino",
    difficulty: "medio",
    translation: "Luggage",
    rule: "Terminación en -aje",
    explanation: "Palabras acabadas en -aje son siempre masculinas.",
    example: "El equipaje"
  },
  {
    word: "Mensaje",
    gender: "masculino",
    difficulty: "medio",
    translation: "Message",
    rule: "Terminación en -aje",
    explanation: "Palabras acabadas en -aje son masculinas.",
    example: "El mensaje"
  },
  {
    word: "País",
    gender: "masculino",
    difficulty: "medio",
    translation: "Country",
    rule: "Terminación en -s (Masculino)",
    explanation: "Sustantivos agudos terminados en -s suelen ser masculinos.",
    example: "El país"
  },
  {
    word: "Televisión",
    gender: "femenino",
    difficulty: "medio",
    translation: "Television",
    rule: "Terminación en -sión",
    explanation: "Los sustantivos acabados en -sión son femeninos.",
    example: "La televisión"
  },
  {
    word: "Decisión",
    gender: "femenino",
    difficulty: "medio",
    translation: "Decision",
    rule: "Terminación en -sión",
    explanation: "Sustantivo abstracto femenino en -sión.",
    example: "La decisión"
  },
  {
    word: "Noche",
    gender: "femenino",
    difficulty: "medio",
    translation: "Night",
    rule: "Terminación en -e (Femenino)",
    explanation: "'Noche' es un sustantivo femenino, a diferencia de 'día' que es masculino.",
    example: "La noche"
  },
  {
    word: "Tarde",
    gender: "femenino",
    difficulty: "medio",
    translation: "Afternoon",
    rule: "Terminación en -e (Femenino)",
    explanation: "Las partes del día suelen ser femeninas (la tarde, la noche) excepto el mediodía, el amanecer, el día.",
    example: "La tarde"
  },
  {
    word: "Diente",
    gender: "masculino",
    difficulty: "medio",
    translation: "Tooth",
    rule: "Terminación en -e (Masculino)",
    explanation: "'Diente' termina en -e y es masculino.",
    example: "El diente"
  },
  {
    word: "Pan",
    gender: "masculino",
    difficulty: "medio",
    translation: "Bread",
    rule: "Terminación en consonante -n",
    explanation: "Monosílabos en consonante -n suelen ser masculinos.",
    example: "El pan"
  },
  {
    word: "Piel",
    gender: "femenino",
    difficulty: "medio",
    translation: "Skin",
    rule: "Terminación en -l (Excepción)",
    explanation: "Aunque la mayoría de palabras en -l son masculinas, 'piel' es una importante excepción femenina.",
    example: "La piel"
  },
  {
    word: "Hiel",
    gender: "femenino",
    difficulty: "medio",
    translation: "Bile / Gall",
    rule: "Terminación en -l (Excepción)",
    explanation: "'Hiel' es femenina, al igual que 'piel' y 'miel'.",
    example: "La hiel"
  },
  {
    word: "Miel",
    gender: "femenino",
    difficulty: "medio",
    translation: "Honey",
    rule: "Terminación en -l (Excepción)",
    explanation: "'Miel' es una excepción femenina entre los sustantivos acabados en -l.",
    example: "La miel"
  },
  {
    word: "Cárcel",
    gender: "femenino",
    difficulty: "medio",
    translation: "Jail / Prison",
    rule: "Terminación en -l (Excepción)",
    explanation: "La palabra 'cárcel' es femenina a pesar de terminar en -l.",
    example: "La cárcel"
  },
  {
    word: "Ley",
    gender: "femenino",
    difficulty: "medio",
    translation: "Law",
    rule: "Terminación en -y",
    explanation: "'Ley' es femenina.",
    example: "La ley"
  },
  {
    word: "Rey",
    gender: "masculino",
    difficulty: "medio",
    translation: "King",
    rule: "Persona masculina",
    explanation: "Se refiere a una dignidad masculina, por lo tanto es masculino.",
    example: "El rey"
  },
  {
    word: "Juguete",
    gender: "masculino",
    difficulty: "medio",
    translation: "Toy",
    rule: "Terminación en -e (Masculino)",
    explanation: "Sustantivo masculino acabado en -e.",
    example: "El juguete"
  },
  {
    word: "Perfume",
    gender: "masculino",
    difficulty: "medio",
    translation: "Perfume",
    rule: "Terminación en -e (Masculino)",
    explanation: "'Perfume' es masculino en español.",
    example: "El perfume"
  },
  {
    word: "Sangre",
    gender: "femenino",
    difficulty: "medio",
    translation: "Blood",
    rule: "Terminación en -e (Femenino)",
    explanation: "'Sangre' es un sustantivo femenino.",
    example: "La sangre"
  },
  {
    word: "Frase",
    gender: "femenino",
    difficulty: "medio",
    translation: "Sentence / Phrase",
    rule: "Terminación en -e (Femenino)",
    explanation: "Sustantivo femenino que termina en -e.",
    example: "La frase"
  },
  {
    word: "Vinagre",
    gender: "masculino",
    difficulty: "medio",
    translation: "Vinegar",
    rule: "Terminación en -e (Masculino)",
    explanation: "A diferencia de la sangre, 'vinagre' es masculino.",
    example: "El vinagre"
  },
  {
    word: "Gripe",
    gender: "femenino",
    difficulty: "medio",
    translation: "Flu / Influenza",
    rule: "Terminación en -e (Femenino)",
    explanation: "'Gripe' es un sustantivo femenino.",
    example: "La gripe"
  },
  {
    word: "Césped",
    gender: "masculino",
    difficulty: "medio",
    translation: "Lawn / Grass",
    rule: "Terminación en -d (Excepción)",
    explanation: "A diferencia de la mayoría de palabras acabadas en -d (que son femeninas como 'pared' o 'ciudad'), 'césped' es masculino.",
    example: "El césped"
  },

  // --- DIFÍCIL (Hard): Special cases, Greek -ma, stressed a-, feminine -o, masculine -a, deceptive endings ---
  {
    word: "Problema",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Problem",
    rule: "Origen Griego (-ma)",
    explanation: "Sustantivos de origen griego que terminan en -ma, -pa, o -ta son tradicionalmente masculinos (el problema, el tema, el mapa).",
    example: "El problema"
  },
  {
    word: "Agua",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Water",
    rule: "A tónica inicial (El agua / Las aguas)",
    explanation: "Sustantivos femeninos que empiezan con 'a' o 'ha' tónica (acentuada) usan el artículo masculino 'el' en singular para evitar la cacofonía, pero siguen siendo FEMENINOS (el agua fría, las aguas templadas).",
    example: "El agua (femenino)"
  },
  {
    word: "Mano",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Hand",
    rule: "Terminación en -o (Excepción Femenina)",
    explanation: "Una de las excepciones más famosas de la regla del español: termina en -o pero es de género femenino.",
    example: "La mano"
  },
  {
    word: "Planeta",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Planet",
    rule: "Origen Griego (-ta)",
    explanation: "Termina en -a, pero al ser de origen griego y acabar en -ta, es masculino.",
    example: "El planeta"
  },
  {
    word: "Sistema",
    gender: "masculino",
    difficulty: "difícil",
    translation: "System",
    rule: "Origen Griego (-ma)",
    explanation: "De origen griego y terminado en -ma, es masculino.",
    example: "El sistema"
  },
  {
    word: "Mapa",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Map",
    rule: "Origen Griego (-pa)",
    explanation: "Termina en -a pero es masculino, derivado de un término griego antiguo acabado en -pa.",
    example: "El mapa"
  },
  {
    word: "Foto",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Photo",
    rule: "Abreviación Femenina",
    explanation: "Es una abreviación de 'la fotografía', por lo que conserva el género femenino a pesar de terminar en -o.",
    example: "La foto"
  },
  {
    word: "Moto",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Motorcycle",
    rule: "Abreviación Femenina",
    explanation: "Abreviación de 'la motocicleta', por lo que es femenina a pesar de terminar en -o.",
    example: "La moto"
  },
  {
    word: "Radio",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Radio (broadcasting)",
    rule: "Abreviación / Polisemia",
    explanation: "Como aparato de transmisión o emisora es femenino ('la radio', abreviatura de radiodifusión). Como elemento químico o radio geométrico es masculino ('el radio').",
    example: "La radio"
  },
  {
    word: "Día",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Day",
    rule: "Terminación en -a (Excepción Masculina)",
    explanation: "Termina en -a pero es masculino. Proviene del latín 'dies', que era de género masculino/vacilante.",
    example: "El día"
  },
  {
    word: "Sofá",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Sofa / Couch",
    rule: "Terminación en -a (Excepción Masculina)",
    explanation: "Préstamo lingüístico terminado en vocal acentuada -á que es masculino.",
    example: "El sofá"
  },
  {
    word: "Águila",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Eagle",
    rule: "A tónica inicial",
    explanation: "Empieza por 'á' tónica. Lleva el artículo 'el' en singular ('el águila') para evitar cacofonía, pero los adjetivos van en femenino ('el águila majestuosa') y en plural se dice 'las águilas'.",
    example: "El águila (femenino)"
  },
  {
    word: "Alma",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Soul",
    rule: "A tónica inicial",
    explanation: "Lleva 'el' en singular por empezar con 'a' tónica, pero es femenino (el alma pura, las almas).",
    example: "El alma (femenino)"
  },
  {
    word: "Hacha",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Axe",
    rule: "A tónica inicial",
    explanation: "Empieza por 'ha' tónica. Usa el artículo 'el' en singular pero es femenina (el hacha afilada, las hachas).",
    example: "El hacha (femenino)"
  },
  {
    word: "Hambre",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Hunger",
    rule: "A tónica inicial",
    explanation: "Sustantivo femenino que empieza con 'ha' tónica. Decimos 'el hambre' en singular pero 'mucha hambre' (adjetivo en femenino) porque es un sustantivo femenino.",
    example: "El hambre (femenino)"
  },
  {
    word: "Aula",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Classroom",
    rule: "A tónica inicial",
    explanation: "Comienza por 'au-' tónica. Lleva 'el' en singular para evitar el choque de vocales (el aula, las aulas), pero el género gramatical es femenino.",
    example: "El aula (femenino)"
  },
  {
    word: "Área",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Area",
    rule: "A tónica inicial",
    explanation: "Lleva 'el' en singular por empezar con 'á' tónica, pero es femenino (el área restringida, las áreas).",
    example: "El área (femenino)"
  },
  {
    word: "Idioma",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Language",
    rule: "Origen Griego (-ma)",
    explanation: "Sustantivo de origen griego terminado en -ma, por lo tanto masculino.",
    example: "El idioma"
  },
  {
    word: "Tema",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Topic / Theme",
    rule: "Origen Griego (-ma)",
    explanation: "De origen griego acabado en -ma, es masculino.",
    example: "El tema"
  },
  {
    word: "Clima",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Weather / Climate",
    rule: "Origen Griego (-ma)",
    explanation: "Proviene del griego 'klima' y acaba en -ma, es masculino.",
    example: "El clima"
  },
  {
    word: "Poema",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Poem",
    rule: "Origen Griego (-ma)",
    explanation: "Sustantivo masculino acabado en -ma de origen griego.",
    example: "El poema"
  },
  {
    word: "Programa",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Program",
    rule: "Origen Griego (-ma)",
    explanation: "Sustantivo de origen griego acabado en -ma, es masculino.",
    example: "El programa"
  },
  {
    word: "Costumbre",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Habit / Custom",
    rule: "Sufijo -umbre",
    explanation: "Todos los sustantivos terminados con el sufijo -umbre son de género femenino (la costumbre, la cumbre, la certidumbre, la muchedumbre).",
    example: "La costumbre"
  },
  {
    word: "Cumbre",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Summit / Peak",
    rule: "Sufijo -umbre",
    explanation: "Terminado en -umbre, de género femenino.",
    example: "La cumbre"
  },
  {
    word: "Certidumbre",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Certainty",
    rule: "Sufijo -umbre",
    explanation: "Sustantivo abstracto femenino acabado en -umbre.",
    example: "La certidumbre"
  },
  {
    word: "Incertidumbre",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Uncertainty",
    rule: "Sufijo -umbre",
    explanation: "Terminado en -umbre, de género femenino.",
    example: "La incertidumbre"
  },
  {
    word: "Muchedumbre",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Crowd",
    rule: "Sufijo -umbre",
    explanation: "Colectivo femenino acabado en -umbre.",
    example: "La muchedumbre"
  },
  {
    word: "Análisis",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Analysis",
    rule: "Terminación en -sis (Masculino)",
    explanation: "Es masculino en español (el análisis). Ojo: no confundir con otras palabras de origen griego en -sis que son femeninas como 'la crisis' o 'la síntesis'.",
    example: "El análisis"
  },
  {
    word: "Crisis",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Crisis",
    rule: "Terminación en -sis (Femenino)",
    explanation: "'Crisis' es femenina e invariable en plural (la crisis, las crisis).",
    example: "La crisis"
  },
  {
    word: "Síntesis",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Synthesis",
    rule: "Terminación en -sis (Femenino)",
    explanation: "Sustantivo femenino de origen griego acabado en -sis.",
    example: "La síntesis"
  },
  {
    word: "Oasis",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Oasis",
    rule: "Terminación en -sis (Masculino)",
    explanation: "A diferencia de 'crisis', 'oasis' es de género masculino.",
    example: "El oasis"
  },
  {
    word: "Apocalipsis",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Apocalypse",
    rule: "Terminación en -sis (Masculino)",
    explanation: "Sustantivo masculino acabado en -sis.",
    example: "El apocalipsis"
  },
  {
    word: "Tesis",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Thesis",
    rule: "Terminación en -sis (Femenino)",
    explanation: "Sustantivo femenino acabado en -sis.",
    example: "La tesis"
  },
  {
    word: "Paréntesis",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Parenthesis",
    rule: "Terminación en -sis (Masculino)",
    explanation: "'Paréntesis' es de género masculino.",
    example: "El paréntesis"
  },
  {
    word: "Coliflor",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Cauliflower",
    rule: "Nombre de planta (Femenino)",
    explanation: "Aunque termina en -or, se comporta como 'la flor'. Es femenina.",
    example: "La coliflor"
  },
  {
    word: "Cometa (espacial)",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Comet (astronomy)",
    rule: "Homónimo / Significado",
    explanation: "El astro que surca el cielo es masculino ('el cometa'). El juguete de papel que vuela con un hilo es femenino ('la cometa').",
    example: "El cometa"
  },
  {
    word: "Cometa (juguete)",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Kite (toy)",
    rule: "Homónimo / Significado",
    explanation: "El juguete de papel que vuela con un hilo es femenino ('la cometa'). El astro espacial es masculino ('el cometa').",
    example: "La cometa"
  },
  {
    word: "Capital (dinero)",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Capital / Funds",
    rule: "Homónimo / Significado",
    explanation: "Cuando significa patrimonio o hacienda de dinero, es masculino ('el capital'). Cuando significa población principal o letra mayúscula, es femenino ('la capital').",
    example: "El capital"
  },
  {
    word: "Capital (ciudad)",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Capital city",
    rule: "Homónimo / Significado",
    explanation: "Cuando significa ciudad principal de un país, es femenino ('la capital'). Cuando es dinero o recursos financieros, es masculino ('el capital').",
    example: "La capital"
  },
  {
    word: "Frente (meteorología/militar)",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Front (weather/battle)",
    rule: "Homónimo / Significado",
    explanation: "El límite de dos masas de aire o la línea de batalla es masculino ('el frente frío', 'el frente de guerra'). La parte superior de la cara es femenina ('la frente despejada').",
    example: "El frente"
  },
  {
    word: "Frente (cara)",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Forehead",
    rule: "Homónimo / Significado",
    explanation: "La zona superior de la cara es femenina ('la frente'). La línea de batalla o meteorología es masculina ('el frente').",
    example: "La frente"
  },
  {
    word: "Cura (sacerdote)",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Priest",
    rule: "Homónimo / Significado",
    explanation: "Cuando se refiere al sacerdote católico, es masculino ('el cura'). Cuando se refiere al tratamiento o sanación de una enfermedad, es femenino ('la cura').",
    example: "El cura"
  },
  {
    word: "Cura (sanación)",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Cure / Healing",
    rule: "Homónimo / Significado",
    explanation: "Cuando se refiere al tratamiento médico o sanación, es femenino ('la cura'). El sacerdote católico es masculino ('el cura').",
    example: "La cura"
  },
  {
    word: "Guía (libro)",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Guidebook / Directory",
    rule: "Homónimo / Significado",
    explanation: "El libro o documento con indicaciones es femenino ('la guía telefónica', 'la guía de viajes'). Si se refiere a la persona que guía, puede ser 'el guía' (hombre) o 'la guía' (mujer).",
    example: "La guía"
  },
  {
    word: "Orden (organización)",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Order / Organization",
    rule: "Homónimo / Significado",
    explanation: "La colocación ordenada de cosas o armonía es masculino ('el orden alfabético'). El mandato, instrucción o congregación religiosa es femenino ('la orden judicial', 'la orden de los franciscanos').",
    example: "El orden"
  },
  {
    word: "Orden (mandato)",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Command / Directive",
    rule: "Homónimo / Significado",
    explanation: "Una instrucción dada por una autoridad o una congregación religiosa es de género femenino ('la orden'). La armonía o secuencia es masculina ('el orden').",
    example: "La orden"
  },
  {
    word: "Sartén",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Frying pan",
    rule: "Género vacilante (RAE prefiere femenino)",
    explanation: "En la mayor parte de España y América es femenino ('la sartén'). En algunas zonas de América es común el masculino ('el sartén'), pero la RAE indica que la norma culta prefiere el femenino.",
    example: "La sartén"
  },
  {
    word: "Radio (hueso / geometría)",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Radius (bone / circle)",
    rule: "Polisemia",
    explanation: "El radio de una circunferencia, el metal químico o el hueso del antebrazo son masculinos ('el radio'). El aparato receptor o la emisora es femenino ('la radio').",
    example: "El radio"
  },
  {
    word: "Dilema",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Dilemma",
    rule: "Origen Griego (-ma)",
    explanation: "Otro sustantivo de origen griego terminado en -ma, por ende es masculino.",
    example: "El dilema"
  },
  {
    word: "Drama",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Drama",
    rule: "Origen Griego (-ma)",
    explanation: "Viene del griego clásico dramatos y acaba en -ma, es masculino.",
    example: "El drama"
  },
  {
    word: "Síntoma",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Symptom",
    rule: "Origen Griego (-ma)",
    explanation: "Sustantivo masculino de origen griego acabado en -ma.",
    example: "El síntoma"
  },
  {
    word: "Esquema",
    gender: "masculino",
    difficulty: "difícil",
    translation: "Outline / Diagram",
    rule: "Origen Griego (-ma)",
    explanation: "Es de origen griego y acaba en -ma, por lo tanto es de género masculino.",
    example: "El esquema"
  },
  {
    word: "Crucifijo",
    gender: "masculino",
    difficulty: "medio",
    translation: "Crucifix",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo masculino estándar acabado en -o.",
    example: "El crucifijo"
  },
  {
    word: "Nido",
    gender: "masculino",
    difficulty: "fácil",
    translation: "Nest",
    rule: "Terminación estándar -o",
    explanation: "Sustantivo estándar que termina en -o.",
    example: "El nido"
  },
  {
    word: "Tribu",
    gender: "femenino",
    difficulty: "difícil",
    translation: "Tribe",
    rule: "Terminación en -u (Excepción)",
    explanation: "La mayoría de palabras terminadas en -u son masculinas (el espíritu, el menú), pero 'la tribu' es una famosa excepción femenina.",
    example: "La tribu"
  }
];

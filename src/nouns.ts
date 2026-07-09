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
  },

  // === AMPLIACIÓN DE LA BASE DE DATOS ===

  // --- FÁCIL: más sustantivos estándar en -o (masculino) ---
  { word: "Escritorio", gender: "masculino", difficulty: "fácil", translation: "Desk", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El escritorio" },
  { word: "Armario", gender: "masculino", difficulty: "fácil", translation: "Wardrobe", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El armario" },
  { word: "Cuadro", gender: "masculino", difficulty: "fácil", translation: "Painting", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El cuadro" },
  { word: "Techo", gender: "masculino", difficulty: "fácil", translation: "Ceiling", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El techo" },
  { word: "Piso", gender: "masculino", difficulty: "fácil", translation: "Floor / Apartment", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El piso" },
  { word: "Patio", gender: "masculino", difficulty: "fácil", translation: "Patio", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El patio" },
  { word: "Sótano", gender: "masculino", difficulty: "fácil", translation: "Basement", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El sótano" },
  { word: "Pasillo", gender: "masculino", difficulty: "fácil", translation: "Hallway", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El pasillo" },
  { word: "Bolso", gender: "masculino", difficulty: "fácil", translation: "Handbag", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El bolso" },
  { word: "Abrigo", gender: "masculino", difficulty: "fácil", translation: "Coat", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El abrigo" },
  { word: "Cuchillo", gender: "masculino", difficulty: "fácil", translation: "Knife", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El cuchillo" },
  { word: "Horno", gender: "masculino", difficulty: "fácil", translation: "Oven", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El horno" },
  { word: "Fregadero", gender: "masculino", difficulty: "fácil", translation: "Sink", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El fregadero" },
  { word: "Grifo", gender: "masculino", difficulty: "fácil", translation: "Faucet", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El grifo" },
  { word: "Cesto", gender: "masculino", difficulty: "fácil", translation: "Basket", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El cesto" },
  { word: "Río", gender: "masculino", difficulty: "fácil", translation: "River", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El río" },
  { word: "Lago", gender: "masculino", difficulty: "fácil", translation: "Lake", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El lago" },
  { word: "Desierto", gender: "masculino", difficulty: "fácil", translation: "Desert", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El desierto" },
  { word: "Campo", gender: "masculino", difficulty: "fácil", translation: "Field", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El campo" },
  { word: "Huerto", gender: "masculino", difficulty: "fácil", translation: "Orchard", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El huerto" },
  { word: "Charco", gender: "masculino", difficulty: "fácil", translation: "Puddle", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El charco" },
  { word: "Arroyo", gender: "masculino", difficulty: "fácil", translation: "Stream", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El arroyo" },
  { word: "Barco", gender: "masculino", difficulty: "fácil", translation: "Boat", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El barco" },
  { word: "Puerto", gender: "masculino", difficulty: "fácil", translation: "Port", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El puerto" },
  { word: "Faro", gender: "masculino", difficulty: "fácil", translation: "Lighthouse", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El faro" },
  { word: "Semáforo", gender: "masculino", difficulty: "fácil", translation: "Traffic light", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El semáforo" },
  { word: "Metro", gender: "masculino", difficulty: "fácil", translation: "Subway", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El metro" },
  { word: "Teatro", gender: "masculino", difficulty: "fácil", translation: "Theater", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El teatro" },
  { word: "Museo", gender: "masculino", difficulty: "fácil", translation: "Museum", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El museo" },
  { word: "Estadio", gender: "masculino", difficulty: "fácil", translation: "Stadium", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El estadio" },
  { word: "Gimnasio", gender: "masculino", difficulty: "fácil", translation: "Gym", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El gimnasio" },
  { word: "Colegio", gender: "masculino", difficulty: "fácil", translation: "School", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El colegio" },
  { word: "Instituto", gender: "masculino", difficulty: "fácil", translation: "Institute", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El instituto" },
  { word: "Banco", gender: "masculino", difficulty: "fácil", translation: "Bank / Bench", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El banco" },
  { word: "Mercado", gender: "masculino", difficulty: "fácil", translation: "Market", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El mercado" },
  { word: "Supermercado", gender: "masculino", difficulty: "fácil", translation: "Supermarket", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El supermercado" },
  { word: "Aeropuerto", gender: "masculino", difficulty: "fácil", translation: "Airport", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El aeropuerto" },
  { word: "Edificio", gender: "masculino", difficulty: "fácil", translation: "Building", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El edificio" },
  { word: "Vecindario", gender: "masculino", difficulty: "fácil", translation: "Neighborhood", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El vecindario" },
  { word: "Barrio", gender: "masculino", difficulty: "fácil", translation: "Neighborhood", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El barrio" },
  { word: "Pueblo", gender: "masculino", difficulty: "fácil", translation: "Town", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El pueblo" },
  { word: "Castillo", gender: "masculino", difficulty: "fácil", translation: "Castle", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El castillo" },
  { word: "Palacio", gender: "masculino", difficulty: "fácil", translation: "Palace", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El palacio" },
  { word: "Templo", gender: "masculino", difficulty: "fácil", translation: "Temple", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El templo" },
  { word: "Monasterio", gender: "masculino", difficulty: "fácil", translation: "Monastery", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El monasterio" },
  { word: "Cementerio", gender: "masculino", difficulty: "fácil", translation: "Cemetery", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El cementerio" },
  { word: "Brazo", gender: "masculino", difficulty: "fácil", translation: "Arm", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El brazo" },
  { word: "Codo", gender: "masculino", difficulty: "fácil", translation: "Elbow", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El codo" },
  { word: "Dedo", gender: "masculino", difficulty: "fácil", translation: "Finger", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El dedo" },
  { word: "Cuello", gender: "masculino", difficulty: "fácil", translation: "Neck", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El cuello" },
  { word: "Hombro", gender: "masculino", difficulty: "fácil", translation: "Shoulder", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El hombro" },
  { word: "Tobillo", gender: "masculino", difficulty: "fácil", translation: "Ankle", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El tobillo" },
  { word: "Muslo", gender: "masculino", difficulty: "fácil", translation: "Thigh", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El muslo" },
  { word: "Pecho", gender: "masculino", difficulty: "fácil", translation: "Chest", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El pecho" },
  { word: "Estómago", gender: "masculino", difficulty: "fácil", translation: "Stomach", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El estómago" },
  { word: "Cerebro", gender: "masculino", difficulty: "fácil", translation: "Brain", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El cerebro" },
  { word: "Hígado", gender: "masculino", difficulty: "fácil", translation: "Liver", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El hígado" },
  { word: "Ojo", gender: "masculino", difficulty: "fácil", translation: "Eye", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El ojo" },
  { word: "Labio", gender: "masculino", difficulty: "fácil", translation: "Lip", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El labio" },
  { word: "Bigote", gender: "masculino", difficulty: "fácil", translation: "Mustache", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El bigote" },
  { word: "Puño", gender: "masculino", difficulty: "fácil", translation: "Fist", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El puño" },
  { word: "Huevo", gender: "masculino", difficulty: "fácil", translation: "Egg", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El huevo" },
  { word: "Pollo", gender: "masculino", difficulty: "fácil", translation: "Chicken", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El pollo" },
  { word: "Pescado", gender: "masculino", difficulty: "fácil", translation: "Fish (food)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El pescado" },
  { word: "Vino", gender: "masculino", difficulty: "fácil", translation: "Wine", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El vino" },
  { word: "Jugo", gender: "masculino", difficulty: "fácil", translation: "Juice", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El jugo" },
  { word: "Helado", gender: "masculino", difficulty: "fácil", translation: "Ice cream", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El helado" },
  { word: "Bizcocho", gender: "masculino", difficulty: "fácil", translation: "Sponge cake", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El bizcocho" },
  { word: "Vestido", gender: "masculino", difficulty: "fácil", translation: "Dress", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El vestido" },
  { word: "Chaleco", gender: "masculino", difficulty: "fácil", translation: "Vest", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El chaleco" },
  { word: "Piano", gender: "masculino", difficulty: "fácil", translation: "Piano", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El piano" },
  { word: "Micrófono", gender: "masculino", difficulty: "fácil", translation: "Microphone", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El micrófono" },
  { word: "Concierto", gender: "masculino", difficulty: "fácil", translation: "Concert", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El concierto" },
  { word: "Estudio", gender: "masculino", difficulty: "fácil", translation: "Studio", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El estudio" },
  { word: "Disco", gender: "masculino", difficulty: "fácil", translation: "Record / Disc", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El disco" },
  { word: "Auditorio", gender: "masculino", difficulty: "fácil", translation: "Auditorium", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El auditorio" },
  { word: "Equipo", gender: "masculino", difficulty: "fácil", translation: "Team", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El equipo" },
  { word: "Partido", gender: "masculino", difficulty: "fácil", translation: "Match", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El partido" },
  { word: "Torneo", gender: "masculino", difficulty: "fácil", translation: "Tournament", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El torneo" },
  { word: "Casco", gender: "masculino", difficulty: "fácil", translation: "Helmet", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El casco" },
  { word: "Médico", gender: "masculino", difficulty: "fácil", translation: "Doctor (male)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El médico" },
  { word: "Abogado", gender: "masculino", difficulty: "fácil", translation: "Lawyer (male)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El abogado" },
  { word: "Ingeniero", gender: "masculino", difficulty: "fácil", translation: "Engineer (male)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El ingeniero" },
  { word: "Arquitecto", gender: "masculino", difficulty: "fácil", translation: "Architect (male)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El arquitecto" },
  { word: "Cocinero", gender: "masculino", difficulty: "fácil", translation: "Cook (male)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El cocinero" },
  { word: "Panadero", gender: "masculino", difficulty: "fácil", translation: "Baker (male)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El panadero" },
  { word: "Carpintero", gender: "masculino", difficulty: "fácil", translation: "Carpenter (male)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El carpintero" },
  { word: "Peluquero", gender: "masculino", difficulty: "fácil", translation: "Hairdresser (male)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El peluquero" },
  { word: "Bombero", gender: "masculino", difficulty: "fácil", translation: "Firefighter (male)", rule: "Terminación estándar -o", explanation: "Sustantivo estándar que termina en -o.", example: "El bombero" },

  // --- FÁCIL: más sustantivos estándar en -a (femenino) ---
  { word: "Cabeza", gender: "femenino", difficulty: "fácil", translation: "Head", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La cabeza" },
  { word: "Cara", gender: "femenino", difficulty: "fácil", translation: "Face", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La cara" },
  { word: "Boca", gender: "femenino", difficulty: "fácil", translation: "Mouth", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La boca" },
  { word: "Oreja", gender: "femenino", difficulty: "fácil", translation: "Ear", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La oreja" },
  { word: "Espalda", gender: "femenino", difficulty: "fácil", translation: "Back", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La espalda" },
  { word: "Pierna", gender: "femenino", difficulty: "fácil", translation: "Leg", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La pierna" },
  { word: "Rodilla", gender: "femenino", difficulty: "fácil", translation: "Knee", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La rodilla" },
  { word: "Cintura", gender: "femenino", difficulty: "fácil", translation: "Waist", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La cintura" },
  { word: "Cadera", gender: "femenino", difficulty: "fácil", translation: "Hip", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La cadera" },
  { word: "Muñeca", gender: "femenino", difficulty: "fácil", translation: "Wrist / Doll", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La muñeca" },
  { word: "Barriga", gender: "femenino", difficulty: "fácil", translation: "Belly", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La barriga" },
  { word: "Mejilla", gender: "femenino", difficulty: "fácil", translation: "Cheek", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La mejilla" },
  { word: "Ceja", gender: "femenino", difficulty: "fácil", translation: "Eyebrow", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La ceja" },
  { word: "Pestaña", gender: "femenino", difficulty: "fácil", translation: "Eyelash", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La pestaña" },
  { word: "Uña", gender: "femenino", difficulty: "fácil", translation: "Nail", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La uña" },
  { word: "Lengua", gender: "femenino", difficulty: "fácil", translation: "Tongue", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La lengua" },
  { word: "Garganta", gender: "femenino", difficulty: "fácil", translation: "Throat", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La garganta" },
  { word: "Torta", gender: "femenino", difficulty: "fácil", translation: "Cake", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La torta" },
  { word: "Tarta", gender: "femenino", difficulty: "fácil", translation: "Pie / Cake", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La tarta" },
  { word: "Ensalada", gender: "femenino", difficulty: "fácil", translation: "Salad", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La ensalada" },
  { word: "Fruta", gender: "femenino", difficulty: "fácil", translation: "Fruit", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La fruta" },
  { word: "Verdura", gender: "femenino", difficulty: "fácil", translation: "Vegetable", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La verdura" },
  { word: "Pizza", gender: "femenino", difficulty: "fácil", translation: "Pizza", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La pizza" },
  { word: "Hamburguesa", gender: "femenino", difficulty: "fácil", translation: "Hamburger", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La hamburguesa" },
  { word: "Naranja", gender: "femenino", difficulty: "fácil", translation: "Orange", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La naranja" },
  { word: "Fresa", gender: "femenino", difficulty: "fácil", translation: "Strawberry", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La fresa" },
  { word: "Uva", gender: "femenino", difficulty: "fácil", translation: "Grape", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La uva" },
  { word: "Pera", gender: "femenino", difficulty: "fácil", translation: "Pear", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La pera" },
  { word: "Cereza", gender: "femenino", difficulty: "fácil", translation: "Cherry", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La cereza" },
  { word: "Sandía", gender: "femenino", difficulty: "fácil", translation: "Watermelon", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La sandía" },
  { word: "Piña", gender: "femenino", difficulty: "fácil", translation: "Pineapple", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La piña" },
  { word: "Papa", gender: "femenino", difficulty: "fácil", translation: "Potato", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La papa" },
  { word: "Patata", gender: "femenino", difficulty: "fácil", translation: "Potato", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La patata" },
  { word: "Cebolla", gender: "femenino", difficulty: "fácil", translation: "Onion", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La cebolla" },
  { word: "Zanahoria", gender: "femenino", difficulty: "fácil", translation: "Carrot", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La zanahoria" },
  { word: "Lechuga", gender: "femenino", difficulty: "fácil", translation: "Lettuce", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La lechuga" },
  { word: "Espinaca", gender: "femenino", difficulty: "fácil", translation: "Spinach", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La espinaca" },
  { word: "Pasta", gender: "femenino", difficulty: "fácil", translation: "Pasta", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La pasta" },
  { word: "Salsa", gender: "femenino", difficulty: "fácil", translation: "Sauce", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La salsa" },
  { word: "Pimienta", gender: "femenino", difficulty: "fácil", translation: "Pepper (spice)", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La pimienta" },
  { word: "Canela", gender: "femenino", difficulty: "fácil", translation: "Cinnamon", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La canela" },
  { word: "Vainilla", gender: "femenino", difficulty: "fácil", translation: "Vanilla", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La vainilla" },
  { word: "Galleta", gender: "femenino", difficulty: "fácil", translation: "Cookie", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La galleta" },
  { word: "Bufanda", gender: "femenino", difficulty: "fácil", translation: "Scarf", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La bufanda" },
  { word: "Chaqueta", gender: "femenino", difficulty: "fácil", translation: "Jacket", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La chaqueta" },
  { word: "Camiseta", gender: "femenino", difficulty: "fácil", translation: "T-shirt", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La camiseta" },
  { word: "Corbata", gender: "femenino", difficulty: "fácil", translation: "Tie", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La corbata" },
  { word: "Gorra", gender: "femenino", difficulty: "fácil", translation: "Cap", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La gorra" },
  { word: "Bota", gender: "femenino", difficulty: "fácil", translation: "Boot", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La bota" },
  { word: "Sandalia", gender: "femenino", difficulty: "fácil", translation: "Sandal", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La sandalia" },
  { word: "Blusa", gender: "femenino", difficulty: "fácil", translation: "Blouse", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La blusa" },
  { word: "Ropa", gender: "femenino", difficulty: "fácil", translation: "Clothing", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La ropa" },
  { word: "Cocina", gender: "femenino", difficulty: "fácil", translation: "Kitchen", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La cocina" },
  { word: "Sala", gender: "femenino", difficulty: "fácil", translation: "Living room", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La sala" },
  { word: "Escalera", gender: "femenino", difficulty: "fácil", translation: "Staircase", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La escalera" },
  { word: "Terraza", gender: "femenino", difficulty: "fácil", translation: "Terrace", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La terraza" },
  { word: "Piscina", gender: "femenino", difficulty: "fácil", translation: "Pool", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La piscina" },
  { word: "Biblioteca", gender: "femenino", difficulty: "fácil", translation: "Library", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La biblioteca" },
  { word: "Farmacia", gender: "femenino", difficulty: "fácil", translation: "Pharmacy", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La farmacia" },
  { word: "Panadería", gender: "femenino", difficulty: "fácil", translation: "Bakery", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La panadería" },
  { word: "Carnicería", gender: "femenino", difficulty: "fácil", translation: "Butcher shop", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La carnicería" },
  { word: "Peluquería", gender: "femenino", difficulty: "fácil", translation: "Hair salon", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La peluquería" },
  { word: "Librería", gender: "femenino", difficulty: "fácil", translation: "Bookstore", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La librería" },
  { word: "Tienda", gender: "femenino", difficulty: "fácil", translation: "Store", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La tienda" },
  { word: "Fábrica", gender: "femenino", difficulty: "fácil", translation: "Factory", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La fábrica" },
  { word: "Oficina", gender: "femenino", difficulty: "fácil", translation: "Office", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La oficina" },
  { word: "Empresa", gender: "femenino", difficulty: "fácil", translation: "Company", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La empresa" },
  { word: "Guitarra", gender: "femenino", difficulty: "fácil", translation: "Guitar", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La guitarra" },
  { word: "Batería", gender: "femenino", difficulty: "fácil", translation: "Drums / Battery", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La batería" },
  { word: "Trompeta", gender: "femenino", difficulty: "fácil", translation: "Trumpet", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La trompeta" },
  { word: "Flauta", gender: "femenino", difficulty: "fácil", translation: "Flute", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La flauta" },
  { word: "Orquesta", gender: "femenino", difficulty: "fácil", translation: "Orchestra", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La orquesta" },
  { word: "Película", gender: "femenino", difficulty: "fácil", translation: "Movie", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La película" },
  { word: "Cámara", gender: "femenino", difficulty: "fácil", translation: "Camera", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La cámara" },
  { word: "Computadora", gender: "femenino", difficulty: "fácil", translation: "Computer", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La computadora" },
  { word: "Impresora", gender: "femenino", difficulty: "fácil", translation: "Printer", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La impresora" },
  { word: "Batalla", gender: "femenino", difficulty: "fácil", translation: "Battle", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La batalla" },
  { word: "Montaña", gender: "femenino", difficulty: "fácil", translation: "Mountain", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La montaña" },
  { word: "Playa", gender: "femenino", difficulty: "fácil", translation: "Beach", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La playa" },
  { word: "Selva", gender: "femenino", difficulty: "fácil", translation: "Jungle", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La selva" },
  { word: "Costa", gender: "femenino", difficulty: "fácil", translation: "Coast", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La costa" },
  { word: "Isla", gender: "femenino", difficulty: "fácil", translation: "Island", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La isla" },
  { word: "Cascada", gender: "femenino", difficulty: "fácil", translation: "Waterfall", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La cascada" },
  { word: "Colina", gender: "femenino", difficulty: "fácil", translation: "Hill", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La colina" },
  { word: "Bahía", gender: "femenino", difficulty: "fácil", translation: "Bay", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La bahía" },
  { word: "Frontera", gender: "femenino", difficulty: "fácil", translation: "Border", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La frontera" },
  { word: "Enfermera", gender: "femenino", difficulty: "fácil", translation: "Nurse (female)", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La enfermera" },
  { word: "Profesora", gender: "femenino", difficulty: "fácil", translation: "Teacher (female)", rule: "Terminación estándar -a", explanation: "Sustantivo estándar que termina en -a.", example: "La profesora" },

  // --- MEDIO: -ción / -sión (siempre femeninas) ---
  { word: "Información", gender: "femenino", difficulty: "medio", translation: "Information", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La información" },
  { word: "Educación", gender: "femenino", difficulty: "medio", translation: "Education", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La educación" },
  { word: "Comunicación", gender: "femenino", difficulty: "medio", translation: "Communication", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La comunicación" },
  { word: "Organización", gender: "femenino", difficulty: "medio", translation: "Organization", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La organización" },
  { word: "Población", gender: "femenino", difficulty: "medio", translation: "Population", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La población" },
  { word: "Situación", gender: "femenino", difficulty: "medio", translation: "Situation", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La situación" },
  { word: "Dirección", gender: "femenino", difficulty: "medio", translation: "Address / Direction", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La dirección" },
  { word: "Atención", gender: "femenino", difficulty: "medio", translation: "Attention", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La atención" },
  { word: "Relación", gender: "femenino", difficulty: "medio", translation: "Relationship", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La relación" },
  { word: "Aplicación", gender: "femenino", difficulty: "medio", translation: "Application", rule: "Terminación en -ción", explanation: "Casi todos los sustantivos abstractos terminados en -ción, -sión, -tud, -dad, -tad son femeninos.", example: "La aplicación" },
  { word: "Expresión", gender: "femenino", difficulty: "medio", translation: "Expression", rule: "Terminación en -sión", explanation: "Los sustantivos acabados en -sión son femeninos.", example: "La expresión" },
  { word: "Impresión", gender: "femenino", difficulty: "medio", translation: "Impression", rule: "Terminación en -sión", explanation: "Los sustantivos acabados en -sión son femeninos.", example: "La impresión" },
  { word: "Versión", gender: "femenino", difficulty: "medio", translation: "Version", rule: "Terminación en -sión", explanation: "Los sustantivos acabados en -sión son femeninos.", example: "La versión" },
  { word: "Tensión", gender: "femenino", difficulty: "medio", translation: "Tension", rule: "Terminación en -sión", explanation: "Los sustantivos acabados en -sión son femeninos.", example: "La tensión" },
  { word: "Pasión", gender: "femenino", difficulty: "medio", translation: "Passion", rule: "Terminación en -sión", explanation: "Los sustantivos acabados en -sión son femeninos.", example: "La pasión" },
  { word: "Confusión", gender: "femenino", difficulty: "medio", translation: "Confusion", rule: "Terminación en -sión", explanation: "Los sustantivos acabados en -sión son femeninos.", example: "La confusión" },
  { word: "Ilusión", gender: "femenino", difficulty: "medio", translation: "Illusion / Hope", rule: "Terminación en -sión", explanation: "Los sustantivos acabados en -sión son femeninos.", example: "La ilusión" },
  { word: "Explosión", gender: "femenino", difficulty: "medio", translation: "Explosion", rule: "Terminación en -sión", explanation: "Los sustantivos acabados en -sión son femeninos.", example: "La explosión" },

  // --- MEDIO: -dad / -tad / -tud (siempre femeninas) ---
  { word: "Felicidad", gender: "femenino", difficulty: "medio", translation: "Happiness", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La felicidad" },
  { word: "Amistad", gender: "femenino", difficulty: "medio", translation: "Friendship", rule: "Terminación en -tad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La amistad" },
  { word: "Sociedad", gender: "femenino", difficulty: "medio", translation: "Society", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La sociedad" },
  { word: "Actividad", gender: "femenino", difficulty: "medio", translation: "Activity", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La actividad" },
  { word: "Capacidad", gender: "femenino", difficulty: "medio", translation: "Capacity", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La capacidad" },
  { word: "Dificultad", gender: "femenino", difficulty: "medio", translation: "Difficulty", rule: "Terminación en -tad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La dificultad" },
  { word: "Universidad", gender: "femenino", difficulty: "medio", translation: "University", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La universidad" },
  { word: "Comunidad", gender: "femenino", difficulty: "medio", translation: "Community", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La comunidad" },
  { word: "Oportunidad", gender: "femenino", difficulty: "medio", translation: "Opportunity", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La oportunidad" },
  { word: "Necesidad", gender: "femenino", difficulty: "medio", translation: "Necessity", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La necesidad" },
  { word: "Seguridad", gender: "femenino", difficulty: "medio", translation: "Safety / Security", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La seguridad" },
  { word: "Actitud", gender: "femenino", difficulty: "medio", translation: "Attitude", rule: "Terminación en -tud", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La actitud" },
  { word: "Posibilidad", gender: "femenino", difficulty: "medio", translation: "Possibility", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La posibilidad" },
  { word: "Curiosidad", gender: "femenino", difficulty: "medio", translation: "Curiosity", rule: "Terminación en -dad", explanation: "Sustantivos que terminan en -dad, -tad, o -tud siempre son femeninos.", example: "La curiosidad" },

  // --- MEDIO: -aje (siempre masculino) ---
  { word: "Paisaje", gender: "masculino", difficulty: "medio", translation: "Landscape", rule: "Terminación en -aje", explanation: "Todos los sustantivos que terminan en -aje son masculinos.", example: "El paisaje" },
  { word: "Personaje", gender: "masculino", difficulty: "medio", translation: "Character", rule: "Terminación en -aje", explanation: "Todos los sustantivos que terminan en -aje son masculinos.", example: "El personaje" },
  { word: "Lenguaje", gender: "masculino", difficulty: "medio", translation: "Language", rule: "Terminación en -aje", explanation: "Todos los sustantivos que terminan en -aje son masculinos.", example: "El lenguaje" },
  { word: "Garaje", gender: "masculino", difficulty: "medio", translation: "Garage", rule: "Terminación en -aje", explanation: "Todos los sustantivos que terminan en -aje son masculinos.", example: "El garaje" },
  { word: "Peaje", gender: "masculino", difficulty: "medio", translation: "Toll", rule: "Terminación en -aje", explanation: "Todos los sustantivos que terminan en -aje son masculinos.", example: "El peaje" },
  { word: "Coraje", gender: "masculino", difficulty: "medio", translation: "Courage", rule: "Terminación en -aje", explanation: "Todos los sustantivos que terminan en -aje son masculinos.", example: "El coraje" },
  { word: "Aprendizaje", gender: "masculino", difficulty: "medio", translation: "Learning", rule: "Terminación en -aje", explanation: "Todos los sustantivos que terminan en -aje son masculinos.", example: "El aprendizaje" },
  { word: "Montaje", gender: "masculino", difficulty: "medio", translation: "Assembly / Editing", rule: "Terminación en -aje", explanation: "Todos los sustantivos que terminan en -aje son masculinos.", example: "El montaje" },

  // --- MEDIO: -umbre (siempre femenino) ---
  { word: "Legumbre", gender: "femenino", difficulty: "medio", translation: "Legume", rule: "Sufijo -umbre", explanation: "Todos los sustantivos terminados con el sufijo -umbre son de género femenino.", example: "La legumbre" },
  { word: "Lumbre", gender: "femenino", difficulty: "medio", translation: "Fire / Light", rule: "Sufijo -umbre", explanation: "Todos los sustantivos terminados con el sufijo -umbre son de género femenino.", example: "La lumbre" },
  { word: "Servidumbre", gender: "femenino", difficulty: "medio", translation: "Servitude / Household staff", rule: "Sufijo -umbre", explanation: "Todos los sustantivos terminados con el sufijo -umbre son de género femenino.", example: "La servidumbre" },

  // --- MEDIO: -or (mayoría masculino), con una excepción femenina ---
  { word: "Profesor", gender: "masculino", difficulty: "medio", translation: "Teacher (male)", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El profesor" },
  { word: "Actor", gender: "masculino", difficulty: "medio", translation: "Actor", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El actor" },
  { word: "Escritor", gender: "masculino", difficulty: "medio", translation: "Writer (male)", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El escritor" },
  { word: "Director", gender: "masculino", difficulty: "medio", translation: "Director (male)", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El director" },
  { word: "Autor", gender: "masculino", difficulty: "medio", translation: "Author (male)", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El autor" },
  { word: "Amor", gender: "masculino", difficulty: "medio", translation: "Love", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El amor" },
  { word: "Humor", gender: "masculino", difficulty: "medio", translation: "Humor / Mood", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El humor" },
  { word: "Sabor", gender: "masculino", difficulty: "medio", translation: "Flavor", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El sabor" },
  { word: "Valor", gender: "masculino", difficulty: "medio", translation: "Value / Courage", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El valor" },
  { word: "Error", gender: "masculino", difficulty: "medio", translation: "Error", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El error" },
  { word: "Ordenador", gender: "masculino", difficulty: "medio", translation: "Computer (Spain)", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El ordenador" },
  { word: "Cargador", gender: "masculino", difficulty: "medio", translation: "Charger", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El cargador" },
  { word: "Ascensor", gender: "masculino", difficulty: "medio", translation: "Elevator", rule: "Terminación en -or (Masculino)", explanation: "Las palabras terminadas en -or suelen ser masculinas.", example: "El ascensor" },
  { word: "Labor", gender: "femenino", difficulty: "medio", translation: "Labor / Task", rule: "Terminación en -or (Excepción)", explanation: "A diferencia de la mayoría de palabras en -or, 'labor' es una excepción femenina, igual que 'flor'.", example: "La labor" },

  // --- MEDIO: -e (masculino y femenino, según la palabra) ---
  { word: "Parque", gender: "masculino", difficulty: "medio", translation: "Park", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en -e.", example: "El parque" },
  { word: "Chiste", gender: "masculino", difficulty: "medio", translation: "Joke", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en -e.", example: "El chiste" },
  { word: "Aceite", gender: "masculino", difficulty: "medio", translation: "Oil", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en -e.", example: "El aceite" },
  { word: "Tomate", gender: "masculino", difficulty: "medio", translation: "Tomato", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en -e.", example: "El tomate" },
  { word: "Chocolate", gender: "masculino", difficulty: "medio", translation: "Chocolate", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en -e.", example: "El chocolate" },
  { word: "Traje", gender: "masculino", difficulty: "medio", translation: "Suit", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en -e.", example: "El traje" },
  { word: "Valle", gender: "masculino", difficulty: "medio", translation: "Valley", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en -e.", example: "El valle" },
  { word: "Aire", gender: "masculino", difficulty: "medio", translation: "Air", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en -e.", example: "El aire" },
  { word: "Restaurante", gender: "masculino", difficulty: "medio", translation: "Restaurant", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en -e.", example: "El restaurante" },
  { word: "Café", gender: "masculino", difficulty: "medio", translation: "Coffee", rule: "Terminación en -e (Masculino)", explanation: "Sustantivo masculino acabado en vocal -e/-é.", example: "El café" },
  { word: "Calle", gender: "femenino", difficulty: "medio", translation: "Street", rule: "Terminación en -e (Femenino)", explanation: "Sustantivo femenino acabado en -e.", example: "La calle" },
  { word: "Suerte", gender: "femenino", difficulty: "medio", translation: "Luck", rule: "Terminación en -e (Femenino)", explanation: "Sustantivo femenino acabado en -e.", example: "La suerte" },
  { word: "Muerte", gender: "femenino", difficulty: "medio", translation: "Death", rule: "Terminación en -e (Femenino)", explanation: "Sustantivo femenino acabado en -e.", example: "La muerte" },
  { word: "Fuente", gender: "femenino", difficulty: "medio", translation: "Fountain / Source", rule: "Terminación en -e (Femenino)", explanation: "Sustantivo femenino acabado en -e.", example: "La fuente" },
  { word: "Nube", gender: "femenino", difficulty: "medio", translation: "Cloud", rule: "Terminación en -e (Femenino)", explanation: "Sustantivo femenino acabado en -e.", example: "La nube" },
  { word: "Base", gender: "femenino", difficulty: "medio", translation: "Base", rule: "Terminación en -e (Femenino)", explanation: "Sustantivo femenino acabado en -e.", example: "La base" },
  { word: "Especie", gender: "femenino", difficulty: "medio", translation: "Species / Kind", rule: "Terminación en -e (Femenino)", explanation: "Sustantivo femenino acabado en -e.", example: "La especie" },
  { word: "Serie", gender: "femenino", difficulty: "medio", translation: "Series", rule: "Terminación en -e (Femenino)", explanation: "Sustantivo femenino acabado en -e.", example: "La serie" },
  { word: "Carne", gender: "femenino", difficulty: "medio", translation: "Meat", rule: "Terminación en -e (Femenino)", explanation: "Sustantivo femenino acabado en -e.", example: "La carne" },

  // --- MEDIO: -ón (mayoría masculino) ---
  { word: "Pantalón", gender: "masculino", difficulty: "medio", translation: "Pants", rule: "Terminación en -ón (Masculino)", explanation: "Los sustantivos terminados en -ón suelen ser masculinos.", example: "El pantalón" },
  { word: "Camión", gender: "masculino", difficulty: "medio", translation: "Truck", rule: "Terminación en -ón (Masculino)", explanation: "Los sustantivos terminados en -ón suelen ser masculinos.", example: "El camión" },
  { word: "Avión", gender: "masculino", difficulty: "medio", translation: "Airplane", rule: "Terminación en -ón (Masculino)", explanation: "Los sustantivos terminados en -ón suelen ser masculinos.", example: "El avión" },
  { word: "Balcón", gender: "masculino", difficulty: "medio", translation: "Balcony", rule: "Terminación en -ón (Masculino)", explanation: "Los sustantivos terminados en -ón suelen ser masculinos.", example: "El balcón" },
  { word: "Corazón", gender: "masculino", difficulty: "medio", translation: "Heart", rule: "Terminación en -ón (Masculino)", explanation: "Los sustantivos terminados en -ón suelen ser masculinos.", example: "El corazón" },
  { word: "Cinturón", gender: "masculino", difficulty: "medio", translation: "Belt", rule: "Terminación en -ón (Masculino)", explanation: "Los sustantivos terminados en -ón suelen ser masculinos.", example: "El cinturón" },
  { word: "Buzón", gender: "masculino", difficulty: "medio", translation: "Mailbox", rule: "Terminación en -ón (Masculino)", explanation: "Los sustantivos terminados en -ón suelen ser masculinos.", example: "El buzón" },
  { word: "Ratón", gender: "masculino", difficulty: "medio", translation: "Mouse", rule: "Terminación en -ón (Masculino)", explanation: "Los sustantivos terminados en -ón suelen ser masculinos.", example: "El ratón" },

  // --- MEDIO: -z (excepciones masculinas) y otros consonantes ---
  { word: "Arroz", gender: "masculino", difficulty: "medio", translation: "Rice", rule: "Terminación en -z (Excepción Masculina)", explanation: "Aunque la mayoría de sustantivos en -z son femeninos, este es una excepción masculina.", example: "El arroz" },
  { word: "Lápiz", gender: "masculino", difficulty: "medio", translation: "Pencil", rule: "Terminación en -z (Excepción Masculina)", explanation: "Aunque la mayoría de sustantivos en -z son femeninos, este es una excepción masculina.", example: "El lápiz" },
  { word: "Altavoz", gender: "masculino", difficulty: "medio", translation: "Speaker (audio)", rule: "Terminación en -z (Excepción Masculina)", explanation: "Aunque la mayoría de sustantivos en -z son femeninos, este es una excepción masculina.", example: "El altavoz" },
  { word: "Hospital", gender: "masculino", difficulty: "medio", translation: "Hospital", rule: "Terminación en consonante -l", explanation: "Los sustantivos acabados en -l suelen ser masculinos.", example: "El hospital" },
  { word: "Pastel", gender: "masculino", difficulty: "medio", translation: "Cake / Pastry", rule: "Terminación en consonante -l", explanation: "Los sustantivos acabados en -l suelen ser masculinos.", example: "El pastel" },
  { word: "Cereal", gender: "masculino", difficulty: "medio", translation: "Cereal", rule: "Terminación en consonante -l", explanation: "Los sustantivos acabados en -l suelen ser masculinos.", example: "El cereal" },
  { word: "Yogur", gender: "masculino", difficulty: "medio", translation: "Yogurt", rule: "Terminación en consonante -r", explanation: "Sustantivo masculino terminado en consonante -r.", example: "El yogur" },

  // --- DIFÍCIL: origen griego en -ma (masculino) ---
  { word: "Aroma", gender: "masculino", difficulty: "difícil", translation: "Aroma", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El aroma" },
  { word: "Enigma", gender: "masculino", difficulty: "difícil", translation: "Enigma", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El enigma" },
  { word: "Estigma", gender: "masculino", difficulty: "difícil", translation: "Stigma", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El estigma" },
  { word: "Dogma", gender: "masculino", difficulty: "difícil", translation: "Dogma", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El dogma" },
  { word: "Diagrama", gender: "masculino", difficulty: "difícil", translation: "Diagram", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El diagrama" },
  { word: "Telegrama", gender: "masculino", difficulty: "difícil", translation: "Telegram", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El telegrama" },
  { word: "Panorama", gender: "masculino", difficulty: "difícil", translation: "Panorama", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El panorama" },
  { word: "Fantasma", gender: "masculino", difficulty: "difícil", translation: "Ghost", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El fantasma" },
  { word: "Lema", gender: "masculino", difficulty: "difícil", translation: "Motto / Slogan", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El lema" },
  { word: "Crucigrama", gender: "masculino", difficulty: "difícil", translation: "Crossword", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El crucigrama" },
  { word: "Holograma", gender: "masculino", difficulty: "difícil", translation: "Hologram", rule: "Origen Griego (-ma)", explanation: "Sustantivos de origen griego que terminan en -ma son tradicionalmente masculinos.", example: "El holograma" },

  // --- DIFÍCIL: -sis (mayoría femenino, con excepción masculina) ---
  { word: "Hipótesis", gender: "femenino", difficulty: "difícil", translation: "Hypothesis", rule: "Terminación en -sis (Femenino)", explanation: "Sustantivo femenino de origen griego acabado en -sis.", example: "La hipótesis" },
  { word: "Dosis", gender: "femenino", difficulty: "difícil", translation: "Dose", rule: "Terminación en -sis (Femenino)", explanation: "Sustantivo femenino de origen griego acabado en -sis.", example: "La dosis" },
  { word: "Génesis", gender: "femenino", difficulty: "difícil", translation: "Genesis / Origin", rule: "Terminación en -sis (Femenino)", explanation: "Sustantivo femenino de origen griego acabado en -sis.", example: "La génesis" },
  { word: "Metamorfosis", gender: "femenino", difficulty: "difícil", translation: "Metamorphosis", rule: "Terminación en -sis (Femenino)", explanation: "Sustantivo femenino de origen griego acabado en -sis.", example: "La metamorfosis" },
  { word: "Prótesis", gender: "femenino", difficulty: "difícil", translation: "Prosthesis", rule: "Terminación en -sis (Femenino)", explanation: "Sustantivo femenino de origen griego acabado en -sis.", example: "La prótesis" },
  { word: "Énfasis", gender: "masculino", difficulty: "difícil", translation: "Emphasis", rule: "Terminación en -sis (Masculino)", explanation: "A diferencia de la mayoría de palabras en -sis, que son femeninas, 'énfasis' es una excepción masculina.", example: "El énfasis" },

  // --- DIFÍCIL: A tónica inicial (femeninas con artículo 'el' en singular) ---
  { word: "Arma", gender: "femenino", difficulty: "difícil", translation: "Weapon", rule: "A tónica inicial", explanation: "Empieza por 'ar-' tónica. Usa el artículo 'el' en singular para evitar cacofonía, pero es femenina (el arma blanca, las armas).", example: "El arma (femenino)" },
  { word: "Ancla", gender: "femenino", difficulty: "difícil", translation: "Anchor", rule: "A tónica inicial", explanation: "Empieza por 'an-' tónica. Usa 'el' en singular pero es femenina (el ancla pesada, las anclas).", example: "El ancla (femenino)" },
  { word: "Ala", gender: "femenino", difficulty: "difícil", translation: "Wing", rule: "A tónica inicial", explanation: "Empieza por 'a' tónica. Usa 'el' en singular pero es femenina (el ala rota, las alas).", example: "El ala (femenino)" },
  { word: "Asta", gender: "femenino", difficulty: "difícil", translation: "Horn / Flagpole", rule: "A tónica inicial", explanation: "Empieza por 'as-' tónica. Usa 'el' en singular pero es femenina (el asta del toro, las astas).", example: "El asta (femenino)" },
  { word: "Habla", gender: "femenino", difficulty: "difícil", translation: "Speech", rule: "A tónica inicial", explanation: "Empieza por 'ha' tónica. Usa 'el' en singular pero es femenina (el habla popular, las hablas).", example: "El habla (femenino)" },
  { word: "Hada", gender: "femenino", difficulty: "difícil", translation: "Fairy", rule: "A tónica inicial", explanation: "Empieza por 'ha' tónica. Usa 'el' en singular pero es femenina (el hada madrina, las hadas).", example: "El hada (femenino)" },
  { word: "Ave", gender: "femenino", difficulty: "difícil", translation: "Bird", rule: "A tónica inicial", explanation: "Empieza por 'a' tónica. Usa 'el' en singular pero es femenina (el ave rapaz, las aves).", example: "El ave (femenino)" },

  // --- DIFÍCIL: homónimos (cambian de significado según el género) ---
  { word: "Pendiente (arete)", gender: "masculino", difficulty: "difícil", translation: "Earring", rule: "Homónimo / Significado", explanation: "Como joya que cuelga de la oreja es masculino ('el pendiente'). Como inclinación del terreno es femenino ('la pendiente').", example: "El pendiente" },
  { word: "Pendiente (cuesta)", gender: "femenino", difficulty: "difícil", translation: "Slope", rule: "Homónimo / Significado", explanation: "Como inclinación del terreno es femenino ('la pendiente'). Como joya de la oreja es masculino ('el pendiente').", example: "La pendiente" },
  { word: "Coma (médico)", gender: "masculino", difficulty: "difícil", translation: "Coma (medical)", rule: "Homónimo / Significado", explanation: "El estado de inconsciencia profunda es masculino ('el coma'). El signo de puntuación es femenino ('la coma').", example: "El coma" },
  { word: "Coma (puntuación)", gender: "femenino", difficulty: "difícil", translation: "Comma", rule: "Homónimo / Significado", explanation: "El signo de puntuación es femenino ('la coma'). El estado de inconsciencia es masculino ('el coma').", example: "La coma" },
  { word: "Cólera (enfermedad)", gender: "masculino", difficulty: "difícil", translation: "Cholera (disease)", rule: "Homónimo / Significado", explanation: "La enfermedad infecciosa es masculina ('el cólera'). El sentimiento de ira es femenino ('la cólera').", example: "El cólera" },
  { word: "Cólera (ira)", gender: "femenino", difficulty: "difícil", translation: "Wrath / Anger", rule: "Homónimo / Significado", explanation: "El sentimiento de ira es femenino ('la cólera'). La enfermedad es masculina ('el cólera').", example: "La cólera" },
  { word: "Corte (tajo)", gender: "masculino", difficulty: "difícil", translation: "Cut", rule: "Homónimo / Significado", explanation: "El tajo o corte de pelo/tela es masculino ('el corte'). La residencia real es femenina ('la corte').", example: "El corte" },
  { word: "Corte (real)", gender: "femenino", difficulty: "difícil", translation: "Royal court", rule: "Homónimo / Significado", explanation: "La residencia y séquito de un rey es femenina ('la corte'). Un tajo o corte de pelo es masculino ('el corte').", example: "La corte" },
  { word: "Moral (árbol)", gender: "masculino", difficulty: "difícil", translation: "Mulberry tree", rule: "Homónimo / Significado", explanation: "El árbol que da moras es masculino ('el moral'). La ética o el ánimo es femenino ('la moral').", example: "El moral" },
  { word: "Moral (ética)", gender: "femenino", difficulty: "difícil", translation: "Morality", rule: "Homónimo / Significado", explanation: "La ética o el ánimo es femenino ('la moral'). El árbol que da moras es masculino ('el moral').", example: "La moral" },
  { word: "Policía (persona)", gender: "masculino", difficulty: "difícil", translation: "Policeman", rule: "Homónimo / Significado", explanation: "El agente de policía (hombre) es masculino ('el policía'). El cuerpo o institución es femenino ('la policía').", example: "El policía" },
  { word: "Policía (institución)", gender: "femenino", difficulty: "difícil", translation: "Police force", rule: "Homónimo / Significado", explanation: "El cuerpo o institución policial es femenino ('la policía'). El agente hombre es masculino ('el policía').", example: "La policía" },
  { word: "Vocal (persona)", gender: "masculino", difficulty: "difícil", translation: "Board member", rule: "Homónimo / Significado", explanation: "El miembro de una junta o comité es masculino ('el vocal'). La letra del alfabeto es femenina ('la vocal').", example: "El vocal" },
  { word: "Vocal (letra)", gender: "femenino", difficulty: "difícil", translation: "Vowel", rule: "Homónimo / Significado", explanation: "La letra del alfabeto (a, e, i, o, u) es femenina ('la vocal'). El miembro de una junta es masculino ('el vocal').", example: "La vocal" },
  { word: "Margen (página)", gender: "masculino", difficulty: "difícil", translation: "Margin (page)", rule: "Homónimo / Significado", explanation: "El espacio en blanco de una página o documento es masculino ('el margen'). La orilla de un río, en uso literario, es femenina ('la margen').", example: "El margen" },
  { word: "Margen (orilla)", gender: "femenino", difficulty: "difícil", translation: "Riverbank", rule: "Homónimo / Significado", explanation: "La orilla de un río, en uso literario, es femenina ('la margen'). El espacio en blanco de una página es masculino ('el margen').", example: "La margen" },
  { word: "Parte (informe)", gender: "masculino", difficulty: "difícil", translation: "Report / Bulletin", rule: "Homónimo / Significado", explanation: "El informe o comunicado oficial es masculino ('el parte médico'). Una porción de un todo es femenina ('la parte').", example: "El parte" },
  { word: "Parte (porción)", gender: "femenino", difficulty: "difícil", translation: "Part / Portion", rule: "Homónimo / Significado", explanation: "Una porción de un todo es femenina ('la parte'). Un informe oficial es masculino ('el parte').", example: "La parte" },
  { word: "Guardia (persona)", gender: "masculino", difficulty: "difícil", translation: "Guard (person)", rule: "Homónimo / Significado", explanation: "La persona que vigila es masculina ('el guardia'). El servicio de vigilancia es femenino ('la guardia').", example: "El guardia" },
  { word: "Guardia (servicio)", gender: "femenino", difficulty: "difícil", translation: "Guard duty / Watch", rule: "Homónimo / Significado", explanation: "El servicio o turno de vigilancia es femenino ('la guardia'). La persona que vigila es masculina ('el guardia').", example: "La guardia" },
  { word: "Editorial (artículo)", gender: "masculino", difficulty: "difícil", translation: "Editorial (opinion piece)", rule: "Homónimo / Significado", explanation: "El artículo de opinión de un periódico es masculino ('el editorial'). La empresa que publica libros es femenina ('la editorial').", example: "El editorial" },
  { word: "Editorial (empresa)", gender: "femenino", difficulty: "difícil", translation: "Publishing house", rule: "Homónimo / Significado", explanation: "La empresa que publica libros es femenina ('la editorial'). El artículo de opinión es masculino ('el editorial').", example: "La editorial" },
  { word: "Delta (río)", gender: "masculino", difficulty: "difícil", translation: "River delta", rule: "Homónimo / Significado", explanation: "La desembocadura de un río en varios brazos es masculina ('el delta'). La letra griega es femenina ('la delta').", example: "El delta" },
  { word: "Delta (letra)", gender: "femenino", difficulty: "difícil", translation: "Delta (Greek letter)", rule: "Homónimo / Significado", explanation: "La letra griega es femenina ('la delta'). La desembocadura de un río es masculina ('el delta').", example: "La delta" },
  { word: "Coral (animal)", gender: "masculino", difficulty: "difícil", translation: "Coral (marine organism)", rule: "Homónimo / Significado", explanation: "El organismo marino y el material que forma es masculino ('el coral'). Un grupo de personas que cantan es femenino ('la coral').", example: "El coral" },
  { word: "Coral (coro)", gender: "femenino", difficulty: "difícil", translation: "Choir", rule: "Homónimo / Significado", explanation: "El grupo de personas que cantan juntas es femenino ('la coral'). El organismo marino es masculino ('el coral').", example: "La coral" },
  { word: "Pez (animal)", gender: "masculino", difficulty: "difícil", translation: "Fish (animal)", rule: "Homónimo / Significado", explanation: "El animal acuático es masculino ('el pez'). La sustancia negra y pegajosa (brea) es femenina ('la pez').", example: "El pez" },
  { word: "Pez (brea)", gender: "femenino", difficulty: "difícil", translation: "Tar / Pitch", rule: "Homónimo / Significado", explanation: "La sustancia negra y pegajosa (brea) es femenina ('la pez'). El animal acuático es masculino ('el pez').", example: "La pez" },

  // --- DIFÍCIL: monosílabos y palabras cortas ---
  { word: "Mes", gender: "masculino", difficulty: "difícil", translation: "Month", rule: "Monosílabo / Palabra corta", explanation: "'Mes' es un sustantivo masculino terminado en consonante -s.", example: "El mes" },
  { word: "Vez", gender: "femenino", difficulty: "difícil", translation: "Time / Occurrence", rule: "Monosílabo / Palabra corta", explanation: "'Vez' es un sustantivo femenino terminado en -z, a pesar de ser monosílabo.", example: "La vez" },
  { word: "Fe", gender: "femenino", difficulty: "difícil", translation: "Faith", rule: "Monosílabo / Palabra corta", explanation: "'Fe' es un sustantivo femenino de una sola sílaba.", example: "La fe" }
];

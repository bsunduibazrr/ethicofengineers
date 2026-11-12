export type Direction = "across" | "down";

export type CrosswordEntry = {
  id: string;
  number: number;
  direction: Direction;
  row: number;
  col: number;
  answer: string;
  clue: string;
};

export type CrosswordPuzzle = {
  id: string;
  title: string;
  subtitle: string;
  rows: number;
  cols: number;
  entries: CrosswordEntry[];
};

/*
  Схем (7 мөр × 8 багана):

     0 1 2 3 4 5 6 7
  0        Т А Р Х И
  1  Р       М   Ү
  2  О       Ь   Н
  3  Б И Е   Д
  4  О       Р
  5  Т Е Г М А Р К
  6          Л
*/
export const crosswords: CrosswordPuzzle[] = [
  {
    id: "easy",
    title: "Амьдрал 3.0",
    subtitle: " ",
    rows: 7,
    cols: 8,
    entries: [
      {
        id: "1-across",
        number: 1,
        direction: "across",
        row: 0,
        col: 3,
        answer: "ТАРХИ",
        clue: "Бодож сэтгэдэг эрхтэн",
      },
      {
        id: "5-across",
        number: 5,
        direction: "across",
        row: 3,
        col: 0,
        answer: "БИЕ",
        clue: "Толгой, гар, хөлтэй хэсэг",
      },
      {
        id: "6-across",
        number: 6,
        direction: "across",
        row: 5,
        col: 0,
        answer: "ТЕГМАРК",
        clue: "«Life 3.0» номыг бичсэн Макс ...",
      },
      {
        id: "2-down",
        number: 2,
        direction: "down",
        row: 0,
        col: 4,
        answer: "АМЬДРАЛ",
        clue: "Номын нэр: «... 3.0»",
      },
      {
        id: "3-down",
        number: 3,
        direction: "down",
        row: 0,
        col: 6,
        answer: "ХҮН",
        clue: "Бид бүгд юу вэ? (Амьдрал 2.0)",
      },
      {
        id: "4-down",
        number: 4,
        direction: "down",
        row: 1,
        col: 0,
        answer: "РОБОТ",
        clue: "ASIMO шиг хүн хэлбэрийн машин",
      },
    ],
  },
];

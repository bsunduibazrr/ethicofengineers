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
  Схем (11 мөр × 8 багана; · нь хоосон нүд):

      0 1 2 3 4 5 6 7
   0  · · · Т А Р Х И
   1  Р · · · М · · ·
   2  О · · · Ь · · ·
   3  Б · · · Д · · ·
   4  О · · · Р · С ·
   5  Т Е Г М А Р К ·
   6  · · · · Л · Е ·
   7  · · · · · · П ·
   8  У Т О П И С Т ·
   9  · · · · · · И ·
  10  · · · · · · К ·
*/
export const crosswords: CrosswordPuzzle[] = [
  {
    id: "easy",
    title: "Амьдрал 3.0",
    subtitle: " ",
    rows: 11,
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
        row: 5,
        col: 0,
        answer: "ТЕГМАРК",
        clue: "Life 3.0 номыг бичсэн Макс ...",
      },
      {
        id: "6-across",
        number: 6,
        direction: "across",
        row: 8,
        col: 0,
        answer: "УТОПИСТ",
        clue: "AI удахгүй бий болж, сайн үр дүн авчирна гэж үздэг хүн",
      },
      {
        id: "2-down",
        number: 2,
        direction: "down",
        row: 0,
        col: 4,
        answer: "АМЬДРАЛ",
        clue: "Номын нэр: ... 3.0",
      },
      {
        id: "3-down",
        number: 3,
        direction: "down",
        row: 1,
        col: 0,
        answer: "РОБОТ",
        clue: "ASIMO шиг хүн хэлбэрийн машин",
      },
      {
        id: "4-down",
        number: 4,
        direction: "down",
        row: 4,
        col: 6,
        answer: "СКЕПТИК",
        clue: "Хүн шиг AI ойрын үед бий болохгүй гэж үздэг хүн",
      },
    ],
  },
];

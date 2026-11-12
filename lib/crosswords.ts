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

// Coordinates are zero-based. Entries sharing a starting cell share its number.
// All answers come from slides/content.source.json; spaces are omitted in the grid.
export const crosswords: CrosswordPuzzle[] = [
  {
    id: "big-questions",
    title: "ЖИШЭЭ 1",
    subtitle: " ",
    rows: 10,
    cols: 9,
    entries: [
      {
        id: "questions-1-down",
        number: 1,
        direction: "down",
        row: 0,
        col: 4,
        answer: "ЗОРИЛГО",
        clue: "Оюун ухааны тодорхойлолтод дурддаг, хүрэхээр тэмүүлж буй үр дүн.",
      },
      {
        id: "questions-2-across",
        number: 2,
        direction: "across",
        row: 2,
        col: 0,
        answer: "МАТЕРИ",
        clue: "Номын 2-р бүлгийн нэр: «___ ухаалаг болох нь».",
      },
      {
        id: "questions-2-down",
        number: 2,
        direction: "down",
        row: 2,
        col: 0,
        answer: "МЭДЭЭЛЭЛ",
        clue: "Чулуу, цаас, хатуу диск, ДНХ зэрэг өөр өөр орчинд хадгалж болдог зүйл.",
      },
      {
        id: "questions-3-down",
        number: 3,
        direction: "down",
        row: 3,
        col: 6,
        answer: "УХАМСАР",
        clue: "Номын 8-р бүлгийн сэдэв; өөрийн дотоод туршлага, мэдрэмжтэй холбоотой ойлголт.",
      },
      {
        id: "questions-4-across",
        number: 4,
        direction: "across",
        row: 5,
        col: 2,
        answer: "ТЕГМАРК",
        clue: "«Амьдрал 3.0» номын зохиолч Максын овог.",
      },
      {
        id: "questions-5-across",
        number: 5,
        direction: "across",
        row: 9,
        col: 2,
        answer: "АМЬДРАЛ",
        clue: "Өөрийн бүтцийг хадгалж, үржиж чаддаг процессыг номд юу гэж тодорхойлсон бэ?",
      },
    ],
  },
  {
    id: "thinking-machines",
    title: "ЖИШЭЭ 2",
    subtitle: " ",
    rows: 9,
    cols: 11,
    entries: [
      {
        id: "machines-1-down",
        number: 1,
        direction: "down",
        row: 0,
        col: 2,
        answer: "ХЕББ",
        clue: "«Хамт идэвхждэг мэдрэлийн эсүүдийн холбоо хүчтэй болдог» дүрэм хэний нэрээр нэрлэгдсэн бэ?",
      },
      {
        id: "machines-2-down",
        number: 2,
        direction: "down",
        row: 0,
        col: 5,
        answer: "ТООЦООЛОЛ",
        clue: "Нэг төлөвийг нөгөөд хувиргаж, оролтоос гаралт гаргах үйл явц.",
      },
      {
        id: "machines-3-down",
        number: 3,
        direction: "down",
        row: 0,
        col: 8,
        answer: "ТЬЮРИНГ",
        clue: "1936 онд хангалттай хугацаа, хадгалах багтаамжтай машин ямар ч тооцоо хийж чадна гэж баталсан Аланы овог.",
      },
      {
        id: "machines-4-across",
        number: 4,
        direction: "across",
        row: 1,
        col: 1,
        answer: "НЕЙРОН",
        clue: " ",
      },
      {
        id: "machines-5-across",
        number: 5,
        direction: "across",
        row: 4,
        col: 4,
        answer: "ХОПФИЛД",
        clue: "1982 онд тархины холбоогоор санах чадварыг сүлжээгээр загварчилсан Жоны овог.",
      },
      {
        id: "machines-6-across",
        number: 6,
        direction: "across",
        row: 7,
        col: 0,
        answer: "САНАХОЙ",
        clue: "Хэд хэдэн тогтвортой төлөв ашиглан өгөгдөл хадгалдаг чадвар. (Хоёр үг, зайгүй бичнэ.)",
      },
    ],
  },
];

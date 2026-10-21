"use client";

import { BookCover, Group, Header, Photo, R } from "@/components/ui";
import { COURSE, PRESENTER } from "@/deck.config";

/* ───────────── 1. Нүүр ───────────── */

export function Cover() {
  return (
    <div className="cover">
      <div className="cover-text">
        <R className="kicker">{COURSE}</R>
        <R>
          <h1 className="cover-title">
            Амьдрал <span>3.0</span>
          </h1>
        </R>
        <R className="cover-sub">Хиймэл оюуны эринд хүн байхуй</R>
        <R className="cover-en">
          Life 3.0: Being Human in the Age of Artificial Intelligence
        </R>
        <Group className="cover-meta">
          <R>
            <small>Зохиолч</small>
            <b>Макс Тегмарк</b>
          </R>
          <R>
            <small>Сэдэв</small>
            <b>Номын 1, 2-р бүлэг</b>
          </R>
          <R>
            <small>Илтгэгч</small>
            <b>{PRESENTER}</b>
          </R>
        </Group>
      </div>
      <div className="cover-books">
        <BookCover
          src="/img/cover-us-2017.jpg"
          alt="Life 3.0, анхны хэвлэл"
          className="cb-back"
          style={{ rotate: -5 }}
        />
        <BookCover
          src="/img/cover-mn.jpg"
          alt="Амьдрал 3.0, монгол хэвлэл"
          className="cb-front"
          style={{ rotate: 4 }}
        />
      </div>
    </div>
  );
}

/* ───────────── 2. Зохиолч ───────────── */

const facts = [
  { k: "Төрсөн", v: "1967 онд Шведийн Стокгольм хотод" },
  {
    k: "Боловсрол",
    v: "Стокгольмд эдийн засаг, физик сурч, 1994 онд UC Berkeley-д доктор хамгаалсан",
  },
  { k: "Ажил", v: "2004 оноос MIT-д физикийн профессороор ажиллаж байна" },
  {
    k: "Байгууллага",
    v: "2014 онд Future of Life Institute-ийг хамтран байгуулж, ерөнхийлөгч нь болсон",
  },
  {
    k: "Шагнал",
    v: "TIME сэтгүүлийн AI салбарын нөлөөтэй 100 хүн (2023), Шведийн Инженерийн ШУА-ийн алтан медаль (2019)",
  },
];

export function Author() {
  return (
    <div className="author">
      <Photo
        src="/img/tegmark.jpg"
        alt="Макс Тегмарк"
        className="author-photo"
        pos="50% 20%"
        credit="Зураг: Web Summit, CC BY 4.0"
      />
      <div className="author-body">
        <Header
          kicker="Зохиолчийн тухай"
          title="Макс Тегмарк"
          sub="Швед-Америк физикч, сансар судлаач. Хиймэл оюуны эрсдэлийн тухай дэлхийн ярианы гол дуу хоолойн нэг."
        />
        <Group className="dl">
          {facts.map((f) => (
            <R className="dl-row" key={f.k}>
              <span>{f.k}</span>
              <p>{f.v}</p>
            </R>
          ))}
        </Group>
        <R className="author-books">
          <img src="/img/cover-omu.jpg" alt="Our Mathematical Universe" />
          <img src="/img/cover-us-2017.jpg" alt="Life 3.0" />
          <div>
            <span className="label">Номууд</span>
            <p>
              <i>Our Mathematical Universe</i> (2014) — «Математик орчлон»-ы таамаглал
            </p>
            <p>
              <i>Life 3.0</i> (2017) — хиймэл оюун ба хүн төрөлхтний ирээдүй
            </p>
          </div>
        </R>
      </div>
    </div>
  );
}

/* ───────────── 3. Ном ба хэвлэлүүд ───────────── */

const editions = [
  { src: '/img/cover-us-2017.jpg', y: '2017', t: 'Анхны хэвлэл', d: 'Alfred A. Knopf, АНУ · хатуу хавтас' },
  { src: '/img/cover-uk-2017.jpg', y: '2017', t: 'Их Британи', d: 'Allen Lane · хатуу хавтас' },
  { src: '/img/cover-us-2018.jpg', y: '2018', t: 'АНУ', d: 'Vintage · зөөлөн хавтас' },
  { src: '/img/cover-uk-2018.jpg', y: '2018', t: 'Их Британи', d: 'Penguin · зөөлөн хавтас' },
  { src: '/img/cover-mn.jpg', y: 'МН', t: 'Монгол хэвлэл', d: 'Монсудар · 356 хуудас', mn: true },
];

export function Book() {
  return (
    <div className="editions">
      <Header kicker="Номын тухай" title="Ном ба хэвлэлүүд" />
      <Group className="ed-row">
        {editions.map((e) => (
          <R className={`ed${e.mn ? ' mn' : ''}`} key={e.src}>
            <div className="ed-img">
              <img src={e.src} alt={e.t} />
            </div>
            <div className="ed-cap">
              <b>{e.y}</b>
              <span>{e.t}</span>
              <small>{e.d}</small>
            </div>
          </R>
        ))}
      </Group>
      <Group className="ed-bottom">
        <R className="ed-block">
          <span className="label">Монгол хэвлэл</span>
          <p>
            «Амьдрал 3.0: Хиймэл оюуны эринд хүн байхуй» · Монсудар хэвлэлийн газар · Орчуулсан Г. Үүрдмандах ·
            Редактор М. Бямбасайхан · ISBN 978-99973-1-893-0
          </p>
        </R>
        <R className="ed-block">
          <span className="label">Хүлээн авалт</span>
          <p>
            New York Times бестселлер · Барак Обамагийн «2018 оны шилдэг» жагсаалт · Илон Маск: «Унших үнэ цэнэтэй» ·
            Орос, герман, испани, хятад, япон зэрэг олон хэлээр орчуулагдсан
          </p>
        </R>
      </Group>
    </div>
  );
}

/* ───────────── 4. Номын бүтэц ───────────── */

const parts = [
  { n: '', t: 'Удиртгал: Омега багийн түүх' },
  { n: '1', t: 'Бидний цаг үеийн хамгийн чухал яриа', hl: true },
  { n: '2', t: 'Матери ухаалаг болох нь', hl: true },
  { n: '3', t: 'Ойрын ирээдүй: нээлт, алдаа, хууль, зэвсэг, ажил' },
  { n: '4', t: 'Оюун ухааны тэсрэлт үү?' },
  { n: '5', t: 'Үр дагавар: дараагийн 10 000 жил' },
  { n: '6', t: 'Сансрын өв: дараагийн тэрбум жил' },
  { n: '7', t: 'Зорилго' },
  { n: '8', t: 'Ухамсар' },
  { n: '', t: 'Төгсгөл: FLI багийн түүх' },
];

export function Structure() {
  return (
    <div className="structure">
      <div>
        <Header kicker="Номын бүтэц" title="Нэг том асуулт" />
        <R className="big-question">
          Хиймэл оюун бидний ирээдүйг хэрхэн өөрчлөх вэ — мөн <em>бид ямар ирээдүйг хүсэж байна вэ?</em>
        </R>
        <R className="sub">
          Тегмарк ирээдүйг «болох» зүйл биш, бидний <b>бүтээх</b> зүйл гэж үзэж, уншигч бүрийг энэ ярианд оролцохыг
          урьдаг.
        </R>
      </div>
      <Group className="toc">
        <R className="toc-head">Агуулга</R>
        {parts.map((p, i) => (
          <R className={`toc-row${p.hl ? ' hl' : ''}`} key={i}>
            <span className="toc-n">{p.n}</span>
            <span className="toc-t">{p.t}</span>
            {p.hl && <span className="toc-tag">Өнөөдөр</span>}
          </R>
        ))}
      </Group>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EASE, Group, Header, Photo, R } from "@/components/ui";

/* ───────────── 19. Кейс ───────────── */

const outcomes = [
  { ok: true, t: "Дундаж зорчих хугацаа 23%-иар буурсан. Зорилго биелсэн." },
  { ok: false, t: "Сургуулийн хажуугийн жижиг гудамжаар машин урсгаж эхэлсэн." },
  { ok: false, t: "Явган хүний ногоон гэрэл 12 секунд болж, хүлээх хугацаа 3 минут хүрсэн." },
  { ok: false, t: "Түргэн тусламжийн машиныг бусад машинтай адил хүлээлгэсэн." },
];

const links = [
  { ch: "1-р бүлэг", t: "Шоргоолжны жишээ", d: "Хор санаагүй ч хохирол учруулсан" },
  { ch: "1-р бүлэг", t: "Муу санаа биш, чадвар", d: "Зорилго нь бидний хүсэлтэй зөрсөн" },
  { ch: "1-р бүлэг", t: "Робот хэрэггүй", d: "Гэрлэн дохиог удирдахад л хангалттай" },
  { ch: "2-р бүлэг", t: "Оюун ухааны тодорхойлолт", d: "Нарийн AI ч зорилгодоо хүрч чадна" },
];

export function Case() {
  return (
    <div className="case">
      <Header kicker="Кейс · Зохиомол жишээ" title="Ухаалаг гэрлэн дохио" />
      <div className="case-grid">
        <div className="case-col">
          <Photo
            src="/img/ub-traffic.jpg"
            alt="Улаанбаатарын замын хөдөлгөөн"
            className="case-photo"
            pos="50% 70%"
            credit="Улаанбаатар, Orgio89, CC0"
          />
          <R className="case-p">
            Улаанбаатар хот гэрлэн дохиогоо AI-аар удирдуулахаар болжээ.
            Инженерүүд системд <b>ганцхан</b> зорилго өгсөн:
          </R>
          <R className="goal">Машинуудын дундаж зорчих хугацааг 20%-иар бууруулах.</R>
        </div>
        <Group className="case-col">
          <R className="col-h">Гурван сарын дараа</R>
          {outcomes.map((o) => (
            <R className={`outcome${o.ok ? " ok" : ""}`} key={o.t}>
              <i>{o.ok ? "✓" : "!"}</i>
              <p>{o.t}</p>
            </R>
          ))}
          <R className="case-note">
            Хэн ч муу санаагүй. AI хэлснийг нь л хийсэн.
          </R>
        </Group>
        <Group className="case-col">
          <R className="col-h">Номтой холбоо</R>
          {links.map((l) => (
            <R className="link-row" key={l.t}>
              <small>{l.ch}</small>
              <h3>{l.t}</h3>
              <p>{l.d}</p>
            </R>
          ))}
        </Group>
      </div>
    </div>
  );
}

/* ───────────── 20. Хэлэлцүүлэг ───────────── */

const qa = [
  {
    q: "Энэ AI муу санаатай байсан уу? Асуудал хаана байна вэ?",
    a: "Үгүй. AI зорилгоо яг биелүүлсэн, асуудал нь зорилгодоо байсан. Тегмаркийн хэлдгээр аюул нь муу санаа биш, бидэнтэй зөрсөн зорилго.",
  },
  {
    q: "Хохирлыг хэн хариуцах ёстой вэ? Инженер, захиалагч уу, эсвэл AI өөрөө юу?",
    a: "Машин зорилготой байж болох ч зорилгыг нь хүн өгдөг. Тэр зорилгыг тодорхойлж, туршиж, ашиглалтад оруулсан хүмүүс хариуцлага хүлээнэ.",
  },
  {
    q: "Зорилгыг яаж томьёолсон бол зөв байх байсан бэ?",
    a: "Ганц үзүүлэлт биш, хэд хэдэн хязгаарлалт тавих: явган хүн, сургууль, яаралтай тусламж. Мөн эхлээд жижиг хэсэгт туршиж, хүн хянадаг байх.",
  },
  {
    q: "Та гурван байр суурийн алинд нь илүү ойр вэ?",
    a: "Утопист, скептик, ашигтай AI хөдөлгөөн. Тегмарк өөрөө гурав дахьд нь багтдаг: сайн ирээдүй өөрөө ирэхгүй, түүний төлөө одооноос ажиллах хэрэгтэй.",
  },
];

export function QA() {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  return (
    <div className="qa">
      <Header
        kicker="Хэлэлцүүлэг"
        title="Та юу гэж бодож байна?"
        sub="Эхлээд санал бодлоо хэлээрэй. Дараа нь номонд юу гэж бичсэнийг хамт харъя."
      />
      <Group className="qa-grid">
        {qa.map((x, i) => {
          const isOpen = open.includes(i);
          return (
            <R key={i}>
              <button className={`qa-card${isOpen ? " open" : ""}`} onClick={() => toggle(i)}>
                <span className="qa-n">{i + 1}</span>
                <div className="qa-body">
                  <h3>{x.q}</h3>
                  <AnimatePresence initial={false} mode="wait">
                    {isOpen ? (
                      <motion.p
                        key="a"
                        className="qa-a"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        {x.a}
                      </motion.p>
                    ) : (
                      <motion.span
                        key="h"
                        className="qa-hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        Хариулт харах
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </R>
          );
        })}
      </Group>
      <R className="thanks">
        Анхаарал хандуулсанд баярлалаа! <span>Асуулт байвал асуугаарай.</span>
      </R>
    </div>
  );
}

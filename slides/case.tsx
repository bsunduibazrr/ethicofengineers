"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EASE, Group, Header, Photo, R } from "@/components/ui";

/* ───────────── 20. Кейс ───────────── */

const outcomes = [
  { ok: true, t: "Машинаар зорчих дундаж хугацаа 23%-иар багасав." },
  { ok: false, t: "Сургуулийн дэргэдэх замын ачаалал нэмэгдэв." },
  { ok: false, t: "Явган зорчигчид ногоон гэрлээ 3 минут хүртэл хүлээв." },
  { ok: false, t: "Түргэн тусламж ч бусад машинтай адил хүлээв." },
];

const links = [
  { ch: "Явган зорчигч", t: "Аюулгүй гарц", d: "Хүүхэд, ахмад хүн тайван гарч амжих хугацаа." },
  { ch: "Яаралтай тусламж", t: "Замын давуу эрх", d: "Түргэн тусламжийг саадгүй нэвтрүүлэх нөхцөл." },
  { ch: "Ашиглалт", t: "Хүний хяналт", d: "Асуудлыг илрүүлж, системийг зогсоох боломж." },
];

export function Case() {
  return (
    <div className="case">
      <Header kicker="Кейс · Зохиомол жишээ" title="Гэрлэн дохиог AI-д даатгавал" />
      <div className="case-grid">
        <div className="case-col">
          <Photo
            src="/img/ub-traffic.jpg"
            alt="Улаанбаатарын замын хөдөлгөөн"
            className="case-photo"
            pos="50% 70%"
          />
          <R className="case-p">
            Хотын нэг дүүрэгт гэрлэн дохиог AI-аар удирдах туршилт хийжээ.
            Системд өгсөн зорилго:
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
            Зорилго биелсэн. Гэхдээ хүн бүрийн хэрэгцээ даалгаварт багтаагүй.
          </R>
        </Group>
        <Group className="case-col">
          <R className="col-h">Даалгаварт юу дутсан бэ?</R>
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

/* ───────────── 21. Хэлэлцүүлэг ───────────── */

const qa = [
  {
    q: "Энэ системийг амжилттай гэж үзэх үү?",
    a: "Зорчих хугацаа багассан ч явган зорчигч, түргэн тусламж хохирсон. Ганц үзүүлэлтээр нийт үр дүнг дүгнэхэд учир дутагдалтай.",
  },
  {
    q: "Алдаа нь AI-д байсан уу, даалгаварт байсан уу?",
    a: "Систем өгсөн зорилгоо биелүүлсэн. Харин аюулгүй гарц, яаралтай тусламжийн хэрэгцээг зорилгод нь тусгаагүй.",
  },
  {
    q: "Та инженер нь байсан бол юуг өөрчлөх вэ?",
    a: "Явган хүний гарах хугацаа, түргэн тусламжийн давуу эрхийг заавал хангах нөхцөл болгоно. Үүний хүрээнд зорчих хугацааг багасгана.",
  },
  {
    q: "Ийм системийн хариуцлагыг хэн хүлээх вэ?",
    a: "Захиалагч ямар зорилго тавьсан, инженер яаж туршсан, ашиглагч хэрхэн хянасныг хамт авч үзнэ. AI-д даатгасан ч хүний хариуцлага үлдэнэ.",
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
        title="Та энэ шийдлийг зөвшөөрөх үү?"
        sub="Кейсийг инженер, зорчигч, хотын захиргааны байр сууринаас ярилцъя."
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
    </div>
  );
}

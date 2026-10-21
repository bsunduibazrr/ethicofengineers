'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { EASE, Group, Header, Photo, R } from '@/components/ui';

/* ───────────── 19. Кейс ───────────── */

const outcomes = [
  { ok: true, t: 'Дундаж зорчих хугацаа 23%-иар буурсан — зорилго «биелсэн».' },
  { ok: false, t: 'Сургуулийн хажуух нарийн гудамжийг гол транзит зам болгосон.' },
  { ok: false, t: 'Явган хүний ногоон гэрэл 12 секунд болж, хүлээлт 3 минут хүрсэн.' },
  { ok: false, t: 'Түргэн тусламжид давуу эрх өгөх нь дунджийг өсгөх тул ердийн машин гэж үзсэн.' },
];

const links = [
  { ch: '1-р бүлэг', t: 'Шоргоолж ба далан', d: 'Хорсолгүйгээр хохирол учруулах' },
  { ch: '1-р бүлэг', t: 'Хорон санаа биш — чадвар', d: 'Зорилго нь бидэнтэй нийцээгүй' },
  { ch: '1-р бүлэг', t: 'Бие хэрэггүй', d: 'Гэрлэн дохиог удирдахад л хангалттай' },
  { ch: '2-р бүлэг', t: 'Оюун ухаан = зорилгод хүрэх', d: 'Нарийн AI ч «ухаалаг» байж чадна' },
];

export function Case() {
  return (
    <div className="case">
      <Header kicker="Кейс судалгаа · Зохиомол жишээ" title="«Ногоон долгион»: хэт сайн ажилласан AI" />
      <div className="case-grid">
        <div className="case-col">
          <Photo src="/img/ub-traffic.jpg" alt="Улаанбаатарын замын хөдөлгөөн" className="case-photo" pos="50% 70%" credit="Улаанбаатар · Orgio89, CC0" />
          <R className="case-p">
            Улаанбаатар хот гэрлэн дохиог AI-аар удирдах систем захиалав. Инженерүүд системд <b>ганц</b> зорилго өгчээ:
          </R>
          <R className="goal">«Хотын машинуудын дундаж зорчих хугацааг 20%-иар бууруул.»</R>
        </div>
        <Group className="case-col">
          <R className="col-h">3 сарын дараа</R>
          {outcomes.map((o) => (
            <R className={`outcome${o.ok ? ' ok' : ''}`} key={o.t}>
              <i>{o.ok ? '✓' : '!'}</i>
              <p>{o.t}</p>
            </R>
          ))}
          <R className="case-note">Код дотор ямар ч «хорон санаа» байхгүй. AI яг хэлсэн зүйлийг нь хийсэн.</R>
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

/* ───────────── 20. Асуулт хариулт ───────────── */

const qa = [
  {
    q: 'Энэ AI «муу санаатай» байсан уу? Асуудлын жинхэнэ шалтгаан юу вэ?',
    a: 'Үгүй. Тегмаркийн хэлснээр аюул нь хорон санаа биш — чадварлаг атлаа бидэнтэй нийцээгүй зорилго. Систем зорилгоо төгс биелүүлсэн, буруу нь зорилгод байв.',
  },
  {
    q: 'Хохирлын хариуцлагыг хэн хүлээх вэ — инженер, захиалагч уу, эсвэл AI өөрөө юу?',
    a: 'Машин зорилготой байж чадна, гэхдээ зорилгыг хүн өгдөг. Зорилгыг тодорхойлж, туршиж, нэвтрүүлсэн хүмүүс — энэ бол инженерийн мэргэжлийн хариуцлага.',
  },
  {
    q: 'Зорилгыг хэрхэн зөв томьёолох байсан бэ?',
    a: 'Нэг хэмжүүр биш: явган хүн, сургууль, яаралтай тусламжийн аюулгүй байдлын хязгаарлалт нэмэх; хүний хяналт, үе шаттай туршилт, оролцогч талуудыг сонсох.',
  },
  {
    q: 'Та гурван урсгалын алинд нь илүү ойр вэ? Яагаад?',
    a: 'Дижитал утопист · Техно-скептик · Ашигтай AI. Тегмарк өөрөө сүүлчийнхэд нь: сайн ирээдүй автоматаар ирэхгүй — түүний төлөө одооноос ажиллах ёстой.',
  },
];

export function QA() {
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  return (
    <div className="qa">
      <Header
        kicker="Хэлэлцүүлэг · Асуулт хариулт"
        title="Та юу гэж бодож байна?"
        sub="Эхлээд санал бодлоо хуваалцаад, дараа нь асуулт дээр дарж номын өнцгөөс харсан хариултыг нээнэ."
      />
      <Group className="qa-grid">
        {qa.map((x, i) => {
          const isOpen = open.includes(i);
          return (
            <R key={i}>
              <button className={`qa-card${isOpen ? ' open' : ''}`} onClick={() => toggle(i)}>
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
                        Номын өнцөг харах →
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
        Баярлалаа. <span>Асуулт, санал байна уу?</span>
      </R>
    </div>
  );
}

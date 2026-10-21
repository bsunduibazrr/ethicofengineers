"use client";

import { motion } from "framer-motion";
import { EASE, Group, Header, Photo, R } from "@/components/ui";
import { Divider } from "./chapter1";

export function Ch2Divider() {
  return (
    <Divider
      num="02"
      label="2-р бүлэг"
      title="Матери ухаалаг болох нь"
      en="Matter Turns Intelligent"
      epigraph={{
        text: "Устөрөгчид хангалттай хугацаа өгвөл хүн болж хувирдаг.",
        who: "Эдвард Роберт Харрисон",
      }}
      pills={["Оюун ухаан", "Санах ой", "Тооцоолол", "Суралцах"]}
      img="/img/chip-die.jpg"
      credit="Intel 80486 процессорын цөм, 1.2 сая транзистортой"
    />
  );
}

/* ───────────── 14. Оюун ухаан ───────────── */

const spectrum = [
  { x: 5, t: "Тооцоолуур", d: "зөвхөн тоо боддог" },
  { x: 32, t: "Deep Blue", d: "зөвхөн шатар" },
  { x: 62, t: "Хүн", d: "олон зүйл чаддаг" },
  { x: 93, t: "AGI", d: "бараг бүгдийг", hot: true },
];

export function Intelligence() {
  return (
    <div className="intel">
      <Header
        kicker="2-р бүлэг"
        title="Оюун ухаан гэж юу вэ?"
        sub="Тегмарк үүнийг «нарийн төвөгтэй зорилгод хүрэх чадвар» гэж маш өргөн утгаар тодорхойлдог. Ингэхээр хүн, амьтан, машин бүгд хамаарна."
      />
      <R className="spectrum">
        <div className="spec-ends">
          <span>← Нарийн</span>
          <span>Өргөн →</span>
        </div>
        <div className="spec-track">
          <motion.div
            className="spec-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 1.4, ease: EASE }}
          />
          {spectrum.map((s, i) => (
            <motion.div
              key={s.t}
              className={`spec-mark${s.hot ? " hot" : ""}`}
              style={{ left: `${s.x}%`, x: "-50%" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.22, duration: 0.6, ease: EASE }}
            >
              <i />
              <b>{s.t}</b>
              <small>{s.d}</small>
            </motion.div>
          ))}
        </div>
      </R>
      <div className="intel-grid">
        <Photo
          src="/img/deep-blue.jpg"
          alt="Deep Blue"
          className="intel-photo"
          pos="50% 40%"
          credit="IBM Deep Blue, Anton Chiang, CC BY 2.0"
        />
        <Group className="intel-cols">
          <R className="col">
            <span className="label">IQ хангалтгүй</span>
            <h3>Нэг тоогоор хэмжихгүй</h3>
            <p>
              Тооцоолуур биднээс хурдан тоо боддог ч өөр юу ч чаддаггүй. Оюун
              ухаан олон төрлийн чадвараас бүрддэг.
            </p>
          </R>
          <R className="col">
            <span className="label">Нарийн AI</span>
            <h3>Ганц ажилд л сайн</h3>
            <p>
              Deep Blue 1997 онд Каспаровыг хожсон. Гэхдээ шатраас өөр юм мэддэггүй
              байсан.
            </p>
          </R>
          <R className="col accent">
            <span className="label">AGI</span>
            <h3>Ерөнхий оюун ухаан</h3>
            <p>
              Шинэ зүйл сурахыг оролцуулаад бараг ямар ч ажлыг хүнээс дутахгүй
              хийж чадах AI.
            </p>
          </R>
        </Group>
      </div>
    </div>
  );
}

/* ───────────── 15. Моравецын ландшафт ───────────── */

const peaks = [
  { x: 120, y: 470, t: "Арифметик" },
  { x: 285, y: 486, t: "Шатар" },
  { x: 430, y: 455, t: "Го" },
  { x: 575, y: 476, t: "Яриа таних" },
  { x: 740, y: 352, t: "Жолоодлого" },
  { x: 905, y: 372, t: "Орчуулга" },
  { x: 1070, y: 228, t: "Программчлал" },
  { x: 1215, y: 262, t: "Ном бичих" },
  { x: 1385, y: 92, t: "AI дизайн", flag: true },
  { x: 1540, y: 212, t: "Шинжлэх ухаан" },
];

const MOUNTAIN =
  "M0 600 L0 505 C 60 470, 150 470, 210 492 C 250 506, 300 510, 340 492 C 380 474, 400 455, 440 460 " +
  "C 490 466, 520 492, 570 484 C 630 474, 660 380, 720 366 C 770 354, 800 392, 850 392 C 890 392, 900 380, 930 384 " +
  "C 990 392, 1010 262, 1070 244 C 1120 230, 1150 282, 1210 278 C 1260 274, 1320 112, 1380 102 " +
  "C 1430 94, 1470 200, 1520 222 C 1570 244, 1610 290, 1640 300 L1640 600 Z";

export function Landscape() {
  return (
    <div className="land">
      <Header
        kicker="2-р бүлэг · Ханс Моравецын санаа"
        title="Хүний чадварын ландшафт"
        sub="Уул өндөр байх тусам тэр ажил машинд хэцүү. Ус бол өнөөгийн AI-н түвшин, жил ирэх тусам нэмэгдсээр байна."
      />
      <R className="land-wrap">
        <svg viewBox="0 0 1640 600" width="1640" height="520">
          <defs>
            <pattern
              id="hatch"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke="#d9dee9" strokeWidth="2" />
            </pattern>
          </defs>
          <path d={MOUNTAIN} fill="url(#hatch)" stroke="#13296b" strokeWidth="2.5" />
          {peaks.map((p) => (
            <g key={p.t}>
              <circle cx={p.x} cy={p.y} r="5" fill="#13296b" />
              {p.flag && (
                <g>
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={p.x}
                    y2={p.y - 64}
                    stroke="#13296b"
                    strokeWidth="2.5"
                  />
                  <path
                    d={`M${p.x} ${p.y - 64} L${p.x + 40} ${p.y - 53} L${p.x} ${p.y - 42} Z`}
                    fill="#b4233c"
                  />
                </g>
              )}
              <text
                x={p.x}
                y={p.y - (p.flag ? 76 : 16)}
                textAnchor="middle"
                className={`peak-t${p.flag ? " flag" : ""}`}
              >
                {p.t}
              </text>
            </g>
          ))}
          <motion.g
            initial={{ y: 170 }}
            animate={{ y: 0 }}
            transition={{ delay: 1, duration: 3, ease: [0.33, 1, 0.68, 1] }}
          >
            <g className="wave">
              <path
                d="M-200 440 q 50 -12 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 V 700 H -200 Z"
                fill="#2c55c8"
                fillOpacity=".28"
                stroke="#2c55c8"
                strokeWidth="2"
              />
            </g>
            <text x="24" y="585" className="water-t">
              Усны түвшин — AI-н чадвар (2017)
            </text>
          </motion.g>
        </svg>
      </R>
      <Group className="land-notes">
        <R>
          <b>Усанд автсан:</b> арифметик, шатар, Го, яриа таних
        </R>
        <R>
          <b>Зөвлөмж:</b> «эргийн» мэргэжлээс зайлсхий
        </R>
        <R>
          <b>Ус «AI дизайн» оргилд хүрвэл</b> → оюун ухааны тэсрэлт?
        </R>
      </Group>
    </div>
  );
}

/* ───────────── 16. Санах ой ───────────── */

export function Memory() {
  return (
    <div className="memory">
      <Header kicker="2-р бүлэг · Санах ой" title="Мэдээллийг матери хэрхэн хадгалдаг вэ?" />
      <div className="mem-grid">
        <R className="panel mem-well">
          <span className="label">Санах ой = олон тогтвортой төлөвтэй физик объект</span>
          <svg viewBox="0 0 500 250" width="500" height="250">
            <path
              d="M0 60 C 60 60, 70 200, 140 200 C 210 200, 210 90, 250 90 C 290 90, 290 200, 360 200 C 430 200, 440 60, 500 60"
              fill="none"
              stroke="#13296b"
              strokeWidth="3"
            />
            <motion.circle
              r="15"
              fill="#2c55c8"
              initial={{ cx: 250, cy: 74 }}
              animate={{
                cx: [250, 200, 140, 140, 200, 250, 300, 360, 360, 300, 250],
                cy: [74, 132, 185, 185, 132, 74, 132, 185, 185, 132, 74],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            />
            <text x="140" y="240" textAnchor="middle" className="bit-t">
              0
            </text>
            <text x="360" y="240" textAnchor="middle" className="bit-t">
              1
            </text>
          </svg>
          <p>Хоёр «хөндий» = 1 бит. Бөмбөг аль хөндийд байгаа нь — мэдээлэл.</p>
        </R>
        <div className="mem-right">
          <R className="panel">
            <span className="label">Матери хамаагүй</span>
            <h3>Ижил мэдээлэл — өөр өөр тээгч</h3>
            <div className="tags">
              {['Чулуун бичээс', 'Цаас', 'Соронзон диск', 'Флаш санах ой', 'ДНХ', 'Синапс'].map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </R>
          <R className="panel mem-compare">
            <div>
              <span className="label">Компьютер</span>
              <h3>Хаягаар хайна</h3>
              <p>«№2048 хаягт юу байна?»</p>
            </div>
            <div>
              <span className="label">Тархи</span>
              <h3>Холбоогоор сэргээнэ</h3>
              <p>Дууны эхний мөрийг сонсоход үргэлжлэл нь санагдана.</p>
            </div>
          </R>
          <div className="hopfield">
            <Photo src="/img/hopfield.jpg" alt="Жон Хопфилд" className="hop-photo" pos="50% 20%" credit="Jay Dixit, CC BY-SA 4.0" />
            <R className="hop-text">
              <b>Жон Хопфилд</b> холбоот санах ойг <b>1982</b> онд нейрон сүлжээгээр загварчилсан — 2024 онд физикийн
              Нобелийн шагнал хүртсэн.
            </R>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── 17. Тооцоолол ───────────── */

const nandRows = [
  [0, 0, 1],
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0],
];

export function Computation() {
  return (
    <div className="compute">
      <Header kicker="2-р бүлэг · Тооцоолол" title="Матери тооцоолж чаддаг" />
      <div className="comp-grid">
        <R className="panel nand">
          <span className="label">Бүх тооцооллын «тоосго»</span>
          <div className="nand-body">
            <svg viewBox="0 0 260 160" width="260" height="160">
              <line x1="10" y1="55" x2="70" y2="55" stroke="#13296b" strokeWidth="3" />
              <line x1="10" y1="105" x2="70" y2="105" stroke="#13296b" strokeWidth="3" />
              <path d="M70 25 H130 A55 55 0 0 1 130 135 H70 Z" fill="#ffffff" stroke="#13296b" strokeWidth="3" />
              <circle cx="196" cy="80" r="9" fill="#fff" stroke="#13296b" strokeWidth="3" />
              <line x1="205" y1="80" x2="250" y2="80" stroke="#13296b" strokeWidth="3" />
              <text x="104" y="87" textAnchor="middle" className="gate-t">
                NAND
              </text>
              <text x="2" y="47" className="io-t">
                A
              </text>
              <text x="2" y="97" className="io-t">
                B
              </text>
            </svg>
            <table className="truth">
              <thead>
                <tr>
                  <th>A</th>
                  <th>B</th>
                  <th>Гаралт</th>
                </tr>
              </thead>
              <tbody>
                {nandRows.map((r, i) => (
                  <tr key={i} style={{ animationDelay: `${1.2 + i * 0.9}s` }}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>
                      <b>{r[2]}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            NAND хаалгыг давтан холбох замаар <b>дурын</b> тооцоолол бүтээж болно.
          </p>
          <div className="def-line">
            <b>Тооцоолол</b> = санах ойн нэг төлөвийг нөгөөд хувиргах, өөрөөр хэлбэл функц: оролт → гаралт.
          </div>
        </R>
        <div className="comp-right">
          <div className="turing">
            <Photo src="/img/turing.jpg" alt="Алан Тьюринг" className="turing-photo" pos="50% 25%" credit="Elliott & Fry, 1951 · нийтийн өмч" />
            <R className="turing-text">
              <span className="label">1936 · Алан Тьюринг</span>
              <h3>Универсал компьютер</h3>
              <p>
                Хангалттай санах ой, хугацаа өгвөл аливаа тооцоог гүйцэтгэж чадна. Ийм материйг Тегмарк{' '}
                <b>«компьютрониум»</b> гэж нэрлэдэг.
              </p>
            </R>
          </div>
          <R className="panel accent">
            <span className="label">Суурь хамааралгүй байдал</span>
            <h3>Матери биш — хэв маяг чухал</h3>
            <p>
              Долгион ус, агаар, хатуу биетэд адилхан тархдаг шиг тооцоолол ч ямар материал дээр хийгдэх нь хамаагүй. Тиймээс
              оюун ухаан цахиур дээр ч бий болж болно.
            </p>
          </R>
        </div>
      </div>
    </div>
  );
}

/* ───────────── 18. Суралцах ───────────── */

export function Learning() {
  return (
    <div className="learning">
      <Header kicker="2-р бүлэг · Суралцах" title="Матери суралцаж чаддаг" />
      <div className="learn-grid">
        <Photo
          src="/img/neurons.jpg"
          alt="Нейронууд"
          className="learn-photo"
          credit="Флуоресцент нейронууд · ManuelSchottdorf, CC BY-SA 4.0"
        />
        <Group className="numlist">
          <R className="num-item">
            <b>1</b>
            <div>
              <h3>Хеббийн дүрэм</h3>
              <p>«Хамт идэвхждэг нейронууд хоорондоо холбогддог.» Холбоосын хүч туршлагаар өөрчлөгдөнө.</p>
            </div>
          </R>
          <R className="num-item">
            <b>2</b>
            <div>
              <h3>Тархи ≈ 100 тэрбум нейрон</h3>
              <p>Тус бүр ≈ 1000 синапстай — бүгд суралцах явцад тохируулагдана.</p>
            </div>
          </R>
          <R className="num-item">
            <b>3</b>
            <div>
              <h3>Нейрон сүлжээ — универсал</h3>
              <p>Хангалттай том сүлжээ бараг аливаа функцийг ойролцоолж чадна → гүн сургалт.</p>
            </div>
          </R>
          <R className="num-item">
            <b>4</b>
            <div>
              <h3>Тооцоолол улам хямдарна</h3>
              <p>Мурын хууль: тооцооллын өртөг ойролцоогоор хоёр жил тутам хоёр дахин буурсаар.</p>
            </div>
          </R>
        </Group>
      </div>
      <R className="equation">
        <span>Санах ой</span>
        <i>+</i>
        <span>Тооцоолол</span>
        <i>+</i>
        <span>Суралцах</span>
        <i>=</i>
        <span className="hot">Ухаалаг матери</span>
      </R>
    </div>
  );
}

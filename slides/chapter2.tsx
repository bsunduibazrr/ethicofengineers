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
        sub="Тегмарк үүнийг нарийн төвөгтэй зорилгод хүрэх чадвар гэж маш өргөн утгаар тодорхойлдог. Ингэхээр хүн, амьтан, машин бүгд хамаарна."
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
              Deep Blue 1997 онд Каспаровыг хожсон. Гэхдээ шатраас өөр юм
              мэддэггүй байсан.
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
  { x: 155, y: 410, t: "Арифметик" },
  { x: 290, y: 420, t: "Шатар" },
  { x: 420, y: 388, t: "Го" },
  { x: 590, y: 286, t: "Орчуулга" },
  { x: 750, y: 216, t: "Программчлал" },
  { x: 935, y: 102, t: "AI хөгжүүлэх", flag: true },
];

const MOUNTAIN =
  "M70 462 V430 C110 410, 135 404, 155 410 " +
  "C210 426, 260 426, 290 420 C350 409, 386 388, 420 388 " +
  "C490 388, 540 288, 590 286 C650 284, 690 216, 750 216 " +
  "C820 216, 875 102, 935 102 C990 102, 1035 254, 1110 280 V462 Z";

export function Landscape() {
  return (
    <div className="land">
      <Header
        kicker="2-р бүлэг · Ханс Моравецын зүйрлэл"
        title="AI бүх чадварыг зэрэг эзэмшихгүй"
        sub="Усны түвшин дээшлэх бүрд AI-ийн хийж чадах ажлын хүрээ тэлнэ."
      />
      <div className="land-grid">
        <R className="land-wrap">
          <svg viewBox="0 0 1120 520" width="1120" height="520" role="img" aria-label="Усанд автсан нам дор газрууд нь AI-ийн эзэмшсэн чадварууд; өндөр оргилууд нь машинд илүү хэцүү ажлууд.">
            <path d={MOUNTAIN} fill="#f3f5fa" />
            <rect x="70" y="350" width="1040" height="112" fill="#e5ecfa" />
            <path d={MOUNTAIN} fill="none" stroke="#13296b" strokeWidth="2.5" />
            <path d="M40 462 V65 M33 75 L40 65 L47 75" fill="none" stroke="#646b7d" strokeWidth="2" />
            <text x="70" y="38" className="land-axis">Машинд гүйцэтгэхэд хэцүү ↑</text>
            <line x1="70" y1="350" x2="1110" y2="350" stroke="#2c55c8" strokeWidth="2" strokeDasharray="8 6" />
            <text x="86" y="330" className="water-t">AI-ийн хүрсэн түвшин</text>
            {peaks.map((p) => (
              <g key={p.t}>
                {p.flag && <circle cx={p.x} cy={p.y} r="13" fill="#fff" stroke="#13296b" strokeWidth="2" />}
                <circle cx={p.x} cy={p.y} r="5" fill="#13296b" />
                <text x={p.x} y={p.y - (p.flag ? 28 : 22)} textAnchor="middle" className={`peak-t${p.flag ? " flag" : ""}`}>
                  {p.t}
                </text>
              </g>
            ))}
            <text x="86" y="502" className="land-axis">Усанд орсон хэсэг = AI-ийн хийж чаддаг ажил</text>
          </svg>
        </R>
        <R className="land-reading">
          <span className="label">Яагаад энэ оргил чухал вэ?</span>
          <h3>AI өөрөө AI хөгжүүлж чадвал?</h3>
          <p>Дараагийн хувилбараа сайжруулах ажилд AI өөрөө оролцож эхэлнэ.</p>
          <p className="land-implication">Тэгвэл хөгжлийн хурд улам нэмэгдэж болохыг Тегмарк онцолдог.</p>
        </R>
      </div>
      <R className="land-caption">
        Чадваруудын байрлал нь номын 2017 оны зүйрлэл; өнөөгийн AI-ийн үнэлгээ биш.
      </R>
    </div>
  );
}

/* ───────────── 16. Санах ой ───────────── */

export function Memory() {
  return (
    <div className="memory">
      <Header kicker="2-р бүлэг" title="Санах ой" />
      <div className="mem-grid">
        <R className="panel mem-well">
          <span className="label">Санах ой гэж юу вэ?</span>
          <svg viewBox="0 0 500 250" width="500" height="250">
            <path
              d="M0 60 C 60 60, 70 200, 140 200 C 210 200, 210 90, 250 90 C 290 90, 290 200, 360 200 C 430 200, 440 60, 500 60"
              fill="none"
              stroke="#13296b"
              strokeWidth="3"
            />
            <circle
              className="mem-ball"
              cx="140"
              cy="185"
              r="15"
              fill="#2c55c8"
            />
            <text x="140" y="240" textAnchor="middle" className="bit-t">
              0
            </text>
            <text x="360" y="240" textAnchor="middle" className="bit-t">
              1
            </text>
          </svg>
          <p>
            Хэд хэдэн тогтвортой төлөвтэй аливаа зүйл мэдээлэл хадгалж чадна.
            Хоёр хотгортой гадаргуу дээрх бөмбөг гэхэд л 1 бит хадгална.
          </p>
        </R>
        <div className="mem-right">
          <R className="panel">
            <span className="label">Материал нь хамаагүй</span>
            <h3>Нэг мэдээллийг юун дээр ч хадгалж болно</h3>
            <div className="tags">
              {[
                "Чулуу",
                "Цаас",
                "Хатуу диск",
                "Флаш",
                "ДНХ",
                "Тархины синапс",
              ].map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </R>
          <R className="panel mem-compare">
            <div>
              <span className="label">Компьютер</span>
              <h3>Хаягаар хайдаг</h3>
              <p>"2048 дугаар хаягт юу байна?" гэж асууна.</p>
            </div>
            <div>
              <span className="label">Тархи</span>
              <h3>Холбоогоор санадаг</h3>
              <p>
                Дууны эхний мөрийг сонсоход үргэлжлэл нь өөрөө санаанд ордог.
              </p>
            </div>
          </R>
          <div className="hopfield">
            <Photo
              src="/img/hopfield.jpg"
              alt="Жон Хопфилд"
              className="hop-photo"
              pos="50% 20%"
            />
            <R className="hop-text">
              Тархины энэ төрлийн санах ойг <b>Жон Хопфилд</b> 1982 онд нейрон
              сүлжээгээр загварчилсан. Энэ ажлаараа 2024 онд физикийн Нобелийн
              шагнал авсан.
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
      <Header kicker="2-р бүлэг" title="Тооцоолол" />
      <div className="comp-grid">
        <R className="panel nand">
          <span className="label">NAND хаалга</span>
          <div className="nand-body">
            <svg viewBox="0 0 260 160" width="260" height="160">
              <line
                x1="10"
                y1="55"
                x2="70"
                y2="55"
                stroke="#13296b"
                strokeWidth="3"
              />
              <line
                x1="10"
                y1="105"
                x2="70"
                y2="105"
                stroke="#13296b"
                strokeWidth="3"
              />
              <path
                d="M70 25 H130 A55 55 0 0 1 130 135 H70 Z"
                fill="#ffffff"
                stroke="#13296b"
                strokeWidth="3"
              />
              <circle
                cx="196"
                cy="80"
                r="9"
                fill="#fff"
                stroke="#13296b"
                strokeWidth="3"
              />
              <line
                x1="205"
                y1="80"
                x2="250"
                y2="80"
                stroke="#13296b"
                strokeWidth="3"
              />
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
            Ийм энгийн хаалгыг олноор нь холбоод <b>ямар ч</b> тооцоолол хийж
            болно.
          </p>
          <div className="def-line">
            Тооцоолол гэдэг нь нэг төлөвийг нөгөөд хувиргах, өөрөөр хэлбэл
            оролтоос гаралт гаргах үйл явц.
          </div>
        </R>
        <div className="comp-right">
          <div className="turing">
            <Photo
              src="/img/turing.jpg"
              alt="Алан Тьюринг"
              className="turing-photo"
              pos="50% 25%"
            />
            <R className="turing-text">
              <span className="label">1936 он</span>
              <h3>Алан Тьюринг</h3>
              <p>
                Хангалттай санах ой, хугацаа өгвөл ямар ч тооцоо хийж чадах
                машин бүтээж болохыг баталсан. Тегмарк ийм чадвартай материйг
                "компьютрониум" гэж нэрлэдэг.
              </p>
            </R>
          </div>
          <R className="panel accent">
            <span className="label">Хамгийн гол санаа</span>
            <h3>Тооцоолол материалаас хамаардаггүй</h3>
            <p>
              Долгион усанд ч, агаарт ч адилхан тархдаг. Үүнтэй адил тооцоолол
              цахиур дээр ч, тархинд ч хийгдэж болно.
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
      <Header kicker="2-р бүлэг" title="Суралцах" />
      <div className="learn-grid">
        <Photo
          src="/img/neurons.jpg"
          alt="Нейронууд"
          className="learn-photo"
        />
        <Group className="numlist">
          <R className="num-item">
            <b>1</b>
            <div>
              <h3>Хеббийн дүрэм</h3>
              <p>
                Хамт идэвхждэг нейронуудын холбоо улам хүчтэй болдог. Тархи
                ингэж суралцдаг.
              </p>
            </div>
          </R>
          <R className="num-item">
            <b>2</b>
            <div>
              <h3>100 тэрбум орчим нейрон</h3>
              <p>Тус бүр нь мянга орчим бусад нейронтой холбогддог.</p>
            </div>
          </R>
          <R className="num-item">
            <b>3</b>
            <div>
              <h3>Хиймэл нейрон сүлжээ</h3>
              <p>
                Холбоосоо тохируулж суралцдаг. Хангалттай том бол бараг ямар ч
                функцийг сурч чадна.
              </p>
            </div>
          </R>
          <R className="num-item">
            <b>4</b>
            <div>
              <h3>Тооцоолол хямдарсаар</h3>
              <p>
                Мурын хуулиар тооцооллын өртөг хоёр жил орчимд хоёр дахин
                буурдаг.
              </p>
            </div>
          </R>
        </Group>
      </div>
      <R className="footnote summary">
        <b>Бүлгийн дүгнэлт:</b> санах ой, тооцоолол, суралцах гурвын аль нь ч
        биологиос хамаардаггүй. Тиймээс оюун ухаан зөвхөн хүнд байх албагүй.
      </R>
    </div>
  );
}

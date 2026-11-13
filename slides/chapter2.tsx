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
              <p>2048 дугаар хаягт юу байна? гэж асууна.</p>
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

/* ───────────── 18. Тооцоолол ───────────── */

export function Computation() {
  return (
    <div className="computation-visual">
      <h2 className="computation-keyword computation-input">Оролт</h2>
      <h2 className="computation-keyword computation-output">Гаралт</h2>
      <svg
        className="computation-diagram"
        viewBox="0 0 1640 680"
        role="img"
        aria-label="Тооцоолол: оролтын төлөв өөр гаралтын төлөвт хувирна. Ижил үйлдлийг цахиурын хэлхээ эсвэл мэдрэлийн сүлжээгээр хэрэгжүүлж болохыг хоёр замаар дүрсэлсэн зүйрлэл."
      >
        <g fill="none" stroke="#cbd6ed" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M344 350H476M476 350V234Q476 210 500 210H700M476 350V476Q476 500 500 500H700" />
          <path d="M940 210H1140Q1164 210 1164 234V350M940 500H1140Q1164 500 1164 476V350M1164 350H1296" />
        </g>
        <g fill="none" stroke="#2c55c8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M612 198L626 210L612 222M612 488L626 500L612 512" />
          <path d="M1040 198L1054 210L1040 222M1040 488L1054 500L1040 512M1230 338L1244 350L1230 362" />
        </g>
        <g fill="#2c55c8">
          <circle cx="476" cy="350" r="8" />
          <circle cx="1164" cy="350" r="8" />
        </g>

        <rect x="102" y="244" width="242" height="212" rx="30" fill="#f3f5fa" />
        <g stroke="#2c55c8" strokeWidth="4">
          <circle cx="174" cy="304" r="27" fill="#2c55c8" />
          <circle cx="272" cy="304" r="27" fill="#fff" />
          <circle cx="174" cy="402" r="27" fill="#2c55c8" />
          <circle cx="272" cy="402" r="27" fill="#2c55c8" />
        </g>

        <rect x="700" y="100" width="240" height="220" rx="34" fill="#f3f5fa" />
        <g fill="none" stroke="#9aabd3" strokeWidth="4" strokeLinecap="round">
          <path d="M735 167H754M735 195H754M735 223H754M735 251H754M886 167H905M886 195H905M886 223H905M886 251H905" />
          <path d="M778 123V143M806 123V143M834 123V143M862 123V143M778 277V297M806 277V297M834 277V297M862 277V297" />
        </g>
        <rect x="754" y="143" width="132" height="134" rx="22" fill="#fff" stroke="#13296b" strokeWidth="4" />
        <g fill="none" stroke="#2c55c8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M774 177H787Q800 177 800 190T787 203H774Z" />
          <circle cx="805" cy="190" r="4" fill="#fff" />
          <path d="M809 190H824V217H839M762 184H774M762 196H774" />
          <path d="M839 204H850Q863 204 863 217T850 230H839Z" />
          <circle cx="868" cy="217" r="4" fill="#fff" />
          <path d="M872 217H882M785 251H824V224H839" />
        </g>

        <circle cx="820" cy="500" r="120" fill="#f3f5fa" />
        <g fill="#fff" stroke="#13296b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M820 432C806 414 780 418 772 437C749 433 732 453 740 475C722 489 727 514 745 521C739 545 755 562 775 560C784 580 807 578 820 563Z" />
          <path d="M820 432C834 414 860 418 868 437C891 433 908 453 900 475C918 489 913 514 895 521C901 545 885 562 865 560C856 580 833 578 820 563Z" />
        </g>
        <g fill="none" stroke="#2c55c8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M772 438C770 453 780 461 792 460M741 476C756 467 772 478 772 490M746 521C757 508 774 510 781 522M775 560C770 543 781 533 794 536" />
          <path d="M868 438C870 453 860 461 848 460M899 476C884 467 868 478 868 490M894 521C883 508 866 510 859 522M865 560C870 543 859 533 846 536" />
          <path d="M795 481L808 500L795 519M845 481L832 500L845 519" />
        </g>
        <g fill="#2c55c8">
          <circle cx="795" cy="481" r="5" />
          <circle cx="795" cy="519" r="5" />
          <circle cx="845" cy="481" r="5" />
          <circle cx="845" cy="519" r="5" />
        </g>

        <rect x="1296" y="244" width="242" height="212" rx="30" fill="#f3f5fa" />
        <g stroke="#2c55c8" strokeWidth="4">
          <circle cx="1368" cy="304" r="27" fill="#fff" />
          <circle cx="1466" cy="304" r="27" fill="#2c55c8" />
          <circle cx="1368" cy="402" r="27" fill="#2c55c8" />
          <circle cx="1466" cy="402" r="27" fill="#fff" />
        </g>
      </svg>
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

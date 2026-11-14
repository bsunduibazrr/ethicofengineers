"use client";

import { motion } from "framer-motion";
import { EASE, Group, Header, Photo, R } from "@/components/ui";

/* ───────────── Бүлгийн нүүр (давтан ашиглана) ───────────── */

export function Divider({
  num,
  label,
  title,
  en,
  epigraph,
  pills,
  img,
}: {
  num: string;
  label: string;
  title: string;
  en: string;
  epigraph?: { text: string; who: string };
  pills: string[];
  img: string;
}) {
  return (
    <div className="divider">
      <div className="div-body">
        <R className="div-num">{num}</R>
        <R className="kicker">{label}</R>
        <R>
          <h2 className="div-title">{title}</h2>
        </R>
        <R className="div-en">{en}</R>
        {epigraph && (
          <R className="epigraph">
            {epigraph.text}<small>{epigraph.who}</small>
          </R>
        )}
        <Group className="div-list">
          {pills.map((p, i) => (
            <R className="div-item" key={p}>
              <b>{i + 1}</b>
              {p}
            </R>
          ))}
        </Group>
      </div>
      <Photo src={img} alt="" className="div-photo" />
    </div>
  );
}

export function Ch1Divider() {
  return (
    <Divider
      num="01"
      label="1-р бүлэг"
      title="Бидний цаг үеийн хамгийн чухал яриа"
      en="Welcome to the Most Important Conversation of Our Time"
      pills={[
        "Амьдралын гурван үе шат",
        "AI-ийн талаарх маргаан",
        "Түгээмэл буруу ойлголтууд",
      ]}
      img="/img/deep-field.jpg"
    />
  );
}

/* ───────────── 6. Орчлонгийн товч түүх ───────────── */

const history = [
  { t: "13.8 тэрбум жилийн өмнө", d: "Их тэсрэлт болж, орчлон үүссэн" },
  { t: "Дараа нь", d: "Атом, од, галактик бий болсон" },
  { t: "≈ 4 тэрбум жилийн өмнө", d: "Дэлхий дээр анхны амьдрал" },
  { t: "≈ 300 000 жилийн өмнө", d: "Хомо сапиенс, хэл ба соёл" },
  { t: "Өнөөдөр", d: "Технологи, хиймэл оюун ухаан" },
];

export function History() {
  return (
    <div className="history">
      <Photo
        src="/img/earth.jpg"
        alt="Дэлхий"
        className="history-photo"
      />
      <div>
        <Header
          kicker="1-р бүлэг"
          title="Их тэсрэлтээс өнөөдрийг хүртэл"
          sub="Тегмарк номоо орчлонгийн түүхээс эхэлдэг. Түүний бодлоор 13.8 тэрбум жилийн дараа орчлон өөрийгөө танин мэдэх чадвартай амьтдыг бий болгосон, тэр нь бид."
        />
        <div className="vtl">
          <motion.i
            className="vtl-line"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.4, delay: 0.6, ease: EASE }}
          />
          <Group>
            {history.map((h, i) => (
              <R
                className={`vtl-item${i === history.length - 1 ? " now" : ""}`}
                key={h.t}
              >
                <b>{h.t}</b>
                <span>{h.d}</span>
              </R>
            ))}
          </Group>
        </div>
        <R className="definition">
          <span className="label">Амьдрал гэж юу вэ?</span>
          <p>
            Тегмаркийн тодорхойлсноор амьдрал бол өөрийн бүтцийг хадгалж, үржиж
            чаддаг процесс. Үүнийг <b>бие</b> (hardware) ба{" "}
            <b>мэдлэг, чадвар</b> (software) гэж хоёр хувааж үздэг.
          </p>
        </R>
      </div>
    </div>
  );
}

export { ThreeStages, WhyLife2 } from "./chapter1-life";
export { Camps, Napa } from "./chapter1-views";
export { Myths1, Myths2 } from "./chapter1-myths";

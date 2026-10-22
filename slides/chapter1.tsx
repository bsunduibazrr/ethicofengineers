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
  credit,
}: {
  num: string;
  label: string;
  title: string;
  en: string;
  epigraph?: { text: string; who: string };
  pills: string[];
  img: string;
  credit: string;
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
            "{epigraph.text}"<small>{epigraph.who}</small>
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
      <Photo src={img} alt="" className="div-photo" credit={credit} />
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
      credit="Hubble Ultra Deep Field, NASA/ESA"
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
        credit="Аполло 17-оос авсан зураг, NASA"
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

/* ───────────── 7. Амьдралын 3 үе шат ───────────── */

const stages = [
  {
    v: "1.0",
    name: "Биологийн",
    img: "/img/life1-ecoli.jpg",
    credit: "E. coli бактери, USDA",
    hw: false,
    sw: false,
    d: "Бактери насан туршдаа шинэ юм сурдаггүй. Өөрчлөгдөх ганц арга нь олон үе дамжсан хувьсал.",
  },
  {
    v: "2.0",
    name: "Соёлын",
    img: "/img/life2-child.jpg",
    credit: "Зураг: Widad.sirkhotte, CC BY 4.0",
    hw: false,
    sw: true,
    d: "Бие нь хувьслаар заяадаг ч хэл, мэдлэг, ур чадвараа хүн өөрөө сурч эзэмшдэг.",
  },
  {
    v: "3.0",
    name: "Технологийн",
    img: "/img/life3-asimo.jpg",
    credit: "ASIMO робот, Vanillase, CC BY-SA 3.0",
    hw: true,
    sw: true,
    d: "Биеэ ч, оюун ухаанаа ч өөрөө зохион бүтээнэ. Одоогоор ийм амьдрал байхгүй.",
  },
];

export function ThreeStages() {
  return (
    <div className="stages">
      <Header
        kicker="1-р бүлэг"
        title="Амьдралын гурван үе шат"
        sub="Номын нэр эндээс гаралтай. Тегмарк хошигнож бид одоо Амьдрал 2.1 гэдэг, учир нь хиймэл шүд, зүрхний аппарат зэргээр биеэ бага зэрэг сайжруулж эхэлсэн."
      />
      <div className="stage-cols">
        {stages.map((s) => (
          <div className="stage-col" key={s.v}>
            <Photo
              src={s.img}
              alt={s.name}
              className="stage-photo"
              credit={s.credit}
              pos="50% 35%"
            />
            <R className="stage-head">
              <h3>Амьдрал {s.v}</h3>
              <span>{s.name}</span>
            </R>
            <R className="stage-rows">
              <div>
                <span>Бие</span>
                <b className={s.hw ? "self" : ""}>
                  {s.hw ? "Өөрөө бүтээнэ" : "Хувьслаар"}
                </b>
              </div>
              <div>
                <span>Мэдлэг, чадвар</span>
                <b className={s.sw ? "self" : ""}>
                  {s.sw ? "Өөрөө сурна" : "Хувьслаар"}
                </b>
              </div>
            </R>
            <R className="stage-d">{s.d}</R>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── 8. Суралцах чадвар ───────────── */

export function WhyLife2() {
  return (
    <div className="why2">
      <Header kicker="1-р бүлэг" title="Суралцах чадвар яагаад чухал вэ?" />
      <div className="why2-grid">
        <div className="stats">
          <R className="stat">
            <span className="label">Төрөхөөсөө авч ирдэг</span>
            <div className="stat-n">≈ 1 ГБ</div>
            <p>ДНХ-д хадгалагддаг мэдээлэл</p>
            <div className="bar">
              <motion.i
                initial={{ width: 0 }}
                animate={{ width: "2%" }}
                transition={{ delay: 1, duration: 1, ease: EASE }}
              />
            </div>
          </R>
          <R className="stat">
            <span className="label">Амьдралынхаа туршид сурдаг</span>
            <div className="stat-n">≈ 100 ТБ</div>
            <p>Тархины синапсуудад хадгалагддаг мэдээлэл</p>
            <div className="bar">
              <motion.i
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2, duration: 1.6, ease: EASE }}
              />
            </div>
          </R>
          <R className="stat-note">
            Бидний мэддэг зүйлсийн ихэнхийг төрснийхөө дараа сурсан гэсэн үг.
          </R>
        </div>
        <Group className="numlist">
          <R className="num-item">
            <b>1</b>
            <div>
              <h3>Бактери сурч чаддаггүй</h3>
              <p>
                Шинэ зан төлөв гарахын тулд олон мянган үе солигдох хэрэгтэй.
              </p>
            </div>
          </R>
          <R className="num-item">
            <b>2</b>
            <div>
              <h3>Хүн хэлгүй төрөөд хэл сурдаг</h3>
              <p>Бид шинэ нөхцөлд хурдан дасаж, насан туршдаа суралцдаг.</p>
            </div>
          </R>
          <R className="num-item">
            <b>3</b>
            <div>
              <h3>Мэдлэгээ дамжуулдаг</h3>
              <p>Хэл, ном, сургууль, интернэтээр дараагийн үедээ өвлүүлдэг.</p>
            </div>
          </R>
          <R className="num-item">
            <b>4</b>
            <div>
              <h3>Гэхдээ бие хязгаартай</h3>
              <p>
                Тархины хэмжээ, наслалтаа бид сонгож чадахгүй. Амьдрал 3.0-д ийм
                хязгаар байхгүй.
              </p>
            </div>
          </R>
        </Group>
      </div>
    </div>
  );
}

/* ───────────── 9. Гурван байр суурь ───────────── */

const camps = [
  {
    key: "u",
    name: "Дижитал утопистууд",
    d: "AGI удахгүй бий болно, үр дүн нь ч сайн байна гэж үздэг.",
    who: "Ларри Пейж, Рэй Курцвейл, Ханс Моравек",
    img: "/img/larry-page.jpg",
  },
  {
    key: "s",
    name: "Техно-скептикүүд",
    d: "Хүн шиг AI хэдэн зуун жилийн дараа ч гарахгүй, одоо санаа зовох хэрэггүй гэдэг.",
    who: "Эндрю Нг, Родни Брукс",
    img: "/img/andrew-ng.jpg",
  },
  {
    key: "b",
    name: "Ашигтай AI хөдөлгөөн",
    d: "Энэ зуунд бий болж магадгүй. Сайн үр дүн өөрөө ирэхгүй тул аюулгүй байдлыг одооноос судлах хэрэгтэй гэдэг.",
    who: "Стюарт Рассел, Макс Тегмарк",
    img: "/img/stuart-russell.jpg",
  },
];

function CampMap() {
  const bubbles = [
    { x: 190, y: 110, r: 72, label: "Утопистууд", c: "#13296b", delay: 0.9 },
    { x: 235, y: 262, r: 84, label: "Ашигтай AI", c: "#2c55c8", delay: 1.1 },
    { x: 500, y: 175, r: 80, label: "Скептикүүд", c: "#6b7896", delay: 1.3 },
    { x: 180, y: 392, r: 64, label: "Луддитууд", c: "#b4233c", delay: 1.5 },
  ];
  return (
    <svg viewBox="0 0 640 520" width="640" height="520" className="campmap">
      <rect x="60" y="20" width="560" height="440" fill="#f6f7fa" />
      <line
        x1="60"
        y1="240"
        x2="620"
        y2="240"
        stroke="#d5d9e2"
        strokeDasharray="4 6"
      />
      <line
        x1="340"
        y1="20"
        x2="340"
        y2="460"
        stroke="#d5d9e2"
        strokeDasharray="4 6"
      />
      <text x="62" y="490" className="axis-t">
        Удахгүй
      </text>
      <text x="618" y="490" textAnchor="end" className="axis-t">
        Хэзээ ч үгүй
      </text>
      <text x="340" y="515" textAnchor="middle" className="axis-h">
        AGI хэзээ бий болох вэ? →
      </text>
      <text
        x="36"
        y="24"
        className="axis-t"
        transform="rotate(-90 36 24)"
        textAnchor="end"
      >
        Сайн
      </text>
      <text x="36" y="460" className="axis-t" transform="rotate(-90 36 460)">
        Муу
      </text>
      {bubbles.map((b) => (
        <motion.g
          key={b.label}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: b.delay, duration: 0.8, ease: EASE }}
          style={{
            transformOrigin: `${b.x}px ${b.y}px`,
            transformBox: "view-box",
          }}
        >
          <circle
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill={b.c}
            fillOpacity=".1"
            stroke={b.c}
            strokeWidth="2"
          />
          <text
            x={b.x}
            y={b.y + 7}
            textAnchor="middle"
            className="bubble-t"
            fill={b.c}
          >
            {b.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

export function Camps() {
  return (
    <div className="camps">
      <Header kicker="1-р бүлэг" title="AGI-ийн талаарх гурван байр суурь" />
      <div className="camps-grid">
        <R>
          <CampMap />
        </R>
        <Group className="camp-list">
          {camps.map((c) => (
            <R className={`camp camp-${c.key}`} key={c.key}>
              <img src={c.img} alt={c.who} />
              <div>
                <h3>{c.name}</h3>
                <p>{c.d}</p>
                <small>{c.who}</small>
              </div>
            </R>
          ))}
        </Group>
      </div>
    </div>
  );
}

/* ───────────── 10. Пейж, Маск хоёрын маргаан ───────────── */

const terms = [
  { t: "Оюун ухаан", d: "Нарийн төвөгтэй зорилгод хүрэх чадвар" },
  { t: "Нарийн AI", d: "Ганц ажилд сайн, жишээ нь шатар тоглох" },
  { t: "AGI", d: "Бараг бүх ажлыг хүн шиг хийж чадах AI" },
  { t: "Супер оюун ухаан", d: "Хүнээс хамаагүй илүү ухаантай AI" },
  { t: "Найрсаг AI", d: "Зорилго нь хүний зорилготой нийцдэг AI" },
  { t: "Ухамсар", d: "Ямар нэг юмыг өөрөө мэдэрч, туулах" },
];

export function Napa() {
  return (
    <div className="napa">
      <Header
        kicker="1-р бүлэг · 2015 он, Калифорни"
        title="Пейж, Маск хоёрын маргаан"
      />
      <div className="napa-grid">
        <div className="debate">
          <div className="debate-people">
            <div className="person">
              <Photo
                src="/img/larry-page.jpg"
                alt="Ларри Пейж"
                className="person-photo"
                pos="50% 25%"
                credit="Stansfield PL, CC BY-SA 3.0"
              />
              <R className="person-q">
                <b>Ларри Пейж</b>
                Дижитал амьдрал бол хувьслын дараагийн шат. Түүнийг хязгаарлах
                шаардлагагүй.
              </R>
            </div>
            <div className="person">
              <Photo
                src="/img/elon-musk.jpg"
                alt="Илон Маск"
                className="person-photo"
                pos="50% 25%"
                credit="Gage Skidmore, CC BY-SA 4.0"
              />
              <R className="person-q">
                <b>Илон Маск</b>
                Тэгвэл хүн төрөлхтөн яах вэ? Эрсдэлийг нь урьдчилж бодох ёстой.
              </R>
            </div>
          </div>
          <R className="debate-end">
            Маргааны үеэр Пейж Маскыг "speciesist" буюу зөвхөн хүн төрөлхтнийг
            илүүд үздэг хүн гэж нэрлэсэн гэдэг.
          </R>
        </div>
        <div className="terms">
          <R className="terms-head">
            Ийм маргаан ихэнхдээ хүмүүс нэг үгийг өөр өөрөөр ойлгосноос үүсдэг.
            Тиймээс Тегмарк нэр томьёогоо эхлээд тодорхойлдог.
          </R>
          <Group className="terms-list">
            {terms.map((t) => (
              <R className="term" key={t.t}>
                <b>{t.t}</b>
                <span>{t.d}</span>
              </R>
            ))}
          </Group>
        </div>
      </div>
    </div>
  );
}

/* ───────────── 11–12. Буруу ойлголтууд ───────────── */

type Myth = { m: string; f: string };

function MythTable({ rows }: { rows: Myth[] }) {
  return (
    <Group className="mtable">
      <R className="mrow mhead">
        <span>Буруу ойлголт</span>
        <span>Үнэн хэрэгтээ</span>
      </R>
      {rows.map((r) => (
        <R className="mrow" key={r.m}>
          <p className="m">{r.m}</p>
          <p className="f">{r.f}</p>
        </R>
      ))}
    </Group>
  );
}

export function Myths1() {
  return (
    <div className="myths-slide">
      <Header kicker="1-р бүлэг" title="Түгээмэл буруу ойлголтууд" />
      <MythTable
        rows={[
          {
            m: "2100 он гэхэд супер оюун ухаан заавал бий болно. Эсвэл хэзээ ч бий болохгүй.",
            f: "Хэзээ бий болохыг хэн ч мэдэхгүй. Мэргэжилтнүүд хүртэл санал зөрөлддөг.",
          },
          {
            m: "Зөвхөн технологиос айдаг хүмүүс л AI-д санаа зовдог.",
            f: "Дэлхийн тэргүүлэх олон AI судлаач өөрсдөө санаа зовж байна.",
          },
          {
            m: "AI муу санаатай болох, ухамсартай болох нь аюултай.",
            f: "Жинхэнэ аюул бол AI маш чадвартай болоод, зорилго нь бидний зорилготой зөрөх явдал.",
          },
        ]}
      />
      <R className="footnote">
        2015 онд Пуэрто Рикод болсон хурал дээр AI судлаачдаас асуухад медиан
        хариулт нь <b>2055 он</b> байсан. Гэхдээ хариултууд хоорондоо маш их
        зөрүүтэй байв.
      </R>
    </div>
  );
}

export function Myths2() {
  return (
    <div className="myths-slide">
      <Header
        kicker="1-р бүлэг"
        title="Түгээмэл буруу ойлголтууд (үргэлжлэл)"
      />
      <MythTable
        rows={[
          {
            m: "Хамгийн том аюул бол роботууд.",
            f: "Асуудал нь роботод биш, оюун ухаанд байгаа. AI-д бие хэрэггүй, интернэт л хангалттай.",
          },
          {
            m: "AI хүнийг удирдаж чадахгүй.",
            f: "Ухаантай нь удирддаг. Бид барыг хүчээр биш, ухаанаараа хянадаг.",
          },
          {
            m: "Машин зорилготой байж чадахгүй.",
            f: "Дулаан мөрдөгч пуужин хүртэл зорилготой. Онох зорилго руугаа явдаг.",
          },
        ]}
      />
      <R className="pull-quote">
        <p>
          "Та шоргоолжийг үзэн ядаад гишгэдэггүй. Гэхдээ таны барих усан
          цахилгаан станцын талбайд шоргоолжны үүр байвал шоргоолжинд л муу
          хэрэг."
        </p>
        <small>
          Өөрөөр хэлбэл AI биднийг үзэн ядахгүй ч бидэнд хор хүргэж болно.
        </small>
      </R>
    </div>
  );
}

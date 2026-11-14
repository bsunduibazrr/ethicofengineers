"use client";

const lifeStages = [
  {
    version: "1.0",
    keyword: "Хувьсал",
    summary: "Бие, мэдлэг нь хувьслаар өөрчлөгдөнө.",
    image: "/img/life1-ecoli.jpg",
    alt: "Биологийн амьдралыг төлөөлсөн бактери",
  },
  {
    version: "2.0",
    keyword: "Суралцах",
    summary: "Бие нь удамшина. Мэдлэгээ өөрөө сурна.",
    image: "/img/life2-child.jpg",
    alt: "Суралцах чадвартай хүнийг төлөөлсөн хүүхэд",
  },
  {
    version: "3.0",
    keyword: "Бүтээх",
    summary: "Биеэ ч, оюун ухаанаа ч өөрөө бүтээнэ.",
    image: "/img/life3-asimo.jpg",
    alt: "Технологийн амьдралын санааг төлөөлсөн робот",
  },
];

export function ThreeStages() {
  return (
    <div className="ch1-minimal ch1-evolution">
      <div className="ch1-three-grid">
        {lifeStages.map((stage) => (
          <article className="ch1-evolution-item" key={stage.version}>
            <h2 className="ch1-version">{`Амьдрал ${stage.version}`}</h2>
            <figure className="ch1-evolution-photo">
              <img
                src={stage.image}
                alt={stage.alt}
                draggable={false}
                style={{ objectPosition: "50% 35%" }}
              />
            </figure>
            <h3 className="ch1-keyword">{stage.keyword}</h3>
            <p className="ch1-support">{stage.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function WhyLife2() {
  return (
    <div className="ch1-minimal ch1-learning">
      <div className="ch1-pair-head">
        <h2 className="ch1-pair-keyword">Удамшил</h2>
        <h2 className="ch1-pair-keyword">Суралцах</h2>
      </div>
      <svg
        className="ch1-wide-diagram"
        viewBox="0 0 1640 640"
        role="img"
        aria-label="ДНХ нь удамшлын мэдээллийг, тархи болон нээлттэй ном нь амьдралын турш суралцаж олж авах мэдлэгийг төлөөлнө."
      >
        <circle cx="420" cy="320" r="218" fill="#f3f5fa" />
        <circle cx="1210" cy="292" r="210" fill="#f3f5fa" />

        <g transform="translate(420 320)">
          <g
            fill="none"
            stroke="#c1cfee"
            strokeWidth="6"
            strokeLinecap="round"
          >
            <path d="M-68-170H68M-47-150H47M-47-90H47M-70-60H70M-47-30H47M-47 30H47M-70 60H70M-47 90H47M-47 150H47M-68 170H68" />
          </g>
          <path
            d="M-70-180C-70-120 70-120 70-60S-70 0-70 60S70 120 70 180"
            fill="none"
            stroke="#13296b"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M70-180C70-120-70-120-70-60S70 0 70 60S-70 120-70 180"
            fill="none"
            stroke="#2c55c8"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <g fill="#fff" strokeWidth="5">
            <circle cx="-70" cy="-180" r="10" stroke="#13296b" />
            <circle cx="70" cy="-180" r="10" stroke="#2c55c8" />
            <circle cx="70" cy="180" r="10" stroke="#13296b" />
            <circle cx="-70" cy="180" r="10" stroke="#2c55c8" />
          </g>
        </g>

        <path
          d="M718 320H906M886 300L906 320L886 340"
          fill="none"
          stroke="#c1cfee"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <g transform="translate(1210 272)">
          <g
            fill="#fff"
            stroke="#13296b"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M0-112C-22-141-66-137-80-104C-117-108-143-77-130-43C-160-19-151 20-122 32C-132 69-108 98-75 94C-60 125-21 123 0 99Z" />
            <path d="M0-112C22-141 66-137 80-104C117-108 143-77 130-43C160-19 151 20 122 32C132 69 108 98 75 94C60 125 21 123 0 99Z" />
          </g>
          <g
            fill="none"
            stroke="#2c55c8"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M-80-103C-84-79-65-65-45-69M-130-42C-102-56-78-37-78-18M-122 32C-101 10-72 15-62 35M-75 94C-84 67-66 50-43 55" />
            <path d="M80-103C84-79 65-65 45-69M130-42C102-56 78-37 78-18M122 32C101 10 72 15 62 35M75 94C84 67 66 50 43 55" />
            <path d="M-43-37L-20-7L-43 24M43-37L20-7L43 24" />
          </g>
          <g fill="#2c55c8">
            <circle cx="-43" cy="-37" r="7" />
            <circle cx="-43" cy="24" r="7" />
            <circle cx="43" cy="-37" r="7" />
            <circle cx="43" cy="24" r="7" />
          </g>
        </g>

        <path
          d="M1210 444V470"
          stroke="#c1cfee"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <g
          fill="#fff"
          stroke="#13296b"
          strokeWidth="4"
          strokeLinejoin="round"
        >
          <path d="M1210 490C1182 471 1139 468 1109 480V572C1143 559 1182 561 1210 579Z" />
          <path d="M1210 490C1238 471 1281 468 1311 480V572C1277 559 1238 561 1210 579Z" />
        </g>
        <g
          fill="none"
          stroke="#c1cfee"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <path d="M1133 504C1152 501 1170 504 1187 512M1133 526C1152 523 1170 526 1187 534M1233 512C1250 504 1268 501 1287 504M1233 534C1250 526 1268 523 1287 526" />
        </g>
      </svg>
      <div className="ch1-learning-captions">
        <p className="ch1-support">ДНХ-д удамшсан мэдээлэл хадгалагдана.</p>
        <p className="ch1-support">Мэдлэгээ насан туршдаа сурч, бусдад дамжуулна.</p>
      </div>
    </div>
  );
}

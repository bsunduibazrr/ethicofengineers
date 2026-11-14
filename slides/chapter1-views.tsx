"use client";

const viewpoints = [
  {
    keyword: "Утопистууд",
    src: "/img/larry-page.jpg",
    alt: "Larry Page",
    symbol: "spark",
    others: "Ray Kurzweil · Hans Moravec",
    position: "AGI удахгүй бий болж, сайн үр дүн авчирна.",
  },
  {
    keyword: "Скептикүүд",
    src: "/img/andrew-ng.jpg",
    alt: "Andrew Ng",
    symbol: "clock",
    others: "Rodney Brooks",
    position: "Хүн шиг AI ойрын үед бий болохгүй.",
  },
  {
    keyword: "Ашигтай AI",
    src: "/img/stuart-russell.jpg",
    alt: "Stewart Russell",
    symbol: "shield",
    others: "Макс Тегмарк",
    position: "Аюулгүй AI-д одооноос бэлдэх хэрэгтэй.",
  },
] as const;

function ViewpointSymbol({
  kind,
}: {
  kind: (typeof viewpoints)[number]["symbol"];
}) {
  return (
    <svg className="ch1-camp-symbol" viewBox="0 0 88 88" aria-hidden="true">
      <circle
        cx="44"
        cy="44"
        r="41"
        fill="#fff"
        stroke="#e3e6ed"
        strokeWidth="2"
      />
      <g
        fill="none"
        stroke="#2c55c8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "spark" && (
          <>
            <path d="M44 20L50 38L68 44L50 50L44 68L38 50L20 44L38 38Z" />
            <path d="M62 22V30M58 26H66" />
          </>
        )}
        {kind === "clock" && (
          <>
            <circle cx="44" cy="44" r="23" />
            <path d="M44 28V44L55 51" />
          </>
        )}
        {kind === "shield" && (
          <>
            <path d="M44 20L65 28V44C65 58 44 69 44 69S23 58 23 44V28Z" />
            <path d="M33 44L41 52L56 36" />
          </>
        )}
      </g>
    </svg>
  );
}

export function Camps() {
  return (
    <div className="ch1-minimal ch1-camps">
      <div className="ch1-three-grid">
        {viewpoints.map((viewpoint) => (
          <article className="ch1-camp-item" key={viewpoint.keyword}>
            <h2 className="ch1-keyword">{viewpoint.keyword}</h2>
            <figure className="ch1-camp-portrait">
              <img
                className="ch1-camp-photo"
                src={viewpoint.src}
                alt={viewpoint.alt}
                style={{ objectPosition: "50% 25%" }}
                draggable={false}
              />
              <ViewpointSymbol kind={viewpoint.symbol} />
            </figure>
            <div className="ch1-camp-caption">
              <p className="ch1-person-name">{viewpoint.alt}</p>
              <p className="ch1-other-names">{viewpoint.others}</p>
              <p className="ch1-support">{viewpoint.position}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Napa() {
  return (
    <div className="ch1-minimal ch1-debate">
      <div className="ch1-pair-head">
        <h2 className="ch1-pair-keyword">Боломж</h2>
        <h2 className="ch1-pair-keyword">Эрсдэл</h2>
      </div>
      <div className="ch1-debate-grid">
        <figure className="ch1-debate-person">
          <img
            className="ch1-debate-photo"
            src="/img/larry-page.jpg"
            alt="Larry Page"
            style={{ objectPosition: "50% 25%" }}
            draggable={false}
          />
          <figcaption className="ch1-debate-caption">
            <p className="ch1-person-name">Larry Page</p>
            <p className="ch1-support">
              Дижитал амьдрал — хувьслын дараагийн шат.
            </p>
          </figcaption>
        </figure>
        <svg
          className="ch1-debate-bridge"
          viewBox="0 0 200 480"
          role="img"
          aria-label="Хиймэл оюуны боломж ба эрсдэлийг өөр өөрөөр үнэлсэн хоёр байр суурь"
        >
          <path
            d="M12 240H49M151 240H188"
            fill="none"
            stroke="#c8d3eb"
            strokeWidth="3"
          />
          <circle cx="100" cy="240" r="51" fill="#f3f5fa" />
          <g
            fill="none"
            stroke="#9aabd3"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M62 225H73M62 240H73M62 255H73M127 225H138M127 240H138M127 255H138" />
            <path d="M85 202V213M100 202V213M115 202V213M85 267V278M100 267V278M115 267V278" />
          </g>
          <rect
            x="73"
            y="213"
            width="54"
            height="54"
            rx="11"
            fill="#fff"
            stroke="#13296b"
            strokeWidth="3"
          />
          <path
            d="M88 229L112 251M88 251L112 229M88 229V251M112 229V251"
            fill="none"
            stroke="#2c55c8"
            strokeWidth="2"
          />
          <g fill="#13296b">
            <circle cx="88" cy="229" r="3.5" />
            <circle cx="112" cy="229" r="3.5" />
            <circle cx="88" cy="251" r="3.5" />
            <circle cx="112" cy="251" r="3.5" />
          </g>
          <path
            d="M100 174V125M100 306V355"
            fill="none"
            stroke="#e3e6ed"
            strokeWidth="2"
          />
          <circle cx="100" cy="116" r="5" fill="#2c55c8" />
          <circle cx="100" cy="364" r="5" fill="#b64d4d" />
        </svg>
        <figure className="ch1-debate-person">
          <img
            className="ch1-debate-photo"
            src="/img/elon-musk.jpg"
            alt="Илон Маск"
            style={{ objectPosition: "50% 25%" }}
            draggable={false}
          />
          <figcaption className="ch1-debate-caption">
            <p className="ch1-person-name">Илон Маск</p>
            <p className="ch1-support">
              Хүн төрөлхтний эрсдэлийг урьдчилж тооцох ёстой.
            </p>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

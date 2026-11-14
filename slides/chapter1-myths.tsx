import type { ReactNode } from "react";

const navy = "#13296b";
const blue = "#2c55c8";
const pale = "#f3f5fa";
const line = "#c8d3eb";
const red = "#b64d4d";

function Concept({
  label,
  description,
  caption,
  children,
}: {
  label: string;
  description: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <article className="ch1-concept">
      <h2 className="ch1-keyword">{label}</h2>
      <svg
        className="ch1-concept-diagram"
        viewBox="0 0 440 470"
        role="img"
        aria-label={description}
      >
        <circle cx="220" cy="234" r="174" fill={pale} />
        {children}
      </svg>
      <p className="ch1-support">{caption}</p>
    </article>
  );
}

function UncertainClock() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M308 146A124 124 0 1 0 308 322" stroke={navy} strokeWidth="6" />
      <path d="M308 146A124 124 0 0 1 308 322" stroke={line} strokeWidth="6" strokeDasharray="4 15" />
      <path d="M220 131V146M117 234H132M220 337V322" stroke={line} strokeWidth="5" />
      <path d="M220 167V234L269 267" stroke={blue} strokeWidth="8" />
      <circle cx="220" cy="234" r="11" fill={navy} stroke="none" />
      <circle cx="345" cy="177" r="5" fill={line} stroke="none" />
      <circle cx="361" cy="234" r="5" fill={line} stroke="none" />
      <circle cx="345" cy="291" r="5" fill={line} stroke="none" />
    </g>
  );
}

function ResearchAndSafety() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M96 331V253C96 206 133 188 171 188C209 188 246 206 246 253V331Z" fill="#dbe7ff" stroke={navy} strokeWidth="5" />
      <path d="M171 197L149 244L171 265L193 244Z" fill="#fff" stroke={navy} strokeWidth="4" />
      <path d="M139 219L124 263L151 277M203 219L218 263L191 277M171 266V331" fill="none" stroke={blue} strokeWidth="4" />
      <path d="M130 124C130 76 212 76 212 124V151C212 206 130 206 130 151Z" fill="#fff" stroke={navy} strokeWidth="5" />
      <path d="M130 127C139 101 161 107 176 108C191 109 200 100 205 96" fill="none" stroke={navy} strokeWidth="5" />
      <g fill="none" stroke={blue} strokeWidth="4">
        <circle cx="151" cy="143" r="12" />
        <circle cx="192" cy="143" r="12" />
        <path d="M163 143H180M130 139H139M204 139H212" />
      </g>
      <path d="M284 196L350 220V279C350 327 284 365 284 365S218 327 218 279V220Z" fill="#fff" stroke={navy} strokeWidth="5" />
      <path d="M284 220L329 237V277C329 308 284 339 284 339S239 308 239 277V237Z" fill={pale} />
      <path d="M263 280L279 296L309 260" fill="none" stroke={blue} strokeWidth="6" />
    </g>
  );
}

function DivergingGoal() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="211" cy="225" r="111" fill="#fff" stroke={navy} strokeWidth="5" />
      <circle cx="211" cy="225" r="72" stroke={line} strokeWidth="5" />
      <circle cx="211" cy="225" r="34" stroke={blue} strokeWidth="5" />
      <circle cx="211" cy="225" r="8" fill={blue} stroke="none" />
      <path d="M80 366L170 276" stroke={blue} strokeWidth="7" />
      <path d="M148 276H170V298" stroke={blue} strokeWidth="6" />
      <path d="M166 280C214 332 285 345 353 314" stroke={red} strokeWidth="6" />
      <path d="M334 306L356 312L345 332" stroke={red} strokeWidth="5" />
      <path d="M233 203L281 155" stroke={line} strokeWidth="4" strokeDasharray="4 9" />
    </g>
  );
}

function ProgramNetwork() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <g fill="none" stroke={line} strokeWidth="4">
        <path d="M145 178H94V121M295 178H346V121M220 294V348" />
        <path d="M176 129V109M205 129V109M235 129V109M264 129V109M127 193H107M127 221H107M313 193H333M313 221H333" />
      </g>
      <rect x="127" y="129" width="186" height="165" rx="28" fill="#fff" stroke={navy} strokeWidth="5" />
      <path d="M183 183L156 211L183 239M257 183L284 211L257 239M233 172L207 250" fill="none" stroke={blue} strokeWidth="6" />
      <g fill="#fff" stroke={navy} strokeWidth="4">
        <rect x="66" y="72" width="56" height="49" rx="10" />
        <rect x="318" y="72" width="56" height="49" rx="10" />
        <circle cx="220" cy="365" r="32" />
      </g>
      <path d="M78 88H110M78 104H99M331 89L342 101L361 82" fill="none" stroke={blue} strokeWidth="4" />
      <circle cx="220" cy="365" r="10" fill={blue} />
      <path d="M220 343V349M220 381V387M198 365H204M236 365H242" fill="none" stroke={blue} strokeWidth="3" />
    </g>
  );
}

function IntelligenceAndControl() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <g fill="none" stroke={line} strokeWidth="4">
        <path d="M169 178L108 117M271 178L332 117M220 304V361" />
        <path d="M144 153L157 155L155 142M296 153L283 155L285 142M212 337L220 346L228 337" stroke={blue} />
      </g>
      <circle cx="220" cy="234" r="87" fill="#fff" stroke={navy} strokeWidth="5" />
      <g fill="none" stroke={blue} strokeWidth="4">
        <path d="M220 175C202 158 177 172 180 193C159 193 151 219 166 233C153 253 169 274 187 273C191 294 210 301 220 285Z" />
        <path d="M220 175C238 158 263 172 260 193C281 193 289 219 274 233C287 253 271 274 253 273C249 294 230 301 220 285Z" />
        <path d="M181 194L200 211L188 234M166 233L190 246M260 194L240 211L252 234M274 233L250 246M200 266L220 253L240 266" />
      </g>
      <g fill="#fff" stroke={navy} strokeWidth="4">
        <circle cx="91" cy="100" r="38" />
        <circle cx="349" cy="100" r="38" />
        <rect x="183" y="361" width="74" height="58" rx="14" />
      </g>
      <circle cx="91" cy="93" r="9" fill={blue} />
      <path d="M74 119C74 99 108 99 108 119" fill={blue} />
      <path d="M331 91H367M331 107H367M342 83V115M356 83V115M197 390H243" fill="none" stroke={blue} strokeWidth="4" />
      <circle cx="220" cy="390" r="7" fill={blue} />
    </g>
  );
}

function GoalAndConsequences() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <circle cx="297" cy="143" r="64" fill="#fff" stroke={navy} strokeWidth="5" />
      <circle cx="297" cy="143" r="39" fill="none" stroke={line} strokeWidth="4" />
      <circle cx="297" cy="143" r="15" fill={blue} />
      <path d="M83 369L290 161" fill="none" stroke={blue} strokeWidth="8" />
      <path d="M267 161H290V184" fill="none" stroke={blue} strokeWidth="6" />
      <ellipse cx="221" cy="292" rx="97" ry="67" fill="#fff" stroke={red} strokeWidth="3" strokeDasharray="5 9" />
      <g fill={red} stroke={red} strokeWidth="3">
        <g transform="translate(186 295) rotate(-22)">
          <ellipse cx="-11" rx="8" ry="6" /><circle r="6" /><circle cx="11" r="5" />
          <path d="M-8-5L-14-13M0-5L-2-14M7-4L12-12M-8 5L-14 13M0 5L-2 14M7 4L12 12M14-2L21-8M14 2L21 8" fill="none" />
        </g>
        <g transform="translate(248 316) rotate(20)">
          <ellipse cx="-11" rx="8" ry="6" /><circle r="6" /><circle cx="11" r="5" />
          <path d="M-8-5L-14-13M0-5L-2-14M7-4L12-12M-8 5L-14 13M0 5L-2 14M7 4L12 12M14-2L21-8M14 2L21 8" fill="none" />
        </g>
      </g>
      <path d="M114 390L145 378M304 284L329 270" fill="none" stroke={line} strokeWidth="4" strokeDasharray="3 9" />
    </g>
  );
}

export function Myths1() {
  return (
    <div className="ch1-minimal ch1-myths">
      <div className="ch1-three-grid">
        <Concept label="Хугацаа" description="AI-ийн хөгжлийн яг хугацаа тодорхойгүйг нээлттэй, цэгэн хүрээтэй цагаар дүрсэлсэн." caption="Супер AI хэзээ бий болох нь тодорхойгүй."><UncertainClock /></Concept>
        <Concept label="Эрсдэл" description="Судлаачид ч AI-ийн эрсдэлийг судалж, аюулгүй байдлын талаар санаа тавьдаг." caption="Судлаачид ч AI-ийн эрсдэлд санаа зовдог."><ResearchAndSafety /></Concept>
        <Concept label="Зорилго" description="Зорилго зөрөхөд муу санаагүй систем ч хор хүргэж болохыг чиглэлээс хазайсан сумаар дүрсэлсэн." caption="Аюул нь муу санаанаас бус, зөрсөн зорилгоос үүсэж болно."><DivergingGoal /></Concept>
      </div>
    </div>
  );
}

export function Myths2() {
  return (
    <div className="ch1-minimal ch1-myths">
      <div className="ch1-three-grid">
        <Concept label="Программ" description="AI-д роботын бие заавал хэрэггүй. Программ сүлжээ, төхөөрөмжөөр дамжин нөлөө үзүүлж чадна." caption="AI-д роботын бие заавал хэрэггүй."><ProgramNetwork /></Concept>
        <Concept label="Оюун ухаан" description="Оюун ухаан нь төлөвлөх, зохицуулах, хэрэгсэл ашиглах боломж өгдгийг хяналтын холбоосоор харуулсан." caption="Давуу тал нь хүчнээс илүү оюун ухаан."><IntelligenceAndControl /></Concept>
        <Concept label="Даалгавар" description="Зорилгоо биелүүлэх явцад бусдын хэрэгцээг орхигдуулбал хор учирч болдгийг шоргоолжны жишээгээр дүрсэлсэн." caption="Зорилгоо биелүүлэхэд мэдрэмж заавал хэрэггүй."><GoalAndConsequences /></Concept>
      </div>
    </div>
  );
}

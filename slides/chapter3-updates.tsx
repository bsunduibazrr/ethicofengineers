"use client";

import { R } from "@/components/ui";

export function Chapter3Research() {
  return (
    <div className="chapter3-research">
      <R>
        <h2 className="chapter3-update-title">НОМООС ХОЙШХИ ШИНЭ СУДАЛГАА</h2>
      </R>
      <div className="chapter3-studies">
        <R className="chapter3-study">
          <span className="chapter3-study-number">01</span>
          <ul>
            <li>30 гаруй улс, олон улсын байгууллагын дэмжлэгтэй,100 гаруй мэргэжилтний оролцоотой тайлан.</li>
            <li>AI зарим даалгаврыг амжилттай гүйцэтгэдэг болсон ч нарийн төвөгтэй нөхцөлд алдаа гаргасаар байгааг онцолсон.</li>
          </ul>
        </R>
        <R className="chapter3-study">
          <span className="chapter3-study-number">02</span>
          <ul>
            <li>Судлаачид GPT-4o-г шүүгчдийн өмнө явуулсан туршилттай төстэй нөхцөлд шалгасан.</li>
            <li>AI хууль зүйн өмнөх шийдвэрийг зөв хэрэглэх чадвар харуулсан.</li>
            <li>Харин хүний шүүгчидтэй харьцуулахад зарим нөхцөлд өөрөөр шийдвэр гаргасан.</li>
          </ul>
        </R>
      </div>
    </div>
  );
}

function ConclusionRobot() {
  return (
    <svg viewBox="0 0 480 450" className="chapter3-conclusion-robot" fill="none" aria-hidden="true">
      <circle cx="240" cy="220" r="185" stroke="currentColor" strokeOpacity=".12" />
      <circle cx="240" cy="220" r="150" stroke="currentColor" strokeOpacity=".1" strokeDasharray="2 9" />
      <path d="M240 60v40" stroke="currentColor" strokeWidth="3" />
      <circle cx="240" cy="53" r="10" fill="currentColor" />
      <rect x="81" y="120" width="318" height="243" rx="36" fill="white" stroke="currentColor" strokeWidth="3" />
      <rect x="103" y="143" width="274" height="180" rx="20" fill="currentColor" />
      <rect x="63" y="196" width="18" height="82" rx="8" fill="currentColor" />
      <rect x="399" y="196" width="18" height="82" rx="8" fill="currentColor" />
      <circle cx="182" cy="220" r="19" fill="white" />
      <circle cx="298" cy="220" r="19" fill="white" />
      <path d="M215 266c5 26 45 26 50 0" stroke="white" strokeWidth="7" strokeLinecap="round" />
      <path d="M195 363v21m90-21v21m-114 1h138" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M122 160h236" stroke="white" strokeOpacity=".2" strokeWidth="2" />
      <circle cx="120" cy="342" r="4" fill="currentColor" />
      <circle cx="360" cy="342" r="4" fill="currentColor" />
    </svg>
  );
}

export function Chapter3Conclusion() {
  return (
    <div className="chapter3-conclusion">
      <R>
        <h2 className="chapter3-update-title">ДҮГНЭЛТ</h2>
      </R>
      <div className="chapter3-conclusion-main">
        <div className="chapter3-conclusion-copy">
          <R>
            <h3 className="chapter3-conclusion-subtitle">ХИЙМЭЛ ОЮУНЫ ИРЭЭДҮЙ</h3>
          </R>
          <R>
            <ul className="chapter3-conclusion-points">
              <li>Боломж - шинжлэх ухаан, үйлдвэрлэл, амьдралын чанар</li>
              <li>Сорилт - алдаа, аюулгүй байдал, хууль, хяналт</li>
              <li>Нийгмийн асуудал - зэвсэг, ажлын байр, орлогын тэгш бус байдал</li>
            </ul>
          </R>
          <R className="chapter3-conclusion-question">
            <span>Гол асуулт:</span>
            <p>Бид хиймэл оюуны ирээдүйг зүгээр хүлээж авах уу, эсвэл өөрсдөө зөв чиглүүлэх үү?</p>
          </R>
        </div>
        <R className="chapter3-conclusion-art"><ConclusionRobot /></R>
      </div>
      <R className="chapter3-conclusion-sources">
        <p>AlphaFold, 2024 оны Нобелийн химийн шагнал — Nobel Prize</p>
        <p>Автомат зэвсгийн тухай НҮБ-ын тогтоол — United Nations Digital Library</p>
        <p>Ажил эрхлэлт ба хиймэл оюуны нөлөө, 2026 оны Stanford судалгаа — Stanford Digital Economy Lab</p>
        <p>Номын үндсэн агуулга — Life 3.0, Chapter 3.</p>
      </R>
    </div>
  );
}

"use client";

/* ───────────── 20. Кейс ───────────── */

export function Case() {
  return (
    <div className="case-visual">
      <h2 className="case-keyword case-speed">Хурд</h2>
      <h2 className="case-keyword case-safety">Аюулгүй байдал</h2>
      <svg
        className="case-intersection"
        viewBox="0 0 1640 680"
        role="img"
        aria-label="Зохиомол кейс: AI гэрлэн дохиог удирдан машинуудад ногоон гэрэл өгчээ. Харин явган зорчигчид, хүүхэд болон түргэн тусламж улаан гэрэл дээр хүлээж байна."
      >
        <defs>
          <g id="case-car">
            <rect x="15" y="-3" width="23" height="9" rx="3" fill="#13296b" />
            <rect x="15" y="54" width="23" height="9" rx="3" fill="#13296b" />
            <rect x="82" y="-3" width="23" height="9" rx="3" fill="#13296b" />
            <rect x="82" y="54" width="23" height="9" rx="3" fill="#13296b" />
            <rect width="124" height="60" rx="22" fill="#2c55c8" />
            <path d="M37 9H79L91 16V44L79 51H37L29 43V17Z" fill="#dbe7ff" />
            <path d="M43 10H74V50H43Z" fill="#2c55c8" />
            <path d="M112 15V24M112 36V45" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </g>
          <g id="case-person" fill="none" stroke="#13296b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <circle cy="-27" r="9" fill="#13296b" stroke="none" />
            <path d="M0-10V20M-17 8L0-7L17 8M0 20L-12 44M0 20L12 44" />
          </g>
          <g id="case-pedestrian-light">
            <rect width="43" height="72" rx="12" fill="#13296b" />
            <circle cx="21.5" cy="22" r="13" fill="#b64d4d" />
            <circle cx="21.5" cy="52" r="10" fill="#354474" />
            <path d="M21.5 72V103" stroke="#13296b" strokeWidth="5" />
          </g>
        </defs>

        <path d="M1140 40V640H1360V40" fill="#f3f5fa" />
        <rect x="40" y="230" width="1560" height="230" rx="10" fill="#f3f5fa" />
        <path d="M40 230H1140V40M1360 40V230H1600M40 460H1140V640M1360 640V460H1600" fill="none" stroke="#dce2ef" strokeWidth="3" />
        <path d="M40 345H960M1420 345H1600M1250 40V185M1250 530V640" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="25 24" />

        <path d="M105 292H145M122 280L139 292L122 304M420 292H460M437 280L454 292L437 304M700 292H740M717 280L734 292L717 304M1430 402H1470M1453 390L1436 402L1453 414" fill="none" stroke="#9baddd" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M162 275H208M149 288H198M168 301H208M460 383H502M450 396H492M464 409H502M742 275H784M732 288H774M746 301H784" stroke="#b9c8ea" strokeWidth="4" strokeLinecap="round" />
        <use href="#case-car" transform="translate(225 262)" />
        <use href="#case-car" transform="translate(520 375) rotate(180 62 30)" />
        <use href="#case-car" transform="translate(800 262)" />
        <use href="#case-car" transform="translate(1390 262)" />

        <g fill="#fff">
          {[240, 274, 308, 342, 376, 410, 444].map((y) => (
            <rect key={y} x="1000" y={y} width="80" height="13" rx="2" />
          ))}
        </g>
        <path d="M984 221H1095M1148 482H1352" stroke="#b64d4d" strokeWidth="6" />

        <path d="M993 130C993 104 1017 89 1046 89H1080" fill="none" stroke="#ead3d3" strokeWidth="2" />
        <use href="#case-person" transform="translate(994 151)" />
        <use href="#case-person" transform="translate(1046 159) scale(.68)" />
        <use href="#case-person" transform="translate(1091 151)" />
        <use href="#case-pedestrian-light" transform="translate(1130 125)" />

        <g transform="translate(1207 515)">
          <rect x="-4" y="19" width="8" height="22" rx="3" fill="#13296b" />
          <rect x="-4" y="82" width="8" height="22" rx="3" fill="#13296b" />
          <rect x="81" y="19" width="8" height="22" rx="3" fill="#13296b" />
          <rect x="81" y="82" width="8" height="22" rx="3" fill="#13296b" />
          <rect width="85" height="125" rx="20" fill="#fff" stroke="#13296b" strokeWidth="3" />
          <path d="M11 17Q42.5 6 74 17V35H11Z" fill="#dbe7ff" />
          <path d="M3 46H82" stroke="#b64d4d" strokeWidth="6" />
          <rect x="28" y="5" width="29" height="6" rx="3" fill="#b64d4d" />
          <path d="M42.5 67V101M25.5 84H59.5" stroke="#b64d4d" strokeWidth="11" />
          <path d="M14 114H24M61 114H71" stroke="#b64d4d" strokeWidth="4" strokeLinecap="round" />
        </g>
        <use href="#case-pedestrian-light" transform="translate(1394 507)" />

        <g transform="translate(705 69)">
          <path d="M-17 18H0M-17 39H0M-17 60H0M84 18H101M84 39H101M84 60H101M20-17V0M42-17V0M64-17V0M20 78V95M42 78V95M64 78V95" fill="none" stroke="#9aabd3" strokeWidth="3" strokeLinecap="round" />
          <rect width="84" height="78" rx="18" fill="#fff" stroke="#13296b" strokeWidth="3" />
          <path d="M26 25L58 53M26 53L58 25M26 25V53M58 25V53" fill="none" stroke="#2c55c8" strokeWidth="2" />
          <g fill="#13296b">
            <circle cx="26" cy="25" r="5" />
            <circle cx="58" cy="25" r="5" />
            <circle cx="26" cy="53" r="5" />
            <circle cx="58" cy="53" r="5" />
          </g>
        </g>
        <path d="M695 108H642Q626 108 626 124V169M800 108H1108Q1151 108 1151 125" fill="none" stroke="#ccd6ea" strokeWidth="2" />
        <g transform="translate(604 163)">
          <rect width="44" height="74" rx="13" fill="#13296b" />
          <circle cx="22" cy="17" r="9" fill="#354474" />
          <circle cx="22" cy="37" r="9" fill="#354474" />
          <circle className="case-go-light" cx="22" cy="58" r="11" fill="#3a8a73" />
        </g>
        <path d="M1152 124H1389Q1415 124 1415 150V507" fill="none" stroke="#ead3d3" strokeWidth="2" strokeDasharray="5 7" />
      </svg>
    </div>
  );
}

/* ───────────── 21. Хэлэлцүүлэг ───────────── */

export function QA() {
  return (
    <div className="discussion-visual">
      <h2 className="discussion-keyword discussion-decision">Шийдвэр</h2>
      <h2 className="discussion-keyword discussion-accountability">Хариуцлага</h2>
      <svg
        className="discussion-diagram"
        viewBox="0 0 1640 680"
        role="img"
        aria-label="Хотын захиргаа, инженер, ашиглагч хүн AI гэрлэн дохионы зорилго, шийдвэр, хяналтыг хамт хариуцна. AI-д даатгасан ч хүний хариуцлага үлдэнэ."
      >
        <path d="M465 340H632M968 295C1050 295 1054 180 1168 180M968 385C1050 385 1054 510 1168 510" fill="none" stroke="#c8d3eb" strokeWidth="4" />
        <path d="M595 326L611 340L595 354M1110 166L1126 180L1110 194M1110 496L1126 510L1110 524" fill="none" stroke="#2c55c8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1295 306V384" stroke="#dce3f0" strokeWidth="3" strokeDasharray="6 10" />

        <circle cx="315" cy="340" r="150" fill="#f3f5fa" />
        <g fill="none" stroke="#13296b" strokeWidth="4" strokeLinejoin="round">
          <path d="M216 300L315 244L414 300Z" fill="#fff" />
          <path d="M229 314H401M221 415H409M211 432H419" />
          <path d="M245 320V402M290 320V402M340 320V402M385 320V402" strokeWidth="11" />
          <path d="M315 244V215H348L337 229H315" fill="#2c55c8" />
        </g>
        <circle cx="428" cy="444" r="41" fill="#fff" stroke="#dce3f0" strokeWidth="3" />
        <circle cx="428" cy="433" r="10" fill="#13296b" />
        <path d="M409 465V457C409 443 447 443 447 457V465" fill="#2c55c8" />

        <circle cx="800" cy="340" r="168" fill="#f3f5fa" />
        <circle cx="800" cy="340" r="145" fill="#fff" stroke="#dce3f0" strokeWidth="2" />
        <g transform="translate(727 223)">
          <rect width="91" height="226" rx="26" fill="#13296b" />
          <circle cx="45.5" cy="45" r="25" fill="#354474" />
          <circle cx="45.5" cy="113" r="25" fill="#354474" />
          <circle cx="45.5" cy="181" r="25" fill="#3a8a73" />
          <path d="M45.5 226V265M18 266H73" fill="none" stroke="#13296b" strokeWidth="6" strokeLinecap="round" />
        </g>
        <g transform="translate(849 293)">
          <path d="M-12 17H0M-12 38H0M68 17H80M68 38H80M19-12V0M48-12V0M19 65V77M48 65V77" fill="none" stroke="#9aabd3" strokeWidth="3" strokeLinecap="round" />
          <rect width="68" height="65" rx="14" fill="#fff" stroke="#13296b" strokeWidth="3" />
          <path d="M20 20L48 45M20 45L48 20M20 20V45M48 20V45" fill="none" stroke="#2c55c8" strokeWidth="2" />
          <g fill="#13296b">
            <circle cx="20" cy="20" r="4" /><circle cx="48" cy="20" r="4" />
            <circle cx="20" cy="45" r="4" /><circle cx="48" cy="45" r="4" />
          </g>
        </g>
        <path d="M818 336H837" fill="none" stroke="#c8d3eb" strokeWidth="3" />

        <circle cx="1295" cy="180" r="125" fill="#f3f5fa" />
        <g transform="translate(1295 174)">
          <path d="M-36-39C-36-84 36-84 36-39" fill="#fff" stroke="#13296b" strokeWidth="4" />
          <path d="M-44-39H44M-10-79V-39M10-79V-39" fill="none" stroke="#2c55c8" strokeWidth="5" strokeLinecap="round" />
          <path d="M-29-30V-14C-29 21 29 21 29-14V-30" fill="none" stroke="#13296b" strokeWidth="4" />
          <path d="M-63 60V47C-63 5 63 5 63 47V60" fill="#dbe7ff" stroke="#13296b" strokeWidth="4" />
          <path d="M-55 29H55L47 84H-47Z" fill="#fff" stroke="#13296b" strokeWidth="4" strokeLinejoin="round" />
          <path d="M-69 85H69" stroke="#13296b" strokeWidth="4" strokeLinecap="round" />
          <path d="M-17 48L-29 59L-17 70M17 48L29 59L17 70M5 45L-5 73" fill="none" stroke="#2c55c8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <circle cx="1295" cy="510" r="125" fill="#f3f5fa" />
        <g transform="translate(1295 505)">
          <circle cy="-52" r="26" fill="#fff" stroke="#13296b" strokeWidth="4" />
          <path d="M-32-55C-32-95 32-95 32-55M-32-55V-40M32-55V-40M32-41H43V-22H14" fill="none" stroke="#2c55c8" strokeWidth="4" strokeLinecap="round" />
          <path d="M-56 17C-56-22 56-22 56 17V53H-56Z" fill="#dbe7ff" stroke="#13296b" strokeWidth="4" />
          <rect x="-75" y="12" width="150" height="69" rx="12" fill="#fff" stroke="#13296b" strokeWidth="4" />
          <path d="M-48 35H-7M-48 58H-7M18 32V62M48 32V62" fill="none" stroke="#c8d3eb" strokeWidth="4" strokeLinecap="round" />
          <circle cx="-24" cy="35" r="6" fill="#2c55c8" />
          <circle cx="-36" cy="58" r="6" fill="#2c55c8" />
          <circle cx="18" cy="43" r="6" fill="#3a8a73" />
          <circle cx="48" cy="55" r="6" fill="#b64d4d" />
        </g>
      </svg>
    </div>
  );
}

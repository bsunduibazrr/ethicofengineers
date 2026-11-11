# Амьдрал 3.0

71 слайдын зөвхөн дизайны шинэчлэлт. Слайдын текст, дараалал, мэдээллийн бүлэглэл болон ийн тэмдэглэл эх сурвалжаараа хадгалагдана.

- `npm run dev` — Next.js preview.
- `npm run build` — production build.
- `npm run design` — 3, 4, 6, 8-р бүлгийн слайдыг нийтлэг загвар дээр байрлуулж `slides/design.json`-ийг үүсгэнэ; текст өөрчлөгдсөн бол алдаа заана.
- `npm run verify:content` — эх TSX слайдуудыг frozen JSON-тэй тэмдэгт бүрээр тулгана.
- `npm run export:html` — бүх зураг, фонт, CSS, JavaScript агуулсан `dist/life3.html` файлыг үүсгэнэ. Браузерт шууд нээж offline ашиглана.
- `npm run verify:browser` — Playwright байгаа орчинд бүх слайдын текст, багталт, удирдлага, responsive хэмжээг шалгана. Шаардлагатай бол `LIFE3_PLAYWRIGHT`, `LIFE3_CHROMIUM` орчны хувьсагчаар замыг заана.

`slides/content.source.json` бол renderer-ийн цорын ганц агуулгын эх сурвалж. Дахин гаргаж авах script нь энэ файлыг дарж бичихгүй. Анхны React слайдуудыг лавлагаа, тулгалтад зориулан өөрчлөлтгүй хадгалсан.

Удирдлага: ←/→, Space, Shift+Space, Home/End, PageUp/PageDown, swipe. F — fullscreen, Esc — overview болон шууд үсрэх, N — эх тэмдэглэл. Overview нь keyboard focus trap-тай native dialog ашиглана. Гар утсанд слайдын харьцааг хадгалж scale хийж, удирдлагын товчийг 44px хэвээр харуулна.

Дизайны үндэслэл: `DESIGN.md`. Слайдын төрлийн аудит: `slides/slide-audit.json`. Шалгалтын нотолгоо: `reports/`.

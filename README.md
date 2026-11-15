# Амьдрал 3.0

73 слайдтай Амьдрал 3.0 илтгэл. 33–34-р слайдад нэмэлт судалгаа, 3-р бүлгийн дүгнэлт, 36–44-р слайдад `Life3_Chapter4_Art.pptx` файлын 4-р бүлгийн бүх 9 слайд багтана. Шинэ 4-р бүлгийн текст, хашилт, зураг, схемийн дараалал болон илтгэгчийн тэмдэглэлийг эх файлаас хадгалсан. Төгсгөлийн слайд зөвхөн Анхаарал хандуулсанд баярлалаа гэсэн бичигтэй. Хоёр үгийн сүлжээг `/ajilbar` хуудсанд шууд нээнэ. Сүлжээ бүр хөндлөн 3, босоо 3 үгтэй бөгөөд илтгэлд гарсан нэр томьёо, хүмүүсийн нэрийг асуултаар бататгана.

- `npm run dev` — Next.js preview.
- `npm run build` — production build.
- `npm run design` — 3, 4, 6, 8-р бүлгийн слайдыг нийтлэг загвар дээр байрлуулж `slides/design.json`-ийг үүсгэнэ; текст өөрчлөгдсөн бол алдаа заана.
- `npm run verify:content` — эх TSX слайдуудыг frozen JSON-тэй тэмдэгт бүрээр тулгана.
- `npm run verify:crosswords` — хоёр үгийн сүлжээний 3+3 бүтэц, огтлолцол, дугаарлалт болон хариултууд илтгэлийн агуулгад байгаа эсэхийг шалгана.
- `npm run verify:chapter4` — хадгалсан эх PPTX-ийн XML-ээс 9 слайдын текст, хашилт, зай, текстийн хэсэг, тэмдэглэлийг бие даан уншиж импорт, загвар, offline HTML-тэй яг тулгана. Зургууд эх файлын байттай ижил, далд зураг ороогүйг мөн шалгана.
- `npm run export:html` — бүх зураг, фонт, CSS, JavaScript агуулсан `dist/life3.html` файлыг үүсгэнэ. Браузерт шууд нээж offline ашиглана.
- `npm run verify:browser` — Playwright байгаа орчинд бүх слайдын текст, багталт, удирдлага, responsive хэмжээг шалгана. Шаардлагатай бол `LIFE3_PLAYWRIGHT`, `LIFE3_CHROMIUM` орчны хувьсагчаар замыг заана.

`slides/content.source.json` бол renderer-ийн цорын ганц агуулгын эх сурвалж. Дахин гаргаж авах script анхдагч горимоор энэ файлыг дарж бичихгүй; `--update-chapter4` нь зөвхөн 4-р бүлгийг сольж, бусад snapshot-ийг хадгална. Өмнөх бүлгүүдийн React слайдуудыг лавлагаа, тулгалтад зориулан хадгалсан. Шинэ 4-р бүлгийн хашилтыг эх файлаар нь үлдээсэн.

4-р бүлгийг дангаар нь шинэчлэхдээ бусад бүлгийн snapshot болон загварыг хадгална:

```sh
python3 scripts/import_pptx_slides.py --replace-chapter4 slides/sources/Life3_Chapter4_Art.pptx
node scripts/extract-content.cjs --update-chapter4
node scripts/build-design.cjs --update-chapter4
node scripts/export-html.cjs
npm run verify:chapter4
```

Удирдлага: ←/→, Space, Shift+Space, Home/End, PageUp/PageDown, swipe. F — fullscreen, Esc — overview болон шууд үсрэх, N — эх тэмдэглэл. Overview нь keyboard focus trap-тай native dialog ашиглана. Доод хэсгийн удирдлагын товч, слайдын тоолуур арилсан. Гар утсанд слайдын харьцааг хадгалж, дэлгэцийн боломжит талбайд багтаана.

Дизайны үндэслэл: `DESIGN.md`. Слайдын төрлийн аудит: `slides/slide-audit.json`. Шалгалтын нотолгоо: `reports/`.

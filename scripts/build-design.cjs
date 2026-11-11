#!/usr/bin/env node
/*
 * Imported chapters (3, 4, 6, 8) re-laid out on the deck's shared templates.
 *
 * Every visible string comes from slides/imported-pptx.json by paragraph index
 * (P/R helpers). The script fails unless each source paragraph is used exactly
 * once, and then re-checks the finished HTML text against the source.
 * Elements marked data-chrome (section kicker) are design labels, not copy.
 *
 *   node scripts/build-design.cjs   → slides/design.json
 */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pptx = JSON.parse(fs.readFileSync(path.join(root, 'slides/imported-pptx.json'), 'utf8'));

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function paragraphsOf(slide) {
  const out = [];
  const add = p => out.push(p.runs.map(r => r.text));
  for (const node of slide.nodes) {
    if (node.kind === 'text') node.text.paragraphs.forEach(add);
    if (node.kind === 'table') node.rows.forEach(row => row.cells.forEach(c => c.text && c.text.paragraphs.forEach(add)));
  }
  return out;
}

function context(slide, id) {
  const paras = paragraphsOf(slide);
  const used = paras.map(() => 0);
  const take = i => { if (!paras[i]) throw new Error(`${id}: no paragraph ${i}`); used[i]++; return paras[i]; };
  /** Whole paragraph, escaped, outer whitespace trimmed (HTML collapses it anyway). */
  const P = i => esc(take(i).join('').trim());
  /** Paragraph runs, escaped, for inline markup such as superscripts. */
  const R = i => take(i).map(esc);
  const images = slide.nodes.filter(n => n.kind === 'image');
  const IMG = (file, cls = '', pos = '50% 50%') => {
    const node = images.find(n => n.src.endsWith(file));
    if (!node) throw new Error(`${id}: no image ${file}`);
    const alt = /^[A-Z]:\\/.test(node.alt || '') || /^Freeform/.test(node.alt || '') ? '' : node.alt || '';
    return `<img src="${node.src}" alt="${esc(alt)}" class="${cls}" style="object-position:${pos}" draggable="false"/>`;
  };
  const done = () => {
    const bad = used.map((n, i) => [n, i]).filter(([n]) => n !== 1);
    if (bad.length) throw new Error(`${id}: paragraphs used ≠ once → ${bad.map(([n, i]) => `[${i}]×${n}`).join(' ')}`);
    return paras;
  };
  return { P, R, IMG, done };
}

/* ───────────── Shared building blocks ───────────── */

const SECTION = {
  chapter3: { kicker: '3-р бүлэг · Ойрын ирээдүй', num: '03' },
  chapter4: { kicker: '4-р бүлэг · Оюун ухааны тэсрэлт', num: '04' },
  chapter6: { kicker: '6-р бүлэг · Дараагийн тэрбум жил', num: '06' },
  consciousness: { kicker: '8-р бүлэг · Ухамсар', num: '08' },
};

const kicker = label => `<div class="kicker-wrapper" data-chrome><div class="kicker-pill"><span class="kicker-diamond">◆</span><span class="kicker-label">${label}</span></div></div>`;
const header = (k, title, { sub = '', caps = false, folio = '' } = {}) =>
  `<div class="header">${folio ? `<div class="header-top">${kicker(k)}<span class="folio">${folio}</span></div>` : kicker(k)}<div><h2 class="title${caps ? ' caps' : ''}">${title}</h2></div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;
const list = (items, cls = '') => `<ul class="blist ${cls}">${items.map(t => `<li>${t}</li>`).join('')}</ul>`;
const figure = (img, { cls = '', cap = '' } = {}) => `<figure class="photo xfig ${cls}"><div class="photo-frame">${img}</div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
const step = (n, text) => `<div class="xstep"><b>${n}</b><p>${text}</p></div>`;
const card = (h, p = '', cls = '') => `<div class="xcard ${cls}"><h3>${h}</h3>${p ? `<p>${p}</p>` : ''}</div>`;
const lead = html => `<div class="xlead">${html}</div>`;
const conclusion = html => `<div class="xconclusion">${html}</div>`;
const arrow = a => `<span class="xarrow">${a}</span>`;
const paren = s => s.replace(/\s*(\([^)]*\))\s*$/, m => ` <small>${m.trim()}</small>`);

/** Chapter opener — mirrors the 1st/2nd chapter divider: text left, full-bleed panel right. */
function opener({ num, label, title, caps = false, extra = '', art = 'orbits' }) {
  return `<div class="divider opener"><div class="div-body"><div class="div-num" data-num="${num}" aria-hidden="true"></div>${label}<div><h2 class="div-title${caps ? ' caps' : ''}">${title}</h2></div>${extra}</div><div class="op-panel" data-num="${num}" aria-hidden="true">${ART[art]}</div></div>`;
}

const ART = {
  orbits: `<svg viewBox="0 0 740 960" class="op-art"><g fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="370" cy="470" r="120"/><circle cx="370" cy="470" r="200" stroke-dasharray="2 8"/><circle cx="370" cy="470" r="290"/><circle cx="370" cy="470" r="390" stroke-dasharray="1 10"/><ellipse cx="370" cy="470" rx="330" ry="110" transform="rotate(-24 370 470)"/></g><g fill="currentColor"><circle cx="490" cy="470" r="6"/><circle cx="196" cy="300" r="4"/><circle cx="620" cy="690" r="5"/><circle cx="370" cy="80" r="3"/></g></svg>`,
  grid: `<svg viewBox="0 0 740 960" class="op-art"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M70 800 Q 370 120 670 800" /><path d="M70 800 Q 370 300 670 800" stroke-dasharray="2 8"/><path d="M70 800 Q 370 470 670 800"/><line x1="40" y1="800" x2="700" y2="800"/></g><g fill="currentColor"><circle cx="370" cy="460" r="7"/><circle cx="252" cy="560" r="4"/><circle cx="488" cy="560" r="4"/></g></svg>`,
  galaxy: `<svg viewBox="0 0 740 960" class="op-art"><g fill="none" stroke="currentColor" stroke-width="1.1"><path d="M370 480 m-30 0 a30 30 0 1 1 60 0 a70 70 0 1 1 -140 0 a110 110 0 1 1 220 0 a150 150 0 1 1 -300 0 a190 190 0 1 1 380 0 a230 230 0 1 1 -460 0"/></g><g fill="currentColor"><circle cx="370" cy="480" r="8"/><circle cx="120" cy="180" r="2.5"/><circle cx="640" cy="230" r="3"/><circle cx="600" cy="800" r="2"/><circle cx="160" cy="760" r="3"/><circle cx="520" cy="120" r="2"/></g></svg>`,
  mind: `<svg viewBox="0 0 740 960" class="op-art"><g fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="370" cy="470" r="250"/><circle cx="370" cy="470" r="250" transform="translate(-60 0)" stroke-dasharray="2 8"/><circle cx="370" cy="470" r="250" transform="translate(60 0)" stroke-dasharray="2 8"/><circle cx="370" cy="470" r="90"/></g><circle cx="370" cy="470" r="10" fill="currentColor"/></svg>`,
};

/* ───────────── Slide layouts ───────────── */

const S3 = SECTION.chapter3, S4 = SECTION.chapter4, S6 = SECTION.chapter6, S8 = SECTION.consciousness;

const layouts = {
  /* —— 3-р бүлэг —— */
  'chapter3-01': ({ P }) => opener({ num: S3.num, label: `<div class="kicker">${P(0)}</div>`, title: P(1), caps: true, art: 'grid' }),

  'chapter3-02': ({ P }) => `<div class="agenda"><div class="ag-head"><div class="kicker">${P(0)}</div><h2 class="title caps">${P(1)}</h2></div><ol class="ag-list auto">${[2, 3, 4].map(i => `<li class="ag-row"><span class="ag-n"></span><span class="ag-t">${P(i)}</span></li>`).join('')}</ol></div>`,

  'chapter3-03': ({ P, IMG }) => `<div class="xmedia">${header(S3.kicker, P(0), { caps: true })}<div class="xmedia-grid right"><div class="xmedia-body">${list([P(1), P(2), P(3), P(4)], 'big')}</div>${figure(IMG('image7.png'), { cls: 'wide' })}</div></div>`,

  'chapter3-04': ({ P, IMG }) => `<div class="xmedia">${header(S3.kicker, P(0), { caps: true })}<div class="xmedia-grid right"><div class="xmedia-body">${list([P(1), P(2), P(3), P(4)], 'big')}</div>${figure(IMG('image7.png'), { cls: 'wide' })}</div></div>`,

  'chapter3-05': ({ P }) => `<div class="xtable-slide">${header(S3.kicker, P(12), { caps: true })}<table class="xtable"><thead><tr><th>${P(0)}</th><th>${P(1)}</th><th>${P(2)}</th></tr></thead><tbody>${[[3, 4, 5], [6, 7, 8], [9, 10, 11]].map(([a, b, c]) => `<tr><td class="yr">${P(a)}</td><td class="ex">${P(b)}</td><td>${P(c)}</td></tr>`).join('')}</tbody></table></div>`,

  'chapter3-06': ({ P }) => {
    const ring = q => `<svg viewBox="0 0 120 120" class="ring" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle cx="60" cy="60" r="52" class="arc" pathLength="100" stroke-dasharray="${q} 100"/></svg>`;
    const col = (n, q, name) => `<div class="pillar">${ring(q)}<span class="pillar-n">${n}</span><h3>${name}</h3></div>`;
    return `<div class="pillars-slide">${header(S3.kicker, P(0), { caps: true })}<div class="pillars">${col(P(1), 25, paren(P(11)))}${col(P(2), 50, `${P(9)} <small>${P(10)}</small>`)}${col(P(3), 75, `${P(7)} <small>${P(8)}</small>`)}${col(P(4), 100, `${P(5)} <small>${P(6)}</small>`)}</div></div>`;
  },

  'chapter3-07': ({ P, IMG }) => `<div class="xmedia tall">${figure(IMG('image12.jpeg', '', '30% 50%'), { cls: 'bleed-left' })}<div class="xmedia-body">${header(S3.kicker, P(0), { caps: true })}${list([P(1), P(2), P(3), P(4)], 'big')}</div></div>`,

  'chapter3-08': ({ P }) => {
    const item = (n, t) => `<div class="dmd-item"><span class="dmd"><b>${n}</b></span><p>${t}</p></div>`;
    return `<div class="dmd-slide">${header(S3.kicker, P(0), { caps: true })}<div class="dmd-grid">${item(P(2), P(5))}${item(P(3), P(6))}${item(P(4), P(7))}${item(P(1), P(8))}</div></div>`;
  },

  'chapter3-09': ({ P }) => `<div class="xpair-slide">${header(S3.kicker, P(0), { caps: true })}<div class="xpair">${list([P(1), P(2), P(3), P(4)], 'big')}<div class="xpanel"><h3>${P(5)}</h3><ol class="qlist">${[6, 7, 8].map(i => `<li>${P(i)}</li>`).join('')}</ol></div></div></div>`,

  'chapter3-10': ({ P }) => `<div class="xcols-slide">${header(S3.kicker, P(0), { caps: true })}<div class="xcols">${`<div class="xcol"><span class="xcol-n">${P(1)}</span><h3>${P(2)}</h3><p>${P(3)}</p></div><div class="xcol"><span class="xcol-n">${P(4)}</span><h3>${P(6)}</h3></div><div class="xcol"><span class="xcol-n">${P(5)}</span><h3>${P(7)}</h3></div>`}</div></div>`,

  /* —— 4-р бүлэг —— */
  'chapter4-01': ({ P }) => opener({ num: S4.num, label: `<div class="kicker">${P(0)}</div>`, title: P(1), extra: `<div class="div-en">${P(2)}</div><div class="epigraph">${P(3)}<small>${P(4)}</small></div>`, art: 'grid' }),

  'chapter4-02': ({ P }) => `<div class="xflow-slide">${header(S4.kicker, P(0), { folio: P(1) })}${lead(P(2))}<div class="xflow n3">${card(P(3), P(4))}${arrow(P(5))}${card(P(6), P(7))}${arrow(P(8))}${card(P(9), P(10))}</div><div class="xnote">${P(11)}</div></div>`,

  'chapter4-03': ({ P }) => `<div class="xflow-slide">${header(S4.kicker, P(0), { folio: P(1) })}${lead(P(2))}<div class="xflow n3">${card(P(3), P(4))}${arrow(P(5))}${card(P(6), P(7))}${arrow(P(8))}${card(P(9), P(10))}</div><div class="xnote quote">${P(11)}</div></div>`,

  'chapter4-04': ({ P }) => `<div class="xpair-slide">${header(S4.kicker, P(0), { folio: P(1) })}${lead(P(2))}<div class="xpair">${card(P(3), P(4))}${card(P(5), P(6), 'accent')}</div>${conclusion(P(7))}</div>`,

  'chapter4-05': ({ P }) => `<div class="xflow-slide">${header(S4.kicker, P(0), { folio: P(1) })}${lead(P(2))}<div class="xflow n4">${card(P(3), P(4))}${arrow(P(5))}${card(P(6), P(7))}${arrow(P(8))}${card(P(9), P(10))}${arrow(P(11))}${card(P(12), P(13), 'accent')}</div><div class="xnote">${P(14)}</div></div>`,

  'chapter4-06': ({ P }) => `<div class="xpair-slide">${header(S4.kicker, P(0), { folio: P(1) })}<div class="xpair big">${card(P(2), P(3))}${card(P(4), P(5))}</div>${conclusion(P(6))}</div>`,

  'chapter4-07': ({ P }) => `<div class="xstats-slide">${header(S4.kicker, P(0), { folio: P(1) })}<div class="xstats">${[[2, 3], [4, 5], [6, 7], [8, 9]].map(([a, b]) => `<div class="xstat"><b>${P(a)}</b><span>${P(b)}</span></div>`).join('')}</div>${list([P(10), P(11), P(12)])}</div>`,

  'chapter4-08': ({ P }) => `<div class="xpair-slide">${header(S4.kicker, P(0), { folio: P(1) })}<div class="xpair">${card(P(2), P(3))}${card(P(4), P(5))}</div><div class="xpanel plain"><p>${P(6)}</p></div>${conclusion(P(7))}</div>`,

  'chapter4-09': ({ P }) => `<div class="xpair-slide">${header(S4.kicker, P(0), { folio: P(1) })}<div class="xchain">${`<span>${P(2)}</span>${arrow(P(3))}<span>${P(4)}</span>${arrow(P(5))}<span>${P(6)}</span>${arrow(P(7))}<span>${P(8)}</span>`}</div><div class="xpair">${card(P(9), P(10))}${card(P(11), P(12))}</div>${conclusion(P(13))}</div>`,

  'chapter4-10': ({ P }) => `<div class="xpair-slide">${header(S4.kicker, P(0), { folio: P(1) })}<div class="xpair big">${card(P(2), P(3))}<div class="xcard accent"><h3>${P(4)}</h3>${list([P(5), P(6), P(7)])}</div></div><div class="xfinal">${P(8)}</div></div>`,

  /* —— 6-р бүлэг —— */
  'chapter6-01': ({ P }) => opener({ num: S6.num, label: `<div class="kicker">${P(0)}</div>`, title: P(1), caps: true, art: 'galaxy' }),

  'chapter6-02': ctx => agenda6(ctx, 0),
  'chapter6-10': ctx => agenda6(ctx, 1),
  'chapter6-15': ctx => agenda6(ctx, 2),

  'chapter6-03': ({ P, IMG }) => `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left portrait">${figure(IMG('image1.png', '', '50% 20%'), { cap: `<b>${P(1)}</b>` })}<div class="xmedia-body"><div class="xstats two">${`<div class="xstat"><b>${P(2)}</b><span>${P(3)}</span></div><div class="xstat"><b>${P(4)}</b><span>${P(5)}</span></div>`}</div><p class="xbody">${P(6)}</p></div></div></div>`,

  'chapter6-04': ({ P, IMG }) => `<div class="xfull">${header(S6.kicker, P(0))}${figure(IMG('image2.png'), { cls: 'dark' })}</div>`,

  'chapter6-05': ({ P, IMG }) => `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left">${figure(IMG('image3.png'), { cls: 'contain dark' })}<div class="xmedia-body"><h3 class="xh">${P(1)}</h3>${step(P(2), P(3))}${step(P(4), P(5))}${step(P(6), P(7))}${step(P(8), P(9))}</div></div></div>`,

  'chapter6-06': ({ P }) => `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left"><div class="xart" aria-hidden="true">${QUASAR}</div><div class="xmedia-body"><h3 class="xh">${P(1)}</h3>${step(P(2), P(3))}${step(P(4), P(5))}${step(P(6), P(7))}</div></div></div>`,

  'chapter6-07': ({ P, IMG }) => `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left">${figure(IMG('image4.png'), { cls: 'contain', cap: P(8) })}<div class="xmedia-body"><h3 class="xh">${P(1)}</h3>${step(P(2), P(3))}${step(P(4), P(5))}${step(P(6), P(7))}</div></div></div>`,

  'chapter6-08': ({ P, IMG }) => `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left">${figure(IMG('image5.png'), { cls: 'contain' })}<div class="xmedia-body"><h3 class="xh">${P(1)}</h3><div class="xstat solo"><b>${P(2)}</b><span>${P(3)}</span></div><p class="xbody">${P(4)}</p><div class="xmono">${P(5)}</div></div></div></div>`,

  'chapter6-09': ({ P, R }) => {
    const sup = (runs, k) => runs.map((r, j) => (j === k ? `<sup>${r}</sup>` : r)).join('');
    return `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left narrow"><div class="kg"><div class="kg-cube" aria-hidden="true">${CUBE}</div><b>${P(1)}</b><span>${P(2)}</span></div><div class="xmedia-body"><p class="xbody lg">${P(3)}</p><div class="xstats two">${`<div class="xstat"><b>${sup(R(4), 1)}</b><span>${P(5)}</span></div><div class="xstat"><b>${sup(R(6), 1)}</b><span>${P(7)}</span></div>`}</div>${list([sup(R(8), 1), sup(R(9), 1), sup(R(10), 1)])}</div></div></div>`;
  },

  'chapter6-11': ({ P, IMG }) => `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left">${figure(IMG('image6.png'), { cls: 'contain' })}<div class="xmedia-body"><h3 class="xh">${P(1)}</h3><div class="xeyebrow">${P(2)}</div><div class="xstat solo"><b>${P(3)}</b><span>${P(4)}</span></div><div class="xstat solo"><b>${P(5)}</b><span>${P(6)}</span></div></div></div></div>`,

  'chapter6-12': ({ P, IMG }) => `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left">${figure(IMG('image7.png'), { cls: 'contain' })}<div class="xmedia-body"><h3 class="xh">${P(1)}</h3><div class="xstat solo"><b>${P(2)}</b></div><p class="xbody">${P(3)}</p><div class="xnote">${P(4)}</div></div></div></div>`,

  'chapter6-13': ({ P, IMG }) => `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left">${figure(IMG('image8.png'), { cls: 'contain' })}<div class="xmedia-body"><div class="xdl">${[[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]].map(([a, b]) => `<div><b>${P(a)}</b><span>${P(b)}</span></div>`).join('')}</div></div></div></div>`,

  'chapter6-14': ({ P }) => `<div class="xquote-slide">${header(S6.kicker, P(0))}<div class="xquote"><div class="xinf">${P(1)}</div><blockquote><p>${P(2)}</p><cite>${P(3)}</cite></blockquote></div></div>`,

  'chapter6-16': ({ P, IMG }) => `<div class="xmedia">${header(S6.kicker, P(0))}<div class="xmedia-grid left">${figure(IMG('image9.png'), { cls: 'contain' })}<div class="xmedia-body center"><h3 class="xstatement">${P(1)}</h3><p class="xbody">${P(2)}</p></div></div></div>`,

  'chapter6-17': ({ P, IMG }) => `<div class="xpair-slide">${header(S6.kicker, P(0))}<div class="xpair figs"><div>${figure(IMG('image10.jpg'), { cls: 'contain' })}${card(P(1), P(2))}</div><div>${figure(IMG('image11.jpg'), { cls: 'contain' })}${card(P(3), P(4))}</div></div></div>`,

  /* —— 8-р бүлэг: Ухамсар —— */
  'consciousness-01': ({ P, R }) => {
    const [q1, q2] = [R(1), R(2)];
    return opener({ num: S8.num, label: `<div class="kicker" data-chrome>${S8.kicker}</div>`, title: P(0), art: 'mind', extra: `<div class="epigraph">${q1.join('')}${q2.slice(0, 2).join('')}<small>${q2[2].trim()}<span class="gap">${q2[3]}</span></small></div><div class="op-question">${P(3)} ${P(4)}</div>` });
  },

  'consciousness-02': ({ P }) => `<div class="xsense">${header(S8.kicker, P(0))}<div class="xequation">${P(1)}</div><div class="xcols three">${[[2, 3, 'eye'], [4, 5, 'music'], [6, 7, 'pulse']].map(([a, b, ic]) => `<div class="xcol icon">${ICON[ic]}<h3>${P(a)}</h3><p>${P(b)}</p></div>`).join('')}</div></div>`,

  'consciousness-03': ({ P, IMG }) => `<div class="xmedia">${header(S8.kicker, P(0))}<div class="xmedia-grid left wide">${figure(IMG('image2.jpeg'), { cls: 'contain', cap: P(1) })}<div class="xmedia-body"><div class="xq"><i aria-hidden="true"></i><p>${P(2)}</p></div><div class="xq"><i aria-hidden="true"></i><p>${P(4)} ${P(5)}</p></div></div></div><div class="xnote">${P(3)}</div></div>`,

  'consciousness-04': ({ P, IMG }) => `<div class="xmedia">${header(S8.kicker, P(0))}<div class="xmedia-grid left wide">${figure(IMG('image3.jpeg'))}<div class="xmedia-body center"><blockquote class="xpull">${P(1)}</blockquote></div></div></div>`,

  'consciousness-05': ({ P, IMG }) => `<div class="xmedia">${header(S8.kicker, P(0))}<div class="xmedia-grid left">${figure(IMG('image4.jpeg'), { cls: 'contain' })}<div class="xmedia-body"><div class="xeyebrow">${P(1)}</div><div class="xcard accent"><h3>${P(2)}</h3><p>${P(3)}</p></div><div class="xbadge">${P(4)}</div></div></div></div>`,

  'consciousness-06': ({ P, IMG }) => `<div class="xmedia">${header(S8.kicker, P(0))}<div class="xmedia-grid left">${figure(IMG('image5.jpeg'), { cls: 'contain' })}<div class="xmedia-body center"><p class="xstatement">${P(1)}</p><p class="xbody">${P(2)}</p></div></div></div>`,

  'consciousness-07': ({ P, R }) => {
    const q = R(1);
    return `<div class="xpair-slide">${header(S8.kicker, P(0))}<div class="xpair q">${`<blockquote class="xpull">${q[0]}<em>${q[1]}</em>${q.slice(2).join('')}</blockquote>`}<div class="xgrid4">${[[2, 3], [4, 5], [6, 7], [8, 9]].map(([a, b]) => card(P(a), P(b))).join('')}</div></div>${conclusion(P(10))}</div>`;
  },

  'consciousness-08': ({ P }) => `<div class="xcompare-slide">${header(S8.kicker, P(0))}<div class="xcompare">${`<div class="xscale"><span>${P(1)}</span><b>${P(2)}</b><small>${P(3)}</small></div><div class="xvs" aria-hidden="true"></div><div class="xscale"><span>${P(4)}</span><b>${P(5)}</b><small>${P(6)}</small></div>`}</div><div class="xasks">${[7, 8, 9].map(i => `<div>${P(i)}</div>`).join('')}</div><div class="xnote">${P(10)}</div></div>`,

  'consciousness-09': ({ P, R }) => {
    const h = R(1);
    return `<div class="closing">${kicker(S8.kicker)}<div class="cl-species"><i>${h[0]}</i><span>${h[1]}</span><i class="hot">${h[2]}</i></div><h2 class="cl-title">${P(0)}</h2><p class="cl-q">${P(2)}</p></div>`;
  },
};

function agenda6({ P }, current) {
  const rows = [[1, 2], [3, 4], [5, 6]].map(([n, t], k) => `<li class="ag-row${k === current ? ' is-current' : ''}"><span class="ag-n">${P(n)}</span><span class="ag-t">${P(t)}</span></li>`).join('');
  return `<div class="agenda"><div class="ag-head"><div class="kicker">${P(0)}</div></div><ol class="ag-list">${rows}</ol></div>`;
}

const QUASAR = `<svg viewBox="0 0 760 640"><g fill="none" stroke="currentColor"><ellipse cx="380" cy="330" rx="330" ry="78" stroke-width="1.2"/><ellipse cx="380" cy="330" rx="250" ry="58" stroke-width="1.2" stroke-dasharray="3 7"/><ellipse cx="380" cy="330" rx="170" ry="40" stroke-width="1.2"/><ellipse cx="380" cy="330" rx="100" ry="24" stroke-width="1.2" stroke-dasharray="2 6"/><path d="M380 300 L350 20 M380 300 L410 20 M380 360 L350 630 M380 360 L410 630" stroke-width="1"/><path d="M380 300 V20 M380 360 V630" stroke-width="2.5" class="jet"/></g><ellipse cx="380" cy="330" rx="44" ry="44" fill="currentColor"/></svg>`;
const CUBE = `<svg viewBox="0 0 300 300"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M150 30 L260 90 L260 210 L150 270 L40 210 L40 90 Z"/><path d="M40 90 L150 150 L260 90 M150 150 V270"/></g><g fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 6"><path d="M150 30 V150 M40 210 L150 150 L260 210"/></g></svg>`;
const ICON = {
  eye: `<svg viewBox="0 0 48 48" class="xicon" aria-hidden="true"><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24Z"/><circle cx="24" cy="24" r="6"/></svg>`,
  music: `<svg viewBox="0 0 48 48" class="xicon" aria-hidden="true"><path d="M18 36V10l22-4v26"/><circle cx="13" cy="36" r="5"/><circle cx="35" cy="32" r="5"/></svg>`,
  pulse: `<svg viewBox="0 0 48 48" class="xicon" aria-hidden="true"><path d="M4 26h9l4-10 6 20 5-14 3 4h13"/></svg>`,
};

/* ───────────── Build + verify ───────────── */

const decks = [['chapter3', 'chapter3'], ['chapter4', 'chapter4'], ['chapter6', 'chapter6'], ['consciousness', 'consciousness']];
const out = {};
const norm = s => s.replace(/\s+/g, ' ').trim();
const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
function visibleText(html) {
  // Remove data-chrome subtrees (balanced div), aria-hidden SVG art, then tags.
  let h = html;
  for (;;) {
    const m = h.match(/<(div|span)[^>]*\sdata-chrome[^>]*>/);
    if (!m) break;
    const tag = m[1];
    let depth = 0, i = m.index;
    const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'g');
    re.lastIndex = i;
    let end = -1, t;
    while ((t = re.exec(h))) { depth += t[0][1] === '/' ? -1 : 1; if (depth === 0) { end = re.lastIndex; break; } }
    h = h.slice(0, i) + ' ' + h.slice(end);
  }
  h = h.replace(/<svg[^]*?<\/svg>/g, ' ');
  return decode(h.replace(/<[^>]+>/g, ' '));
}
const chars = s => s.replace(/\s+/g, '').split('').sort().join('');
let total = 0;
for (const [key, prefix] of decks) {
  pptx[key].forEach((slide, n) => {
    const id = `${prefix}-${String(n + 1).padStart(2, '0')}`;
    const layout = layouts[id];
    if (!layout) throw new Error(`No layout for ${id}`);
    const c = context(slide, id);
    const html = layout(c);
    const paras = c.done();
    // Independent check: same characters, every paragraph present verbatim.
    const text = norm(visibleText(html));
    const mine = chars(text), src = chars(paras.map(p => p.join('')).join(''));
    if (mine !== src) throw new Error(`${id}: character mismatch`);
    const flat = norm(text.replace(/\s+/g, ' '));
    for (const p of paras) {
      const want = norm(p.join(''));
      if (want && !flat.replace(/\s/g, '').includes(want.replace(/\s/g, ''))) throw new Error(`${id}: missing «${want}»`);
    }
    out[id] = html;
    total++;
  });
}
fs.writeFileSync(path.join(root, 'slides/design.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`slides/design.json: ${total} imported slides re-laid out; every source paragraph used once, characters identical.`);

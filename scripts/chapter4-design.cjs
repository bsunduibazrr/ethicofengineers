/* Chapter 4 art deck: retain every source paragraph and its diagram relationships. */
const copy = ({ R }) => index => `<span data-source-paragraph="${index}">${R(index).join('')}</span>`;
const header = (C, title = 1) => `<header class="ch4-header"><div class="ch4-kicker">${C(0)}</div><h2 class="ch4-title">${Array.isArray(title) ? title.map(C).join('') : C(title)}</h2></header>`;
const frame = (C, body, variant = '', title = 1) => `<div class="ch4-slide ${variant}">${header(C, title)}<div class="ch4-body">${body}</div></div>`;
const art = (ctx, file, cls = '', caption = '') => `<figure class="ch4-art ${cls}">${ctx.IMG(file)}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
const feature = (C, title, body) => `<article class="ch4-feature"><h3>${C(title)}</h3><p>${C(body)}</p></article>`;
const takeaway = (C, index) => `<p class="ch4-takeaway">${C(index)}</p>`;

const chapter4Layouts = {
  'chapter4-01': ctx => {
    const C = copy(ctx);
    return `<div class="divider opener ch4-shared-opener"><div class="div-body"><div class="div-num" data-num="04" aria-hidden="true"></div><div class="kicker">${C(0)}</div><h2 class="div-title">${C(1)}</h2><p class="ch4-cover-author">${C(2)}</p><p class="ch4-cover-topics">${C(3)}</p></div><div class="op-panel">${ctx.IMG('image1.png')}</div></div>`;
  },
  'chapter4-02': ctx => {
    const C = copy(ctx);
    const step = (n, h, p) => `<article class="ch4-step"><span class="ch4-number">${C(n)}</span><h3>${C(h)}</h3><p>${C(p)}</p></article>`;
    return frame(C, `<div class="ch4-steps">${step(2, 3, 4)}<span class="ch4-flow-arrow">${C(5)}</span>${step(6, 7, 8)}<span class="ch4-flow-arrow">${C(9)}</span>${step(10, 11, 12)}</div><p class="ch4-main-question">${C(13)}</p><div class="ch4-question-pair"><p>${C(14)}</p><p>${C(15)}</p></div>`, 'ch4-theme');
  },
  'chapter4-03': ctx => {
    const C = copy(ctx);
    return frame(C, `<p class="ch4-lead">${C(2)}</p><div class="ch4-split"><div class="ch4-features">${feature(C, 3, 4)}${feature(C, 5, 6)}${feature(C, 7, 8)}</div>${art(ctx, 'image3.png', 'ch4-eye')}</div>`, 'ch4-control');
  },
  'chapter4-04': ctx => {
    const C = copy(ctx);
    return frame(C, `<p class="ch4-lead">${C(2)}</p><div class="ch4-split ch4-art-first">${art(ctx, 'image4.png', 'ch4-cage', `<span>${C(3)}</span><strong>${C(4)}</strong>`)}<div class="ch4-analogy"><h3>${C(5)}</h3><p>${C(6)}</p>${takeaway(C, 7)}</div></div>`, 'ch4-prison');
  },
  'chapter4-05': ctx => {
    const C = copy(ctx);
    const flow = (title, description, firstArrow, middle, secondArrow, end) => `<div class="ch4-escape-flow"><article class="ch4-flow-node ch4-flow-person"><h3>${C(title)}</h3><p>${C(description)}</p></article><span class="ch4-flow-arrow">${C(firstArrow)}</span><article class="ch4-flow-node"><p>${C(middle)}</p></article><span class="ch4-flow-arrow">${C(secondArrow)}</span><article class="ch4-flow-node ch4-flow-end">${ctx.IMG('image5.png')}<p>${C(end)}</p></article></div>`;
    return frame(C, `<p class="ch4-lead">${C(2)}</p><div class="ch4-escape-flows">${flow(3, 4, 5, 6, 7, 8)}${flow(9, 10, 11, 12, 13, 14)}</div>`, 'ch4-escape');
  },
  'chapter4-06': ctx => {
    const C = copy(ctx);
    const stat = (value, label) => `<div class="ch4-stat"><strong>${C(value)}</strong><p>${C(label)}</p></div>`;
    return frame(C, `<div class="ch4-stats">${stat(7, 8)}${stat(9, 10)}${stat(11, 12)}${stat(13, 14)}</div><div class="ch4-split ch4-world-grid"><div class="ch4-world-points">${[2, 3, 4].map(i => `<p>${C(i)}</p>`).join('')}</div>${art(ctx, 'image6.png', 'ch4-world', C(6))}</div>${takeaway(C, 5)}`, 'ch4-expansion');
  },
  'chapter4-07': ctx => {
    const C = copy(ctx);
    return frame(C, `<p class="ch4-lead">${C(2)}</p><div class="ch4-split ch4-growth-grid"><div class="ch4-growth-chart">${art(ctx, 'image7.png')}<div class="ch4-chart-labels"><span>${C(3)}</span><span>${C(4)}</span><span>${C(5)}</span></div></div><div class="ch4-outcomes">${feature(C, 6, 7)}${feature(C, 8, 9)}</div></div>${takeaway(C, 10)}`, 'ch4-growth');
  },
  'chapter4-08': ctx => {
    const C = copy(ctx);
    const path = (n, h, a, b, definition) => `<article class="ch4-path"><div class="ch4-path-heading"><span class="ch4-number">${C(n)}</span><h3>${C(h)}</h3></div><div class="ch4-path-points"><p>${C(a)}</p><p>${C(b)}</p></div><p class="ch4-definition">${C(definition)}</p></article>`;
    return frame(C, `<p class="ch4-lead">${C(3)}</p><div class="ch4-paths">${path(4, 5, 6, 7, 12)}${path(8, 9, 10, 11, 13)}</div>`, 'ch4-cyborg', [1, 2]);
  },
  'chapter4-09': ctx => {
    const C = copy(ctx);
    const conclusion = (n, h, paragraphs) => `<article class="ch4-conclusion"><span class="ch4-number">${C(n)}</span><h3>${C(h)}</h3>${paragraphs.map(i => `<p>${C(i)}</p>`).join('')}</article>`;
    return frame(C, `<div class="ch4-conclusions">${conclusion(2, 3, [4])}${conclusion(5, 6, [7])}${conclusion(8, 9, [10, 11])}</div>`, 'ch4-final');
  },
};

module.exports = { chapter4Layouts };

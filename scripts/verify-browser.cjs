#!/usr/bin/env node
/** Independent browser audit of the immutable slide source and visible presentation. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'slides/content.source.json'), 'utf8'));
// Imported chapters render the shared-template layout; their copy is proven identical by scripts/build-design.cjs.
const design = JSON.parse(fs.readFileSync(path.join(root, 'slides/design.json'), 'utf8'));
const playwrightPath = process.env.LIFE3_PLAYWRIGHT || '/Users/macbookairm4/.npm/_npx/e41f203b7505f1fb/node_modules/playwright';
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(playwrightPath)); }
const executablePath = process.env.LIFE3_CHROMIUM || '/Users/macbookairm4/.cache/puppeteer/chrome-headless-shell/mac_arm-146.0.7680.66/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const target = process.env.LIFE3_URL || 'http://localhost:3000';
const screenshots = '/private/tmp/life3-qa';
const reportPath = path.join(root, 'reports/browser-verification.json');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const active = '.slide:not(.is-exiting)';
fs.mkdirSync(screenshots, { recursive: true });
fs.mkdirSync(path.dirname(reportPath), { recursive: true });

function auditDocument() {
  const slide = document.querySelector('.slide:not(.is-exiting)');
  const surface = slide.querySelector('.slide-surface');
  const stage = document.querySelector('.stage');
  const stageRect = stage.getBoundingClientRect();
  const scale = stageRect.width / 1920;
  const normalize = r => ({ left: (r.left - stageRect.left) / scale, top: (r.top - stageRect.top) / scale, right: (r.right - stageRect.left) / scale, bottom: (r.bottom - stageRect.top) / scale });
  const tokens = [], ranges = [], issues = [], contrast = [], hidden = [];
  const walker = document.createTreeWalker(surface, NodeFilter.SHOW_TEXT);
  const rgba = s => { const m = s.match(/[\d.]+/g); return m ? [Number(m[0]), Number(m[1]), Number(m[2]), m[3] === undefined ? 1 : Number(m[3])] : [0, 0, 0, 0]; };
  const composite = (a, b) => [0, 1, 2].map(i => a[i] * a[3] + b[i] * (1 - a[3])).concat(1);
  const lum = c => c.slice(0, 3).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
  const colorRatio = (fg, bg) => { const a = lum(fg), b = lum(bg); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); };
  const selector = el => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${[...el.classList].map(c => '.' + c).join('')}`;
  const ownerOf = el => el.closest('.chapter3-text,.chapter3-table-cell,h1,h2,h3,p,li,.big-question,.toc-row,.dl-row,.qa-hint,.kicker-label,.cover-sub,.cover-en,.cover-meta b,.cover-meta small') || el;
  const contrastSeen = new Set();
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue; tokens.push(text);
    if (!text.trim()) continue;
    const el = node.parentElement;
    const style = getComputedStyle(el);
    const range = document.createRange(); range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter(r => r.width > .1 && r.height > .1);
    if (!rects.length || style.display === 'none' || style.visibility === 'hidden') hidden.push({ text: text.slice(0, 100), element: selector(el) });
    for (const actual of rects) {
      const r = normalize(actual), description = { text: text.slice(0, 100), element: selector(el), bounds: r };
      ranges.push({ ...description, elementRef: el, owner: ownerOf(el), svg: el.closest('svg') });
      if (r.left < -2 || r.right > 1922 || r.top < -2 || r.bottom > 1082) issues.push({ kind: 'stage-clipping', ...description });
      if (r.bottom > 952) issues.push({ kind: 'content-safe-bottom', ...description });
      let ancestor = el;
      while (ancestor && ancestor !== stage) {
        const css = getComputedStyle(ancestor);
        const clippedX = /^(hidden|clip|auto|scroll)$/.test(css.overflowX);
        const clippedY = /^(hidden|clip|auto|scroll)$/.test(css.overflowY);
        if (clippedX || clippedY) {
          const ar = normalize(ancestor.getBoundingClientRect());
          if ((clippedX && (r.left < ar.left - 2 || r.right > ar.right + 2)) || (clippedY && (r.top < ar.top - 2 || r.bottom > ar.bottom + 2))) {
            issues.push({ kind: 'ancestor-clipping', ancestor: selector(ancestor), ancestorBounds: ar, ...description });
          }
        }
        ancestor = ancestor.parentElement;
      }
    }
    {
      const chain = []; let e = el;
      while (e) { chain.push(e); e = e.parentElement; }
      let bg = [255, 255, 255, 1], opacity = 1;
      for (const a of chain.reverse()) { const css = getComputedStyle(a); bg = composite(rgba(css.backgroundColor), bg); opacity *= Number(css.opacity); }
      const foreground = el.closest('svg') && /^rgba?\(/.test(style.fill) ? style.fill : style.color;
      let fg = rgba(foreground); fg[3] *= opacity; fg = composite(fg, bg);
      const ratio = colorRatio(fg, bg), key = `${foreground}:${bg.join(',')}:${opacity}`;
      if (!contrastSeen.has(key)) { contrastSeen.add(key); contrast.push({ ratio: Number(ratio.toFixed(3)), foreground, background: bg.slice(0, 3), opacity, example: text.slice(0, 80), element: selector(el) }); }
    }
  }
  const overlap = [];
  for (let i = 0; i < ranges.length; i++) for (let j = i + 1; j < ranges.length; j++) {
    const a = ranges[i], b = ranges[j];
    if (a.owner === b.owner || a.owner.contains(b.owner) || b.owner.contains(a.owner) || (a.svg && a.svg === b.svg)) continue;
    const width = Math.min(a.bounds.right, b.bounds.right) - Math.max(a.bounds.left, b.bounds.left);
    const height = Math.min(a.bounds.bottom, b.bounds.bottom) - Math.max(a.bounds.top, b.bounds.top);
    if (width > 2 && height > 2) overlap.push({ width, height, first: { text: a.text, element: a.element, bounds: a.bounds }, second: { text: b.text, element: b.element, bounds: b.bounds } });
  }
  return {
    id: slide.dataset.id, index: Number(slide.dataset.index), text: surface.textContent, textNodes: tokens,
    notes: document.querySelector('.speaker-notes').textContent,
    textRangeCount: ranges.length, hidden, clipping: issues, overlaps: overlap,
    contrast, activeAnimations: document.getAnimations().filter(a => a.playState === 'running').length,
    stageScale: scale, fit: surface.dataset.fit || 'imported',
    lowestText: Math.max(...ranges.map(r => r.bounds.bottom)),
  };
}

async function settle(page, index) {
  await page.waitForFunction(n => document.querySelector('.slide:not(.is-exiting)')?.dataset.index === String(n), index);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.querySelectorAll('.slide:not(.is-exiting) img')].map(img => img.complete ? Promise.resolve() : new Promise(resolve => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); })));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function goto(page, n) {
  await page.evaluate(n => { location.hash = String(n + 1); }, n);
  await settle(page, n);
}

function auditNavigationAndStage() {
  const removedElements = [...document.querySelectorAll('.hud-nav,.hud-counter,.deck-hud button,[data-action="previous"],[data-action="next"],[data-action="overview"],[data-action="notes"],[data-action="fullscreen"]')]
    .map(el => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}${el.dataset.action ? `[data-action="${el.dataset.action}"]` : ''}`);
  const r = document.querySelector('.stage').getBoundingClientRect();
  const expectedWidth = Math.min(innerWidth, innerHeight * 16 / 9);
  const expectedHeight = expectedWidth * 9 / 16;
  return {
    navAbsent: removedElements.length === 0,
    removedElements,
    stageInsideViewport: r.left >= -.5 && r.top >= -.5 && r.right <= innerWidth + .5 && r.bottom <= innerHeight + .5,
    stageUsesAvailableSpace: Math.abs(r.width - expectedWidth) <= 1 && Math.abs(r.height - expectedHeight) <= 1,
    stageCentered: Math.abs((r.left + r.right) / 2 - innerWidth / 2) <= 1 && Math.abs((r.top + r.bottom) / 2 - innerHeight / 2) <= 1,
  };
}

async function auditViewport(browser, viewport, capture = false) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce', hasTouch: viewport.width < 1000 });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(target, { waitUntil: 'domcontentloaded' }); await settle(page, 0);
  const slides = [], representative = new Set([1, 2, 4, 7, 10, 16, 17, 18, 21, 24, 27, 33, 34, 35, ...Array.from({ length: 13 }, (_, index) => 36 + index), 50, 55, 71, source.length]);
  for (let i = 0; i < source.length; i++) {
    if (i) await goto(page, i);
    const result = await page.evaluate(auditDocument);
    const original = design[source[i].id] ? { ...source[i], ...(await page.evaluate(html => {
      const t = document.createElement('template'); t.innerHTML = html;
      const w = document.createTreeWalker(t.content, NodeFilter.SHOW_TEXT), nodes = []; let n;
      while ((n = w.nextNode())) nodes.push(n.nodeValue);
      return { text: t.content.textContent, textNodes: nodes };
    }, design[source[i].id])) } : source[i];
    const differences = [];
    if (result.id !== original.id) differences.push('id');
    if (result.text !== original.text) differences.push('text');
    if (JSON.stringify(result.textNodes) !== JSON.stringify(original.textNodes)) differences.push('textNodes');
    if (result.notes !== original.notes) differences.push('notes');
    delete result.text; delete result.textNodes; delete result.notes;
    result.differences = differences;
    slides.push(result);
    if (capture && representative.has(i + 1)) await page.screenshot({ path: path.join(screenshots, `${viewport.width}x${viewport.height}-${String(i + 1).padStart(2, '0')}.png`) });
    if (differences.length || result.clipping.length || result.hidden.length || result.overlaps.length) console.log(JSON.stringify({ viewport, slide: i + 1, id: result.id, differences, clipping: result.clipping.length, hidden: result.hidden.length, overlaps: result.overlaps.length, first: result.clipping[0] || result.overlaps[0] }));
  }
  await goto(page, 20);
  const qaTextField = source[20].expandedTextNodes ? 'expandedTextNodes' : 'textNodes';
  if (qaTextField === 'expandedTextNodes') {
    for (const card of await page.locator(`${active} .qa-card`).all()) await card.click();
  }
  await settle(page, 20);
  const qa = await page.evaluate(auditDocument);
  const qaExpanded = { differences: JSON.stringify(qa.textNodes) === JSON.stringify(source[20][qaTextField]) ? [] : [qaTextField], clipping: qa.clipping, overlaps: qa.overlaps, hidden: qa.hidden };
  if (capture) await page.screenshot({ path: path.join(screenshots, `${viewport.width}x${viewport.height}-21-${qaTextField === 'expandedTextNodes' ? 'expanded' : 'static'}.png`) });
  const interactions = [];
  const assert = async (name, fn) => { try { const detail = await fn(); interactions.push({ name, passed: true, detail }); } catch (error) { interactions.push({ name, passed: false, error: error.message }); } };
  const index = () => page.locator(active).getAttribute('data-index');
  const expectIndex = async n => { await settle(page, n); const actual = await index(); if (actual !== String(n)) throw new Error(`Expected ${n}, got ${actual}`); };
  await page.evaluate(() => document.activeElement?.blur());
  await assert('Home and first-slide boundary', async () => { await page.keyboard.press('Home'); await expectIndex(0); await page.keyboard.press('ArrowLeft'); await expectIndex(0); });
  await assert('ArrowRight, Space, Shift+Space, ArrowLeft', async () => { await page.keyboard.press('ArrowRight'); await expectIndex(1); await page.keyboard.press('Space'); await expectIndex(2); await page.keyboard.press('Shift+Space'); await expectIndex(1); await page.keyboard.press('ArrowLeft'); await expectIndex(0); });
  await assert('End and final-slide boundary', async () => { await page.keyboard.press('End'); await expectIndex(source.length - 1); await page.keyboard.press('ArrowRight'); await expectIndex(source.length - 1); });
  await assert(`Escape overview, all ${source.length} entries, direct jump`, async () => { await page.keyboard.press('Escape'); if (!(await page.locator('.overview').evaluate(el => el.open))) throw new Error('Overview not open'); if (await page.locator('.overview-card').count() !== source.length) throw new Error('Overview count'); await page.locator('[data-slide="34"]').click(); await expectIndex(34); if (await page.locator('.overview').evaluate(el => el.open)) throw new Error('Overview still open'); });
  await assert('Escape closes overview and restores focus', async () => { await page.locator('main.deck-root').focus(); await page.keyboard.press('Escape'); if (!(await page.locator('.overview').evaluate(el => el.open))) throw new Error('Overview not open'); await page.keyboard.press('Escape'); if (await page.locator('.overview').evaluate(el => el.open)) throw new Error('Overview not closed'); if (!(await page.locator('main.deck-root').evaluate(el => el === document.activeElement))) throw new Error('Focus not restored to the deck'); });
  await assert('Overview close button restores deck focus', async () => { await page.locator('main.deck-root').focus(); await page.keyboard.press('Escape'); await page.locator('[data-action="close-overview"]').click(); if (await page.locator('.overview').evaluate(el => el.open)) throw new Error('Overview not closed'); if (!(await page.locator('main.deck-root').evaluate(el => el === document.activeElement))) throw new Error('Focus not restored after closing overview'); });
  await assert('Hash direct jump', async () => { await goto(page, 16); if (!(await page.evaluate(() => location.hash === '#17'))) throw new Error('Hash not synchronized'); });
  await assert('N notes exact and toggled', async () => { await page.keyboard.press('n'); if (await page.locator('.speaker-notes').evaluate(el => el.hidden)) throw new Error('Notes hidden'); if (await page.locator('.speaker-notes').textContent() !== source[16].notes) throw new Error('Notes changed'); await page.keyboard.press('n'); if (!(await page.locator('.speaker-notes').evaluate(el => el.hidden))) throw new Error('Notes not hidden'); });
  await assert('F fullscreen toggles', async () => { await page.keyboard.press('f'); await page.waitForFunction(() => Boolean(document.fullscreenElement), null, { timeout: 3000 }); await page.keyboard.press('f'); await page.waitForFunction(() => !document.fullscreenElement, null, { timeout: 3000 }); });
  if (viewport.width < 1000) await assert('Touch swipe left/right', async () => {
    await goto(page, 0); const rect = await page.locator('.stage').boundingBox(); const y = rect.y + rect.height * .5; const x1 = rect.x + rect.width * .75, x2 = rect.x + rect.width * .25;
    const client = await page.context().newCDPSession(page);
    const swipe = async (start, end) => { await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start, y }] }); await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: end, y }] }); await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); };
    await swipe(x1, x2); await expectIndex(1); await swipe(x2, x1); await expectIndex(0); await client.detach();
  });
  if (viewport.width < 1000) await assert('Cancelled touch and subsequent interactive touch do not navigate', async () => {
    await goto(page, 20);
    await page.keyboard.press('n');
    if (await page.locator('.speaker-notes').evaluate(el => el.hidden)) throw new Error('Notes hidden during interactive touch check');
    await page.evaluate(() => {
      const viewport = document.querySelector('.viewport'), notes = document.querySelector('.speaker-notes');
      const send = (target, type, x) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType: 'touch', pointerId: 4, clientX: x, clientY: innerHeight / 2 }));
      send(viewport, 'pointerdown', 300); send(viewport, 'pointercancel', 300); send(notes, 'pointerup', 100);
    });
    await expectIndex(20);
    await page.evaluate(() => {
      const viewport = document.querySelector('.viewport'), notes = document.querySelector('.speaker-notes');
      const send = (target, type, x) => target.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerType: 'touch', pointerId: 5, clientX: x, clientY: innerHeight / 2 }));
      send(viewport, 'pointerdown', 300); send(notes, 'pointerdown', 300); send(notes, 'pointerup', 100);
    });
    await expectIndex(20);
    await page.keyboard.press('n');
    if (!(await page.locator('.speaker-notes').evaluate(el => el.hidden))) throw new Error('Notes not hidden before stage swipe');
    const rect = await page.locator('.stage').boundingBox(), y = rect.y + rect.height * .07;
    const client = await page.context().newCDPSession(page);
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: rect.x + rect.width * .75, y }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: rect.x + rect.width * .25, y }] });
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expectIndex(21); await client.detach();
  });
  const controls = await page.evaluate(auditNavigationAndStage);
  const summary = {
    slideCount: slides.length, textOrNotesDifferences: slides.filter(x => x.differences.length).length,
    clippingIssues: slides.reduce((s, x) => s + x.clipping.length, 0), hiddenTextIssues: slides.reduce((s, x) => s + x.hidden.length, 0),
    overlapIssues: slides.reduce((s, x) => s + x.overlaps.length, 0),
    lowContrastColors: slides.flatMap(x => x.contrast.filter(c => c.ratio < 4.5).map(c => ({ slide: x.index + 1, ...c }))),
    activeReducedMotionAnimations: slides.reduce((s, x) => s + x.activeAnimations, 0),
    interactionFailures: interactions.filter(x => !x.passed), pageErrors, controls,
  };
  console.log(JSON.stringify({ viewport, summary })); await page.close();
  return { viewport, summary, interactions, qaExpanded, slides };
}

async function verifyCompactControls(browser) {
  const page = await browser.newPage({ viewport: { width: 320, height: 568 }, reducedMotion: 'reduce', hasTouch: true });
  await page.goto(target, { waitUntil: 'domcontentloaded' }); await settle(page, 0);
  const controls = await page.evaluate(auditNavigationAndStage);
  await page.screenshot({ path: path.join(screenshots, '320x568-01.png') });
  await page.close(); return { viewport: { width: 320, height: 568 }, controls, passed: controls.navAbsent && controls.stageInsideViewport && controls.stageUsesAvailableSpace && controls.stageCentered };
}

async function verifyOffline(browser) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  const network = [];
  page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
  await page.goto(pathToFileURL(path.join(root, 'dist/life3.html')).href, { waitUntil: 'load' });
  const diffs = [];
  for (let i = 0; i < source.length; i++) { if (i) await goto(page, i); else await settle(page, 0); const result = await page.evaluate(() => { const el = document.querySelector('.slide:not(.is-exiting) .slide-surface'); return { text: el.textContent, notes: document.querySelector('.speaker-notes').textContent }; }); const want = design[source[i].id] ? await page.evaluate(html => { const t = document.createElement('template'); t.innerHTML = html; return t.content.textContent; }, design[source[i].id]) : source[i].text; if (result.text !== want || result.notes !== source[i].notes) diffs.push(i + 1); }
  const imageFailures = await page.locator('img').evaluateAll(els => els.filter(el => !el.complete || !el.naturalWidth).map(el => el.alt));
  const controls = await page.evaluate(auditNavigationAndStage);
  await page.close(); return { slideCount: source.length, differences: diffs, externalRequests: network, imageFailures, controls };
}

(async () => {
  const deployedFile = '/private/tmp/life3-deployed-slides.json';
  if (fs.existsSync(deployedFile)) {
    const live = JSON.parse(fs.readFileSync(deployedFile, 'utf8'));
    const rows = source.map((slide, i) => ({ order: i + 1, id: slide.id, sourceTextSha256: sha(slide.text), liveTextSha256: sha(live[i]?.textContent || ''), matches: slide.text === live[i]?.textContent }));
    fs.writeFileSync(path.join(root, 'reports/live-source-verification.json'), JSON.stringify({ sourceUrl: 'https://ethicofengineers-1.vercel.app/', capturedDate: '2026-11-11', compared: 'Per-slide DOM textContent, character-for-character; no whitespace normalization', sourceCount: source.length, liveCount: live.length, differences: rows.filter(x => !x.matches).length, slides: rows }, null, 2) + '\n');
  }
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    const report = { date: '2026-11-12', target, sourceCount: source.length, contrastMethod: 'Computed CSS text color or SVG text fill, alpha-composited ancestor backgrounds. Existing image pixels and decorative SVG backgrounds are not treated as DOM text.', inputSha256: Object.fromEntries(['slides/content.source.json', 'app/globals.css', 'slides/design.json', 'components/deck-runtime.ts', 'dist/life3.html'].map(file => [file, sha(fs.readFileSync(path.join(root, file)))])), checks: [], screenshotDirectory: screenshots };
    for (const viewport of [{ width: 1920, height: 1080 }, { width: 1366, height: 768 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
      report.checks.push(await auditViewport(browser, viewport, true));
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
    }
    report.compactControls = await verifyCompactControls(browser);
    report.offline = await verifyOffline(browser);
    report.passed = report.checks.every(({ summary: s, qaExpanded: q }) => !s.textOrNotesDifferences && !s.clippingIssues && !s.hiddenTextIssues && !s.overlapIssues && !s.lowContrastColors.length && !s.activeReducedMotionAnimations && !s.interactionFailures.length && !s.pageErrors.length && s.controls.navAbsent && s.controls.stageInsideViewport && s.controls.stageUsesAvailableSpace && s.controls.stageCentered && !q.differences.length && !q.clipping.length && !q.overlaps.length && !q.hidden.length) && report.compactControls.passed && !report.offline.differences.length && !report.offline.externalRequests.length && !report.offline.imageFailures.length && report.offline.controls.navAbsent;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ report: reportPath, passed: report.passed, offline: report.offline, compactControls: report.compactControls }));
    if (!report.passed) process.exitCode = 1;
  } finally { await browser.close(); }
})().catch(error => { console.error(error.stack); process.exitCode = 1; });

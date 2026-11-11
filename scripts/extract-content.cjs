#!/usr/bin/env node
/*
 * Frozen source extraction. Never edits or normalizes slide copy.
 * node scripts/extract-content.cjs          Creates a snapshot once.
 * node scripts/extract-content.cjs --check  Compares all content and order.
 * Existing snapshots are never silently overwritten.
 */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const crypto = require('node:crypto');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const outputPath = path.join(root, 'slides/content.source.json');
const auditPath = path.join(root, 'slides/slide-audit.json');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');

// Neutralize animation only; ordinary element attributes/styles remain intact.
const motionProps = new Set(['initial', 'animate', 'exit', 'variants', 'transition', 'whileHover', 'whileTap', 'whileInView', 'viewport', 'layout', 'layoutId', 'custom', 'onAnimationComplete']);
const motionCache = new Map();
const motion = new Proxy({}, { get(_target, tag) {
  if (!motionCache.has(tag)) motionCache.set(tag, React.forwardRef((props, ref) => {
    const clean = Object.fromEntries(Object.entries(props).filter(([key]) => !motionProps.has(key)));
    return React.createElement(tag, { ...clean, ref });
  }));
  return motionCache.get(tag);
} });
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) {
  return originalResolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, ...args);
};
const originalLoad = Module._load;
Module._load = function(request, ...args) {
  if (request === 'framer-motion') return { motion, AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children) };
  return originalLoad.call(this, request, ...args);
};
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, resolveJsonModule: true,
  }, fileName: filename });
  module._compile(result.outputText, filename);
};

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
function decode(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (entity[0] === '#') return String.fromCodePoint(parseInt(entity.slice(entity[1].toLowerCase() === 'x' ? 2 : 1), entity[1].toLowerCase() === 'x' ? 16 : 10));
    return entities[entity.toLowerCase()] ?? match;
  });
}
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
function parseHtml(html) {
  const rootNode = { tag: 'root', attrs: {}, children: [] };
  const stack = [rootNode];
  const tokens = html.match(/<!--[^]*?-->|<(?:[^>"']|"[^"]*"|'[^']*')+>|[^<]+/g) ?? [];
  for (const token of tokens) {
    if (token.startsWith('<!--')) continue;
    if (!token.startsWith('<')) { stack.at(-1).children.push(decode(token)); continue; }
    if (token.startsWith('</')) { stack.pop(); continue; }
    const tag = token.match(/^<([^\s/>]+)/)?.[1];
    if (!tag) continue;
    const attrs = {};
    const attributes = token.slice(tag.length + 1).replace(/\/?\s*>$/, '');
    const matcher = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    let match;
    while ((match = matcher.exec(attributes))) attrs[match[1]] = decode(match[2] ?? match[3] ?? match[4] ?? '');
    const node = { tag, attrs, children: [] };
    stack.at(-1).children.push(node);
    if (!voidTags.has(tag) && !/\/\s*>$/.test(token)) stack.push(node);
  }
  return rootNode;
}
function walk(node, predicate, out = []) {
  if (typeof node === 'string') return out;
  if (predicate(node)) out.push(node);
  for (const child of node.children) walk(child, predicate, out);
  return out;
}
function textNodes(node, out = []) {
  if (typeof node === 'string') out.push(node);
  else for (const child of node.children) textNodes(child, out);
  return out;
}
const textOf = (node) => textNodes(node).join('');
const hasClass = (node, name) => (node.attrs.class ?? '').split(/\s+/).includes(name);
function staticHtml(Component, expanded = false) {
  const originalState = React.useState;
  if (expanded) React.useState = () => [[0, 1, 2, 3], () => {}];
  try {
    // React's resource hints contain no copy and do not belong to the slide.
    return renderToStaticMarkup(React.createElement(Component)).replace(/<link\b[^>]*rel="preload"[^>]*\/>/g, '');
  } finally { React.useState = originalState; }
}

const { slides } = require(path.join(root, 'slides/index.ts'));
const imported = require(path.join(root, 'slides/imported-pptx.json'));
if (slides.length !== 71) throw new Error(`Expected exactly 71 slides; found ${slides.length}.`);
const explicitTypes = {
  cover: 'Cover', author: 'Two columns', book: 'Timeline', structure: 'Section divider',
  ch1: 'Section divider', history: 'Timeline', stages: 'Comparison', why2: 'Statistics',
  camps: 'Comparison', napa: 'Quote', myths1: 'Comparison', myths2: 'Comparison',
  'structure-ch2': 'Section divider', ch2: 'Section divider', intel: 'Title + list',
  landscape: 'Two columns', memory: 'Comparison', compute: 'Two columns', learning: 'Conclusion',
  case: 'Comparison', qa: 'Conclusion',
};
function classify(slide, title, nodes) {
  if (explicitTypes[slide.id]) return explicitTypes[slide.id];
  if (slide.id.startsWith('structure-') || /-01$/.test(slide.id)) return 'Section divider';
  if (/Дүгнэлт|БАЯРЛАЛАА|Баярлалаа/.test(title)) return 'Conclusion';
  if (nodes?.some((node) => node.kind === 'table')) return 'Comparison';
  if (/он|жил|түүх|ИРЭЭДҮЙ/i.test(title)) return 'Timeline';
  if (/ухамсар|зорилго|асуулт/i.test(title) && nodes?.filter((node) => node.kind === 'text').length <= 3) return 'Quote';
  if (/хувь|тэрбум|их наяд|тоо|хязгаар|эргэх/i.test(title)) return 'Statistics';
  if (nodes?.some((node) => node.kind === 'image')) return 'Two columns';
  return 'Title + list';
}

const extracted = slides.map((slide, index) => {
  const html = staticHtml(slide.Component);
  const tree = parseHtml(html);
  const all = walk(tree, () => true);
  const headings = all.filter((node) => ['h1', 'h2'].includes(node.tag) || hasClass(node, 'is-heading'));
  const firstImportedText = all.find((node) => hasClass(node, 'chapter3-text'));
  const headingNode = headings[0] ?? firstImportedText;
  const headingCopy = headingNode && hasClass(headingNode, 'chapter3-text')
    ? all.find((node) => hasClass(node, 'chapter3-text-content') && headingNode.children.includes(node)) ?? headingNode
    : headingNode;
  const title = headingCopy ? textOf(headingCopy) : slide.section;
  const subtitleNode = all.find((node) => hasClass(node, 'cover-sub') || hasClass(node, 'sub'));
  const body = all.filter((node) => ['p', 'figcaption', 'blockquote'].includes(node.tag) || ['chapter3-paragraph', 'case-p', 'big-question'].some((name) => hasClass(node, name))).map(textOf);
  const list = all.filter((node) => node.tag === 'li' || ['toc-row', 'dl-row', 'outcome', 'link-row'].some((name) => hasClass(node, name))).map(textOf);
  const quote = all.filter((node) => node.tag === 'blockquote' || hasClass(node, 'quote')).map(textOf).join('\n');
  const tokens = textNodes(tree);
  let sourceNodes;
  const deckKey = slide.id.startsWith('chapter3-') ? 'chapter3' : slide.id.startsWith('chapter4-') ? 'chapter4' : slide.id.startsWith('chapter6-') ? 'chapter6' : slide.id.startsWith('consciousness-') ? 'consciousness' : null;
  if (deckKey) sourceNodes = imported[deckKey][Number(slide.id.slice(-2)) - 1].nodes;
  const snapshot = {
    id: slide.id, order: index + 1, section: slide.section,
    type: classify(slide, title, sourceNodes),
    title, subtitle: subtitleNode ? textOf(subtitleNode) : '', body, list, quote,
    notes: slide.notes, html, textNodes: tokens, text: tokens.join(''),
    sha256: sha(JSON.stringify({ id: slide.id, textNodes: tokens, notes: slide.notes })),
    ...(sourceNodes ? { nodes: sourceNodes } : {}),
  };
  if (slide.id === 'qa') {
    snapshot.expandedHtml = staticHtml(slide.Component, true);
    const expandedTree = parseHtml(snapshot.expandedHtml);
    snapshot.expandedTextNodes = textNodes(expandedTree);
    const expandedCards = walk(expandedTree, (node) => hasClass(node, 'qa-card'));
    snapshot.interactions = expandedCards.map((card) => ({
      question: textOf(walk(card, (node) => node.tag === 'h3')[0]),
      hint: 'Хариулт харах',
      answer: textOf(walk(card, (node) => hasClass(node, 'qa-a'))[0]),
    }));
    snapshot.sha256 = sha(JSON.stringify({ id: slide.id, textNodes: tokens, expandedTextNodes: snapshot.expandedTextNodes, notes: slide.notes }));
  }
  return snapshot;
});
const templates = [
  { type: 'Cover', layout: '12-column grid; text spans 7 columns, sculptural inline-SVG orbit and retained book covers span 5.' },
  { type: 'Section divider', layout: 'Large title with editorial whitespace; retained chapter list or title hierarchy forms the secondary column.' },
  { type: 'Title + list', layout: 'Full-width title above a structured vertical list; content groups keep their existing sequence.' },
  { type: 'Two columns', layout: 'Title above two complementary columns; existing media and associated copy stay together.' },
  { type: 'Quote', layout: 'One dominant quotation or question, with original attribution and supporting content beneath.' },
  { type: 'Statistics', layout: 'Dominant existing numeric values, associated labels, and supporting explanation on the grid.' },
  { type: 'Comparison', layout: 'Parallel aligned content groups or table with shared baselines and semantic colors.' },
  { type: 'Timeline', layout: 'Chronological source order with aligned years, entries, and an ornamental connecting rule.' },
  { type: 'Conclusion', layout: 'Strong original closing statement followed by existing supporting content or discussion cards.' },
];
const audit = { count: extracted.length, source: 'slides/content.source.json', templates,
  counts: Object.fromEntries(templates.map(({ type }) => [type, extracted.filter((slide) => slide.type === type).length])),
  slides: extracted.map(({ id, order, section, title, type }) => ({ id, order, section, title, type })),
};

if (process.argv.includes('--check')) {
  const frozen = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const differences = [];
  if (frozen.length !== 71) differences.push(`Frozen count is ${frozen.length}`);
  for (let index = 0; index < Math.max(frozen.length, extracted.length); index++) {
    const expected = frozen[index]; const actual = extracted[index];
    if (!expected || !actual) { differences.push(`Missing slide ${index + 1}`); continue; }
    for (const field of ['id', 'html', 'textNodes', 'notes', 'expandedHtml', 'expandedTextNodes', 'interactions', 'nodes']) {
      if (JSON.stringify(expected[field]) !== JSON.stringify(actual[field])) differences.push(`${index + 1} (${actual.id}): ${field}`);
    }
  }
  console.log(JSON.stringify({ count: extracted.length, differences: differences.length, details: differences,
    contentSha256: sha(JSON.stringify(frozen.map(({ id, sha256 }) => ({ id, sha256 })))) }, null, 2));
  if (differences.length) process.exitCode = 1;
} else {
  if (fs.existsSync(outputPath)) throw new Error('Frozen snapshot already exists. Use --check; never silently replace the source.');
  fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2) + '\n');
  fs.writeFileSync(auditPath, JSON.stringify(audit, null, 2) + '\n');
  console.log(JSON.stringify({ count: extracted.length, textNodes: extracted.reduce((sum, slide) => sum + slide.textNodes.length, 0),
    snapshot: path.relative(root, outputPath), audit: path.relative(root, auditPath), types: audit.counts }, null, 2));
}

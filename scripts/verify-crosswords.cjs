#!/usr/bin/env node
/** Independently verify the crossword data against its grid and slide source. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const filename = path.join(root, 'lib/crosswords.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  fileName: filename,
});
const dataModule = new Module(filename, module);
dataModule.filename = filename;
dataModule.paths = Module._nodeModulePaths(path.dirname(filename));
dataModule._compile(compiled.outputText, filename);
const { crosswords } = dataModule.exports;

const normalize = value => value.normalize('NFC').toLocaleUpperCase('mn').replace(/\s+/gu, '');
const source = JSON.parse(fs.readFileSync(path.join(root, 'slides/content.source.json'), 'utf8'));
const slideTexts = source.map(slide => normalize(slide.text));
const directions = ['across', 'down'];
const steps = { across: [0, 1], down: [1, 0] };
const coordinate = (row, col) => `${row},${col}`;
const signature = (row, col, direction, length) => `${row}:${col}:${direction}:${length}`;
const puzzleIds = new Set();
const entryIds = new Set();
const answers = new Set();

assert.ok(Array.isArray(crosswords), 'crosswords must be an array');
assert.equal(crosswords.length, 2, 'Expected exactly two crossword puzzles');

const checks = crosswords.map(puzzle => {
  const label = puzzle.id || '(unnamed puzzle)';
  const check = (condition, message) => assert.ok(condition, `${label}: ${message}`);
  check(typeof puzzle.id === 'string' && puzzle.id.length > 0, 'missing puzzle id');
  check(!puzzleIds.has(puzzle.id), 'duplicate puzzle id');
  puzzleIds.add(puzzle.id);
  check(Number.isInteger(puzzle.rows) && puzzle.rows > 0, 'rows must be a positive integer');
  check(Number.isInteger(puzzle.cols) && puzzle.cols > 0, 'cols must be a positive integer');
  check(Array.isArray(puzzle.entries) && puzzle.entries.length === 6, 'expected six entries');
  for (const direction of directions) {
    check(puzzle.entries.filter(entry => entry.direction === direction).length === 3,
      `expected three ${direction} entries`);
  }

  const grid = new Map();
  for (const entry of puzzle.entries) {
    check(typeof entry.id === 'string' && entry.id.length > 0, 'missing entry id');
    check(!entryIds.has(entry.id), `duplicate entry id ${entry.id}`);
    entryIds.add(entry.id);
    check(directions.includes(entry.direction), `${entry.id}: invalid direction`);
    check(Number.isInteger(entry.row) && Number.isInteger(entry.col), `${entry.id}: invalid coordinates`);
    check(Number.isInteger(entry.number) && entry.number > 0, `${entry.id}: invalid number`);
    check(typeof entry.clue === 'string' && entry.clue.trim().length > 0, `${entry.id}: missing clue`);
    check(typeof entry.answer === 'string' && /^[А-ЯЁӨҮ]+$/u.test(entry.answer),
      `${entry.id}: answer must contain uppercase Mongolian Cyrillic letters only`);
    check(entry.answer.length >= 2, `${entry.id}: answer must contain at least two letters`);
    check(!answers.has(entry.answer), `${entry.id}: duplicate answer ${entry.answer}`);
    answers.add(entry.answer);
    check(slideTexts.some(text => text.includes(normalize(entry.answer))),
      `${entry.id}: answer ${entry.answer} is absent from the slides`);

    const [dr, dc] = steps[entry.direction];
    for (let offset = 0; offset < entry.answer.length; offset++) {
      const row = entry.row + dr * offset;
      const col = entry.col + dc * offset;
      check(row >= 0 && row < puzzle.rows && col >= 0 && col < puzzle.cols,
        `${entry.id}: cell ${coordinate(row, col)} falls outside the grid`);
      const key = coordinate(row, col);
      const cell = grid.get(key);
      if (cell) {
        check(cell.letter === entry.answer[offset], `${entry.id}: conflicting letters at ${key}`);
        check(!cell.entries.some(other => other.direction === entry.direction),
          `${entry.id}: same-direction overlap at ${key}`);
        cell.entries.push(entry);
      } else {
        grid.set(key, { row, col, letter: entry.answer[offset], entries: [entry] });
      }
    }
  }

  // Number starting cells in reading order; across/down starts may share a number.
  const starts = [...new Set(puzzle.entries.map(entry => coordinate(entry.row, entry.col)))];
  starts.sort((first, second) => {
    const [r1, c1] = first.split(',').map(Number);
    const [r2, c2] = second.split(',').map(Number);
    return r1 - r2 || c1 - c2;
  });
  for (const entry of puzzle.entries) {
    check(entry.number === starts.indexOf(coordinate(entry.row, entry.col)) + 1,
      `${entry.id}: number does not follow row-major starting-cell order`);
  }

  // Discover every visible multi-letter run rather than trusting entry metadata.
  const visibleRuns = [];
  for (const { row, col } of grid.values()) {
    for (const direction of directions) {
      const [dr, dc] = steps[direction];
      if (grid.has(coordinate(row - dr, col - dc))) continue;
      let length = 0;
      while (grid.has(coordinate(row + dr * length, col + dc * length))) length++;
      if (length >= 2) visibleRuns.push(signature(row, col, direction, length));
    }
  }
  const expectedRuns = puzzle.entries.map(entry =>
    signature(entry.row, entry.col, entry.direction, entry.answer.length));
  assert.deepEqual(visibleRuns.sort(), expectedRuns.sort(),
    `${label}: grid contains unintended or incorrectly bounded word runs`);

  // Traverse shared-letter intersections: all six words must form one component.
  const reached = new Set([puzzle.entries[0].id]);
  let previousSize = -1;
  while (previousSize !== reached.size) {
    previousSize = reached.size;
    for (const { entries } of grid.values()) {
      if (entries.some(entry => reached.has(entry.id))) {
        for (const entry of entries) reached.add(entry.id);
      }
    }
  }
  check(reached.size === puzzle.entries.length, 'all entries must connect through crossing letters');

  return {
    id: puzzle.id,
    rows: puzzle.rows,
    cols: puzzle.cols,
    across: 3,
    down: 3,
    crossings: [...grid.values()].filter(cell => cell.entries.length === 2).length,
    connected: true,
    allAnswersInSlides: true,
  };
});

console.log(JSON.stringify({ passed: true, puzzles: checks, distinctAnswers: answers.size }, null, 2));

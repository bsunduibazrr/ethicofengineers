/** Shared, dependency-free engine for Next and the self-contained offline HTML. */
export type SourceSlide = {
  id: string; section: string; type: string; title: string; subtitle: string;
  notes: string; html: string; textNodes: string[]; expandedHtml?: string;
  nodes?: { kind: string; src?: string }[];
};

const paths: Record<string, string> = {
  previous: '<path d="M15 6l-6 6 6 6"/>', next: '<path d="M9 6l6 6-6 6"/>',
  overview: '<rect x="4" y="4" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1"/>',
  fullscreen: '<path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/>',
  notes: '<path d="M6 4h9l3 3v13H6z"/><path d="M9 10h6M9 13.5h6M9 17h4"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
};
const icon = (name: string) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;

/** Blocks that rise in one after another when a slide arrives. */
const REVEAL = [
  ".header > *", ".div-body > *", ".div-photo", ".op-panel", ".cover-text > *", ".cover-books img",
  ".author-photo", ".dl-row", ".author-books", ".editions .ed-hero", ".ed-row > *", ".ed-reception > *", ".ed-mn-title", ".ed-mn-info",
  ".big-question", ".structure .sub", ".toc-head", ".toc-row",
  ".history-photo", ".vtl-item", ".definition", ".stage-col", ".stat", ".stat-note", ".num-item",
  ".campmap", ".camp", ".debate-people > *", ".debate-end", ".terms-head", ".term", ".mrow", ".footnote", ".pull-quote",
  ".spectrum", ".intel-photo", ".intel-cols > *", ".land-wrap", ".land-notes", ".mem-well", ".mem-right > *",
  ".nand", ".turing", ".comp-right > *", ".learn-photo", ".case-col", ".qa-card", ".thanks",
  ".ag-head", ".ag-row", ".xmedia-grid > *", ".blist > li", ".xtable tbody tr", ".xtable thead", ".pillar", ".dmd-item",
  ".xpanel", ".xcol", ".xlead", ".xflow > *", ".xpair > *", ".xchain", ".xconclusion", ".xfinal", ".xnote",
  ".xstats > *", ".xstep", ".xdl > div", ".xquote > *", ".xequation", ".xcompare > *", ".xasks > *", ".xgrid4 > *",
  ".closing > *", ".xfull .xfig", ".xart", ".kg",
].join(",");

const EASE = "cubic-bezier(.77,0,.18,1)";
const EASE_OUT = "cubic-bezier(.16,1,.3,1)";

export function mountDeck(root: HTMLElement, slides: SourceSlide[]) {
  if (slides.length !== 71) throw new Error(`Expected 71 slides, received ${slides.length}`);
  const total = slides.length;
  const pad = (n: number) => String(n).padStart(2, "0");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = -1, disposed = false;
  let current: HTMLElement | null = null, returnFocus: HTMLElement | null = null;
  let touch: { x: number; y: number } | null = null;
  let running: Animation[] = [];
  const exiting = new Set<HTMLElement>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (fn: () => void, ms: number) => {
    const timer = setTimeout(() => { timers.delete(timer); if (!disposed) fn(); }, ms);
    timers.add(timer);
  };

  root.innerHTML = `<div class="viewport"><div class="stage"><div class="slide-host"></div><div class="curtain" aria-hidden="true"><div class="curtain-in"><span class="curtain-num"></span><span class="curtain-label"></span></div></div><footer class="deck-hud"><div class="hud-brand"><i>Амьдрал 3.0</i><span class="hud-section"></span></div><div class="hud-progress" role="progressbar" aria-label="Слайдын явц" aria-valuemin="1" aria-valuemax="${total}"><i></i></div><div class="hud-nav"><button class="hud-btn" data-action="overview" aria-label="Слайдын жагсаалт" title="Esc">${icon("overview")}</button><button class="hud-btn" data-action="notes" aria-label="Илтгэгчийн тэмдэглэл" aria-pressed="false" title="N">${icon("notes")}</button><button class="hud-btn" data-action="fullscreen" aria-label="Бүтэн дэлгэц" aria-pressed="false" title="F">${icon("fullscreen")}</button><span class="hud-sep" aria-hidden="true"></span><button class="hud-btn" data-action="previous" aria-label="Өмнөх слайд" title="←">${icon("previous")}</button><span class="hud-counter" aria-live="polite" aria-atomic="true"><b>01</b><span>/ ${total}</span></span><button class="hud-btn" data-action="next" aria-label="Дараагийн слайд" title="→ / Space">${icon("next")}</button></div></footer></div><aside class="speaker-notes" hidden></aside><dialog class="overview" aria-label="Слайдын жагсаалт"><button class="overview-close hud-btn" data-action="close-overview" aria-label="Хаах">${icon("close")}</button><div class="overview-grid"></div></dialog></div>`;
  const get = <T extends HTMLElement = HTMLElement>(q: string) => root.querySelector<T>(q)!;
  const viewport = get(".viewport"), stage = get(".stage"), host = get(".slide-host"), hud = get(".deck-hud");
  const progress = get(".hud-progress"), fill = get(".hud-progress i"), counter = get(".hud-counter b"), sectionLabel = get(".hud-section");
  const curtain = get(".curtain"), curtainNum = get(".curtain-num"), curtainLabel = get(".curtain-label");
  const previous = get<HTMLButtonElement>('[data-action="previous"]'), next = get<HTMLButtonElement>('[data-action="next"]');
  const notes = get(".speaker-notes"), notesButton = get('[data-action="notes"]'), fullscreenButton = get('[data-action="fullscreen"]');
  const overview = get<HTMLDialogElement>(".overview"), grid = get(".overview-grid");

  let lastSection = "";
  slides.forEach((slide, n) => {
    if (slide.section !== lastSection) {
      const head = document.createElement("div");
      head.className = "overview-section"; head.textContent = slide.section; grid.append(head);
      lastSection = slide.section;
    }
    const button = document.createElement("button");
    button.type = "button"; button.className = "overview-card"; button.dataset.slide = String(n);
    const number = document.createElement("span"), title = document.createElement("span");
    number.className = "overview-number"; number.textContent = pad(n + 1);
    title.className = "overview-title"; title.textContent = slide.title;
    button.append(number, title); grid.append(button);
  });
  const cards = Array.from(grid.querySelectorAll<HTMLElement>(".overview-card"));

  /** Chapter number shown on the curtain, from the chapter-opening contents slide. */
  const chapterOf = (n: number) => {
    const match = slides[n].html.match(/toc-row hl is-active"><span class="toc-n">(\d+)<\/span><span class="toc-t">([^<]+)</);
    return match ? { num: match[1].padStart(2, "0"), title: match[2] } : null;
  };

  function resize() {
    const compact = viewport.clientWidth <= 700 || (viewport.clientWidth <= 960 && viewport.clientHeight <= 600);
    const availableHeight = viewport.clientHeight - (compact ? 88 : 0);
    const scale = Math.min(viewport.clientWidth / 1920, availableHeight / 1080);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
    stage.style.top = compact ? `${availableHeight / 2}px` : "50%";
    viewport.dataset.portrait = String(viewport.clientHeight > viewport.clientWidth);
    viewport.dataset.compact = String(compact);
    const hudParent = compact ? viewport : stage;
    if (hud.parentElement !== hudParent) hudParent.append(hud);
  }

  function fitContent(slide: HTMLElement) {
    if (!slide.isConnected) return;
    const surface = slide.querySelector<HTMLElement>(".slide-surface")!;
    surface.style.transform = ""; surface.style.width = "100%"; surface.style.height = "100%";
    surface.dataset.fit = "1";
    const availableWidth = surface.clientWidth, availableHeight = surface.clientHeight;
    for (let attempt = 0; attempt < 4; attempt++) {
      const stageScale = stage.getBoundingClientRect().width / 1920, rect = surface.getBoundingClientRect();
      const bounds = Array.from(surface.querySelectorAll<HTMLElement>("*")).filter(el => !el.closest("svg")).map(el => el.getBoundingClientRect());
      const width = Math.max(availableWidth, ...bounds.map(r => (r.right - rect.left) / stageScale));
      const height = Math.max(availableHeight, ...bounds.map(r => (r.bottom - rect.top) / stageScale));
      const q = Math.min(1, availableWidth / width, availableHeight / height);
      if (q > .998) break;
      const fit: number = Number(surface.dataset.fit) * q;
      surface.dataset.fit = String(fit); surface.style.width = `${100 / fit}%`; surface.style.height = `${100 / fit}%`;
      surface.style.transformOrigin = "top left"; surface.style.transform = `scale(${fit})`;
    }
  }

  function settle() {
    running.forEach(a => { try { a.finish(); } catch { /* already done */ } });
    running = [];
    exiting.forEach(el => el.remove()); exiting.clear();
    curtain.classList.remove("is-on");
  }
  const play = (el: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    const a = el.animate(frames, { fill: "both", ...options }); running.push(a); return a;
  };

  function markReveal(slide: HTMLElement, base: number) {
    const picked: HTMLElement[] = [];
    slide.querySelectorAll<HTMLElement>(REVEAL).forEach(el => {
      if (picked.some(p => p.contains(el))) return;
      picked.push(el);
    });
    picked.forEach((el, order) => {
      el.classList.add("reveal-block");
      el.style.setProperty("--reveal-delay", `${base + Math.min(order, 12) * 55}ms`);
    });
  }

  function goTo(target: number, updateHash = true) {
    const n = Math.max(0, Math.min(total - 1, target));
    if (n === index) return;
    settle();
    const direction = n > index ? 1 : -1, source = slides[n], outgoing = current;
    const first = index === -1;
    const chapter = chapterOf(n);
    const newSection = !first && direction > 0 && chapter !== null;
    const slide = document.createElement("article"), surface = document.createElement("div");
    slide.className = "slide"; slide.dataset.id = source.id; slide.dataset.index = String(n); slide.dataset.type = source.type;
    slide.setAttribute("aria-label", `${pad(n + 1)} / ${total}`);
    surface.className = "slide-surface"; surface.innerHTML = source.html; slide.append(surface);
    const structure = surface.querySelector<HTMLElement>(".structure");
    if (structure && chapter) structure.dataset.chapter = chapter.num;
    host.append(slide);

    const motion = !reduced.matches && !first;
    const base = !motion ? 60 : newSection ? 620 : 260;
    if (!reduced.matches) markReveal(slide, first ? 120 : base);

    index = n; current = slide;
    viewport.dataset.cover = String(n === 0); viewport.dataset.type = source.type;
    counter.textContent = pad(n + 1); previous.disabled = n === 0; next.disabled = n === total - 1;
    progress.setAttribute("aria-valuenow", String(n + 1)); fill.style.transform = `scaleX(${(n + 1) / total})`;
    sectionLabel.textContent = source.section;
    notes.textContent = source.notes;
    cards.forEach(c => c.removeAttribute("aria-current")); cards[n].setAttribute("aria-current", "true");
    if (updateHash) history.replaceState(null, "", `#${n + 1}`);

    if (source.expandedHtml) {
      const expanded = document.createElement("template"); expanded.innerHTML = source.expandedHtml;
      const answers = expanded.content.querySelectorAll(".qa-a");
      slide.querySelectorAll<HTMLButtonElement>(".qa-card").forEach((card, i) => {
        const hint = card.querySelector(".qa-hint")!, answer = answers[i]?.cloneNode(true) as HTMLElement;
        if (!answer) return;
        card.setAttribute("aria-expanded", "false");
        card.addEventListener("click", () => {
          const open = card.classList.toggle("open"); card.setAttribute("aria-expanded", String(open));
          if (open) hint.replaceWith(answer); else answer.replaceWith(hint);
          fitContent(slide);
        });
      });
    }
    fitContent(slide);
    slide.querySelectorAll("img").forEach(image => {
      if (!image.complete) image.addEventListener("load", () => fitContent(slide), { once: true });
    });
    document.fonts.ready.then(() => { if (!disposed) fitContent(slide); });

    if (outgoing) {
      outgoing.inert = true; outgoing.setAttribute("aria-hidden", "true"); outgoing.classList.add("is-exiting");
      exiting.add(outgoing);
    }
    if (!motion) {
      if (outgoing) {
        outgoing.remove(); exiting.delete(outgoing);
      }
    } else if (newSection) {
      // Chapter change: a navy sheet sweeps across with the chapter number, then lifts away.
      curtainNum.textContent = chapter!.num; curtainLabel.textContent = chapter!.title;
      curtain.classList.add("is-on");
      slide.style.visibility = "hidden";
      play(curtain, [{ clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)" }], { duration: 480, easing: EASE });
      play(curtain.firstElementChild!, [{ opacity: 0, transform: "translateX(80px)" }, { opacity: 1, transform: "translateX(0)" }], { duration: 520, delay: 140, easing: EASE_OUT });
      if (outgoing) play(outgoing, [{ transform: "translateX(0)" }, { transform: "translateX(-8%)" }], { duration: 480, easing: EASE });
      later(() => {
        if (outgoing) { outgoing.remove(); exiting.delete(outgoing); }
        slide.style.visibility = "";
        play(slide, [{ transform: "translateX(6%)" }, { transform: "translateX(0)" }], { duration: 640, easing: EASE_OUT });
        const out = play(curtain, [{ clipPath: "inset(0 0 0 0%)" }, { clipPath: "inset(0 100% 0 0)" }], { duration: 560, easing: EASE });
        play(curtain.firstElementChild!, [{ opacity: 1, transform: "translateX(0)" }, { opacity: 0, transform: "translateX(-60px)" }], { duration: 320, easing: "ease-in" });
        out.finished.then(() => curtain.classList.remove("is-on")).catch(() => undefined);
      }, 520);
    } else if (direction > 0) {
      // A fresh page slides over the previous one, which settles back into the stack.
      slide.classList.add("is-entering");
      play(slide, [{ transform: "translateX(100%)" }, { transform: "translateX(0)" }], { duration: 720, easing: EASE });
      if (outgoing) {
        play(outgoing, [{ transform: "translateX(0) scale(1)", opacity: 1 }, { transform: "translateX(-14%) scale(.97)", opacity: .35 }], { duration: 720, easing: EASE });
        later(() => { outgoing.remove(); exiting.delete(outgoing); slide.classList.remove("is-entering"); }, 730);
      }
    } else if (outgoing) {
      // Going back lifts the current page off to the right.
      outgoing.style.zIndex = "3"; outgoing.classList.add("is-entering");
      play(outgoing, [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }], { duration: 640, easing: EASE });
      play(slide, [{ transform: "translateX(-14%) scale(.97)", opacity: .35 }, { transform: "translateX(0) scale(1)", opacity: 1 }], { duration: 640, easing: EASE });
      later(() => { outgoing.remove(); exiting.delete(outgoing); }, 650);
    }
    root.dispatchEvent(new CustomEvent("deck:change", { detail: { index: n, id: source.id } }));
  }

  function closeOverview() { overview.close(); returnFocus?.focus(); }
  function toggleOverview() {
    if (overview.open) { closeOverview(); return; }
    returnFocus = document.activeElement as HTMLElement; overview.showModal();
    const active = cards[index]; active.focus(); active.scrollIntoView({ block: "center", behavior: "instant" });
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen(); else if (root.requestFullscreen) await root.requestFullscreen();
    } catch { fullscreenButton.setAttribute("aria-pressed", "false"); }
  }
  function toggleNotes() { notes.hidden = !notes.hidden; notesButton.setAttribute("aria-pressed", String(!notes.hidden)); }
  function onClick(event: MouseEvent) {
    const target = event.target as Element, jump = target.closest<HTMLElement>("[data-slide]");
    if (jump) { goTo(Number(jump.dataset.slide)); closeOverview(); return; }
    switch (target.closest<HTMLElement>("[data-action]")?.dataset.action) {
      case "previous": goTo(index - 1); break; case "next": goTo(index + 1); break;
      case "overview": toggleOverview(); break; case "close-overview": closeOverview(); break;
      case "fullscreen": void toggleFullscreen(); break; case "notes": toggleNotes(); break;
    }
  }
  function onKey(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target instanceof HTMLElement && (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))) return;
    if (event.key === "Escape") { event.preventDefault(); toggleOverview(); return; }
    if (overview.open) return;
    if (event.key.toLowerCase() === "f") { event.preventDefault(); void toggleFullscreen(); return; }
    if (event.key.toLowerCase() === "n") { event.preventDefault(); toggleNotes(); return; }
    if (event.code === "Space" && (event.target as HTMLElement)?.closest("button")) return;
    const forward = ["ArrowRight", "ArrowDown", "PageDown"].includes(event.key) || (event.code === "Space" && !event.shiftKey);
    const backward = ["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key) || (event.code === "Space" && event.shiftKey);
    if (forward || backward || event.key === "Home" || event.key === "End") {
      event.preventDefault(); goTo(event.key === "Home" ? 0 : event.key === "End" ? total - 1 : index + (forward ? 1 : -1));
    }
  }
  function onHash() { const n = parseInt(location.hash.slice(1), 10); if (Number.isFinite(n)) goTo(n - 1, false); }
  function onFullscreen() { fullscreenButton.setAttribute("aria-pressed", String(Boolean(document.fullscreenElement))); resize(); }
  function onDown(event: PointerEvent) {
    touch = null;
    if (event.pointerType === "touch" && !(event.target as Element).closest("button,dialog,aside")) touch = { x: event.clientX, y: event.clientY };
  }
  function onPointerCancel() { touch = null; }
  function onUp(event: PointerEvent) {
    if (!touch || event.pointerType !== "touch") return;
    const dx = event.clientX - touch.x, dy = event.clientY - touch.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) goTo(index + (dx < 0 ? 1 : -1));
    touch = null;
  }
  function onCancel(event: Event) { event.preventDefault(); closeOverview(); }
  root.addEventListener("click", onClick); window.addEventListener("keydown", onKey);
  window.addEventListener("resize", resize); window.addEventListener("hashchange", onHash);
  document.addEventListener("fullscreenchange", onFullscreen);
  viewport.addEventListener("pointerdown", onDown); viewport.addEventListener("pointerup", onUp); overview.addEventListener("cancel", onCancel);
  viewport.addEventListener("pointercancel", onPointerCancel);
  resize(); const initial = parseInt(location.hash.slice(1), 10); goTo(Number.isFinite(initial) ? initial - 1 : 0);
  return () => {
    disposed = true; timers.forEach(clearTimeout); running.forEach(a => a.cancel());
    root.removeEventListener("click", onClick); window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", resize); window.removeEventListener("hashchange", onHash);
    document.removeEventListener("fullscreenchange", onFullscreen);
    viewport.removeEventListener("pointerdown", onDown); viewport.removeEventListener("pointerup", onUp); overview.removeEventListener("cancel", onCancel);
    viewport.removeEventListener("pointercancel", onPointerCancel);
    root.innerHTML = "";
  };
}

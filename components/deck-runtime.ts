/** Shared, dependency-free engine for Next and the self-contained offline HTML. */
export type SourceSlide = {
  id: string; section: string; type: string; title: string; subtitle: string;
  notes: string; html: string; textNodes: string[]; expandedHtml?: string;
  nodes?: { kind: string; src?: string }[];
};

const paths: Record<string, string> = {
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
  ".closing > *", ".closing-copy > *", ".closing-art", ".xfull .xfig", ".xart", ".kg",
  ".chapter3-research > :first-child", ".chapter3-study", ".chapter3-conclusion > :first-child",
  ".chapter3-conclusion-copy > *", ".chapter3-conclusion-art", ".chapter3-conclusion-sources",
].join(",");

const EASE = "cubic-bezier(.77,0,.18,1)";
const EASE_OUT = "cubic-bezier(.16,1,.3,1)";

export function mountDeck(root: HTMLElement, slides: SourceSlide[]) {
  if (!slides.length) throw new Error("The presentation must contain at least one slide.");
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

  root.tabIndex = -1;
  root.innerHTML = `<div class="viewport"><div class="stage"><div class="slide-host"></div><div class="curtain" aria-hidden="true"><div class="curtain-in"><span class="curtain-num"></span><span class="curtain-label"></span></div></div><footer class="deck-hud"><div class="hud-brand"><i>Амьдрал 3.0</i><span class="hud-section"></span></div><div class="hud-progress" role="progressbar" aria-label="Слайдын явц" aria-valuemin="1" aria-valuemax="${total}"><i></i></div></footer></div><aside class="speaker-notes" hidden></aside><dialog class="overview" aria-label="Слайдын жагсаалт"><button class="overview-close hud-btn" data-action="close-overview" aria-label="Хаах">${icon("close")}</button><div class="overview-grid"></div></dialog></div>`;
  const get = <T extends HTMLElement = HTMLElement>(q: string) => root.querySelector<T>(q)!;
  const viewport = get(".viewport"), stage = get(".stage"), host = get(".slide-host");
  const progress = get(".hud-progress"), fill = get(".hud-progress i"), sectionLabel = get(".hud-section");
  const curtain = get(".curtain"), curtainNum = get(".curtain-num"), curtainLabel = get(".curtain-label");
  const notes = get(".speaker-notes");
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
    const scale = Math.min(viewport.clientWidth / 1920, viewport.clientHeight / 1080);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
    stage.style.top = "50%";
    viewport.dataset.portrait = String(viewport.clientHeight > viewport.clientWidth);
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

  function closeOverview() {
    overview.close();
    (returnFocus?.isConnected ? returnFocus : root).focus({ preventScroll: true });
  }
  function toggleOverview() {
    if (overview.open) { closeOverview(); return; }
    returnFocus = document.activeElement instanceof HTMLElement && root.contains(document.activeElement) ? document.activeElement : root;
    overview.showModal();
    const active = cards[index]; active.focus(); active.scrollIntoView({ block: "center", behavior: "instant" });
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen(); else if (root.requestFullscreen) await root.requestFullscreen();
    } catch { /* Fullscreen may be unavailable in an embedded browser. */ }
  }
  function toggleNotes() { notes.hidden = !notes.hidden; }
  function onClick(event: MouseEvent) {
    const target = event.target as Element, jump = target.closest<HTMLElement>("[data-slide]");
    if (jump) { goTo(Number(jump.dataset.slide)); closeOverview(); return; }
    if (target.closest<HTMLElement>("[data-action]")?.dataset.action === "close-overview") closeOverview();
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
  function onFullscreen() { resize(); }
  function onDown(event: PointerEvent) {
    touch = null;
    if (event.pointerType === "touch" && !(event.target as Element).closest("a,button,dialog,aside")) touch = { x: event.clientX, y: event.clientY };
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

/* AIS HTML decks: the presenter.
   Adapted from the SlidePresentation controller and deck-stage.js of frontend-slides (MIT, Copyright (c) 2025 Zara Zhang,
   see LICENSE-frontend-slides.txt): uniform scale of the 1920 × 1080 stage, keyboard, wheel and swipe navigation, the
   count outside the slide, print. The beat model follows beatdeck (MIT, Borja Pérez): one click shows one beat, every
   position is #slide.beat and renders the same whether reached forwards, backwards or straight from the URL; P opens a
   presenter window (notes, next, timer) kept in step over BroadcastChannel; O overview; B blackout.
   Modes: ?export (every slide, every beat, static: PNG, PDF, PPTX measurement), ?still (one position, no motion: the
   presenter's previews), ?view=presenter, ?send (no beats: each slide arrives whole). */
(() => {
  const html = document.documentElement, q = location.search;
  const slides = [...document.querySelectorAll('.slide')];
  // A content block centred under its headline sits on the 8 px baseline: its offset is snapped once the fonts are in
  // (layout only, transforms ignored). html[data-snapped] tells the builder and verify the layout is final.
  // Scale the composition, not the decoration: a block with a lot of room left steps its body text up one size of the
  // closed scale (38 to 44, 44 to 76: class up1), or two if there is still room (up2: words at 76, names at 120); a block
  // that does not fit steps down one (dn1). Then the block is
  // centred and its offset snapped to the 8 px baseline.
  const snap = () => { document.querySelectorAll('.hbody.centre').forEach((h) => {
    h.style.justifyContent = 'flex-start'; h.style.paddingTop = '0px';
    const kids = () => [...h.children];
    const room = h.offsetParent.clientHeight - h.offsetTop;
    const wide = () => [...h.querySelectorAll('[data-k="text"]')].some((e) => e.scrollWidth > e.clientWidth + 2);
    const free = () => { const k = kids(); if (!k.length) return 0; const top = Math.min(...k.map((x) => x.offsetTop)), bot = Math.max(...k.map((x) => x.offsetTop + x.offsetHeight)); return wide() ? -1 : room - (h.querySelector('.rows4') && !h.closest('.L-agenda') ? 48 : 64) - (bot - top); };
    const rows = h.querySelector('.rows4');
    if (rows && !h.closest('.L-agenda')) {
      const titles = [...rows.querySelectorAll('.arow-in')];
      const used = titles.reduce((sum, row) => sum + row.offsetHeight, 0);
      const budget = (room - 128 - used - (titles.length-1)*2) / Math.max(1, 2*(titles.length-1));
      const gap = [24, 40, 64, 96].filter(v => v <= budget).pop() || 24;
      rows.querySelectorAll('.rl.gap').forEach(rule => rule.style.margin = `${gap}px 0`);
    }
    let f = free();
    // A sentence of more than 12 words never reaches headline size: it may step 38 to 44, no further.
    const long = Math.max(0, ...[...h.querySelectorAll('[data-k="text"]')].map((e) => e.textContent.trim().split(/\s+/).length)) > 12;
    if (!h.closest('.L-features,.L-phases,.L-steps,.panorama') && f > 200 && !(long && h.querySelector('.t-lead, .t-h'))) {
      h.classList.add('up1'); if (free() < 0) h.classList.remove('up1');
      // A sentence of more than 12 words stays at lead size: running text never goes to headline size.
      else if (free() > 200 && Math.max(0, ...[...h.querySelectorAll('[data-k="text"]')].map((e) => e.textContent.trim().split(/\s+/).length)) <= 12) { h.classList.replace('up1', 'up2'); if (free() < 0) h.classList.replace('up2', 'up1'); }
    }
    else if (f < 0) h.classList.add('dn1');
    f = free();
    h.style.paddingTop = Math.max(0, Math.floor(f / 2 / 8) * 8) + 'px';
  }); html.dataset.snapped = '1'; };
  document.fonts.ready.then(snap);
  if (/[?&]export\b/.test(q)) { html.classList.add('is-export'); slides.forEach((s) => { s.classList.add('active', 'shown'); s.querySelectorAll('[data-beat]').forEach((e) => e.classList.add('on')); }); return; }
  const still = /[?&]still\b/.test(q), send = /[?&]send\b/.test(q), presenter = /[?&]view=presenter\b/.test(q);
  if (still) html.classList.add('is-still');
  const stage = document.querySelector('.deck-stage');
  const count = document.querySelector('.deck-count');
  const notes = document.querySelector('.deck-notes');
  const beats = slides.map((s) => send ? 0 : Math.max(0, ...[...s.querySelectorAll('[data-beat]')].map((e) => +e.dataset.beat)));
  let i = 0, b = 0, idle, over = false;
  const chan = 'BroadcastChannel' in window ? new BroadcastChannel('ais-deck:' + location.pathname) : null;

  const fit = () => {
    if (over) return;
    const f = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(${(innerWidth - 1920 * f) / 2}px,${(innerHeight - 1080 * f) / 2}px) scale(${f})`;
  };
  // Show slide n at beat k. Beats up to k are on; the entrance replays only when the slide changes.
  const go = (n, k, from = 'nav') => {
    n = Math.max(0, Math.min(n, slides.length - 1)); k = Math.max(0, Math.min(k, beats[n]));
    const changed = n !== i || from === 'load';
    i = n; b = k;
    slides.forEach((s, x) => s.classList.toggle('active', x === i));
    slides[i].querySelectorAll('[data-beat]').forEach((e) => e.classList.toggle('on', send || +e.dataset.beat <= b));
    if (changed) {
      slides.forEach((s) => s.classList.remove('shown'));
      if (still) slides[i].classList.add('shown');
      else requestAnimationFrame(() => requestAnimationFrame(() => slides[i].classList.add('shown')));
    }
    history.replaceState(null, '', '#' + (i + 1) + (beats[i] ? '.' + b : ''));
    count.textContent = `${i + 1} / ${slides.length}`;
    if (!still) { count.classList.add('show'); clearTimeout(idle); idle = setTimeout(() => count.classList.remove('show'), 1800); }
    notes.textContent = slides[i].dataset.notes || '';
    if (chan && from !== 'remote') chan.postMessage({i, b});
    if (presenter) paintPresenter();
  };
  const next = () => (b < beats[i] ? go(i, b + 1) : i < slides.length - 1 && go(i + 1, 0));
  const prev = () => (b > 0 ? go(i, b - 1) : i > 0 && go(i - 1, beats[i - 1]));
  const parse = () => { const m = location.hash.match(/^#(\d+)(?:\.(\d+))?/); return m ? [m[1] - 1, +(m[2] || 0)] : [0, 0]; };

  // Overview (O): every slide as a thumbnail; click one to go there.
  const overview = (on) => {
    over = on; html.classList.toggle('is-overview', on);
    if (!on) { slides.forEach((s) => (s.style.transform = '')); fit(); return; }
    const cols = 4, gap = 24, w = (innerWidth - gap * (cols + 1)) / cols, f = w / 1920;
    stage.style.transform = 'none';
    slides.forEach((s, x) => { s.style.transform = `translate(${gap + (x % cols) * (w + gap)}px,${gap + Math.floor(x / cols) * (w * 9 / 16 + gap)}px) scale(${f})`; s.classList.add('shown'); s.querySelectorAll('[data-beat]').forEach((e) => e.classList.add('on')); });
  };
  // Presenter window: current position, next position, notes, timer. Both previews are this file in ?still mode.
  let t0 = null, pres;
  function paintPresenter() {
    if (!pres) return;
    const n = b < beats[i] ? [i, b + 1] : [i + 1, 0];
    const src = (p) => location.pathname + '?still#' + (p[0] + 1) + '.' + p[1];
    if (pres.cur.dataset.at !== src([i, b])) { pres.cur.src = src([i, b]); pres.cur.dataset.at = src([i, b]); }
    if (n[0] < slides.length) { if (pres.nxt.dataset.at !== src(n)) { pres.nxt.src = src(n); pres.nxt.dataset.at = src(n); } } else pres.nxt.removeAttribute('src');
    pres.pos.textContent = `Diapositiva ${i + 1} de ${slides.length}` + (beats[i] ? `, paso ${b} de ${beats[i]}` : '');
    pres.notes.textContent = slides[i].dataset.notes || '';
  }
  if (presenter) {
    html.classList.add('is-presenter');
    document.body.insertAdjacentHTML('beforeend', `<div class="pv"><iframe class="pv-cur" title="Actual"></iframe><div class="pv-side"><iframe class="pv-next" title="Siguiente"></iframe><div class="pv-pos"></div><div class="pv-time">00:00</div><div class="pv-notes"></div></div></div>`);
    pres = {cur: document.querySelector('.pv-cur'), nxt: document.querySelector('.pv-next'), pos: document.querySelector('.pv-pos'), notes: document.querySelector('.pv-notes'), time: document.querySelector('.pv-time')};
    setInterval(() => { if (t0 === null) return; const s = Math.floor((Date.now() - t0) / 1000); pres.time.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }, 500);
  }

  if (chan) chan.onmessage = (e) => { if (still) return; if (e.data.cmd === 'next') next(); else if (e.data.cmd === 'prev') prev(); else if (typeof e.data.i === 'number' && (e.data.i !== i || e.data.b !== b)) go(e.data.i, e.data.b, 'remote'); };
  const send2 = (cmd) => (presenter && chan ? (chan.postMessage({cmd}), cmd === 'next' ? next() : prev()) : cmd === 'next' ? next() : prev());
  if (!still) {
    addEventListener('resize', () => (over ? overview(true) : fit()));
    addEventListener('keydown', (e) => {
      if (t0 === null) t0 = Date.now();
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); send2('next'); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); send2('prev'); }
      else if (e.key === 'Home') go(0, 0);
      else if (e.key === 'End') go(slides.length - 1, beats[slides.length - 1]);
      else if (/^[nN]$/.test(e.key)) notes.classList.toggle('show');
      else if (/^[fF]$/.test(e.key)) document.fullscreenElement ? document.exitFullscreen() : html.requestFullscreen();
      else if (/^[oO]$/.test(e.key)) overview(!over);
      else if (e.key === 'Escape' && over) overview(false);
      else if (/^[bB.]$/.test(e.key)) html.classList.toggle('is-black');
      else if (/^[pP]$/.test(e.key) && !presenter) open(location.pathname + '?view=presenter' + location.hash, 'ais-presenter', 'width=1400,height=820');
    });
    let wheelLock = 0;
    addEventListener('wheel', (e) => { const t = Date.now(); if (over || presenter || t - wheelLock < 600 || Math.abs(e.deltaY) < 20) return; wheelLock = t; e.deltaY > 0 ? next() : prev(); }, {passive: true});
    let x0 = null;
    addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, {passive: true});
    addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) dx < 0 ? next() : prev(); x0 = null; });
    addEventListener('click', (e) => {
      if (presenter || e.target.closest('a,iframe')) return;
      if (over) { const s = e.target.closest('.slide'); if (s) { overview(false); go(slides.indexOf(s), 0); } return; }
      e.clientX > innerWidth / 3 ? next() : prev();
    });
  }
  addEventListener('hashchange', () => { const [n, k] = parse(); if (n !== i || k !== b) go(n, k); });
  fit();
  const [n, k] = parse();
  go(n, k, 'load');
})();

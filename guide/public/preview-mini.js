// ?mini (the component index thumbnails), for the product and website previews: centre what is actually visible
// and scale it to fit the frame.
if (new URLSearchParams(location.search).has('mini')) {
  const main = document.querySelector('main');
  const fit = () => {
    main.style.transform = ''; main.style.minHeight = '100vh';
    const rects = [...main.querySelectorAll('*')].map((el) => {
      let r = el.getBoundingClientRect(); if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') return null;
      let box = { l: r.left, t: r.top, r: r.right, b: r.bottom };
      for (let a = el.parentElement; a && a !== main; a = a.parentElement) {
        if (getComputedStyle(a).overflow === 'visible') continue;
        const c = a.getBoundingClientRect(); box = { l: Math.max(box.l, c.left), t: Math.max(box.t, c.top), r: Math.min(box.r, c.right), b: Math.min(box.b, c.bottom) };
      }
      return box.r > box.l && box.b > box.t ? box : null;
    }).filter(Boolean);
    if (!rects.length) return;
    const L = Math.min(...rects.map((x) => x.l)), T = Math.min(...rects.map((x) => x.t)), R = Math.max(...rects.map((x) => x.r)), B = Math.max(...rects.map((x) => x.b));
    const s = Math.min(1.6, (innerWidth - 64) / (R - L), (innerHeight - 64) / (B - T));
    main.style.transformOrigin = '0 0';
    main.style.transform = `translate(${innerWidth / 2}px, ${innerHeight / 2}px) scale(${s}) translate(${-(L + R) / 2}px, ${-(T + B) / 2}px)`;
  };
  document.documentElement.style.overflow = 'hidden';
  // The island mounts after load: refit whenever its content changes.
  let timer; const refit = () => { clearTimeout(timer); timer = setTimeout(fit, 60); };
  new MutationObserver(refit).observe(main, { childList: true, subtree: true, characterData: true });
  addEventListener('load', refit); document.fonts?.ready.then(refit); [500, 1500].forEach((d) => setTimeout(refit, d));
}

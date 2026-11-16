// Runs in the export DOM, after fonts and the stage have settled. All units are deck pixels.
export const measureAlignment = () => [...document.querySelectorAll('.slide')].map((slide, index) => {
  const failures = [], measurements = [];
  const rect = (e) => e.getBoundingClientRect();
  const baseline = (e) => {
    const probe = document.createElement('span');
    probe.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;vertical-align:baseline';
    e.prepend(probe); const y = rect(probe).top; probe.remove(); return y;
  };
  const check = (kind, actual, expected, detail) => {
    const delta = Math.abs(actual - expected);
    measurements.push({kind, actual, expected, delta, detail});
    if (delta > 2) failures.push(`${kind}: ${detail}: ${actual.toFixed(2)} vs ${expected.toFixed(2)} px (delta ${delta.toFixed(2)})`);
  };
  // Shared quality contracts are measured from the rendered result, alongside the 2px rails.
  const bounds = rect(slide);
  slide.querySelectorAll('.rows4 .arow-in').forEach((row, n) => {
    if (slide.matches('.L-features,.L-phases,.L-steps')) {
      check('row-title-scale', parseFloat(getComputedStyle(row.children[1]).fontSize), 44, `row ${n+1}`);
      if (row.children[2]) check('row-body-scale', parseFloat(getComputedStyle(row.children[2]).fontSize), 38, `row ${n+1}`);
    }
  });
  slide.querySelectorAll('.L-features .gridc .phcell>.t-body,.L-features .evidence-points .t-lead,.L-features .evidence-points .t-body').forEach((text, n) => {
    const title=text.style.fontWeight==='500';
    check(title?'feature-title-scale':'feature-body-scale',parseFloat(getComputedStyle(text).fontSize),title?44:38,`feature text ${n+1}`);
  });
  slide.querySelectorAll('[data-side-photo="full"] .pic').forEach((p) => {
    check('photo-panel-left', rect(p).left-bounds.left, 980, 'full-panel photo');
    check('photo-panel-right', rect(p).right-bounds.left, 1920, 'full-panel photo');
    // A stage may carry two deliberately stacked panels; its top/height are not full-slide.
    if (slide.matches('.L-split,.L-figures,.L-photo,.L-statement,.L-mosaic')) {
      check('photo-panel-top', rect(p).top-bounds.top, 0, 'full-panel photo');
      check('photo-panel-height', rect(p).height, 1080, 'full-panel photo');
    }
  });
  if (slide.matches('.L-split,.L-figures')) {
    slide.querySelectorAll('.panel').forEach(p => {
      const brightness = color => (color.match(/[\d.]+/g)||[]).slice(0,3).reduce((sum,channel,index)=>sum + Number(channel)*[.2126,.7152,.0722][index],0);
      if (slide.classList.contains('g-brand') && brightness(getComputedStyle(p).backgroundColor) < brightness(getComputedStyle(slide).backgroundColor)-2)
        failures.push('photo-placeholder: darker inset panel on a blue slide');
    });
  }
  slide.querySelectorAll('.pic img[data-k="img"]').forEach(im => {
    const p=rect(im.closest('.pic')), cs=getComputedStyle(im);
    if (!slide.matches('.L-cover')) {
      const rendered=cs.objectFit==='fill'?rect(im):p;
      const scale=cs.objectFit==='contain' ? Math.min(rendered.width/im.naturalWidth,rendered.height/im.naturalHeight) : Math.max(rendered.width/im.naturalWidth,rendered.height/im.naturalHeight);
      measurements.push({kind:'source-pixel-scale',actual:scale,expected:1.3,delta:Math.max(0,scale-1.3),detail:im.getAttribute('src')});
      if (scale>1.305) failures.push(`source-pixel-scale: ${scale.toFixed(3)}x exceeds 1.3x`);
    }
    const holder=im.closest('[data-side-photo]');
    if (holder?.dataset.sidePhoto==='limited' && Math.max(940/im.naturalWidth,1080/im.naturalHeight)<=1.3 && slide.matches('.L-split,.L-figures'))
      failures.push('photo-panel: source supports a full panel but is inset');
  });
  slide.querySelectorAll('.pic img').forEach(im=> { if (/(sabadell[-_]facade|sabadell-building|office-map)/i.test(im.getAttribute('src')) && !slide.dataset.streetView) failures.push('facility-aerial: facade/map needs an explicit street-view purpose'); });
  const title=slide.querySelector('.mask')?.textContent || '';
  if (slide.dataset.facility==='true' || /^(Equipo propio|Nuestra oficina en España|Contáctanos)$/.test(title.trim())) {
    const photos=[...slide.querySelectorAll('.pic img')];
    measurements.push({kind:'facility-aerial',actual:photos.some(im=>/sabadell-aerial/.test(im.getAttribute('src')))?1:0,expected:1,delta:photos.some(im=>/sabadell-aerial/.test(im.getAttribute('src')))?0:1,detail:'approved Sabadell aerial'});
    if (!photos.some(im=>/sabadell-aerial/.test(im.getAttribute('src')))) failures.push('facility-aerial: use the registered Sabadell aerial photograph');
  }
  // Content headings share the fixed (128, 96) origin. Display statements,
  // covers and numbered section dividers have their own deliberate composition.
  if (!slide.matches('.L-cover,.L-divider')) {
    const stack = [...slide.children].find((e) => e.matches('.stack') && e.firstElementChild?.matches('.mask'));
    const heading = stack?.querySelector(':scope>.mask>.mi.t-h');
    if (heading) {
      const box = rect(heading), bounds = rect(slide);
      check('heading-left', box.left - bounds.left, 128, 'content heading');
      check('heading-top', box.top - bounds.top, 96, 'content heading');
    }
  }
  // These layouts promise equal grid tracks. Measure actual boxes, including any
  // transform or content-driven displacement, rather than accepting CSS declarations.
  slide.querySelectorAll('.gridc,.tiles2').forEach((grid, g) => {
    const style = getComputedStyle(grid), tracks = style.gridTemplateColumns.split(' ').map(parseFloat);
    const cells = [...grid.children], columns = tracks.length, origin = rect(grid);
    const gutter = parseFloat(style.columnGap), rowGap = parseFloat(style.rowGap) || 0;
    const rowBounds = [], ruleRails = [];
    cells.forEach((cell, n) => {
      const column = n % columns, row = Math.floor(n / columns), box = rect(cell);
      const left = origin.left + tracks.slice(0, column).reduce((a, b) => a + b, 0) + gutter * column;
      check('grid-column-rail', box.left, left, `grid ${g + 1} cell ${n + 1}`);
      check('grid-track-width', box.width, tracks[column], `grid ${g + 1} cell ${n + 1}`);
      if (!rowBounds[row]) rowBounds[row] = {top: box.top, bottom: box.bottom};
      check('grid-row-top', box.top, rowBounds[row].top, `grid ${g + 1} cell ${n + 1}`);
      rowBounds[row].bottom = Math.max(rowBounds[row].bottom, box.bottom);
      const rule = [...cell.children].find((child) => child.classList.contains('rl'));
      if (rule) {
        if (ruleRails[row] === undefined) ruleRails[row] = rect(rule).top;
        check('grid-rule-alignment', rect(rule).top, ruleRails[row], `grid ${g + 1} cell ${n + 1}`);
      }
    });
    rowBounds.slice(1).forEach((row, n) => check('grid-row-gap', row.top - rowBounds[n].bottom, rowGap, `grid ${g + 1} row ${n + 2}`));
  });
  slide.querySelectorAll('.tbl').forEach((table) => {
    const rows = [...table.querySelectorAll('.trow')], rails = [];
    rows.forEach((row, r) => [...row.children].forEach((cell, c) => {
      const box = rect(cell);
      if (!rails[c]) rails[c] = box;
      check('table-column-left', box.left, rails[c].left, `row ${r + 1} column ${c + 1}`);
      check('table-column-right', box.right, rails[c].right, `row ${r + 1} column ${c + 1}`);
    }));
  });
  slide.querySelectorAll('.rows4').forEach((group) => {
    const rows = [...group.querySelectorAll('.arow-in')];
    const rails = [];
    rows.forEach((row, n) => {
      const children = [...row.children], marker = children[0], title = children[1], body = children[2];
      const firstCenter = rect(title).top + parseFloat(getComputedStyle(title).lineHeight) / 2;
      const visibleMarker = marker.matches('.mk') ? marker.firstElementChild : marker;
      if (visibleMarker) check('marker-first-line', (rect(visibleMarker).top + rect(visibleMarker).bottom) / 2, firstCenter, `row ${n + 1} ${title.textContent.slice(0, 40)}`);
      if (body) check('row-baseline', baseline(body), baseline(title), `row ${n + 1}`);
      children.forEach((child, c) => {
        if (rails[c] === undefined) rails[c] = rect(child).left;
        check('column-rail', rect(child).left, rails[c], `row ${n + 1} column ${c + 1}`);
      });
    });
    const gaps = rows.slice(1).map((row, n) => rect(row).top - rect(rows[n]).bottom);
    gaps.forEach((gap, n) => check('equivalent-row-gap', gap, gaps[0], `row ${n + 2}`));
  });
  slide.querySelectorAll('.mrow').forEach((row, n) => {
    const cells = [...row.children].filter((e) => e.dataset.k === 'text');
    if (cells.length > 1) check('milestone-baseline', baseline(cells[0]), baseline(cells[1]), `milestone ${n + 1}`);
  });
  slide.querySelectorAll('.hexwrap').forEach((hex, n) => {
    const number = hex.querySelector('.hexnum');
    if (number) check('hexagon-number-center', (rect(number).top + rect(number).bottom) / 2, (rect(hex).top + rect(hex).bottom) / 2, `hexagon ${n + 1}`);
  });
  slide.querySelectorAll('.pic').forEach((picture, n) => {
    const p = rect(picture), bounds = rect(slide);
    if (slide.classList.contains('L-cover')) {
      check('cover-panel-left', p.left - bounds.left, 1000, 'full-bleed cover');
      check('cover-panel-top', p.top - bounds.top, 0, 'full-bleed cover');
      check('cover-panel-width', p.width, 920, 'full-bleed cover');
      check('cover-panel-height', p.height, 1080, 'full-bleed cover');
    }
    if (p.left < bounds.left - 2 || p.right > bounds.right + 2 || p.top < bounds.top - 2 || p.bottom > bounds.bottom + 2) failures.push(`picture-frame outside slide: ${n + 1}`);
    let caption = picture.nextElementSibling;
    if (!caption && picture.parentElement.matches('.pic-box')) caption = picture.parentElement.nextElementSibling;
    if (caption?.matches('[data-k="text"]:not(.num):not(.t-meta)') && rect(caption).top >= p.bottom - 2 && rect(caption).top - p.bottom <= 66) {
      if (getComputedStyle(caption).textAlign === 'center') check('picture-caption-center', (rect(caption).left + rect(caption).right) / 2, (p.left + p.right) / 2, `picture ${n + 1}`);
      else check('picture-caption-edge', rect(caption).left, p.left, `picture ${n + 1}`);
    }
    // Images themselves may extend beyond their clipping frame: intentional cover/contain cropping.
  });
  return {slide: index + 1, failures, measurements};
});

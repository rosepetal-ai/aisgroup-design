#!/usr/bin/env node
// The runtime states check: what ui-contract.mjs cannot read from code. On every route, in every theme and viewport, it
// checks the page at rest, then opens each trigger of our overlays in turn (menus, popovers, selects, comboboxes,
// tooltips, dialogs, sheets, context menus; the sidebar sheet at phone width), checks the open state and closes it.
// Rules: clipped-text, wrapped-label, overlay-off-screen, page-scroll, small-text, small-target, button-height,
// button-row-height, divider-overflow, divider-off-centre, console-error, page-error. Each failing state is screenshotted with the failing elements outlined.
// Bounded: only our own triggers ([data-slot$="-trigger"]), no sub-menus, no hover styles; keyboard, focus and screen
// reader checks remain manual.
//   node ui-states.mjs <base URL> [routes...] [--config states.json] [--login hook.mjs] [--theme-key key]
//     [--dark-class "dark"] [--themes light,dark] [--viewports 1440x900,390x844] [--out ui-states] [--chromium path]
//     [--max-triggers 25] [--settle 800]
// A config file holds the same options as JSON: { "baseURL", "routes": [], "login", "themeKey", "darkClass", … }.
// The login hook is an ES module whose default export, async ({ page, context, baseURL }) => {}, signs in once.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const TRIGGER_SLOTS = ['dropdown-menu', 'popover', 'select', 'combobox', 'tooltip', 'dialog', 'alert-dialog', 'sheet', 'context-menu', 'sidebar'];
const TRIGGERS = TRIGGER_SLOTS.map((s) => `[data-slot="${s}-trigger"]`).join(',');
// Open overlays: our content slots, the mobile sidebar sheet, and any ARIA overlay (PrimeVue and others).
export const CONTENTS = ['dropdown-menu', 'dropdown-menu-sub', 'popover', 'select', 'combobox', 'tooltip', 'dialog', 'alert-dialog', 'sheet', 'context-menu', 'context-menu-sub', 'hover-card', 'navigation-menu']
  .map((s) => `[data-slot="${s}-content"]`).concat('[data-slot="sidebar"][data-mobile="true"]', '[role="dialog"]', '[role="alertdialog"]', '[role="menu"]', '[role="listbox"]', '[role="tooltip"]').join(',');
export const RULES = ['clipped-text', 'wrapped-label', 'overlay-off-screen', 'page-scroll', 'small-text', 'small-target', 'button-height', 'button-row-height', 'divider-overflow', 'divider-off-centre', 'console-error', 'page-error'];
const PER_RULE = 25; // findings kept per rule and state; counts stay complete
const DEFAULTS = { themes: ['light', 'dark'], viewports: [{ width: 1440, height: 900 }, { width: 390, height: 844 }], out: 'ui-states', maxTriggers: 25, settle: 800, darkClass: 'dark' };

// Runs in the page. With open: true it checks only the overlays opened since run() marked the visible ones
// (data-ui-states-seen); otherwise the whole page.
export function inspect({ open, contents, perRule }) {
  const found = [], counts = {};
  const vw = document.documentElement.clientWidth, vh = innerHeight;
  const add = (rule, el, measured) => {
    counts[rule] = (counts[rule] ?? 0) + 1;
    if (counts[rule] > perRule) return;
    if (el) el.setAttribute('data-ui-states-mark', '');
    found.push({ rule, element: el ? describe(el) : null, measured });
  };
  function describe(el) {
    const steps = [];
    for (let n = el; n && n !== document.body && steps.length < 5; n = n.parentElement) {
      if (n.dataset.aiId) { steps.unshift(`[data-ai-id="${n.dataset.aiId}"]`); break; }
      if (n.id && !/^(?:reka|radix|v-|pv_id)/.test(n.id)) { steps.unshift(`#${CSS.escape(n.id)}`); break; }
      const slot = n.getAttribute('data-slot'), same = n.parentElement ? [...n.parentElement.children].filter((c) => c.tagName === n.tagName) : [];
      steps.unshift(n.tagName.toLowerCase() + (slot ? `[data-slot="${slot}"]` : '') + (same.length > 1 ? `:nth-of-type(${same.indexOf(n) + 1})` : ''));
    }
    return { selector: steps.join(' > '), aiId: el.closest('[data-ai-id]')?.dataset.aiId ?? null, text: (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80) };
  }
  const visible = (el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true, checkOpacity: true, checkVisibilityCSS: true });
  const box = (el) => el.getBoundingClientRect();
  const px = (r) => ({ x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) });
  const SKIP = 'script,style,noscript,template,select,option,svg,[aria-hidden="true"]';

  const roots = open ? [...document.querySelectorAll(contents)].filter((c) => !c.hasAttribute('data-ui-states-seen') && visible(c) && box(c).width > 2 && box(c).height > 2) : [document.body];
  // A nested match (a menu inside its content wrapper) is the same overlay.
  const tops = roots.filter((r) => !roots.some((o) => o !== r && o.contains(r)));
  if (open && !tops.length) return { opened: false, found, counts };

  // Page: no sideways scroll; name the elements that start it.
  if (!open && document.documentElement.scrollWidth > vw + 1) {
    const wide = [...document.body.querySelectorAll('*')].filter((e) => box(e).right > vw + 1 && !(e.parentElement && box(e.parentElement).right > vw + 1) && visible(e)).slice(0, 3);
    add('page-scroll', wide[0] ?? null, { documentWidth: document.documentElement.scrollWidth, viewportWidth: vw, origins: wide.map((e) => describe(e).selector) });
  }
  for (const r of open ? tops : []) {
    const b = box(r);
    if (b.left < -1 || b.top < -1 || b.right > vw + 1 || b.bottom > vh + 1) add('overlay-off-screen', r, { box: px(b), viewport: { width: vw, height: vh } });
  }

  const elements = tops.flatMap((r) => [r, ...r.querySelectorAll('*')]).filter((e) => e instanceof HTMLElement && !e.closest(SKIP));
  const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3 && n.data.trim());
  // The own text's box. A glyph box is taller than a tight line box (leading-none), so vertical checks allow half the
  // difference on each side.
  const textRect = (nodes, lineHeight) => {
    const range = document.createRange(), rects = nodes.map((n) => (range.selectNodeContents(n), range.getBoundingClientRect()));
    const glyph = range.getClientRects()[0]?.height ?? 0;
    return { left: Math.min(...rects.map((r) => r.left)), right: Math.max(...rects.map((r) => r.right)), top: Math.min(...rects.map((r) => r.top)), bottom: Math.max(...rects.map((r) => r.bottom)), slack: Math.max(0, (glyph - (lineHeight || glyph)) / 2) + 1 };
  };
  // How far the text passes a box's padding area, per axis.
  const past = (t, el) => {
    const r = box(el), left = r.left + el.clientLeft, top = r.top + el.clientTop;
    return { x: Math.max(left - t.left, t.right - left - el.clientWidth), y: Math.max(top - t.top, t.bottom - top - el.clientHeight), inside: t.right > left && t.left < left + el.clientWidth && t.bottom > top && t.top < top + el.clientHeight };
  };
  const fullTextNearby = (e, text) => {
    const holder = e.closest('[title],[aria-label]');
    return Boolean(e.closest('[data-slot="tooltip-trigger"],[aria-describedby]') || (holder && (holder.getAttribute('title') || holder.getAttribute('aria-label')).includes(text)));
  };
  const LABELS = 'button,[role="button"],[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"],[role="option"],[role="tab"],label,[data-slot="badge"],[data-slot="label"],[data-slot$="-label"]';
  for (const e of elements) {
    const nodes = own(e);
    if (!nodes.length || !visible(e)) continue;
    const b = box(e);
    if (b.width <= 2 || b.height <= 2) continue;
    const cs = getComputedStyle(e), text = nodes.map((n) => n.data).join(' ').trim().replace(/\s+/g, ' ');
    // clipped-text: the element's own text past its padding box, or partly cut by the nearest ancestor that hides
    // overflow. A scroll container scrolls on purpose; visually hidden helpers (sr-only, clip) are deliberate.
    const t = textRect(nodes, parseFloat(cs.lineHeight)), self = past(t, e);
    let cut = null;
    if (e.clientWidth && ((self.x > 1 && !/auto|scroll/.test(cs.overflowX)) || (self.y > t.slack && !/auto|scroll/.test(cs.overflowY)))) cut = { by: 'self', overflowX: Math.round(self.x), overflowY: Math.round(self.y), box: px(b) };
    else for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const as = getComputedStyle(a);
      if (as.overflowX === 'visible' && as.overflowY === 'visible') continue;
      const ab = box(a);
      if (/auto|scroll/.test(as.overflowX + as.overflowY) || ab.width < 4 || ab.height < 4 || as.clip !== 'auto' || as.clipPath !== 'none') break;
      const o = past(t, a);
      if (o.inside && (o.x > 1 || o.y > t.slack)) cut = { by: describe(a).selector, overflowX: Math.round(o.x), overflowY: Math.round(o.y), box: px(ab) };
      break;
    }
    const truncates = cs.textOverflow === 'ellipsis' || (cs.webkitLineClamp && cs.webkitLineClamp !== 'none');
    if (cut && !(truncates && fullTextNearby(e, text))) add('clipped-text', e, { ...cut, truncates: Boolean(truncates), text: text.slice(0, 80) });
    // wrapped-label: a label's own words on more than one line.
    const label = e.matches(LABELS) ? e : e.parentElement?.matches(LABELS) ? e.parentElement : null;
    if (label) {
      const range = document.createRange();
      const lines = nodes.map((n) => {
        range.selectNodeContents(n);
        const rects = [...range.getClientRects()].filter((r) => r.width > 0);
        return rects.filter((r, i) => i === 0 || Math.abs(r.top - rects[i - 1].top) > r.height / 2).length;
      });
      if (Math.max(...lines) > 1) add('wrapped-label', label, { lines: Math.max(...lines), box: px(box(label)), text: text.slice(0, 80) });
    }
    // small-text: the product scale starts at 14 px; 12 px only for chart axes and keyboard keys.
    const size = parseFloat(cs.fontSize);
    if (size < 13.5 && !e.closest('kbd,[data-slot="kbd"],[data-slot$="-shortcut"],[data-slot="chart"],.recharts-wrapper,.apexcharts-canvas,canvas')) add('small-text', e, { fontSize: size, text: text.slice(0, 80) });
  }

  // small-target: 24 × 24 px, counting a pseudo-element that enlarges the hit area and the label of a checkbox or
  // radio; an inline link in running text, or a small target with no other target within 24 px, passes (WCAG 2.5.8).
  const INTERACTIVE = 'a[href],button,input:not([type="hidden"]),textarea,summary,[role="button"],[role="link"],[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"],[role="option"],[role="tab"],[role="checkbox"],[role="radio"],[role="switch"],[role="combobox"],[role="slider"],[tabindex]:not([tabindex="-1"])';
  const targets = tops.flatMap((r) => [...(r.matches(INTERACTIVE) ? [r] : []), ...r.querySelectorAll(INTERACTIVE)])
    .filter((e) => !e.closest(SKIP) && !e.disabled && e.getAttribute('aria-disabled') !== 'true' && visible(e) && box(e).width > 2);
  const area = (e) => {
    let { left, top, right, bottom } = box(e);
    if (getComputedStyle(e).position !== 'static') for (const p of ['::before', '::after']) {
      const s = getComputedStyle(e, p);
      if (s.content === 'none' || s.position !== 'absolute') continue;
      const n = (v) => (v.endsWith('px') ? parseFloat(v) : 0);
      left = Math.min(left, box(e).left + n(s.left)); top = Math.min(top, box(e).top + n(s.top));
      right = Math.max(right, box(e).right - n(s.right)); bottom = Math.max(bottom, box(e).bottom - n(s.bottom));
    }
    const label = e.closest('label') ?? (e.id && document.querySelector(`label[for="${CSS.escape(e.id)}"]`));
    if (label && /checkbox|radio|switch/.test(e.getAttribute('role') ?? e.type)) {
      const l = box(label);
      left = Math.min(left, l.left); top = Math.min(top, l.top); right = Math.max(right, l.right); bottom = Math.max(bottom, l.bottom);
    }
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  };
  const areas = targets.map(area);
  targets.forEach((e, i) => {
    const a = areas[i];
    if (a.width >= 23.5 && a.height >= 23.5) return;
    const inline = e.tagName === 'A' && getComputedStyle(e).display === 'inline' && e.parentElement.textContent.trim().length > e.textContent.trim().length;
    const cx = (a.left + a.right) / 2, cy = (a.top + a.bottom) / 2;
    const crowded = areas.some((o, j) => j !== i && !targets[j].contains(e) && !e.contains(targets[j]) && o.left < cx + 12 && o.right > cx - 12 && o.top < cy + 12 && o.bottom > cy - 12);
    if (!inline && crowded) add('small-target', e, { width: Math.round(a.width), height: Math.round(a.height) });
  });

  // button-height: our scale only, 36 px default, 32 px sm in dense rows, 44 px touch, and 40 px modal, the only height
  // in a dialog footer. button-row-height: buttons on one line of a row share one height. Our Button keeps data-size
  // under a trigger's data-slot; card, bar (top bar) and inline buttons take their height from their content.
  const SCALE = [32, 36, 40, 44];
  const BUTTONS = '[data-slot="button"],[data-size][data-variant],.p-button,.v-btn,button:not([data-slot]):not([role])';
  const buttons = tops.flatMap((r) => [...(r.matches(BUTTONS) ? [r] : []), ...r.querySelectorAll(BUTTONS)])
    .filter((e) => !e.closest(SKIP) && visible(e) && box(e).width > 2 && !/^(?:card|bar|inline)$/.test(e.dataset.size ?? '') && getComputedStyle(e).display !== 'inline');
  for (const e of buttons) {
    const h = Math.round(box(e).height), footer = e.closest('[data-slot="dialog-footer"],[data-slot="alert-dialog-footer"]');
    if (footer ? h !== 40 : !SCALE.includes(h)) add('button-height', e, { height: h, allowed: footer ? [40] : SCALE, size: e.dataset.size ?? null });
  }
  // ponytail: a row is the nearest flex row or grid, at most three levels up, holding another button.
  const rowOf = (e) => {
    let r = e.parentElement;
    for (let up = 0; r && r !== document.body && up < 3; up++, r = r.parentElement) {
      const s = getComputedStyle(r);
      if ((s.display.includes('grid') || (s.display.includes('flex') && !s.flexDirection.startsWith('column'))) && buttons.some((o) => o !== e && r.contains(o))) return r;
    }
    return null;
  };
  const rows = new Map();
  for (const e of buttons) { const r = rowOf(e); if (r) rows.set(r, [...(rows.get(r) ?? []), e]); }
  for (const [r, list] of rows) {
    const lines = [];
    // One line: boxes overlapping vertically by half the smaller one, however they are aligned.
    for (const e of list) {
      const b = box(e), line = lines.find((l) => Math.min(l.bottom, b.bottom) - Math.max(l.top, b.top) >= Math.min(l.bottom - l.top, b.height) / 2);
      if (line) line.items.push(e); else lines.push({ top: b.top, bottom: b.bottom, items: [e] });
    }
    for (const { items } of lines) {
      const heights = items.map((e) => Math.round(box(e).height));
      if (Math.max(...heights) - Math.min(...heights) > 1) add('button-row-height', r, { heights, buttons: items.map((e) => describe(e).text || describe(e).selector) });
    }
  }

  // divider-overflow: a divider stays inside its parent's box; a full-width one given side margins runs past it, into
  // the border. divider-off-centre: a vertical divider shorter than its row sits on the row's centre; a fixed height
  // with align-self: stretch pins it to the top. Both come from a class that lost to the component's own.
  const DIVIDERS = '[data-slot="separator"],[data-slot$="-separator"],[data-sidebar="separator"],[role="separator"],hr';
  // A focusable separator is a splitter (the sidebar's resize handle), placed across an edge on purpose.
  const dividers = tops.flatMap((r) => [...r.querySelectorAll(DIVIDERS)])
    .filter((e) => !e.closest(SKIP) && e.parentElement && !e.matches('[tabindex]:not([tabindex="-1"]),[aria-valuenow]') && visible(e));
  for (const e of dividers) {
    const b = box(e), p = e.parentElement, pb = box(p), ps = getComputedStyle(p);
    if (b.width < 0.5 || b.height < 0.5) continue;
    if (b.left < pb.left - 0.5 || b.right > pb.right + 0.5 || b.top < pb.top - 0.5 || b.bottom > pb.bottom + 0.5) {
      add('divider-overflow', e, { box: px(b), parent: px(pb) });
      continue;
    }
    const vertical = (e.getAttribute('aria-orientation') ?? e.dataset.orientation) === 'vertical' || b.height > b.width;
    if (!vertical || !ps.display.includes('flex') || ps.flexDirection.startsWith('column')) continue;
    const padTop = parseFloat(ps.paddingTop), rowHeight = p.clientHeight - padTop - parseFloat(ps.paddingBottom);
    const offset = b.top + b.height / 2 - (pb.top + p.clientTop + padTop + rowHeight / 2);
    if (b.height < rowHeight - 1 && Math.abs(offset) > 1) add('divider-off-centre', e, { offset: Math.round(offset), height: Math.round(b.height), rowHeight: Math.round(rowHeight) });
  }
  return { opened: true, found, counts };
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
// Wait for fonts and finite animations (menus zoom in; a scaled box measures wrong). Spinners loop forever: ignored.
async function settle(page, ms) {
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running' || a.effect?.getTiming().iterations === Infinity), null, { timeout: 2000 }).catch(() => {});
  await pause(ms);
}
const slug = (s) => s.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'home';

export async function run(options) {
  const o = { ...DEFAULTS, ...options };
  if (!o.baseURL || !o.routes?.length) throw new Error('A base URL and at least one route are required.');
  let chromium;
  try { ({ chromium } = await import('playwright')); } catch { throw new Error('Playwright is missing: run npm install (or the plugin\'s setup) first.'); }
  fs.mkdirSync(o.out, { recursive: true });
  const browser = await chromium.launch({ executablePath: o.chromium || undefined });
  const context = await browser.newContext({ viewport: o.viewports[0], baseURL: o.baseURL });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push({ rule: 'console-error', measured: { message: m.text().slice(0, 300), source: m.location()?.url ?? '' } }); });
  page.on('pageerror', (e) => errors.push({ rule: 'page-error', measured: { message: String(e.message ?? e).slice(0, 300) } }));
  page.on('dialog', (d) => d.dismiss().catch(() => {}));
  const findings = [], counts = {}, perRoute = {}, states = [];
  try {
    if (o.login) {
      const hook = (await import(pathToFileURL(path.resolve(o.login)).href)).default;
      await hook({ page, context, baseURL: o.baseURL });
    }
    let shot = 0;
    for (const viewport of o.viewports) for (const theme of o.themes) for (const route of o.routes) {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme: theme });
      const vp = `${viewport.width}x${viewport.height}`;
      // Errors raised while the page first loads are reported at rest; a reload that restores the page after a
      // trigger repeats them, so its errors are dropped.
      const load = async (first) => {
        if (o.themeKey) {
          if (page.url() === 'about:blank') await page.goto(route, { waitUntil: 'domcontentloaded' });
          await page.evaluate(([k, v]) => localStorage.setItem(k, v), [o.themeKey, theme]);
        }
        await page.goto(route, { waitUntil: 'load' });
        if (!o.themeKey) await page.evaluate(([classes, dark]) => { for (const c of classes.split(/\s+/).filter(Boolean)) document.documentElement.classList.toggle(c, dark); }, [o.darkClass, theme === 'dark']);
        await settle(page, o.settle);
        if (!first) errors.length = 0;
      };
      errors.length = 0;
      await load(true);
      const record = async (state, result) => {
        const all = [...result.found, ...errors.splice(0).filter((e, i, list) => list.findIndex((x) => x.measured.message === e.measured.message) === i)];
        const tally = { ...result.counts };
        for (const e of all) if (/error/.test(e.rule)) tally[e.rule] = (tally[e.rule] ?? 0) + 1;
        let screenshot = null;
        if (all.length) {
          screenshot = path.join(o.out, `${String(++shot).padStart(3, '0')}-${slug(route)}-${theme}-${vp}-${slug(state)}.png`.slice(0, 200));
          await page.addStyleTag({ content: '[data-ui-states-mark]{outline:2px solid #e11d48!important;outline-offset:1px!important}' }).catch(() => {});
          await page.screenshot({ path: screenshot, fullPage: state === 'rest' }).catch(() => { screenshot = null; });
        }
        await page.evaluate(() => document.querySelectorAll('[data-ui-states-mark]').forEach((e) => e.removeAttribute('data-ui-states-mark'))).catch(() => {});
        for (const [rule, n] of Object.entries(tally)) {
          counts[rule] = (counts[rule] ?? 0) + n;
          (perRoute[route] ??= {})[rule] = (perRoute[route][rule] ?? 0) + n;
        }
        for (const f of all) findings.push({ route, theme, viewport: vp, state, ...f, screenshot });
      };
      const at = page.url();
      await record('rest', await page.evaluate(inspect, { open: false, contents: CONTENTS, perRule: PER_RULE }));
      const summary = { route, theme, viewport: vp, url: at, triggers: await page.locator(TRIGGERS).count(), opened: [], notOpened: [] };
      for (let i = 0; i < Math.min(summary.triggers, o.maxTriggers); i++) {
        const trigger = page.locator(TRIGGERS).nth(i);
        if (!(await trigger.isVisible().catch(() => false))) continue;
        const info = await trigger.evaluate((e) => ({ slot: e.dataset.slot, aiId: e.dataset.aiId ?? e.querySelector('[data-ai-id]')?.dataset.aiId ?? null, label: (e.getAttribute('aria-label') || e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40), disabled: e.disabled || e.getAttribute('aria-disabled') === 'true' || e.dataset.disabled !== undefined }));
        // The sidebar trigger opens a sheet only at phone width; on desktop it collapses the sidebar.
        if (info.disabled || (info.slot === 'sidebar-trigger' && viewport.width >= 768)) continue;
        const state = `open ${info.slot.replace(/-trigger$/, '')} ${info.aiId ?? info.label ?? i}`;
        await page.evaluate((c) => document.querySelectorAll(c).forEach((e) => e.setAttribute('data-ui-states-seen', '')), CONTENTS);
        const opened = () => page.waitForFunction((c) => [...document.querySelectorAll(c)].some((e) => !e.hasAttribute('data-ui-states-seen') && e.checkVisibility() && e.getBoundingClientRect().width > 2), CONTENTS, { timeout: 1500 }).then(() => true, () => false);
        const act = info.slot === 'tooltip-trigger' ? trigger.hover({ timeout: 2000 }) : info.slot === 'context-menu-trigger' ? trigger.click({ button: 'right', timeout: 2000 }) : trigger.click({ timeout: 2000 });
        let ok = await act.then(opened, () => false);
        if (!ok) ok = await trigger.focus().then(() => page.keyboard.press('Enter')).then(opened, () => false);
        if (ok) {
          await settle(page, 150);
          const result = await page.evaluate(inspect, { open: true, contents: CONTENTS, perRule: PER_RULE });
          summary.opened.push(state);
          await record(state, result);
        } else summary.notOpened.push(info.aiId ?? info.label ?? `#${i}`);
        await page.keyboard.press('Escape').catch(() => {});
        await page.mouse.move(0, 0);
        const closed = await page.waitForFunction((c) => ![...document.querySelectorAll(c)].some((e) => !e.hasAttribute('data-ui-states-seen') && e.checkVisibility() && e.getBoundingClientRect().width > 2), CONTENTS, { timeout: 1500 }).then(() => true, () => false);
        if (errors.length) await record(state, { found: [], counts: {} }); // raised while opening or closing
        if (!closed || page.url() !== at) await load(false);
      }
      summary.skipped = Math.max(0, summary.triggers - o.maxTriggers);
      states.push(summary);
    }
  } finally {
    await browser.close();
  }
  const report = {
    scope: 'runtime: each route at rest and with each of our overlay triggers open, per theme and viewport; keyboard, focus, hover and screen-reader checks remain manual',
    baseURL: o.baseURL,
    statesFree: findings.length === 0,
    counts,
    routes: perRoute,
    states,
    findings,
  };
  fs.writeFileSync(path.join(o.out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  return report;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values: v, positionals } = parseArgs({ allowPositionals: true, options: {
    config: { type: 'string' }, login: { type: 'string' }, 'theme-key': { type: 'string' }, 'dark-class': { type: 'string' },
    themes: { type: 'string' }, viewports: { type: 'string' }, out: { type: 'string' }, chromium: { type: 'string' },
    'max-triggers': { type: 'string' }, settle: { type: 'string' },
  } });
  const file = v.config ? JSON.parse(fs.readFileSync(v.config, 'utf8')) : {};
  // Paths in a config file are relative to it.
  if (v.config && file.login) file.login = path.resolve(path.dirname(v.config), file.login);
  const [baseURL, ...routes] = /^https?:\/\//.test(positionals[0] ?? '') ? positionals : [undefined, ...positionals];
  const options = { ...file };
  if (baseURL) options.baseURL = baseURL;
  if (routes.length) options.routes = routes;
  if (v.login) options.login = v.login;
  if (v['theme-key']) options.themeKey = v['theme-key'];
  if (v['dark-class']) options.darkClass = v['dark-class'];
  if (v.themes) options.themes = v.themes.split(',');
  if (v.viewports) options.viewports = v.viewports.split(',').map((s) => { const [width, height] = s.split('x').map(Number); return { width, height }; });
  if (v.out) options.out = v.out;
  if (v.chromium) options.chromium = v.chromium;
  if (v['max-triggers']) options.maxTriggers = Number(v['max-triggers']);
  if (v.settle) options.settle = Number(v.settle);
  if (typeof options.viewports?.[0] === 'string') options.viewports = options.viewports.map((s) => { const [width, height] = s.split('x').map(Number); return { width, height }; });
  if (!options.baseURL || !options.routes?.length) {
    console.error('Usage: ui-states.mjs <base URL> <routes...> [--config states.json] [--login hook.mjs] [--theme-key key | --dark-class "dark"] [--themes light,dark] [--viewports 1440x900,390x844] [--out ui-states] [--chromium path] [--max-triggers 25]');
    process.exit(2);
  }
  const report = await run(options);
  console.log(JSON.stringify(report, null, 2));
  if (!report.statesFree) process.exitCode = 1;
}

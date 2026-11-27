/**
 * What the explainer draws over the scene besides the piece's own UI layer: the chapter's name under the logo (24 px
 * Medium, its line 16 px secondary, never on a card), and, in a held view, one label per part (the overlay kit's 20 px
 * tab, 12 px Medium, ink on white with a hairline, joined to its part by a 1 px ink leader: no dots). Both enter over
 * 500 ms and leave over 180 ms (guide motion, real seconds); a new chapter waits for the old one to leave.
 */
import type { World } from '../world';
import { CUT } from '../story';
import { CHAPTERS, VIEWS, chapterShown, labelsShown } from './chapters';

const OUT = 180;

export function createOverlay(stage: HTMLElement) {
  const heading = stage.querySelector<HTMLElement>('[data-chapter]')!;
  const [name, line] = heading.querySelectorAll<HTMLElement>('p');
  const layer = stage.querySelector<HTMLElement>('[data-labels]')!;
  let shown = -1, target = -1, timer = 0;
  let viewId = '', labels: { el: HTMLElement; part: (typeof VIEWS)[number]['labels'][number][0]; w: number }[] = [];

  const chapterAt = (t: number) => CHAPTERS.reduce((i, c, k) => (c.t <= t + 1e-6 ? k : i), 0);

  function setChapter(i: number) {
    if (i === target) return;
    target = i;
    clearTimeout(timer);
    const enter = () => {
      shown = target;
      if (shown < 0) return;
      name.textContent = CHAPTERS[shown].name;
      line.textContent = CHAPTERS[shown].line;
      line.hidden = !CHAPTERS[shown].line;
      heading.classList.add('is-on');
    };
    if (shown >= 0 && heading.classList.contains('is-on')) {
      heading.classList.remove('is-on');
      timer = window.setTimeout(enter, OUT);
    } else enter();
  }

  function setView(id: string) {
    if (id === viewId) return;
    viewId = id;
    layer.replaceChildren();
    labels = (VIEWS.find((v) => v.id === id)?.labels ?? []).map(([part, text]) => {
      const el = document.createElement('div');
      el.className = 'ple-label';
      el.innerHTML = '<span class="ple-label__leader"></span><span class="ple-label__tab"><span class="ple-label__text"></span></span>';
      el.querySelector('.ple-label__text')!.textContent = text;
      layer.append(el);
      return { el, part, w: 0 };
    });
  }

  /** What a label never covers: the logo, the chapter's name and any title standing on the scene. */
  const keepOut = () => {
    const s = stage.getBoundingClientRect();
    return [...stage.querySelectorAll<HTMLElement>('.ple-logo, .ple-chapter.is-on, .pl-open, .plu-hero')]
      .filter((e) => { const c = getComputedStyle(e); return e.offsetWidth > 0 && c.opacity !== '0' && c.display !== 'none' && c.visibility !== 'hidden'; })
      .map((e) => { const r = e.getBoundingClientRect(); return { x0: r.left - s.left, y0: r.top - s.top, x1: r.right - s.left, y1: r.bottom - s.top }; });
  };

  return {
    update(t: number, world: World, view: string, live: boolean) {
      const portrait = stage.clientWidth < stage.clientHeight;
      // phones raise the subject over the panel while the evidence stands under it: no room for the chapter's name
      const raised = portrait && t >= CUT.inside && t < CUT.cabinet;
      setChapter(live && !raised && chapterShown(t, view) && CHAPTERS[chapterAt(t)].name ? chapterAt(t) : -1);
      setView(view);
      const on = live && labels.length > 0 && labelsShown(t);
      layer.classList.toggle('is-on', on);
      if (!on) return;
      const anchors = world.anchors(), W = stage.clientWidth, out = keepOut();
      for (const l of labels) {
        const p = world.project(anchors[l.part]);
        if (p) {
          l.w ||= l.el.querySelector<HTMLElement>('.ple-label__tab')!.offsetWidth;
          // the tab centred over its leader, kept on the stage; the leader stays on the part
          const half = l.w / 2, x = Math.min(W - 16 - half, Math.max(16 + half, p[0]));
          const tab = { x0: x - half, x1: x + half, y0: p[1] - 52, y1: p[1] - 32 };
          if (tab.x0 >= 0 && tab.x1 <= W && tab.y0 >= 0 && tab.y1 <= stage.clientHeight &&
            !out.some((r) => tab.x0 < r.x1 && tab.x1 > r.x0 && tab.y0 < r.y1 && tab.y1 > r.y0)) {
            out.push(tab);
            const joint = Math.max(tab.x0 + 1, Math.min(p[0], tab.x1 - 1));
            l.el.style.setProperty('--ple-tilt', `${Math.atan2(p[0] - joint, 32)}rad`);
            l.el.style.transform = `translate(${p[0].toFixed(1)}px, ${p[1].toFixed(1)}px)`;
            l.el.style.setProperty('--ple-shift', `${(x - p[0]).toFixed(1)}px`);
            l.el.style.visibility = '';
            continue;
          }
        }
        l.el.style.visibility = 'hidden'; // off the stage, behind the camera, or where it would cover a title
      }
    },
  };
}

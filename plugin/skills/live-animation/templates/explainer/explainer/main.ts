/**
 * Boots the line as an explainer: the catalogue's scene and UI layer (../main.ts is the catalogue's clock), driven
 * by the viewer through the control bar (player.ts). One clock in wall seconds at 1×, times the chosen speed; it stops
 * at the end (play starts it again from the top) and while paused draws only what changes (a seek, a view, a resize).
 * `?t=<s>` holds one story moment, paused (review frames, the poster). With reduced motion the poster is the piece until
 * the viewer presses play. No WebGL or a failed load: the poster.
 */
import { watch } from 'vue';
import { DURATION, WALL, isFlat, storyOf, wallOf } from '../story';
import { createUi } from '../ui';
import { SHOT_TIMES, createWorld, type World } from '../world';
import { VIEWS, heldSpan } from './chapters';
import { createOverlay } from './overlay';
import { player } from './player';

/** The control bar's room over the bottom title-safe margin: its height (one row or two) and 16 px clear above it. */
const barLift = () => (document.querySelector<HTMLElement>('.ple-bar')?.offsetHeight || 56) + 16;

export function mountExplainer(stage: HTMLElement): void {
  const still = () => stage.classList.add('is-still');
  const canvas = stage.querySelector('canvas'), uiRoot = stage.querySelector<HTMLElement>('[data-ui]');
  const held = new URLSearchParams(location.search).get('t');
  player.canFull = !!document.fullscreenEnabled;
  player.toggleFull = () => { (document.fullscreenElement ? document.exitFullscreen() : stage.requestFullscreen()).catch(() => {}); };
  document.addEventListener('fullscreenchange', () => {
    player.full = document.fullscreenElement === stage;
    stage.classList.toggle('is-full', player.full);
  });
  if (!canvas || !uiRoot) return still();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches && !held) {
    // the poster until the viewer asks for the motion
    still();
    const stop = watch(() => player.playing, (on) => { if (on) { stop(); stage.classList.remove('is-still'); boot(canvas, uiRoot, null); } });
    return;
  }
  boot(canvas, uiRoot, held);

  function boot(canvas: HTMLCanvasElement, uiRoot: HTMLElement, held: string | null) {
    let world: World;
    try {
      world = createWorld(canvas);
    } catch {
      return still(); // no WebGL: the poster
    }
    const ui = createUi(uiRoot, { lift: barLift });
    const overlay = createOverlay(stage);
    let clock = held ? Number(held) % DURATION : 0;
    let wall = wallOf(clock);
    player.playing = !held;
    player.time = wall;

    let live = false, onScreen = false, raf = 0, last = 0;
    const fail = (why: unknown) => {
      console.error('__PIECE__ explainer: stopped, showing the poster', why);
      live = false;
      stage.classList.remove('is-live');
      still();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); fail('WebGL context lost'); });
    const draw = () => {
      try {
        // a held view replaces the line's shots between the opening and the results: the titles keep the film's frame
        world.view(heldSpan(clock) ? VIEWS.find((v) => v.id === player.view)?.pose ?? null : null);
        const input = world.render(clock, ui.framing, ui.column);
        if (import.meta.env.DEV) Object.assign(window, { __plT: clock, __plSeek: (t: number) => { clock = t; wall = wallOf(t); player.time = wall; draw(); }, __plWall: { wallOf, storyOf } });
        ui.update(input);
        overlay.update(clock, world, player.view, live);
        if (live) probeLogo(!player.playing);
      } catch (e) {
        fail(e);
      }
    };
    const redraw = () => { if (live) draw(); };
    // The logo takes the white file over a dark ground (the guide: blue on light, white on dark): the scene's pixels
    // under it and its clear space, sampled right after a frame is drawn, at most every 300 ms and after a seek
    const logo = stage.querySelector<HTMLElement>('.ple-logo');
    const lin = (c: number) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const BLUE_Y = 0.0376; // #17356E
    let probed = -1e9, shot = '', dark = false;
    /** The logo takes the white file over a dark ground (the guide: blue on light, white on dark): the frame just drawn
     *  under it and its clear space, read on each cut, seek and view change, and every 1.5 s through a move. */
    const probeLogo = (force: boolean) => {
      const now = performance.now(), s = `${SHOT_TIMES.findLastIndex((x) => x <= clock)} ${player.view}`;
      if (!logo || (!force && s === shot && now - probed < 1500)) return;
      probed = now;
      shot = s;
      const decide = (white: number, blue: number) => {
        // the white file only where it reads clearly better, and back only where the blue does (no flicker between)
        if (dark ? blue > white * 1.15 : white > blue * 1.15) stage.classList.toggle('is-dark-top', (dark = !dark));
      };
      if (isFlat(clock) && stage.clientWidth < stage.clientHeight) return decide(0, 1); // phones show the software flat on white
      const pad = logo.offsetHeight / 4;
      world.sample(logo.offsetLeft - pad, logo.offsetTop - pad, logo.offsetWidth + 2 * pad, logo.offsetHeight + 2 * pad).then((d) => {
        const Y: number[] = [];
        for (let i = 0; i < d.length; i += 16) Y.push(0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]));
        // each file's contrast with the ground, at its worst quarter (WCAG contrast on linear luminance)
        const q = (c: number[]) => c.sort((a, b) => a - b)[Math.floor(c.length / 4)];
        decide(q(Y.map((y) => 1.05 / (y + 0.05))), q(Y.map((y) => (y + 0.05) / (BLUE_Y + 0.05))));
      });
    };
    new ResizeObserver(() => { world.resize(stage.clientWidth, stage.clientHeight); redraw(); }).observe(stage);
    world.resize(stage.clientWidth, stage.clientHeight);

    const frame = (now: number) => {
      if (player.playing) {
        // A long stall doesn't jump the story, nor does a frame stamped before `last` (shaders compiling at load)
        wall = Math.min(WALL, wall + Math.min(0.1, Math.max(0, (now - last) / 1000)) * player.speed);
        clock = storyOf(wall);
        if (Math.abs(wall - player.time) >= 0.1 || wall >= WALL) player.time = wall; // the bar at 10 Hz: under half a pixel a step
        if (wall >= WALL) player.playing = false; // the end: play starts again from the top
      }
      last = now;
      draw();
      raf = live && onScreen && document.visibilityState === 'visible' && player.playing ? requestAnimationFrame(frame) : 0;
    };
    const run = () => {
      const go = live && onScreen && document.visibilityState === 'visible' && player.playing;
      if (go && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!go && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; run(); }).observe(stage);
    document.addEventListener('visibilitychange', run);

    player.seek = (w: number) => {
      wall = Math.min(WALL, Math.max(0, w));
      clock = storyOf(wall);
      player.time = wall;
      redraw();
    };
    watch(() => player.playing, (on) => {
      if (on && wall >= WALL - 0.05) player.seek(0); // play at the end: from the top
      run();
    });
    watch(() => player.view, redraw);

    world.ready.then(async () => {
      // A warm-up frame of the scene alone under the poster and the title: the first frame compiles the post-processing
      // passes (half a second on a laptop's GPU), so the reveal's frame is an ordinary one. The UI is not touched: the
      // title's CSS rise runs on (11-26: updating the UI here moved its words, loadtrace).
      try { world.render(clock, ui.framing, ui.column); } catch (e) { return fail(e); }
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      if (stage.classList.contains('is-still')) return;
      live = true;
      if (!held && player.playing) wall = wallOf((clock = ui.startAt()));
      player.time = wall;
      draw();
      stage.classList.add('is-live');
      performance.mark('pl:live');
      run();
    }, (e) => {
      console.error('__PIECE__ explainer: the scene did not load', e);
      still();
    });
  }
}

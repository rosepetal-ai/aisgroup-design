/**
 * What the explainer's clock (main.ts) and its control bar (Bar.vue, @aisgroup/design PlayerBar) share: one reactive
 * state, in the viewer's seconds at 1× (wall seconds: story.ts wallOf). The clock writes the time; the bar writes
 * playing, the view and the speed, and asks for seeks and full screen through the functions the clock sets.
 */
import { reactive } from 'vue';
import { WALL, wallOf } from '../story';
import { CHAPTERS, VIEWS } from './chapters';

export const player = reactive({
  duration: Math.round(WALL * 10) / 10,
  time: 0,
  playing: false,
  speed: 1,
  view: 'auto',
  canFull: true,
  full: false,
  seek: (w: number) => { player.time = w; },
  toggleFull: () => {},
});

/** The chapters and views as the bar shows them (wall seconds). */
export const barChapters = CHAPTERS.map((c) => ({ at: Math.round(wallOf(c.t) * 100) / 100, name: c.button ?? c.name }));
export const barViews = VIEWS.map(({ id, name }) => ({ id, name }));

/**
 * The explainer's chapters, camera views and labels (rule book «Two variants», explainer). Chapters are the story's own
 * sections (story.ts T), named for the viewer; «How the ejector works» is a chapter, not a button. Each line says where
 * the chapter happens, never what the caption at that moment says. Views are the scene's own shots (world.ts SHOTS),
 * held while the line runs; the software's push, its framing and the pull out stay the film's. Labels name the parts in
 * a held view, one per subject; the film (Auto) has none, its captions speak.
 */
import { CUT, T } from '../story';

/** `button`: the name on the bar's chapter button (one to four words), when the full name is longer. */
export interface Chapter { t: number; name: string; line: string; button?: string }
export const CHAPTERS: Chapter[] = [
  { t: 0, name: 'Pharma line', line: '' }, // the opening title names it
  { t: T.card[1] + 0.8, name: 'Sign-in and batch start', line: 'On the Panel PC beside the line.' },
  { t: T.out1, name: 'All the way round', line: 'Inside the AIS REV 360 Compact.' },
  { t: CUT.codes, name: 'Codes against the order', line: 'Read from the label as it passes.' },
  { t: T.cap, name: 'The leaning cap', line: 'Under the top camera, in slow motion.' },
  { t: CUT.cabinet, name: 'How the ejector works', line: 'From the verdict to the tray.' },
  { t: T.toScreen2, name: 'The Monitor', line: 'On the Panel PC, as the operator sees it.' },
  { t: T.role.zoom, name: 'Roles and changes', line: 'Only a supervisor changes a recipe.' },
  { t: T.close.ff, name: 'Batch report', line: 'Written when the batch closes.' },
  { t: T.out2, name: 'Results', line: '' }, // the results stand there
];

/** Where the chapter's name may stand: the scene's clear top left. Only the wide view keeps it clear (the loop of
 *  conveyor runs behind every closer view, and the film's close shots fill the frame: there the captions speak and the
 *  timeline names the chapter). Not under the opening title or the results, and not while the camera is on the software
 *  (from just before the app fills the frame until the pull out has landed). */
const HIDDEN: [number, number][] = [
  [0, T.card[1] + 0.8],
  [T.fill1 - 0.5, T.out1],
  [T.fill2 - 0.5, Infinity],
];
export const chapterShown = (t: number, view: string) => !!VIEWS.find((v) => v.id === view)?.chapter && !HIDDEN.some(([a, b]) => t >= a && t < b);

export type Part = 'head' | 'panel' | 'tray' | 'paddle';
export interface View { id: string; name: string; pose: number[] | null; labels: [Part, string][]; chapter?: boolean }
/** Poses as world.ts SHOTS: [px, py, pz, tx, ty, tz, f (where across the stage the target sits), fov]. */
export const VIEWS: View[] = [
  { id: 'auto', name: 'Auto', pose: null, labels: [] },
  // the whole line, centred (world.ts LINE)
  { id: 'wide', name: 'Wide', pose: [3.6, 2.0, 3.9, 0.7, 1.04, 0.25, 0.5, 30], labels: [['head', 'AIS REV 360 Compact'], ['panel', 'Panel PC'], ['tray', 'Reject tray']], chapter: true },
  // the station: the head and the Panel PC's cabinet beside it, from the front, a long lens, a little right of centre
  { id: 'station', name: 'Station', pose: [2.6, 1.9, 3.0, 0.45, 0.95, 0.15, 0.58, 24], labels: [['head', 'AIS REV 360 Compact'], ['panel', 'Panel PC']] },
  // the reject from the line's downstream end (world.ts SHOTS, the strike): the strike, the flight and the landing
  { id: 'reject', name: 'Reject', pose: [-1.86, 1.56, -0.08, -1.0, 0.9, -0.17, 0.5, 30], labels: [['paddle', 'Ejector'], ['tray', 'Reject tray']] },
];
/** A held view holds between the opening title and the results; they keep the film's frame, made for them. */
export const heldSpan = (t: number) => t >= T.card[1] + 0.8 && t < T.out2;
/** The labels only while the camera holds the view: not while it is on the software. */
const ON_SOFTWARE: [number, number][] = [[T.toScreen1, T.out1], [T.toScreen2, T.out2]];
export const labelsShown = (t: number) => heldSpan(t) && !ON_SOFTWARE.some(([a, b]) => t >= a && t < b);

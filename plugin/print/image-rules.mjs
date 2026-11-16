// Image rules shared by every generator's checks: print/render.mjs (brochures, catalogues, datasheets),
// decks/build.mjs (decks) and engine/recipe.mjs + stage.html (posts, carousels).
//   - Covers are impeccable: never a video frame; print covers 240 ppi or more, screen covers
//     shown at their own size or smaller.
//   - Never the old flat-label wine renders: only the round-label set (pieces/datasheets/standard/
//     assets/wine_det-*_tile.jpg, ~/.cache/ais-group-design/det/rev360-standard/round-1102/). Matched by content
//     hash, so a copy under another name still fails.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PRINT_COVER_PPI = 240;
export const SCREEN_COVER_SCALE = 1; // a screen cover is never enlarged past its own pixels

// md5 (or its first 12 hex digits) of the flat-label wine set: the 800 px finals and their PNG masters.
export const FLAT_LABEL_WINE = new Set([
  // Rejected non-round PAIR pictures from carousel 27 (12 November 2026).
  'dee3081f4bbefe625e736c57edcbab73', // label-ok-whole.jpg
  'fc6bdaf71af8921bc91c22efe5f7f858', // label-crooked-whole.jpg
  '099d1d32a6567a0bfbfbc3cf8e5d5cb7', // print-defect-whole.jpg
  '7015a47232edb40c79ee68e951a5c632', // stillwine_det-label-double.jpg
  'd72ec5846d09', '21aa821c68d7', '97fd6b2bff0a', '6915a721f205', '485dc2b7c34b', '550a92446299', // integrity lifted missing upside wrinkled stain
  'bd82a35e444e', 'e35e3d78203c', '7c54abbad4c1', '56b434d57200', '629b636e487f', 'c5cd95b4970a', 'c7fe41b11e38', // PNG masters
]);

let catalog;
const entries = () => catalog ??= (() => { try { return JSON.parse(fs.readFileSync(path.join(STUDIO, 'library/catalog.json'), 'utf8')).assets || []; } catch { return []; } })();
const FRAME_WORDS = /video frame|frame from|fotograma|\bframe \d{1,2}:\d{2}|from the \d{3,4}p (interview|video|film)|from AIS.s own (published )?(video|film)/i;

// A video frame by name (copies keep "frame"/"video" in the name) or by its catalogue entry.
export function isVideoFrame(file) {
  const base = path.basename(decodeURIComponent(String(file)));
  if (/(^|[-_])(frame|fotograma|video)([-_.]|$)/i.test(base)) return true;
  return entries().some((a) => a && path.basename(String(a.path || '')) === base && (a.origin === 'video-frame' || FRAME_WORDS.test(String(a.reason || ''))));
}

const md5 = (p) => createHash('md5').update(fs.readFileSync(p)).digest('hex');
// The reason a picture may not be used at all, or null.
export function bannedImage(file) {
  let h; try { h = md5(decodeURIComponent(String(file).replace(/^file:\/\//, ''))); } catch { return null; }
  return [...FLAT_LABEL_WINE].some((x) => h.startsWith(x)) ? `${path.basename(String(file))} is an old flat-label wine render (md5 ${h.slice(0, 8)}…); use the round-label set` : null;
}

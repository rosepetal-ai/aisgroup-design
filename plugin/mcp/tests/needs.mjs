// What some tests need that is not in the repo: the media library (the brand photos and videos, in the private media bucket).
// Run them after npm run media:pull (it links library/media, as the plugin does at start),
// or with library/media already linked. Without it they are skipped and say why; the other tests still run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const media = path.join(STUDIO, 'library/media'), chosen = process.env.AIS_MEDIA_LIBRARY;
if (chosen && fs.existsSync(chosen) && !fs.existsSync(media)) fs.symlinkSync(path.resolve(chosen), media, 'dir');
export const needsMedia = fs.existsSync(path.join(media, 'real')) ? false : 'needs the media library on disk: npm run media:pull';

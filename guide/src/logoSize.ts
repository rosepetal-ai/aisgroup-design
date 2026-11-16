import fs from 'node:fs';
import path from 'node:path';

/**
 * Optical sizing: every logo gets the same visual area, so the stacked AIS
 * marks (about 1.4:1) and the wide Rosepetal wordmark (about 5.3:1) read as
 * equals. Equal heights would make the stacked marks look tiny.
 */
export function logoBox(file: string, area: number) {
  const svg = fs.readFileSync(path.join(process.cwd(), 'public/logos', file), 'utf8');
  const [, , w, h] = svg.match(/viewBox="([^"]+)"/)![1].split(/[\s,]+/).map(Number);
  const height = Math.round(Math.sqrt(area / (w / h)));
  return { width: Math.round(height * (w / h)), height };
}

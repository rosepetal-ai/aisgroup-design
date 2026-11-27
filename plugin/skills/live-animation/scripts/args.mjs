// Shared argument checks for the live-animation scripts (no dependencies, so it runs before any browser starts).
// Every script prints its one-line usage on --help (exit 0) and, with the reason, on bad arguments (exit 2).
//   const [url, out] = cli('node film.mjs <url> <outdir> <spec>', { min: 3, check: (a) => … 'why it is wrong' | null });
import fs from 'node:fs';

export function cli(usage, { min = 0, urls = [0], check } = {}) {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) { console.log(`usage: ${usage}`); process.exit(0); }
  const fail = (why) => { console.error(`${why}\nusage: ${usage}`); process.exit(2); };
  if (args.length < min) fail(`missing arguments: need ${min}, got ${args.length}`);
  for (const i of urls) {
    if (args[i] === undefined) continue;
    let u = null;
    try { u = new URL(args[i]); } catch {}
    if (!u || !/^https?:$/.test(u.protocol)) fail(`not a URL: «${args[i]}» (expected the piece's page, e.g. http://127.0.0.1:4394/animations/food-line/)`);
  }
  const why = check?.(args);
  if (why) fail(why);
  return args;
}

// Small validators for `check`: each returns null when fine, else the reason.
export const isNum = (v) => v !== undefined && v !== '' && Number.isFinite(Number(v));
export const range = (v, name = 'range') => (/^\d+(\.\d+)?:\d+(\.\d+)?$/.test(v) && Number(v.split(':')[0]) < Number(v.split(':')[1]) ? null : `bad ${name} «${v}»: want from:to in wall seconds, from < to (e.g. 12.5:20)`);
export const ranges = (v) => (v.split(',').every((r) => range(r) === null) ? null : `bad ranges «${v}»: want from:to[,from:to…] in wall seconds (e.g. 18.9:19.7,40:41)`);
export const jsonFile = (f) => {
  if (!fs.existsSync(f)) return `no such file: ${f}`;
  try { JSON.parse(fs.readFileSync(f, 'utf8')); return null; } catch (e) { return `not valid JSON: ${f} (${e.message})`; }
};
export const dir = (d) => (fs.existsSync(d) && fs.statSync(d).isDirectory() ? null : `no such folder: ${d}`);

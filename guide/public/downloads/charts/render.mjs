// AIS Group charts: render any Vega-Lite spec as an on-brand SVG.
//
//   npm install            (once, in this folder)
//   node render.mjs specs/bar.vl.json > bar.svg
//   node render.mjs specs/bar.vl.json --dark --locale es > bar-es-dark.svg
//
// The brand look lives in ais-vega-config.json (and -dark). A spec describes data and encoding only:
// any "config" inside the spec is ignored, so every chart stays on brand.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as vega from 'vega';
import * as vl from 'vega-lite';

const here = path.dirname(fileURLToPath(import.meta.url));
const LOCALES = {
  en: { decimal: '.', thousands: ',', grouping: [3], currency: ['€', ''] },
  // Spanish and Catalan: decimal comma, non-breaking space for thousands, euro after the number.
  es: { decimal: ',', thousands: '\u00a0', grouping: [3], currency: ['', ' €'] },
  ca: { decimal: ',', thousands: '\u00a0', grouping: [3], currency: ['', ' €'] },
};
const TIME = {
  en: { dateTime: '%x, %X', date: '%-m/%-d/%Y', time: '%-I:%M:%S %p', periods: ['AM', 'PM'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
  es: { dateTime: '%A, %e de %B de %Y, %X', date: '%d/%m/%Y', time: '%H:%M:%S', periods: ['', ''],
    days: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'], shortDays: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    shortMonths: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic'] },
  ca: { dateTime: '%A, %e de %B de %Y, %X', date: '%d/%m/%Y', time: '%H:%M:%S', periods: ['', ''],
    days: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'], shortDays: ['dg', 'dl', 'dt', 'dc', 'dj', 'dv', 'ds'],
    months: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
    shortMonths: ['gen', 'febr', 'març', 'abr', 'maig', 'juny', 'jul', 'ag', 'set', 'oct', 'nov', 'des'] },
};

export async function renderChart(spec, { dark = false, locale = 'en', baseDir = here } = {}) {
  const config = JSON.parse(fs.readFileSync(path.join(here, dark ? 'ais-vega-config-dark.json' : 'ais-vega-config.json'), 'utf8'));
  const { config: _ignored, ...clean } = spec;
  const compiled = vl.compile({ ...clean, width: clean.width === 'container' ? 640 : clean.width, config }).spec;
  vega.formatLocale(LOCALES[locale] ?? LOCALES.en);
  vega.timeFormatLocale(TIME[locale] ?? TIME.en);
  const loader = vega.loader({ baseURL: baseDir + path.sep, mode: 'file' });
  const view = new vega.View(vega.parse(compiled), { renderer: 'none', loader });
  return view.toSVG();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('usage: node render.mjs <spec.vl.json> [--dark] [--locale en|es|ca]'); process.exit(1); }
  const locale = args.includes('--locale') ? args[args.indexOf('--locale') + 1] : 'en';
  const spec = JSON.parse(fs.readFileSync(file, 'utf8'));
  process.stdout.write(await renderChart(spec, { dark: args.includes('--dark'), locale, baseDir: path.dirname(path.resolve(file)) }));
}

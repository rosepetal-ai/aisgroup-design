// The seven technical sheets in pieces/datasheets/<key>/<key>.es.html are the source: they are edited by hand.
// datasheets/data.json is an extraction of them, pinned with the registry (npm run mcp:pin re-extracts and re-pins),
// so the MCP's bindings (mcp/print.mjs) start from exactly what each sheet prints.
// Fails on any structure the binder can't address (a missing or doubled heading, table or picture).
const unesc = (s) => s.replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&amp;', '&');
// Fields that shape the page rather than carry copy; the MCP never lets a client change them.
export const LAYOUT = ['cover_fx', 'cover_fy', 'technical_fx', 'technical_fy', 'technical_fit', 'technical_half', 'technical_wide',
  'screen_height', 'fy', 'screen_fit', 'software_layout'];

function one(text, re, what) {
  const m = [...text.matchAll(re)];
  if (m.length !== 1) throw Error(`${what}: expected one match, found ${m.length}`);
  return m[0];
}
const text = (s, what) => { if (/<[^>]+>/.test(s)) throw Error(`${what}: markup inside bound text`); return unesc(s); };
const rows = (page, sub, what) => {
  const body = one(page, new RegExp(`<h3 class="editorial-heading"[^>]*>${sub}</h3><table class="table"><tbody>(.*?)</tbody></table>`, 'gs'), what)[1];
  const out = [...body.matchAll(/<tr><th scope="row">([^<]*)<\/th><td>([^<]*)<\/td><\/tr>/g)].map((m) => [text(m[1], what), text(m[2], what)]);
  if (!out.length || out.map((r) => r.join('')).join('').length !== unesc(body.replace(/<[^>]+>/g, '')).length) throw Error(`${what}: rows other than <tr><th scope="row">…</th><td>…</td></tr>`);
  return out;
};
const style = (s, v) => s.match(new RegExp(`--${v}:([^;]+)`))?.[1];
const FIGURE = /(<div class="split( wide)? block[^"]*">)?<figure class="([^"]*)" style="([^"]*)"><div class="frame"><img src="assets\/([^"]+)" alt="([^"]*)"><\/div><figcaption>([^<]*)<\/figcaption><\/figure>/g;

export function extract(html, key) {
  const p = [...html.matchAll(/<section class="page\b.*?<\/section>/gs)].map((m) => m[0]);
  if (p.length !== 4) throw Error(`${key}: expected four pages`);
  const d = {};
  d.name = text(one(p[0], /<h1>([^<]*)<\/h1>/g, `${key} name`)[1]);
  d.cover_headline = text(one(p[0], /<\/h1>\s*<p>([^<]*)<\/p>/g, `${key} cover summary`)[1]);
  const hero = one(p[0], /<figure class="hero" style="([^"]*)"><img ([^>]*)>/g, `${key} cover image`);
  d.cover_image = one(hero[2], /src="assets\/([^"]+)"/g, `${key} cover src`)[1];
  d.cover_alt = text(one(hero[2], /alt="([^"]*)"/g, `${key} cover alt`)[1]);
  d.inspection_title = text(one(p[1], /<h2>([^<]*)<\/h2>/g, `${key} inspection title`)[1]);
  d.inspection_lead = text(one(p[1], /<p class="lead">([^<]*)<\/p>/g, `${key} inspection lead`)[1]);
  d.lead = text(one(p[2], /<p class="lead">([^<]*)<\/p>/g, `${key} p3 lead`)[1]);
  d.fields = rows(p[2], 'Equipo', `${key} fields`);
  d.installation = rows(p[2], 'Instalación y manejo', `${key} installation`);
  const t = one(p[2], FIGURE, `${key} technical picture`);
  [d.technical_image, d.technical_alt, d.technical_caption] = [t[5], text(t[6]), text(t[7])];
  d.software_title = text(one(p[3], /<main class="page-content">\s*<h2>([^<]*)<\/h2>/g, `${key} software title`)[1]);
  d.software_lead = text(one(p[3], /<p class="lead">([^<]*)<\/p>/g, `${key} software lead`)[1]);
  const screens = [...p[3].matchAll(FIGURE)];
  if (screens.length > 1) throw Error(`${key}: more than one picture on page 4`);
  const s = screens[0];
  if (s) [d.screen, d.screen_alt, d.caption] = [s[5], text(s[6]), text(s[7])];
  else d.screen = null; // no software view: the page carries the text only (mcp/print.mjs noSlot)
  d.software = rows(p[3], 'Software', `${key} software`);
  d.options = text(one(p[3], /<h3 class="editorial-heading"[^>]*>Opciones de integración<\/h3><p>([^<]*)<\/p>/g, `${key} options`)[1]);
  // Layout, as printed (pinned, never client-editable).
  Object.assign(d, { cover_fx: style(hero[1], 'fx'), cover_fy: style(hero[1], 'fy') });
  if (t[1]) Object.assign(d, { technical_half: Number(style(t[4], 'h').replace('mm', '')), technical_wide: t[2] ? true : undefined });
  Object.assign(d, { technical_fx: style(t[4], 'fx'), technical_fy: style(t[4], 'fy'), technical_fit: t[3].includes('cutout') ? 'contain' : undefined });
  if (s) Object.assign(d, { screen_height: Number(style(s[4], 'h')?.replace('mm', '')), fy: style(s[4], 'fy'),
    screen_fit: s[3].includes('cutout') ? 'contain' : undefined, software_layout: s[1] ? 'evidence-and-options' : undefined });
  for (const k of Object.keys(d)) if (d[k] === undefined || Number.isNaN(d[k])) delete d[k];
  return d;
}

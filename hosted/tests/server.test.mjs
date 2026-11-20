// The hosted server over real HTTP with the official client: every tool, bounded answers, auth, limits, and token
// values checked against ais-tokens.json and the guide's own ais-tokens.css.
//   npm run hosted:build && npm run hosted:test
import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { start } from '../server.mjs';
import { LIMITS, SITE, uncommented } from '../tools.mjs';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '../data');
const TOKENS = JSON.parse(fs.readFileSync(path.join(DATA, 'downloads/ais-tokens.json'), 'utf8'));
const tok = (s) => Math.ceil(s.length / 4); // same estimate as scripts/token-budget.mjs
let server, client;

const connect = async (url, headers) => {
  const c = new Client({ name: 'hosted-test', version: '1.0.0' });
  await c.connect(new StreamableHTTPClientTransport(new URL(url + '/mcp'), { requestInit: { headers } }));
  return c;
};
const call = async (name, args = {}, c = client) => {
  const route = { design_tokens: ['design_standards', 'tokens'], design_guidelines: ['design_standards', 'guidelines'], brand_rules: ['design_standards', 'rules'], design_components: ['design_code', 'components'] }[name];
  const r = await c.callTool({ name: route?.[0] ?? name, arguments: route ? { kind: route[1], ...args } : args });
  const text = r.content[0].text;
  assert(Buffer.byteLength(text) <= LIMITS.responseBytes, `${name} answer over budget`);
  return { error: r.isError, value: r.isError ? text : JSON.parse(text) };
};

before(async () => {
  assert(fs.existsSync(path.join(DATA, 'catalogue.json')), 'No snapshot: run npm run hosted:build first.');
  server = await start({ port: 0, host: '127.0.0.1', ratePerMinute: 1000 });
  client = await connect(server.url);
});
after(async () => { await client?.close(); await server?.close(); });

test('always-loaded cost stays under 700 tokens and every tool is read-only', async (t) => {
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((t) => t.name).sort(), ['design_assets', 'design_code', 'design_examples', 'design_standards']);
  const cost = tok(client.getInstructions()) + tools.reduce((n, t) => n + tok(JSON.stringify(t)), 0);
  t.diagnostic(`instructions + schemas: ~${cost} tokens`);
  assert(cost <= 700, `~${cost} tokens`);
  for (const tool of tools) assert.equal(tool.annotations.readOnlyHint, true, tool.name);
});

test('design_guidelines lists, searches and reads every page in bounded chunks', async () => {
  const { value: toc } = await call('design_guidelines');
  assert.equal(toc.sections.length, 26);
  assert(!toc.sections.some(s => s.section === 'writing'));
  const { value: found } = await call('design_guidelines', { query: 'favicon' });
  assert(found.hits.length && found.hits.length <= LIMITS.hits);
  assert(found.hits.some((h) => h.page === 'logos'), 'favicon rules live on the logos page');
  const { value: scoped } = await call('design_guidelines', { query: 'contrast', section: 'design-language' });
  assert(scoped.hits.every((h) => h.section === 'design-language'));
  for (const s of toc.sections) for (const page of s.pages) {
    let offset = 0, text = '';
    for (;;) {
      const { error, value } = await call('design_guidelines', { section: s.section, page, offset });
      assert(!error, `${s.section}/${page}`);
      assert(value.text.length <= LIMITS.chunkChars);
      text += value.text;
      if (value.next === null) break;
      offset = value.next;
    }
    assert(text.length > 100, `${s.section}/${page} is empty`);
  }
  assert((await call('design_guidelines', { section: 'web-design', page: 'nope' })).error);
  assert((await call('design_guidelines', { offset: -1 })).error, 'strict validation');
});

test('design_tokens values match ais-tokens.json and ais-tokens.css', async () => {
  const hex = (v) => typeof v === 'string' ? v : '#' + v.components.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  const { value: js } = await call('design_tokens', { format: 'js' });
  const flat = JSON.parse(js.text.slice(js.text.indexOf('{'), js.text.lastIndexOf('}') + 1));
  const blues = Object.entries(TOKENS.color.blue).filter(([k]) => !k.startsWith('$'));
  for (const [step, t] of blues) assert.equal(flat[`color.blue.${step}`], hex(t.$value), `blue ${step}`);
  for (const [step, t] of Object.entries(TOKENS.space)) assert.equal(flat[`space.${step}`], `${t.$value.value}${t.$value.unit}`);
  assert.equal(flat['color.primary'], flat['color.blue.700'], 'alias resolved');

  const { value: dtcg } = await call('design_tokens', { format: 'dtcg', group: 'colour' });
  assert.deepEqual(JSON.parse(dtcg.text).color, TOKENS.color);

  // Every colour, size and duration both files define must agree.
  const vars = (s) => Object.fromEntries([...s.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  const css = vars((await call('design_tokens', { format: 'css' })).value.text);
  const guide = vars(fs.readFileSync(path.join(DATA, 'downloads/ais-tokens.css'), 'utf8'));
  // brand.css writes the product scale leading in px; the tokens hold it as a ratio of the size.
  const simple = Object.keys(guide).filter((k) => k in css && !k.endsWith('-leading') && /^(#[0-9A-F]{6}|-?[\d.]+(px|ms|em)|var\(--[a-z0-9-]+\))$/i.test(guide[k]));
  assert(simple.length > 100, `only ${simple.length} shared values`);
  for (const k of simple) assert.equal(css[k].toLowerCase(), guide[k].toLowerCase(), k);

  // Tailwind is theme.css (@aisgroup/design's styles.css) without its comments, every rule and value as in the file.
  const { value: tw } = await call('design_tokens', { format: 'tailwind' });
  assert.equal(tw.text, uncommented(fs.readFileSync(path.join(DATA, 'downloads/ais-theme.css'), 'utf8')));
  // Corners as the package sets them (the package is the reference for its components).
  const pkg = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../packages/design/styles.css'), 'utf8');
  for (const v of ['--radius', '--radius-modal']) {
    const want = pkg.match(new RegExp(`\\s${v}:\\s*([^;]+);`))?.[1];
    assert(want, `${v} missing from the package`);
    assert(tw.text.includes(`${v}: ${want};`), `${v} differs from the package (${want})`);
  }
  assert.match(tw.text, /--color-primary: var\(--primary\)/);
  for (const format of ['css', 'tailwind', 'js', 'dtcg']) assert(!(await call('design_tokens', { format })).error, format);
});

test('design_assets pages through the catalogue with rules and working download URLs', async () => {
  const ids = [];
  let offset = 0, total;
  do {
    const { value } = await call('design_assets', { offset });
    assert(value.assets.length <= LIMITS.assets);
    for (const a of value.assets) assert(value.rules[a.kind], `rule for ${a.kind}`);
    ids.push(...value.assets.map((a) => a.id));
    total = value.total;
    offset = value.next;
  } while (offset !== null);
  assert.equal(ids.length, total);
  assert.equal(new Set(ids).size, total, 'ids are unique');
  for (const kind of ['logo', 'app-mark', 'app-icon', 'favicon', 'pattern', 'icon', 'chart', 'web', 'font', 'photo', 'video', 'poster', 'code', 'tokens']) {
    const { value } = await call('design_assets', { kind });
    assert(value.total > 0, kind);
    const res = await fetch(value.assets[0].url, { method: 'HEAD' });
    assert.equal(res.status, 200, value.assets[0].url);
  }
  const { value: logo } = await call('design_assets', { query: 'rosepetal white' });
  assert.equal(logo.assets[0].id, 'rosepetal-white');
  const svg = await fetch(logo.assets[0].url);
  assert.equal(svg.headers.get('content-type'), 'image/svg+xml');
  assert.match(svg.headers.get('content-security-policy'), /sandbox/);
  assert.match(await svg.text(), /<svg/);
});

test('stock answers retain source-only licensing and film downloads have the right media type', async () => {
  const { error, value } = await call('design_assets', { kind: 'stock' });
  assert(!error);
  assert.equal(value.total, 7);
  for (const a of value.assets) {
    assert(a.sourceOnly && a.author && a.rights.licenceUrl);
    assert.equal(a.url, a.source);
    assert(!a.url.startsWith(server.url));
  }
  const { value: films } = await call('design_assets', { kind: 'video' });
  assert.equal(films.total, 4);
  const response = await fetch(films.assets[0].url, { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'video/mp4');
});

test('design_assets lists the library photos by product and words, each file as the library has it', async () => {
  const library = JSON.parse(fs.readFileSync(path.join(DATA, 'library/library.json'), 'utf8')).entries.filter((e) => e.kind === 'photo' && e.origin !== 'unknown'); // origin never recorded: not published
  const files = library.flatMap((e) => e.variants.map((v) => v.file));
  const ids = [];
  for (let offset = 0; offset !== null;) {
    const { value } = await call('design_assets', { kind: 'photo', offset });
    assert.equal(value.rules.photo.length > 50, true);
    ids.push(...value.assets.map((a) => a.id));
    offset = value.next;
  }
  assert.deepEqual(ids.sort(), files.map((f) => path.basename(f, path.extname(f))).sort(), 'one asset per library photo file');
  const { value: cables } = await call('design_assets', { kind: 'photo', query: 'cables' });
  assert.deepEqual(cables.assets.map((a) => a.id).sort(), ['rev360-cables_camera-mounts', 'rev360-cables_factory-floor']);
  assert.match(cables.assets[0].use, /AIS REV 360 Cables.*\d+ × \d+ px/);
  const res = await fetch(cables.assets[0].url);
  assert.equal(res.headers.get('content-type'), 'image/jpeg');
  assert(Buffer.from(await res.arrayBuffer()).equals(fs.readFileSync(path.join(DATA, new URL(cables.assets[0].url).pathname.slice('/files/'.length)))));
  const { value: renders } = await call('design_assets', { kind: 'photo', query: 'compact render' });
  assert(renders.total > 0 && renders.assets.every((a) => /never called a render/.test(a.use)));
});

test('brand_rules gives the essentials and one section per language', async () => {
  for (const lang of ['en', 'es', 'ca']) {
    const { value } = await call('brand_rules', { lang });
    assert(value.sections.length > 10 && value.text.includes('#17356E'), lang);
  }
  const { value: es } = await call('brand_rules', { lang: 'es', section: 'logos' });
  assert.match(es.text, /^## Logotipos/, 'English section names work in every language');
  assert((await call('brand_rules', { section: 'nope' })).error);
  assert((await call('brand_rules', { lang: 'de' })).error);
});

test('files stay inside the snapshot; health is open', async () => {
  for (const p of ['/files/../server.mjs', '/files/%2e%2e/server.mjs', '/files/%2e%2e%2ftools.mjs', '/files/nope.svg', '/other']) assert.equal((await fetch(server.url + p)).status, 404, p);
  const health = await (await fetch(server.url + '/health')).json();
  assert.equal(health.ok, true);
});

test('bearer token: off when unset, required when set', async () => {
  const s = await start({ port: 0, host: '127.0.0.1', token: 'test-token' });
  try {
    assert.equal((await fetch(s.url + '/health')).status, 200);
    assert.equal((await fetch(s.url + '/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })).status, 401);
    assert.equal((await fetch(s.url + '/files/logos/rosepetal-blue.svg')).status, 401);
    assert.equal((await fetch(s.url + '/files/logos/rosepetal-blue.svg', { headers: { authorization: 'Bearer wrong' } })).status, 401);
    await assert.rejects(connect(s.url, { authorization: 'Bearer wrong' }));
    const c = await connect(s.url, { authorization: 'Bearer test-token' });
    assert.equal((await call('brand_rules', {}, c)).error, undefined);
    await c.close();
  } finally { await s.close(); }
});

test('limits: body size, browser origins and rate', async () => {
  const post = (url, body, headers = {}) => fetch(url + '/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...headers }, body });
  assert.equal((await post(server.url, JSON.stringify({ pad: 'x'.repeat(70 * 1024) }))).status, 413);
  assert.equal((await post(server.url, '{}', { origin: 'https://evil.example' })).status, 403);
  const s = await start({ port: 0, host: '127.0.0.1', ratePerMinute: 3 });
  try {
    const codes = [];
    for (let i = 0; i < 4; i++) codes.push((await fetch(s.url + '/files/logos/rosepetal-blue.svg')).status);
    assert.deepEqual(codes, [200, 200, 200, 429]);
  } finally { await s.close(); }
});

test('design_components lists the registry and returns a component with its source', async () => {
  const { value: list } = await call('design_components', {});
  assert(list.items.some((i) => i.name === 'button') && list.items.some((i) => i.name === 'top-bar'));
  const { value: dialog } = await call('design_components', { name: 'dialog' });
  // The item's files are read as one source, in chunks: each file under a // path line.
  let source = dialog.text;
  for (let offset = dialog.next; offset !== null;) { const { value } = await call('design_components', { name: 'dialog', offset }); source += value.text; offset = value.next; }
  const footer = source.split('// components/ui/dialog/DialogFooter.vue\n')[1]?.split('\n\n// ')[0];
  assert(dialog.files.includes('components/ui/dialog/DialogFooter.vue') && footer?.includes('<template>'));
  assert(dialog.registryDependencies.some((d) => d.endsWith('/r/button.json')));
  assert.match(dialog.install, /^npx shadcn-vue@latest add .*\/r\/dialog\.json$/);
  assert((await call('design_components', { name: 'nope' })).error);
});


test('design_examples filters the marketing kit and reads each page and stylesheet in full', async () => {
  const index = JSON.parse(fs.readFileSync(path.join(DATA, 'examples/index.json'), 'utf8'));
  const all = [];
  let offset = 0;
  do {
    const { value } = await call('design_examples', { offset });
    assert(value.examples.length <= LIMITS.examples);
    all.push(...value.examples);
    offset = value.next;
  } while (offset !== null);
  assert.deepEqual(all.map((e) => e.id), index.map((e) => e.id));
  for (const e of all) {
    assert(e.url.startsWith(`${SITE}/examples/${e.type}/`) && e.url.endsWith('/'), e.url);
    if (e.pdf) assert(e.pdf.startsWith(e.url) && e.pdf.endsWith('.pdf'), e.pdf);
    assert(e.why && !/\bCAD\b|\brender|\b3D\b| · /i.test(e.why + e.title), e.id);
  }
  const { value: decks } = await call('design_examples', { type: 'presentation' });
  assert(decks.total > 0 && decks.examples.every((e) => e.type === 'presentation'));
  const { value: rp } = await call('design_examples', { brand: 'Rosepetal' });
  assert(rp.total > 0 && rp.examples.every((e) => e.brand === 'rosepetal'));
  const { value: hopper } = await call('design_examples', { product: 'ais hopper' });
  assert.deepEqual(hopper.examples.map((e) => e.type).sort(), ['brochure', 'datasheet']);
  assert((await call('design_examples', { query: 'vial label' })).value.examples.some((e) => e.id === 'brochure-rev360-pharma'));

  // Every page reads back byte for byte, and so does each stylesheet it links.
  const css = new Set();
  for (const e of index) {
    let at = 0, text = '';
    for (;;) {
      const { error, value } = await call('design_examples', { id: e.id, offset: at });
      assert(!error, e.id);
      if (at === 0) { assert.equal(value.url, SITE + e.html); (value.stylesheets ?? []).forEach((s) => css.add(s)); }
      text += value.text;
      if (value.next === null) break;
      at = value.next;
    }
    assert.equal(text, fs.readFileSync(path.join(DATA, e.html.replace(/^\//, ''), 'index.html'), 'utf8'), e.id);
  }
  assert(css.size > 0);
  for (const file of css) {
    const { error, value } = await call('design_examples', { id: file });
    assert(!error && value.text.length > 100, file);
  }
  assert((await call('design_examples', { id: 'nope' })).error);
  assert((await call('design_examples', { id: '../server.mjs' })).error);
  assert((await call('design_examples', { id: 'shared/../../tools.css' })).error);
});

// Installed clients can keep their old resource route while the live tree owns it once.
test('legacy writing and downloads routes resolve to their current skill owner', async () => {
  const writing = await call('design_guidelines', {section: 'writing'});
  assert.equal(writing.error, undefined);
  assert.equal(writing.value.section, 'communications');
  const downloads = await call('design_guidelines', {section: 'brand-guidelines', page: 'downloads'});
  assert.equal(downloads.error, undefined);
  assert.equal(downloads.value.section, 'resources-assets');
});

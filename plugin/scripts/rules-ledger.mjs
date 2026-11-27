// Conservative rule census: retain prose, list/table constraints and examples rather than guess which is disposable.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { conflicts } from './ledger-conflicts.mjs';
import { INVENTORY } from '../../scripts/skills-tree.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const LEDGER = path.join(ROOT, 'plugin/evals/rules-ledger.json');
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
export const normal = text => text.normalize('NFC').replace(/^\s*(?:[-*]\s+|\d+\.\s+)/, '').replace(/\s+/g, ' ').trim();
const list = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { recursive: true }).map(f => path.join(dir, f)).filter(f => fs.statSync(f).isFile()) : [];
const pageOwner = Object.fromEntries(INVENTORY.flatMap(s => s.pages.map(p => [p, s.name])));
pageOwner.video = 'brand-video';
export function owningSkill(file, text) {
  if (file.startsWith('plugin/skills/')) {
    const [, , skill, , name] = file.split('/');
    if (skill === '_shared') return 'ais-brand-guidelines';
    if (skill === 'writing') return 'communications';
    return pageOwner[path.basename(name ?? '', '.md')] ?? skill;
  }
  if (/guide\/src\/content/.test(file)) return pageOwner[path.basename(file, '.mdx')] ?? 'ais-brand-guidelines';
  if (/print\//.test(file)) return 'brochure';
  if (/decks\//.test(file)) return 'presentation';
  if (/copy.mjs|text-check/.test(file)) return 'communications';
  if (/brand-check/.test(file)) return 'brand-review';
  if (/brand\.md$|essentials/.test(file)) return 'ais-brand-guidelines';
  if (/\b(?:post|carousel|stock)\b/i.test(text)) return 'marketing';
  if (/\b(?:deck|slide|presentation)\b/i.test(text)) return 'presentation';
  if (/\b(?:brochure|catalogue|datasheet|print|cover|ppi)\b/i.test(text)) return 'brochure';
  if (/\b(?:product UI|shadcn|dataset|Rosepetal app|tool screens)\b/i.test(text)) return 'product-ui';
  if (/\b(?:quote|quotation|copy|contraction|caption|headline|CTA|separator|thousands)\b/i.test(text)) return 'communications';
  if (/\b(?:photo|picture|render|imagery|CAD|glb)\b/i.test(text)) return 'render-review';
  if (/\b(?:mascot|illustration|hexagon|pattern|gradient|glow|colour|font|type|spacing|motion)\b/i.test(text)) return 'design-language';
  if (/\b(?:site|web|nav|footer)\b/i.test(text)) return 'web-design';
  return 'ais-brand-guidelines';
}

export function buildLedger() {
  if (fs.existsSync(LEDGER)) throw new Error('The pre-restructure ledger already exists. Preserve it; additions require an explicit append review, never overwrite the baseline.');
  const docs = [
    ...list(path.join(ROOT, 'plugin/skills')).filter(f => f.endsWith('.md')),
    ...list(path.join(ROOT, 'plugin/brand')).filter(f => /\.(?:md|txt)$/.test(f) && !/OFL-|LICENSE/.test(f)),
    ...list(path.join(ROOT, 'guide/src/content/guide/en')).filter(f => f.endsWith('.mdx')),
    path.join(ROOT, 'guide/src/essentials.ts'),
    ...['en', 'es', 'ca'].map(lang => path.join(ROOT, `guide/dist/${lang}/brand.md`)).filter(f => fs.existsSync(f))
  ];
  const checks = ['plugin/print/render.mjs', 'plugin/print/image-rules.mjs', 'plugin/engine/copy.mjs', 'plugin/engine/text-check.mjs', 'plugin/decks/verify.mjs', 'plugin/decks/alignment.mjs', 'plugin/brand/downloads/qa/brand-check.js', 'guide/public/downloads/qa/brand-check.js'].map(f => path.join(ROOT, f));
  const entries = new Map(), sources = [], enforcements = [];
  for (const file of [...new Set([...docs, ...checks])]) {
    if (!fs.existsSync(file)) throw new Error(`Required ledger source missing: ${file}`);
    const rel = path.relative(ROOT, file), body = fs.readFileSync(file, 'utf8'), code = checks.includes(file), lines = body.split('\n');
    sources.push({ file: rel, sha256: hash(body), lines: lines.length, kind: code ? 'code' : rel.startsWith('plugin/skills/') ? 'skills' : rel.startsWith('plugin/brand/') ? 'plugin-brand' : rel.startsWith('guide/src/content/') ? 'guide-pages' : 'agent-rules' });
    let frontmatter = false;
    lines.forEach((raw, index) => {
      const text = raw.trim();
      if (!text || /^(?:#{1,6}\s|```|---$|import\s|export\s)/.test(text)) return;
      if (code && !/(?:if\s*\(|throw\b|\.push\(|\b(?:fail|check|assert|error|warn|issue)\w*\s*\(|const\s+[A-Z_]+\s*=)/i.test(text)) return;
      if (!code && /^(?:title:|name:|description:|metadata:|license:|compatibility:|rules:|<\/?[A-Z][^>]*\/?>(?:\s*)$)/.test(text)) return;
      // Preserve frontmatter strings as written. The ledger is evidence, not a lossy paraphrase.
      const rule = normal(text), key = rule, id = 'AIS-' + hash(key).slice(0, 12);
      const occurrence = { file: rel, line: index + 1, text: raw };
      if (!entries.has(key)) entries.set(key, { id, rule, source: `${rel}:${index + 1}`, sources: [], ownerSkill: owningSkill(rel, rule), owner: null, enforcedBy: [] });
      entries.get(key).sources.push(occurrence);
      if (code) {
        const eid = 'CHECK-' + hash(rel + rule).slice(0, 12);
        enforcements.push({ id: eid, file: rel, line: index + 1, anchor: raw.trim(), rule: id });
        entries.get(key).enforcedBy.push(eid);
      }
    });
  }
  const rules = [...entries.values()];
  // Associate prose requirements with actual existing code anchors, without claiming every rule is automated.
  const families = [
    [/\bppi|240|cover photo|video frame/i, /PRINT_COVER_PPI|isVideoFrame|ppi/],
    [/family frame|contact band|34 pt|white title/i, /family|bandGap|off the family frame/],
    [/repeat.*(?:image|picture)|(?:image|picture).*twice/i, /seen\.has\(i.src\)/],
    [/empty.*25 mm|25 mm.*empty|dead band/i, /p.dead > 25|p.gaps/],
    [/thousands|separator|contraction|quotation|quote marks/i, /thousands|separator|contraction|quote/i],
    [/align|marker|first line/i, /align|marker|firstLine/i]
  ];
  for (const entry of rules) for (const [prose, code] of families) if (prose.test(entry.rule)) entry.enforcedBy.push(...enforcements.filter(e => code.test(e.anchor)).map(e => e.id));
  for (const entry of rules) entry.enforcedBy = [...new Set(entry.enforcedBy)];
  const counters = {};
  for (const entry of rules) {
    const n = counters[entry.ownerSkill] = (counters[entry.ownerSkill] ?? 0) + 1;
    entry.owner = `skills/${entry.ownerSkill}/references/retained-rules-${String(Math.ceil(n / 100)).padStart(2, '0')}.md`;
  }
  const ledger = { version: 1, capturedAt: new Date().toISOString(), method: 'Conservative source-line rule units, including examples/context that may carry constraints. Exact duplicate units share one record and all source locations. This proves text retention, not semantic equivalence or conflict resolution.', sources, rules, enforcements, conflicts: conflicts(rules), duplicates: rules.filter(r => r.sources.length > 1).map(r => ({ id: r.id, occurrences: r.sources.length, resolution: 'One canonical retained-rule owner; source locations retained as evidence.' })) };
  fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n');
  return ledger;
}

export function liveRuleText(rule, ledger) {
  if (!rule.archiveOnly) return rule.rule.replace(/(?<!ais-)\bbrand-guidelines\b/g, 'ais-brand-guidelines');
  const current = ledger.rules.find(candidate => candidate.id === rule.supersededBy);
  if (!current) throw new Error(`Missing retirement destination for ${rule.id}`);
  const relative = path.posix.relative(path.posix.dirname(rule.owner), current.owner);
  return `Rule [${current.id}](${relative}#${current.id.toLowerCase()}).`;
}

export function retainRules(pluginRoot, ledger) {
  const canonical = new Map();
  for (const rule of ledger.rules) {
    const intro = rule.owner.endsWith('/writing-essentials.md')
      ? ['# Writing essentials', '', 'Apply these rules to the reply as well as the artifact. Before returning, check every prose quotation, including quoted UI labels, source-section names and proposed placeholder wording. Use «» there; preserve code syntax and literal JSON or file values. A source citation does not turn an explanatory prose quotation into code.', '']
      : ['# Retained source rules', '', 'Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.', ''];
    const lines = canonical.get(rule.owner) ?? intro;
    lines.push(`## ${rule.id}`, '', ...(rule.supersededBy ? [`Historical wording: explicitly superseded by ${rule.supersededBy}. ${rule.supersededNote ?? "Preserve as evidence; apply the current rule."}`, ''] : []), `<!-- ${rule.id} -->`, liveRuleText(rule, ledger), '', rule.archiveOnly ? 'Exact historical source wording is preserved in evals/rules-ledger.json.' : `Source: ${rule.source}.`, ''); canonical.set(rule.owner, lines);
  }
  for (const [relative, lines] of canonical) {
    const file = path.join(pluginRoot, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, lines.join('\n'));
  }
  const byText = new Map(ledger.rules.map(r => [normal(r.rule), r]));
  for (const file of list(path.join(pluginRoot, 'skills')).filter(f => f.endsWith('.md') && !canonical.has(path.relative(pluginRoot, f)))) {
    const before = fs.readFileSync(file, 'utf8'), rel = path.relative(pluginRoot, file);
    const after = before.split('\n').map(line => {
      const entry = byText.get(normal(line));
      if (!entry) return line;
      // Source rules remain verbatim once; every other occurrence becomes an explicit pointer.
      const target = path.relative(path.dirname(file), path.join(pluginRoot, entry.owner));
      const label = entry.rule.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[<>`*_\[\]]/g, '').slice(0, 90);
      return `Rule [${entry.id}: ${label}](${target}#${entry.id.toLowerCase()}).`;
    }).join('\n');
    if (after !== before) fs.writeFileSync(file, after);
  }
  for (const skill of INVENTORY) {
    const files = [...canonical.keys()].filter(f => f.startsWith(`skills/${skill.name}/`));
    const at = path.join(pluginRoot, 'skills', skill.name, 'SKILL.md');
    if (!files.length || !fs.existsSync(at)) continue;
    const body = fs.readFileSync(at, 'utf8');
    const missing = files.filter(f => !body.includes(`](references/${path.basename(f)})`));
    if (!missing.length) continue;
    const routes = missing.map(f => `- [Retained ${path.basename(f, '.md').replace('retained-', '').replace('-', ' ')}](references/${path.basename(f)})`).join('\n');
    fs.appendFileSync(at, (body.includes('Source rules, loaded only when needed:') ? '\n' : '\nSource rules, loaded only when needed:\n\n') + routes + '\n');
  }
  if (ledger.commonWritingRules?.length) for (const skill of INVENTORY) {
    const at = path.join(pluginRoot, 'skills', skill.name, 'SKILL.md');
    if (!fs.existsSync(at)) continue;
    const relative = path.relative(path.dirname(at), path.join(pluginRoot, 'skills/communications/references/writing-essentials.md'));
    const body = fs.readFileSync(at, 'utf8');
    const intro = `Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](${relative}) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.\n\n`;
    if (body.includes(intro)) continue;
    const clean = body.replace(/^(?:Before writing copy or an explanation,|Apply the \[writing essentials:)[^\n]+\n\n/m, '');
    fs.writeFileSync(at, clean.replace(/(^# [^\n]+\n\n)/m, `$1${intro}`));
  }
}

export function checkLedger(pluginRoot, ledger, { enforce = true } = {}) {
  const errors = [], files = list(path.join(pluginRoot, 'skills')).filter(f => f.endsWith('.md'));
  const texts = new Map(files.map(f => [path.relative(pluginRoot, f), fs.readFileSync(f, 'utf8')]));
  let lost = 0;
  for (const rule of ledger.rules) {
    const content = texts.get(rule.owner);
    if (rule.archiveOnly && rule.id !== 'AIS-' + hash(rule.rule).slice(0, 12)) { errors.push(`${rule.id}: archived source wording changed`); lost++; }
    if (!content || !content.includes(`<!-- ${rule.id} -->\n${liveRuleText(rule, ledger)}\n`)) { errors.push(`${rule.id}: missing owner text ${rule.owner}`); lost++; }
    const owners = [...texts].filter(([file, text]) => file !== rule.owner && text.includes(`<!-- ${rule.id} -->\n`));
    if (owners.length) errors.push(`${rule.id}: duplicate canonical owners`);
  }
  if (enforce) for (const check of ledger.enforcements) {
    const file = path.join(ROOT, check.file);
    if (!fs.existsSync(file) || !fs.readFileSync(file, 'utf8').includes(check.anchor)) errors.push(`${check.id}: code check disappeared at ${check.file}:${check.line}`);
  }
  if (enforce) for (const file of ledger.codeFiles ?? []) {
    if (hash(fs.readFileSync(path.join(ROOT, file.file), 'utf8')) !== file.sha256) errors.push(`${file.file}: enforcement module changed; review its declarative checks before updating the fingerprint`);
  }
  return { rules: ledger.rules.length, lost, errors, enforcementAnchors: ledger.enforcements.length, enforcementFiles: ledger.codeFiles?.length ?? 0 };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const command = process.argv[2];
  if (command === 'capture') { const ledger = buildLedger(); console.log(`${ledger.rules.length} rule units from ${ledger.sources.length} source files; ${ledger.duplicates.length} exact duplicate groups.`); }
  else {
    const pluginRoot = path.resolve(process.argv[3] ?? path.join(ROOT, 'plugin')), ledger = JSON.parse(fs.readFileSync(LEDGER));
    if (command === 'retain') retainRules(pluginRoot, ledger);
    else if (command !== 'check') throw new Error('Use capture | retain <plugin> | check <plugin>');
    const result = checkLedger(pluginRoot, ledger); console.log(JSON.stringify(result)); if (result.errors.length) process.exitCode = 1;
  }
}

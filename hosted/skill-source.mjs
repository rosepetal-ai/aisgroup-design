import fs from 'node:fs';
import path from 'node:path';
// Resolve current skill ownership and exact retained-rule pointers before a
// build extracts usage notes. The published source files remain unchanged.
export function readSkillSource(root, file) {
  const aliasesFile = path.join(root, 'skills/aliases.json');
  const aliases = fs.existsSync(aliasesFile) ? JSON.parse(fs.readFileSync(aliasesFile, 'utf8')) : {};
  if (file.startsWith('skills/')) file = 'skills/' + (aliases[file.slice(7)] ?? file.slice(7));
  const absolute = path.resolve(root, file);
  const text = fs.readFileSync(absolute, 'utf8');
  const pattern = /^Rule \[(AIS-[a-f0-9]+)(?::[^\n]*)?\]\(([^\n)]+)\)\.$/gm;
  const resolve = (id, link, from, seen = new Set()) => {
    if (seen.has(id) || seen.size > 20) throw Error(`Cyclic rule pointer ${id}`);
    seen.add(id);
    const target = path.resolve(path.dirname(from), link.split('#')[0]);
    const allowed = path.resolve(root, 'skills') + path.sep;
    if (!target.startsWith(allowed)) throw Error(`Rule source escapes skill snapshot: ${link}`);
    const body = fs.readFileSync(target, 'utf8'), marker = `<!-- ${id} -->\n`, at = body.indexOf(marker);
    if (at < 0) throw Error(`Missing canonical rule ${id} in ${target}`);
    const line = body.slice(at + marker.length).split('\n')[0];
    const next = /^Rule \[(AIS-[a-f0-9]+)(?::[^\n]*)?\]\(([^\n)]+)\)\.$/.exec(line);
    return next ? resolve(next[1], next[2], target, seen) : line;
  };
  return text.replace(pattern, (_all, id, link) => resolve(id, link, absolute));
}

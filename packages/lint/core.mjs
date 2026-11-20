// The audit and its rule table live once, in the repo's scripts/ (the plugin carries copies of them). A published
// package carries them in core/, laid out as in the repo (scripts/bundle.mjs runs at npm pack); in the repo they are
// read where they are.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const bundled = path.join(HERE, 'core/scripts');
export const SCRIPTS = fs.existsSync(bundled) ? bundled : path.resolve(HERE, '../../scripts');
const load = (name) => import(pathToFileURL(path.join(SCRIPTS, name)).href);

export const { audit } = await load('ui-contract.mjs');
export const { RULES } = await load('ui-rules.mjs');
// The package's registry, as an app installs it (the plugin's mirror of the guide's /r/ items).
export const REGISTRY = path.resolve(SCRIPTS, '../plugin/brand/registry');

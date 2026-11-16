#!/usr/bin/env node
// Plugin entry point for the MCP server. Cheap and silent on stdout (stdout is the MCP channel):
// links the media library the user chose, puts the plugin's Python venv first on PATH, then starts the server.
// Installs nothing: `npm run setup` does that, and studio_status reports what is missing.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VENV, bin } from '../scripts/setup.mjs';
import { MEDIA_HOME } from '../scripts/media.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const media = path.join(ROOT, 'library/media'), chosen = MEDIA_HOME;
// ponytail: a symlink inside the plugin root, recreated each start because the root moves on every plugin update
// The folder exists from the first start: pictures land in it on demand (scripts/media.mjs).
try { fs.mkdirSync(chosen, { recursive: true }); } catch {}
if (chosen && fs.existsSync(chosen) && !(fs.existsSync(media) && !fs.lstatSync(media).isSymbolicLink())) {
  try { fs.rmSync(media, { force: true }); fs.symlinkSync(path.resolve(chosen), media, 'dir'); }
  catch (e) { process.stderr.write(`Could not link the media library (${e.message}); assets will be reported missing.\n`); }
}
// The setup skill runs without the plugin's data folder, so its venv lands in the home cache: look in both.
// $HOME can be a throwaway (a sandboxed run); per-computer installs live in the account's home.
const home = os.userInfo().homedir, scripts = process.platform === 'win32' ? 'Scripts' : 'bin';
const venvBin = [VENV, path.join(home, '.cache/ais-group-design/venv')].map((v) => path.join(v, scripts)).find((d) => fs.existsSync(d));
if (venvBin) { process.env.PATH = venvBin + path.delimiter + process.env.PATH; process.env.AIS_PYTHON = path.join(venvBin, path.basename(bin('python'))); }
// ponytail: Linux and macOS Playwright cache paths only; Windows keeps its own LOCALAPPDATA, which sandboxed runs don't swap.
const browsers = path.join(home, process.platform === 'darwin' ? 'Library/Caches/ms-playwright' : '.cache/ms-playwright');
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && home !== os.homedir() && fs.existsSync(browsers)) process.env.PLAYWRIGHT_BROWSERS_PATH = browsers;
await import('./server.mjs');

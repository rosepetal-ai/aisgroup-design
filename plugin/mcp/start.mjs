#!/usr/bin/env node
// Plugin entry point for the MCP server. Cheap and silent on stdout (stdout is the MCP channel):
// makes sure the server's Node packages are there, links the media library the user chose, puts the plugin's Python
// venv first on PATH, then starts the server. Chromium, Python and the media library stay with `npm run setup`, and
// studio_status reports what is missing.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DATA, useVenv } from '../scripts/setup.mjs';
import { MEDIA_HOME } from '../scripts/media.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Every plugin update unpacks into a new folder without node_modules, so the server could not start until someone ran
// `npm run setup`. The packages now live once per dependency set in the data folder and each new plugin folder links to
// them: an update with the same dependencies starts at once, a new set installs on its first start (seconds).
// In the repo the workspace's own node_modules resolve, and nothing happens.
const serverResolves = () => { try { import.meta.resolve('@modelcontextprotocol/server'); return true; } catch { return false; } };
if (!serverResolves()) {
  const { dependencies } = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const shared = path.join(DATA, 'node', createHash('sha256').update(JSON.stringify(dependencies)).digest('hex').slice(0, 12));
  const modules = path.join(shared, 'node_modules'), local = path.join(ROOT, 'node_modules');
  if (!fs.existsSync(path.join(modules, '@modelcontextprotocol/server/package.json'))) {
    process.stderr.write('Installing the studio\'s Node packages (once for this version)...\n');
    fs.mkdirSync(shared, { recursive: true });
    fs.writeFileSync(path.join(shared, 'package.json'), JSON.stringify({ private: true, dependencies }));
    // npm sits next to the node that runs this, even when that folder is not on PATH.
    const env = { ...process.env, PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH };
    const r = spawnSync('npm', ['install', '--omit=dev', '--no-package-lock', '--no-audit', '--no-fund'], { cwd: shared, env, stdio: ['ignore', 2, 2], shell: process.platform === 'win32' });
    if (r.status !== 0) process.stderr.write(`Could not install the Node packages: run npm run setup in ${ROOT}\n`);
  }
  try { fs.rmSync(local, { recursive: true, force: true }); fs.symlinkSync(modules, local, 'junction'); }
  catch (e) { process.stderr.write(`Could not link the Node packages (${e.message}): run npm run setup in ${ROOT}\n`); }
}
const media = path.join(ROOT, 'library/media'), chosen = MEDIA_HOME;
// ponytail: a symlink inside the plugin root, recreated each start because the root moves on every plugin update
// The folder exists from the first start: pictures land in it on demand (scripts/media.mjs).
try { fs.mkdirSync(chosen, { recursive: true }); } catch {}
if (chosen && fs.existsSync(chosen) && !(fs.existsSync(media) && !fs.lstatSync(media).isSymbolicLink())) {
  try { fs.rmSync(media, { force: true }); fs.symlinkSync(path.resolve(chosen), media, 'dir'); }
  catch (e) { process.stderr.write(`Could not link the media library (${e.message}); assets will be reported missing.\n`); }
}
// $HOME can be a throwaway (a sandboxed run); per-computer installs live in the account's home.
const home = os.userInfo().homedir;
useVenv();
// ponytail: Linux and macOS Playwright cache paths only; Windows keeps its own LOCALAPPDATA, which sandboxed runs don't swap.
const browsers = path.join(home, process.platform === 'darwin' ? 'Library/Caches/ms-playwright' : '.cache/ms-playwright');
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && home !== os.homedir() && fs.existsSync(browsers)) process.env.PLAYWRIGHT_BROWSERS_PATH = browsers;
await import('./server.mjs');

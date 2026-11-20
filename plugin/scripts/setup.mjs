#!/usr/bin/env node
// One-time setup on a new laptop: the plugin's Node packages, the Chromium the renderers use, a Python venv with the generators' packages,
// and a check of the system tools. Safe to run again; it only installs what is missing.
//   npm run setup            install what is missing, then print the checklist
//   npm run setup -- --check only print the checklist (exit 1 if something is missing)
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { MEDIA_HOME } from './media.mjs';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const DATA = process.env.AIS_PLUGIN_DATA || path.join(os.homedir(), '.cache/ais-group-design');
export const VENV = path.join(DATA, 'venv');
const WIN = process.platform === 'win32', MAC = process.platform === 'darwin';
export const bin = (name) => path.join(VENV, WIN ? 'Scripts' : 'bin', WIN ? name + '.exe' : name);
// The plugin's Python (Pillow, python-pptx, PyMuPDF): AIS_PYTHON, the plugin's venv, the account-wide venv the setup skill
// makes, then the system Python. Every generator asks here, so none depends on how it was started.
export function pythonPath() {
  if (process.env.AIS_PYTHON) return process.env.AIS_PYTHON;
  const exe = WIN ? 'Scripts/python.exe' : 'bin/python';
  const found = [VENV, path.join(os.userInfo().homedir, '.cache/ais-group-design/venv')].map((v) => path.join(v, exe)).find((p) => fs.existsSync(p));
  return found || (WIN ? 'python' : 'python3');
}
const has = (cmd, args = ['--version']) => spawnSync(cmd, args, { stdio: 'ignore' }).status === 0;
const run = (cmd, args, opts = {}) => { const r = spawnSync(cmd, args, { stdio: ['ignore', 2, 2], ...opts }); return r.status === 0; };

async function chromium() {
  try { const { chromium: c } = await import('playwright'); return fs.existsSync(c.executablePath()); } catch { return false; }
}
const nodeReady = () => { try { createRequire(path.join(ROOT, 'package.json')).resolve('playwright'); return true; } catch { return false; } };
const pythonReady = () => fs.existsSync(bin('python')) && spawnSync(bin('python'), ['-c', 'import PIL, pptx, fitz, psutil'], { stdio: 'ignore' }).status === 0;

// ponytail: Windows hints name winget; choco install poppler / ffmpeg or the official zip builds (bin folder on PATH) work too
const hint = (linux, mac, win) => WIN ? win : MAC ? mac : linux;

export async function status() {
  const media = path.join(ROOT, 'library/media');
  return [
    { item: 'Node packages', ok: nodeReady(), fix: 'npm run setup' },
    { item: 'Chromium for rendering', ok: await chromium(), fix: 'npm run setup' },
    { item: 'Python packages (Pillow, python-pptx, PyMuPDF, psutil)', ok: pythonReady(), fix: 'npm run setup' },
    { item: 'Poppler: pdftoppm, pdffonts, pdfinfo (PDF previews and checks)', ok: ['pdftoppm', 'pdffonts', 'pdfinfo'].every((t) => has(t, ['-v'])),
      fix: hint('sudo apt install poppler-utils', 'brew install poppler', 'winget install oschwartz10612.Poppler, then open a new terminal') },
    { item: 'ffmpeg (videos only)', ok: has('ffmpeg', ['-version']), fix: hint('sudo apt install ffmpeg', 'brew install ffmpeg', 'winget install Gyan.FFmpeg'), optional: true },
  ];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.argv.includes('--check')) {
    fs.mkdirSync(DATA, { recursive: true });
    // The installed plugin ships no lockfile (it lives in the repo's workspace); its dependencies are pinned exactly.
    if (!nodeReady()) { console.error('Installing the Node packages...'); run('npm', ['install', '--omit=dev', '--no-package-lock', '--no-audit', '--no-fund'], { cwd: ROOT, shell: WIN }); }
    if (!(await chromium())) { console.error('Installing Chromium for rendering (about 150 MB, once)...'); run(process.execPath, [path.join(ROOT, 'node_modules/playwright/cli.js'), 'install', 'chromium']); }
    if (!pythonReady()) {
      const py = ['python3', 'python'].find((p) => has(p));
      if (!py) console.error('Python 3 is missing: install it from python.org, then run npm run setup again.');
      else {
        console.error('Creating the Python environment...');
        if (!fs.existsSync(bin('python'))) run(py, ['-m', 'venv', VENV]);
        run(bin('python'), ['-m', 'pip', 'install', '--quiet', '--upgrade', 'pip']);
        run(bin('python'), ['-m', 'pip', 'install', '--quiet', '-r', path.join(ROOT, 'requirements.txt')]);
      }
    }
    // Pictures are fetched on demand from the media bucket; only the folder and its link are made here.
    // A full offline copy: npm run media:pull.
    const media = path.join(ROOT, 'library/media');
    fs.mkdirSync(MEDIA_HOME, { recursive: true });
    if (!fs.existsSync(media) || fs.lstatSync(media).isSymbolicLink()) { fs.rmSync(media, { force: true }); fs.symlinkSync(MEDIA_HOME, media, 'dir'); }
  }
  const rows = await status();
  for (const r of rows) console.log(`${r.ok ? 'ok     ' : r.optional ? 'later  ' : 'MISSING'} ${r.item}${r.ok ? '' : '  ->  ' + r.fix}`);
  process.exitCode = rows.some((r) => !r.ok && !r.optional) ? 1 : 0;
}

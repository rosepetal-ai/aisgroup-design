#!/usr/bin/env node
// Creates an editable project with its own toolchain. All build writes go to that project.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';

const pluginDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const skill = 'skills/live-animation';
const template = path.join(pluginDir, skill, 'templates/author-project');
const example = skill + '/examples/enclosed-inspection';

const sources = [
  example,
  skill + '/examples/station-kit/ais-vision-systems-blue.svg',
  skill + '/examples/station-kit/hall.ts',
  skill + '/examples/station-kit/series.css',
  skill + '/examples/inspection-station/materials.ts',
  skill + '/templates/explainer/vendor',
  skill + '/scripts/lib.mjs',
  'skills/scene-assembly/models-directory.mjs',
  'scripts/animation-assets.mjs',
  'scripts/animation-assets.json',
  'scripts/scene-model-pack.mjs',
  'mcp/industrial-models.mjs',
  'brand/downloads/overlays/overlay.mjs',
];

function outsidePlugin(destination) {
  // Resolve existing ancestors, including symlinks used by installed plugin managers.
  let parent = destination;
  while (!fs.existsSync(parent)) parent = path.dirname(parent);
  const resolved = path.resolve(fs.realpathSync(parent), path.relative(parent, destination));
  const relative = path.relative(fs.realpathSync(pluginDir), resolved);
  if (!relative || (relative.split(path.sep)[0] !== '..' && !path.isAbsolute(relative))) {
    throw new Error('Choose a project folder outside the installed plugin.');
  }
  return resolved;
}

function prepare(destination, selectedExample) {
  if (fs.existsSync(destination) && (!fs.statSync(destination).isDirectory() || fs.readdirSync(destination).length)) {
    throw new Error('The project folder must be new or empty. Use build to rebuild an existing animation.');
  }
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const staged = fs.mkdtempSync(path.join(path.dirname(destination), '.ais-animation-'));
  try {
    for (const relative of sources) {
      fs.cpSync(path.join(pluginDir, relative), path.join(staged, relative), {
        recursive: true,
        filter: (src) => !['node_modules', 'dist', '.vite'].includes(path.basename(src)),
      });
    }
    if (selectedExample === 'side-rejection') {
      fs.copyFileSync(path.join(staged, example, 'jobs/side-rejection.mjs'), path.join(staged, example, 'job.mjs'));
    }
    for (const file of ['package.json', 'package-lock.json', 'README.md']) {
      fs.copyFileSync(path.join(template, file), path.join(staged, file));
    }
    // Installed plugins may be read-only. Their copies are the author's editable source.
    for (const relative of fs.readdirSync(staged, { recursive: true })) {
      const target = path.join(staged, relative);
      const stat = fs.lstatSync(target);
      if (stat.isSymbolicLink()) throw new Error('Unexpected symlink in the project template: ' + relative);
      fs.chmodSync(target, stat.mode | 0o200);
    }
    // A final exclusive reservation handles concurrent creators and supports empty folders on Windows.
    fs.mkdirSync(destination, { recursive: true });
    const claim = path.join(destination, '.ais-project-creation');
    const fd = fs.openSync(claim, 'wx');
    fs.closeSync(fd);
    const moved = [];
    try {
      if (fs.readdirSync(destination).length !== 1) throw new Error('The target changed during project creation.');
      for (const entry of fs.readdirSync(staged)) {
        fs.renameSync(path.join(staged, entry), path.join(destination, entry));
        moved.push(entry);
      }
    } catch (error) {
      for (const entry of moved.reverse()) fs.renameSync(path.join(destination, entry), path.join(staged, entry));
      throw error;
    } finally {
      fs.unlinkSync(claim);
    }
  } finally {
    fs.rmSync(staged, { recursive: true, force: true });
  }
}

function npm(args, cwd) {
  // npm.cmd is a command script on Windows. Invoke npm's own JS entry with Node there.
  const windows = os.platform() === 'win32';
  const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js');
  const result = spawnSync(windows ? process.execPath : 'npm', windows ? [npmCli, ...args] : args, {
    cwd, stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('npm ' + args[0] + ' failed. The editable project is at ' + cwd);
}

function build(destination) {
  const manifest = JSON.parse(fs.readFileSync(path.join(destination, 'package.json'), 'utf8'));
  if (manifest.name !== 'ais-inspection-animation') throw new Error('Choose a project created by the animation builder.');
  const lock = fs.readFileSync(path.join(destination, 'package-lock.json'));
  const dependencyHash = createHash('sha256').update(lock).update(process.platform + process.arch + process.versions.modules).digest('hex');
  const installed = path.join(destination, 'node_modules/.ais-animation-lock');
  if (!fs.existsSync(installed) || fs.readFileSync(installed, 'utf8') !== dependencyHash) {
    npm(['ci', '--include=dev', '--no-audit', '--no-fund', '--prefer-offline'], destination);
    fs.writeFileSync(installed, dependencyHash);
  }
  npm(['run', 'build'], destination);
  console.log('Animation ready at ' + path.join(destination, 'index.html'));
}

const usage = 'Usage: node scripts/animation-build.mjs create <project> [--example inspection|side-rejection] [--prepare-only]\n       node scripts/animation-build.mjs build <project>';
try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { help: { type: 'boolean', short: 'h' }, example: { type: 'string' }, 'prepare-only': { type: 'boolean' } },
  });
  const [command, target] = positionals;
  if (values.help) {
    console.log(usage);
  } else {
    if (positionals.length !== 2 || !['create', 'build'].includes(command) ||
        (command === 'build' && (values.example || values['prepare-only'])) ||
        (values.example !== undefined && !['inspection', 'side-rejection'].includes(values.example))) throw new Error(usage);
    const [major, minor] = process.versions.node.split('.').map(Number);
    if (major < 22 || (major === 22 && minor < 12)) throw new Error('Use Node.js 22.12 or newer for the animation tools.');
    const destination = outsidePlugin(path.resolve(target));
    if (command === 'create') prepare(destination, values.example);
    if (values['prepare-only']) console.log('Editable scene ready in ' + path.join(destination, example));
    else build(destination);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

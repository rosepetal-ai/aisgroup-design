// The private pack installer atomically activates a complete, immutable version.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export function sceneCacheDir(data = process.env.AIS_PLUGIN_DATA) {
  return path.resolve(data || path.join(os.homedir(), '.cache', 'ais-group-design'), 'scene-models');
}

export function installedSceneModels(cache) {
  // A plugin host can supply its private data directory while the authoring shell uses the normal account cache.
  const candidates = cache === undefined ? new Set([sceneCacheDir(), sceneCacheDir(null)]) : [cache];
  for (const candidate of candidates) {
    try {
      const id = fs.readFileSync(path.join(candidate, 'current'), 'utf8').trim();
      if (!/^[a-f0-9]{64}$/.test(id)) continue;
      const root = path.join(candidate, id);
      if (fs.lstatSync(root).isDirectory()) return root;
    } catch {
      // A new host may have no private version yet.
    }
  }
  return null;
}

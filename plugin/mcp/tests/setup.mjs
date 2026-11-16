// Loaded before every test file (node --import): the tests keep their state under ~/.cache/ais-group-design, which a
// fresh computer or a CI runner doesn't have yet.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

fs.mkdirSync(path.join(os.homedir(), '.cache/ais-group-design'), { recursive: true });

// Internal admission validator; not an MCP tool. No browser launch.
import fs from 'node:fs';
import path from 'node:path';
import { compilePrint, printOutput, verifyPrintDependencies } from './print.mjs';
const dir=path.resolve(process.argv[2]);
try {
 const raw=JSON.parse(fs.readFileSync(path.join(dir,'recipe.json')));
 verifyPrintDependencies(dir);
 const html=compilePrint(raw,dir), actual=fs.readFileSync(printOutput(raw,dir),'utf8');
 if(actual!==html)throw Error('Output differs from typed bindings');
} catch(e){process.stderr.write(e.message);process.exitCode=1;}

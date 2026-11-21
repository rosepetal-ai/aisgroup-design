// node console.mjs <url> : loads the piece and checks for any DEV warnings (reading holds, reject gate, physics rate,
// missing worker captures) or runtime errors. Exits 1 if any warning or error is logged.
import { launchBrowser, prepPage, waitLive } from './lib.mjs';

const url = process.argv[2];
if (!url) { console.error('usage: node console.mjs <url>'); process.exit(2); }
const b = await launchBrowser();
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const issues = await prepPage(p, {
  onLog: (type, text) => {
    if (type !== 'debug') console.log(type, text.slice(0, 400));
  },
});
await waitLive(p, url, 2000);
await b.close();
if (issues.length) {
  console.error(`FAIL: ${issues.length} warning(s)/error(s)`);
  process.exit(1);
}
console.log('PASS: 0 warnings or errors');

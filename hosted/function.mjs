// The MCP as a Firebase function: the guide's hosting sends /mcp here (firebase.json at the repo root), so it lives at
// aisgroup-design.web.app/mcp and is published with the guide. Download links point at the guide's own files,
// so the function carries only the text it answers from (a few MB) and never serves a file.
import { onRequest } from 'firebase-functions/v2/https';
import { createApp } from './server.mjs';

const app = createApp({
  // Every link the tools return (install lines, pages) uses the public origin, never the Cloud Run host behind the rewrite.
  baseUrl: (process.env.AIS_MCP_BASE_URL || 'https://aisgroup-design.web.app').replace(/\/$/, ''),
  filesBase: (process.env.AIS_MCP_FILES_BASE || 'https://aisgroup-design.web.app').replace(/\/$/, ''),
  token: process.env.AIS_MCP_TOKEN || undefined,
  trustProxy: true, // Google's front end sets x-forwarded-for; the rate limit counts per caller
});

// Cost: nothing runs while nobody calls it (no minimum instances); one small instance answers many calls at once
// (answers are in-memory lookups of a few ms); at most two instances, so a burst can never run up a bill.
// ponytail: fixed limits for a team-sized audience; raise maxInstances if real traffic ever queues.
export const mcp = onRequest({
  region: 'europe-west1', memory: '256MiB', cpu: 1, concurrency: 80, maxInstances: 2, minInstances: 0,
  timeoutSeconds: 30, invoker: 'public', // anyone may reach it; the bearer token decides who gets an answer
  secrets: ['AIS_MCP_TOKEN'],
}, app.handle);

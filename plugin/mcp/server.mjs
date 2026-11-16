import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { McpServer, ResourceTemplate, fromJsonSchema } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';
import { StdioServerTransport, serveStdio } from '@modelcontextprotocol/server/stdio';
import { Factory } from './core.mjs';
import { schemas, VERSION, bounded } from './contracts.mjs';
import { STUDIO, GUIDE } from '../engine/recipe.mjs';
// Working copies and export jobs live in the plugin's data folder. A second session at the same time gets its own folder.
const STATE = process.env.AIS_MCP_STATE || path.join(process.env.AIS_PLUGIN_DATA || path.join(os.homedir(), '.cache/ais-group-design'), 'studio');
// A render refused because the computer is busy (another render, Blender, low memory) waits its turn this long.
const renderWait = 1000 * Number(process.env.AIS_RENDER_WAIT_SECONDS ?? 600);
let factory;
try { factory = new Factory({ state: STATE, renderWait }); }
catch (e) { if (!/already owned/.test(e.message)) throw e; factory = new Factory({ state: `${STATE}-${process.pid}`, renderWait }); }
// The main rule of the brand system, word for word as essential 1 of the guide (tests/rule.test.mjs keeps them identical).
const RULE = 'Keep it simple: one purpose, the plainest layout, design and implementation that serve it. Linear’s website and Apple Notes are the bar. Cut taglines, helper text, subtitles, eyebrows and secondary labels; if something only makes sense with them, fix the layout instead. A decision ships only if it improves user, developer and agent experience at once. When two rules disagree, this one wins.';
const instructions = `${RULE}
AIS Group Design studio. Start with plan_piece and read only what it points to. edit_piece copies, edits (text and images by slot) and validates a piece (the text check runs on every kind); export_piece exports it. Each reply's next says what to call after it.
Never invent figures, customers, quotes or certifications. Show the exported result before calling it done. When a call is refused, tell the user its fix; never work around it.`;
const descriptions = {
  plan_piece:'Start here for any request: the piece type, what to read, and the closest templates and pictures. Makes nothing.',
  studio_status:'What the studio can make, its limits and what setup is missing.',
  search_library:'Search skills, templates or library assets.',
  read_instructions:'Read an instruction, template or supplied text that plan_piece or search_library returned, in chunks.',
  get_asset:'One library asset: review status, origin and path.',
  inspect_media:'Inspect a supplied photo or video: metadata or one small preview.',
  edit_piece:'Copy, inspect, list slots, update or validate a piece. Updates need the expectedDigest from the previous call.',
  export_piece:'Export a piece: render-png (a post) or render-pdf; saveAs copies the file here. Also status (waits for the job), list and cancel.'
};
// One short line on what to call after a successful reply; undefined leaves it out.
const next = (name, r, a = {}) => {
  if (name === 'plan_piece') return r.status === 'needs-clarification' ? 'Ask the user which piece they want, then call plan_piece again.' : 'read_instructions on each ref, then edit_piece copy from a template or source.';
  if (name === 'studio_status') return r.setup?.ready === false ? 'Tell the user what is missing and how to fix it (the setup skill); export nothing until it is fixed.' : undefined;
  if (name === 'search_library') return !r.total ? 'Nothing matched: try a broader query, or tell the user it is not in the library.' : r.nextOffset != null ? `More results at offset ${r.nextOffset}.` : undefined;
  if (name === 'read_instructions') return r.nextOffset != null ? `read_instructions again with offset ${r.nextOffset}.` : undefined;
  if (name === 'get_asset') return r.status === 'rejected' ? 'Rejected asset: pick another one.' : !r.uri ? 'The file is not in the media library: tell the user; do not substitute another picture.' : undefined;
  if (name === 'edit_piece') return r.updated === false ? 'Nothing was saved: the change failed the checks. Fix the errors, then update again with the current digest.' : r.valid === false ? 'Fix the errors, then update again with the current digest.'
    : r.slots ? (r.nextOffset != null ? `edit_piece slots with offset ${r.nextOffset} for the next page (${r.total} in all), or ` : '') + 'edit_piece update with slotChanges for only the slots to change, and this digest as expectedDigest.'
    : r.kind === 'video' ? 'Video is not exported here: hand over the recipe and the caption.'
    : r.updated || ['update', 'validate'].includes(a.action) ? `export_piece enqueue ${r.kind === 'post' ? 'render-png' : 'render-pdf'} (saveAs to copy it here), then open the result before calling it done.`
    : r.kind === 'technical-sheet' ? 'edit_piece update with printChanges and this digest as expectedDigest; then export_piece enqueue render-pdf.'
    : ['print-html', 'deck', 'kit'].includes(r.kind) ? 'edit_piece slots to list its texts and pictures, then update with slotChanges; then export_piece enqueue render-pdf.'
    : 'edit_piece update with changes (headline, text, src for the picture, copy for the caption) and this digest as expectedDigest; then export_piece enqueue.';
  if (name === 'export_piece') return ['queued', 'running'].includes(r.state) ? `export_piece status with jobId ${r.id}; each call waits up to 25 s for it to finish.` : r.state === 'succeeded' ? `Open every exported page and review it before calling it done${r.saveTo && !r.saved ? '; the copy to this folder failed, see reason' : ''}.` : r.state === 'blocked' ? 'Tell the user nothing was rendered and why (reason); they can ask again once the computer is free.' : r.state === 'failed' ? 'Read reason and log, fix the piece, then enqueue again.' : undefined;
};
// What to do about a refusal. ponytail: matched on the message; a typed error code per throw site if this table grows.
const FIXES = [
  [/pieceId: Invalid string/, 'pieceId is your own short name for the working copy (lowercase letters, digits and hyphens, e.g. folleto-hopper); pass the file path as source with action copy.'],
  [/Recipe media outside|Recipe symlink escapes|External\/active content/, 'Pictures must come from the media library: pass its path (library/media/…), as get_asset or search_library gives it.'],
  [/Only studio social recipes|Expected bounded recipe JSON/, 'Copy from a template (templates/post-*.json, carousel-*.json), a pieces/posts recipe, a brochure, deck or stationery source, or datasheets/data.json#<key>.'],
  [/expectedDigest/, 'Call edit_piece inspect (slots for documents) and resend with the digest it returns.'],
  [/already exists in this folder/, 'Ask the user for another file name, then enqueue again.'],
  [/already exists/, 'Use a new pieceId, or inspect the existing piece.'],
  [/Unknown asset|ENOENT|No such file/, 'That file is not in the library: tell the user and ask for the file, or offer what search_library finds for them to choose. Never swap in another picture yourself.'],
  [/Unsafe path|outside|escapes roots/, 'Use a file from the library, pieces or work folders, or copy the supplied file to the inbox first.'],
  [/Unknown (template|resource|skill|print)/, 'Use a ref returned by plan_piece or search_library.'],
  [/Unknown job/, 'Use a jobId from export_piece list.'],
  [/Queue full|One media/, 'Wait for the running job to finish, then call again.'],
  [/record cap|Backup cap/, 'Tell the user the studio state folder is full and needs archiving.'],
  [/closing/, 'The studio is restarting: call again in a moment.'],
  [/exceeds budget/, 'Ask for a narrower page or chunk.'],
];
// A missing file is named the way the user named it (library/media/…), not by its synced folder's real path.
const shown = (p) => { let m = ''; try { m = fs.realpathSync(path.join(STUDIO, 'library/media')); } catch {} return m && p.startsWith(m + path.sep) ? 'library/media' + p.slice(m.length) : p.startsWith(GUIDE + path.sep) ? '@guide' + p.slice(GUIDE.length) : path.relative(STUDIO, p); };
// Pictures in a piece are shown by their library path, never the computer's folders.
const short = (v) => Array.isArray(v) ? v.map(short) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typeof x === 'string' && path.isAbsolute(x) ? shown(x) : short(x)])) : v;
const fail = (e) => {
  const error = e?.issues ? e.issues.slice(0, 4).map((i) => `${i.path.join('.') || 'input'}: ${i.message}`).join('; ') : e?.code === 'ENOENT' && e.path ? `No such file: ${shown(e.path)}` : String(e?.message).slice(0, 1000);
  const fix = FIXES.find(([re]) => re.test(error))?.[1] ?? (e?.issues ? 'Correct those arguments and call again.' : 'Tell the user what was refused and why; do not work around it.');
  return { ok: false, error, fix };
};
// Drop what only the studio's own records need (audit evidence, timings, raw guard output) from what the model reads.
const HIDDEN = ['contentAuthor', 'budget', 'executionEvidence', 'sourceEvidence', 'dependencyEvidence', 'registryDigest', 'retryAt', 'waitingSince', 'cancelRequested', 'exitCode', 'createdAt', 'finishedAt', 'sourceDigest'];
const present = (name, r) => {
  const o = Object.fromEntries(Object.entries(r).filter(([k]) => !HIDDEN.includes(k)));
  if (o.shot) o.shot = short(o.shot);
  // The plan's handle is its ref; the request itself is not echoed back.
  if (name === 'plan_piece') { delete o.id; delete o.intent; }
  if (name === 'inspect_media') delete o.resources;
  if (o.generator?.rejected) { const { rejected, ...g } = o.generator; o.generator = g; }
  if (o.log !== undefined) { if (o.state === 'failed') o.log = String(o.log).slice(-1500); else delete o.log; }
  // A plan opens with the main rule, so it is the first thing read before any piece is made.
  return name === 'plan_piece' && o.status === 'routed' ? { rule: RULE, ...o } : o;
};
// export_piece status waits up to 25 s for a running job to finish, so polling costs few calls.
const settle = async (args, r) => {
  for (const end = Date.now() + 25000; ['queued', 'running'].includes(r.state) && Date.now() < end;) { await new Promise((ok) => setTimeout(ok, 1000)); r = factory.call('export_piece', args); }
  return r;
};
// Same JSON as structuredContent and as text, for clients that only read text.
const reply = (value, extra = []) => { const text = bounded(value); return { content: [{ type: 'text', text }, ...extra], structuredContent: JSON.parse(text) }; };
// Claude sees a lean schema (names, types, enums, required); the full strict contract is enforced in core.mjs on every call.
// ponytail: limits, patterns and defaults live only server-side, so a bad call costs one refusal instead of tokens in every session.
const LEAN = new Set(['maxLength','minLength','pattern','maximum','minimum','maxItems','minItems','default','$schema','additionalProperties','exclusiveMinimum','exclusiveMaximum','format']);
const lean = (v) => Array.isArray(v) ? v.map(lean) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([k]) => !LEAN.has(k)).map(([k, x]) => [k, lean(x)])) : v;
// A union of objects (the print edit ops) is shown as one object with every field; core.mjs checks the exact op.
const merge = (v) => { if (Array.isArray(v)) return v.map(merge); if (!v || typeof v !== 'object') return v;
  const o = Object.fromEntries(Object.entries(v).map(([k, x]) => [k, merge(x)]));
  const alts = o.anyOf ?? o.oneOf;
  if (!alts?.every((x) => x.type === 'object')) return o;
  const props = {};
  for (const x of alts) for (const [k, p] of Object.entries(x.properties ?? {})) {
    const own = p.enum ?? (p.const !== undefined ? [p.const] : null), seen = props[k];
    // Free text in any alternative keeps the field free text; only fields that are enums everywhere stay enums.
    props[k] = !own || (seen && !seen.enum) ? { type: p.type ?? seen?.type ?? 'string' } : { type: p.type ?? 'string', enum: [...new Set([...(seen?.enum ?? []), ...own])] };
  }
  return { type: 'object', properties: props };
};
const advertised = (schema) => { const j = merge(lean(z.toJSONSchema(schema, { io: 'input' }))); if (j.required && !j.required.length) delete j.required; return fromJsonSchema(j); };
const READ_ONLY = ['studio_status', 'search_library', 'read_instructions', 'get_asset'];
const handle = serveStdio(()=>{
  const server = new McpServer({name:'ais-group-design-studio',version:VERSION},{instructions});
  for(const [name,inputSchema] of Object.entries(schemas)) server.registerTool(name,{description:descriptions[name],inputSchema:advertised(inputSchema),annotations:READ_ONLY.includes(name)?{readOnlyHint:true,openWorldHint:false}:{destructiveHint:false,openWorldHint:false}},async args=>{
    try {
      let {image,...result}=await factory.call(name,args);
      if(name==='export_piece'&&args.action==='status')result=await settle(args,result);
      return reply({ok:true,...present(name,result),next:next(name,result,args)},image?[image]:[]);
    }
    catch(e) { return {isError:true,...reply(fail(e))}; }
  });
  server.registerResource('status','ais://studio/status',{mimeType:'application/json'},async u=>({contents:[{uri:u.href,mimeType:'application/json',text:bounded(factory.call('studio_status',{}))}]}));
  server.registerResource('instruction-chunk',new ResourceTemplate('ais://studio/chunk/{ref}/{offset}',{list:undefined}),{mimeType:'application/json'},async(u,v)=>({contents:[{uri:u.href,mimeType:'application/json',text:bounded(factory.call('read_instructions',{ref:decodeURIComponent(String(v.ref)),offset:Number(v.offset)}))}]}));
  return server;
}, {transport:new StdioServerTransport(process.stdin,process.stdout,{maxBufferSize:65536})});
let ending=false;
async function shutdown(){if(ending)return;ending=true;await factory.close();await handle.close();}
process.on('SIGTERM',()=>void shutdown());process.on('SIGINT',()=>void shutdown());process.stdin.on('end',()=>void shutdown());


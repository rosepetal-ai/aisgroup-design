import { SKILL_PATH_ALIASES } from '../skill-routes.mjs';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { checkRecipe, STUDIO, GUIDE, resolveFile, libraryPhotos } from '../engine/recipe.mjs';
import { PATTERNS, patternAssets } from '../engine/linkedin-patterns.mjs';
import { searchAssets, assetSummary } from './assets.mjs';
import { sourceStamp, resolveMediaReference, inspectMedia, PYTHON, stopTree } from './media.mjs';
import { ensureMedia, mediaRefs, canFetch, signedIn } from '../scripts/media.mjs';
import { printSource, printSources, printFamily, printDescriptor, copyPrint, updatePrint, checkPrint, printDigest, preparePrint } from './print.mjs';
import { VERSION, LIMITS, schemas } from './contracts.mjs';
import { generators, APPROVAL, DOC_KINDS, documentKind, snapshotDocument, checkDocument as checkDocumentSource, documentCommand, documentOutputs } from './documents.mjs';
import { withTextCheck } from '../engine/text-check.mjs';
// Every print, deck and stationery source also runs the text check (helper text, hype words, slogans, lines above headlines).
const checkDocument=(raw,dir)=>withTextCheck(checkDocumentSource(raw,dir),raw,dir);
import { listSlots, applySlots } from './slots.mjs';
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
// Pictures a marketer pastes or drops in are copied here first (the skills do it); the MCP reads them like library media.
const INBOX = process.env.AIS_INBOX ? path.resolve(process.env.AIS_INBOX) : path.join(STUDIO, 'work/inbox');
fs.mkdirSync(INBOX, { recursive: true });
// The render guard (safe_render.py) runs only this node: the one the person installed and the plugin runs on.
process.env.AIS_NODE ??= process.execPath;
// What a new laptop still needs, in words a marketer can act on (npm run setup installs the first two).
function setupStatus() {
  const ok = (cmd, args) => spawnSync(cmd, args, { stdio: 'ignore', timeout: 10000 }).status === 0;
  const media = path.join(STUDIO, 'library/media');
  const missing = [];
  try { if (!fs.existsSync(chromium.executablePath())) missing.push('Chromium for rendering: run npm run setup'); } catch { missing.push('Chromium for rendering: run npm run setup'); }
  if (!ok(process.env.AIS_PYTHON || PYTHON, ['-c', 'import PIL, pptx, fitz'])) missing.push('Python packages: run npm run setup');
  // The media library comes from the bucket on demand; a local copy (npm run media:pull) also works offline.
  const local = fs.existsSync(media) && fs.readdirSync(media).length > 0, account = signedIn();
  if (!local && !account) missing.push(canFetch() ? 'Media library: run «gcloud auth login» with an account that can read the aisgroup-design project' : 'Media library: install the Google Cloud CLI and run «gcloud auth login»');
  if (!ok('pdftoppm', ['-v'])) missing.push('pdftoppm (page previews): install poppler');
  return { ready: !missing.length, missing, inbox: INBOX, media: account ? `on demand from the bucket (${account})${local ? ', with a local copy' : ''}` : local ? 'local copy' : 'unavailable' };
}
export const digest = v => createHash('sha256').update(v).digest('hex');
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const uri = p => pathToFileURL(p).href;
// A picture as the user or get_asset names it (library/media/…, the guide's brand/library/photos/…, a file:// URI) becomes
// the recipe's @lib/… or @guide/… reference; a bare relative path would otherwise resolve inside the piece's own folder.
const libRef = v => /^file:/i.test(v) ? fileURLToPath(v) : v.replace(/^(\.\/)?library\//, '@lib/').replace(/^(\.\/)?brand\//, '@guide/');
// What safe_render.py said when it refused to start (its first stdout line is a JSON receipt).
// What holds a render up, in plain words (the lock files are the studio's own business).
const PLAIN = { 'lock busy: ais-marketing-render.lock': 'another export is running', 'lock busy: ais-blender.lock': 'a 3D render is running' };
const blockedBy = log => { try { return (JSON.parse(String(log).split('\n')[0]).blocked_by ?? []).map(r => PLAIN[r] ?? r); } catch { return []; } };
function atomic(p, data) { const tmp = p + '.' + randomUUID() + '.tmp'; fs.writeFileSync(tmp, data, { mode: 0o600, flag: 'wx' }); fs.renameSync(tmp,p); }
function inside(p, root) { const rel = path.relative(root,p); return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel)); }
// The media library is usually a link to the user's synced folder: map its real paths back to library/media/….
function studioRel(real) { const media = path.join(STUDIO, 'library/media'); try { const m = fs.realpathSync(media); if (inside(real, m)) return path.join('library/media', path.relative(m, real)); } catch {} return path.relative(STUDIO, real); }
function safe(p, roots) {
  if (typeof p !== 'string' || p.includes('\0') || p.split(/[\\/]/).includes('..') || /^(https?:|data:|file:)/i.test(p)) throw Error('Unsafe path');
  const abs = fs.realpathSync(path.resolve(STUDIO,p));
  if (!roots.filter(r => fs.existsSync(r)).some(r => inside(abs,fs.realpathSync(r)))) throw Error('Path outside the library, pieces and work folders');
  if (!fs.statSync(abs).isFile()) throw Error('Expected a regular file');
  return abs;
}
const METHODS = { plan_piece:'route', search_library:'lookup', read_instructions:'read', get_asset:'asset', edit_piece:'piece', export_piece:'job' };
const skillNames = fs.readdirSync(path.join(STUDIO,'skills')).filter(name=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)&&fs.existsSync(path.join(STUDIO,'skills',name,'SKILL.md'))).sort();
export class Factory {
  // renderWait: how long a render refused for a busy machine (lock held, Blender running, low memory) waits its turn, re-checked every retryMs; 0 reports it blocked at once.
  constructor({ state = path.join(os.homedir(),'.cache/ais-group-design/studio'), schedule = fn => setImmediate(fn), launch = spawn, renderWait = 0, retryMs = 20000 } = {}) {
    this.state = path.resolve(state); this.schedule = schedule; this.launch = launch; this.running = null; this.child = null; this.closed = false; this.renderWait = renderWait; this.retryMs = retryMs; this.timer = null;
    this.mediaTasks=new Set();this.mediaPids=new Set();
    fs.mkdirSync(this.state,{recursive:true,mode:0o700});
    if (fs.lstatSync(this.state).isSymbolicLink()) throw Error('State directory cannot be symlink');
    this.owner = path.join(this.state,'owner.json');
    if (fs.existsSync(this.owner)) {
      const old = json(this.owner); let live = true;
      live = [old.pid,old.workerPid,...(old.mediaPids||[])].filter(Boolean).some(pid=>{try {process.kill(pid,0);return true;}catch(e){return e.code!=='ESRCH';}});
      if (live) throw Error('State directory already owned by a running process');
      fs.unlinkSync(this.owner);
    }
    fs.writeFileSync(this.owner,JSON.stringify({pid:process.pid}),{flag:'wx',mode:0o600});
    for (const d of ['pieces','jobs','bundles']) { const p=path.join(this.state,d); fs.mkdirSync(p,{recursive:true,mode:0o700}); if(fs.lstatSync(p).isSymbolicLink()) throw Error('State subdirectory cannot be symlink'); }
    this.jobs = fs.readdirSync(path.join(this.state,'jobs')).filter(f=>f.endsWith('.json')).map(f=>json(path.join(this.state,'jobs',f)));
    for (const j of this.jobs) if(['running','queued'].includes(j.state)) { j.state='interrupted'; j.reason='The studio restarted before this job finished: enqueue it again'; this.saveJob(j); }
    this.skills = skillNames.map(name=>({ id:name, ref:`skill:${name}/SKILL.md`, path:path.join(STUDIO,'skills',name,'SKILL.md') }));
    this.templates = fs.readdirSync(path.join(STUDIO,'templates')).filter(f=>/^(post|carousel|video)-.*\.json$/.test(f)).sort().map(f=>({ id:f, ref:`template:${f}` }));
    const registry=fs.readFileSync(path.join(STUDIO,'library/catalog.json'));
    this.assets = JSON.parse(registry).assets;
    this.assets.push(...libraryPhotos(this.assets), ...patternAssets());
    this.registryDigest=digest(registry);
    for(const [key,c] of Object.entries(printFamily.products))this.templates.push({id:key+'-technical-sheet',ref:'print:'+key+'-technical-sheet',source:c.source,product:c.name,kind:'technical-sheet',lang:'es'});
    // Sales documents: the proposal and the case study (print-family.json generators), edited by slot like any print piece.
    for(const key of ['proposal','case-study'])for(const source of printFamily.generators[key].references)this.templates.push({id:key+'-'+source.match(/\.([a-z]{2})\.html$/)[1],source,generator:key,kind:'print-html',lang:source.match(/\.([a-z]{2})\.html$/)[1]});
    // Decks: the approved "Hoy + azul" decks (print-family.json deck references), copied with edit_piece and built by decks/build.mjs.
    // Brochures, catalogues and one-pagers: the accepted print pieces, copied with edit_piece and edited by slot.
    for(const key of ['brochure','catalogue','one-pager'])for(const source of printFamily.generators[key].references)this.templates.push({id:key+'-'+source.split('/')[2].replace(/^catalogue-/,''),source,generator:key,kind:'print-html',lang:(source.match(/\.([a-z]{2})\.html$/)||[])[1]||'es'});
    for(const source of printFamily.generators.deck.references)this.templates.push({id:'deck-'+source.split('/')[2],source,title:json(path.join(STUDIO,source)).meta?.title,kind:'deck',lang:source.match(/\.([a-z]{2})\.json$/)[1]});
  }
  releaseOwner() { if(fs.existsSync(this.owner) && json(this.owner).pid===process.pid) fs.unlinkSync(this.owner); }
  writeOwner(){atomic(this.owner,JSON.stringify({pid:process.pid,...(this.child?.pid?{workerPid:this.child.pid}:{}),...(this.mediaPids.size?{mediaPids:[...this.mediaPids]}:{})}));}
  close() {
    if(this.closed) return this.closing || Promise.resolve();
    this.closed=true;clearTimeout(this.timer);
    for(const j of this.jobs.filter(j=>j.state==='queued')) {j.state='cancelled';this.saveJob(j);}
    for(const task of this.mediaTasks)task.controller.abort();
    const pending=[...this.mediaTasks].map(t=>t.promise);
    if(this.running) {this.running.cancelRequested=true;if(this.child)stopTree(this.child);pending.push(this.done);}
    if(pending.length)return this.closing=Promise.allSettled(pending).then(()=>this.releaseOwner());
    this.releaseOwner(); return Promise.resolve();
  }
  inspectSuppliedMedia(a){
    if(this.closed)throw Error('Server is closing');
    if(this.mediaTasks.size)throw Error('One media inspection may run at a time');
    const task={controller:new AbortController(),promise:null};this.mediaTasks.add(task);
    task.promise=inspectMedia(this.state,a,{signal:task.controller.signal,onStart:pid=>{this.mediaPids.add(pid);this.writeOwner();},onFinish:pid=>{this.mediaPids.delete(pid);this.writeOwner();}}).finally(()=>this.mediaTasks.delete(task));
    return task.promise;
  }
  fileCount(dir) { if(fs.readdirSync(path.join(this.state,dir)).length>=LIMITS.records) throw Error(`${dir} record cap reached; archive state manually`); }
  record(dir,id) { return path.join(this.state,dir, id + '.json'); }
  saveJob(j) { atomic(this.record('jobs',j.id),JSON.stringify(j,null,2)); }
  media(ref) {
    if(typeof ref.path==='string')ensureMedia(mediaRefs(ref.path));
    const p = safe(ref.path,[path.join(STUDIO,'library'),path.join(STUDIO,'library/media'),path.join(STUDIO,'pieces'),path.join(STUDIO,'work'),INBOX,GUIDE]);
    const st=fs.statSync(p); const cap = ref.mime==='text/plain' ? LIMITS.recipeBytes : LIMITS.mediaBytes;
    if(st.size>cap) throw Error('Media exceeds size cap');
    const fd=fs.openSync(p,'r'), buffer=Buffer.alloc(32); const n=fs.readSync(fd,buffer,0,32,0); fs.closeSync(fd); const head=buffer.subarray(0,n);
    const ok={ 'image/png':head.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'image/jpeg':head[0]===255 && head[1]===216 && head[2]===255, 'image/webp':head.toString('ascii',0,4)==='RIFF' && head.toString('ascii',8,12)==='WEBP', 'video/mp4':head.toString('ascii',4,8)==='ftyp', 'text/plain':/\.(txt|md)$/i.test(p) && !head.includes(0) }[ref.mime];
    if(!ok) throw Error('Media type/signature mismatch or unsupported type');
    if(ref.mime==='text/plain') { const bytes=fs.readFileSync(p); new TextDecoder('utf-8',{fatal:true}).decode(bytes);if(bytes.includes(0))throw Error('Text contains NUL bytes'); }
    const catalogMatches=this.assets.filter(x=>path.resolve(STUDIO,x.path)===p).slice(0,3).map(x=>({id:x.id,product:x.product,status:x.status,reason:String(x.reason||'').slice(0,200)}));
    return {uri:uri(p),mime:ref.mime,bytes:st.size,role:ref.role,stamp:sourceStamp(p),catalogMatches};
  }
  route(a) {
    const bundleId=randomUUID();
    const media=a.media.map((r,i)=>({...this.media(r),ref:`media:${bundleId}:${i}`,inspection:r.mime==='text/plain'?'read_instructions':'inspect_media'}));
    let kind=a.kind;
    if(kind==='auto') kind=/carousel|carrusel/i.test(a.intent)?'carousel':/video|vídeo|reel|clip/i.test(a.intent)?'video':/\b(deck|slides?|presentaci[oó]n|presentation|powerpoint|pptx)\b/i.test(a.intent)?'deck':/business card|tarjeta|letterhead|membrete|papeler[ií]a|stationery/i.test(a.intent)?'kit':/post|linkedin|social/i.test(a.intent)?'post':/brochure|cat[aá]log|folleto|ficha|datasheet|one-pager|flyer|propuesta|oferta|presupuesto|proposal|quote|caso de [eé]xito|caso de cliente|case.?study/i.test(a.intent)?'document':/asset|imagen|image|footage/i.test(a.intent)?'assets':'unknown';
    if(kind==='unknown') return {status:'needs-clarification',supported:['post','carousel','video','document','deck','kit','assets'],message:'Specify the intended deliverable; no content generation occurred'};
    this.fileCount('bundles');
    let skill={post:'social-post',carousel:'linkedin-carousel',video:'brand-video',document:'brochure',deck:'presentation',kit:'print-stationery',assets:'asset-library'}[kind];
    // The one canonical generator for the piece type (print-family.json "generators"): HTML first, PDF/PNG/PPTX on request.
    const generatorKey=kind==='document'?(/propuesta|oferta|presupuesto|proposal|quote/i.test(a.intent)?'proposal':/caso de [eé]xito|caso de cliente|case.?study/i.test(a.intent)?'case-study':/ficha|datasheet|technical sheet/i.test(a.intent)?'datasheet':/cat[aá]log/i.test(a.intent)?'catalogue':/one.?pag|flyer|una cara|una p[aá]gina/i.test(a.intent)?'one-pager':'brochure'):kind==='kit'?(/letterhead|membrete/i.test(a.intent)?'letterhead':'business-card'):['post','carousel','deck'].includes(kind)?kind:null;
    const generator=generatorKey?{key:generatorKey,...generators[generatorKey],rejected:generators._note}:null;
    if(generators[generatorKey]?.skill==='sales-documents')skill='sales-documents';
    const playbook=kind==='post' ? (/software|screen|pantalla/i.test(a.intent)?'software':/defect|defecto/i.test(a.intent)?'callout':/\b(sede|oficinas?|edificio|instalaciones|visita|noticia|aniversario|acuerdo|nuevo equipo|headquarters|office|building|premises|visit|news|anniversary|agreement)\b/i.test(a.intent)?'news':'product') : null;
    const refs=[...(skill?[`skill:${skill}/SKILL.md`]:[]),'shared:WORKFLOW.md',...(playbook?[`skill:${skill}/types/${playbook}.md`]:[]),...(kind==='document'?['skill:brochure/references/mcp-editing.md']:[])];
    const assets=searchAssets(this.assets,a.intent).slice(0,4);
    // Piece types in Spanish or English count against the template's id and kind, never against its file name.
    const PIECE_WORDS={folleto:'brochure',catálogo:'catalogue',catalogo:'catalogue',ficha:'technical-sheet',datasheet:'technical-sheet',presentación:'deck',presentacion:'deck',presentation:'deck'};
    const words=a.intent.toLowerCase().split(/[^a-záéíóúñü0-9]+/).filter(w=>w.length>3).map(w=>PIECE_WORDS[w]??w), hits=(x)=>words.filter(w=>[x.id,x.kind,x.title,x.source].join(' ').toLowerCase().includes(w)).length;
    const sales=skill==='sales-documents', candidates=this.templates.filter(x=>sales?x.generator===generatorKey:x.id.startsWith(kind+'-') || (kind==='document' && generatorKey!=='datasheet' && x.generator===generatorKey) || (kind==='document' && x.kind==='technical-sheet' && (a.intent.toLowerCase().includes(x.product.toLowerCase()) || a.intent.toLowerCase().includes(x.id.split('-technical-sheet')[0])))).sort((a,b)=>Number(b.id.includes(playbook||'__none__'))-Number(a.id.includes(playbook||'__none__'))||(['deck','document'].includes(kind)?hits(b)-hits(a):0)).slice(0,4);
    const bundle={id:bundleId,contractVersion:VERSION,intent:a.intent,kind,refs,generator,media,assets,templates:candidates,contentAuthor:'client LLM; skills are instructions, not executable generators'};
    atomic(this.record('bundles',bundle.id),JSON.stringify(bundle,null,2));
    return {...bundle,ref:`bundle:${bundle.id}`,budget:{maxResponseBytes:LIMITS.responseBytes,maxChunkChars:LIMITS.chunkChars},status:'routed'};
  }
  lookup(a) {
    const all={skills:this.skills.map(s=>({id:s.id,ref:s.ref})),templates:this.templates}[a.collection];
    const filtered=a.collection==='assets'?searchAssets(this.assets,a.query,a.filters):all.filter(x=>JSON.stringify(x).toLowerCase().includes(a.query.toLowerCase()));
    return {registryDigest:a.collection==='assets'?this.registryDigest:undefined,items:filtered.slice(a.offset,a.offset+a.limit),nextOffset:a.offset+a.limit<filtered.length?a.offset+a.limit:null,total:filtered.length};
  }
  read(a) {
    let p;
    if(a.ref.startsWith('media:')) {
      const m=resolveMediaReference(this.state,a.ref);
      if(m.mime!=='text/plain')throw Error('Use inspect_media to probe or preview image/video references');
      const bytes=fs.readFileSync(m.path);if(bytes.length>LIMITS.recipeBytes)throw Error('Text reference exceeds size cap');
      const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes),hash=digest(bytes);
      if(a.ifDigest===hash)return {ref:a.ref,digest:hash,unchanged:true};
      return {ref:a.ref,digest:hash,referenceOnly:true,sourceUri:m.uri,text:text.slice(a.offset,a.offset+a.chars),offset:a.offset,nextOffset:a.offset+a.chars<text.length?a.offset+a.chars:null,totalChars:text.length};
    }
    if(a.ref.startsWith('print:')) { const key=a.ref.slice(6).replace(/-technical-sheet$/,'');if(a.ref!==`print:${key}-technical-sheet`)throw Error('Unknown print descriptor');const text=JSON.stringify(printDescriptor(key),null,2);if(a.ifDigest===digest(text))return {ref:a.ref,digest:digest(text),unchanged:true};return {ref:a.ref,digest:digest(text),text:text.slice(a.offset,a.offset+a.chars),nextOffset:a.offset+a.chars<text.length?a.offset+a.chars:null,totalChars:text.length}; }
    else if(a.ref.startsWith('skill:')) {
      const requested=a.ref.slice(6), rel=SKILL_PATH_ALIASES[requested]??requested, name=rel.split('/')[0];
      if(!skillNames.includes(name)||!rel.endsWith('.md')) throw Error('Unknown skill resource'); p=safe(path.join('skills',rel),[path.join(STUDIO,'skills',name)]);
    }
    else if(a.ref==='shared:WORKFLOW.md') p=path.join(STUDIO,'skills/_shared/WORKFLOW.md');
    else if(a.ref==='shared:studio-protocol.md') p=path.join(STUDIO,'skills/_shared/references/studio-protocol.md');
    else if(a.ref.startsWith('template:')) { const t=this.templates.find(t=>t.ref===a.ref); if(!t) throw Error('Unknown template'); p=path.join(STUDIO,'templates',t.id); }
    else if(/^bundle:[a-f0-9-]{36}$/.test(a.ref)) p=this.record('bundles',a.ref.slice(7));
    else throw Error('Unknown resource reference');
    if(fs.statSync(p).size>256*1024) throw Error('Resource too large');
    const text=fs.readFileSync(p,'utf8'), hash=digest(text);
    if(a.ifDigest===hash) return {ref:a.ref,digest:hash,unchanged:true};
    return {ref:a.ref,digest:hash,text:text.slice(a.offset,a.offset+a.chars),offset:a.offset,nextOffset:a.offset+a.chars<text.length?a.offset+a.chars:null,totalChars:text.length};
  }
  asset(a) {
    const x=this.assets.find(x=>x.id===a.assetId); if(!x) throw Error('Unknown asset');
    if(String(x.path).startsWith('library/media/')&&ensureMedia([x.path.slice(14)]).length&&!fs.existsSync(path.resolve(STUDIO,x.path))) throw Error('This picture could not be fetched from the media bucket: run «gcloud auth login» with an account that can read the aisgroup-design project.');
    const summary=assetSummary(x); if(!summary.pathExists)return {...summary,uri:null,bytes:null};
    let p;try{p=safe(path.resolve(STUDIO,x.path),[path.join(STUDIO,'library'),path.join(STUDIO,'library/media'),path.join(STUDIO,'library/factory-library/assets'),GUIDE]);}catch{return {...summary,uri:null,bytes:null,retrievalReason:'Registered file exists outside controlled delivery roots; metadata retained'};}
    return {...summary,id:x.id,path:x.path,status:x.status,reason:String(x.reason||'').slice(0,1500),kind:x.kind,product:x.product,origin:x.origin,source:String(x.source||'').slice(0,1500),brand:x.brand,consent:x.consent,size:x.size,uri:uri(p),bytes:fs.statSync(p).size};
  }
  piecePath(id) { const p=path.join(this.state,'pieces',id,'recipe.json'); if(fs.existsSync(path.dirname(p)) && fs.lstatSync(path.dirname(p)).isSymbolicLink()) throw Error('Piece directory cannot be symlink'); if(fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) throw Error('Piece cannot be symlink'); return p; }
  secureRecipe(raw,dir) {
    ensureMedia(mediaRefs(JSON.stringify(raw))); // one batch for every library picture the recipe uses
    if(!['post','carousel','video'].includes(raw.kind)) throw Error('Only studio social recipes supported');
    if(raw.kind==='post' && raw.formats===undefined) raw.formats=['4x5'];
    if(!Array.isArray(raw.shots)||raw.shots.length>10) throw Error('Recipe shot cap');
    const walk=v=> { if(!v||typeof v!=='object') return; for(const [k,x] of Object.entries(v)) {
      if(['src','bgSrc','portrait','captionsFrom'].includes(k) && typeof x==='string') {
        const p=resolveFile(x,dir);
        // The library, the guide and the inbox, where the pictures a person gives the studio are copied.
        if(![path.join(STUDIO,'library'),path.join(STUDIO,'library/media'),GUIDE,INBOX].some(r=>inside(p,r)||inside(p,fs.realpathSync(r)))) throw Error('Recipe media outside library/public roots');
        // realpath containment defeats symlink escapes. Do not copy private engineering inputs.
        const real=fs.realpathSync(p); if(![path.join(STUDIO,'library/media'),GUIDE,INBOX].some(r=>inside(real,fs.realpathSync(r)))) throw Error('Recipe symlink escapes roots');
        const ext=path.extname(real).toLowerCase(); const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4'}[ext];
        if(!mime) throw Error('Unsupported recipe media');
        this.media({path:inside(real,STUDIO)?studioRel(real):real,mime}); v[k]=real;
      } else if(typeof x==='string' && /(?:https?:|data:|file:|<script)/i.test(x)) throw Error('External/active content unsupported');
      else walk(x);
    }}; walk(raw); return raw;
  }
  check(raw,p) { if(raw.kind==='technical-sheet')return checkPrint(raw,path.dirname(p)); if(DOC_KINDS.includes(raw.kind))return checkDocument(raw,path.dirname(p)); this.secureRecipe(structuredClone(raw),path.dirname(p)); const r=checkRecipe(raw,path.dirname(p),p); return {valid:r.errors.length===0,errors:r.errors.slice(0,12),warnings:r.warnings.slice(0,12),errorCount:r.errors.length,warningCount:r.warnings.length}; }
  piece(a) {
    const p=this.piecePath(a.pieceId);
    if(a.source?.startsWith('datasheets/data.json#')&&!printSources.includes(a.source))throw Error('Unsupported print source/variant/language; only seven registered Spanish sheets');
    if(printSources.includes(a.source) || (fs.existsSync(p)&&json(p).kind==='technical-sheet'))return this.printPiece(a,p);
    if((a.action==='copy'&&documentKind(a.source)) || (fs.existsSync(p)&&DOC_KINDS.includes(json(p).kind)))return this.documentPiece(a,p);
    if(a.printChanges)throw Error('Print changes require a technical sheet');
    if(a.action==='copy') {
      if(!a.source) throw Error('source required');
      const source=safe(a.source,[path.join(STUDIO,'pieces'),path.join(STUDIO,'work'),path.join(STUDIO,'templates')]);
      if(!source.endsWith('.json')||fs.statSync(source).size>LIMITS.recipeBytes) throw Error('Expected bounded recipe JSON');
      if(fs.existsSync(path.dirname(p))) throw Error('Piece already exists'); this.fileCount('pieces');
      const raw=this.secureRecipe(json(source),path.dirname(source));
      fs.mkdirSync(path.dirname(p),{mode:0o700}); atomic(p,JSON.stringify(raw,null,2));
      atomic(path.join(path.dirname(p),'provenance.json'),JSON.stringify({source:uri(source),sourceDigest:digest(fs.readFileSync(source)),createdAt:new Date().toISOString()}));
    }
    const raw=json(p), before=fs.readFileSync(p,'utf8');
    if(a.action==='update') {
      if(!a.expectedDigest||a.expectedDigest!==digest(before)) throw Error('Stale or missing expectedDigest');
      if(!a.changes) throw Error('changes required');
      for(const c of a.changes) {
        if(c.field==='pattern') {
          if(!['post','carousel','video'].includes(raw.kind)) throw Error('Use the decorative pattern assets in this medium’s existing template');
          if(c.value!=='none' && !PATTERNS.includes(c.value)) throw Error('Unapproved LinkedIn pattern');
          if(!raw.shots[a.shot]) throw Error('Unknown shot');
          raw.shots[a.shot].pattern=c.value;
        }
        else if(c.field==='copy') raw.copy=c.value;
        else if(c.field==='lang') { if(!['es','en','ca'].includes(c.value)) throw Error('Unsupported language'); raw.lang=c.value; }
        else { if(!raw.shots[a.shot]) throw Error('Unknown shot'); raw.shots[a.shot][c.field]=['src','bgSrc','portrait'].includes(c.field)?libRef(c.value):c.value; }
      }
      const check=this.check(raw,p); if(!check.valid) return {updated:false,...check};
      const out=JSON.stringify(raw,null,2); if(Buffer.byteLength(out)>LIMITS.recipeBytes) throw Error('Recipe size cap');
      const backups=fs.readdirSync(path.dirname(p)).filter(f=>f.endsWith('.bak')); if(backups.length>=20) throw Error('Backup cap; archive this piece');
      atomic(p+'.'+digest(before)+'.bak',before); atomic(p,out);
    }
    const current=fs.readFileSync(p,'utf8'), data=JSON.parse(current);
    return {pieceId:a.pieceId,digest:digest(current),uri:uri(p),kind:data.kind,lang:data.lang,shotCount:data.shots.length,shot:a.action==='validate'?undefined:data.shots[a.shot],copy:a.action==='validate'?undefined:data.copy,...this.check(data,p)};
  }
  documentPiece(a,p) {
    const dir=path.dirname(p);
    if(a.printChanges||a.changes)throw Error('Brochures, catalogues and decks are edited by slot: list them with action "slots", then update with slotChanges');
    if(a.action==='copy'){
      if(fs.existsSync(dir))throw Error('Piece already exists');this.fileCount('pieces');safe(a.source,[path.join(STUDIO,'pieces'),path.join(STUDIO,'work')]);fs.mkdirSync(dir,{mode:0o700});
      try{atomic(p,JSON.stringify(snapshotDocument(dir,a.source),null,2));}catch(e){fs.rmSync(dir,{recursive:true,force:true});throw e;}
    }
    let raw=json(p);
    // ponytail: the whole list when it fits the reply budget; otherwise 20 slots a page (a 26-slide deck), by offset.
    if(a.action==='slots'){const all=listSlots(raw,dir),fits=a.offset==null&&JSON.stringify(all).length<15000,at=a.offset??0,end=fits?all.length:Math.min(all.length,at+20);return {pieceId:a.pieceId,kind:raw.kind,digest:digest(fs.readFileSync(path.join(dir,'dependencies.json'))),total:all.length,offset:at,nextOffset:end<all.length?end:null,slots:all.slice(at,end)};}
    if(a.action==='update'){
      if(!a.slotChanges)throw Error('Send slotChanges (ids from action "slots")');
      if(a.expectedDigest!==digest(fs.readFileSync(path.join(dir,'dependencies.json'))))throw Error('Stale or missing expectedDigest: list the slots again and resend');
      const staging=dir+'.'+randomUUID()+'.stage';fs.cpSync(dir,staging,{recursive:true});
      try{
        const applied=applySlots(raw,staging,a.slotChanges,ref=>{
          const ext=path.extname(ref).toLowerCase(),mime={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp'}[ext];
          if(!mime)throw Error('Pictures must be JPG, PNG or WebP: '+ref);
          const selected=this.assets.find(x=>path.resolve(STUDIO,x.path)===path.resolve(STUDIO,ref));
          if(selected?.status==='rejected')throw Error('That picture is marked rejected in the library: '+(selected.reason||ref));
          this.media({path:ref,mime});return safe(ref,[path.join(STUDIO,'library/media'),path.join(STUDIO,'pieces'),path.join(STUDIO,'work'),INBOX,GUIDE]);
        });
        const checked=checkDocument(raw,staging);if(checked.errors.some(e=>!APPROVAL.test(e)))return {pieceId:a.pieceId,updated:false,...checked}; // a missing approval blocks export, not editing
        const old=dir+'.'+randomUUID()+'.old';fs.renameSync(dir,old);try{fs.renameSync(staging,dir);}catch(e){fs.renameSync(old,dir);throw e;}fs.rmSync(old,{recursive:true});
        raw=json(p);
        return {pieceId:a.pieceId,updated:true,kind:raw.kind,digest:digest(fs.readFileSync(path.join(dir,'dependencies.json'))),changeWarnings:applied.warnings,picturesAdded:applied.picturesAdded,...checkDocument(raw,dir)};
      }finally{fs.rmSync(staging,{recursive:true,force:true});}
    }
    return {pieceId:a.pieceId,kind:raw.kind,source:raw.source,generator:raw.generator,lang:raw.lang,digest:digest(fs.readFileSync(path.join(dir,'dependencies.json'))),uri:uri(p),html:raw.kind==='deck'?undefined:uri(path.join(dir,raw.entry)),dependencyEvidence:uri(path.join(dir,'dependencies.json')),...checkDocument(raw,dir)};
  }
  printPiece(a,p) {
    const dir=path.dirname(p);
    if(a.action==='copy'){
      if(fs.existsSync(dir))throw Error('Piece already exists');this.fileCount('pieces');fs.mkdirSync(dir);
      try{const raw=copyPrint(dir,a.source);atomic(p,JSON.stringify(raw,null,2));}catch(e){fs.rmSync(dir,{recursive:true,force:true});throw e;}
    }
    let raw=json(p);
    if(a.action==='update'){
      if(a.expectedDigest!==printDigest(raw,dir))throw Error('Stale or missing expectedDigest (content or dependencies changed)');
      if(!a.printChanges||a.changes)throw Error('Use printChanges for technical sheets');
      const staging=dir+'.'+randomUUID()+'.stage';fs.cpSync(dir,staging,{recursive:true});
      try{
        raw=updatePrint(raw,a.printChanges,staging,ref=>{
          const ext=path.extname(ref).toLowerCase(),mime={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp'}[ext];
          if(!mime)throw Error('Print replacement must be raster image');
          const selected=this.assets.find(x=>path.resolve(STUDIO,x.path)===path.resolve(STUDIO,ref));
          if(selected?.status==='rejected')throw Error('Rejected catalog image');
          this.media({path:ref,mime});return safe(ref,[path.join(STUDIO,'library/media'),GUIDE]);
        });
        const checked=checkPrint(raw,staging);if(!checked.valid)return {updated:false,...checked};
        const backups=fs.readdirSync(staging).filter(f=>f.endsWith('.bak'));if(backups.length>=20)throw Error('Backup cap');
        atomic(path.join(staging,'recipe.'+a.expectedDigest+'.bak'),fs.readFileSync(p));atomic(path.join(staging,'recipe.json'),JSON.stringify(raw,null,2));
        const old=dir+'.'+randomUUID()+'.old';fs.renameSync(dir,old);try{fs.renameSync(staging,dir);}catch(e){fs.renameSync(old,dir);throw e;}fs.rmSync(old,{recursive:true});
      }finally{fs.rmSync(staging,{recursive:true,force:true});}
    }
    raw=json(p);return {pieceId:a.pieceId,kind:raw.kind,product:raw.data.name,descriptor:'print:'+raw.name+'-technical-sheet',lang:raw.lang,digest:printDigest(raw,dir),uri:uri(p),data:a.action==='validate'?undefined:raw.data,dependencyEvidence:uri(path.join(dir,'dependencies.json')),...checkPrint(raw,dir)};
  }
  job(a) {
    if(a.action==='list') return {jobs:this.jobs.slice(-8).map(j=>({id:j.id,state:j.state,operation:j.operation}))};
    if(a.action==='enqueue') {
      if(!a.pieceId) throw Error('pieceId required');
      if(this.jobs.filter(j=>['running','queued'].includes(j.state)).length>=LIMITS.queue) throw Error('Queue full');
      this.fileCount('jobs'); const p=this.piecePath(a.pieceId); const raw=json(p); const print=raw.kind==='technical-sheet', doc=DOC_KINDS.includes(raw.kind); if(!print&&!doc)this.secureRecipe(structuredClone(raw),path.dirname(p));
      if(a.operation==='render-html'&&!print&&!doc)throw Error('HTML export is for print pieces, technical sheets, decks and stationery; posts export PNG/PDF');
      if(doc&&a.operation==='render-png')throw Error('Documents export render-html, then render-pdf (PDF plus page/slide PNGs, and PPTX for decks)');
      if(a.operation==='render-png' && (raw.kind!=='post' || raw.shots.length!==1 || !(raw.formats || ['4x5']).includes('4x5'))) throw Error('render-png is for a single-image 4x5 post; a carousel exports with render-pdf');
      if(a.operation==='render-pdf' && !print && !doc && (raw.kind!=='carousel' || raw.shots.length<3 || raw.shots.length>10 || !(raw.formats || ['4x5']).includes('4x5'))) throw Error('render-pdf is for a carousel of 3 to 10 4x5 slides; a single post exports with render-png');
      if(!/^[a-zA-Z0-9_-]+$/.test(raw.name)) throw Error('Unsafe output name');
      // The finished file is also copied into the client's working folder: Claude Code starts the server there.
      const saveTo=a.saveAs&&path.resolve(a.saveAs);if(saveTo&&fs.existsSync(saveTo))throw Error(`${a.saveAs} already exists in this folder`);
      const j={id:randomUUID(),pieceId:a.pieceId,operation:a.operation,state:'queued',saveTo,createdAt:new Date().toISOString(),sourceDigest:print?printDigest(raw,path.dirname(p)):doc?digest(fs.readFileSync(path.join(path.dirname(p),'dependencies.json'))):digest(fs.readFileSync(p)),artifacts:[]};
      if(print)j.sourceEvidence=uri(path.join(this.state,'jobs',j.id,'dependencies.json'));
      // Pin a job input so edits after enqueue cannot alter it.
      fs.mkdirSync(path.join(this.state,'jobs',j.id)); if(doc){fs.cpSync(path.join(path.dirname(p),'deps'),path.join(this.state,'jobs',j.id,'deps'),{recursive:true});fs.copyFileSync(path.join(path.dirname(p),'dependencies.json'),path.join(this.state,'jobs',j.id,'dependencies.json'));} if(print){fs.cpSync(path.join(path.dirname(p),'deps'),path.join(this.state,'jobs',j.id,'deps'),{recursive:true});fs.copyFileSync(path.join(path.dirname(p),'dependencies.json'),path.join(this.state,'jobs',j.id,'dependencies.json'));} atomic(path.join(this.state,'jobs',j.id,'recipe.json'),JSON.stringify(raw,null,2));
      this.jobs.push(j);this.saveJob(j);this.schedule(()=>this.pump());return j;
    }
    const j=this.jobs.find(j=>j.id===a.jobId); if(!j) throw Error('Unknown job');
    if(a.action==='cancel'&&['queued','running'].includes(j.state)) { if(j.state==='running'){j.cancelRequested=true;if(this.child)stopTree(this.child);}else j.state='cancelled'; this.saveJob(j); }
    return {...j,log:j.log?.slice(-4000)};
  }
  // A render refused because the machine is busy waits its turn for up to renderWait, then is reported blocked with the reason.
  waitTurn(j) {
    const by=blockedBy(j.log); j.blockedBy=by.length?by:['the machine is busy']; j.waitingSince??=Date.now();
    if(Date.now()-j.waitingSince+this.retryMs<=this.renderWait){j.state='queued';j.retryAt=Date.now()+this.retryMs;j.reason='Waiting for its turn: '+j.blockedBy.join('; ');return true;}
    const waited=Math.round((Date.now()-j.waitingSince)/1000);
    j.state='blocked';delete j.retryAt;j.reason='Not rendered: '+j.blockedBy.join('; ')+(waited?` (waited ${waited} s)`:'');return false;
  }
  async pump() {
    if(this.running||this.closed)return;
    const now=Date.now(), j=this.jobs.find(j=>j.state==='queued'&&!(j.retryAt>now));
    if(!j){const later=this.jobs.filter(j=>j.state==='queued').map(j=>j.retryAt);if(later.length){clearTimeout(this.timer);this.timer=setTimeout(()=>this.pump(),Math.max(0,Math.min(...later)-now));this.timer.unref?.();}return;}
    this.done=new Promise(resolve=>{this.resolveDone=resolve;}); this.running=j; j.state='running'; this.saveJob(j);
    const dir=path.join(this.state,'jobs',j.id), p=path.join(dir,'recipe.json');
    try {
      if(json(p).kind==='technical-sheet'&&j.sourceDigest!==printDigest(json(p),dir))throw Error('Pinned print input changed after enqueue');
      const result=this.check(json(p),p);
      if(DOC_KINDS.includes(json(p).kind)&&j.operation!=='validate') await this.documentJob(j,dir,json(p),result);
      else if(j.operation==='validate') {
        atomic(path.join(dir,'validation.json'),JSON.stringify(result,null,2));
        j.artifacts=[{uri:uri(path.join(dir,'validation.json')),mime:'application/json',digest:digest(fs.readFileSync(path.join(dir,'validation.json')))}];
        j.state=result.valid?'succeeded':'failed'; j.reason=result.valid?'Checks passed; nothing rendered yet':'Checks failed: see errors';
      } else if(!result.valid) { j.state='failed'; j.reason='Checks failed: '+result.errors.join('; ').slice(0,800); }
      else if(j.operation==='render-html') { const html=preparePrint(json(p),dir); j.artifacts=[{uri:uri(html),mime:'text/html',digest:digest(fs.readFileSync(html)),bytes:fs.statSync(html).size}]; j.state='succeeded'; j.reason='HTML written; PDF on request (render-pdf)'; }
      else {
        const pdf=j.operation==='render-pdf',print=json(p).kind==='technical-sheet';
        const args=[path.join(STUDIO,'skills/_shared/scripts/safe_render.py'),'--profile',pdf?'heavy':'post-1080','--timeout',pdf?'180':'120','--',process.execPath,path.join(STUDIO,'engine/render.mjs'),p,'--only',pdf?'png,pdf':'png','--formats','4x5','--out',path.join(dir,'out')];
        if(print){if(!pdf)throw Error('Technical-sheet export requires render-pdf');const html=preparePrint(json(p),dir);args.splice(1,args.length-1,'--profile','print-family-a4','--timeout','150','--',process.execPath,path.join(STUDIO,'print/render.mjs'),html);}
        j.executionEvidence=args.slice(args.indexOf('--')+1).slice(0,2).concat(args[0]).map(p=>({uri:uri(p),digest:digest(fs.readFileSync(p))}));this.saveJob(j);
        const scratch=path.join(dir,'scratch');fs.mkdirSync(scratch,{recursive:true});
        const child=this.launch(PYTHON,args,{cwd:STUDIO,stdio:['ignore','pipe','pipe'],env:{...process.env,OMP_NUM_THREADS:'2',TMPDIR:scratch}}); this.child=child; this.writeOwner();
        j.log=''; const append=b=> { j.log=(j.log+b.toString()).slice(-Math.floor(LIMITS.logBytes/4)); };
        child.stdout.on('data',append);child.stderr.on('data',append);
        const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',resolve);});
        j.exitCode=code;
        if(!j.cancelRequested&&code===75&&this.waitTurn(j))return;
        if(!j.cancelRequested&&code!==75) {
          j.state=code===0?'succeeded':'failed';
          j.reason=code===76?'Stopped: the computer ran low on memory during the render; nothing was saved'
            :code===0?'Exported':'The renderer failed: see log';
        }
        const out=print?path.join(dir,'deps/pieces/datasheets',json(p).name):path.join(dir,'out');
        if(print&&fs.existsSync(path.join(out,'previews')))for(const f of fs.readdirSync(path.join(out,'previews')))fs.copyFileSync(path.join(out,'previews',f),path.join(out,f));
        if(fs.existsSync(out)) j.artifacts=fs.readdirSync(out).filter(f=>/\.(png|pdf|json|txt)$/.test(f)).slice(0,20).map(f=>{const p=path.join(out,f);return {uri:uri(p),mime:{'.png':'image/png','.pdf':'application/pdf','.json':'application/json','.txt':'text/plain'}[path.extname(p)],digest:digest(fs.readFileSync(p)),bytes:fs.statSync(p).size};});
        if(j.state==='succeeded' && !j.artifacts.some(a=>a.uri.endsWith(pdf?'.pdf':'.png'))) {j.state='failed';j.reason='Renderer returned success without the requested artifact';}
      }
      if(j.state==='succeeded'&&j.saveTo){
        const art=j.artifacts.find(x=>x.uri.endsWith(path.extname(j.saveTo)));
        try{if(!art)throw Error('no '+path.extname(j.saveTo)+' in this export');fs.copyFileSync(new URL(art.uri),j.saveTo,fs.constants.COPYFILE_EXCL);j.saved=uri(j.saveTo);}catch(e){j.reason+=`; not saved as ${path.basename(j.saveTo)}: ${e.message}`;}
      }
    } catch(e) { if(j.state!=='cancelled')j.state='failed';j.reason=String(e.message).slice(0,1000); }
    finally {if(j.cancelRequested){j.state='cancelled';j.reason='Cancelled';} if(j.state!=='queued')j.finishedAt=new Date().toISOString();this.saveJob(j);this.running=null;this.child=null;this.writeOwner();this.resolveDone();this.schedule(()=>this.pump());}
  }
  // Run a document generator: HTML only (no Chromium) or the full export under safe_render's document profile.
  async documentJob(j,dir,raw,result) {
    if(!result.valid){j.state='failed';j.reason='Document checks failed: '+result.errors.join('; ').slice(0,800);return;}
    const cmd=documentCommand(raw,dir,j.operation);
    if(cmd){
      const heavy=j.operation==='render-pdf';
      const args=heavy?[path.join(STUDIO,'skills/_shared/scripts/safe_render.py'),'--profile','document','--timeout','300','--',process.execPath,...cmd]:null;
      j.executionEvidence=cmd.slice(0,1).map(p=>({uri:uri(p),digest:digest(fs.readFileSync(p))}));this.saveJob(j);
      const scratch=path.join(dir,'scratch');fs.mkdirSync(scratch,{recursive:true});
      const child=heavy?this.launch(PYTHON,args,{cwd:STUDIO,stdio:['ignore','pipe','pipe'],env:{...process.env,OMP_NUM_THREADS:'2',TMPDIR:scratch,AIS_MCP_STATE:this.state}}):this.launch(process.execPath,cmd,{cwd:STUDIO,stdio:['ignore','pipe','pipe'],env:{...process.env,TMPDIR:scratch}});
      this.child=child;this.writeOwner();
      j.log='';const append=b=>{j.log=(j.log+b.toString()).slice(-Math.floor(LIMITS.logBytes/4));};child.stdout.on('data',append);child.stderr.on('data',append);
      const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',resolve);});j.exitCode=code;
      if(j.cancelRequested)return;
      if(code===75){if(this.waitTurn(j))return;}
      else {j.state=code===0?'succeeded':'failed';
        j.reason=code===76?'Stopped: the computer ran low on memory during the render; nothing was saved':code===0?(heavy?'Exported':'HTML written; render-pdf makes the PDF'):'The generator\'s checks failed or it errored: see log';}
    } else {j.state='succeeded';j.reason='HTML written; render-pdf makes the PDF';}
    j.artifacts=documentOutputs(raw,dir).filter(f=>j.operation==='render-pdf'||f.endsWith('.html')).slice(0,40).map(f=>({uri:uri(f),mime:{'.html':'text/html','.png':'image/png','.pdf':'application/pdf','.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation'}[path.extname(f)],digest:digest(fs.readFileSync(f)),bytes:fs.statSync(f).size}));
    if(j.state==='succeeded'&&j.operation==='render-pdf'&&!j.artifacts.some(a=>a.uri.endsWith('.pdf'))){j.state='failed';j.reason='Generator returned success without a PDF';}
    if(j.state==='succeeded'&&!j.artifacts.some(a=>a.uri.endsWith('.html'))){j.state='failed';j.reason='No HTML source in the job output';}
  }
  call(name,input) {
    const a=schemas[name].parse(input);
    if(name==='inspect_media')return this.inspectSuppliedMedia(a);
    return name==='studio_status'?{version:VERSION,setup:setupStatus(),
      makes:['Posts (PNG) and carousels of 3 to 10 slides (PDF and slide PNGs)','Brochures, catalogues and one-pagers (HTML, PDF and page PNGs)','Proposals and case-study sheets (PDF; price and calendar rows by slot; a case study exports only with the customer approval recorded)','The seven Spanish technical sheets (PDF)','Presentations (HTML, PDF, slide PNGs and PPTX)','Business cards and letterheads (HTML and PDF)'],
      edits:'Posts and carousels by field (headline, text, picture, caption); technical sheets by printChanges; brochures, catalogues and decks by slot (any text, picture or alt text)',
      cannot:['Render or edit video (clips can be found and their frames inspected)','Generate pictures','Publish or upload anything'],
      generators:Object.keys(generators).filter(k=>!k.startsWith('_')),limits:LIMITS}:this[METHODS[name]](a);
  }
}

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {Factory} from '../core.mjs';
import {STUDIO} from '../../engine/recipe.mjs';
import {resolveMediaReference} from '../media.mjs';
import { needsMedia } from './needs.mjs';

function fixture(t){
  const source=fs.mkdtempSync(path.join(STUDIO,'work/.media-input-test-'));
  const state=fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-group-design/media-test-'));
  const f=new Factory({state,schedule:()=>{}});
  t.after(async()=>{await f.close();fs.rmSync(source,{recursive:true,force:true});});
  return {f,source};
}
function routed(f,p,mime='text/plain'){
  return f.call('plan_piece',{intent:'Use this source for a post',kind:'post',media:[{path:p,mime}]}).media[0];
}

test('short UTF-8 source references read in bounded chunks with digest caching', { skip: needsMedia },t=>{
  const {f,source}=fixture(t),p=path.join(source,'brief.txt');fs.writeFileSync(p,'Lote y fecha. Café.');
  const m=routed(f,p);assert.equal(m.inspection,'read_instructions');assert.match(m.ref,/^media:/);
  const a=f.call('read_instructions',{ref:m.ref,chars:6});assert.equal(a.text,'Lote y');assert.equal(a.nextOffset,6);assert.equal(a.referenceOnly,true);
  const b=f.call('read_instructions',{ref:m.ref,offset:a.nextOffset,chars:30});assert.equal(b.text,' fecha. Café.');assert.equal(b.nextOffset,null);
  assert.equal(f.call('read_instructions',{ref:m.ref,ifDigest:a.digest}).unchanged,true);
  assert.throws(()=>f.call('read_instructions',{ref:m.ref,chars:3001}));
});

test('source mutation, cross-bundle references, non-text read and path injection are refused', { skip: needsMedia },t=>{
  const {f,source}=fixture(t),p=path.join(source,'brief.md');fs.writeFileSync(p,'Original');
  const m=routed(f,p);fs.writeFileSync(p,'Modified');assert.throws(()=>f.call('read_instructions',{ref:m.ref}),/changed/);
  assert.throws(()=>resolveMediaReference(f.state,m.ref.replace(/:0$/,':1')),/Unknown/);
  assert.throws(()=>f.call('inspect_media',{ref:'/etc/passwd'}));
  const image=routed(f,path.join(STUDIO,'library/media/real/rev360-cables_factory-floor.jpg'),'image/jpeg');
  assert.throws(()=>f.call('read_instructions',{ref:image.ref}),/inspect_media/);
});

test('supplied text rejects invalid UTF-8, later NUL bytes and oversized content',t=>{
  const {f,source}=fixture(t),p=path.join(source,'brief.txt');
  for(const bytes of [Buffer.from([0xc0,0xaf]),Buffer.concat([Buffer.from('x'.repeat(50)),Buffer.from([0])]),Buffer.alloc(65537,65)]){
    fs.writeFileSync(p,bytes);assert.throws(()=>routed(f,p));
  }
});

test('image probe reports native dimensions and digest without rasterising or modifying the original', { skip: needsMedia },t=>{
  const p=path.join(STUDIO,'library/media/real/rev360-cables_factory-floor.jpg');
  const before=fs.readFileSync(p);const req={path:p,mime:'image/jpeg',action:'probe',output:'/unused'};
  const r=spawnSync('python3',[path.join(STUDIO,'mcp/media-preview.py'),'--worker'],{input:JSON.stringify(req),encoding:'utf8',timeout:8000,maxBuffer:12000});
  assert.equal(r.status,0,r.stderr);const result=JSON.parse(r.stdout);assert.equal(result.state,'inspected');
  assert(result.metadata.width>0&&result.metadata.height>0);assert.equal(result.metadata.sha256.length,64);assert(!result.preview);assert.deepEqual(fs.readFileSync(p),before);
  assert(result.decoderUsage.workerPeakRssMiB>0);assert.equal(result.decoderUsage.largestChildPeakRssMiB,0);
});

test('media timestamps and closed-factory calls fail before creating an inspection worker', { skip: needsMedia },async t=>{
  const {f}=fixture(t);const m=routed(f,path.join(STUDIO,'library/media/real/rev360-cables_factory-floor.jpg'),'image/jpeg');
  await assert.rejects(f.call('inspect_media',{ref:m.ref,action:'preview',seconds:1}),/timestamps/);
  assert.throws(()=>f.call('inspect_media',{ref:m.ref,seconds:-1}));
  await f.close();assert.throws(()=>f.call('inspect_media',{ref:m.ref}),/closing/);
});

test('shutdown aborts an owned media process and retains exclusive state until it exits', { skip: needsMedia },async t=>{
  const {f}=fixture(t);const m=routed(f,path.join(STUDIO,'library/media/real/rev360-cables_factory-floor.jpg'),'image/jpeg');
  const work=f.call('inspect_media',{ref:m.ref,action:'probe'}).catch(e=>({error:e.message}));
  assert.equal(f.mediaTasks.size,1);assert.equal(f.mediaPids.size,1);const [pid]=f.mediaPids;
  assert.throws(()=>f.call('inspect_media',{ref:m.ref}),/One media/);
  const closing=f.close();assert(fs.existsSync(f.owner));assert.throws(()=>new Factory({state:f.state}));
  await closing;await work;assert(!fs.existsSync(f.owner));assert.equal(f.mediaTasks.size,0);assert.throws(()=>process.kill(pid,0));
});

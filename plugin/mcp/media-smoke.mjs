// Explicit, finite official-client media acceptance. Never part of an automatic render retry.
import {Client} from '@modelcontextprotocol/client';
import {StdioClientTransport} from '@modelcontextprotocol/client/stdio';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {STUDIO} from '../engine/recipe.mjs';
import {PREVIEW_BYTES} from './media.mjs';

// --e2e runs the per-piece-type end-to-end acceptance instead (mcp/e2e-smoke.mjs).
if(process.argv.includes('--e2e'))await import('./e2e-smoke.mjs');
else await (async()=>{
const state=fs.mkdtempSync(path.join(os.homedir(),'.cache/ais-group-design/mcp-media-stdio-'));
const transport=new StdioClientTransport({command:process.execPath,args:[path.join(STUDIO,'mcp/server.mjs')],cwd:STUDIO,env:{PATH:process.env.PATH,HOME:os.homedir(),AIS_MCP_STATE:state},stderr:'pipe'});
let stderr='';transport.stderr.on('data',b=>stderr=(stderr+b).slice(-2000));
const client=new Client({name:'ais-media-acceptance',version:'1.0.0'});
const record={state,calls:[],previews:[]};
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function fileSha(p){
 const fd=fs.openSync(p,'r'),buffer=Buffer.alloc(1024*1024),hash=createHash('sha256');
 try{let n;while((n=fs.readSync(fd,buffer,0,buffer.length,null)))hash.update(buffer.subarray(0,n));}
 finally{fs.closeSync(fd);}return hash.digest('hex');
}
async function call(name,args){
 const r=await client.callTool({name,arguments:args});
 assert(!r.isError,r.content[0]?.text);const data=JSON.parse(r.content[0].text);
 record.calls.push({name,state:data.state,textBytes:Buffer.byteLength(r.content[0].text)});
 assert(Buffer.byteLength(r.content[0].text)<=16000);
 const image=r.content.find(c=>c.type==='image');
 if(data.state==='previewed'){
  assert(image);const bytes=Buffer.from(image.data,'base64');assert(bytes.length<=PREVIEW_BYTES);
  assert.equal(sha(bytes),data.preview.sha256);assert.deepEqual(fs.readFileSync(fileURLToPath(data.preview.uri)),bytes);
  assert(data.preview.width<=960&&data.preview.height<=960);record.previews.push(data.preview);
 } else assert(!image);
 return data;
}
try{
 await client.connect(transport);record.server=client.getServerVersion();
 const tools=await client.listTools();assert(tools.tools.some(t=>t.name==='inspect_media'));
 const imagePath=path.join(STUDIO,'library/media/real/rev360-cables_factory-floor.jpg');
 const videoPath=path.join(STUDIO,'library/media/rev360/rev360-cables-demo.mp4');
 const sourceHashes={image:fileSha(imagePath),video:fileSha(videoPath)};
 const bundle=await call('plan_piece',{intent:'Prepare a Cables post from supplied copy, photograph and source footage',kind:'post',media:[
  {path:'pieces/posts/15-callout-code-legibility/copy-es.txt',mime:'text/plain',role:'Existing source copy; reference only'},
  {path:imagePath,mime:'image/jpeg',role:'Original installation context'},
  {path:videoPath,mime:'video/mp4',role:'Original footage'}]});
 record.bundle=bundle;
 record.text=await call('read_instructions',{ref:bundle.media[0].ref,chars:400});assert(record.text.referenceOnly&&record.text.text);
 record.textCached=await call('read_instructions',{ref:bundle.media[0].ref,ifDigest:record.text.digest});assert(record.textCached.unchanged);
 record.image=await call('inspect_media',{ref:bundle.media[1].ref,action:'preview'});
 if(record.image.state==='previewed')assert.equal(record.image.metadata.sha256,sourceHashes.image);
 record.videoProbe=await call('inspect_media',{ref:bundle.media[2].ref,action:'probe'});
 if(record.videoProbe.state==='inspected'){
  assert.equal(record.videoProbe.metadata.sha256,sourceHashes.video);
  record.frame=await call('inspect_media',{ref:bundle.media[2].ref,action:'preview',seconds:Math.min(20,record.videoProbe.metadata.durationSeconds/2)});
  if(record.frame.state==='previewed')assert.equal(record.frame.metadata.sha256,sourceHashes.video);
 }
 assert.equal(fileSha(imagePath),sourceHashes.image);assert.equal(fileSha(videoPath),sourceHashes.video);
 record.originalsUnchanged=true;
}finally{
 await client.close();record.stderr=stderr;record.ownerReleased=!fs.existsSync(path.join(state,'owner.json'));
 fs.writeFileSync(path.join(state,'acceptance.json'),JSON.stringify(record,null,2));
}
console.log(JSON.stringify({evidence:path.join(state,'acceptance.json'),image:record.image?.state,video:record.videoProbe?.state,frame:record.frame?.state,ownerReleased:record.ownerReleased,previews:record.previews.map(x=>x.uri)},null,2));
})();

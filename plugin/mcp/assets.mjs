import fs from 'node:fs';
import path from 'node:path';
import { STUDIO } from '../engine/recipe.mjs';
import { canFetch } from '../scripts/media.mjs';
import { modelFile } from './industrial-models.mjs';
const norm = s => String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const identities = ['cables','hopper','compact','pharma','standard','kariko','opticais','vacuum','rosepetal','v275'];
const tokens = s => norm(s).split(' ').filter(Boolean);
const identity = s => identities.filter(x=>tokens(s).includes(x));
const stop = new Set('create make using existing product image photo video source context linkedin post ais rev 360 technical sheet brochure for the and with about software'.split(' '));
export function assetSummary(x) {
 // A media library picture counts as available when it is here or can be fetched from the bucket on first use.
 let exists=false;
 if(x.kind==='machine-model')exists=Boolean(modelFile(x));
 else try{exists=fs.statSync(path.resolve(STUDIO,x.path)).isFile();}catch{exists=String(x.path).startsWith('library/media/')&&canFetch();}
 return {id:x.id,kind:x.kind,type:x.type,product:x.product,status:x.status,origin:x.origin,lang:x.lang ?? null,pathExists:exists,reason:String(x.reason||'').slice(0,650)};
}
export function searchAssets(assets,query='',filters={}) {
 const requested=identity(filters.product || query), terms=tokens(query).filter(t=>!stop.has(t));
 const isSoftware=x=>tokens(x).some(t=>['software','screen','interface','ui'].includes(t));
 const software=/\b(software|screen|interfaz|pantalla)\b/i.test(query);
 return assets.map(x=>{
  // Rejected work remains inspectable by explicit status/id, but is never a default candidate.
  if(x.status==='rejected' && filters.status!=='rejected')return null;
  const summary=assetSummary(x), own=identity(x.product), text=norm([x.id,x.product,x.type,x.kind,x.keywords].join(' '));
  if(Object.entries(filters).some(([k,v])=>v!==undefined && (k==='exists'?summary.pathExists!==v:k==='product'?(requested.length?false:norm(x.product)!==norm(v)):x[k]!==v))) return null;
  // Named products are constraints, never inferred equivalents. Composite Compact Pharma retains both tokens.
  if(requested.length && !requested.every(t=>own.includes(t))) return null;
  const matches=terms.filter(t=>text.split(' ').includes(t)).length;
  if(!requested.length && query && !matches && !(software && isSoftware(text)))return null;
  const score=requested.length*100-(requested.length?Math.max(0,own.length-requested.length)*20:0)+matches*5+(summary.pathExists?8:0)+(x.status==='approved'?6:x.status==='review'?3:0)+(software&&isSoftware(text)?50:0)+(['machine','in-production'].includes(x.type)?4:0);
  return {...summary,score,matchedIdentity:requested};
 }).filter(Boolean).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}

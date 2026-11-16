// Read-only inventory: every literal middle dot, including allowed Catalan spelling.
// node guide/scripts/audit-separators.mjs guide/src packages plugin/brand plugin/pieces
import fs from 'node:fs';
import path from 'node:path';
const rows=[];
function visit(p){
 if(!fs.existsSync(p))return;
 if(fs.statSync(p).isDirectory()){for(const f of fs.readdirSync(p))if(!['node_modules','.git','dist'].includes(f))visit(path.join(p,f));return;}
 if(!/\.(astro|mdx?|ts|json|vue|html|txt|[cm]?js)$/.test(p))return;
 fs.readFileSync(p,'utf8').split('\n').forEach((line,index)=>{
  for(const match of line.matchAll(/\u00b7/g))rows.push({file:p,line:index+1,column:match.index+1,allowed:/[lL]/.test(line[match.index-1]||'')&&/[lL]/.test(line[match.index+1]||''),text:line});
 });
}
process.argv.slice(2).forEach(visit);console.log(JSON.stringify(rows,null,2));

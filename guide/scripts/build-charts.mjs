// The public chart toolkit is the source for both live and exported guide examples.
import fs from 'node:fs';
import * as vega from 'vega';
import {compile} from 'vega-lite';
import {chartTime} from '../src/data/chart-time.mjs';
import {chartTerms} from '../src/data/chart-terms.mjs';
const pub=new URL('../public/',import.meta.url);
const titles=JSON.parse(fs.readFileSync(new URL('../src/data/chart-titles.json',import.meta.url)));
for(const [index,lang] of ['en','es','ca'].entries()) {
 vega.formatLocale({decimal:lang==='en'?'.':',',thousands:lang==='en'?',':'\u00a0',grouping:[3],currency:['','']});
 vega.timeFormatLocale(chartTime[lang]);
 fs.mkdirSync(new URL(`charts/${lang}/`,pub),{recursive:true});
 for(const file of fs.readdirSync(new URL('downloads/charts/specs/',pub))) {
  const name=file.replace('.vl.json','');
  const raw=fs.readFileSync(new URL(`downloads/charts/specs/${file}`,pub),'utf8');
  const base=JSON.parse(raw.replace(/"((?:[^"\\]|\\.)*)"/g,(m,k)=>chartTerms[lang]?.[k]?JSON.stringify(chartTerms[lang][k]):m));
  for(const dark of name==='line'?[false,true]:[false]) {
   const cfg=JSON.parse(fs.readFileSync(new URL(`downloads/charts/ais-vega-config${dark?'-dark':''}.json`,pub)));
   const spec={...base,width:640,title:titles[name][index],config:cfg};
   const view=new vega.View(vega.parse(compile(spec).spec),{renderer:'none'});
   const svg=await view.toSVG();view.finalize();fs.writeFileSync(new URL(`charts/${lang}/${name}${dark?'-dark':''}.svg`,pub),svg);
  }
 }
}

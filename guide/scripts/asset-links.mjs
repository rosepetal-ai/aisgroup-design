import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
const labels={en:{view:'View',download:'Download',tab:'opens in a new tab'},es:{view:'Ver',download:'Descargar',tab:'se abre en una pestaña nueva'},ca:{view:'Veure',download:'Baixa',tab:'s’obre en una pestanya nova'}};
const escape=s=>String(s).replace(/[&"<>]/g,c=>({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]));
// Format asset links at build time. No gallery script or custom media viewer ships to the browser.
export default function assetLinks(){return {name:'native-asset-links',hooks:{'astro:build:done':({dir,logger})=>{
 const root=fileURLToPath(dir);let count=0;
 for(const lang of ['en','es','ca']){
  const t=labels[lang];
  function walk(folder){for(const item of fs.readdirSync(folder,{withFileTypes:true})){
   const file=path.join(folder,item.name);if(item.isDirectory()){walk(file);continue;}if(!file.endsWith('.html'))continue;
   const html=fs.readFileSync(file,'utf8'),dom=parse(html),changes=[];
   for(const a of dom.querySelectorAll('.prose a[href]')){
    const href=a.getAttribute('href');if(!/\.(?:pdf|pptx|docx|svg|png|jpe?g|webp|gif|ico|mp4|webm|zip|json|txt|md|css|m?js|ttf|woff2?)(?:[?#]|$)/i.test(href)||a.hasAttribute('data-view')||a.hasAttribute('data-download'))continue;
    const plain=href.split('#')[0];let view=href.replace(/\.(?:pptx|docx)(?=[?#]|$)/i,'.pdf');
    if(/\.zip(?:[?#]|$)/i.test(href))view=a.querySelector('img')?.getAttribute('src')||`/${lang}/${href.includes('/icons/')?'icons':'assets'}/`;
    if(/\.(?:ttf|woff2?)(?:[?#]|$)/i.test(href))view=`/${lang}/typography/`;
    const name=(a.getAttribute('aria-label')||a.textContent.trim()||a.querySelector('img')?.getAttribute('alt')||path.basename(plain)).replace(/\s+/g,' ');
    const aria=name.includes(t.tab)?name:`${name}, ${t.tab}`;
    const viewLink=`<a data-view href="${escape(view)}" target="_blank" rel="noopener" aria-label="${escape(aria)}">${t.view}</a>`;
    const downLink=`<a data-download href="${escape(plain)}" download="${escape(a.getAttribute('download')||'')}" aria-label="${escape(t.download+' '+name)}">${t.download}</a>`;
    let replacement;
    if(a.querySelector('img,svg')||a.classList.contains('frame')||a.classList.contains('pattern-image')){
     a.setAttribute('href',view);a.setAttribute('target','_blank');a.setAttribute('rel','noopener');a.setAttribute('aria-label',aria);a.removeAttribute('download');
     // Kit/pattern thumbnails already have their two explicit actions.
     if(a.classList.contains('frame')||a.classList.contains('pattern-image')||a.classList.contains('dl-tile')||a.hasAttribute('data-asset-thumb'))replacement=a.outerHTML;
     else if(a.classList.contains('dl')){a.classList.remove('dl');a.classList.add('asset-thumbnail');replacement=`<div class="dl">${a.outerHTML}<span class="asset-actions">${viewLink}${downLink}</span></div>`;}
     else replacement=`${a.outerHTML}<span class="asset-actions">${viewLink}${downLink}</span>`;
    }else if((a.parentNode?.textContent||'').replace(a.textContent,'').replace(/[\s()[\],.;:«»—–-]/g,'')){
     // Inside a sentence or caption the file stays one plain link; the View and Download pair is for links on their own line.
     replacement=`<a href="${escape(plain)}" target="_blank" rel="noopener" aria-label="${escape(aria)}">${a.innerHTML}</a>`;
    }else replacement=`<span class="asset-actions"><span class="asset-format">${a.innerHTML}</span>${viewLink}${downLink}</span>`;
    changes.push({start:a.range[0],end:a.range[1],replacement});count++;
   }
   let out=html;for(const c of changes.sort((a,b)=>b.start-a.start))out=out.slice(0,c.start)+c.replacement+out.slice(c.end);
   if(out!==html)fs.writeFileSync(file,out);
  }}
  walk(path.join(root,lang));
 }
 logger.info(`${count} asset links use native tabs and plain download actions.`);
}}};}

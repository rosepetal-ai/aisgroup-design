document.addEventListener('astro:page-load',()=>{
 const lang=document.documentElement.lang as 'en'|'es'|'ca';const t={en:{copy:'Copy',copied:'Copied',left:'Scroll table left',right:'Scroll table right',table:'More table columns'},es:{copy:'Copiar',copied:'Copiado',left:'Desplazar la tabla a la izquierda',right:'Desplazar la tabla a la derecha',table:'Más columnas de la tabla'},ca:{copy:'Copia',copied:'Copiat',left:'Desplaça la taula cap a l’esquerra',right:'Desplaça la taula cap a la dreta',table:'Més columnes de la taula'}}[lang]||{copy:'Copy',copied:'Copied',left:'Left',right:'Right',table:'Table'};
 document.querySelectorAll<HTMLElement>('.prose pre').forEach(pre=>{
  if(pre.parentElement?.classList.contains('code-block'))return;
  const wrap=document.createElement('div');wrap.className='code-block';pre.before(wrap);wrap.append(pre);
  const button=document.createElement('button');button.type='button';button.className='copy-code';button.dataset.pagefindIgnore='';button.textContent=t.copy;button.setAttribute('aria-label',t.copy);wrap.prepend(button);
  button.addEventListener('click',async()=>{const text=pre.querySelector('code')?.textContent??pre.textContent??'';try{await navigator.clipboard.writeText(text);}catch{const field=document.createElement('textarea');field.value=text;field.style.position='fixed';field.style.opacity='0';document.body.append(field);field.select();document.execCommand('copy');field.remove();}button.textContent=t.copied;setTimeout(()=>button.textContent=t.copy,1600);});
 });
 const watchers:ResizeObserver[]=[];
 document.querySelectorAll<HTMLTableElement>('.prose table').forEach(table=>{
  if(table.closest('.pattern,.theme-tokens')||table.classList.contains('cat'))return;
  let wrap=table.parentElement!;
  if(!wrap.classList.contains('table-wrap')){const div=document.createElement('div');div.className='table-wrap';table.before(div);div.append(table);wrap=div;}
  if(wrap.dataset.enhanced)return;wrap.dataset.enhanced='';
  if((table.tHead?.rows[0]?.cells.length??0)>=3)wrap.classList.add('wide-data');
  const controls=document.createElement('div');controls.className='table-controls';controls.dataset.pagefindIgnore='';controls.setAttribute('role','group');controls.setAttribute('aria-label',t.table);
  const buttons=[t.left,t.right].map((name,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',name);button.innerHTML=`<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${i?'M5 12h14m-7-7 7 7-7 7':'M19 12H5m7 7-7-7 7-7'}"/></svg>`;button.addEventListener('click',()=>wrap.scrollBy({left:(i?1:-1)*wrap.clientWidth*.7,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));controls.append(button);return button;});
  const track=document.createElement('progress');track.max=1;track.setAttribute('aria-label',t.table);controls.insertBefore(track,buttons[1]);wrap.after(controls);
  const update=()=>{const distance=wrap.scrollWidth-wrap.clientWidth;controls.hidden=distance<2;if(distance>1){wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label',t.table);}buttons[0].disabled=wrap.scrollLeft<2;buttons[1].disabled=wrap.scrollLeft>=distance-2;track.value=distance?wrap.scrollLeft/distance:0;};wrap.addEventListener('scroll',update,{passive:true});const observer=new ResizeObserver(update);observer.observe(wrap);observer.observe(table);watchers.push(observer);update();
 });
 document.addEventListener('astro:before-swap',()=>watchers.forEach(o=>o.disconnect()),{once:true});
});

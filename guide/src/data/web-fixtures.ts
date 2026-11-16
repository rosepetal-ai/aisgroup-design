import filmChapters from './web-film-chapters.json';
import type {Lang} from '../i18n';
export function fixture(id:string,lang:Lang){
 const t={en:{language:'Language',opener:'Page opener',title:'Inspection systems',intro:'Machine vision for production lines.',form:'Contact form',fields:['Name','Company','Email','Phone','Sector','Role','City','Country'],message:'Message',privacy:'I accept the privacy policy',send:'Send message'},es:{language:'Idioma',opener:'Apertura de página',title:'Sistemas de inspección',intro:'Visión artificial para líneas de producción.',form:'Formulario de contacto',fields:['Nombre','Empresa','Correo electrónico','Teléfono','Sector','Cargo','Ciudad','País'],message:'Mensaje',privacy:'Acepto la política de privacidad',send:'Enviar mensaje'},ca:{language:'Llengua',opener:'Obertura de pàgina',title:'Sistemes d’inspecció',intro:'Visió artificial per a línies de producció.',form:'Formulari de contacte',fields:['Nom','Empresa','Correu electrònic','Telèfon','Sector','Càrrec','Ciutat','País'],message:'Missatge',privacy:'Accepto la política de privacitat',send:'Envia el missatge'}}[lang];
 const filmText={en:{title:'Rosepetal product tour',play:'Play product film',pause:'Pause product film',chapters:{}},es:{title:'Recorrido por Rosepetal',play:'Reproducir el vídeo',pause:'Pausar el vídeo',chapters:{'Label.':'Etiqueta.','Automate.':'Automatiza.','Validate.':'Valida.','Prepare.':'Prepara.','Train.':'Entrena.','Evaluate.':'Evalúa.','Inspect.':'Inspecciona.'}},ca:{title:'Recorregut per Rosepetal',play:'Reprodueix el vídeo',pause:'Posa el vídeo en pausa',chapters:{'Label.':'Etiqueta.','Automate.':'Automatitza.','Validate.':'Valida.','Prepare.':'Prepara.','Train.':'Entrena.','Evaluate.':'Avalua.','Inspect.':'Inspecciona.'}}}[lang];
 const chapters=filmChapters.map(chapter=>({...chapter,title:filmText.chapters[chapter.title]??chapter.title}));
 const codes={
 'product-film':`<figure class="product-film" data-chapters='${JSON.stringify(chapters)}'>
  <video width="1616" height="848" muted playsinline loop preload="metadata" poster="/examples/web/product-film/poster.webp" aria-label="${filmText.title}"><source src="/examples/web/product-film/rosepetal-product.mp4" type="video/mp4" /></video>
  <figcaption><span data-chapter>${chapters[0].title}</span><button type="button" class="film-control" data-play="${filmText.play}" data-pause="${filmText.pause}" aria-label="${filmText.play}" aria-pressed="false"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg></button></figcaption>
</figure>`,
 'language-picker':`<header class="site-bar"><details class="language" open><summary aria-label="${t.language}">${lang.toUpperCase()}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg></summary><ul>${(['en','es','ca'] as const).map(l=>l===lang?`<li><span aria-current="true" lang="${l}">${({en:'English',es:'Español',ca:'Català'})[l]}<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7"/></svg></span></li>`:`<li><a href="#${l}" hreflang="${l}" lang="${l}">${({en:'English',es:'Español',ca:'Català'})[l]}<small>${l.toUpperCase()}</small></a></li>`).join('')}</ul></details></header>`,
 'page-opener':`<header class="page-opener"><h1>${t.title}</h1><p>${t.intro}</p></header>`,
 'lead-form':`<form class="lead-form">
${t.fields.map((label,i)=>`  <label>${label}<input name="field${i}" type="${i===2?'email':i===3?'tel':'text'}" required /></label>`).join('\n')}
  <label class="full">${t.message}<textarea name="message" required></textarea></label>
  <label class="full consent"><input type="checkbox" required />${t.privacy}</label>
  <button type="submit">${t.send}</button>
</form>`
 };
 return {name:id==='product-film'?filmText.title:id==='language-picker'?t.language:id==='page-opener'?t.opener:t.form,code:codes[id as keyof typeof codes]};
}

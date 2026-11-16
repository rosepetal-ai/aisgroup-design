// SVG is an intermediate overlay canvas only; recipes use the catalogued raster exports.
import fs from 'node:fs';
import path from 'node:path';
import { renderOverlay } from '../../../brand/downloads/overlays/overlay.mjs';
const dest = path.resolve('library/media/3d/renders/carousel-application-labels');
fs.mkdirSync(dest, { recursive: true });
const det = path.resolve('library/media/3d/renders/rev360-standard-wine/det');
const photo = name => 'data:image/jpeg;base64,' + fs.readFileSync(path.join(det, `wine_det-${name}_round.jpg`)).toString('base64');
const data = svg => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
const geometry = JSON.parse(fs.readFileSync(path.join(dest, 'label-boxes.json')));
function compose(name, lang, marked, inset = false) {
  let body = '<rect width="1800" height="1350" fill="#F1F5F9"/>';
  for (const [x, shot] of [[0, 'ok'], [912, name]]) {
    let panel = `<svg xmlns="http://www.w3.org/2000/svg" width="888" height="1350"><rect width="888" height="1350" fill="#F1F5F9"/>`;
    // The marked panels leave room above the label for both the verdict and the defect tab.
    panel += marked
      ? `<svg y="150" width="888" height="1200" viewBox="156 0 888 1200"><image href="${photo(shot)}" width="1200" height="1200"/></svg>`
      : `<svg width="888" height="1350" viewBox="205 0 790 1200"><image href="${photo(shot)}" width="1200" height="1200"/></svg>`;
    panel += '</svg>';
    if (marked) {
      const items = [];
      if (x) {
        const b = { ...geometry[name === 'label-crooked' ? 'crooked' : 'ink'] };
        b.x -= 156; b.y += 150;
        b.label = name === 'label-crooked' ? (lang === 'es' ? 'etiqueta' : 'label') : (lang === 'es' ? 'falta de tinta' : 'missing ink');
        if (name === 'label-crooked') b.value = '4°';
        items.push(b);
      }
      // One shared overlay call positions tabs against the verdict, so neither can hide the other.
      panel = renderOverlay({width:888,height:1350,displayWidth:230,tone:'light',image:data(panel),verdict:{result:x ? 'reject':'pass',text:x ? 'NOK':'OK',detail:x ? lang==='es'?'1 defecto':'1 defect':''},items});
    }
    body += `<image href="${data(panel)}" x="${x}" width="888" height="1350"/>`;
  }
  if (inset) {
    // Literal crop of the identical NOK photograph, wholly inside the right panel.
    body += `<rect x="1020" y="910" width="680" height="330" fill="#fff" stroke="#17356E" stroke-width="3"/><svg x="1024" y="914" width="672" height="322" viewBox="535 435 360 173"><image href="${photo(name)}" width="1200" height="1200"/></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1350">${body}</svg>`;
}
fs.writeFileSync(path.join(dest,'hero-pair.svg'),compose('label-crooked','es',false));
for (const lang of ['es','en']) {
  fs.writeFileSync(path.join(dest,`slide-2_${lang}.svg`),compose('label-crooked',lang,true));
  fs.writeFileSync(path.join(dest,`slide-3_${lang}.svg`),compose('print-defect',lang,true,true));
}

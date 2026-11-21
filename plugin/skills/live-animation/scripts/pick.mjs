// node pick.mjs <url> <t> <x,y;x,y;...> : the mesh under each stage point (DEV __anim / __pl), at story time t
import { launchBrowser, prepPage, waitLive } from './lib.mjs';

const [url, t, pts] = process.argv.slice(2);
if (!url || !t || !pts) { console.error('usage: node pick.mjs <url> <t> "x,y;x,y"'); process.exit(2); }
const b = await launchBrowser();
const p = await b.newPage({ viewport: { width: Number(process.env.W ?? 1889), height: Number(process.env.H ?? 1069) } });
await prepPage(p);
await waitLive(p, `${url}${url.includes('?') ? '&' : '?'}t=${t}`, 800);
console.log(await p.evaluate((pts) => {
  const { scene, camera, THREE } = window.__anim ?? window.__pl;
  const c = document.querySelector('[data-anim-stage] canvas, .pl-canvas').getBoundingClientRect();
  const rc = new THREE.Raycaster();
  return pts.split(';').map((s) => {
    const [x, y] = s.split(',').map(Number);
    rc.setFromCamera(new THREE.Vector2(((x - c.left) / c.width) * 2 - 1, -(((y - c.top) / c.height) * 2 - 1)), camera);
    const h = rc.intersectObject(scene, true).find((i) => i.object.visible);
    if (!h) return `${s}: nothing`;
    let n = h.object, path = [];
    while (n && path.length < 4) { path.push(n.name || n.type); n = n.parent; }
    const m = Array.isArray(h.object.material) ? h.object.material[0] : h.object.material;
    return `${s}: ${path.join(' < ')} | mat ${m.name || m.type} | at ${h.point.toArray().map((v) => v.toFixed(3)).join(',')} | n ${h.face?.normal.toArray().map((v) => v.toFixed(2)).join(',')}`;
  }).join('\n');
}, pts));
await b.close();

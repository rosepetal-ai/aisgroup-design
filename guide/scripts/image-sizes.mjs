import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from 'image-size';

// Every local <img> in the built pages gets its file's width and height, so the browser keeps its space before it
// loads and nothing below it moves. SVGs only when they state a size themselves (otherwise CSS sizes them).
// Every link to a local picture, video or download also gets ?v=<content hash>: a changed file gets a new address,
// so no browser can show a copy it kept from before (the old 24 h image cache would otherwise outlive any header change).
export default function imageSizes() {
  return { name: 'guide-image-sizes', hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const root = fileURLToPath(dir), sizes = new Map();
      const size = (src) => {
        if (sizes.has(src)) return sizes.get(src);
        let s = null;
        try {
          const file = path.join(root, decodeURIComponent(src.split(/[?#]/)[0]));
          if (file.startsWith(root) && fs.statSync(file).isFile()) {
            if (file.endsWith('.svg')) {
              const head = fs.readFileSync(file, 'utf8').slice(0, 2000).match(/<svg\b[^>]*>/)?.[0] || '';
              const w = head.match(/\swidth="([\d.]+)(px)?"/)?.[1], h = head.match(/\sheight="([\d.]+)(px)?"/)?.[1];
              if (w && h) s = { width: Math.round(+w), height: Math.round(+h) };
            } else { const d = imageSize(fs.readFileSync(file)); if (d.width && d.height) s = { width: d.width, height: d.height }; }
          }
        } catch {}
        sizes.set(src, s); return s;
      };
      const hashes = new Map();
      const version = (url) => {
        if (url.startsWith('/_astro/') || url.includes('?')) return url;
        if (!hashes.has(url)) {
          let v = null;
          try { const f = path.join(root, decodeURIComponent(url.split('#')[0])); if (f.startsWith(root) && fs.statSync(f).isFile()) v = crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0, 8); } catch {}
          hashes.set(url, v);
        }
        const v = hashes.get(url); if (!v) return url;
        const [a, h] = url.split('#'); return `${a}?v=${v}` + (h ? '#' + h : '');
      };
      const FILE = /\s(src|href|poster)="(\/[^"?#]+\.(?:jpe?g|png|webp|gif|svg|mp4|webm|pdf|zip|pptx|docx|txt))"/gi;
      let pages = 0, imgs = 0;
      const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name.endsWith('.html')) {
          const html = fs.readFileSync(p, 'utf8');
          const out = html.replace(/<img\b[^>]*>/g, (tag) => {
            if (/\s(width|height)=/.test(tag)) return tag;
            const src = tag.match(/\ssrc="(\/[^"]+)"/)?.[1]; const s = src && size(src);
            if (!s) return tag;
            imgs++; return tag.replace(/^<img\b/, `<img width="${s.width}" height="${s.height}"`);
          }).replace(FILE, (m, attr, url) => ` ${attr}="${version(url)}"`);
          if (out !== html) { fs.writeFileSync(p, out); pages++; }
        }
      } };
      walk(root);
      logger.info(`Image sizes: ${imgs} images on ${pages} pages keep their space while loading.`);
    },
  } };
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { productImageError } from '../../engine/product-images.mjs';
import { checkRecipe } from '../../engine/recipe.mjs';
import { bannedImage, FLAT_LABEL_WINE } from '../../print/image-rules.mjs';

test('product evidence rejects SVG wrappers, unregistered copies and disguised vector files', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-product-images-'));
  try {
    const media = path.join(root, 'library/media'); fs.mkdirSync(media, { recursive: true });
    const shot = { evidence: 'render' }, entry = { origin: 'render' };
    const jpg = path.join(media, 'bottle.jpg');
    fs.writeFileSync(jpg, Buffer.from([255,216,255,224]));
    assert.equal(productImageError(jpg, shot, entry, root), null);
    const linkedStudio = path.join(root, 'linked-studio');
    fs.mkdirSync(path.join(linkedStudio, 'library'), { recursive: true });
    fs.symlinkSync(media, path.join(linkedStudio, 'library/media'), 'dir');
    assert.equal(productImageError(jpg, shot, entry, linkedStudio), null, 'shared library real paths stay valid');
    assert.match(productImageError(jpg, shot, undefined, root), /registered library raster/);
    const local = path.join(root, 'copy.jpg'); fs.copyFileSync(jpg, local);
    assert.match(productImageError(local, shot, entry, root), /registered library raster/);
    fs.writeFileSync(jpg, '<svg><image href="data:image/svg+xml;base64,abc"/></svg>');
    assert.match(productImageError(jpg, shot, entry, root), /SVG product imagery/);
    assert.match(productImageError(jpg, { ...shot, diagram: true }, entry, root), /SVG product imagery/);
    assert.match(productImageError(jpg, { diagram: true }, undefined, root), /embedded or linked/);
    fs.writeFileSync(jpg, '<svg><path d="M0 0L10 10"/></svg>');
    assert.equal(productImageError(jpg, { diagram: true }, undefined, root), null);
    assert.match(productImageError(jpg, {}, undefined, root), /diagram/);
    assert.ok(FLAT_LABEL_WINE.size >= 14);
    assert.equal(bannedImage(jpg), null);
    // A banned content hash remains banned after a rename, independently of the SVG check.
    const digest = createHash('md5').update(fs.readFileSync(jpg)).digest('hex');
    FLAT_LABEL_WINE.add(digest);
    try {
      fs.copyFileSync(jpg, local); assert.match(bannedImage(local), /flat-label wine/);
      const result = checkRecipe({name:'label-check',kind:'post',brand:'ais-vision-systems',lang:'es',formats:['4x5'],copy:'Envíanos muestras',shots:[{type:'hero',src:local,evidence:'render',headline:'Inspección de etiquetas',alt:'Botella de muestra.'}]}, root, path.join(root,'recipe.json'));
      assert.ok(result.errors.some(error => /flat-label wine/.test(error)), 'recipe validation must retain the central hash ban');
      assert.ok(result.errors.some(error => /SVG product imagery/.test(error)), 'recipe validation must invoke the product image gate');
    }
    finally { FLAT_LABEL_WINE.delete(digest); }
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

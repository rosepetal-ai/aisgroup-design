"""One-off migration of the audited photographic compositions in the existing post set.
Run from the studio with the export lock and nice -n 15. Requires Rsvg, Cairo and Pillow.
This does not qualify new drawings as product renders; new pieces need their own image review.
"""
import json,pathlib,re,base64,hashlib,shutil,subprocess,gi,cairo
from PIL import Image
from io import BytesIO
gi.require_version('Rsvg','2.0')
from gi.repository import Rsvg
R=pathlib.Path.cwd(); dest=R/'library/media/3d/renders/social-composites';dest.mkdir(exist_ok=True)
cat=json.load(open(R/'library/catalog.json')); known={a['path'] for a in cat['assets']};log=[]
def embedded(s):
 for typ,b in re.findall(r'data:image/([^;,]+)(?:;[^,]*)?,([^"\s]+)',s):
  data=base64.b64decode(b)
  if typ=='svg+xml':yield from embedded(data.decode())
  else:yield data
banned=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {FLAT_LABEL_WINE} from './print/image-rules.mjs';process.stdout.write(JSON.stringify([...FLAT_LABEL_WINE]))"]))
audited={'02-kariko','03-rev360-standard','06-rev360-pharma','15-callout-code-legibility','20-carousel-juice-hopper','21-carousel-vials-pharma','22-carousel-cans-reference','23-carousel-muesli-reference','26-features-kariko','29-carousel-product-hopper'}
for p in R.glob('pieces/posts/**/recipe*.json'):
 if p.parent.name not in audited:continue
 recipe=json.load(open(p));changed=False
 def scan(o,parent=None):
  global changed
  if isinstance(o,list):
   for x in o:scan(x,parent)
  if not isinstance(o,dict):return
  for k,v in list(o.items()):
   if k in ('src','bgSrc') and isinstance(v,str) and v.startswith('assets/'):
    src=p.parent/v
    if src.suffix=='.svg':
     data=src.read_text();rasters=list(embedded(data));assert rasters,src
     for raw in rasters:assert not any(hashlib.md5(raw).hexdigest().startswith(h) for h in banned),src
     h=Rsvg.Handle.new_from_data(data.encode());d=h.get_dimensions();out=dest/(p.parent.name+'-'+src.stem+'.png')
     surf=cairo.ImageSurface(cairo.FORMAT_ARGB32,d.width,d.height);ctx=cairo.Context(surf);h.render_cairo(ctx);surf.write_to_png(str(out));origin='render';size=[d.width,d.height]
    elif (o.get('evidence') or (parent or {}).get('evidence'))=='render':
     out=dest/(p.parent.name+'-'+src.name);shutil.copyfile(src,out);origin='render';size=list(Image.open(out).size)
    else:continue
    rel=str(out.relative_to(R));o[k]='@lib/'+str(out.relative_to(R/'library'));changed=True
    if rel not in known:
     cat['assets'].append(dict(id=out.stem,path=rel,kind='image',type='product',origin=origin,status='review',reason='Existing product photograph composition with inspection overlay; SVG wrapper replaced by raster. Embedded source hashes checked against the banned flat-label set.',source=str(src.relative_to(R)),size=size,brand=recipe['brand'],product=p.parent.name));known.add(rel)
    log.append(str(src.relative_to(R)))
   elif isinstance(v,(dict,list)):scan(v,o)
 scan(recipe)
 if changed:p.write_text(json.dumps(recipe,ensure_ascii=False,indent=2)+'\n')
(R/'library/catalog.json').write_text(json.dumps(cat,ensure_ascii=False,indent=2)+'\n')
print('\n'.join(sorted(set(log))))

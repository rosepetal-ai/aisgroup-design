#!/usr/bin/env python3
"""Build the stationery templates (business cards with demo contacts, blank letterhead). HTML only, no heavy processes."""
from pathlib import Path
import shutil, json, os, sys, re
REPO=Path(__file__).resolve().parents[1];K=REPO/'pieces/stationery';P=REPO/'brand'  # output: pieces/stationery; sources: brand/
# KIT_ROOT builds into another folder (tests, variants) without touching the delivered kit.
R=Path(os.environ.get('KIT_ROOT') or K);A=R/'assets'
for d in ['assets','logos','business-cards','letterhead','pictograms']:(R/d).mkdir(parents=True,exist_ok=True)
# The hexagon fields come from the one brand pattern generator (print/pattern.py, option A), never drawn here.
sys.path.insert(0,str(REPO/'print'));import pattern
# Cards are printed with 3 mm bleed (hex-card-bleed, 91 x 61 mm): same geometry as the 85 x 55 card (short side 55), field extended to the bleed.
for n in ['hex-card.svg','hex-card-bleed.svg','hex-letter.svg']:(A/n).write_text(pattern.render(*pattern.ASSETS['pieces/stationery/assets/'+n]))
for fn in ['Inter.ttf','InterMedium.ttf','InterSemiBold.ttf']:
 shutil.copy2(P/'kit/fonts'/fn,A/fn)
for fn in (P/'logos').glob('*.svg'):shutil.copy2(fn,R/'logos'/fn.name)
CSS='''@font-face{font-family:Inter;src:url('../assets/Inter.ttf');font-weight:400}@font-face{font-family:Inter;src:url('../assets/InterMedium.ttf');font-weight:500}*{box-sizing:border-box}body{margin:0;font-family:Inter,sans-serif;color:#0F1729}p{margin:0}.card{position:relative;width:91mm;height:61mm;overflow:hidden;page-break-after:always;padding:9mm}.front{background:#17356E;color:#fff;box-shadow:0 0 0 3mm #17356E}.front .hexfield{position:absolute;inset:0;background:url(../assets/hex-card-bleed.svg) right top/100% 100% no-repeat}.front img{position:absolute;left:9mm;bottom:9mm;width:24mm}.front small{position:absolute;right:9mm;bottom:9mm;font-size:8pt;color:#A7BFE4}.back h1{margin:0;font-size:12pt;line-height:1.2;font-weight:500}.role{font-size:8.5pt;color:#4B5563;margin-top:1mm}.contacts{position:absolute;left:9mm;bottom:9mm;right:9mm;font-size:8pt;line-height:1.6}.contacts a{color:#17356E;text-decoration:none}.contacts .addr{font-size:7pt;margin-top:2mm}.co{font-size:8pt;color:#3664B3;margin-top:2mm}@page{size:91mm 61mm;margin:0}'''
# Demo people: the templates never carry a real person's mobile number.
PEOPLE=[('laura-martin','Laura Martín','Responsable comercial','+34 600 000 000','laura.martin@rosepetal.ai'),('marc-puig','Marc Puig','Ingeniero de visión artificial','+34 600 000 001','marc.puig@rosepetal.ai')]
for slug,name,role,phone,email in PEOPLE:
 front='<section class="card front" data-bleed="3"><div class="hexfield"></div><img src="../logos/rosepetal-white.svg" alt="Rosepetal"><small>Parte de AIS Group</small></section>'
 back=f'<section class="card back" data-bleed="3"><h1>{name}</h1><p class="role">{role}</p><div class="contacts"><p>+34 931 003 035</p><p>{phone}</p><p>{email}</p><p>rosepetal.ai</p><p class="addr">Can Camps, 10<br>08202 Sabadell (Barcelona)</p></div></section>'
 (R/'business-cards'/f'{slug}.html').write_text(f'<!doctype html><html lang="es"><meta charset="utf-8"><title>{name} | Rosepetal</title><style>{CSS}</style><body>{front}{back}</body></html>')
# Useful blank stationery, rather than a sample letter containing fictitious recipients. A4 grid (Layout): 15 mm margins,
# the footer's three blocks on columns 1, 5 and 9 (12 x 10.4 mm, 5 mm gaps), white space above it instead of a rule.
lcss=CSS.split('.card{')[0]+'''@page{size:A4;margin:0}.letter{width:210mm;height:297mm;position:relative;padding:15mm}.letter img{width:20mm;position:relative}.letter .hexfield{position:absolute;right:0;top:0;width:110mm;height:120mm;background:url(../assets/hex-letter.svg) right top/100% 100% no-repeat}.foot{position:absolute;left:15mm;right:15mm;bottom:15mm;display:grid;grid-template-columns:repeat(3,1fr);column-gap:5mm;font-size:8.5pt;line-height:1.5;color:#4B5563}.foot b{font-weight:500;color:#0F1729}.foot em{font-style:normal;color:#3664B3}'''
(R/'letterhead/ais-vision-systems.html').write_text(f'<!doctype html><html lang="es"><meta charset="utf-8"><title>Papel de carta | AIS Vision Systems</title><style>{lcss}</style><body><section class="letter"><div class="hexfield"></div><img src="../logos/ais-vision-systems-blue.svg" alt="AIS Vision Systems"><footer class="foot"><div><b>AIS Vision Systems</b><br><em>Parte de AIS Group</em></div><div>Can Camps, 10<br>08202 Sabadell (Barcelona)</div><div>+34 931 003 035<br>aisvision.com</div></footer></section></body></html>')
# Logo source files, including blue and reversed versions, are original artwork.
iconmap={'scan-eye':'vision-artificial','scan-barcode':'automatic-identification','scan-text':'text-reading','shield-check':'verificacion','brain-circuit':'deep-learning','database':'trazabilidad','bot':'robotica','camera':'captura','settings':'integracion','headset':'soporte'}
for source,name in iconmap.items():
 p=P/f'downloads/icons/svg/{source}.svg'
 if p.exists():(R/'pictograms'/f'{name}.svg').write_text(p.read_text().replace('stroke="currentColor"','stroke="#17356E"'))
(R/'pictograms/mapping.json').write_text(json.dumps({a:b for a,b in iconmap.items() if (R/'pictograms'/f'{b}.svg').exists()},ensure_ascii=False,indent=2))
print('Built two demo business cards, blank letterhead, original logos, Lucide pictograms.')

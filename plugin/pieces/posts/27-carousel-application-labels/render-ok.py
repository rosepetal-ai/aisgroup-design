"""Run the unchanged round-label scene, then record model-projected inspection boxes.
Run from the original studio with safe_render --blender and two Blender threads.
"""
import runpy, json
from pathlib import Path
g = runpy.run_path(str(Path.cwd() / '3d/stillwine.py'))
S = g['S']; root = g['bpy'].data.objects['subject']; s0,s1,t0,t1 = g['LB']
crooked = g['box']('etiqueta torcida',g['world'](root,g['outline'](rot=4.0)))
pts=[g['surf_pt']('red','front',s0+x,t1-y) for x in (31,63) for y in (16,47)]
ink=g['box']('falta de tinta',g['world'](root,pts))
Path(S.OUT,'label-boxes.json').write_text(json.dumps(dict(crooked=crooked,ink=ink),indent=2))

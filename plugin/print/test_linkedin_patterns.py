"""Fast regressions for colour substitution and alpha, without generating or rasterising geometry."""
import unittest
from unittest.mock import patch
import linkedin_patterns as patterns
from landscape import round1

class LinkedInPatterns(unittest.TestCase):
    def test_recolour_does_not_recolour_new_white_ground(self):
        svg = '<svg><g fill="#17356E"><path fill="#17356E" stroke="#FFFFFF" stroke-opacity="0.360"/></g></svg>'
        with patch.object(patterns, 'banner_field', return_value=svg):
            out = patterns.landscape_banner('rolling', 1512, 256, 'blue-on-white')
        self.assertIn('fill="#FFFFFF"', out)
        self.assertIn('stroke="#17356E"', out)
        self.assertNotIn('fill="__GROUND__"', out)
        self.assertIn('stroke-opacity="0.240"', out)

    def test_coordinate_rounding_preserves_faint_alpha(self):
        out = round1('<svg><path d="M0.123,2.345L5.678,9.876Z" stroke-opacity="0.044"/></svg>')
        self.assertIn('M0.1,2.3L5.7,9.9Z', out)
        self.assertIn('stroke-opacity="0.044"', out)

    def test_rejected_variants_fail_before_writing(self):
        for variant in ['gentle', 'point', 'hexagon-landscape-gentle']:
            with self.assertRaises(ValueError): patterns.build(patterns.OUT, [variant])

class SurfaceVisibility(unittest.TestCase):
    def test_shared_edges_are_exact_and_have_two_incident_cells(self):
        from collections import Counter
        from landscape import lattice_vertices
        edges = Counter()
        for i in range(-4, 5):
            for j in range(-4, 5):
                vs = lattice_vertices(i, j)
                edges.update(tuple(sorted((a,b))) for a,b in zip(vs,vs[1:]+vs[:1]))
        self.assertEqual(max(edges.values()), 2)
        vs = lattice_vertices(0,0)
        self.assertTrue(all(edges[tuple(sorted((a,b)))] == 2 for a,b in zip(vs,vs[1:]+vs[:1])))

    def test_actual_mesh_emits_open_unique_edges_instead_of_folded_polygons(self):
        from landscape import cells, VARIANTS
        paths = [c[2] for c in cells(200,40,1.15,VARIANTS['rolling'],.3,15,ppx=.84)]
        self.assertGreater(len(paths),20)
        self.assertTrue(all('Z' not in p for p in paths))
        canonical = [min(p[1:], 'L'.join(reversed(p[1:].split('L')))) for p in paths]
        self.assertEqual(len(canonical),len(set(canonical)))

    def test_crest_hides_rear_edges_without_polygon_painter_sort(self):
        import numpy as np
        from landscape import visible_points, Camera
        camera = Camera(1512,256,(0,5,0),8,590,(.84,.3))
        def hill(x,z): return 4*np.exp(-((z-10)/2)**2) + x*0
        pts = [(0,float(hill(0,z)),z) for z in (5,10,15,20,30)]
        visible = visible_points(pts,camera,hill)
        self.assertEqual(visible,[True,True,False,False,False])
        self.assertEqual(visible,visible_points(pts,camera,hill,spacing=.0625))

if __name__ == '__main__': unittest.main()

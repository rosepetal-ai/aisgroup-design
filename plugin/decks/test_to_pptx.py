"""Regression checks for CSS image boxes clipped by a slide edge.

Run with the Python environment used by decks/build.mjs:
    python -m unittest discover -s decks -p 'test_to_pptx.py'
"""
import tempfile
import unittest
from pathlib import Path

from PIL import Image
from pptx import Presentation

from to_pptx import E, add_img


class ImageCropTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.base = Path(self.directory.name)
        Image.new('RGB', (1000, 500), 'white').save(self.base / 'photo.png')
        presentation = Presentation()
        self.slide = presentation.slides.add_slide(presentation.slide_layouts[6])

    def image(self, fit, **changes):
        box = dict(src='photo.png', nw=1000, nh=500, x=980, y=0,
                   w=1340, h=670, fit=fit, pos=[.5, .5],
                   clip=dict(x=980, y=0, w=940, h=670))
        box.update(changes)
        return add_img(self.slide, box, str(self.base), str(self.base / 'tmp'))

    def test_cover_clips_right_edge_without_recentering(self):
        picture = self.image('cover')
        self.assertEqual(picture.left, E(980))
        self.assertEqual(picture.width, E(940))
        self.assertAlmostEqual(picture.crop_left, 0, places=4)
        self.assertAlmostEqual(picture.crop_right, 400 / 1340, places=4)

    def test_contained_image_keeps_its_original_object_position(self):
        picture = self.image('contain', h=1000,
                             clip=dict(x=980, y=0, w=940, h=1000))
        self.assertEqual(picture.top, E(165))
        self.assertEqual(picture.height, E(670))
        self.assertAlmostEqual(picture.crop_left, 0, places=4)
        self.assertAlmostEqual(picture.crop_right, 400 / 1340, places=4)

    def test_image_outside_visible_clip_is_omitted(self):
        self.assertIsNone(self.image('contain', clip=dict(x=0, y=0, w=100, h=100)))


if __name__ == '__main__':
    unittest.main()

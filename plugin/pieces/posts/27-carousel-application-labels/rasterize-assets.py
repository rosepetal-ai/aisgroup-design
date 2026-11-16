"""Rasterise the overlay canvases; recipes never load SVG product imagery."""
from pathlib import Path
import gi, cairo
gi.require_version('Rsvg', '2.0')
from gi.repository import Rsvg
for p in Path('library/media/3d/renders/carousel-application-labels').glob('*.svg'):
    h = Rsvg.Handle.new_from_file(str(p))
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, 1800, 1350)
    viewport = Rsvg.Rectangle()
    viewport.x = viewport.y = 0
    viewport.width, viewport.height = 1800, 1350
    h.render_document(cairo.Context(surface), viewport)
    surface.write_to_png(str(p.with_suffix('.png')))

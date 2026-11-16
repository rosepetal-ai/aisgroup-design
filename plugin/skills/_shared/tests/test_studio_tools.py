"""Focused source-only tests. No browser, rasterization, Blender or remote writes."""
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/studio_tools.py'
spec = importlib.util.spec_from_file_location('studio_tools', SCRIPT)
tools = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tools)

class StudioTools(unittest.TestCase):
    def test_bind_real_cables_source_and_asset_links(self):
        source = tools.STUDIO / 'pieces/brochures/cables/cables.es.html'
        text = source.read_text()
        import re
        title = re.search(r'<title>(.*?)</title>', text).group(1)
        with tempfile.TemporaryDirectory(dir=Path.home() / '.cache') as tmp:
            folder = Path(tmp) / 'pieces/brochures/cables'
            folder.mkdir(parents=True)
            (folder.parent.parent / 'shared').symlink_to(tools.STUDIO / 'print', target_is_directory=True)
            (folder / 'assets').symlink_to(source.parent / 'assets', target_is_directory=True)
            layout, data, output = (folder / n for n in ('layout.html', 'content.es.json', 'cables.es.html'))
            layout.write_text(text.replace('<title>' + title + '</title>', '<title>{{titulo}}</title>'))
            data.write_text(json.dumps({'titulo': 'Cables <80 mm> & "inspección"'}))
            tools.bind(layout, data, output)
            result = tools.inspect_html(output)
            self.assertEqual([], result['missing_links'])
            self.assertEqual([], result['unfilled_tokens'])
            self.assertIn('Cables &lt;80 mm&gt; &amp; &quot;inspección&quot;', output.read_text())
            self.assertEqual(text, source.read_text())
            self.assertEqual(3, result['pages_or_slides_in_source'])

    def test_bind_rejects_missing_unused_nonstring_and_input_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            layout, data, output = (Path(tmp) / n for n in ('layout.html', 'data.json', 'out.html'))
            layout.write_text('<p>{{text}}</p>')
            for values in ({}, {'text':'ok','extra':'x'}, {'text':5}):
                data.write_text(json.dumps(values))
                with self.assertRaises(ValueError): tools.bind(layout, data, output)
                self.assertFalse(output.exists())
            data.write_text('{"text":"ok"}')
            with self.assertRaises(ValueError): tools.bind(layout, data, layout)

    def test_no_filename_or_prose_can_promote_and_stale_record_invalidates(self):
        with tempfile.TemporaryDirectory() as tmp:
            studio = Path(tmp)
            piece = studio / 'pieces/brochures/final'
            piece.mkdir(parents=True)
            source = piece / 'approved.es.html'
            source.write_text('<p>Real source</p>')
            source.with_suffix('.pdf').write_bytes(b'not a real PDF; fixture only')
            report = piece / 'RESULTS.md'
            rel = source.relative_to(studio).as_posix()
            report.write_text('APPROVED final perfect ' + rel)
            item = tools.inventory(studio)['assets'][0]
            self.assertEqual('no-current-review-record', item['review_status'])
            for shared in item['shared']:
                f = studio / shared
                f.parent.mkdir(parents=True, exist_ok=True)
                f.write_text('shared component fixture')
            required = [rel, *item['shared'], *item['exports']]
            record = {'source':rel, 'status':'reviewed', 'reviewer':'Fixture reviewer',
                      'checked_at':'2026-10-29', 'files': {p:hashlib.sha256((studio/p).read_bytes()).hexdigest() for p in required}}
            report.write_text('AIS-REVIEW ' + json.dumps(record))
            self.assertEqual('review-recorded', tools.inventory(studio)['assets'][0]['review_status'])
            (studio/item['shared'][0]).write_text('changed shared design')
            self.assertEqual('no-current-review-record', tools.inventory(studio)['assets'][0]['review_status'])

    def test_inspect_catches_missing_image_and_unfilled_content(self):
        with tempfile.TemporaryDirectory() as tmp:
            f = Path(tmp) / 'source.html'
            f.write_text('<p>{{title}}</p><img src="missing.png"><a href="#p">Local</a>')
            result = tools.inspect_html(f)
            self.assertEqual(['title'], result['unfilled_tokens'])
            self.assertEqual(1, len(result['missing_links']))

if __name__ == '__main__': unittest.main()

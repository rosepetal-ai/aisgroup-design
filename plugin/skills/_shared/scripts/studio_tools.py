#!/usr/bin/env python3
"""Lightweight AIS source tools. No renderer, network, promotion or original mutation."""
import argparse
from datetime import datetime, timezone
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

STUDIO = Path(__file__).resolve().parents[3]  # repo root
TOKEN = re.compile(r'{{\s*([^{}]+?)\s*}}')


def bind(layout, content, output):
    layout, content, output = map(Path, (layout, content, output))
    if output.resolve() in (layout.resolve(), content.resolve()):
        raise ValueError('output must differ from editable inputs')
    data = json.loads(content.read_text())
    if not isinstance(data, dict) or any(not isinstance(v, str) for v in data.values()):
        raise ValueError('content must be an object of string values')
    source = layout.read_text()
    keys = set(TOKEN.findall(source))
    if keys != set(data):
        raise ValueError(f'missing values: {sorted(keys - set(data))}; unused values: {sorted(set(data) - keys)}')
    # A text binder, not a code/markup templating language.
    if any(TOKEN.search(block) for block in re.findall(r'<(?:script|style)\b[^>]*>[\s\S]*?</(?:script|style)>', source, re.I)):
        raise ValueError('tokens are not supported in scripts or styles')
    result = TOKEN.sub(lambda m: html.escape(data[m[1]], quote=True), source)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(result)
    return {'output': str(output), 'bound_keys': sorted(keys), 'rendered': False}


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.pages = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'page' in a.get('class', '').split() or 'slide' in a.get('class', '').split():
            self.pages += 1
        for key in ('src', 'href'):
            if a.get(key):
                self.links.append((tag, a[key]))


def inspect_html(file):
    file = Path(file).resolve()
    doc = Links()
    source = file.read_text()
    doc.feed(source)
    missing, external, local = [], [], []
    for tag, raw in doc.links:
        u = urlsplit(raw)
        if u.scheme not in ('', 'file') or u.netloc:
            external.append(raw)
            continue
        if not u.path:
            continue
        p = Path(unquote(u.path))
        p = p if p.is_absolute() else file.parent / p
        (local if p.is_file() else missing).append({'tag': tag, 'path': str(p.resolve())})
    return {'file': str(file), 'pages_or_slides_in_source': doc.pages,
            'unfilled_tokens': sorted(set(TOKEN.findall(source))), 'local_links': local,
            'missing_links': missing, 'external_links': external,
            'limits': 'Static src/href only; no browser, CSS URLs, JS icons, font loading, crop or layout verification.'}


def inventory(studio):
    studio = Path(studio).resolve()
    relative = lambda p: p.relative_to(studio).as_posix()
    reports = sorted({p for root in ('pieces', 'work') for pat in ('RESULT*.md', 'result*.md') for p in studio.glob(f'{root}/**/{pat}')})
    report_data = [(p, p.read_text(errors='replace')) for p in reports]
    roots = [('print', 'pieces/brochures', '*.html'),
             ('social', 'pieces/posts', 'recipe-*.json'),
             ('deck', 'pieces/decks', 'content*.json')]
    items, errors = [], []
    for family, root, pattern in roots:
        for source in sorted((studio / root).glob('**/' + pattern)):
            if any(part.startswith('_') for part in source.relative_to(studio / root).parts):
                continue
            parent = source.parent
            entry = {'kind': family, 'editable': relative(source), 'review_status': 'no-current-review-record',
                     'exports': [], 'previews': [], 'review_evidence': [], 'gaps': []}
            try:
                if family == 'print':
                    entry['shared'] = ['print/system.css', 'print/render.mjs', 'print/assets/icons.js']
                    out = [source.with_suffix('.pdf')]
                    prev = list((parent / 'previews').glob(source.stem + '-*.png'))
                    for p in (parent / 'layout.html', *parent.glob('content.*.json')):
                        if p.is_file():
                            entry.setdefault('editable_inputs', []).append(relative(p))
                else:
                    data = json.loads(source.read_text())
                    if family == 'social':
                        entry['shared'] = ['engine/stage.html', 'engine/recipe.mjs', 'engine/render.mjs']
                        name = data['name']
                        out = list((parent / 'out').glob(name + '*.pdf')) + list((parent / 'out').glob(name + '*_copy.txt'))
                        prev = list((parent / 'out').glob(name + '*.png'))
                        entry['check_reports'] = [relative(p) for p in (parent / 'out').glob(name + '*_report.json')]
                    else:
                        entry['shared'] = ['decks/' + n for n in ('build.mjs', 'layouts.mjs', 'layouts.css', 'bands.mjs', 'runtime/base.css', 'runtime/stage.css', 'runtime/deck.js', 'to_pptx.py')]
                        name = data['meta']['file']
                        out = [parent / (name + ext) for ext in ('.html', '.pdf', '.pptx')]
                        prev = list((parent / 'slides').glob('*.png'))
                        entry['section_includes'] = [str((parent / s['include']).resolve().relative_to(studio)) for s in data['slides'] if s.get('include')]
                entry['exports'] = [relative(p) for p in sorted(out) if p.is_file()]
                entry['previews'] = [relative(p) for p in sorted(prev) if p.is_file()]
                if not entry['exports'] and not entry['previews']:
                    entry['gaps'].append('No existing export or preview')
                # Associate prose only by an explicit source path. Do not infer a verdict from a nearby word.
                for report, body in report_data:
                    lines = [line[:600] for line in body.splitlines() if entry['editable'] in line]
                    if lines:
                        entry['review_evidence'].append({'report': relative(report), 'excerpts': lines[:5]})
                    # Optional exact-file record: one JSON object per AIS-REVIEW line.
                    for line in body.splitlines():
                        if not line.startswith('AIS-REVIEW '):
                            continue
                        try:
                            record = json.loads(line[len('AIS-REVIEW '):])
                            if not isinstance(record, dict) or not isinstance(record.get('files', {}), dict):
                                raise ValueError('review record and files must be JSON objects')
                            if record.get('source') != entry['editable']:
                                continue
                            files = record.get('files', {})
                            required = {entry['editable'], *entry['shared'], *entry['exports'], *entry['previews']}
                            valid = bool(record.get('reviewer') and record.get('checked_at') and record.get('status') == 'reviewed' and required <= files.keys())
                            for key, digest in files.items():
                                p = (studio / key).resolve()
                                valid = valid and p.is_relative_to(studio) and p.is_file()
                                if valid:
                                    valid = hashlib.sha256(p.read_bytes()).hexdigest() == digest
                            if valid:
                                entry['review_status'] = 'review-recorded'
                                entry['review_evidence'].append({'report': relative(report), 'record': record})
                            else:
                                entry['gaps'].append('Review record incomplete or stale; recheck artifacts and dependencies')
                        except (ValueError, TypeError, OSError) as exc:
                            entry['gaps'].append('Invalid review record: ' + str(exc))
                if entry['review_status'] == 'no-current-review-record':
                    entry['gaps'].append('No current exact-file review record; inspect RESULTS evidence or review manually')
            except (KeyError, ValueError, OSError) as exc:
                entry['gaps'].append(str(exc))
                errors.append({'source': relative(source), 'error': str(exc)})
            items.append(entry)
    return {'generated_at': datetime.now(timezone.utc).isoformat(), 'studio': str(studio),
            'scope': 'Canonical working sources only. Existing files and review records do not mean user approval or release readiness.',
            'review_reports_found': [relative(p) for p in reports], 'assets': items, 'errors': errors}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest='command', required=True)
    b = sub.add_parser('bind', help='Escape string JSON values into {{tokens}} in existing shared-system HTML')
    for key in ('layout', 'content', 'output'):
        b.add_argument('--' + key, required=True)
    i = sub.add_parser('inspect', help='Read-only static HTML src/href and token check; does not render')
    i.add_argument('file')
    m = sub.add_parser('inventory', help='JSON to stdout; never promotes gallery/final entries')
    m.add_argument('--studio', type=Path, default=STUDIO)
    a = p.parse_args()
    try:
        if a.command == 'bind':
            result = bind(a.layout, a.content, a.output)
        elif a.command == 'inspect':
            result = inspect_html(a.file)
        else:
            result = inventory(a.studio)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        if a.command == 'inspect' and (result['missing_links'] or result['unfilled_tokens']):
            return 1
        return int(bool(result.get('errors')))
    except (ValueError, OSError) as exc:
        print(str(exc), file=sys.stderr)
        return 2

if __name__ == '__main__':
    sys.exit(main())

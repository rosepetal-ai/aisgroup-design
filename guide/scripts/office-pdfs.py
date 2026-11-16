"""Hash-checked LibreOffice PDF counterparts for every public DOCX and PPTX.
The caller holds /tmp/ais-marketing-render.lock for this command or the Astro build.
  python3 scripts/office-pdfs.py           render missing/changed sources, then check
  python3 scripts/office-pdfs.py --check   fail on any missing or stale PDF
"""
from pathlib import Path
from hashlib import sha256
import json, subprocess, shutil, sys
ROOT=Path(__file__).resolve().parents[1]; PUBLIC=ROOT/'public'
RECORD=ROOT/'src/data/office-pdfs.json'; CACHE=Path.home()/'.cache/ais-guide-office-pdfs'
def digest(p):return sha256(p.read_bytes()).hexdigest()
def sources():return sorted(p for p in PUBLIC.rglob('*') if p.is_file() and p.suffix.lower() in ['.pptx','.docx'])
def check(records):
 for office in sources():
  key='/'+office.relative_to(PUBLIC).as_posix();pdf=office.with_suffix('.pdf');entry=records.get(key,{})
  if not pdf.is_file() or entry.get('sourceHash')!=digest(office) or entry.get('pdfHash')!=digest(pdf):
   raise RuntimeError(f'Missing or stale Office PDF: {key}; run the guide build under the render lock')
if '--check' in sys.argv:
 check(json.loads(RECORD.read_text()) if RECORD.exists() else {});print('Office PDF hashes match every public DOCX and PPTX');sys.exit(0)
previous_records=json.loads(RECORD.read_text()) if RECORD.exists() else {}
records={}
for office in sources():
 source_hash=digest(office);key='/'+office.relative_to(PUBLIC).as_posix();pdf=office.with_suffix('.pdf')
 # An approved PDF may be restored or optimised without rebuilding its Office source.
 # Preserve that export only when this exact source was already rendered and the PDF is valid.
 if previous_records.get(key,{}).get('sourceHash')==source_hash and pdf.exists() and pdf.read_bytes().startswith(b'%PDF-'):
  records[key]={'pdf':'/'+pdf.relative_to(PUBLIC).as_posix(),'sourceHash':source_hash,'pdfHash':digest(pdf)}
  continue
 work=CACHE/source_hash;work.mkdir(parents=True,exist_ok=True);cached=work/(office.stem+'.pdf')
 # Reuse exact-source LibreOffice renders produced before the native-tab change.
 previous=Path.home()/'.cache/ais-guide-previews'/source_hash[:20]/(office.stem+'.pdf')
 if not cached.exists() and previous.exists():shutil.copyfile(previous,cached)
 if not cached.exists():
  subprocess.run(['soffice','-env:UserInstallation='+(work/'profile').as_uri(),'--headless','--convert-to','pdf','--outdir',str(work),str(office)],check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=180)
 if not cached.exists() or not cached.read_bytes().startswith(b'%PDF-'):raise RuntimeError(f'LibreOffice did not produce a valid PDF: {cached}')
 if digest(office)!=source_hash:
  cached.unlink();raise RuntimeError(f'Office source changed during export: {office}')
 if not pdf.exists() or digest(pdf)!=digest(cached):shutil.copyfile(cached,pdf)
 records[key]={'pdf':'/'+pdf.relative_to(PUBLIC).as_posix(),'sourceHash':source_hash,'pdfHash':digest(pdf)}
RECORD.write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n');check(records)
print(f'{len(records)} Office files have fresh sibling PDF renders')

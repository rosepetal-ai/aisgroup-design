#!/usr/bin/env python3
"""Finite renderer supervisor. No waiting for a busy shared lock.

Linux reads /proc and PSI directly. macOS and Windows (or AIS_PORTABLE_GUARD=1, which
forces that path on Linux for tests) keep the same limits through psutil.
"""
import argparse
import ctypes
import json
import os
import shutil
from pathlib import Path
import signal
import subprocess
import sys
import time

PORTABLE = sys.platform != 'linux' or os.environ.get('AIS_PORTABLE_GUARD') == '1'
WINDOWS = os.name == 'nt'
if WINDOWS:
    import msvcrt
else:
    import fcntl
if PORTABLE:
    try:
        import psutil
    except ImportError:
        sys.exit('psutil is missing: run npm run setup')
# The studio's `flock /tmp/ais-marketing-render.lock` uses the same files. TEMP, not TMPDIR:
# the MCP points TMPDIR at each job's scratch folder.
LOCK_DIR = Path(os.environ.get('TEMP', 'C:/Windows/Temp')) if WINDOWS else Path('/tmp')
# Processes that died while we hold no handle to them; os.kill on Windows raises plain OSError.
GONE = OSError if WINDOWS else (ProcessLookupError, ChildProcessError)
KILL = getattr(signal, 'SIGKILL', signal.SIGTERM)  # Windows: any signal is TerminateProcess

STUDIO = Path(__file__).resolve().parents[3]  # repo root (skills/_shared/scripts/)
# Explicit local installations, never inferred from a caller-controlled PATH. The account's home, not $HOME
# (claude plugin eval runs with a throwaway $HOME).
if WINDOWS:
    ACCOUNT_HOME = Path.home()
else:
    import pwd
    ACCOUNT_HOME = Path(pwd.getpwuid(os.getuid()).pw_dir)
# The node that runs the plugin (AIS_NODE, set by the MCP from its own process) and the one on PATH: whatever installer
# the person used (nodejs.org, Homebrew, nvm, Volta), never an arbitrary binary named by the request.
POST_NODE_BINARIES = {Path('/usr/bin/node').resolve()}
for candidate in (os.environ.get('AIS_NODE'), shutil.which('node')):
    if candidate and Path(candidate).name in ('node', 'node.exe') and Path(candidate).is_file():
        POST_NODE_BINARIES.add(Path(candidate).resolve())
# ponytail: the official installers only (Homebrew arm64/Intel or nodejs.org); add nvm/volta paths here if marketers use them
if sys.platform == 'darwin':
    POST_NODE_BINARIES |= {Path('/opt/homebrew/bin/node').resolve(), Path('/usr/local/bin/node').resolve()}
elif WINDOWS:
    POST_NODE_BINARIES.add((Path(os.environ.get('ProgramFiles', 'C:/Program Files')) / 'nodejs/node.exe').resolve())


def processes():
    if PORTABLE:
        return portable_processes()
    rows = {}
    for directory in Path('/proc').glob('[0-9]*'):
        try:
            stat = (directory / 'stat').read_text().rsplit(')', 1)[1].split()
            rows[int(directory.name)] = {'ppid': int(stat[1]), 'group': int(stat[2]),
                'start': stat[19], 'rss_mib': int(stat[21]) * os.sysconf('SC_PAGE_SIZE') / 1024**2,
                'state': stat[0]}
        except (OSError, ValueError, IndexError):
            pass
    return rows


def portable_processes():
    rows = {}
    for p in psutil.process_iter(['ppid', 'create_time', 'memory_info', 'status', 'name']):
        i = p.info
        if i['ppid'] is None or i['create_time'] is None:
            continue
        try:
            group = None if WINDOWS else os.getpgid(p.pid)
        except OSError:
            group = None
        # Other users' memory can be unreadable on macOS; our own tree always is.
        rows[p.pid] = {'ppid': i['ppid'], 'group': group, 'start': i['create_time'],
            'rss_mib': i['memory_info'].rss / 1024**2 if i['memory_info'] else 0,
            'state': 'Z' if i['status'] == psutil.STATUS_ZOMBIE else 'R', 'name': i['name'] or ''}
    return rows


def pressure_high(r):
    """Memory PSI is Linux-only; elsewhere the RAM reserve and tree RSS budget are the guard."""
    psi = r['psi_avg10']
    return psi is not None and (psi.get('some', 100) >= 1 or psi.get('full', 100) >= .1)


def memory_psi():
    psi = {}
    for line in Path('/proc/pressure/memory').read_text().splitlines():
        parts = line.split()
        psi[parts[0]] = float(dict(x.split('=') for x in parts[1:])['avg10'])
    return psi


def resources():
    if PORTABLE:
        available = psutil.virtual_memory().available / 1024**3
        # ponytail: PSI only where the kernel has it (Linux); kern.memorystatus_vm_pressure_level would be the macOS upgrade
        psi = memory_psi() if Path('/proc/pressure/memory').exists() else None
        me = psutil.Process()
        cpus = me.cpu_affinity() if hasattr(me, 'cpu_affinity') else list(range(os.cpu_count()))
    else:
        mem = dict(line.split(':', 1) for line in Path('/proc/meminfo').read_text().splitlines())
        available = int(mem['MemAvailable'].split()[0]) / 1024**2
        psi = memory_psi()
        cpus = os.sched_getaffinity(0)
    top, blenders = [], []
    for pid, row in processes().items():
        try:
            name = row['name'] if PORTABLE else Path(f'/proc/{pid}/comm').read_text().strip()
            top.append({'pid': pid, 'name': name, 'rss_mib': round(row['rss_mib'])})
            if name.lower().startswith('blender'):
                blenders.append(pid)
        except OSError:
            pass
    return {'available_gib': available,
            'psi_avg10': psi, 'largest_rss': sorted(top, key=lambda x: -x['rss_mib'])[:6],
            'blender_pids': blenders, 'allowed_cpus': sorted(cpus)}


def lower_priority():
    """nice 15 on CPUs 0,1 for this process and everything it starts afterwards."""
    if not PORTABLE:
        os.nice(15)
        os.sched_setaffinity(0, {0, 1})
        return
    me = psutil.Process()
    me.nice(psutil.BELOW_NORMAL_PRIORITY_CLASS if WINDOWS else max(me.nice(), 15))
    if hasattr(me, 'cpu_affinity'):  # macOS has no affinity API; low priority alone there
        me.cpu_affinity([0, 1])


def lock(name):
    """Nonblocking exclusive lock on a shared lock file; None when another job holds it."""
    f = open(LOCK_DIR / name, 'a')
    try:
        if WINDOWS:
            f.seek(0)
            msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
        return f
    except OSError:
        f.close()
        return None


def validate_post(command):
    if len(command) != 9:
        raise ValueError('post profile requires one recipe and exactly three fixed options')
    if Path(command[0]).resolve() not in POST_NODE_BINARIES or Path(command[1]).resolve() != STUDIO / 'engine/render.mjs':
        raise ValueError('post profile only permits the installed social renderer')
    # Square is smaller than the measured 1080x1350 portrait envelope. Keep
    # exactly one fixed-size still export, with the same RSS/reserve/PSI limits.
    format_name = command[6]
    if format_name not in ('4x5', '1x1') or command[3:8] != ['--only', 'png', '--formats', format_name, '--out']:
        raise ValueError('post profile flags are fixed')
    recipe = Path(command[2]).resolve()
    if recipe.stat().st_size > 65536:
        raise ValueError('recipe too large')
    raw = json.loads(recipe.read_text())
    if raw.get('kind') != 'post' or len(raw.get('shots', [])) != 1 or format_name not in (raw.get('formats') or ['4x5']):
        raise ValueError('post profile needs one static 4x5 or 1x1 shot matching the command')
    if not str(raw.get('name', '')).replace('-', '').replace('_', '').isalnum():
        raise ValueError('unsafe output name')
    from PIL import Image
    total = 0
    def walk(value):
        nonlocal total
        if isinstance(value, dict):
            for key, item in value.items():
                if key in ('captionsFrom', 'voice', 'video', 'duration', 'fps'):
                    raise ValueError('motion/audio fields excluded from post profile')
                if key in ('src', 'bgSrc', 'portrait') and isinstance(item, str):
                    if item.startswith('@lib/'):
                        item = str(STUDIO / 'library' / item[5:])
                    elif item.startswith('@guide/'):
                        item = str(STUDIO.parent / 'public' / item[7:])
                    asset = (recipe.parent / item).resolve()
                    roots = [STUDIO / 'library/media', STUDIO.parent / 'public']
                    if not any(asset.is_relative_to(root.resolve()) for root in roots):
                        raise ValueError('post image outside approved roots')
                    total += asset.stat().st_size
                    with Image.open(asset) as image:
                        if image.format not in ('PNG', 'JPEG', 'WEBP') or image.width * image.height > 16_000_000 or getattr(image, 'n_frames', 1) != 1:
                            raise ValueError('post image exceeds static 16MP budget')
                else:
                    walk(item)
        elif isinstance(value, list):
            for item in value:
                walk(item)
    walk(raw)
    if total > 32 * 1024**2:
        raise ValueError('post images exceed 32 MiB')
    return {'format': format_name, 'outputPixels': 1080 * (1350 if format_name == '4x5' else 1080),
            'rasterBytes': total, 'shots': 1}


def validate_print(command):
    """Only registered four-page Spanish family snapshots, never arbitrary print HTML."""
    import re
    import hashlib
    if len(command) != 3 or Path(command[0]).resolve() not in POST_NODE_BINARIES or Path(command[1]).resolve() != STUDIO / 'print/render.mjs':
        raise ValueError('print profile only permits the installed print renderer without flags')
    page = Path(command[2]).resolve()
    family_path = STUDIO / 'mcp/print-family.json'
    family = json.loads(family_path.read_text())
    key = page.parent.name
    config = family['products'].get(key)
    if not config or page.name != key + '.export.es.html' or page.parent.parts[-3:] != ('pieces', 'datasheets', key):
        raise ValueError('print profile needs registered Spanish family output')
    job = page.parents[4]
    if page.parents[3].name != 'deps':
        raise ValueError('print snapshot root missing')
    raw = json.loads((job / 'recipe.json').read_text())
    if raw.get('kind') != 'technical-sheet' or raw.get('name') != key or raw.get('template') != 'deps/' + config['template'] or raw.get('lang') != 'es':
        raise ValueError('print source identity mismatch')
    # The server compiles typed data before enqueue/launch. Verify its evidence
    # without spawning an unowned Node preflight process ahead of the supervisor.
    sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
    receipt = json.loads((job / 'binding-evidence.json').read_text())
    expected = {'htmlDigest': sha(page), 'recipeDigest': sha(job / 'recipe.json'),
                'manifestDigest': sha(job / 'dependencies.json'), 'binderDigest': sha(STUDIO / 'mcp/print.mjs'), 'familyDigest': sha(family_path)}
    if receipt != expected:
        raise ValueError('print binding evidence is stale or generated HTML was modified')
    if sha(job / 'deps' / config['template']) != config['sourceDigest']:
        raise ValueError('registered print template hash mismatch')
    manifest = json.loads((job / 'dependencies.json').read_text())
    if manifest.get('product') != key or manifest.get('sourceDigest') != config['sourceDigest'] or manifest.get('familyDigest') != sha(family_path):
        raise ValueError('unregistered/stale print family manifest')
    if len(manifest['files']) > 80:
        raise ValueError('print dependency count cap')
    for item in manifest['files']:
        dependency = (job / item['path']).resolve()
        if not dependency.is_relative_to(job / 'deps') or sha(dependency) != item['digest']:
            raise ValueError('print dependency missing/stale/outside snapshot')
    text = page.read_text()
    if len(text.encode()) > 131072 or len(re.findall(r'<section class="page\b', text)) != 4:
        raise ValueError('print profile needs exactly four bounded pages')
    from PIL import Image
    total = pixels = raster_count = 0
    for ref in re.findall(r'<img[^>]+src="([^"]+)"', text):
        asset = (page.parent / ref).resolve()
        if not asset.is_relative_to(job / 'deps'):
            raise ValueError('print image escapes isolated snapshot')
        if asset.suffix.lower() == '.svg':
            # Only the already pinned print-system logo/decorative assets.
            if not asset.is_relative_to(job / 'deps/print/assets'):
                raise ValueError('unexpected print SVG')
            continue
        total += asset.stat().st_size
        raster_count += 1
        with Image.open(asset) as image:
            pixels += image.width * image.height
            if image.format not in ('PNG', 'JPEG', 'WEBP') or image.width * image.height > 16_000_000 or getattr(image, 'n_frames', 1) != 1:
                raise ValueError('print image exceeds static 16MP budget')
    if total > 32 * 1024**2:
        raise ValueError('print raster inputs exceed 32 MiB')

    if raster_count != config['inputs']['rasterCount'] or pixels > config['inputs']['maxTotalPixels']:
        raise ValueError('print inputs exceed registered family count/decoded-pixel envelope')
    return {'family': family['family'], 'product': key, 'sourceDigest': config['sourceDigest'],
            'pages': family['pages'], 'rasterInputs': raster_count, 'rasterPixels': pixels, 'rasterBytes': total}


def owned_rows(root, known):
    rows = processes()
    owners = {root, os.getpid()}
    changed = True
    while changed:
        changed = False
        for pid, row in rows.items():
            if pid != os.getpid() and (row['ppid'] in owners or row['group'] == root or known.get(pid) == row['start']):
                if pid not in owners:
                    owners.add(pid)
                    changed = True
                known[pid] = row['start']
    return {pid: row for pid, row in rows.items() if pid != os.getpid() and known.get(pid) == row['start']}


def supervise(child, timeout, budget_mib, reserve_gib, sample=0.2):
    start, peak, known = time.monotonic(), 0, {}
    reason, code, samples = None, None, 0
    minimum_available, maximum_psi = float('inf'), {'some': 0, 'full': 0}
    while True:
        rows = owned_rows(child.pid, known)
        rss = sum(row['rss_mib'] for row in rows.values())
        peak = max(peak, rss)
        r = resources()
        samples += 1
        minimum_available = min(minimum_available, r['available_gib'])
        if r['psi_avg10'] is None:
            maximum_psi = None
        else:
            for key in maximum_psi:
                maximum_psi[key] = max(maximum_psi[key], r['psi_avg10'].get(key, 100))
        if rss > budget_mib:
            reason, code = 'owned process tree RSS budget exceeded', 76
        elif r['available_gib'] < reserve_gib or pressure_high(r):
            reason, code = 'runtime RAM reserve/PSI exceeded', 76
        elif time.monotonic() - start >= timeout:
            reason, code = 'timeout', 124
        if reason or child.poll() is not None:
            break
        time.sleep(sample)
    return code if code is not None else child.returncode, {'reason': reason or 'completed', 'peak_tree_rss_mib': round(peak, 2), 'samples': samples, 'minimum_available_gib': round(minimum_available, 3), 'maximum_psi_avg10': maximum_psi, 'seconds': round(time.monotonic()-start, 2)}, known


def remaining(child, known):
    """Owned processes still present. On Windows our Popen handle keeps an exited root listed; skip it.
    Without the subreaper an orphan's zombie belongs to whoever adopted it: it holds no memory, count it gone."""
    child.poll()
    return {pid: row for pid, row in owned_rows(child.pid, known).items()
            if (pid != child.pid or child.returncode is None) and not (PORTABLE and row['state'] == 'Z')}


def cleanup(child, known):
    # Linux subreaper adopts grandchildren even when the direct child exits first. macOS/Windows have
    # none: orphans stay owned through the pid + start time recorded while sampling (and the POSIX group).
    # ponytail: a grandchild born and orphaned within one 0.2 s sample escapes there; Job Objects (Windows) would close it
    # Keep the global lock until every owned live descendant has exited and is reaped.
    for sig, duration in ((signal.SIGTERM, 2), (KILL, 3)):
        deadline = time.monotonic() + duration
        while True:
            rows = remaining(child, known)
            for pid, row in rows.items():
                if row['state'] != 'Z':
                    try:
                        os.kill(pid, sig)
                    except GONE:
                        pass
            while not WINDOWS:  # Windows has no zombies to reap
                try:
                    if os.waitpid(-1, os.WNOHANG)[0] == 0:
                        break
                except ChildProcessError:
                    break
            if not remaining(child, known):
                return
            if time.monotonic() >= deadline:
                break
            time.sleep(.05)
    # Fail closed: do not release the lock with an owned live process remaining.
    while remaining(child, known):
        for pid in remaining(child, known):
            try:
                os.kill(pid, KILL)
                if not WINDOWS:
                    os.waitpid(pid, os.WNOHANG)
            except GONE:
                pass
        time.sleep(.1)

DOCUMENT_GENERATORS = {'print/render.mjs': 'print', 'decks/build.mjs': 'deck', 'stationery/export.mjs': 'kit'}


def validate_document(command):
    """The canonical document generators only (print-family.json "generators"): v2 print HTML, deck content, kit stationery.
    Bounded pages/slides and raster inputs; the input lives in pieces/, work/, ~/.cache/ais-group-design or the studio MCP's working folder."""
    import re
    if len(command) < 3 or Path(command[0]).resolve() not in POST_NODE_BINARIES:
        raise ValueError('document profile needs the installed node and one canonical generator')
    script = Path(command[1]).resolve()
    kind = next((k for rel, k in DOCUMENT_GENERATORS.items() if script == STUDIO / rel), None)
    if not kind:
        raise ValueError('document profile only permits print/render.mjs, the deck build.mjs or the kit export.mjs')
    args = command[2:]
    flags = [a for a in args if a.startswith('--')]
    if (kind != 'deck' and flags) or (kind == 'deck' and flags not in ([], ['--html-only'])) or len(args) - len(flags) != 1:
        raise ValueError('document profile takes exactly one input and no renderer flags (decks: --html-only)')
    entry = Path(next(a for a in args if not a.startswith('--'))).resolve()
    roots = [STUDIO / 'pieces', STUDIO / 'work', (Path.home() / '.cache/ais-group-design').resolve()]
    # The studio MCP names its own working folder (its copies and export jobs) when it starts this guard.
    if os.environ.get('AIS_MCP_STATE'):
        roots.append(Path(os.environ['AIS_MCP_STATE']).resolve())
    if not entry.is_file() or not any(entry.is_relative_to(r) for r in roots):
        raise ValueError("document input must be a file in pieces/, work/, ~/.cache/ais-group-design or the studio's working folder")
    from PIL import Image
    pixels = total = 0
    def raster(path):
        nonlocal pixels, total
        if path.suffix.lower() not in ('.jpg', '.jpeg', '.png', '.webp') or not path.is_file():
            return
        total += path.stat().st_size
        with Image.open(path) as image:
            if image.width * image.height > 40_000_000 or getattr(image, 'n_frames', 1) != 1:
                raise ValueError('document image exceeds the static 40 MP budget')
            pixels += image.width * image.height
    if kind == 'deck':
        if entry.suffix != '.json':
            raise ValueError('deck build takes a content.<lang>.json')
        def slides(path):
            out = []
            for s in json.loads(path.read_text()).get('slides', []):
                out += slides((path.parent / s['include']).resolve()) if 'include' in s else [s]
            return out
        deck = slides(entry)
        if not 0 < len(deck) <= 40:
            raise ValueError('document profile exports 1 to 40 slides')
        for src in set(re.findall(r'"src":\s*"([^"]+)"|"image":\s*"([^"]+)"', json.dumps(deck))):
            src = next(x for x in src if x)
            raster(STUDIO / 'decks/assets' / src[4:] if src.startswith('tpl:') else STUDIO / src)
        count = len(deck)
    else:
        if entry.suffix != '.html':
            raise ValueError('print and kit generators take one HTML file')
        text = entry.read_text()
        count = len(re.findall(r'<section class="page\b', text)) if kind == 'print' else len(re.findall(r'class="(?:card|letter)\b', text))
        if not 0 < count <= (16 if kind == 'print' else 4):
            raise ValueError('document profile exports 1 to 16 print pages or 1 to 4 stationery boards')
        for ref in re.findall(r'<img[^>]+src="([^"]+)"', text):
            raster((entry.parent / ref).resolve())
    if pixels > 400_000_000 or total > 160 * 1024**2:
        raise ValueError('document raster inputs exceed 400 MP / 160 MiB')
    return {'generator': kind, 'input': str(entry), 'units': count, 'rasterPixels': pixels, 'rasterBytes': total}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--check', action='store_true')
    p.add_argument('--blender', action='store_true')
    p.add_argument('--profile', choices=['heavy', 'post-1080', 'print-cables-a4', 'print-family-a4', 'document'], default='heavy')
    p.add_argument('--min-available-gib', type=float, default=6)
    p.add_argument('--timeout', type=int, default=480)
    p.add_argument('command', nargs=argparse.REMAINDER)
    a = p.parse_args()
    if a.min_available_gib < 6 or not 0 < a.timeout <= 3600:
        p.error('heavy minimum is 6 GiB; timeout must be 1..3600 seconds')
    command = a.command[1:] if a.command[:1] == ['--'] else a.command
    light = a.profile != 'heavy'
    print_job = a.profile in ('print-cables-a4', 'print-family-a4')
    workload = None
    if light:
        if a.blender or a.timeout > (300 if a.profile == 'document' else 150 if print_job else 120):
            p.error('light profile excludes Blender and exceeds finite workload deadline')
        try:
            workload = (validate_document if a.profile == 'document' else validate_print if print_job else validate_post)(command)
            if a.profile == 'print-cables-a4' and Path(command[2]).name != 'cables.export.es.html':
                raise ValueError('legacy Cables profile excludes other family members')
        except (ValueError, OSError, KeyError, TypeError, subprocess.SubprocessError) as e:
            p.error(str(e))
    elif not a.check and not command:
        p.error('command required')
    # document: Chromium on a bounded print piece, deck or stationery board (plus the deck's python-pptx step).
    budget_mib, reserve_gib = (2048, 2) if a.profile == 'document' else (1024, 2) if light else ((a.min_available_gib - 2) * 1024, 2)
    required = reserve_gib + budget_mib / 1024
    r, reasons = resources(), []
    if r['available_gib'] < required:
        reasons.append('insufficient available RAM for budget plus reserve')
    if pressure_high(r):
        reasons.append('current memory PSI is high')
    if not {0, 1}.issubset(r['allowed_cpus']):
        reasons.append('required CPUs 0,1 unavailable')
    if r['blender_pids']:
        reasons.append('Blender already active')
    locks = []
    try:
        for name in (['ais-marketing-render.lock', 'ais-blender.lock'] if a.blender else ['ais-marketing-render.lock']):
            f = lock(name)
            if f:
                locks.append(f)
            else:
                reasons.append('lock busy: ' + name)
        print(json.dumps({'resources': r, 'portable': PORTABLE, 'blocked_by': reasons, 'check_only': a.check, 'profile': a.profile,
            'budget_mib': budget_mib, 'reserve_gib': reserve_gib, 'workload': workload}), flush=True)
        if reasons:
            return 75
        if a.check:
            return 0
        # Adopt orphaned descendants so cleanup can wait for actual exit, not just root exit.
        if not PORTABLE and ctypes.CDLL(None).prctl(36, 1, 0, 0, 0) != 0:
            raise RuntimeError('cannot enable child subreaper')
        env = dict(os.environ, OMP_NUM_THREADS='2', OPENBLAS_NUM_THREADS='2', THREADS='2')
        for key in ('NODE_OPTIONS', 'NODE_PATH', 'LD_PRELOAD', 'LD_LIBRARY_PATH', 'DYLD_INSERT_LIBRARIES'):
            env.pop(key, None)
        if a.blender and Path(command[0]).name == 'blender':
            cut = command.index('--') if '--' in command else len(command)
            opts, script_args, clean = command[1:cut], command[cut:], []
            i = 0
            while i < len(opts):
                if opts[i] in ('-t', '--threads'):
                    i += 2
                    continue
                if not opts[i].startswith('--threads='):
                    clean.append(opts[i])
                i += 1
            command = [command[0], *clean, '-t', '2', *script_args]
        def stop_signal(signum, frame):
            raise KeyboardInterrupt
        previous = {s: signal.signal(s, stop_signal) for s in (signal.SIGTERM, signal.SIGINT)}
        child, known, report = None, {}, {'reason': 'cancelled'}
        try:
            if PORTABLE:
                # No nice/taskset binaries: lower this supervisor, and the child tree inherits it.
                # ponytail: Windows cannot hand the lock to the child; if this supervisor is killed the lock frees early
                lower_priority()
                child = subprocess.Popen(command, env=env, start_new_session=True,
                    pass_fds=() if WINDOWS else tuple(f.fileno() for f in locks))
            else:
                child = subprocess.Popen(['/usr/bin/nice', '-n', '15', '/usr/bin/taskset', '-c', '0,1', *command], env=env,
                    start_new_session=True, pass_fds=tuple(f.fileno() for f in locks))
            code, report, known = supervise(child, a.timeout, budget_mib, reserve_gib)
            return code
        except KeyboardInterrupt:
            return 130
        finally:
            for s in previous:
                signal.signal(s, signal.SIG_IGN)
            if child:
                cleanup(child, known)
            print(json.dumps({'supervision': report, 'cleanup_complete': True}), flush=True)
            for s, handler in previous.items():
                signal.signal(s, handler)
    finally:
        for f in reversed(locks):
            f.close()

if __name__ == '__main__':
    sys.exit(main())

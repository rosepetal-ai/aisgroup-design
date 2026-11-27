"""Launcher preflight/command tests with private locks and controlled child doubles."""
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/safe_render.py'
spec = importlib.util.spec_from_file_location('safe_render', SCRIPT)
launcher = importlib.util.module_from_spec(spec)
spec.loader.exec_module(launcher)

class SafeRender(unittest.TestCase):
    def test_post_accepts_inbox_pictures_and_rejects_paths_outside_it(self):
        from PIL import Image
        with tempfile.TemporaryDirectory() as tmp:
            studio = Path(tmp).resolve()
            recipe = studio / 'recipe.json'
            node = studio / 'node'
            args = [str(node), str(studio / 'engine/render.mjs'), str(recipe), '--only', 'png',
                    '--formats', '4x5', '--out', str(studio / 'out')]
            def validate(src):
                recipe.write_text(json.dumps({'kind': 'post', 'name': 'inbox-test', 'shots': [{'src': str(src)}]}))
                launcher.validate_post(args)
            for configured in ('', str(studio / 'custom-inbox')):
                inbox = Path(configured or studio / 'work/inbox')
                inbox.mkdir(parents=True)
                picture = inbox / 'machine.png'
                Image.new('RGB', (4, 3)).save(picture)
                outside = studio / 'machine.png'
                outside.write_bytes(picture.read_bytes())
                with self.subTest(inbox=inbox), patch.object(launcher, 'STUDIO', studio), \
                     patch.object(launcher, 'POST_NODE_BINARIES', {node}), patch.dict(os.environ, AIS_INBOX=configured):
                    validate(picture)
                    with self.assertRaisesRegex(ValueError, 'outside approved roots'):
                        validate(outside)

    def run_launcher(self, args, resource_changes=None, child_setup=None):
        sample = {'available_gib':12, 'psi_avg10':{'some':0, 'full':0},
                  'largest_rss':[], 'blender_pids':[], 'allowed_cpus':[0,1,2,3]}
        sample.update(resource_changes or {})
        original_open = open
        with tempfile.TemporaryDirectory(dir=Path.home()/'.cache') as tmp:
            def private_lock(name, *a, **kw):
                return original_open(Path(tmp)/Path(name).name, *a, **kw)
            with patch.object(launcher, 'resources', return_value=sample), \
                 patch.object(launcher.sys, 'argv', ['safe_render.py', *args]), \
                 patch('builtins.open', side_effect=private_lock), \
                 patch.object(launcher.subprocess, 'Popen') as child, \
                 patch.object(launcher, 'supervise', return_value=(0,{},{})) as supervision, \
                 patch.object(launcher, 'cleanup') as kill, \
                 contextlib.redirect_stdout(io.StringIO()):
                child.return_value.wait.return_value = 0
                child.return_value.pid = 12345
                if child_setup: child_setup(child.return_value)
                if child_setup: supervision.return_value=(124,{'reason':'timeout'}, {})
                code=launcher.main()
                return code, child, kill

    def test_low_ram_high_psi_and_existing_blender_launch_nothing(self):
        for resource in ({'available_gib':2}, {'psi_avg10':{'some':20,'full':0}}, {'blender_pids':[123]}):
            code,child,kill=self.run_launcher(['--','node','print/render.mjs','test.html'],resource)
            self.assertEqual(75,code)
            child.assert_not_called()

    def test_diagnostic_never_launches_child(self):
        code, child, _ = self.run_launcher(['--check'])
        self.assertEqual(0,code)
        child.assert_not_called()

    def test_direct_blender_threads_priority_and_affinity(self):
        code, child, _ = self.run_launcher(['--blender','--','blender','-b','-t','8','-P','scene.py','--','out'])
        self.assertEqual(0,code)
        args=child.call_args.args[0]
        self.assertEqual(['/usr/bin/nice','-n','15','/usr/bin/taskset','-c','0,1','blender','-b','-P','scene.py','-t','2','--','out'],args)
        self.assertEqual('2',child.call_args.kwargs['env']['THREADS'])
        self.assertTrue(child.call_args.kwargs['start_new_session'])

    def test_timeout_stops_own_process_group(self):
        def setup(child):
            child.wait.side_effect=[subprocess.TimeoutExpired('test',1),0]
        code,_,kill=self.run_launcher(['--timeout','1','--','test-command'],child_setup=setup)
        self.assertEqual(124,code)
        kill.assert_called_once()

if __name__=='__main__': unittest.main()

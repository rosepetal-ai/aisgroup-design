"""Real cheap process trees, private locks; never Chromium/Blender or user processes."""
import importlib.util
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import tempfile
import time
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'scripts/safe_render.py'
spec = importlib.util.spec_from_file_location('guard', SCRIPT)
guard = importlib.util.module_from_spec(spec)
spec.loader.exec_module(guard)

class Supervision(unittest.TestCase):
    def run_tree(self, mode):
        with tempfile.TemporaryDirectory(dir=Path.home()/'.cache') as d:
            root = Path(d)
            # Root and a detached child that ignores TERM. Parent may exit before child.
            fixture = root/'tree.py'
            fixture.write_text("""import os,signal,time,sys
from pathlib import Path
pid=os.fork()
if pid==0:
 os.setsid()
 signal.signal(signal.SIGTERM,signal.SIG_IGN)
 Path(sys.argv[1]).write_text(str(os.getpid()))
 time.sleep(30)
else:
 time.sleep(.3 if sys.argv[2]=='early' else 30)
""")
            driver = root/'driver.py'
            driver.write_text(f"""import importlib.util,sys
from pathlib import Path
spec=importlib.util.spec_from_file_location('guard',{str(SCRIPT)!r});g=importlib.util.module_from_spec(spec);spec.loader.exec_module(g)
g.resources=lambda:{{'available_gib':12,'psi_avg10':{{'some':0,'full':(.18 if {mode!r}=='pressure' and Path({str(root/'pid')!r}).exists() else 0)}},'largest_rss':[],'blender_pids':[],'allowed_cpus':[0,1]}}
g.LOCK_DIR=Path({d!r})  # private locks, never the real /tmp ones
sys.argv=['safe_render','--timeout','1','--',sys.executable,{str(fixture)!r},{str(root/'pid')!r},{mode!r}]
sys.exit(g.main())
""")
            child = subprocess.Popen([sys.executable,str(driver)],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
            deadline=time.monotonic()+5
            while not ((root/'pid').exists() and (root/'pid').read_text()) and time.monotonic()<deadline:
                time.sleep(.02)
            self.assertTrue((root/'pid').exists())
            grandchild=int((root/'pid').read_text())
            if mode=='cancel':
                child.terminate()
                # Lock remains held while the TERM-resistant descendant is alive.
                import fcntl
                with open(root/'ais-marketing-render.lock','a') as lock:
                    with self.assertRaises(BlockingIOError):
                        fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
            stdout,stderr=child.communicate(timeout=8)
            self.assertEqual('',stderr)
            self.assertEqual({'timeout':124,'cancel':130,'early':0,'pressure':76}[mode],child.returncode,stdout)
            self.assertIn('"cleanup_complete": true',stdout)
            self.assertFalse(Path(f'/proc/{grandchild}').exists(), 'descendant must be gone/reaped')
            import fcntl
            with open(root/'ais-marketing-render.lock','a') as lock:
                fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)

    def test_timeout_reaps_detached_term_resistant_descendant(self): self.run_tree('timeout')
    def test_pressure_stops_and_reaps_real_owned_tree(self): self.run_tree('pressure')

    def test_cancel_retains_lock_until_descendant_exit(self): self.run_tree('cancel')
    def test_successful_parent_exit_still_cleans_descendants(self): self.run_tree('early')

    def test_light_profile_cannot_wrap_another_command_or_motion(self):
        for command in ([sys.executable,'-c','pass'], ['node',str(guard.STUDIO/'engine/render.mjs'),'a','--force']):
            with self.assertRaises(ValueError): guard.validate_post(command)

    def test_runtime_memory_and_psi_stop(self):
        from unittest.mock import patch, Mock
        child=Mock(pid=99999999)
        for resource in ({'available_gib':1,'psi_avg10':{'some':0,'full':0}}, {'available_gib':12,'psi_avg10':{'some':2,'full':0}}):
            with patch.object(guard,'resources',return_value=resource),patch.object(guard,'owned_rows',return_value={}):
                code,report,_=guard.supervise(child,1,1024,2)
                self.assertEqual(76,code)
                self.assertIn('RAM reserve/PSI',report['reason'])
        with patch.object(guard,'resources',return_value={'available_gib':12,'psi_avg10':{'some':0,'full':0}}),patch.object(guard,'owned_rows',return_value={1:{'rss_mib':1100}}):
            self.assertEqual(76,guard.supervise(child,1,1024,2)[0])


class PostProfile(unittest.TestCase):
    def test_square_stays_inside_single_post_envelope_and_matches_recipe(self):
        import copy
        with tempfile.TemporaryDirectory(dir=Path.home()/'.cache') as d:
            recipe=Path(d)/'recipe.json'
            original=json.loads((guard.STUDIO/'pieces/posts/05-rev360-cables/recipe-es.json').read_text())
            original['formats']=['1x1']
            command=['/usr/bin/node',str(guard.STUDIO/'engine/render.mjs'),str(recipe),'--only','png','--formats','1x1','--out',str(Path(d)/'out')]
            recipe.write_text(json.dumps(original))
            receipt=guard.validate_post(command)
            self.assertEqual(1080*1080,receipt['outputPixels'])
            # A supported format is not permission for a different recipe,
            # tall stories or carousel/motion workloads. A recipe that also
            # lists another format still renders one: --formats keeps only it.
            changed=copy.deepcopy(original);changed['formats']=['1x1','4x5'];recipe.write_text(json.dumps(changed))
            self.assertEqual(1080*1080,guard.validate_post(command)['outputPixels'])
            for field,value in [('formats',['4x5']),('kind','carousel'),('shots',original['shots']*2)]:
                changed=copy.deepcopy(original);changed[field]=value;recipe.write_text(json.dumps(changed))
                with self.assertRaises(ValueError):guard.validate_post(command)
            original['formats']=['9x16'];recipe.write_text(json.dumps(original))
            with self.assertRaises(ValueError):guard.validate_post([*command[:6],'9x16',*command[7:]])

    def test_real_post_accepts_only_bounded_static_work_and_fixed_flags(self):
        import copy
        with tempfile.TemporaryDirectory(dir=Path.home()/'.cache') as d:
            recipe=Path(d)/'recipe.json'
            original=json.loads((guard.STUDIO/'pieces/posts/05-rev360-cables/recipe-es.json').read_text())
            command=['/usr/bin/node',str(guard.STUDIO/'engine/render.mjs'),str(recipe),'--only','png','--formats','4x5','--out',str(Path(d)/'out')]
            recipe.write_text(json.dumps(original));guard.validate_post(command)
            # ['4x5','1x1'] is fine: --formats 4x5 renders the one format (the product template lists both).
            for field,value in [('kind','video'),('formats',['1x1']),('shots',original['shots']*2),('captionsFrom','/etc/passwd'),('name','../../unsafe')]:
                changed=copy.deepcopy(original);changed[field]=value;recipe.write_text(json.dumps(changed))
                with self.assertRaises(ValueError):guard.validate_post(command)
            recipe.write_text(json.dumps(original))
            for changed in ([sys.executable,*command[1:]], [*command,'--force'], [*command[:4],'mp4',*command[5:]], [command[0],'/tmp/render.mjs',*command[2:]]):
                with self.assertRaises(ValueError):guard.validate_post(changed)
            changed=copy.deepcopy(original);changed['shots'][0]['src']='@lib/media/rev360/rev360-cables-demo.mp4';recipe.write_text(json.dumps(changed))
            with self.assertRaises(OSError):guard.validate_post(command)

if __name__=='__main__': unittest.main()

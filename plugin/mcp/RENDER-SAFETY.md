# Local render supervision

The launcher is `skills/_shared/scripts/safe_render.py`. It is shared by local authoring tools; this MCP does not introduce another renderer. When it refuses to start (exit 75), the MCP re-checks every 20 s for up to `AIS_RENDER_WAIT_SECONDS` (default 600) and then reports the job `blocked` with the guard's reasons; it never lowers a threshold. No remote worker is required or assumed. Leave the user's applications alone.

## macOS and Windows

Same profiles, budgets, reserve, deadlines, lock and refusal codes. Linux reads `/proc` and PSI and runs the child under `/usr/bin/nice -n 15 /usr/bin/taskset -c 0,1` as a subreaper. Elsewhere `psutil` (in `requirements.txt`) gives available RAM and the owned tree's RSS; PSI is checked only where the kernel has it; the supervisor lowers itself (nice 15, or below-normal priority on Windows; CPUs 0,1 where an affinity API exists, not macOS) and the child tree inherits it; the lock is `fcntl` on macOS and `msvcrt` on Windows (`%TEMP%`); cleanup kills every process seen in the tree, by pid and start time. Without a subreaper, a descendant born and orphaned within one 0.2 s sample can escape. On Windows the MCP cancels with `taskkill /T`. `AIS_PORTABLE_GUARD=1` forces this path on Linux; `mcp/tests/portable.test.mjs` runs it, including one real post export.

## Supplied media inspection (contract 1.4.0)

`media-preview.py` is a separate read-only decoder, not an artwork renderer. It imports the existing supervisor, resource readings and owned-process cleanup. An image/header probe or a single image preview has a 256 MiB tree budget plus 2 GiB reserve (2.25 GiB start); a single selected MP4 frame has 512 MiB plus the same reserve (2.5 GiB start). These fixed budgets cannot be supplied by callers. Raster input is capped at 16 MP / 32 MiB and MP4 at 256 MiB / 16 MP per frame. Preview output is at most 960 px and 96 KiB. No batch frames, OCR, transcription or marketing image export is supported.

Admission takes the same nonblocking marketing lock, requires PSI some <1 / full <0.1 avg10, and refuses active Blender. The helper uses nice 15, CPUs 0,1, one decoder thread, a 25-second whole-operation deadline and live tree-RSS/available-RAM/PSI checks. FFprobe and FFmpeg also have bounded 8/12-second subprocess deadlines. Only local file/pipe protocols are permitted. It holds the lock through descendant cleanup; a busy lock or resource refusal starts no decoder. Shutdown aborts inspections and retains the MCP owner record until they finish. The private state holds at most 100 inspection directories. No user's process is killed and no render admission threshold is reduced.

The runtime sampler is not a kernel memory cap and can miss short-lived peaks. Receipts therefore retain both sampled tree RSS and Linux `getrusage` high-water marks for the worker and its largest waited child. Those two OS values are separate, not a measurement of aggregate concurrent memory. The official-client acceptance measured 31.00 MiB worker peak for a 1280×600 photo; a 1280×720 MP4 frame at 20 seconds measured 28.04 MiB worker / 65.65 MiB largest-child peaks. The sampled tree maximum was only about 15 MiB, demonstrating why it must not be called the true peak. Minimum available RAM was 3.479 GiB, observed PSI zero, and owned cleanup completed. These observations cover the named inputs, not every 16 MP source or codec.

Evidence: `~/.cache/ais-group-design/mcp-media-stdio-oooJTy/acceptance.json` and its three `resources.json` files. The photo and selected source-animation frame were inspected, image blocks were hash-checked, and originals stayed unchanged. The tests cover bounded text, stale references, source signatures, reference lifecycle and immediate owned-helper cancellation. Mid-decoder cancellation and a broader codec/alpha/EXIF fixture matrix remain unverified. The regular artwork profiles below are unchanged.

## Profiles and admission

| Profile | Permitted job | Tree RSS budget | RAM reserved for the PC | Start gate | Timeout |
| --- | --- | --- | --- | --- | --- |
| `heavy` (default) | Unknown/general browser, PDF, video, Blender | 4 GiB at the default gate | 2 GiB | 6 GiB available | 480 s default, caller can set 1–3600 s |
| `print-family-a4` | Seven registered Spanish four-page technical sheets, fixed renderer | 1 GiB | 2 GiB | 3 GiB available | caller must set <=150 s |
| `post-1080` | Exactly one static 4x5 or 1x1 social post through the existing renderer | 1 GiB | 2 GiB | 3 GiB available | caller must set <=120 s |

`--min-available-gib` cannot be below 6. Increasing it increases the heavy tree budget while retaining the reserve. There is no caller-supplied RSS override for the post profile. The heavy default is conservative admission, not a prediction that every heavy job will fit 4 GiB; larger jobs must specify an appropriate larger budget or be optimized first.

All profiles require memory PSI avg10 **some <1%, full <0.1%**, CPUs 0,1 available, no active Blender, and the nonblocking `/tmp/ais-marketing-render.lock`. Blender additionally acquires `/tmp/ais-blender.lock` (the lock named in the marketing CLAUDE.md) and forces two threads. Refusal is exit 75, with reasons, and launches nothing. Full swap alone is not a refusal reason. The PSI gate is deliberately tighter than the old startup-only guard.

The post profile checks the full command: explicit installed Node binary, canonical `engine/render.mjs`, one recipe and exactly `--only png --formats FORMAT --out DIRECTORY`, where FORMAT is `4x5` or `1x1` and matches the recipe’s single format. Portrait is 1080×1350; square is 1080×1080 and has fewer output pixels. Python/Blender, other scripts, extra flags, other formats, multi-shot and motion/audio fields are rejected. Node installations are explicitly listed in the launcher (`/usr/bin/node` and this PC's pinned pi-node 22.22.3 installation), not accepted from arbitrary PATH entries. Update that allowlist deliberately when installing Node elsewhere. Scheduler utilities use absolute system paths. Node loader/preload environment variables are stripped before execution.

Recipe input is capped at 64 KiB, with a safe output basename. Images must resolve within existing `studio/library/media` or guide `public`, be single-frame JPEG/PNG/WebP, <=16 million pixels each, <=32 MiB total file bytes. These bounds limit decoded data, not just file compression. The MCP separately retains its recipe validation and realpath/asset checks; the private state directory is trusted local storage, not a hostile concurrent-writer sandbox. The preflight is not an immutable dependency snapshot: local source edits, package changes or machine load can invalidate previous measurements.

## Measurement and runtime enforcement

The initial 1 GiB post budget is a capped calibration envelope, rather than a lowered blanket gate: the first admitted run must fit that envelope **and** the independent 2 GiB reserve. The real edited Cables post exported at 1080×1350 in 1.66 seconds. Seven resource samples measured **629.78 MiB aggregate owned-tree RSS** against the 1024 MiB cap. Admission had 3.496 GiB available, PSI some/full zero. The cap is about 1.63 times that observed peak. The same profile must reject larger/moving work; this is not a Blender, carousel or whole-kit measurement.

During a job the supervisor scans `/proc` approximately every 200 ms plus scan time. It sums the resident sets of owned live descendants (shared pages can be counted multiple times, conservatively), tracks the sampled peak, and checks current MemAvailable and PSI avg10. Falling below 2 GiB available, exceeding the tree budget, or crossing either PSI threshold terminates owned work with exit 76. Timeout is exit 124; signal cancellation is exit 130. Final stdout reports peak RSS, sample count, elapsed time, reason and cleanup completion. These are sampled bounds, not an instantaneous kernel memory limit; bursts between samples and delayed PSI averages remain a limitation.

Every job starts its own session under nice 15 / CPUs 0,1, with thread variables set to two. Linux child-subreaper mode adopts orphaned grandchildren. Cleanup discovers the process group, descendant ancestry and recorded PID/start-time identities, including detached descendants. It sends TERM, gives two seconds, then KILL and reaps owned children. Even a successful direct-child exit triggers descendant cleanup. It does not kill user applications. The shared lock stays held throughout; the direct child inherits the lock descriptor as additional protection if the supervisor is abruptly killed. Normal cancellation and timeout tests prove detached TERM-resistant children are gone before lock reuse. Uninterruptible kernel tasks cannot be guaranteed to exit on a deadline: the guard fails closed and retains ownership rather than releasing a lock over a live owned descendant. This exceptional kernel condition may require manual investigation; it is not a normal completed job.

## MCP lifetime and local use

The maintained smoke client awaits terminal states with a 195-second outer deadline. The post renderer has 120 seconds; the carousel has 180 seconds. It cancels on deadline. `cancelRequested:true` on a running job is an acknowledgement, not completion. `cancelled` is persisted only after the guard exits. Server shutdown awaits that exit before releasing `owner.json`; the record includes the guard PID while running. Restart refuses a state owned by a live server/guard, and marks stale unfinished jobs `interrupted` without automatic requeue.

From `studio/`, a read-only admission check for an already isolated post is:

```sh
python3 .claude/skills/_shared/scripts/safe_render.py \
  --profile post-1080 --timeout 120 --check -- \
  node \
  "$PWD/engine/render.mjs" /absolute/path/recipe.json \
  --only png --formats 4x5 --out /absolute/cache/path/out
```

For unknown work keep the default heavy profile. A busy lock or insufficient RAM is a reason to do source work, not to retry repeatedly or lower the threshold. Cache renders and QA under `~/.cache/ais-group-design/`; temporary renderer scratch also goes under the job directory because MCP sets TMPDIR there. No cache/release promotion occurs automatically.

Tests:

```sh
python3 -m unittest discover -s studio/.claude/skills/_shared/tests -v
npm --prefix studio run test:mcp
```

The real-process tests use cheap Python/Node fixtures and private lock files, never a browser or Blender. They cover timeout, detached descendants ignoring TERM, early parent exit, cancellation lock lifetime, process disappearance/reaping, runtime RAM/PSI/RSS triggers, fixed-profile rejection, MCP ownership during cancellation and recovery. The successful browser export proves normal browser completion/cleanup; it does not by itself prove an active Chromium cancellation.


## Narrow Cables print calibration (wave three)

`print-cables-a4` admits only the actual existing `print/render.mjs`, an allowlisted Node binary, no renderer flags and the typed four-page Spanish Cables job snapshot. The binder assembles escaped data against the untouched template and records generated-HTML, recipe, manifest and binder-code hashes. Admission verifies this receipt plus baseline template/image/CSS/font/icon/logo hashes without spawning a child before supervision. The separate source validator reassembles and compares HTML byte-for-byte. Static images remain <=16 MP each / <=32 MiB encoded total. It rejects post, carousel, arbitrary HTML, another print source, extra flags, Blender and timeout >150 s. Modified/absent pinned dependencies fail before Chromium.

Budget: 1,024 MiB aggregate sampled owned-tree RSS + 2 GiB reserve = 3 GiB admission; 150 seconds maximum. This keeps the older print workflow's 3 GiB admission and 2 GiB reserve while adding a tree cap, the stricter shared full-PSI 0.1 threshold (older batch used 1), live supervision and descendant cleanup. Evidence informing the finite envelope is `work/documents-wave2/exports.json`: the real Cables sheet completed in 4.0 seconds with minimum available 3.398 GiB. That receipt does not measure RSS, so this is a conservative **calibration cap**, not proof that every print job fits. No other workload can select it. Heavy default remains unchanged at 6 GiB; the post profile remains restricted to the single-post renderer.

The first actual official-client export attempt was refused before launch: 2.575554 GiB available, zero PSI, exit 75. No retry loop ran. Path: `~/.cache/ais-group-design/mcp-stdio-vzeF7h/acceptance.json`. After independent source work, RAM rose to 3.35 GiB with zero PSI. One fresh final-code attempt was then admitted at **3.329956 GiB**, completed in **4.01 s** with **16 observations**, **682.72 MiB sampled peak owned-tree RSS**, minimum available **3.140 GiB**, max PSI **0/0**, exit 0 and `cleanup_complete:true`. The client retrieved the PDF plus four page PNGs and verified hashes. Path: `~/.cache/ais-group-design/mcp-stdio-LjMSQE/acceptance.json`. It is one measured bounded print workload, not a budget for general print, carousel or Blender.

The live-process pressure test creates a detached TERM-resistant descendant, triggers full PSI 0.18 via a controlled resource sample, and verifies exit 76 plus actual reaping and lock release. That is cleanup evidence for the shared supervisor, not an active-Chromium cancellation test. The parent's existing post failure explanation for exit 76 remains unchanged.


## Registered print-family calibration (wave four)

`print-family-a4` extends the scoped binder to exactly `hopper`, `kariko`, `cables`, `conservas`, `pharma`, `standard`, `opticais` via `mcp/print-family.json`. The legacy `print-cables-a4` alias still refuses other products. The seven source hashes are explicit; changing canonical artwork requires deliberate registry review. Same four pages/128 KiB, same existing renderer/no flags, same 1024 MiB tree cap and 2 GiB reserve, <=150 s. This is a capped experiment informed by Cables, not a prediction of seven successful exports.

Every member has its own measured raster count, baseline encoded bytes and decoded pixel count. Admission requires that exact raster count, <=16 MP per image, <=32 MiB encoded total, and aggregate decoded pixels <= that source baseline +8 MP. Baselines range from 4.34 to 14.49 MP and 7–13 raster references; consult the registry for exact values. The runtime guard still enforces the tree cap/reserve/PSI; no thresholds were lowered. The admission receipt includes product, source hash, page count, actual raster count/pixels/bytes. Every registered path is source-tested through the real preflight without launching a renderer.

The expanded binding receipt adds the registry hash. Typed edits retain immutable product/layout data and match uniquely within the correct page. Original templates, fonts, icons, logo, images and CSS remain separately pinned; edited raster inputs are independently counted/decoded at preflight. Stale baseline, family config, dependencies or generated HTML are refused. No arbitrary print HTML is admitted.

Wave-four actual job/resource receipts and any successful PDF/page review are recorded in `studio/work/FACTORY-MCP-WAVE4-RESULT.md`. A valid family recipe or seven successful admission checks is not proof of export/fit. Carousel remains on `heavy`; no carousel is passed through print/post policy. Active-browser cancellation remains unverified; this batch does not rerun unrelated process-lifecycle suites.


## Square single-post support

The same `post-1080` validator now admits one static 1080×1080 square post as well as 1080×1350 portrait. It records actual format/output-pixel count/input bytes. Command and recipe must match exactly; multiple formats, extra shots, carousels, stories and motion remain rejected. All root, source-size, command and runtime checks are unchanged. The 1 GiB tree budget, 2 GiB reserve, 3 GiB start, PSI stops, lock and <=120-second deadline are unchanged; this does not extend the small profile to a larger canvas or a different renderer.

New rejection checks cover mismatched recipe/command, multiple outputs, carousel/two-shot work and 9:16. All eight supervision tests passed, including real-process cleanup and pressure checks. Four actual can-post exports completed and were visually reviewed at native, 550 px and 360 px widths. Maximum sampled tree RSS was 626.94 MiB, minimum available RAM 4.464 GiB, observed PSI zero and cleanup complete. Exact per-job receipts are in `work/source-can-posts-wave6/parent-verification.json`. These are observations of this source-photo batch, not a kernel memory cap or a guarantee for all allowed inputs. The MCP enqueue adapter still requests 4x5; square is currently a tested CLI renderer capability, not a new MCP format contract.

Use the installed Node 22 binary recorded in the allowlist. On this PC `/usr/bin/node` is still version 18 and Playwright refuses it; the can-post record preserves that short dependency failure. No package installation or runtime guard change was used to fix it.

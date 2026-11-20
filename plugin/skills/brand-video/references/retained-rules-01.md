# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-9e6d9f76f6a2

<!-- AIS-9e6d9f76f6a2 -->
Use the seven footage templates for footage, or the product interface clips below for a film of the Rosepetal app. An interview cuts real footage with its own sound (`voice`) and builds its captions from the transcript (`captionsFrom`, `corrections`); a person reads the captions before it ships.

Source: plugin/skills/brand-video/SKILL.md:11.

## AIS-1377edca22a3

<!-- AIS-1377edca22a3 -->
| Type | Template | Length, formats |

Source: plugin/skills/brand-video/SKILL.md:13.

## AIS-b8ec48555607

<!-- AIS-b8ec48555607 -->
| --- | --- | --- |

Source: plugin/skills/brand-video/SKILL.md:14.

## AIS-ca125c178de9

<!-- AIS-ca125c178de9 -->
| Defect showcase | `templates/video-defect-showcase.json` | 10–20 s; 9x16, 4x5, 1x1 |

Source: plugin/skills/brand-video/SKILL.md:15.

## AIS-793f3856a0bf

<!-- AIS-793f3856a0bf -->
| Event teaser | `templates/video-event-teaser.json` | 8–15 s; 9x16, 4x5, 16x9 |

Source: plugin/skills/brand-video/SKILL.md:16.

## AIS-5fdb457d603c

<!-- AIS-5fdb457d603c -->
| Event recap | `templates/video-event-recap.json` | 30–60 s; 16x9, 9x16 |

Source: plugin/skills/brand-video/SKILL.md:17.

## AIS-d28a488c9f4e

<!-- AIS-d28a488c9f4e -->
| Announcement | `templates/video-announcement.json` | 15–20 s; 16x9, 4x5 |

Source: plugin/skills/brand-video/SKILL.md:18.

## AIS-835494dd263f

<!-- AIS-835494dd263f -->
| Sector film | `templates/video-sector-film.json` | 60–90 s; 16x9 + 20 s cutdown |

Source: plugin/skills/brand-video/SKILL.md:19.

## AIS-9a5c39ee3a12

<!-- AIS-9a5c39ee3a12 -->
| Case study | `templates/video-case-study.json` | 60–90 s; 16x9, 9x16 |

Source: plugin/skills/brand-video/SKILL.md:20.

## AIS-1a5720394031

<!-- AIS-1a5720394031 -->
| Interview | `templates/video-interview.json` | Full version any length, 16x9; social cut 45–60 s, 16x9, 1x1, 4x5 |

Source: plugin/skills/brand-video/SKILL.md:21.

## AIS-38b9838fe4a6

<!-- AIS-38b9838fe4a6 -->
Real lines, real parts, real people (with consent). Each template shot has a `slot` saying what to film; until the footage exists the slot shows on screen, so a draft can be reviewed as an animatic.

Source: plugin/skills/brand-video/SKILL.md:25.

## AIS-a85175287b02

<!-- AIS-a85175287b02 -->
When the footage films the system's own screen showing the result (a NOK, a boxed defect, a date read), that screen is the proof: mark the shot `"evidence": "system"` and draw no inspection frame of ours over it. If the live view changes too fast to read, hold one real frame of it as a `still` (extract it with ffmpeg, catalogue it as a `video-frame`), as `video-defect-showcase` does. Look in `docs/brand-kit.md` and the catalogue before saying footage does not exist: AIS's LinkedIn videos and stand clips are there, with what each second shows.

Source: plugin/skills/brand-video/SKILL.md:26.

## AIS-95952a44c4b1

<!-- AIS-95952a44c4b1 -->
**Machine motion:** 3D renders, including the exterior turntable, hero reveal and on-the-line animations of AIS Hopper, AIS KARIKÓ and AIS REV 360 Compact, come from the separate product-render skill. Reuse existing reviewed clips first; exterior only, guards closed, never captioned as render, CAD or 3D.

Source: plugin/skills/brand-video/SKILL.md:27.

## AIS-80ac852d59c7

<!-- AIS-80ac852d59c7 -->
**New real footage:** `library/media/brand-intros/` (the brand intros). Register them with `asset-library` before cutting from them.

Source: plugin/skills/brand-video/SKILL.md:28.

## AIS-29bdf12b6662

<!-- AIS-29bdf12b6662 -->
Footage in the library: `library/media/advanced-factories-2026/` (Advanced Factories 2026 stand, 720p, under review for consent), including `af26-can-demo-steady` (the can demo with the Rosepetal dents and the OPTICAIS date on the stand screen). Elsewhere: `rev360-cables-video` (AIS's REV 360 Cables video) and `ais-people-video` (AIS people at work, consent per person). Check `library/catalog.json`. The generated website clips (`web-*`) are rejected: never use them.

Source: plugin/skills/brand-video/SKILL.md:29.

## AIS-4d0c8c1df001

<!-- AIS-4d0c8c1df001 -->
**No handheld shake.** The guide rules it out, so stabilise phone footage before use (ffmpeg `vidstab`, two passes), catalogue the stabilised copy with the original as its `source`, and use that one, as `af26-can-demo-steady` does.

Source: plugin/skills/brand-video/SKILL.md:30.

## AIS-5a4c8ee2729a

<!-- AIS-5a4c8ee2729a -->
**Cuts and dissolves.** Cut by default. `"dissolve": true` on a shot gives the guide's 13-frame cross-dissolve from the shot before, only within the same scene; `"wipe": true` is for beats (into a result, a claim, the end card).

Source: plugin/skills/brand-video/SKILL.md:31.

## AIS-607ebb9e680b

<!-- AIS-607ebb9e680b -->
Hold shots 2 s or more (1.5 s in recaps). Social video opens on the most telling shot; only films over 60 s open with the logo. Every video ends on `end`.

Source: plugin/skills/brand-video/SKILL.md:32.

## AIS-9c3040bbc1c6

<!-- AIS-9c3040bbc1c6 -->
**Generated footage** is judged like any picture: real footage first; a generated or composited clip only if every frame passes `brand-review` step 1. If nothing good exists, keep the template's `slot` and ask for the footage.

Source: plugin/skills/brand-video/SKILL.md:33.

## AIS-c989c10ca772

<!-- AIS-c989c10ca772 -->
Show the real application, not a staged one. Capture the actual screens of one product revision: its shell, navigation, page structure, density, full-screen editor, canvas and panels exactly as the app renders them. Real controls rearranged on a custom stage are a component demo, never a product film. How to capture: [product UI capture](product-ui-capture.md).

Source: plugin/skills/brand-video/SKILL.md:37.

## AIS-34e7a80f00d2

<!-- AIS-34e7a80f00d2 -->
Open on a readable full-screen view, then follow one real task with selective cursor movement, readable holds and zoom (the guide's standard curve, at most 2× relative). Titles and captions sit around the recording or between scenes, never in place of the app's layout.

Source: plugin/skills/brand-video/SKILL.md:39.

## AIS-0588486bd818

<!-- AIS-0588486bd818 -->
Capture at the density the final crop needs (DPR 3 for zooms). Never upscale a low-density recording or retouch UI text.

Source: plugin/skills/brand-video/SKILL.md:40.

## AIS-14dd3e52d087

<!-- AIS-14dd3e52d087 -->
The supplied SVG logo on the white closing card, no watermark mid-clip. Product status colours stay inside the UI; editorial graphics follow the guide.

Source: plugin/skills/brand-video/SKILL.md:41.

## AIS-5f843ced28e6

<!-- AIS-5f843ced28e6 -->
Before a clip goes into the library, check decoding, timestamps, playback, cursor and crops, the source revision, the poster and the captions, at native and feed size.

Source: plugin/skills/brand-video/SKILL.md:42.

## AIS-5fe9a21c7ced

<!-- AIS-5fe9a21c7ced -->
The MCP retrieves registered clips and inspects their frames; it does not render video.

Source: plugin/skills/brand-video/SKILL.md:44.

## AIS-6f75d21d4873

<!-- AIS-6f75d21d4873 -->
Never place boxes by eye on moving footage. Mark the object, track it, review the check video, use the JSON:

Source: plugin/skills/brand-video/SKILL.md:48.

## AIS-7fbd2fca4886

<!-- AIS-7fbd2fca4886 -->
In the shot: `"detect": [{ "label": "bottle", "conf": "0.97", "track": <the array> }]`, with `"evidence": "system"` only when the classes and confidences are the system's.

Source: plugin/skills/brand-video/SKILL.md:55.

## AIS-c494c8845ebc

<!-- AIS-c494c8845ebc -->
Every video has captions; social video burns them in: `"captions": [{ "from": 0.4, "to": 2.6, "text": "First line|second line" }]`. Sentence case, one or two short lines.

Source: plugin/skills/brand-video/SKILL.md:59.

## AIS-25f6bc4a3f62

<!-- AIS-25f6bc4a3f62 -->
node engine/check.mjs work/<slug>/recipe.json

Source: plugin/skills/brand-video/SKILL.md:64.

## AIS-c297440e91f0

<!-- AIS-c297440e91f0 -->
python3 skills/_shared/scripts/safe_render.py -- node engine/render.mjs work/<slug>/recipe.json --formats 9x16 # one format first

Source: plugin/skills/brand-video/SKILL.md:65.

## AIS-c5d20e3cb624

<!-- AIS-c5d20e3cb624 -->
How to film the Rosepetal app for a product film. The film shows the product as customers use it, so fidelity to the real app comes before any editorial idea.

Source: plugin/skills/brand-video/references/product-ui-capture.md:3.

## AIS-c69d60a9c86e

<!-- AIS-c69d60a9c86e -->
Pick one product revision, the one that matches the UI being presented, and record its identity (branch and commit, or file hashes). Never mix files from two snapshots or call an old build the latest UI.

Source: plugin/skills/brand-video/references/product-ui-capture.md:7.

## AIS-65d5db027e3b

<!-- AIS-65d5db027e3b -->
Run the real app: its own shell, top bar, routes and page views. A route the app shows full screen (the labelling editor, for example) stays full screen in the film.

Source: plugin/skills/brand-video/references/product-ui-capture.md:8.

## AIS-5a1d8495eab3

<!-- AIS-5a1d8495eab3 -->
Use read-only access to a real deployment, or a local app with explicit local service and data adapters. Keep external writes and production commands off. Sample data is fine; generic success stubs are not evidence that a workflow works. A service, canvas or training step that can't run stays an open capture item, never a staged button.

Source: plugin/skills/brand-video/references/product-ui-capture.md:9.

## AIS-e450321feafb

<!-- AIS-e450321feafb -->
Look at full-screen stills and one interaction before encoding anything. Source and component tests are engineering checks, not a design review.

Source: plugin/skills/brand-video/references/product-ui-capture.md:13.

## AIS-b0260f00b9ca

<!-- AIS-b0260f00b9ca -->
Record with Playwright at DPR 3 so zooms stay sharp. Pointer positions come from the real elements; the camera move is one uniform transform per shot.

Source: plugin/skills/brand-video/references/product-ui-capture.md:14.

## AIS-8c02b1bacc6f

<!-- AIS-8c02b1bacc6f -->
Follow one meaningful task through the real pages: from the dataset and image views into the editor, annotation where supported, then the model configuration and results views. Cursor movement and zoom direct attention inside those screens.

Source: plugin/skills/brand-video/references/product-ui-capture.md:15.

## AIS-a0220eb74268

<!-- AIS-a0220eb74268 -->
Note for each take whether it records consecutive frames or holds real browser states for reading.

Source: plugin/skills/brand-video/references/product-ui-capture.md:16.

## AIS-0bb4377b464b

<!-- AIS-0bb4377b464b -->
Titles, captions and transitions frame the recording; they never replace a screen.

Source: plugin/skills/brand-video/references/product-ui-capture.md:20.

## AIS-96a76690f48b

<!-- AIS-96a76690f48b -->
Close on the white card with the supplied SVG logo.

Source: plugin/skills/brand-video/references/product-ui-capture.md:21.

## AIS-b60748fc1c7f

<!-- AIS-b60748fc1c7f -->
Review the final MP4 at normal speed, at native and at feed size, after composition, not only a layout PNG.

Source: plugin/skills/brand-video/references/product-ui-capture.md:22.

## AIS-6543c3238560

<!-- AIS-6543c3238560 -->
A full-app capture is a heavy job: one at a time under the shared render lock (see the shared workflow), with a memory budget measured for that capture. A guard stop is not completion and not a reason to retry automatically. Avoid a full rebuild when a verified build of the same revision exists.

Source: plugin/skills/brand-video/references/product-ui-capture.md:26.

## AIS-576aa4ad044d

<!-- AIS-576aa4ad044d -->
**Proof, not promise.** Show the inspection happening: the part, the camera, the result. A clip of a reject leaving the line says more than any claim.

Source: plugin/skills/communications/references/video.md:8.

## AIS-9ed47cdaa4d7

<!-- AIS-9ed47cdaa4d7 -->
**Calm.** Steady camera, long enough shots, hard cuts. The product is precise; the film is too.

Source: plugin/skills/communications/references/video.md:9.

## AIS-d3f18133916d

<!-- AIS-d3f18133916d -->
**Quiet graphics.** Type and overlays appear only to name, explain or measure. They enter like the web does and leave faster.

Source: plugin/skills/communications/references/video.md:10.

## AIS-abebd763d9b8

<!-- AIS-abebd763d9b8 -->
**Readable without sound.** Most video is watched muted. Captions and on-screen text carry the meaning on their own.

Source: plugin/skills/communications/references/video.md:11.

## AIS-5f14b744accb

<!-- AIS-5f14b744accb -->
Marketing uses seven footage templates and the product-interface workflow below. Each structure follows what the strongest industrial brands publish: no logo at the start of films up to 60 s, the subject within two seconds, one line of text at a time, and an end card with somewhere to go. Anything else needs a brief and sign-off first.

Source: plugin/skills/communications/references/video.md:15.

## AIS-328d7d9e71f9

<!-- AIS-328d7d9e71f9 -->
| Type | Length and formats | Structure |

Source: plugin/skills/communications/references/video.md:17.

## AIS-f5db27bd156c

<!-- AIS-f5db27bd156c -->
| **Defect showcase** | 10 to 20 s; 9:16, 1:1, 4:5 | The question (4 words at most) by 0.5 s; the inspection frame locks on, the verdict lands; the product name; the end card. Music only. |

Source: plugin/skills/communications/references/video.md:19.

## AIS-5fbef29583b9

<!-- AIS-5fbef29583b9 -->
| **Event teaser** | 8 to 15 s; 9:16, 4:5, 16:9 | One striking shot and one question; the stand card with dates, hall and stand; the end card |

Source: plugin/skills/communications/references/video.md:20.

## AIS-e585a0c5f776

<!-- AIS-e585a0c5f776 -->
| **Event recap** | 30 to 60 s; 16:9, 9:16 | Faces and demos cut every 1.5 to 2 s; a thank-you card; the end card. Published within a week of the fair. |

Source: plugin/skills/communications/references/video.md:21.

## AIS-76bd4f65166b

<!-- AIS-76bd4f65166b -->
| **Announcement** | 15 to 20 s; 16:9, 4:5 | The product or partners on screen by 2 s; three claims of one or two words; one date or market line; the end card |

Source: plugin/skills/communications/references/video.md:22.

## AIS-d97328a59676

<!-- AIS-d97328a59676 -->
| **Sector film** | 60 to 90 s; 16:9, plus a 20 s cutdown | The sector’s world for the first 10 s; the line; the inspection by 30 s; statements of 2 to 4 words every 6 s or more; one verified result; the end card |

Source: plugin/skills/communications/references/video.md:23.

## AIS-92085a5c440a

<!-- AIS-92085a5c440a -->
| **Case study** | 60 to 90 s; 16:9, 9:16 | The customer’s line; their own words with a lower third by 10 s and captions; one verified figure on its own card; the end card |

Source: plugin/skills/communications/references/video.md:24.

## AIS-82724eddb807

<!-- AIS-82724eddb807 -->
| **Interview** | Full version: any length, 16:9, with chapters. Social cut: 45 to 60 s, no opening logo; 16:9, 1:1, 4:5 | The opening logo on the full version; the first question on a title card (by 2 s on the social cut); the person with a lower third right after it; event or product b-roll under the voice every 6 to 10 s; one quote card; captions throughout; the end card |

Source: plugin/skills/communications/references/video.md:25.

## AIS-a7d113d5509b

<!-- AIS-a7d113d5509b -->
Every long video also ships a 20 s vertical cutdown that links back to it.

Source: plugin/skills/communications/references/video.md:27.

## AIS-3abb7143aaa4

<!-- AIS-3abb7143aaa4 -->
Record Rosepetal as the application actually appears: its navigation, page structure, tabs, full-screen editor, canvas and panels. Use one consistent product revision and preserve the original layout, typography, density and control placement. Real controls rearranged into a custom graphic are not an application recording.

Source: plugin/skills/communications/references/video.md:31.

## AIS-2cb895e87034

<!-- AIS-2cb895e87034 -->
Open with a readable full-screen view, then follow a useful task with a source-bound cursor, selective zoom and enough time to read the result. Preserve UI status colours. Brand titles and transitions can frame the recording; they must not replace the screen. Use the supplied logo on the closing card.

Source: plugin/skills/communications/references/video.md:33.

## AIS-11a53ec9609d

<!-- AIS-11a53ec9609d -->
Demonstration data may come from local services, with the real pages left intact. Record only what the application really does: never imitate missing backend, drawing or training behaviour with generic success responses. Confirm actual screen fidelity before making language and format variants.

Source: plugin/skills/communications/references/video.md:35.

## AIS-29fb0589d788

<!-- AIS-29fb0589d788 -->
Shoot and finish in 16:9 at 1920 × 1080 or above, framing the action in the centre so the same footage crops to the other formats.

Source: plugin/skills/communications/references/video.md:39.

## AIS-1ad19ce42df7

<!-- AIS-1ad19ce42df7 -->
**Title safe** is 5% in from every edge: 96 px on the long side of a 1920 × 1080 frame, 54 px on the short side.

Source: plugin/skills/communications/references/video.md:41.

## AIS-c0850632e87d

<!-- AIS-c0850632e87d -->
**Vertical video** keeps text out of the top 270 px, the bottom 670 px and 120 px on each side, where Reels, TikTok and Shorts draw their buttons and captions. That leaves a 840 × 980 px box that works on every platform.

Source: plugin/skills/communications/references/video.md:42.

## AIS-afef8181f82a

<!-- AIS-afef8181f82a -->
A 16:9 film shown on a stand screen or in a webinar uses the same safe area; projectors crop unpredictably.

Source: plugin/skills/communications/references/video.md:43.

## AIS-e33681337c63

<!-- AIS-e33681337c63 -->
Video graphics use the [motion tokens](../../design-language/references/motion.md), converted to whole frames. Video uses the moderate, slow and expressive durations, the moderate one only for graphics leaving; anything faster reads as a flicker on screen.

Source: plugin/skills/communications/references/video.md:47.

## AIS-e5171ddc98c4

<!-- AIS-e5171ddc98c4 -->
| Token | Milliseconds | 25 fps | 30 fps | 50 fps | Use in video |

Source: plugin/skills/communications/references/video.md:49.

## AIS-e580d0008eb9

<!-- AIS-e580d0008eb9 -->
| --- | --- | --- | --- | --- | --- |

Source: plugin/skills/communications/references/video.md:50.

## AIS-3b7a4594de21

<!-- AIS-3b7a4594de21 -->
| `--ais-duration-moderate-1` | 180 ms | 5 | 5 | 9 | Anything leaving |

Source: plugin/skills/communications/references/video.md:51.

## AIS-a1f3d5ee4f76

<!-- AIS-a1f3d5ee4f76 -->
| `--ais-duration-slow-1` | 500 ms | 13 | 15 | 25 | Lower thirds, end card, overlays entering |

Source: plugin/skills/communications/references/video.md:52.

## AIS-8980fc358f09

<!-- AIS-8980fc358f09 -->
| `--ais-duration-slow-2` | 700 ms | 18 | 21 | 35 | Logo entering |

Source: plugin/skills/communications/references/video.md:53.

## AIS-ee5b05f6682c

<!-- AIS-ee5b05f6682c -->
| `--ais-duration-expressive` | 1100 ms | 28 | 33 | 55 | Titles, line by line, 3 frames apart |

Source: plugin/skills/communications/references/video.md:54.

## AIS-922b811b37c4

<!-- AIS-922b811b37c4 -->
The curves are the same as on the web. Enter them as custom easing in After Effects, Premiere or DaVinci Resolve:

Source: plugin/skills/communications/references/video.md:56.

## AIS-69063c430b99

<!-- AIS-69063c430b99 -->
| Curve | Value | Use |

Source: plugin/skills/communications/references/video.md:58.

## AIS-d83780af3ba0

<!-- AIS-d83780af3ba0 -->
| Enter | `cubic-bezier(.16, 1, .3, 1)` | Everything arriving |

Source: plugin/skills/communications/references/video.md:60.

## AIS-dd9bb4307dbf

<!-- AIS-dd9bb4307dbf -->
| Exit | `cubic-bezier(.4, 0, 1, 1)` | Everything leaving |

Source: plugin/skills/communications/references/video.md:61.

## AIS-3ad151e2dc5d

<!-- AIS-3ad151e2dc5d -->
| Standard | `cubic-bezier(.2, 0, 0, 1)` | Anything moving within the frame, such as a zoom on a screen recording |

Source: plugin/skills/communications/references/video.md:62.

## AIS-3ee5eaf3efbe

<!-- AIS-3ee5eaf3efbe -->
Graphics move 16 px at 1080p, fade with the move, and never scale, rotate or blur.

Source: plugin/skills/communications/references/video.md:64.

## AIS-b7c9378068e7

<!-- AIS-b7c9378068e7 -->
Four devices make our videos recognisable. They come built into the templates; never draw them by hand.

Source: plugin/skills/communications/references/video.md:68.

## AIS-94eec8bfbb51

<!-- AIS-94eec8bfbb51 -->
**The inspection frame.** Corner brackets travel from the title-safe corners onto the subject over 18 frames, a scan line sweeps it, then the reading appears above it in JetBrains Mono and the verdict below it. A defect turns the brackets red as the verdict lands. It is what our systems do, shown the way they show it.

Source: plugin/skills/communications/references/video.md:70.

## AIS-f1980bd2ad79

<!-- AIS-f1980bd2ad79 -->
**The blue wipe.** A full-frame panel in brand blue `#17356E` rises over the cut on the exit curve and leaves on the enter curve. It is the main transition and separates beats: into a claim, a result, the stand card or the end card.

Source: plugin/skills/communications/references/video.md:71.

## AIS-b4df0f22679e

<!-- AIS-b4df0f22679e -->
**Masked type.** Headlines and claims rise line by line from behind a mask, 3 frames apart, after a JetBrains Mono overline and a hairline that draws on. Never letter by letter, never with a blur or a bounce.

Source: plugin/skills/communications/references/video.md:72.

## AIS-3141501ad016

<!-- AIS-3141501ad016 -->
**Counting results.** A verified figure counts up over 1.1 s, the expressive duration, in tabular numerals, with its unit and one line of context.

Source: plugin/skills/communications/references/video.md:73.

## AIS-8939ff789416

<!-- AIS-8939ff789416 -->
The hexagon is a brand device too, in the two forms and with the limits in [Imagery](../../design-language/references/imagery.md#backgrounds).

Source: plugin/skills/communications/references/video.md:75.

## AIS-19d3adaffe01

<!-- AIS-19d3adaffe01 -->
| Element | When | Spec |

Source: plugin/skills/communications/references/video.md:79.

## AIS-ec14986b733f

<!-- AIS-ec14986b733f -->
| **Opening logo** | Films over 60 s: product films, case studies, webinars, tutorials | Brand blue `#17356E`, white logo 560 px wide. 8 frames of blue, logo in over 18 frames, held to 2 s, then a cut. No sound sting. |

Source: plugin/skills/communications/references/video.md:81.

## AIS-dd0c96565cb2

<!-- AIS-dd0c96565cb2 -->
| **Brand intro** | Instead of the opening logo, once per film: event screens, social video, the website, presentations | The hexagon landscape, white on brand blue, flown over slowly with one scan line across it; the white logo, every brand at the same area as AIS Vision Systems at 560 px wide (see Logo), fades in and rises 16 px over the clear blue above it (700 ms on the enter curve, as Motion’s logo entering) and holds still. 5 s, or 10 s without the logo as a background. No glow, particles or vignette. |

Source: plugin/skills/communications/references/video.md:82.

## AIS-11132c128885

<!-- AIS-11132c128885 -->
| **Title** | Chapters and the film title | Inter Semibold 96 px, sentence case, on blue or white, at most 20 characters a line and two lines, entering over 28 frames, 3 frames apart |

Source: plugin/skills/communications/references/video.md:83.

## AIS-821568b39e36

<!-- AIS-821568b39e36 -->
| **Lower third** | First time a person speaks | Ink plate `#0F1729`, 24 px by 32 px padding, on the title-safe corner. A 6 px blue-300 `#7C9FD7` bar on its left edge grows first, then the plate opens from it. Name Inter Semibold 44 px white; role and company Inter Regular 32 px neutral 400. On screen at least 4 s. |

Source: plugin/skills/communications/references/video.md:84.

## AIS-615625dbadc2

<!-- AIS-615625dbadc2 -->
| **Location** | First shot of a site | Same plate, one line, 32 px: «Bottling line, La Rioja» |

Source: plugin/skills/communications/references/video.md:85.

## AIS-b08b0346694e

<!-- AIS-b08b0346694e -->
| **End card** | Every video | White, the brand’s blue logo 560 px wide, centred; one line underneath in Inter Medium 40 px: the web address or one action. Held 1.5 s on social video up to 30 s, 3 s on standard films, 5 s on brand films. It follows a hard cut or the blue wipe. Brands other than AIS Group add «Part of AIS Group» in 32 px. |

Source: plugin/skills/communications/references/video.md:86.

## AIS-317896e239a9

<!-- AIS-317896e239a9 -->
The opening and end card use the logo of the brand that made the video; a group film uses the AIS Group logo. The logo appears once at each end and never as a watermark in between.

Source: plugin/skills/communications/references/video.md:88.

## AIS-e069d5155dce

<!-- AIS-e069d5155dce -->
| Rule | Value |

Source: plugin/skills/communications/references/video.md:92.

## AIS-e3a31e3647ab

<!-- AIS-e3a31e3647ab -->
| Type | Inter Medium 40 px at 1080p, white on an ink plate `#0F1729`, sentence case |

Source: plugin/skills/communications/references/video.md:94.

## AIS-1073cd3ae8b3

<!-- AIS-1073cd3ae8b3 -->
| Position | Centred at the bottom of the title-safe area; moved up above a lower third or on-screen text while it shows |

Source: plugin/skills/communications/references/video.md:95.

## AIS-30fb1915aaba

<!-- AIS-30fb1915aaba -->
| Length | Two lines at most, 42 characters per line, broken at natural phrases |

Source: plugin/skills/communications/references/video.md:96.

## AIS-136f68e0f31a

<!-- AIS-136f68e0f31a -->
| Timing | Between 1 s and 7 s each, no faster than 20 characters per second |

Source: plugin/skills/communications/references/video.md:97.

## AIS-954e95dc7dfe

<!-- AIS-954e95dc7dfe -->
| Files | WebVTT (`.vtt`) for the website, SRT (`.srt`) for YouTube and LinkedIn, one file per language |

Source: plugin/skills/communications/references/video.md:98.

## AIS-d0a2b2893729

<!-- AIS-d0a2b2893729 -->
| Languages | English, Spanish and Catalan written natively, as in [Localisation](../../communications/references/localisation.md); never machine translation without a native review |

Source: plugin/skills/communications/references/video.md:99.

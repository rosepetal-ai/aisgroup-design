# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-2dd59db217a2

<!-- AIS-2dd59db217a2 -->
Then read [the shared workflow](../_shared/WORKFLOW.md): sources, generators and shared checks; it wins over anything below. Commands run from the plugin folder. Rules for what may be used: [Imagery](../design-language/references/imagery.md) and the [production rules](../_shared/references/production-rules.md). Read them first.

Source: plugin/skills/asset-library/SKILL.md:9.

## AIS-6a4e70a3cb61

<!-- AIS-6a4e70a3cb61 -->
`library/catalog.json` (`{ about, assets: [...] }`) records asset origins, review status and actual restrictions. It does not replace current user decisions or a release checklist. Files live in `library/media/<set>/` (not committed). In recipes, guide files (`brand/`) are referenced as `@guide/` and library files as `@lib/media/…`.

Source: plugin/skills/asset-library/SKILL.md:11.

## AIS-1f9915fe833a

<!-- AIS-1f9915fe833a -->
Filter by `type`, `product`, `brand`, `status`, `origin`:

Source: plugin/skills/asset-library/SKILL.md:15.

## AIS-33baf19769ea

<!-- AIS-33baf19769ea -->
python3 -c "import json;[print(a['status'],a['id'],a['path'],a['size']) for a in json.load(open('library/catalog.json'))['assets'] if 'kariko' in (a.get('product') or '').lower()]"

Source: plugin/skills/asset-library/SKILL.md:18.

## AIS-b012e6a631cc

<!-- AIS-b012e6a631cc -->
Also look outside the catalogue before saying something does not exist: `library/media/3d/machines/` and `machine-previews/` (machine pictures), `library/media/3d/renders/<machine>/` (product sets and `det/` tiles), `library/media/brand-intros/` (intro videos), the AIS websites' media. Report what exists, what is under review and why, and what is missing.

Source: plugin/skills/asset-library/SKILL.md:21.

## AIS-1526050a689f

<!-- AIS-1526050a689f -->
For each new file:

Source: plugin/skills/asset-library/SKILL.md:25.

## AIS-a2b0cc2dd1a3

<!-- AIS-a2b0cc2dd1a3 -->
**Copy, never edit originals.** Put the original in `library/media/originals/<set>/` and the working copy in `library/media/<set>/` with a descriptive kebab-case name: `kariko_tray-infeed.jpg`. Names that leave the studio never say render, CAD or 3D.

Source: plugin/skills/asset-library/SKILL.md:27.

## AIS-b054a603e7ae

<!-- AIS-b054a603e7ae -->
**Customer material:** blur client logos, brand marks, winery or appellation names and identifying codes with a soft Gaussian blur (no black boxes, nothing invented). Keep the unblurred original internal in `originals/`. Customer lines also need the customer's approval before publishing: say so in `reason`.

Source: plugin/skills/asset-library/SKILL.md:29.

## AIS-b124f9bcc09e

<!-- AIS-b124f9bcc09e -->
**Record** one entry per file:

Source: plugin/skills/asset-library/SKILL.md:30.

## AIS-b3429bce3fab

<!-- AIS-b3429bce3fab -->
`id` (kebab-case, unique), `path` (from the plugin folder), `kind` (image, video, graphic), `type` (machine, in-production, detail, interface, subject, people, event, facility, illustration, logo), `brand`, `product`, `lang` (screens with text) or null

Source: plugin/skills/asset-library/SKILL.md:31.

## AIS-b25689071ef7

<!-- AIS-b25689071ef7 -->
`origin`: photo, footage, video, video-frame, screenshot, render, composite, generated or unknown. Say generated or composite when you see it, and why.

Source: plugin/skills/asset-library/SKILL.md:32.

## AIS-09042914a74f

<!-- AIS-09042914a74f -->
`size` [w, h], `people`, `consent` (who and when, or null), `bakedText`, `burnedIn` (video subtitles or watermarks)

Source: plugin/skills/asset-library/SKILL.md:33.

## AIS-902c53516f06

<!-- AIS-902c53516f06 -->
`status` + `reason`: one or two sentences on what it shows and why that status; internal notes (render, CAD) go here only

Source: plugin/skills/asset-library/SKILL.md:34.

## AIS-15a66adea734

<!-- AIS-15a66adea734 -->
`source` (who supplied it, file or URL), `added` (ISO date)

Source: plugin/skills/asset-library/SKILL.md:35.

## AIS-0ebf0895ad6a

<!-- AIS-0ebf0895ad6a -->
**Status:**

Source: plugin/skills/asset-library/SKILL.md:36.

## AIS-72a09182a02b

<!-- AIS-72a09182a02b -->
`rejected`: a generated or composited picture that fails `brand-review` step 1 at its intended size (garbled or invented text, impossible geometry or light, the wrong machine or a logo pasted on another maker's machine, legible client brands it can't lose); machine views showing internals, cutaways or open guards; glow or particle art, and hexagon or circuit art other than the five approved brand patterns; misleading baked-in annotations; corrupt logo copies. Approved AIS demo packaging may carry its identity, valid codes and label text. Finished posts are deliverables, not raw library photos.

Source: plugin/skills/asset-library/SKILL.md:37.

## AIS-6282db0a9c64

<!-- AIS-6282db0a9c64 -->
`review`: real, our render, or a generated/composited picture that passes step 1, but a concrete issue remains: rights, recorded customer restriction, consent for identifiable people, or insufficient resolution for the intended crop. The tool used is not itself an approval gate.

Source: plugin/skills/asset-library/SKILL.md:38.

## AIS-75ecf53e170c

<!-- AIS-75ecf53e170c -->
`approved`: nothing left to confirm.

Source: plugin/skills/asset-library/SKILL.md:39.

## AIS-d378b10902c2

<!-- AIS-d378b10902c2 -->
**Validate** the JSON after editing: `python3 -m json.tool library/catalog.json >/dev/null && echo ok`. Back up first: `cp library/catalog.json library/catalog.json.bak-$(date +%H%M)`.

Source: plugin/skills/asset-library/SKILL.md:40.

## AIS-3726694c48ea

<!-- AIS-3726694c48ea -->
`node engine/check.mjs <recipe>` reports each used asset's catalogue status, so a recipe can't silently use a rejected file.

Source: plugin/skills/asset-library/SKILL.md:42.

## AIS-7cafe82c7ddf

<!-- AIS-7cafe82c7ddf -->
Use the original slide's image relationship (including shape fills) to extract the ZIP media part byte-for-byte. Record deck/hash, slide, relationship ID, part/hash and native dimensions; link identical parts across decks rather than registering duplicates. Keep originals private and register reviewed working copies with explicit crop/blur coordinates and source links. A slide heading establishes context, not exact hardware identity, real-photo origin, publication consent or a validated result. Inspect the native pixels before selecting for a print slot: a larger screen frame may only add counters/identifiers, and a genuine but smaller installation image may be worse at the accepted size. Record that lineage in the catalogue entry (`source`, `reason`) and check retrieval through the MCP; do not create a second registry.

Source: plugin/skills/asset-library/SKILL.md:46.

## AIS-17d70f927cb0

<!-- AIS-17d70f927cb0 -->
3D renders come from the separate product-render skill: product sets, detection tiles (`detection-tiles`) and machine views, listed in `library/media/3d/machines/manifest.json`. Register them with `origin: "render"`, the producing skill as `source`, and `status: "review"` until marketing approves them.

Source: plugin/skills/asset-library/SKILL.md:50.

## AIS-65342d8884b3

<!-- AIS-65342d8884b3 -->
Inspect current machine image folders and manifests before claiming something is missing. Their availability changes during concurrent production. Do not wait for larger originals when an existing credible image or approved product view serves the piece; report actual resolution limits.

Source: plugin/skills/asset-library/SKILL.md:54.

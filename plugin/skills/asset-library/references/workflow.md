# asset-library production workflow

Then read [the shared workflow](../../_shared/WORKFLOW.md): sources, generators and shared checks; it wins over anything below. Commands run from the plugin folder. Rules for what may be used: [Imagery](../../design-language/references/imagery.md) and the [production rules](../../_shared/references/production-rules.md). Read them first.

`library/catalog.json` (`{ about, assets: [...] }`) records asset origins, review status and actual restrictions. It does not replace current user decisions or a release checklist. Files live in `library/media/<set>/` (not committed). In recipes, guide files (`brand/`) are referenced as `@guide/` and library files as `@lib/media/…`.

## Finding

Filter by `type`, `product`, `brand`, `status`, `origin`:

```sh
python3 -c "import json;[print(a['status'],a['id'],a['path'],a['size']) for a in json.load(open('library/catalog.json'))['assets'] if 'kariko' in (a.get('product') or '').lower()]"
```

Also look outside the catalogue before saying something does not exist: `library/media/3d/machines/` and `machine-previews/` (machine pictures), `library/media/3d/renders/<machine>/` (product sets and `det/` tiles), `library/media/brand-intros/` (intro videos), the AIS websites' media. Report what exists, what is under review and why, and what is missing.

## Adding

For each new file:

1. **Copy, never edit originals.** Put the original in `library/media/originals/<set>/` and the working copy in `library/media/<set>/` with a descriptive kebab-case name: `kariko_tray-infeed.jpg`. Names that leave the studio never say render, CAD or 3D.
2. **Look at it** (Read; for video, `ffmpeg -i f.mp4 -vf fps=1/3 ~/.cache/ais-group-design/review/<set>/f%02d.jpg` and Read the frames). Zoom on screens, labels and logos.
3. **Customer material:** blur client logos, brand marks, winery or appellation names and identifying codes with a soft Gaussian blur (no black boxes, nothing invented). Keep the unblurred original internal in `originals/`. Customer lines also need the customer's approval before publishing: say so in `reason`.
4. **Record** one entry per file:
   - `id` (kebab-case, unique), `path` (from the plugin folder), `kind` (image, video, graphic), `type` (machine, in-production, detail, interface, subject, people, event, facility, illustration, logo), `brand`, `product`, `lang` (screens with text) or null
   - `origin`: photo, footage, video, video-frame, screenshot, render, composite, generated or unknown. Say generated or composite when you see it, and why.
   - `size` [w, h], `people`, `consent` (who and when, or null), `bakedText`, `burnedIn` (video subtitles or watermarks)
   - `status` + `reason`: one or two sentences on what it shows and why that status; internal notes (render, CAD) go here only
   - `source` (who supplied it, file or URL), `added` (ISO date)
5. **Status:**
   - `rejected`: a generated or composited picture that fails `brand-review` step 1 at its intended size (garbled or invented text, impossible geometry or light, the wrong machine or a logo pasted on another maker's machine, legible client brands it can't lose); machine views showing internals, cutaways or open guards; glow or particle art, and hexagon or circuit art other than the five approved brand patterns; misleading baked-in annotations; corrupt logo copies. Approved AIS demo packaging may carry its identity, valid codes and label text. Finished posts are deliverables, not raw library photos.
   - `review`: real, our render, or a generated/composited picture that passes step 1, but a concrete issue remains: rights, recorded customer restriction, consent for identifiable people, or insufficient resolution for the intended crop. The tool used is not itself an approval gate.
   - `approved`: nothing left to confirm.
6. **Validate** the JSON after editing: `python3 -m json.tool library/catalog.json >/dev/null && echo ok`. Back up first: `cp library/catalog.json library/catalog.json.bak-$(date +%H%M)`.

`node engine/check.mjs <recipe>` reports each used asset's catalogue status, so a recipe can't silently use a rejected file.

### Recovering embedded presentation imagery

Use the original slide's image relationship (including shape fills) to extract the ZIP media part byte-for-byte. Record deck/hash, slide, relationship ID, part/hash and native dimensions; link identical parts across decks rather than registering duplicates. Keep originals private and register reviewed working copies with explicit crop/blur coordinates and source links. A slide heading establishes context, not exact hardware identity, real-photo origin, publication consent or a validated result. Inspect the native pixels before selecting for a print slot: a larger screen frame may only add counters/identifiers, and a genuine but smaller installation image may be worse at the accepted size. Record that lineage in the catalogue entry (`source`, `reason`) and check retrieval through the MCP; do not create a second registry.

## Renders

3D renders come from the separate product-render skill: product sets, detection tiles (`detection-tiles`) and machine views, listed in `library/media/3d/machines/manifest.json`. Register them with `origin: "render"`, the producing skill as `source`, and `status: "review"` until marketing approves them.

## Known gaps

Inspect current machine image folders and manifests before claiming something is missing. Their availability changes during concurrent production. Do not wait for larger originals when an existing credible image or approved product view serves the piece; report actual resolution limits.

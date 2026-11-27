# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-92b19af4062f

<!-- AIS-92b19af4062f -->
Start with plan_piece and read only what it points to.

Source: plugin/mcp/server.mjs:20.

In the lightweight edition, when the local studio tools are unavailable, run `node scripts/prepare-template.mjs --list` from the installed plugin. Choose the template for the requested piece. Check its listed media status and intended use. A downloadable asset marked for review still needs clearance or an approved replacement before publication. Run `node scripts/prepare-template.mjs <id>`; the returned working directory contains the matching release of the renderer and the source. On first use run `node scripts/setup.mjs` there, then use the piece skill's usual checks and guarded export in that directory. Keep the editable working copy and final files in the user's project. This path requires a host with shell access, Git, Node 22+, Python 3 and network access for the first download.

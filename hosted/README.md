# Hosted AIS Group Design server

The read-only MCP at `https://design.aisgroup.ai/mcp` (also `aisgroup-design.web.app/mcp`), for developers and claude.ai. It answers by what you download; rendering stays in the plugin's local `studio` server.

| Surface | Tool | Downloads |
| --- | --- | --- |
| Code | `design_code` | Tailwind v4 theme, Vue component search and source (`@aisgroup/design`), website components (`@aisgroup/web`), generated PrimeVue and Vuetify presets |
| Assets | `design_assets` | Logos, favicons, the five decorative patterns and backgrounds, approved media, fonts |
| Examples | `design_examples` | Document HTML and PDFs, product component views, approved images |
| Standards | `design_standards` | Tokens (DTCG, CSS, JS), guide search and sections, brand rules in en, es and ca |

`design_standards.kind` selects `tokens` (default), `guidelines` or `rules`. Every tool is read-only. Every answer is capped at 20 KB. Also `GET /files/…` (the downloads, local runs only) and `GET /health`.

Illustrations, mascots and 3D models are held back by decision: their slots return an empty list and that status. Machine CAD and model files are rejected by both the snapshot builder and the download handler.

## Build and run

The server reads only `hosted/data/`, a snapshot of the built guide (`guide/dist`) and curated media library (`library/`). `library/downloads.json` is the same selection offered on the guide's Downloads page: it adds rights metadata without duplicating files and includes official intros and posters. Stock entries link to the photographer's source under its licence; their originals are not copied or served as AIS files. Do not replace the expanded library with an older review import. From the repo root:

```
npm run build -w guide      # the guide
npm run build -w hosted     # snapshot guide/dist into hosted/data/ (AIS_GUIDE_DIST=<built guide> for another build)
npm run start -w hosted     # http://localhost:8080/mcp
npm test -w hosted
```

Rebuild the snapshot whenever the guide changes. The build fails if a usage rule it quotes is no longer in the guide.

## Deploy

It runs as the Firebase function `mcp` (`function.mjs`), behind the guide's hosting: `firebase.json` at the repo root rewrites `/mcp` to it and lists this folder as the functions source, so `npm run deploy:guide` (`firebase deploy --only hosting:aisgroup-design,functions:mcp`) publishes both (see the root README). Firebase only uploads a functions source inside the folder that holds `firebase.json`, which is why it lives at the root, and it matches `ignore` against absolute paths, which is why those patterns start with `**/hosted/`. Of `data/downloads/*/` only `aisgroup-web/` and `vue-themes/` are uploaded, because `download-tools.mjs` loads them at start; a new folder the server reads must be added to that exception, or the function fails to start. The predeploy step rebuilds `data/` from the built guide; the upload leaves out everything the guide already serves (logos, fonts, photos, downloads), so the function carries only the text it answers from.

The deploying account needs, on the `aisgroup-design` project: Firebase Admin, and **Service Account User** (`roles/iam.serviceAccountUser`) to act as the function's runtime service account. A project owner has both. The project is on the Blaze plan and its APIs are on.

The function declares the secret `AIS_MCP_TOKEN`, so the deploy fails until it exists. Create it once (it enables Secret Manager the first time): `openssl rand -base64 32`, then `npx firebase-tools functions:secrets:set AIS_MCP_TOKEN --project aisgroup-design` and paste the value. Each deploy pins the secret's latest version: to rotate it, set a new value, deploy again and hand the new token to every user.

Cost: no instance runs while nobody calls it; one 256 MiB instance answers up to 80 calls at once; at most two instances. At a team's traffic this stays inside the free monthly allowance. After the first deploy, keep old build images from piling up in Artifact Registry with `firebase functions:artifacts:setpolicy`.

| Variable | Default | Meaning |
| --- | --- | --- |
| `AIS_MCP_FILES_BASE` | `https://aisgroup-design.web.app` | Function only: where download links point (the guide's own files) |
| `AIS_MCP_TOKEN` | Secret Manager in the function, unset (off) locally | `/mcp` needs `Authorization: Bearer <token>`; anything else gets 401. Never in the repo or in a `.env` here (it would be uploaded). |
| `AIS_MCP_RATE_LIMIT` | `120` | Requests per minute per caller, per instance |
| `AIS_MCP_CORS_ORIGIN` | unset (off) | The one browser origin allowed to call it; any other browser origin is refused |
| `AIS_GUIDE_DIST` | `../guide/dist` | Build only: the built guide to snapshot |

Locally, `npm start -w hosted` serves the same handler on port 8080 with the snapshot's files at `/files/…` (`PORT`, `AIS_MCP_BASE_URL`, `AIS_MCP_TRUST_PROXY` apply there); `firebase emulators:start --only functions` from the repo root runs the function itself.

## Connect

```
claude mcp add --transport http ais-group-design https://design.aisgroup.ai/mcp --header "Authorization: Bearer <token>"
```

Ask for the token through the password manager, never a repo or a chat; Claude Code keeps it in `~/.claude.json` (or the project's `.mcp.json`, which must not be committed). claude.ai custom connectors sign in with OAuth rather than a fixed token, so they can't connect. To check a deploy, `tools/list` with the header must list the four tools and without it answer 401; `/health` answers only on the function's own URL, since the hosting hands it `/mcp/health`.

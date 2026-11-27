# setup production workflow

1. Run `node scripts/setup.mjs` from the plugin folder (two levels above this skill's base directory). It installs only what is missing: the plugin's Node packages, the Chromium the renderers use and a Python environment with Pillow, python-pptx and PyMuPDF. Don't run `npm ci` or `npm install` yourself; the setup does it.
2. Show the person the checklist it prints. For each line marked MISSING, do what the line says; system tools (Poppler, ffmpeg) need the person's permission to install.
3. The media library needs no account: pictures download on demand from the public bucket. For a full copy to work offline, install the Google Cloud CLI and run `npm run media:pull`.

## Build an editable inspection animation

Use Node.js 22.12 or newer and access to the AIS private model pack. From the installed plugin directory, run `node scripts/animation-build.mjs create <new-project-folder>`. The command copies the scene and branded components into the project, installs its pinned dependencies, and produces a standalone `index.html`. With `--prepare-only`, an agent can adapt the editable scene to the salesperson’s brief before rendering. Run `node scripts/animation-build.mjs build <project-folder>` to install any missing toolchain and render. Generated projects can also rebuild with `npm run build` in their own folder.

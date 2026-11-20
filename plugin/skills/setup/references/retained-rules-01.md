# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-7fa0b34ee441

<!-- AIS-7fa0b34ee441 -->
Run `node scripts/setup.mjs` from the plugin folder (two levels above this skill's base directory). It installs only what is missing: the Chromium the renderers use and a Python environment with Pillow, python-pptx and PyMuPDF.

Source: plugin/skills/setup/SKILL.md:8.

## AIS-26a526edec28

<!-- AIS-26a526edec28 -->
Show the person the checklist it prints. For each line marked MISSING, do what the line says; system tools (Poppler, ffmpeg) need the person's permission to install.

Source: plugin/skills/setup/SKILL.md:9.

## AIS-089fde71ea49

<!-- AIS-089fde71ea49 -->
The media library needs no account: pictures download on demand from the public bucket. For a full copy to work offline, install the Google Cloud CLI and run `npm run media:pull`.

Source: plugin/skills/setup/SKILL.md:10.

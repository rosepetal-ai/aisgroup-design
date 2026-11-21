# Quote post

**Look (post system; `docs/recipes.md`, *The post system*):** navy: the words in « » in every language on solid brand blue, sized to fill, name and role on one line; no portrait and no photo. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/post-quote.json` (one `quote` shot, brand `rosepetal`, formats `4x5` and `1x1`).

## What it is for, and when not

A person's exact words, with their name, role and a small portrait. The post is white: the logo is at the top, and the quote mark, the words and the person sit at the foot.

- Words someone did not say exactly: not a quote. Never paraphrase.
- A customer's words without their written approval: not yet. Ask for the approval first.
- A long argument: a video (the interview type in `brand-video`) or a carousel.

## The template

José Racionero, CEO and co-founder of Rosepetal.

- The words are «Una estimación personal no es una tasa de fallos medida.». He said them exactly so at 13:04 of Rosepetal's VISION 2026 interview (YouTube dVtk_PbZgHU).
- The portrait is a square cropped from the 1080p interview.
- The words are on white, at the foot.

## The brief

- Who said it, and their role as they write it.
- The source: a video and minute, or a document and page.
- The exact words. Listen at the timestamp, because automatic transcripts get words and names wrong ("Jensen Juan" for "Jensen Huang").
- For a customer: who approved the quote in writing, and when.
- A portrait, and the person's consent to use it.

## The picture

- **Qualifies:** a real square portrait of the person who spoke, from the same interview or supplied by them, clear of burnt-in captions and watermarks.
- **Size:** the portrait is shown at 160 px. The template's is 330 × 330; keep at least about 200 px square.
- **Fits today:** `rosepetal/jose-racionero_portrait.jpg`.
- **Never acceptable:** a generated face, a portrait of someone else, or a frame that still shows the interview's subtitles or the Rosepetal mark.

## Structure

One `quote`:
- `quote`, `name`, `role` and `portrait`. Leave `bg` out: the quote sits on white, with no hexagon pattern;
- `consent`: who allowed the portrait, and when;
- `permission`: who approved the words in writing and when, or for public words, the published source and minute.

## Words

- **Quote:** a short, complete sentence, exactly as said. Five lines at most: long quotes fail. Choose a whole sentence, never a fragment that changes the meaning.
- **Quote marks:** the engine sets « » in every language. Don't type marks into the text.
- **Name and role:** "José Racionero", "CEO y cofundador de Rosepetal".
- **Copy:** where and when they said it and on what, where to watch or read the rest, then one call to action. Example: "En VISION 2026, José Racionero habló de cómo decidir si un sistema con IA es fiable: con datos medidos en la línea, no con impresiones. La entrevista completa está en nuestro canal. Envíanos muestras".

## Mistakes to avoid

- Paraphrasing, or "tidying" the words.
- Trusting the automatic transcript without listening.
- A fragment cut so it says something the speaker did not mean.
- A customer quote without written approval. Isaac Sainz of Daymsa is quoted in the case published on aisvision.com on 20 October 2020, which counts as the approval: his words go on a post as published there.
- `permission` with "pending" or "pendiente": the check fails it.

## Before publishing

- Someone listened at the timestamp and the words match exactly.
- The speaker, or for a customer their company, has confirmed the use in writing.
- The portrait's consent is recorded.

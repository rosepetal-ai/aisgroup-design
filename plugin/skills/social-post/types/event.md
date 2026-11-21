# Event post

**Look (post system; `docs/recipes.md`, *The post system*):** blue: our stand across the top, with a hard edge over the brand-blue panel under the white headline. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/post-event.json` (one `event` shot, formats `4x5` and `1x1`).

## What it is for, and when not

It announces a trade fair before it happens: our stand across the top, the event name large, then the date and the place as two short rows. **The event is announced once, here.**

- After the event: **recap** for one photo, or the carousel event type (a recap) for several moments.
- A carousel is never a second announcement of the same event.

## The template

Image first.

- Our AIS Vision Systems stand at Advanced Factories 2026 under its hexagon lights runs edge to edge across the top (`split` 0.4).
- Below it on navy: "Te esperamos en", ENOMAQ 2027 in large type, and two rows (the dates; the city, hall and stand).
- The logo signs at the foot.
- The square version drops the photo, because the rows and a photo do not fit.

## The brief

- The event's name and year, written as the organiser writes them.
- The dates, the venue and hall, and the stand number.
- What we will show there. This goes in the caption (`copy`).
- Which photo of our own stand or team, and whether the people in it consent.

## The picture

- **Qualifies:** our own stand or team at a previous fair, real, with the people's consent. Show the stand itself, ours alone.
- **Size:** the band is 1080 wide and `split` × 1350 tall (540 at 0.4). The template's photo is a 1152 × 1536 portrait, so the band uses its width; keep `scale` low enough to stay under the 1.5× limit.
- **Framing:**
  - `split` 0.4, edge to edge, with `focus` and `scale` set to keep our stand and **crop out other exhibitors' stands**, organisers' signs and other brands. The template uses `focus` [8, 80] and `scale` 1.35.
  - For the square, `formats.1x1` sets `src` to `null`. The square drops the photo so the rows stay readable, and the hexagon pattern fills the space instead.
  - The hexagon pattern appears only below the photo, never over it.
- **Fits today:**
  - `advanced-factories-2026/af26_stand-hexagons.jpg`, our stand at Advanced Factories 2026 under the hexagon lights (this template uses it);
  - `real/latamcan2026_stand.jpg`, our team at LATAMCAN 2026;
  - `real/af2026_stand-machines.jpg` and `real/af2026_stand-portrait.jpg`, Advanced Factories 2026 (other exhibitors show in the background: crop them out);
  - for Rosepetal: inspect the four MWC photos in carousel-event and reuse a suitable one when useful.
- **Never acceptable:** bottles or products that fail credibility; the organiser's or the venue's logos; other exhibitors' stands; a photo of a previous fair captioned as if it were the new one; stills from the Advanced Factories footage with visitors who have not consented.

## Structure

One `event`:
- `src`, `split`, `focus` and `scale`;
- `lead`: "Te esperamos en";
- `event`: "ENOMAQ 2027";
- `rows`: two, with the icons `calendar` and `map-pin`. Each must fit on one line;
- `formats.1x1` without the photo.

## Words

- **Lead:** two or three words: "Te esperamos en" / "Meet us at" / "Us esperem a".
- **Event:** the name and year. The check accepts capitals only for names on its list (ENOMAQ, LATAMCAN, MWC). Write any other name in the organiser's sentence case: "Advanced Factories 2027", not "ADVANCED FACTORIES".
- **Rows:** two, one line each:
  - "Del 26 al 28 de enero de 2027";
  - "Zaragoza, pabellón 8, stand B24-27".
- **Copy:** what we will show, an invitation to bring their product, then one call to action. Example: "Estaremos en ENOMAQ con la inspección de etiquetas funcionando en el stand. Trae tus botellas y te enseñamos el resultado. Solicita una demo".

## Mistakes to avoid

- A third row, or a row that wraps onto a second line.
- Keeping the photo in the square: the rows and a photo do not fit.
- Another exhibitor's stand or sign left at the edge of the crop. Check the corners at 2× zoom.
- A caption or copy that implies the photo was taken at the event being announced.
- Making a carousel that announces the same event again.
- Event logos, stand renders or the organiser's artwork.

## Before publishing

- The dates, hall and stand match the organiser's exhibitor list.
- The people in the photo consent.
- No other brand shows in the photo.

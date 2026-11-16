# News post

**Look (post system; `docs/recipes.md`, *The post system*):** blue: the photograph across the top, with a hard edge over the brand-blue panel under the white headline. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/post-news.json` (one `hero` shot, format `4x5`).

## What it is for, and when not

Something that happened at the company: a visit, an agreement, a new site, a new team member. One real photo of the moment, large, one headline, and the place and date in the post text.

- An event outside that we took part in (a talk, a panel, a fair): **recap**.
- A fair still to come: **event**.
- A product: **product**. News is not a sales post in disguise.

## The template

The Packaging Cluster visit to Sabadell, March 2026.

- The people who came are shown at the photo's true grade, ending on a hard edge.
- The picture takes about two thirds of the post (`split` 0.64).
- Below, on navy: one headline, with the logo at the foot. There is no `text` line.
- Nothing is written on the picture.

## The brief

- What happened, and when.
- Who was involved, with the organisations' names written as they write them.
- The photo, and the consent of every person in it.
- Who to thank, if anyone. This goes in the caption.

## The picture

- **Qualifies:** a real photo of the moment itself, such as the visitors in our building, with every person's consent.
- **Size:** at `split` 0.64 the band is at most 1080 × 864, a little less once it ends above the words. The picture needs at least about 1080 px wide and 700 px of height; the template's is 1500 × 1125.
- **Framing:**
  - `split` 0.64 and `focus` [50, 55], so that every face is inside the band, none cut at the edge.
  - The band shrinks if the headline needs room, never below 30 %, so check the faces again after a longer headline.
- **Fits today:**
  - `real/ais_packaging-cluster-visit.jpg` (this template uses it);
  - `real/ais_sabadell-building.jpg`, the AIS building in Sabadell (approved, first-party), for news about the site. The application carousel closes on the same photograph: don't use it in a news post the same week.
- **Never acceptable:** stock photos of handshakes or offices, generated people or rooms, or a photo of another day passed off as this one.

## Structure

One `hero`: `src`, `split`, `focus` and `headline`. It has no `text`, no `items` and no caption chip. The logo signs at the foot on its own.

## Words

- **Headline:** who did what, with the accent on the verb phrase: "El Packaging Cluster *nos visita*".
- **Copy:**
  1. what happened and what we did together;
  2. thanks;
  3. one call to action.

  Example: "El Packaging Cluster visitó nuestra sede de Sabadell: vimos juntos cómo trabajamos la inspección por visión, del laboratorio a la línea. Gracias por venir. Cuéntanos cómo es tu línea". The call to action may recur; the sentences before it are new for every post.

## Mistakes to avoid

- Names, titles or logos written on the picture.
- Praise for the visitors or for ourselves ("líderes", "referentes").
- Turning the visit into a product pitch.
- Tagging or naming people who have not agreed to it.

## Before publishing

- Every person in the photo consents to its use.
- The organisations' names are written as they write them.
- The date is right.

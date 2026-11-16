# Recap post

**Look (post system; `docs/recipes.md`, *The post system*):** blue: the photograph across the top, fading into deep blue under the white headline. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/post-recap.json` (one `hero` shot, format `4x5`).

## What it is for, and when not

After an event where we took part, such as a talk, a panel or a stand. It has one real photo of us there, with the topic as the headline.

- Before the event: **event**.
- Several moments (the stand, a demo, a talk): the carousel event type, which is a recap.
- A visit to our own building, or other company news: **news**.

## The template

Packaging Talks 2026.

- The event photographer's picture of the panel is shown at its true grade, ending on a hard edge.
- The topic is the headline, on navy below, with the logo at the foot.
- The photographer's permission is needed before publishing.

## The brief

- The event's name and year, and what we did there (a talk, a panel or a stand).
- The topic, in the event's own words if there was a title.
- Who took the photo, and whether we may use it.
- Who to thank: the organisers, and the other panellists if we name them.

## The picture

- **Qualifies:** a real photo of us at that event, on stage or at the stand, taken by us or by the event photographer with permission.
- **Size:** at `split` 0.66 the band is at most 1080 × 891, a little less once it ends above the words. The picture needs at least about 1080 px wide and 715 px of height; the template's is 1500 × 1002.
- **Framing:**
  - `split` 0.66 and `focus` [50, 50] on the stage. The picture takes about two thirds of the post.
  - The photo is shown clean, so the backdrop's lettering stays readable. Nothing is laid over it.
  - Keep our people inside the band. It shrinks if the headline needs room, never below 30 %.
- **Fits today:**
  - `real/packaging-talks2026_panel.jpg` (this template uses it);
  - `real/af2026_stand-machines.jpg` or `real/af2026_stand-portrait.jpg` (our stand at Advanced Factories 2026; crop out the other exhibitors in the background). The hexagon-lights view, `advanced-factories-2026/af26_stand-hexagons.jpg`, is the event post's picture;
  - for Rosepetal at 4YFN: all four MWC photos are now in carousel-event (`mwc2026_visitors.jpg` is its contact slide). Ask for another.
- **Never acceptable:**
  - the event's promotional artwork, or other speakers' slides as the subject;
  - pictures from an organiser's site without permission;
  - a photo from another event.

## Structure

One `hero`: `src`, `split`, `focus` and `headline` (the topic). There is no overline, no `text`, no `items` and no caption chip: the post text names the event, and the logo signs at the foot.

## Words

- **Headline:** the topic itself, short, with the accent on its second half: "Digitalización *y trazabilidad*". Fewer words leave more picture.
- **Copy:** what was discussed, thanks to the organisers and fellow panellists, then one call to action. Example: "En Packaging Talks 2026 hablamos de digitalización y trazabilidad en el envase. Gracias a la organización y a los compañeros de mesa. Cuéntanos cómo es tu línea". The call to action may recur; the thanks and the sentence before it are new for every post.

## Mistakes to avoid

- Saying we presented, launched or won something we did not.
- Getting the names or companies of the other panellists wrong.
- Reusing the photo from the event announcement.
- Publishing the photographer's picture before they say yes.

## Before publishing

- The event photographer has given permission.
- The other panellists' names and companies are right, if the caption names them.

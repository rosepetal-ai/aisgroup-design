# Result post

**Look (post system; `docs/recipes.md`, *The post system*):** navy: the figure as large as the slide allows on solid brand blue, the source on one line, no picture. Every post carries the hexagon corner, drawn by the engine. Where this playbook mentions `split`, `bg`, a portrait or the hexagon pattern, the post system wins.

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/post-result.json` (one `stat` shot, formats `4x5` and `1x1`).

## What it is for, and when not

One verified figure, with its conditions, its basis and its source. It says "this is what it changed, for whom, measured how".

- A figure without a published, approved source: don't make the post. Ask where the figure is published.
- Counters read off a screen: not a result. They are a run.
- A lab test: only as `"basis": "measured"`, with its conditions, and never presented as a production result.

## The template

Daymsa, 95 %.

- The figure is Daymsa's own estimate of the reduction in time and staff spent on quality inspection, after AIS installed the label and cap control on a bioestimulant packaging line.
- It was published in the case study on aisvision.com on 2020-10-20.

## The brief

- The figure, its metric and its baseline.
- The conditions: what was installed, on which line and product.
- Who measured or estimated it. That sets the basis: `measured`, `estimated`, `target` or `illustrative`.
- Where and when it was published. That is the `source`.
- Whether the customer approves being named, and the case study link if the call to action is "Descarga el caso de éxito".

## The picture

None. The post stays on solid brand blue with the hexagon corner, and the figure sits at the foot. Do not add a photo to decorate it. A result that needs the customer's line in pictures is a carousel or a case-study video.

## Structure

One `stat`:
- `"evidence": "case"` with `"source"`. This is a new rule: a figure published in an approved case study must name its source, and the check fails without it.
- `basis`;
- `value`, the number only;
- `unit`: " %" in Spanish and Catalan, "%" in English;
- `text`, the metric;
- `note`, the conditions.

`evidence` is `case` for a published case, `system` for a figure exported by the system on a real run, and `illustration` only with `"basis": "illustrative"`.

## Words

- **Label:** "Caso de éxito: Daymsa".
- **Value and unit:** "95" and " %".
- **Text:** the metric in plain words: "menos tiempo y personal en la inspección de calidad".
- **Note:** who estimated it, after what, on what line, and where and when it was published. Example: "Estimación de Daymsa tras instalar el control de etiqueta y tapón de AIS en una línea de envasado de bioestimulantes. Caso publicado en aisvision.com, 2020."
- **Copy:** the full sentence with the conditions, what the system does, and the call to action. Example: "Daymsa estima en un 95 % la reducción del tiempo y del personal que dedicaba a la inspección de calidad, después de instalar el control de etiqueta y tapón de AIS en su línea de envasado. Tres cámaras revisan el envase en la línea: el roscado del tapón, la etiqueta, el código de barras y los datos variables. Descarga el caso de éxito".

## Mistakes to avoid

- Dropping "estimated". This is Daymsa's estimate, not a measurement.
- Dropping "up to", rounding, or turning "time and staff" into "cost".
- Two figures on one post, or a figure loose in a headline.
- A figure without a named customer, a baseline and its conditions.
- A figure read off a video card instead of its published source.

## Before publishing

- The case study is still published and approved.
- The customer agrees to be named.
- The figure and its conditions match the case word for word.

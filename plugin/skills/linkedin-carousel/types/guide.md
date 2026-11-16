# Guide carousel

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/carousel-guide.json` ("How to estimate the return of a vision system", English, five slides).

## What it is for, and when not

A how-to. The slides are: the question, why it matters, what to gather, where to start, and talking to an engineer. It teaches something useful before any sale.

- One machine: **product**.
- A result with a figure: the result post (`social-post`), with a published source.

## The template

Five slides:

- a dark cover with the real bottling line (`split` 0.64), ending on a hard edge, the question only, and the logo at the foot;
- AIS KARIKÓ on a tray line, framed large on a white slide with one headline;
- a dark grid of six numbers with icons and the hexagon pattern. Here icons are right: the numbers are things to gather, not something a picture can show;
- the KARIKÓ counters screen, on a white slide. Its counters are a demo run, so the caption under it says "Counters per check on an AIS KARIKÓ screen" and never "on a line in production";
- the blue contact slide, with no picture.

## The brief

- What question does the guide answer, for whom (plant managers, quality, buyers)?
- What are the steps or items? Take them from AIS's own material, or agree them with the person.
- In which language? Write a separate recipe for each language, natively.
- Which real pictures can illustrate it without claiming a result?

## The picture

- **Qualifies:** real lines and screens that show the setting. None of them may suggest a measured result.
- **Size:**
  - The 1800 × 1013 bottling line fills the cover band at `split` 0.64 without enlargement.
  - The 1138 × 540 KARIKÓ frames hold a framed picture up to about 675 px tall before the 1.25× warning, about half the slide. At `split` 0.62 the words take the rest of the room and keep the picture inside that; read the render's warnings.
  - The engineer frame is 1280 × 720.
- **Framing:** the cover at `split` 0.64. The panels are `"bg": "white"` at `split` 0.62, with `focus` on the machine and the counters ([80, 45]). Every panel has a caption, set under the picture, and the engine fails one whose picture gets under 40 % ("picture-small"). Crop out the half-cut screen title at the left edge of the counters screen.
- **Fits today:** `advanced-factories-2026/still-bottling-line.jpg`, `real/kariko_on-the-line.jpg`, `real/kariko_defect-screen.jpg` (this template uses them), and `real/ais-engineer-rosepetal-screen.png` (the engineer is identifiable, so confirm his consent before using it). `ais-people-video` holds other frames of AIS people at work.
- **Never acceptable:**
  - generated factories or robots;
  - fluid textures or abstract backgrounds;
  - a screen's counters presented as a result.

## Structure

1. **`hero`, dark cover:** the line, the question as headline. No `text`.
2. **`panel`, white, why:** a photo and caption, headline. No rows.
3. **`grid`, dark, what to gather:** six cells with `icon`, `text` and `detail` and no photo, with the hexagon pattern.
4. **`panel`, white, where to start:** the screen and caption, headline. No `text`.
5. **`contact`, brand blue:** the headline, `action`, and two rows (web, phone). No `text`.

## Words

- **Cover:** "How to estimate *the return* of a vision system".
- **Accent:** on the cover and the contact slide only. Inner headlines are plain.
- **Why:** "Estimate it before you invest". The reasons (prioritise by real impact, compare options on technical criteria, reduce the risk) can go in the copy.
- **Grid:** "Six numbers to gather first". Six cells:
  - "Cost of the problem" with "Scrap, rework, claims";
  - "Volume and defects" with "Defect rate over total output";
  - "Manual inspection" with "Direct and indirect cost";
  - "Integration" with "Installation and maintenance";
  - "Payback" with "Monthly savings, months to recover";
  - "Three scenarios" with "Conservative, base, optimistic".
- **Where to start:** "Start from what the line already measures".
- **Contact:** "Before investing, *calculate the return*" and the action "Tell us about your line". No closing line on the slide.
- **Copy:** what the guide covers in one sentence, "A short guide to what to gather first.", and the call to action.

## Mistakes to avoid

- Example ROI figures. If one is needed, it goes on a `stat` with `"basis": "illustrative"` and `"evidence": "illustration"`.
- A caption that turns the demo counters into a production result.
- More than six cells, or details longer than one line: cells off the canvas now fail the check.
- Rows or a body line on a white slide. They take room from the photo, and under 40 % the check fails ("picture-small").
- Turning the last slides into a sales pitch.

## Before publishing

- The bottling line's source and the customer's approval (see the catalogue reason).
- The KARIKÓ frames: ask marketing for the clean master.
- The engineer, if his frame is used, consents.

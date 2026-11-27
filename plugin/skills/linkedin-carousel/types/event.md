# Event carousel (recap)

Current rules: [shared workflow](../../_shared/WORKFLOW.md). The examples and availability notes below are references, not approval records. Keep approved AIS demo identities; judge generated imagery by credibility. Choose a slide count and any reuse for a reason; event facts and customer results still need authentic evidence.

Template: `templates/carousel-event.json` (Rosepetal at 4YFN, MWC Barcelona 2026, English, four slides).

## What it is for, and when not

A recap after an event we took part in. The slides are: the stand, the demo, the talk, and how to see it if you missed us. **Recap, not announcement.**

- An event still to come: the event post (`social-post`). It is announced once, there.
- One moment, one photo: the recap post (`social-post`).

## The template

Rosepetal at 4YFN, MWC Barcelona 2026 (2 to 5 March), on the Tech Barcelona stand. It is in English and uses real photos that Rosepetal published on rosepetal.ai:

- a dark cover with the stand (`split` 0.64), the headline only, the logo at the foot;
- two white slides, the demo and the talk, each a large framed photo with its caption and one headline;
- the blue contact slide, with no picture.

## The brief

- The event, its dates and our stand, as the organiser writes them.
- What we did: demos, talks, meetings.
- Which photos, who took them, and whether they were published by us.
- Are visitors recognisable? If so, do they consent?
- The language. An international event can go in English.

## The picture

- **Qualifies:** real photos of our stand, our demo and our talk at that event. Each slide shows a different moment.
- **Size:** at `split` 0.64 the cover band is at most 1080 × 864. On the white slides pictures are framed about 920 wide. The 1600 × 1204 and 1280 × 1707 photos fill both without enlargement.
- **Framing:** `split` 0.64 on the cover and 0.62 on the inner slides, with `focus` on the people and the demo. The inner slides are `"bg": "white"`, with a `caption` under the picture that says what the moment is; the engine fails one whose picture gets under 40 % ("picture-small"). Crop out other exhibitors' stands where they are not the hosts.
- **Fits today:**
  - `rosepetal/mwc2026_stand.jpg`, `mwc2026_demo.jpg` and `mwc2026_talk.jpg` (this template uses all three), and `mwc2026_visitors.jpg`;
  - for AIS, `real/af2026_stand-machines.jpg` and `real/af2026_stand-portrait.jpg` (Advanced Factories 2026; the portrait can go full-bleed; crop out other exhibitors). The can demo frame `advanced-factories-2026/af26-can-demo_dents.png` (720 × 1280) is too narrow for a 920-wide frame without a soft warning, and its tile belongs to carousel-sector. `advanced-factories-2026/af26_stand-hexagons.jpg` is the event post's picture: reuse it in the recap only when it adds meaningful continuity.
- **Never acceptable:**
  - the organiser's promotional artwork or logos;
  - close-ups of visitors without consent;
  - photos from another event;
  - a repeated announcement photo that adds no meaning to the recap.

## Structure

1. **`hero`, dark cover:** the stand photo, headline. No `text`, no icon chips.
2. **`panel`, white, demos:** a photo and caption, headline. No `text`.
3. **`panel`, white, talks:** a photo and caption, headline. No `text`.
4. **`contact`, brand blue:** a "missed us?" headline, `action`, and rows. Rosepetal has only the web row. No `text`.

## Words

- **Cover:** "Four days *on the stand*". Where we were (the Tech Barcelona stand, Talent Arena) goes in the copy.
- **Accent:** on the cover and the contact slide only. Inner headlines are plain.
- **Demos:** "Camera, robot arm and our software".
- **Talks:** "What we have learnt building AI software".
- **Contact:** "Missed us *in Barcelona*?" and the action "Book a demo". The offer ("we can show you the platform on your own images") goes in the copy.
- **Copy:** thanks to the people who came and the hosts, what happened in one sentence, an offer for those who missed it, and the call to action.

## Mistakes to avoid

- Announcing: dates to come, "visit us", a stand number for a future fair.
- Inflating the event: visitor counts, "the best", "everyone".
- Stating the number of days wrong. Count them from the organiser's dates.
- Reusing a photo from the announcement post.
- A body line under a photo: the headline carries the slide.

## Before publishing

- The photos were published by us, or their author has given permission.
- Recognisable visitors appear only as event coverage, not in close-up.
- The event's name and dates match the organiser's.

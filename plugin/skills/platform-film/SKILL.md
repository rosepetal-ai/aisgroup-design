---
name: platform-film
description: "Plan and edit Rosepetal software films, website product footage and step-by-step tutorials. Use for recorded application footage alone or composited onto the machine’s Panel PC."
---

# platform-film

Apply the [writing essentials: use «» for prose quotes, UI labels and section names in every language; no decorative separators or English contractions](../communications/references/writing-essentials.md) to this reply and artifact; preserve syntax in code, JSON and raw file excerpts. [Production rules](../_shared/references/production-rules.md): no glow or gradients; mascots and illustrations stay held; no public CAD or mesh downloads.

Rule [AIS-cba1a88e1cbf: Keep it simple: one purpose, the plainest layout, design and implementation that serve it.](../ais-brand-guidelines/references/retained-rules-01.md#ais-cba1a88e1cbf).

This skill owns every film that shows the Rosepetal software. Live three.js pages belong to `live-animation`; stills of products or machines to `product-render`; other marketing videos to `brand-video`.

| Genre | Where it plays | Picture | Sound and ends | Pointer |
| --- | --- | --- | --- | --- |
| **Website film**: the Platform films, any film inside a site page | Inline, muted | The whole app at the site's content width; words under or beside it; one thin ring; evidence beside | None; the site's opening and closing cards; under 85 s | The system arrow, no ring |
| **Customer or standalone film**: a proposal, a video posted on its own | On its own | The app on the rendered Panel PC, the machine, captions in the band | 25 fps; the brand intro, the end card, the Rosepetal soundtrack | The system arrow, no ring |
| **Tutorial**: one task, steps on screen, no voice | On its own | The whole app with step texts | The brand intro, a title card, the end card, the soundtrack | The drawn pointer with its press ripple |

The bars: for website films, the homepage product film and the `/platform/*` sections ([site film](references/site-film.md)); for customer films, real app recordings with the customer’s approved images and the machine as a photograph would show it; for tutorials, the guide's rules, made with the video engine's tutorial template ([tutorial](references/tutorial.md)). Anything a quality team would read as fake is a blocker.

## Before recording

Use the brief and any approved session already supplied. Ask for missing details in one short message: the demo URL, the task and starting screen, the example dataset or product, and what this account may do on camera. An ordinary reply is enough for these details. When sign-in is needed, invite the user to sign in directly or use the host’s secure credential prompt. Passwords, one-time codes and session tokens stay out of chat and take files. [Recording access and setup](references/recording.md#recording-access-and-setup)

## Order of work

1. **The sentence and the beat sheet.** Write the one sentence a stranger repeats after one watch, then the beats with their captions and holds. Read [story](references/story.md).
2. **Real material.** The customer's captures for a customer film, the demo site's datasets for a website film; check every image at 100 %. Read [recording](references/recording.md), «Real material».
3. **Key stills first.** One still per beat. A fresh reviewer checks them against the bar before anything is animated or cut. Show them to the requester with the beat sheet.
4. **Record the app** in the real software. Read [recording](references/recording.md).
5. **Render the machine**, for films with the machine, and the Panel PC plate with its screen passes. Read [machine](references/machine.md).
6. **Assemble.** A website film in the page with the site's overlays ([site film](references/site-film.md)); a customer or standalone film with `scripts/cut.py`, the recordings on the rendered screen ([edit](references/edit.md)).
7. **Review the film** at normal speed, then fix and record each new remark as a rule in this skill before fixing it.

## Rules that got films rejected

- **The whole app, never cropped or zoomed**. The app moves; the camera does not move inside it.
- **Real camera frames only.** Never a rendered or generated product image inside the app.
- **Nothing that reads as a demo**: no placeholder thumbnails, «Demo» names or unrelated formats on screen.
- **Never fill a stage that has no real input**. Skip it, or show values the requester approved, named as such.
- **One story**: the model trained on screen is the one selected later; the format saved is the one the operator picks.
- **Every reused image checked at 100 %**: vintage or lot, identity, and that anything shown as good passes the film's own rules.
- **A reject is the subject of its shot**, its defect toward the camera.
- **Captions say what the customer gains**, never which button to press.
- **Nothing on the app** but one thin ring on the value the words name. Cards replace the app, never sit over it.
- **Honest figures**: real data reads modest; never inflate it, and show one figure a model.

## Resources

App recordings, Chromium captures and renders are heavy jobs: one at a time, under the shared render lock, with a memory budget (`../live-animation/scripts/safe.sh`). Cycles renders run on the render machine, never beside a capture. Customer material stays private: never in a repository, a public page or an outside service.

## References

- [story](references/story.md): the sentence, beats, captions and holds, honest figures, the reader test.
- [site film](references/site-film.md): website films: the originals, the series, the page, the ring, cards, evidence, review.
- [tutorial](references/tutorial.md): recording a tutorial take and rendering it with the engine's template.
- [recording](references/recording.md): the three app rigs, one frame and one timeline, real material, stand-ins, the cursor.
- [machine](references/machine.md): the hall, the machine, the Panel PC plate, push-ins and pull-outs, inserts, rejects, the passes the renderer delivers.
- [edit](references/edit.md): compositing, captions, cutting, export and the final review.

# Website films

A film played inside a website page: the Platform films (Labeling, Training, Flows and Panels, Deploy) and any other software film on a site. It is muted and inline, with the site's opening and closing cards. The rules for videos posted on their own (brand intro, end card, soundtrack, 25 fps) don't apply to it.

The reference look is the films already on the Rosepetal site: the homepage product film (`landing/ProductFilm.astro`, `videos/rosepetal-product.mp4`) and the animated sections of the `/platform/*` pages.

## Start from the original films

The Platform films improve the original illustrated films (`src/animations/sections/platform/*` on the Rosepetal site); they are never rebuilt from a screen recording alone.

- Keep their story, beats, hardware scenes and explanations. Every beat the original explained is still explained.
- Change only three things: the rhythm (holds by reading time, no dead time, cut on action), the app (the real app's screens in place of the drawn ones, whole), and the look (the current brand guide).
- Check side by side with the original: as clear or clearer, nothing lost. Swap only what was criticised; never restyle or drop what wasn't.

## One series

- **One product through all four films** (a blind review found the old single-product story easier to follow). The demo site's cable inspection has all four steps on real data, so the series follows the cable.
- The same opening, closing and step indicator (1 Labeling, 2 Training, 3 Flows and Panels, 4 Deploy). Each closing leads to the next step.
- Each message is positive: what the customer gains, then the honest check.

## The page

- **Light, with the site's header.** The app runs the full content width in the homepage film's thin frame, its own text at 15 to 17 px on a 1600 × 1000 desktop. Record at the viewport that gives that size at device scale 2; never upscale recorded pixels.
- **The words go under the app or in a narrow column beside it, never on it.** No dark stage, no gradients.
- **Phones** show the same whole app across the width and carry the named value in the words, never a crop.
- Captions, the column, the opening and the closing come from the site's shared overlay system (the one the pharma line uses); a film never animates its own.

## One quiet ring

The one value the words name gets a thin ring in brand blue (`#17356E`, 2 px on a 1 px white casing). It comes and goes with the words and follows the value while the app moves. Never words, chips or arrows on the app.

Keep a training score and its comparison target clearly labelled so the ring highlights the intended figure.

## Opening and closing cards

In the homepage hero's style: light, a big heading, one line. They replace the app; they never sit over it. The closing card carries the result large with a small real frame, and leads to the next step.

## Evidence large beside the app

When the ring marks a defect or a prediction, the real camera frame (the dataset image, never a crop of the interface) shows large under or beside the app, with its box drawn as the app draws it. A small detail inside the app is reached with the app's own zoom control, which is the app working, not a camera crop.

## Real material, no customer

- Every image is a real camera frame from a demo-site dataset, from the case studies already published (the blog's weld seams, amber pharma bottles, metal pails, cables, bread, meat). Never a render, a packshot, a stock photo or a generated picture.
- Full resolution from the dataset, checked at 100 %.
- No customer anywhere: no brand on a product, no customer name in a dataset, file, tag, flow or line. Rename to a neutral name; leave out a frame that shows a brand.
- The figures come from that dataset's real records. A run made for the film is named as website-film material on the demo, never presented as a customer's result.
- Copy frames into the preview fixtures locally (listed in `.git/info/exclude`), never into the app's repository.
- Show only healthy, real states: no offline controllers, unconfigured panels or empty Monitors.

## Length and figures

- **Under 85 s.** One short sentence a beat: holds follow reading time, so shorter sentences are the only way to a shorter film.
- **Real data reads modest.** Use the score measured on the selected dataset. One honest figure per model (three identical figures look invented, so show precision only). Of several real examples, show the one a viewer can see.

## Review

1. Contact sheets: every shot at its start and middle, a strip across every cut (−0.2 s to +0.2 s), and every beat at 390 × 844.
2. For each beat, one sentence describing the frame as a stranger would. An object that needs explaining is a blocker.
3. Notes ranked P0 (breaks the read), P1 (weakens it), P2 (polish), written as `t=4.2 s, where, problem → exact change, what stays`. Never a score out of 10.
4. A fresh reviewer gets only the storyboard, the sheets and this page, and returns P0 and P1 lines.
5. The reader test (see [story](story.md)).
6. Side by side with the pharma line at matching beats: opening, first action, result, closing.

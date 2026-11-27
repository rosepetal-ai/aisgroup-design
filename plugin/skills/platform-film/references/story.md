# Story: the sentence, the beats, the captions

## The sentence first

Before recording anything, write the one sentence a stranger can repeat after one watch. Every beat serves it; a beat that doesn't is cut.

- A platform step: «A trained model goes from the cloud to the line in one click, and keeps inspecting even when the internet drops» (Deploy).
- The whole suite for a customer: «Your team labels a few images, the model learns your defects, a new format is set up at the machine, and every bad bottle is rejected with its photo» (illustrative story).

## The beats

A story, not a tour: the starting point or the result, the one or two actions that matter, the payoff held long enough to land, then where it leads.

**The whole suite (customer film), in this order:**

Show setup before production so the viewer sees how the inspection became possible. The film may reorder the app's own steps where that reads better for a client, but production never comes before the setup it needs.

1. **The line**: a wide of the line running, every product checked; the camera pushes into the Panel PC.
2. **Label**: images arrive from the machine; one Smart Labeling click boxes a defect; Auto Labeling with the generic model (SAM3) runs the dataset's saved prompts plus one added on camera («Find the barcode»), and one run boxes every element; Auto on labels the rest of the upload.
3. **Train**: production training, then the model card with its real figures.
4. **Configure in Profiler**: create the format and the product type; each «Pass the product through» cuts to the machine doing that pass (photocell, then cameras); the unwrapped view; «Select models» picks the model just trained, by name; confirmed elements become rules; one tolerance tightened; save.
   Say what the passes are for: they give the unwrapped product that the rules are set on («Déroulée à plat, la bouteille reçoit vos règles.»).
   Explain the rules the Profiler creates by itself, one caption a type with its real count: presence of each confirmed element, quantity limits, sizes with their tolerance, disallowed classes. Count only what the recording shows, and say which change was made on camera (a tightened tolerance). Then one caption says the rules stay the customer's to adjust, format by format, over the change made on camera («Chaque règle s’ajuste par format.»). Never cut that beat for pace.

   The structure fits every machine: the line, the machine as hero, the set-up (images, training, the format and its rules), the operator, the rejects, the close. The passes and the unwrapped view belong to label machines (the REV 360 family); a machine without them skips those beats rather than inventing them. The reject shows what the machine really does to a bad product (an ejector, a stop, an alarm); never draw an ejector the machine doesn't have.
5. **Produce**: the operator selects the format on the Monitor and starts the batch; the camera pulls out to the line.
6. **The rejects**, each pushed off the line and then shown with its cause on the Monitor (a straight cut, no second push-in), then the line running and the closing caption.

A website film keeps the same shape at a smaller scale: starting point, the action, the payoff, the next step. The Platform films are one series, rebuilt from the original films ([site film](site-film.md)).

## Honest figures

- Every figure on screen is a real record (a model card, a dataset count, a batch total), never an illustration. Real data reads more modest than an illustrated original; never inflate it.
- One figure a model: three identical-looking figures read as invented. Precision alone is enough.
- Of several real examples, show the one a viewer can see (the most visible miss, the clearest defect).
- Never put a measure beside a figure it can be confused with.

## Captions

- **What the customer gains, never what to click**: «Un clic suffit pour annoter un défaut.», not «Cliquez sur Smart Labeling.» The click is visible; the caption says what it buys.
- **In the customer's language**, written natively, with «» for quotes and UI names, no «·» separators, no English contractions. Have a native reader check the final list.
- **Every claim is backed by the material on screen or a source the requester gave**: a line rate from the machine's datasheet, a model figure from its real card («trouve tous les défauts du jeu de validation» needs a recall of 100 % on that card). No setup times, false-reject rates or savings without real data.
- **One caption a beat**, one short line where it can be (about 40 characters), two at most, broken at natural phrases. Use a single short line when the picture carries the rest.
- **Hold** = characters ÷ 15 s + 1 s, plus 1 s when the viewer also has to read a picture. More than 3 s with nothing changing and nothing to read is dead time: shorten it.
- The caption style is the brand's (see `../live-animation/references/rules.md`, Brand, Captions): Inter Medium on the ink plate, centred in the caption band below the picture. Captions change with the shot they describe and never run over a cut to a new subject.

## The reader test

Three fresh readers watch the film without notes and each writes its message in one sentence. All three must match the written sentence, with no P0 or P1 notes left. When an earlier version exists, they also say which is clearer; «preferred the earlier one» is reported, and blocks only if the earlier one used real data too.

## The beat sheet

A table per beat: what is seen (3D, app recording or Monitor), the caption, the hold, and where its material comes from. It is the checklist for every later step and the first thing the requester and the fresh reviewer see, with one key still per beat.

# Recording the app

The film shows the software as customers use it: the real app, its real shell and routes, the customer's real images. Never a drawn screen, a mock-up or a crop.

## Recording access and setup

Ask only for what the brief leaves open. For example: «Which demo URL and workspace should I use, which flow or feature should I show, and which sample data and actions are approved for recording?» Ask for the account role if it affects the controls or labels on screen. Obtain an ordinary URL without credentials or access tokens in the address. Ask whether changes are permitted only for the actions the shot needs. When the task includes saving, training or deploying, use a designated writable test workspace with approved data. A read-only session can show a pre-existing result.

When login is required, offer interactive sign-in first. The user can complete SSO or MFA inside the browser. If the host provides a secure credential prompt, use that channel for a dedicated demo credential. Keep passwords, MFA codes, access tokens and cookies out of chat, take specifications, command-line arguments, logs and frames. In the tutorial recorder, use `--sign-in` and a `ready` selector unique to the authenticated starting screen. Let the user confirm readiness in the terminal after sign-in. Capture begins after that confirmation. An approved recording supplied by the user also works for editing when the app is unavailable.

## One frame, one shell, one timeline

- **Every recording at 1440 × 900 CSS pixels, device scale 2** (2880 × 1800 frames), the labelling editor included. One 16:10 frame lets every segment sit 1:1 on the Panel PC's screen plate (see [machine](machine.md)). A website film records at the viewport that shows the app's text at 15 to 17 px at the page's width ([site film](site-film.md)).
- **The same shell in every segment**: top bar, avatar, side menu, theme. A measured copy is matched to the real recordings, not the other way round. Compare the bars side by side at 100 % before recording.
- **The clock runs forward**: labelling saved, then the model trained, then the format saved, then production. Dates and times on screen agree across segments, and the Monitor's counters agree with its clock at the line rate.
- **The same names everywhere**: dataset, model, format, product type and batch. The model trained on screen is the one picked by name in Profiler's «Select models»; the format saved in Profiler is the one the operator picks on the Monitor.

## The three rigs

Each runs locally, never against a live controller or a customer deployment. A live deployment may be looked at read-only for reference (navigate, open, screenshot, cancel every dialog); nothing is saved, started or triggered there.

| Segment | Recording environment |
| --- | --- |
| Dataset upload, annotation, training and model card | A local Rosepetal application with preview services and a fixture for this film. |
| Profiler, product passes, rule editing and format save | The Profiler in the application shell on a local controller simulator. |
| Monitor, batch, reject cause and totals | The actual Monitor in an approved test setup, or a measured replay driven by recorded outcomes. Identify any replay in the handover. |

Prepare one local fixture for each film using the supplied images and approved records. Configure the same format, article IDs, run clock and reject sequence in all three environments.

**Recording:**
- The Rosepetal app and the Monitor record with Playwright at device scale 2.
- Profiler records in a visible Chromium on a virtual 2880 × 1800 display (`xvfb-run`), because a headless screencast gives CSS pixels. Keep the pointer off links there: the browser shows the address bubble.

**Settings to restore afterwards:** the playground's `userdir/recipes.json`, and any generated preview folder you edited.

When multiple local rigs use the same port, stop the first after recording its take before launching the second.

## Recording the demo platform

Website films show the real platform on the approved shared demonstration deployment.

- **Use an authorized demo account**. Reuse the approved session when available. If sign-in is needed, use the host’s secure login or secret prompt. Prefer a read-only demo account. Never put a username or password in a chat, a prompt, a script, a log, a commit or this plugin.
- **Log in before recording starts.** Start the capture after sign-in so the login screen stays out of the take.
- **Read-only.** Look, navigate, open and record. Never save, create, edit, delete, start a training or a batch, deploy, or trigger a camera or device. If a dialog would change something, cancel it. If something is already running that the film didn't start, leave it alone and tell the requester.
- **No customer on screen.** Choose datasets, flows and sessions without customer names, users or e-mails, or leave the frame out ([site film](site-film.md), «Real material, no customer»).
- **Afterwards:** close the recording session, remove any temporary credential file and keep the approved recorded frames.

## Real material

- **A website film uses the demo site's datasets**, never a customer's: real frames from the published case studies, one product through the series, figures from that dataset's records ([site film](site-film.md)). A customer film uses the customer's captures, as below.
- **The customer's captures, all of them.** Use every real capture they gave before reusing one: identical thumbnails read fake. The same product on another pass is not another product (cap foil folds, label creases and dirt give it away).
- **Read each reused image at 100 %**: vintage, lot or variant must match what the screen claims (a production batch shows only that batch). Customer datasets mix vintages.
- **Anything shown as good passes the film's own rules.** Check every «good» unwrap at its stitching seams: a label or code doubled there fails a count rule, so that image can't stand for a good bottle.
- **Defects made on a real capture**: edit only where the geometry holds, check at 100 % against the original, and show the view where the defect exists. A second label on curved glass doesn't hold in the camera views; it stays on the flat unwrap, and the Monitor shows the unwrap for that reject.
- **Register customer captures** in the asset library as customer material for that private proposal only (`asset-library`), never on the public site.
- **Never a generated stand-in** for a real capture (a generated unwrap, an uncropped camera view made from the cropped one).

## Stand-ins, disclosed

Local rigs can't run the real models. What stands in must be real data or approved values, and is named in the report:

- **Tool proposals**: the preview replays each image's real annotation coordinates as what Smart Labeling, Auto Labeling or the model proposes. Leave out whole-object classes (the bottle) that flood the image with one colour.
- **Auto Labeling labels every element**: the generic model (SAM3) answers one prompt per tag, so seed the dataset's saved prompts for every element (cap, labels, codes) and add only the beat's own prompt on camera. The preview matches each prompt's text to tag names, so each text names its tag («Find the front label»).
- **Confidence badges**: no real output exists, so omit the badges unless the requester explicitly chooses a labelled illustrative replay. A real confidence score must come from the model output for that image.
- **Values only the machine measures** (width, trigger delay): the requester approves illustrative values, shown through the real UI. A stage that would need an image or value you don't have (the uncropped camera view) is skipped.
- **Model cards** show their real figures and dates. A training run on camera ends on the real card: the Models list card when the model page would show panels you have no real data for (an empty evaluation grid, a flat training chart). Its architecture, image count, split and training time match the real card, and the training dialog opens on that architecture.

## Driving the app

- **Stop where the story stops.** Auto with an earlier model walks on through every pending image; stop it on the last uploaded one, because the labelled library beyond floods the frame.
- **The subject of each beat is visible**: the box being drawn is never under a panel, and the label being read is never behind the cursor.
- **Only healthy, real states**: no offline controllers, unconfigured panels or empty Monitors waiting for images, no empty results grids or charts. Cut past warnings that aren't the story (a «Validate before training» prompt).
- **Restart the preview's dev server after editing its services.** Hot reload leaves the page talking to a stale copy, and the next take fails in odd places.

## The cursor and time

- The system arrow at its real size (website and customer films). A tutorial draws its pointer instead, with a ripple on each press, as the guide's tutorial rules set out. It moves in a gentle eased arc, 0.4 to 0.8 s by distance, then rests while the viewer reads. No click rings, halos or trails: the control's own states are the feedback.
- Typing fills fields at a person's pace.
- The app's own transitions play at real speed. A long process (training, a batch) is shortened by a cut, with the app's own progress visible on both sides, never by fast-forwarding the screen.
- An image changes only by the app's action, and each holds at least 1.5 s.

## Recording a video take

- Log beats as times; never take screenshots of the headed window during a video take. Each screenshot dropped the window to 1× for up to 1 s. Scan the take before cutting: a frame whose lower-right quarter has no bright pixel is broken.
- Anything that waited on the screenshot's time now needs its own wait for the state it expects (a saved record, a list row).

## Before recording the whole take

Look at one full-screen still of every beat at 100 %, and fix what reads wrong there. Recording minutes of a take to discover a covered box or a demo name wastes a heavy job.

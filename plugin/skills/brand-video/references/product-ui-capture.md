# Product UI capture

How to film the Rosepetal app for a product film. The film shows the product as customers use it, so fidelity to the real app comes before any editorial idea.

## Source

1. Pick one product revision, the one that matches the UI being presented, and record its identity (branch and commit, or file hashes). Never mix files from two snapshots or call an old build the latest UI.
2. Run the real app: its own shell, top bar, routes and page views. A route the app shows full screen (the labelling editor, for example) stays full screen in the film.
3. Use read-only access to a real deployment, or a local app with explicit local service and data adapters. Keep external writes and production commands off. Sample data is fine; generic success stubs are not evidence that a workflow works. A service, canvas or training step that can't run stays an open capture item, never a staged button.

## Capture

1. Look at full-screen stills and one interaction before encoding anything. Source and component tests are engineering checks, not a design review.
2. Record with Playwright at DPR 3 so zooms stay sharp. Pointer positions come from the real elements; the camera move is one uniform transform per shot.
3. Follow one meaningful task through the real pages: from the dataset and image views into the editor, annotation where supported, then the model configuration and results views. Cursor movement and zoom direct attention inside those screens.
4. Note for each take whether it records consecutive frames or holds real browser states for reading.

## Composition and review

1. Titles, captions and transitions frame the recording; they never replace a screen.
2. Close on the white card with the supplied SVG logo.
3. Review the final MP4 at normal speed, at native and at feed size, after composition, not only a layout PNG.

## Resources

A full-app capture is a heavy job: one at a time under the shared render lock (see the shared workflow), with a memory budget measured for that capture. A guard stop is not completion and not a reason to retry automatically. Avoid a full rebuild when a verified build of the same revision exists.

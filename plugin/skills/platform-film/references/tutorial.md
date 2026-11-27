# Tutorials

One task in the real application, its steps written on screen, no voice. The rules (structure, rhythm, step texts, pointer, sound) are the guide's Video page, «Tutorials and step-by-step guides» ([video](../../brand-video/references/video.md)); where they differ from the general video rules, they win. The full studio installation contains `engine/tools/record-tutorial.mjs` and `templates/video-tutorial.json`. Run these commands from its plugin directory. Use a local application or test controller with permission to perform the recorded actions. In an edition with only the hosted design server, use the full studio for recording and final assembly.

## Record the take

Record inside the platform: Node-RED in its «Flows» section, on a controller with the Rosepetal nodes. Never a standalone Node-RED, a live line or a customer's deployment.

1. **Choose a task worth teaching**, one a customer really does, that ends on a visible result (a deployed flow running, a trained model's card). Every step moves the task forward; no filler actions.
2. **Write the take as JSON**: the `url`, a `ready` selector (record only once the page has finished loading, never a loading screen), and per step its `text` and one action, `click` (a selector) or `type` (a selector and the text). A few words per step, labels in «»: `Click «Create»`.
3. **Record**: `python3 skills/_shared/scripts/safe_render.py -- node engine/tools/record-tutorial.mjs take.json work/<slug>/take` records at 1920 × 1080 and writes `recording.mp4`, `pointer.json` and `steps.json`.
   - It computes the rhythm: each action starts 1 s after its text appears.
   - The real mouse glides on an ease-in-out curve (2.2 ms per pixel of a 1280 px wide frame, 0.65 to 1.8 s) and presses.
   - Each text holds as long as it takes to read, and until its action is done.
   - No cursor is recorded; the render draws one from the log.

For a demo behind SSO or MFA, use the [recording access checklist](recording.md#recording-access-and-setup). Supply the demo URL and a post-login `ready` selector in the take, then run `node engine/tools/record-tutorial.mjs take.json work/<slug>/take --sign-in` from the plugin directory. Sign in in the opened browser, navigate to the intended starting screen and confirm in the terminal. Keep the take’s typed steps for visible, non-secret demonstration data.

## Render

The template places:
1. the published brand intro, unchanged (`{ "type": "intro" }`);
2. the title card: flat brand blue, the title alone in white at the left margin, held 2 s, with no overline, pattern or other label;
3. the recording with its step texts, the drawn pointer and the press ripples;
4. the published end card (`{ "type": "end", "published": true }`, ES or EN by `lang`; Catalan has no end card yet);
5. the Rosepetal soundtrack, levelled to −14 LUFS and fading out over the end card.

`node engine/check.mjs` fails a step over two lines of 42 characters, a hold outside 1.8 to 7 s at 18 characters a second, and an action that doesn't start while its text is on screen. Render under the shared lock, then look at the frames at 100 % and listen to the whole film before handing it over.

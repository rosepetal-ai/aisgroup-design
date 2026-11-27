# The RSM reference

The Rotary Sandwich Machine explainer opens on three lines, follows one cookie on one line, then returns to the installation. The camera shows what happens to the rejected cookie and what happens to the cookies beside it. Its chapter starts are useful examples of how long this particular process takes to explain.

| Start | Chapter | What the viewer can inspect |
| --- | --- | --- |
| 0 s | Three lines | Three systems in context and their positions after the RSMs |
| 6 s | One line | Eight lanes on one belt and the featured product |
| 12 s | Belt and encoder | The drive shaft carrying the encoder |
| 18 s | Profilometers | The sensors and the span of their overlapping inspection fields |
| 26 s | Rejection | One segment retracts, the NOK cookie drops, its neighbours continue |
| 40 s | Reject bin | The destination, its window and full-level sensor |
| 45 s | Receiving belt | The good cookies cross a flush transfer |
| 50 s | Cabinet and HMI | The cabinet and operator-facing evidence |
| 56 s | Results | A wide shot and the supported totals for this installation |

The reference runs for 60 seconds. Its optional ejector view slows the sequence down into «Flagged», «Gap opens», «Cookie falls», «Gap closes» and «Next cookie». The same player navigates those steps and returns to the film. The source copy is in the RSM project's `src/data/copy.ts`, the time and camera in `src/logic/cameraKeys.ts`, and the player action in `src/explainer/Bar.vue`. These names and times describe that film. Set new chapter boundaries from the incoming brief.

On desktop an evidence plate can appear at the title-safe right edge for a featured item. At phone size the most recent plate goes below the logo while the subject stays visible. In overview and closing shots the headline has room beside the installation. A process with a handoff can use the same composition with the worker, both hands and both supports in the action shot. Keep the source's status text or control readout available independently of the optional narration captions.

## A worked brief from zero

**Illustrative practice brief.** «Show the reader on our jar line. It reads the code and diverts an unreadable jar to the side. We need to see that the next good jar keeps moving.» The supplied photos show the reader bracket, side guide opening, pusher and receiving tray. There is no supplied HMI screen, operating rate or measured performance figure.

| Chapter | Camera and visible action | Optional caption |
| --- | --- | --- |
| Jar inspection | Wide three-quarter view shows the incoming belt, reader, side tray and downstream path together. Hold long enough to follow the jars’ direction. | «Each jar passes the code reader.» |
| Code read | Hold the code face and reader aperture in the same frame. The verdict appears after this jar reaches the read position. | «This code cannot be read.» |
| Diversion | From across the belt, show the pad approach, touch the jar, push it through the guide opening and return. Allow time to see the jar supported by the tray. | «The pusher diverts this jar to the side tray.» |
| Next jar | Hold the same reference surface as the next good jar passes with the pusher retracted. Widen to show both destinations. | «The next jar continues along the belt.» |

Author the mechanism and check identity at three seeks using the same item record. Before the read, the first jar is still on the belt and has no verdict. During diversion, its code and pad identify it. After the stroke, the tray supports that jar while the next jar continues on the belt. An optional mechanism detail is warranted only if the delivery camera cannot make the stroke intelligible. The final frame can show the two destinations without introducing a throughput claim. This brief does not call for a machine logo treatment, coloured equipment scope or a person.

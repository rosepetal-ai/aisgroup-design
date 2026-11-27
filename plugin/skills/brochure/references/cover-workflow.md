# Cover photo workflow

Read the dated [canonical cover photo rule](cover-photos.md).

When an accepted machine brochure is the visual reference, match the subject, viewpoint and framing of its cover. If the brief is about integration on a line, show the complete installation, including the conveyor and operator station where relevant. For an approved machine render composed on white, carry the white through to the page edges and preserve the full silhouette. Check the exported cover beside the reference. Use customer-specific imagery only within its approved audience.

## Bounded command

From the plugin folder, with the prepared OpenCV environment and EDSR x2 weights:

```sh
( ulimit -v 3000000; nice -n 15 taskset -c 0-3 ~/.cache/ais-upscale/bin/python print/upscale.py source.jpg source-edsr-x2.png ~/.cache/ais-upscale/models/EDSR_x2.pb )
```

The local helper also applies the memory, priority and CPU limits before importing the image libraries. It uses 160 px tiles with overlap. Do not invoke an image model outside these limits. About ten minutes for 1672 px is an observed reference, not a deadline. Compare the result at 100 % against the unchanged original; reject altered text, product geometry or invented detail. A video frame is not made suitable merely by adding pixels.


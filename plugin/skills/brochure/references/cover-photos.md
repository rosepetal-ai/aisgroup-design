# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-1c7925882050

<!-- AIS-1c7925882050 -->
Cover photos always fill the band edge to edge, never contained with margins. When the best real photograph prints under 240 ppi, faithfully upscale it with print/upscale.py (OpenCV EDSR x2 in tiles), compare at 100 % against the original and name it <source>-edsr-x2. Run with ulimit -v 3000000; nice -n 15 taskset -c 0-3, about 10 minutes for a 1672 px source. data-cover-ok is a last resort only when that fails. Never run an image model without these limits.

Source: brand decisions.

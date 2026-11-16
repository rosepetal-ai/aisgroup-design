# Retained source rules

Read only the IDs relevant to the current task. Source evidence and dated conflict resolutions are in evals/rules-ledger.json.

## AIS-904fc183cfbf

<!-- AIS-904fc183cfbf -->
const base = path.basename(decodeURIComponent(String(file)));

Source: plugin/print/image-rules.mjs:34.

## AIS-216ee9d6c3e5

<!-- AIS-216ee9d6c3e5 -->
if (/(^|[-_])(frame|fotograma|video)([-_.]|$)/i.test(base)) return true;

Source: plugin/print/image-rules.mjs:35.

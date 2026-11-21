# Theme diff

Canonical source: packages/design/styles.css. Run scripts/ui-contract.mjs diff candidate.css; the script resolves aliases in :root, html and .dark and compares both modes. It is scoped to this package’s token layout, not a general CSS cascade parser. Unresolved aliases are errors. Run packages/vue-themes/generate.mjs --check to check adapter drift. Differences need a source-backed decision, never automatic palette changes.

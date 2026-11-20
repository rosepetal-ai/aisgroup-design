# PrimeVue + Tailwind

The preset is a bridge: it colours PrimeVue screens with our tokens while the app moves onto our components ([redesign](../../ui-unify/references/redesign.md)), and it goes with PrimeVue at the end. It is not the redesign and does not make a screen compliant.

Install `primevue@^4` and `@primeuix/themes@^2`, both MIT. PrimeVue 5 and `@primeuix/themes` 3 are under PrimeUI's commercial licence.

The files come from design_code kind=primevue: `name=preset` (primevue.mjs), `base` (base.css), `readme` (setup and the component mapping), `tokens`. Configure PrimeVue with the preset, `darkModeSelector` set to the app's dark class (`.dark`) and the Tailwind layer order theme, base, primevue, utilities. `base.css` sets `color-scheme: dark` on `.dark`; an app with another dark class sets it on that class, or primary buttons keep their light colour in dark mode. Read product-ui/references/using-components.md for interaction and target rules.

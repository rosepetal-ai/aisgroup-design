# Vuetify

The themes are a bridge: they colour Vuetify screens with our tokens while the app moves onto our components ([redesign](../../ui-unify/references/redesign.md)), and they go with Vuetify at the end. They are not the redesign and do not make a screen compliant.

The files come from design_code kind=vuetify: `name=preset` (vuetify.mjs), `base` (base.css), `readme` (setup and the component mapping), `tokens`. Configure createVuetify with the exported theme options and switch between aisLight and aisDark. Read product-ui/references/using-components.md for behaviour. Colours are adapted; geometry, density, typography and icons still need an app adapter and actual visual checks.

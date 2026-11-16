import { createApp } from 'vue'
import App from './App.vue'
import { startPreset } from './composables/usePreset'
// Light / dark from the start (data-theme, the OS): pages that never import useTheme follow it too
import './composables/useTheme'
import { i18n } from './i18n'

import '@fontsource-variable/inter'
import '@fontsource-variable/inter/wght-italic.css'
import 'vue-sonner/style.css'
import './assets/index.css'

// The edited preset (Preset page) on top of index.css, in this frame too
startPreset()
createApp(App).use(i18n).mount('#app')

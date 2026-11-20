import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { generate } from './generate.mjs';

generate({ check: true });
const here = path.dirname(fileURLToPath(import.meta.url));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-vue-themes-'));
const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: dir, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stdout + result.stderr);
  return result.stdout;
};
try {
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  run('npm', ['install', '--no-audit', '--no-fund', 'vue@3.5.45', 'primevue@4.5.5', '@primeuix/themes@2.0.3', 'vuetify@4.3.3', 'vite@8.3.8', '@vitejs/plugin-vue@6.0.11', 'tailwindcss@4.3.5', '@tailwindcss/vite@4.3.5']);
  for (const name of ['primevue.mjs', 'vuetify.mjs', 'base.css']) fs.copyFileSync(path.join(here, name), path.join(dir, name));
  const { default: preset } = await import(pathToFileURL(path.join(dir, 'primevue.mjs')));
  const { themes, default: vuetifyTheme } = await import('./vuetify.mjs');
  const { createVuetify } = await import(pathToFileURL(path.join(dir, 'node_modules/vuetify/lib/framework.js')));
  const vuetify = createVuetify({ theme: vuetifyTheme });
  const { Theme } = await import(pathToFileURL(path.join(dir, 'node_modules/@primeuix/styled/dist/index.mjs')));
  Theme.setTheme({ preset, options: { darkModeSelector: '.dark' } });
  const tokens = JSON.parse(fs.readFileSync(path.join(here, 'tokens.json')));
  for (const mode of ['light', 'dark']) {
    assert.equal(preset.semantic.colorScheme[mode].primary.color, tokens[mode].primary);
    assert.equal(preset.semantic.colorScheme[mode].content.background, tokens[mode].card);
    assert.equal(themes[mode === 'light' ? 'aisLight' : 'aisDark'].colors['on-primary'], tokens[mode]['primary-foreground']);
  }
  assert.equal(vuetify.theme.themes.value.aisLight.colors.primary, tokens.light.primary);
  assert.equal(vuetify.theme.themes.value.aisDark.colors.primary, tokens.dark.primary);
  assert.equal(Theme.getTokenValue('primary.500'), tokens.light['blue-500']);
  // @primeuix/themes 2 (MIT) keeps a value per scheme, switched by the dark selector; 3 (commercial) wrote light-dark().
  const primary = Theme.getTokenValue('primary.color');
  assert.deepEqual([primary.light.value, primary.dark.value], [tokens.light.primary, tokens.dark.primary]);
  const surface = Theme.getTokenValue('surface.950');
  assert.deepEqual([surface.light.value, surface.dark.value], [tokens.dark.background, tokens.dark.background]);
  fs.writeFileSync(path.join(dir, 'vite.config.mjs'), "import { defineConfig } from 'vite'; import vue from '@vitejs/plugin-vue'; import tailwind from '@tailwindcss/vite'; export default defineConfig({plugins:[vue(),tailwind()]});");
  fs.writeFileSync(path.join(dir, 'index.html'), '<html><body><div id="app"></div><script type="module" src="/main.mjs"></script></body></html>');
  fs.writeFileSync(path.join(dir, 'app.css'), '@import "tailwindcss"; @import "./base.css";');
  fs.writeFileSync(path.join(dir, 'App.vue'), '<script setup>import Button from "primevue/button"; import InputText from "primevue/inputtext"; import { VApp, VBtn, VTextField } from "vuetify/components";</script><template><VApp><main class="grid gap-4"><Button label="Save"/><InputText aria-label="Name"/><VBtn>Save</VBtn><VTextField label="Name"/></main></VApp></template>');
  fs.writeFileSync(path.join(dir, 'main.mjs'), "import {createApp} from 'vue'; import PrimeVue from 'primevue/config'; import {createVuetify} from 'vuetify'; import 'vuetify/styles'; import './app.css'; import preset from './primevue.mjs'; import theme from './vuetify.mjs'; import App from './App.vue'; createApp(App).use(PrimeVue,{theme:{preset,options:{darkModeSelector:'.dark'}}}).use(createVuetify({theme})).mount('#app');");
  run('npm', ['exec', '--', 'vite', 'build']);
  assert(fs.existsSync(path.join(dir, 'dist/index.html')));
  console.log('PASS: real Vue + PrimeVue + Vuetify + Tailwind production build; 11 real-library light/dark token assertions.');
} finally { fs.rmSync(dir, { recursive: true, force: true }); }

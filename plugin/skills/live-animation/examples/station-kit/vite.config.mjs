import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwind from '@tailwindcss/vite';
import {fileURLToPath} from 'node:url';
export default defineConfig({root:fileURLToPath(new URL('.',import.meta.url)),base:'./',
  plugins:[vue(),tailwind()],resolve:{dedupe:['three','vue','reka-ui','@vueuse/core','@lucide/vue','clsx','class-variance-authority','tailwind-merge']},
  build:{target:'esnext'}});

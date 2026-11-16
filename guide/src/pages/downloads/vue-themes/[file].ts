import type { APIRoute } from 'astro';
import primevue from '../../../../../packages/vue-themes/primevue.mjs?raw';
import vuetify from '../../../../../packages/vue-themes/vuetify.mjs?raw';
import tokens from '../../../../../packages/vue-themes/tokens.json?raw';
import base from '../../../../../packages/vue-themes/base.css?raw';
import readme from '../../../../../packages/vue-themes/README.md?raw';

const files: Record<string, string> = { 'primevue.mjs': primevue, 'vuetify.mjs': vuetify, 'tokens.json': tokens, 'base.css': base, 'README.md': readme };

export function getStaticPaths() {
  return ['primevue.mjs', 'vuetify.mjs', 'tokens.json', 'base.css', 'README.md'].map(file => ({ params: { file } }));
}
export const GET: APIRoute = ({ params }) => new Response(files[params.file!], { headers: { 'Content-Type': params.file?.endsWith('.json') ? 'application/json' : params.file?.endsWith('.mjs') ? 'text/javascript' : 'text/plain; charset=utf-8' } });

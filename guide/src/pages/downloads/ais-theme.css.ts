// /downloads/ais-theme.css: the Tailwind v4 theme of every AIS site and product. It is @aisgroup/design's styles.css
// (packages/design, through the workspace), less its two @source lines, which point at the package's own folders.
import type { APIRoute } from 'astro';
import { styles } from '../../design/package';

export const GET: APIRoute = () => new Response(styles.replace(/^@source .*\n/gm, ''), { headers: { 'Content-Type': 'text/css; charset=utf-8' } });

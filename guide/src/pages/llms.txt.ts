import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = site ? site.href.replace(/\/$/, '') : '';
  const body = [
    '# AIS Group brand design', '',
    '> Brand rules for AIS Group, AIS Vision Systems, AIS Vision Automation, AIS Scanology and Rosepetal. Read the brand.md for the language you are writing in and follow it exactly.', '',
    '## Brand rules', '',
    `- [English](${base}/en/brand.md)`, `- [Español](${base}/es/brand.md)`, `- [Català](${base}/ca/brand.md)`, '',
    '## Components', '',
    `- [Component index](${base}/components.md): every component and block of @rosepetal/design, Node-RED widget and Profiler part, with its page and source file`, '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

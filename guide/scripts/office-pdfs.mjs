import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export default function officePdfs() {
 return { name: 'office-pdfs', hooks: {
  'astro:build:start': () => execFileSync('python3', [fileURLToPath(new URL('./office-pdfs.py', import.meta.url))], { stdio: 'inherit' }),
 } };
}

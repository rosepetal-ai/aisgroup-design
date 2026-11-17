#!/usr/bin/env node
// Runs before every deploy of the guide and the hosted MCP: what goes live must be exactly origin/main.
// Fails (exit 1) when the checkout is on another branch, has uncommitted changes, or differs from origin/main.
import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
git('fetch', '--quiet', 'origin', 'main');
const problems = [
  git('rev-parse', '--abbrev-ref', 'HEAD') !== 'main' && 'the checkout is not on main (git switch main)',
  git('status', '--porcelain', '--untracked-files=no') && 'there are uncommitted changes',
  git('rev-parse', 'HEAD') !== git('rev-parse', 'origin/main') && 'main is not the same as origin/main (git pull, or push your commits through a PR)',
].filter(Boolean);
if (problems.length) {
  console.error(`Deploy refused: ${problems.join('; ')}.`);
  process.exit(1);
}
console.log(`Deploying main at ${git('rev-parse', '--short', 'HEAD')}.`);

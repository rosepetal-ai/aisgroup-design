/// <reference types="vite/client" />

// Minimal typing for the claude.ai Artifact runtime (only what the playground calls).
interface DbDocSnapshot { exists: boolean, data: () => Record<string, unknown> | undefined }
interface DbDocRef {
  set: (data: Record<string, unknown>) => Promise<void>
  onSnapshot: (next: (s: DbDocSnapshot) => void, error?: (e: { code: string, message: string }) => void) => () => void
}
interface ClaudeDb { doc: (path: string) => DbDocRef }
interface Window {
  claude?: { use: (name: 'db') => Promise<ClaudeDb | null> }
}

// The Icons section's data (vite.config.ts iconUsagePlugin).
declare module 'virtual:icon-usage' {
  const data: { library: string, pkg: string, version: string, usage: Record<string, string[]> }
  export default data
}

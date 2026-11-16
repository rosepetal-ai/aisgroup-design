import { ref } from 'vue'

// Saving to the repo: the dev server (vite.config.ts repoSync) writes this repo's files, so what is
// changed in the Preset and Assets pages is kept in git. Only where that server runs (npm run dev);
// in the published artifact there are no files to write and the buttons don't show.

const available = ref(false)
let checked = false

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok)
    throw new Error(data.error ?? `HTTP ${res.status}`)
  return data as T
}

export function useRepo() {
  if (!checked) {
    checked = true
    fetch('/__repo').then(r => (r.ok ? r.json() : null)).then(d => (available.value = !!d?.ok)).catch(() => (available.value = false))
  }
  return {
    available,
    /** Writes packages/design/styles.css. */
    saveCss: (css: string) => post<{ ok: true }>('/__repo/index-css', { css }),
    /** Moves / deletes files of rp-assets/ (paths as `rp-assets/<folder>/<file>`). */
    saveAssets: (body: { moves: { from: string, to: string }[], deletes: string[] }) =>
      post<{ moved: { from: string, to: string }[], removed: string[], references: string[] }>('/__repo/assets', body),
  }
}

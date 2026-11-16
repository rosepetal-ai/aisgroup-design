import { computed, ref } from 'vue'

// How the user has organised rosepetal-ui's assets INSIDE THE PLAYGROUND: custom folders, which
// folder each asset sits in, and which ones are deleted. rosepetal-ui itself is never modified; with
// the dev server, Save to repo applies it to this repo's rp-assets/ (useRepo) and clears it here.
//
// In the published Artifact this lives in the `db` capability (one document, shared by every
// browser and readable by Claude to apply it to the playground's files). Anywhere else (vite dev,
// a local file) it falls back to localStorage.

export interface CustomFolder { id: string, name: string }
interface State {
  folders: CustomFolder[]
  /** asset path → folder key ("rp:<original folder>" or "c:<custom id>"); absent = original folder */
  placement: Record<string, string>
  deleted: string[]
}

const DOC = 'playground/assets'
const LOCAL_KEY = 'playground-asset-store'
const empty = (): State => ({ folders: [], placement: {}, deleted: [] })

const state = ref<State>(empty())
const mode = ref<'loading' | 'db' | 'local'>('loading')
const error = ref<string | null>(null)
let docRef: DbDocRef | null = null
let writing: Promise<void> = Promise.resolve()

function readLocal(): State {
  try {
    return { ...empty(), ...JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '{}') }
  }
  catch {
    return empty()
  }
}

function normalise(raw: Record<string, unknown> | undefined): State {
  const s = raw ?? {}
  return {
    folders: Array.isArray(s.folders) ? (s.folders as CustomFolder[]) : [],
    placement: s.placement && typeof s.placement === 'object' ? (s.placement as Record<string, string>) : {},
    deleted: Array.isArray(s.deleted) ? (s.deleted as string[]) : [],
  }
}

let started = false
function start() {
  if (started)
    return
  started = true
  state.value = readLocal()
  const use = window.claude?.use
  if (!use) {
    mode.value = 'local'
    return
  }
  use('db').then((db) => {
    if (!db) {
      mode.value = 'local'
      return
    }
    docRef = db.doc(DOC)
    mode.value = 'db'
    docRef.onSnapshot(
      snap => (state.value = snap.exists ? normalise(snap.data()) : empty()),
      (e) => {
        error.value = e.code
        mode.value = 'local'
        docRef = null
      },
    )
  }).catch(() => (mode.value = 'local'))
}

// One write at a time, only after a user action.
function persist() {
  const body = JSON.parse(JSON.stringify(state.value)) as State
  if (mode.value !== 'db' || !docRef) {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(body))
    }
    catch {}
    return
  }
  const ref = docRef
  writing = writing.then(() => ref.set({ ...body, updatedAt: new Date().toISOString() })).catch((e: { code?: string }) => {
    error.value = e?.code ?? 'unavailable'
  })
}

function mutate(fn: (s: State) => void) {
  const next = JSON.parse(JSON.stringify(state.value)) as State
  fn(next)
  state.value = next
  persist()
}

export function useAssetStore() {
  start()
  const deleted = computed(() => new Set(state.value.deleted))

  return {
    state,
    mode,
    error,
    deleted,
    createFolder(name: string): string {
      const id = Math.random().toString(36).slice(2, 10)
      mutate(s => s.folders.push({ id, name: name.trim() }))
      return `c:${id}`
    },
    renameFolder(id: string, name: string) {
      mutate((s) => {
        const f = s.folders.find(x => x.id === id)
        if (f)
          f.name = name.trim()
      })
    },
    /** Removes a custom folder; its assets go back to their original folder. */
    deleteFolder(id: string) {
      mutate((s) => {
        s.folders = s.folders.filter(f => f.id !== id)
        for (const [path, key] of Object.entries(s.placement)) {
          if (key === `c:${id}`)
            delete s.placement[path]
        }
      })
    },
    /** Move assets to a folder key; moving to the asset's own original folder clears the placement. */
    move(items: { path: string, original: string }[], key: string) {
      mutate((s) => {
        for (const { path, original } of items) {
          if (key === `rp:${original}`)
            delete s.placement[path]
          else
            s.placement[path] = key
        }
      })
    },
    remove(paths: string[]) {
      mutate(s => (s.deleted = [...new Set([...s.deleted, ...paths])]))
    },
    /** After the organisation was applied to the repo's files: folders, moves and deletions are
     *  real now (the manifest lists them), nothing left to keep here. */
    clearApplied() {
      mutate((s) => {
        s.folders = []
        s.placement = {}
        s.deleted = []
      })
    },
    restore(paths: string[]) {
      const set = new Set(paths)
      mutate(s => (s.deleted = s.deleted.filter(p => !set.has(p))))
    },
  }
}

import { computed, ref } from 'vue'
import css from '../../../packages/design/styles.css?raw'
import { invalidateTokens } from '@/lib/tokens'

// The live preset: every design token declared in packages/design/styles.css (:root = light, .dark = dark),
// read from the file itself (its comments name the groups and explain each token), plus the values
// the user changed in the Preset page. Changes are applied as CSS variables on top of styles.css, so
// the whole playground follows at once.
//
// Storage: the artifact's db (one shared document: the active preset and the saved ones) when
// published, localStorage elsewhere. The active overrides are also mirrored to localStorage, so the
// playground's own frames (device previews, the demo environment) pick them up through the `storage`
// event without asking the db themselves.

export type Mode = 'light' | 'dark'
export type TokenKind = 'color' | 'font' | 'radius' | 'alias' | 'other'
export interface Token { name: string, value: string, note: string, group: string, kind: TokenKind }
export interface Overrides { light: Record<string, string>, dark: Record<string, string> }
export interface SavedPreset { id: string, name: string, overrides: Overrides }

const DOC = 'playground/preset'
const ACTIVE_KEY = 'playground-preset-active'
const CURRENT_KEY = 'playground-preset-current'
/** Saved presets, kept in the browser only when there is no db (local runs). */
const SAVED_KEY = 'playground-preset-saved'
/** The base preset's own changes over styles.css (local runs; with the db they live in the document). */
const BASE_KEY = 'playground-preset-base'
const STYLE_ID = 'rp-preset-overrides'

// ─── Parsing styles.css ──────────────────────────────────────────────────────────────────────────

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|color-mix\()/i

function kindOf(name: string, value: string): TokenKind {
  if (/font/.test(name))
    return 'font'
  if (/radius/.test(name))
    return 'radius'
  if (COLOR.test(value) || /^(white|black|transparent)$/i.test(value))
    return 'color'
  if (/^var\(--/.test(value))
    return 'alias'
  return 'other'
}

/** Top-level blocks whose selector is exactly `sel` (several are merged, in order). */
function blocks(source: string, sel: string): string[] {
  const out: string[] = []
  const re = new RegExp(`(^|\\n)${sel.replace('.', '\\.')}\\s*\\{`, 'g')
  while (re.exec(source)) {
    let depth = 1
    let i = re.lastIndex
    const start = i
    while (i < source.length && depth) {
      if (source[i] === '{')
        depth++
      else if (source[i] === '}')
        depth--
      i++
    }
    out.push(source.slice(start, i - 1))
  }
  return out
}

function parse(sel: string): Token[] {
  const tokens: Token[] = []
  let group = 'General'
  for (const body of blocks(css, sel)) {
    for (const raw of body.split('\n')) {
      const line = raw.trim()
      const header = line.match(/^\/\*\s*(.+?)\s*\*\/$/)
      if (header) {
        group = header[1]!.split(/\s\(|:\s|\s[—–]\s/)[0]!.replace(/[:.]$/, '').trim()
        continue
      }
      const decl = line.match(/^(--[\w-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/)
      if (decl)
        tokens.push({ name: decl[1]!, value: decl[2]!.trim(), note: decl[3] ?? '', group, kind: kindOf(decl[1]!, decl[2]!.trim()) })
    }
  }
  return tokens
}

/** The tokens as declared in styles.css, per mode, in :root's order and groups. A token missing from
 *  .dark keeps its light value. */
export const BASE: Record<Mode, Token[]> = (() => {
  const light = parse(':root')
  const dark = new Map(parse('.dark').map(t => [t.name, t]))
  return { light, dark: light.map(t => dark.has(t.name) ? { ...t, value: dark.get(t.name)!.value, note: dark.get(t.name)!.note || t.note, kind: dark.get(t.name)!.kind } : t) }
})()

/** The palette: styles.css's colour scales, written by hand from the AIS Group guide, each in order
 *  of its number. The other colour tokens point to one of
 *  them, except the data series and a few of the app's own, written in their roles. */
export const PALETTE_GROUPS = ['Blue', 'Neutral', 'Others']

// ─── State ──────────────────────────────────────────────────────────────────────────────────────

const empty = (): Overrides => ({ light: {}, dark: {} })
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v))

const active = ref<Overrides>(readLocal())
const saved = ref<SavedPreset[]>(readSaved())
/** The base preset: styles.css plus these changes, saved over it from the Preset page (Save). */
const baseOverrides = ref<Overrides>(readBase())
/** The preset being edited: 'base' (styles.css) or a saved preset's id. Save writes over it. */
const current = ref<string>(readCurrent())
const mode = ref<'loading' | 'db' | 'local'>('loading')
const error = ref<string | null>(null)
let docRef: DbDocRef | null = null
let writing: Promise<void> = Promise.resolve()
let timer: number | undefined

function readLocal(): Overrides {
  try {
    const v = JSON.parse(localStorage.getItem(ACTIVE_KEY) ?? 'null')
    return v && typeof v === 'object' ? { light: { ...v.light }, dark: { ...v.dark } } : empty()
  }
  catch {
    return empty()
  }
}
function readCurrent(): string {
  try {
    return localStorage.getItem(CURRENT_KEY) || 'base'
  }
  catch {
    return 'base'
  }
}
function readBase(): Overrides {
  try {
    const v = JSON.parse(localStorage.getItem(BASE_KEY) ?? 'null')
    return v && typeof v === 'object' ? { light: { ...v.light }, dark: { ...v.dark } } : empty()
  }
  catch {
    return empty()
  }
}
function readSaved(): SavedPreset[] {
  try {
    const v = JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]')
    return Array.isArray(v) ? v : []
  }
  catch {
    return []
  }
}
function writeLocal() {
  try {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(active.value))
    localStorage.setItem(CURRENT_KEY, current.value)
    if (mode.value !== 'db') {
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved.value))
      localStorage.setItem(BASE_KEY, JSON.stringify(baseOverrides.value))
    }
  }
  catch {}
}
/** Same overrides (key order aside). */
const sameOverrides = (a: Overrides, b: Overrides) => (['light', 'dark'] as Mode[]).every((m) => {
  const ka = Object.keys(a[m]).sort()
  const kb = Object.keys(b[m]).sort()
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && a[m][k] === b[m][k])
})

// ─── Applying ───────────────────────────────────────────────────────────────────────────────────

const FONT_LINKS = new Set<string>()
/** Loads a Google font named first in a font-family value (Inter Variable ships with main.ts). */
function loadFont(value: string) {
  const family = value.split(',')[0]!.replace(/['"]/g, '').trim()
  if (!family || /^(inter variable|sans-serif|serif|monospace|system-ui|inherit|var\(.*)$/i.test(family) || FONT_LINKS.has(family))
    return
  FONT_LINKS.add(family)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)
}

function apply() {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = STYLE_ID
  }
  document.head.appendChild(el) // last in <head>: after styles.css
  // :root:not(.dark) / :root.dark beat both :root and .dark of styles.css, each only in its mode.
  const decl = (o: Record<string, string>) => Object.entries(o).map(([k, v]) => `${k}: ${v};`).join(' ')
  el.textContent = `:root:not(.dark) { ${decl(active.value.light)} }\n:root.dark { ${decl(active.value.dark)} }`
  for (const tk of BASE.light)
    if (tk.kind === 'font') loadFont(tk.value)
  for (const v of [...Object.entries(active.value.light), ...Object.entries(active.value.dark)])
    if (/font/.test(v[0])) loadFont(v[1])
  invalidateTokens() // canvases and colour inputs re-read the tokens
}

// ─── Storage ────────────────────────────────────────────────────────────────────────────────────

/** Without the db: saved presets live in this browser; a current preset that isn't there is styles.css. */
function goLocal() {
  mode.value = 'local'
  if (current.value !== 'base' && !saved.value.some(p => p.id === current.value))
    current.value = 'base'
}

let started = false
/** Applies the stored preset now and keeps following it (call once, at startup, in every frame). */
export function startPreset() {
  if (started)
    return
  started = true
  apply()
  // Frames: follow the editor through localStorage.
  window.addEventListener('storage', (e) => {
    if (e.key === ACTIVE_KEY) {
      active.value = readLocal()
      apply()
    }
  })
  const use = window.claude?.use
  if (!use || window.self !== window.top && document.referrer.startsWith(location.origin)) {
    goLocal()
    return
  }
  use('db').then((db) => {
    if (!db) {
      goLocal()
      return
    }
    docRef = db.doc(DOC)
    mode.value = 'db'
    docRef.onSnapshot(
      (snap) => {
        const d = (snap.exists ? snap.data() : null) as { active?: Overrides, saved?: SavedPreset[], current?: string, base?: Overrides } | null
        saved.value = Array.isArray(d?.saved) ? d.saved : []
        if (!timer)
          baseOverrides.value = d?.base ? { light: { ...d.base.light }, dark: { ...d.base.dark } } : empty()
        if (!timer && typeof d?.current === 'string')
          current.value = d.current === 'base' || saved.value.some(p => p.id === d.current) ? d.current : 'base'
        if (d?.active && !timer) { // a pending local edit wins until it is written
          active.value = { light: { ...d.active.light }, dark: { ...d.active.dark } }
          writeLocal()
          apply()
        }
      },
      (e) => {
        error.value = e.code
        goLocal()
        docRef = null
      },
    )
  }).catch(() => (goLocal()))
}

function persist() {
  writeLocal()
  apply()
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    timer = undefined
    const ref = docRef
    if (mode.value !== 'db' || !ref)
      return
    const body = { active: clone(active.value), saved: clone(saved.value), base: clone(baseOverrides.value), current: current.value, updatedAt: new Date().toISOString() }
    writing = writing.then(() => ref.set(body)).catch((e: { code?: string }) => {
      error.value = e?.code ?? 'unavailable'
    })
  }, 500) // a colour picker fires on every move: one write when it settles
}

// ─── Public API ─────────────────────────────────────────────────────────────────────────────────

const baseValue = (m: Mode, name: string) => BASE[m].find(t => t.name === name)?.value ?? ''

/** Hex colours are written in capitals, like the brand files; the native colour input gives lowercase. */
const upperHex = (v: string) => v.replace(/#[0-9a-f]{3,8}\b/gi, hex => hex.toUpperCase())

export function usePreset() {
  startPreset()
  return {
    active,
    saved,
    current,
    /** The current values differ from the current preset's (for 'base': styles.css plus its saved changes). */
    dirty: computed(() => {
      if (current.value === 'base')
        return !sameOverrides(active.value, baseOverrides.value)
      const p = saved.value.find(x => x.id === current.value)
      return !p || !sameOverrides(active.value, p.overrides)
    }),
    storage: mode,
    error,
    /** Current value of a token in a mode (the override, else styles.css). */
    value: (m: Mode, name: string) => active.value[m][name] ?? baseValue(m, name),
    isChanged: (m: Mode, name: string) => name in active.value[m],
    changedCount: computed(() => Object.keys(active.value.light).length + Object.keys(active.value.dark).length),
    set(m: Mode, name: string, v: string, both = false) {
      const value = upperHex(v.trim())
      for (const k of both ? (['light', 'dark'] as Mode[]) : [m]) {
        if (value === '' || value === baseValue(k, name))
          delete active.value[k][name]
        else active.value[k][name] = value
      }
      persist()
    },
    reset(m: Mode, name: string, both = false) {
      for (const k of both ? (['light', 'dark'] as Mode[]) : [m])
        delete active.value[k][name]
      persist()
    },
    resetAll() {
      active.value = empty()
      persist()
    },
    /** The base preset differs from styles.css (its changes were saved over it). */
    baseChanged: computed(() => Object.keys(baseOverrides.value.light).length + Object.keys(baseOverrides.value.dark).length > 0),
    load(p: SavedPreset | null) {
      active.value = clone(p ? p.overrides : baseOverrides.value)
      current.value = p?.id ?? 'base'
      persist()
    },
    /** Writes the current values over the current preset: a saved one, or the base preset (its changes
     *  over styles.css; the file itself only changes by pasting Export CSS into it). */
    save(): { name: string } | null {
      if (current.value === 'base') {
        baseOverrides.value = clone(active.value)
        persist()
        return { name: 'Rosepetal (styles.css)' }
      }
      const i = saved.value.findIndex(x => x.id === current.value)
      if (i < 0)
        return null
      saved.value = saved.value.map((p, j) => (j === i ? { ...p, overrides: clone(active.value) } : p))
      persist()
      return saved.value[i]!
    },
    /** A new saved preset with the current values; it becomes the current one. */
    saveAs(name: string) {
      const id = `p-${Date.now().toString(36)}`
      saved.value = [...saved.value, { id, name, overrides: clone(active.value) }]
      current.value = id
      persist()
      return id
    },
    remove(id: string) {
      saved.value = saved.value.filter(p => p.id !== id)
      if (current.value === id)
        current.value = 'base'
      persist()
    },
    /** The whole styles.css with the current values: every declaration in :root / .dark set to its
     *  value now, and dark values of tokens .dark doesn't declare yet added to its first block. Written
     *  to the repo by the dev server (Save to styles.css). */
    fileCss(): string {
      let out = css
      for (const [sel, m] of [[':root', 'light'], ['.dark', 'dark']] as const) {
        for (const body of blocks(out, sel)) {
          const next = body.replace(/(--[\w-]+)(\s*:\s*)([^;]+);/g, (all, name: string, sep: string) =>
            name in active.value[m] ? `${name}${sep}${upperHex(active.value[m][name]!)};` : all)
          out = out.replace(body, next)
        }
      }
      const darkBody = blocks(out, '.dark')[0]
      if (darkBody !== undefined) {
        const declared = new Set(parse('.dark').map(t => t.name))
        const missing = Object.entries(active.value.dark)
          .filter(([name, v]) => !declared.has(name) && v !== (active.value.light[name] ?? baseValue('light', name)))
          .map(([name, v]) => `    ${name}: ${upperHex(v)};\n`).join('')
        if (missing)
          out = out.replace(darkBody, `${darkBody.replace(/\s*$/, '\n')}    /* Set from the Preset page */\n${missing}`)
      }
      return out
    },
    /** After the current values were written to styles.css: they are its values now, nothing left over
     *  it (the page reloads to read the new file). */
    committedToFile() {
      active.value = empty()
      baseOverrides.value = empty()
      current.value = 'base'
      persist()
    },
    /** styles.css's :root and .dark blocks with the current values, ready to paste. */
    exportCss(): string {
      let out = css
      for (const [sel, m] of [[':root', 'light'], ['.dark', 'dark']] as const) {
        for (const body of blocks(out, sel)) {
          const next = body.replace(/(--[\w-]+)(\s*:\s*)([^;]+);/g, (all, name: string, sep: string) =>
            name in active.value[m] ? `${name}${sep}${upperHex(active.value[m][name]!)};` : all)
          out = out.replace(body, next)
        }
      }
      const pick = (sel: string) => blocks(out, sel).map(b => `${sel} {${b}}`).join('\n\n')
      return `${pick(':root')}\n\n${pick('.dark')}\n`
    },
  }
}

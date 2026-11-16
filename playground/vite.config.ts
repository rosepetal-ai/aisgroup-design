import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { execFile, execFileSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// In dev, serve this repo's rp-assets/ (copies of rosepetal-ui's images and videos) at /rp-assets.
// They stay out of the build: the Artifact publish uploads them as separate files at the same paths.
const LOCAL_ASSETS = fileURLToPath(new URL('./rp-assets', import.meta.url))
// The Assets section lists src/data/assets.json (scripts/assets-manifest.mjs). It is rebuilt when the
// dev server starts and on every build, and again whenever a file is added, changed or removed in
// rp-assets/ while the dev server runs (the JSON import then updates the page).
const MANIFEST = fileURLToPath(new URL('./scripts/assets-manifest.mjs', import.meta.url))
const ROOT = fileURLToPath(new URL('.', import.meta.url))
let timer: ReturnType<typeof setTimeout> | undefined
function refreshManifest(sync = false) {
  if (sync) {
    execFileSync(process.execPath, [MANIFEST], { cwd: ROOT, stdio: 'ignore' })
    return
  }
  clearTimeout(timer)
  timer = setTimeout(() => execFile(process.execPath, [MANIFEST], { cwd: ROOT }, () => {}), 300)
}
// Served with their media type: browsers guess PNG / JPEG without one, but only show an SVG (and play
// some videos) when it says what it is.
const TYPES: Record<string, string> = {
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json',
}
const rpAssets = {
  name: 'rp-assets',
  buildStart() {
    refreshManifest(true)
  },
  configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void }, watcher: { add: (p: string) => void, on: (e: string, fn: (file: string) => void) => void } }) {
    server.watcher.add(LOCAL_ASSETS)
    for (const event of ['add', 'change', 'unlink'])
      server.watcher.on(event, file => file.startsWith(LOCAL_ASSETS) && refreshManifest())
    server.middlewares.use((req, res, next) => {
      const url = decodeURIComponent((req.url ?? '').split('?')[0]!)
      // `<img src="/rp-assets/…">` in a template becomes an import (`…?import`): Vite answers those as JS
      if (!url.startsWith('/rp-assets/') || /[?&]import\b/.test(req.url ?? ''))
        return next()
      const file = join(LOCAL_ASSETS, url.slice('/rp-assets/'.length))
      if (!file.startsWith(LOCAL_ASSETS) || !existsSync(file) || !statSync(file).isFile())
        return next()
      res.setHeader('Content-Type', TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream')
      createReadStream(file).pipe(res)
    })
  },
}

// The Icons section: the icon library the shadcn preset declares (components.json iconLibrary), its
// package version, and which of its icons the source imports, from which files. Served as
// `virtual:icon-usage`; recomputed when a source file changes in dev.
const ICON_PACKAGES: Record<string, string> = { lucide: '@lucide/vue', tabler: '@tabler/icons-vue', phosphor: '@phosphor-icons/vue', radix: '@radix-icons/vue' }
const SRC = fileURLToPath(new URL('./src', import.meta.url))
function iconUsage() {
  const library = String(JSON.parse(readFileSync(join(ROOT, 'components.json'), 'utf8')).iconLibrary ?? 'lucide')
  const pkg = ICON_PACKAGES[library] ?? library
  const deps = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).dependencies ?? {}
  const usage: Record<string, string[]> = {}
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const file = join(dir, name)
      if (statSync(file).isDirectory()) {
        walk(file)
        continue
      }
      if (!/\.(vue|ts)$/.test(name) || /IconsView\.vue$/.test(name))
        continue
      const text = readFileSync(file, 'utf8')
      const rel = file.slice(SRC.length + 1)
      for (const m of text.matchAll(new RegExp(`import\\s*\\{([^}]*)\\}\\s*from\\s*['"]${pkg.replace('/', '\\/')}['"]`, 'g'))) {
        for (const part of m[1]!.split(',')) {
          const icon = part.replace(/^\s*type\s+/, '').split(/\s+as\s+/)[0]!.trim()
          if (icon)
            (usage[icon] ??= []).includes(rel) || usage[icon]!.push(rel)
        }
      }
    }
  }
  walk(SRC)
  return { library, pkg, version: String(deps[pkg] ?? '').replace(/^[\^~]/, ''), usage }
}
const iconUsagePlugin = {
  name: 'icon-usage',
  resolveId: (id: string) => (id === 'virtual:icon-usage' ? '\0virtual:icon-usage' : undefined),
  load: (id: string) => (id === '\0virtual:icon-usage' ? `export default ${JSON.stringify(iconUsage())}` : undefined),
  handleHotUpdate(ctx: { file: string, server: { moduleGraph: { getModuleById: (id: string) => unknown, invalidateModule: (m: never) => void } } }) {
    if (!ctx.file.startsWith(SRC) || !/\.(vue|ts)$/.test(ctx.file))
      return
    const mod = ctx.server.moduleGraph.getModuleById('\0virtual:icon-usage')
    if (mod)
      ctx.server.moduleGraph.invalidateModule(mod as never)
  },
}

// Saving to the repo (dev server only; the published artifact has no files to write): the Preset page
// writes ../packages/design/styles.css, the Assets page moves / deletes files in rp-assets/ (and updates the
// playground's references to a moved file). GET /__repo answers so the pages know they can.
const CSS_FILE = join(ROOT, '../packages/design/styles.css')
function readBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (c: Buffer) => (body += c))
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      }
      catch (e) {
        reject(e)
      }
    })
  })
}
const inAssets = (url: unknown) => typeof url === 'string' && /^rp-assets\/[^]+$/.test(url) && !url.includes('..')
function codeFiles(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name)
    if (statSync(file).isDirectory())
      codeFiles(file, out)
    else if (/\.(vue|ts|css|md)$/.test(name) && !/data[\\/]assets\.json$/.test(file))
      out.push(file)
  }
  return out
}
const repoSync = {
  name: 'repo-sync',
  configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
    server.middlewares.use(async (req, res, next) => {
      const url = (req.url ?? '').split('?')[0]
      if (!url.startsWith('/__repo'))
        return next()
      const reply = (status: number, data: unknown) => {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data))
      }
      try {
        if (req.method === 'GET' && url === '/__repo')
          return reply(200, { ok: true })
        if (req.method === 'POST' && url === '/__repo/index-css') {
          const { css } = await readBody(req)
          if (typeof css !== 'string' || !css.includes(':root') || !css.includes('@theme'))
            return reply(400, { error: 'Not a styles.css' })
          writeFileSync(CSS_FILE, css)
          return reply(200, { ok: true })
        }
        if (req.method === 'POST' && url === '/__repo/assets') {
          const { moves = [], deletes = [] } = await readBody(req) as { moves?: { from: string, to: string }[], deletes?: string[] }
          const moved: { from: string, to: string }[] = []
          const refs = new Set<string>()
          const code = codeFiles(SRC)
          for (const m of moves) {
            if (!inAssets(m.from) || !inAssets(m.to) || m.from === m.to || !existsSync(join(ROOT, m.from)) || existsSync(join(ROOT, m.to)))
              continue
            mkdirSync(dirname(join(ROOT, m.to)), { recursive: true })
            renameSync(join(ROOT, m.from), join(ROOT, m.to))
            moved.push(m)
            // The playground's own references to it follow the file
            for (const f of code) {
              const text = readFileSync(f, 'utf8')
              if (text.includes(m.from)) {
                writeFileSync(f, text.split(m.from).join(m.to))
                refs.add(f.slice(ROOT.length + 1))
              }
            }
          }
          const removed: string[] = []
          for (const d of deletes) {
            if (!inAssets(d) || !existsSync(join(ROOT, d)))
              continue
            unlinkSync(join(ROOT, d))
            removed.push(d)
          }
          // Folders left empty by the moves go too
          for (const m of moved) {
            const dir = dirname(join(ROOT, m.from))
            if (dir.startsWith(LOCAL_ASSETS) && dir !== LOCAL_ASSETS && !readdirSync(dir).length)
              rmdirSync(dir)
          }
          refreshManifest(true)
          return reply(200, { moved, removed, references: [...refs] })
        }
        return reply(404, { error: 'Unknown' })
      }
      catch (e) {
        return reply(500, { error: String(e) })
      }
    })
  },
}

// `vite build --mode artifact` inlines JS/CSS into one HTML so it can be published as a claude.ai Artifact.
export default defineConfig(({ mode }) => ({
  optimizeDeps: { entries: ['index.html'] },
  plugins: [vue(), tailwindcss(), rpAssets, iconUsagePlugin, repoSync, ...(mode === 'artifact' ? [viteSingleFile()] : [])],
  build: mode === 'artifact' ? { outDir: 'dist-artifact' } : {},
  resolve: {
    alias: [
      { find: '@/components/ui', replacement: fileURLToPath(new URL('../packages/design/ui', import.meta.url)) },
      { find: '@/components/blocks', replacement: fileURLToPath(new URL('../packages/design/blocks', import.meta.url)) },
      { find: '@/lib/utils', replacement: fileURLToPath(new URL('../packages/design/lib/utils.ts', import.meta.url)) },
      { find: '@aisgroup/design', replacement: fileURLToPath(new URL('../packages/design', import.meta.url)) },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
}))

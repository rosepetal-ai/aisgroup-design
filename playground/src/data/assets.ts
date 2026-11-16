import raw from './assets.json'

export interface Asset {
  path: string
  url: string
  name: string
  folder: string
  format: string
  bytes: number
  /** Playground files that use it now (what Usage counts). */
  usedHere: string[]
  /** rosepetal-ui files that reference it (shown as information). */
  usedIn: string[]
  registered: boolean
  dynamic: boolean
  /** Only in rosepetal-design so far: to be copied to rosepetal-ui. */
  isNew?: boolean
}

// Brand/UI folders first.
const ORDER = ['images', 'logos', 'theme', 'videos', 'public']
const rank = (f: string) => (ORDER.includes(f) ? ORDER.indexOf(f) : ORDER.length)
export const assets = (raw as Asset[]).slice().sort((a, b) => rank(a.folder) - rank(b.folder) || a.name.localeCompare(b.name))
export const assetFolders = [...new Set(assets.map(a => a.folder))]

export type Advice = 'is-svg' | 'icon' | 'svg-logo' | 'svg-illustration' | 'spinner' | 'heavy' | 'raster'

// What to do with each asset if it moves to shadcn. Labels are i18n keys.
export const adviceLabel: Record<Advice, string> = {
  'is-svg': 'Already an SVG',
  'icon': 'Replace with an icon',
  'svg-logo': 'SVG candidate (logo)',
  'svg-illustration': 'SVG candidate (illustration)',
  'spinner': 'Replace with Spinner',
  'heavy': 'Too heavy: convert to video',
  'raster': 'Raster is fine (photo)',
}

export const adviceHint: Record<Advice, string> = {
  'is-svg': 'Scales without loss and can follow the theme colours.',
  'icon': 'Small UI pictogram: a lucide icon scales, takes the theme colour and weighs nothing.',
  'svg-logo': 'Logos should be vector: sharp at any size, one file for every colour via currentColor.',
  'svg-illustration': 'Flat illustration: as SVG it stays sharp and can adapt to dark mode.',
  'spinner': 'Animated loader: the shadcn Spinner (or the logo as SVG + CSS animation) replaces it.',
  'heavy': 'Animated GIF over 1 MB: a WebM/MP4 is usually 10–20× smaller.',
  'raster': 'Photographs have no vector form; keep JPG/PNG (or WebP).',
}

const ICONS = /^(ok|tick|pencil|erase|folder|folder-icon|hand|point|bounding2?|zip|copy|info|infoHide|wand|tags|photo|dataset2|assistantTop)\.png$/
const LOGOS = /^(rp-logo|rp-icon|logoLoading|vision_platform_logo|ais-vision|rosepetal-)/
const ILLUSTRATIONS = /^(dataset_|newdataset_|newmodel_|supervised|unsupervised|semi-supervised|vlm|errorNet|net2|flow1)/

export function adviceFor(a: Asset): Advice {
  if (a.format === 'svg')
    return 'is-svg'
  if (a.format === 'gif')
    return a.bytes > 1_000_000 ? 'heavy' : 'spinner'
  if (ICONS.test(a.name))
    return 'icon'
  if (LOGOS.test(a.name))
    return 'svg-logo'
  if (ILLUSTRATIONS.test(a.name))
    return 'svg-illustration'
  return 'raster'
}

/** Usage in the playground as it is now: used by some file, or no references (New is shown apart). */
export function usage(a: Asset): 'used' | 'unused' {
  return a.usedHere.length ? 'used' : 'unused'
}

export function formatBytes(bytes: number) {
  if (bytes >= 1_000_000)
    return `${(bytes / 1_000_000).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1000))} KB`
}

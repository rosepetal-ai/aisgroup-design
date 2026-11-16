// Colour tokens (CSS custom properties of styles.css) read from script: for canvas drawing and for
// the native colour input, which can't take var(). Values are cached until the tokens may have
// changed: theme class / data-theme / inline style on <html> (where a preset editor overrides
// them), or an explicit `invalidateTokens()` (e.g. after swapping a <style> with new values).

const root = document.documentElement
const cache = new Map<string, string>()
const hexCache = new Map<string, string>()

export function invalidateTokens() {
  cache.clear()
  hexCache.clear()
  window.dispatchEvent(new Event('rp-tokens-changed'))
}

new MutationObserver(invalidateTokens).observe(root, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] })

/** Current value of the token `--name`, as declared in styles.css (or as overridden at runtime). */
export function token(name: string): string {
  let v = cache.get(name)
  if (v === undefined) {
    v = getComputedStyle(root).getPropertyValue(`--${name}`).trim()
    cache.set(name, v)
  }
  return v
}

/** `var(--name)` for style bindings and data that should follow the token. */
export const tokenVar = (name: string) => `var(--${name})`

let probe: CanvasRenderingContext2D | null = null
/**
 * Any CSS colour, or `var(--name)`, as the browser's canonical form: `#rrggbb` for opaque colours
 * (what `<input type="color">` needs), the rgb form with alpha otherwise.
 */
export function resolveColor(value: string): string {
  const m = /^var\(--([\w-]+)\)$/.exec(value.trim())
  const color = m ? token(m[1]!) : value
  probe ??= document.createElement('canvas').getContext('2d')
  if (!probe)
    return color
  probe.fillStyle = 'transparent'
  probe.fillStyle = color
  return String(probe.fillStyle)
}

/**
 * The token `--name` with an alpha (0–1), as `#rrggbbaa`: for canvas strokes and fills that fade.
 * Tokens that aren't opaque colours are returned as they are (their own alpha applies).
 */
export function tokenAlpha(name: string, alpha: number): string {
  let hex = hexCache.get(name)
  if (hex === undefined) {
    hex = resolveColor(tokenVar(name))
    hexCache.set(name, hex)
  }
  if (!/^#[0-9a-f]{6}$/i.test(hex))
    return hex
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
  return hex + a.toString(16).padStart(2, '0')
}

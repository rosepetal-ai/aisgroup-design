import { ref, watch } from 'vue'

// Light-mode surface tones to compare, picked from the Playground tools: `data-tone` on <html>
// switches the page, card and grey-panel tokens (styles.css). Remembered per browser and shared with
// every frame (storage event). Dark mode ignores it.
export const TONES = [
  { value: 'current', label: 'Current', hint: 'Light grey page, white cards and near-white panels' },
  { value: 'page', label: 'Darker page', hint: 'Only the page darker: cards and panels stand out more' },
  { value: 'soft', label: 'Soft', hint: 'Everything a step darker; only menus and dialogs white' },
  { value: 'grey', label: 'Grey', hint: 'Everything two steps darker; only menus and dialogs white' },
] as const
export type Tone = typeof TONES[number]['value']

const KEY = 'playground-tone'
function read(): Tone {
  try {
    const v = localStorage.getItem(KEY)
    return TONES.some(t => t.value === v) ? v as Tone : 'current'
  }
  catch {
    return 'current'
  }
}

export const tone = ref<Tone>(read())
function apply(t: Tone) {
  if (t === 'current')
    delete document.documentElement.dataset.tone
  else
    document.documentElement.dataset.tone = t
}
apply(tone.value)
watch(tone, (t) => {
  apply(t)
  try {
    localStorage.setItem(KEY, t)
  }
  catch {}
})
window.addEventListener('storage', (e) => {
  if (e.key === KEY)
    tone.value = read()
})

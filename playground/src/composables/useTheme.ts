import { ref } from 'vue'

// Light/dark follows, in order: the manual toggle, the Artifact viewer's
// `data-theme` on <html>, then the OS preference. shadcn reads the `.dark` class.
const root = document.documentElement
const media = window.matchMedia('(prefers-color-scheme: dark)')
const isDark = ref(false)

function sync() {
  const forced = root.dataset.theme
  isDark.value = forced ? forced === 'dark' : media.matches
  root.classList.toggle('dark', isDark.value)
}

media.addEventListener('change', sync)
new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-theme'] })
sync()

function toggle() {
  root.dataset.theme = isDark.value ? 'light' : 'dark'
}

// F2 switches light / dark anywhere, also where the toggle can't be reached (a preview enlarged to
// full screen). Inside a preview frame (#embed~ / #app~ in an iframe of the playground) it switches
// there and tells the playground, which switches too and passes the theme to its other frames.
const framed = window.parent !== window && /^#(?:embed|app)~/.test(location.hash)
window.addEventListener('keydown', (e) => {
  if (e.key !== 'F2' || e.repeat)
    return
  e.preventDefault()
  toggle()
  if (framed)
    window.parent.postMessage({ rpEmbed: 'toggle-theme' }, '*')
})
window.addEventListener('message', (e) => {
  if (!framed && e.data?.rpEmbed === 'toggle-theme' && [...document.querySelectorAll('iframe')].some(f => f.contentWindow === e.source))
    toggle()
})

export function useTheme() {
  return { isDark, toggle }
}

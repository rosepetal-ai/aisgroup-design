import { createI18n } from 'vue-i18n'
import es from './es'

// Same convention as rosepetal-ui/src/i18n: keys ARE the English strings, so `en` needs no
// dictionary (a missing key renders the key itself).
export type Locale = 'en' | 'es'
const STORAGE_KEY = 'playground-locale'

function savedLocale(): Locale {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'es')
      return v
  }
  catch {}
  return 'es'
}

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale(),
  fallbackLocale: 'en',
  messages: { en: {}, es },
  missingWarn: false,
  fallbackWarn: false,
  // English renders the key itself: still fill in its {placeholders}
  fallbackFormat: true,
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  }
  catch {}
}

document.documentElement.lang = i18n.global.locale.value

/** Locale-aware number formatting for templates and scripts. */
export function formatNumber(n: number) {
  return new Intl.NumberFormat(i18n.global.locale.value === 'es' ? 'es-ES' : 'en-GB').format(n)
}

export function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat(i18n.global.locale.value === 'es' ? 'es-ES' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(d)
}

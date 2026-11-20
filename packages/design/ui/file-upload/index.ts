export { default as FileUpload } from './FileUpload.vue'
export { default as FileUploadItem } from './FileUploadItem.vue'

export interface FileRejection {
  file: File
  reason: 'type' | 'size'
}

/** Whether a file matches an `accept` list as the file input reads it: `.pdf`, `image/*`, `image/png`. */
export function acceptsFile(file: { name: string, type: string }, accept?: string) {
  if (!accept)
    return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return accept.split(',').map(a => a.trim().toLowerCase()).filter(Boolean).some(a =>
    a.startsWith('.') ? name.endsWith(a) : a.endsWith('/*') ? type.startsWith(a.slice(0, -1)) : type === a)
}

/** A file size in the units people read: 512 B, 2.4 MB. */
export function formatBytes(bytes: number, locale = 'en-GB') {
  const units = ['B', 'KB', 'MB', 'GB']
  const i = bytes > 0 ? Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1) : 0
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: i ? 1 : 0 }).format(bytes / 1024 ** i)} ${units[i]}`
}

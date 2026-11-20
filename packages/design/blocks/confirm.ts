import type { ButtonVariants } from '../ui/button'
import { shallowRef } from 'vue'

/** A question asked from code. ConfirmHost shows it on the confirm dialog block. */
export interface ConfirmRequest {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  loadingLabel?: string
  /** The confirm button, destructive unless said otherwise, as in the block. */
  variant?: ButtonVariants['variant']
  /** Runs on confirm. Return its promise: the dialog shows the progress, and the error with Retry if it fails. */
  action?: () => unknown
  onCancel?: () => unknown
  /** Shown by the ConfirmHost of the same group; without one, by the host in App. */
  group?: string
}

let asked = 0
/** The question on screen. ponytail: one at a time, a new one replaces it; a queue if two ever overlap. */
export const pending = shallowRef<(ConfirmRequest & { id: number }) | null>(null)

/** Confirmations from code (a menu item, a store): `useConfirm().ask({ title, confirmLabel, action })`. */
export function useConfirm() {
  return {
    ask(request: ConfirmRequest) {
      pending.value = { ...request, id: ++asked }
    },
    close() {
      pending.value = null
    },
  }
}

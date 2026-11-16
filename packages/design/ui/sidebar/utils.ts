import type { ComputedRef, Ref } from 'vue'
import { createContext } from 'reka-ui'

export const SIDEBAR_COOKIE_NAME = 'sidebar_state'
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = '16rem'
export const SIDEBAR_WIDTH_MOBILE = '18rem'
export const SIDEBAR_WIDTH_ICON = '3rem'
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b'
/** Resizable width (dragging the rail), in px: its limits and where the chosen one is remembered. */
export const SIDEBAR_MIN_WIDTH = 208
export const SIDEBAR_MAX_WIDTH = 448
export const SIDEBAR_WIDTH_KEY = 'playground-sidebar-width'

export const [useSidebar, provideSidebarContext] = createContext<{
  state: ComputedRef<'expanded' | 'collapsed'>
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  isMobile: Ref<boolean>
  openMobile: Ref<boolean>
  setOpenMobile: (value: boolean) => void
  toggleSidebar: () => void
  /** The expanded width in px (null = the default --sidebar-width), set by dragging the rail. */
  width: Ref<number | null>
  setWidth: (px: number) => void
  /** True while the rail is dragged (the width follows the pointer without its transition). */
  resizing: Ref<boolean>
}>('Sidebar')

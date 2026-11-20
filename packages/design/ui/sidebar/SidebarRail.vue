<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../lib/utils'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar, state, isMobile, width, setWidth, resizing } = useSidebar()

// Drag the rail to make the sidebar wider or narrower (within its limits); a click without moving
// still opens / closes it. Collapsed, a drag to the right opens it first.
function onPointerDown(e: PointerEvent) {
  if (e.button !== 0 || isMobile.value)
    return
  const rail = e.currentTarget as HTMLElement
  const startX = e.clientX
  const sidebar = rail.closest('[data-slot=sidebar-container]') as HTMLElement | null
  const startWidth = width.value ?? sidebar?.getBoundingClientRect().width ?? 256
  let moved = false
  rail.setPointerCapture(e.pointerId)
  const move = (ev: PointerEvent) => {
    const dx = ev.clientX - startX
    if (!moved && Math.abs(dx) < 4)
      return
    if (!moved) {
      moved = true
      resizing.value = true
      if (state.value === 'collapsed')
        toggleSidebar()
    }
    setWidth(startWidth + dx)
  }
  const up = () => {
    rail.removeEventListener('pointermove', move)
    rail.removeEventListener('pointerup', up)
    rail.removeEventListener('pointercancel', up)
    resizing.value = false
    if (!moved)
      toggleSidebar()
  }
  rail.addEventListener('pointermove', move)
  rail.addEventListener('pointerup', up)
  rail.addEventListener('pointercancel', up)
}
</script>

<template>
  <button
    data-sidebar="rail"
    data-slot="sidebar-rail"
    aria-label="Toggle or resize the sidebar"
    :tabindex="-1"
    title="Click to open / close, drag to resize"
    :class="cn(
      'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-6 transition-all ease-linear group-data-[side=left]:-right-6 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-0.5 sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2',
      'in-data-[side=left]:cursor-ew-resize in-data-[side=right]:cursor-ew-resize',
      '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
      'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar',
      '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
      '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
      props.class,
    )"
    @pointerdown="onPointerDown"
  >
    <slot />
  </button>
</template>

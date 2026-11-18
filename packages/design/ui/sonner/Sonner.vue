<script lang="ts" setup>
import type { ToasterProps } from 'vue-sonner'

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from '@lucide/vue'
import { reactiveOmit, useMutationObserver } from '@vueuse/core'
import { ref } from 'vue'
import { Toaster as Sonner } from 'vue-sonner'
import 'vue-sonner/style.css'
import { cn } from '../../lib/utils'

// Every notice has a close cross (top right), so it can go before its time is up.
const props = withDefaults(defineProps<ToasterProps & { closeLabel?: string }>(), { closeButton: true, closeButtonPosition: 'top-right', closeLabel: 'Close notification' })
const delegatedProps = reactiveOmit(props, 'class', 'toastOptions', 'closeLabel')

// Follow the app's light / dark class (useTheme toggles `.dark` on <html>).
const root = document.documentElement
const theme = ref<'light' | 'dark'>(root.classList.contains('dark') ? 'dark' : 'light')
useMutationObserver(root, () => { theme.value = root.classList.contains('dark') ? 'dark' : 'light' }, { attributes: true, attributeFilter: ['class'] })

function closeOnClick(event: MouseEvent) {
  const target = event.target as Element
  if (target.closest('button, a')) return
  target.closest('[data-sonner-toast]')?.querySelector<HTMLElement>('[data-close-button]')?.click()
}
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
      '--gray2': 'color-mix(in oklab, var(--popover) 90%, transparent)',
      '--gray3': 'var(--border)',
      '--gray4': 'var(--border)',
      '--gray5': 'var(--border)',
      '--gray12': 'var(--popover-foreground)',
      '--success-bg': 'color-mix(in oklab, var(--success) 10%, var(--popover))',
      '--success-border': 'color-mix(in oklab, var(--success) 30%, var(--popover))',
      '--success-text': 'var(--success)',
      '--info-bg': 'color-mix(in oklab, var(--info) 10%, var(--popover))',
      '--info-border': 'color-mix(in oklab, var(--info) 30%, var(--popover))',
      '--info-text': 'var(--info)',
      '--warning-bg': 'color-mix(in oklab, var(--warning) 10%, var(--popover))',
      '--warning-border': 'color-mix(in oklab, var(--warning) 30%, var(--popover))',
      '--warning-text': 'var(--popover-foreground)',
      '--error-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--popover))',
      '--error-border': 'color-mix(in oklab, var(--destructive) 30%, var(--popover))',
      '--error-text': 'var(--destructive)',
    }"
    :toast-options="props.toastOptions ?? {
      classes: {
        toast: 'cursor-pointer rounded-2xl',
      },
      closeButtonAriaLabel: props.closeLabel,
    }"
    v-bind="delegatedProps"
    :theme="theme"
    @click="closeOnClick"
  >
    <template #success-icon>
      <CircleCheckIcon class="size-4" />
    </template>
    <template #info-icon>
      <InfoIcon class="size-4" />
    </template>
    <template #warning-icon>
      <TriangleAlertIcon class="size-4 text-warning" />
    </template>
    <template #error-icon>
      <OctagonXIcon class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <Loader2Icon class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <XIcon class="size-4" />
    </template>
  </Sonner>
</template>

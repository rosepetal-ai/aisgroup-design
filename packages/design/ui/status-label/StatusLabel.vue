<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import type { StatusTone } from '.'
import { CircleCheckIcon, CircleIcon, CircleXIcon, InfoIcon, LoaderCircleIcon, TriangleAlertIcon } from '@lucide/vue'
import { cn } from '../../lib/utils'

// A status as the guide writes it: a toned icon and the word, in muted text. Never colour alone, never a tinted pill.
// The tone picks the icon and its colour; `icon` replaces the icon where a status needs its own (a clock for pending).
const props = withDefaults(defineProps<{
  tone?: StatusTone
  icon?: Component
  class?: HTMLAttributes['class']
}>(), { tone: 'neutral' })

const ICONS: Record<StatusTone, Component> = {
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  destructive: CircleXIcon,
  info: InfoIcon,
  neutral: CircleIcon,
  running: LoaderCircleIcon,
}
const TONES: Record<StatusTone, string> = {
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  info: 'text-info',
  neutral: '',
  running: 'animate-spin motion-reduce:animate-none',
}
</script>

<template>
  <span data-slot="status-label" :data-tone="tone" :class="cn('inline-flex items-center gap-1.5 whitespace-nowrap text-muted-foreground', props.class)">
    <component :is="icon ?? ICONS[tone]" aria-hidden="true" :class="cn('size-4 shrink-0', TONES[tone])" />
    <slot />
  </span>
</template>

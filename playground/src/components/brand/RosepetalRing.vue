<script setup lang="ts">
// rosepetal-ui/src/assets/images/logoLoading*.png redrawn as SVG (traced from the 256px PNG,
// <1% pixel difference): a ring with a round notch at the top right. Takes `currentColor`, so one
// file replaces logoLoading, logoLoadingBlue, logoLoadingGray and logoLoadingWhite.
import { useId } from 'vue'

/** Optional horizontal gradient [left, right] (any CSS colour, e.g. var(--blue-800)); else currentColor. */
defineProps<{ gradient?: [string, string] }>()
const id = useId()
</script>

<template>
  <svg viewBox="0 0 256 256" :fill="gradient ? `url(#${id}-g)` : 'currentColor'" aria-hidden="true">
    <linearGradient v-if="gradient" :id="`${id}-g`" x1="35" y1="0" x2="221" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" :style="{ stopColor: gradient[0] }" />
      <stop offset="1" :style="{ stopColor: gradient[1] }" />
    </linearGradient>
    <mask :id="`${id}-m`">
      <rect width="256" height="256" fill="white" />
      <circle cx="128" cy="128" r="52" fill="black" />
      <circle cx="169" cy="74" r="17" fill="black" />
    </mask>
    <circle cx="128" cy="128" r="93" :mask="`url(#${id}-m)`" />
  </svg>
</template>

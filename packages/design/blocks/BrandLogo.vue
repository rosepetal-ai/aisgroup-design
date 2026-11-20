<script setup lang="ts">
import aisMark from './ais-mark-white.svg'
import rosepetal from './rosepetal.svg'

// Rosepetal's app signs with its wordmark; AIS software with the app mark, the white Λ at 24 px (guide, Logos: App marks).
withDefaults(defineProps<{ brand?: 'rosepetal' | 'ais' }>(), { brand: 'rosepetal' })
</script>

<template>
  <img v-if="brand === 'ais'" :src="aisMark" alt="AIS Group" class="h-6 w-auto shrink-0">
  <img v-else :src="rosepetal" alt="Rosepetal" class="h-6 w-auto object-contain">
</template>

<script setup lang="ts">
import { Separator } from '../ui/separator'
import BrandLogo from './BrandLogo.vue'

defineProps<{ full?: boolean, brand?: 'rosepetal' | 'ais' }>()
</script>

<template>
  <header class="flex h-13 shrink-0 bg-topbar text-topbar-foreground">
    <div class="flex h-full min-w-0 items-center" :class="full ? 'w-full gap-4 px-4' : 'mx-auto w-[var(--page-width,calc(100%-2rem))] gap-2'">
      <div class="flex h-full min-w-0 items-center" :class="full ? 'gap-3' : 'gap-2'">
        <slot name="logo"><BrandLogo :brand="brand" :class="!full && 'mr-4'" /></slot>
        <Separator v-if="full && $slots.default" orientation="vertical" class="hidden h-5 self-center bg-topbar-foreground/20 md:block" />
        <slot />
      </div>
      <div class="ml-auto flex h-full shrink-0 items-center" :class="full ? 'gap-1' : 'gap-3 pl-3'">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

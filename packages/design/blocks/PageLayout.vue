<script setup lang="ts">
defineProps<{ title: string, description?: string }>()
</script>

<template>
  <div class="mx-auto flex w-[var(--page-width,calc(100%-2rem))] flex-col gap-6 pt-5 pb-10" :class="$slots.nav && 'h-full min-h-0'">
    <header class="flex shrink-0 flex-wrap items-start justify-between gap-4">
      <div class="flex min-w-0 flex-col gap-0.5">
        <h1 class="text-2xl font-medium tracking-tight text-heading">{{ title }}</h1>
        <p v-if="description" class="text-muted-foreground">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </header>
    <div v-if="$slots.nav" class="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-10">
      <slot name="nav" />
      <div class="scrollbar-visible h-full min-w-0 overflow-y-auto pr-3 pb-6">
        <slot />
      </div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
// The page header of every playground page: title and one muted line, actions at the right.
defineProps({ title: { type: String, required: true }, description: { type: String, default: '' } });
</script>

<template>
  <header class="flex flex-wrap items-start justify-between gap-6">
    <div class="flex max-w-3xl flex-col gap-1">
      <h1 class="font-heading text-2xl font-medium tracking-tight">{{ title }}</h1>
      <p v-if="description" class="text-muted-foreground">{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="flex flex-wrap items-center gap-2"><slot /></div>
  </header>
</template>

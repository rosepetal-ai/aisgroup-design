<script setup lang="ts">
// The figures of an overview as cards, as rosepetal-ui's dashboard shows its usage: the label, the value large and an
// optional detail line. Up to four in a row on a wide screen, two on a tablet, one on a phone. Figures that belong
// together are one FigureCards; a second group is another, so it starts its own row. `attrs` go on each figure's card
// (an app's test ids, for instance); the value carries data-figure-value.
import type { HTMLAttributes } from 'vue'
import { cn } from '../lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export interface Figure {
  id: string
  label: string
  value: string | number
  detail?: string
  attrs?: Record<string, string>
}

const props = defineProps<{ figures: Figure[], loading?: boolean, class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div data-slot="figure-cards" :class="cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', props.class)">
    <Card v-for="figure in figures" :key="figure.id" v-bind="figure.attrs">
      <CardHeader>
        <CardDescription>{{ figure.label }}</CardDescription>
        <Skeleton v-if="loading" class="h-9 w-24" />
        <CardTitle v-else data-figure-value class="text-3xl font-semibold tracking-tight tabular-nums">
          {{ figure.value }}
        </CardTitle>
      </CardHeader>
      <CardContent v-if="figure.detail" class="text-muted-foreground tabular-nums">
        {{ figure.detail }}
      </CardContent>
    </Card>
  </div>
</template>

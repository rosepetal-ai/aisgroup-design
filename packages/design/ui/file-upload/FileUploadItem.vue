<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { CircleAlertIcon, FileIcon, XIcon } from '@lucide/vue'
import { cn } from '../../lib/utils'
import { Button } from '../button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../item'
import { Progress } from '../progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { formatBytes } from '.'

// One file in an upload list, as an outline item: name, size, progress while it uploads, an error as a toned icon
// and its words, and a remove button.
const props = withDefaults(defineProps<{
  file: { name: string, size: number }
  progress?: number
  error?: string
  removeLabel?: string
  class?: HTMLAttributes['class']
}>(), {
  removeLabel: 'Remove',
})

defineEmits<{ remove: [] }>()
</script>

<template>
  <Item data-slot="file-upload-item" role="listitem" variant="outline" size="sm" :class="cn('flex-nowrap', props.class)">
    <ItemMedia variant="icon"><FileIcon class="text-muted-foreground" /></ItemMedia>
    <ItemContent class="min-w-0">
      <ItemTitle class="w-full truncate">{{ file.name }}</ItemTitle>
      <ItemDescription v-if="error" class="flex items-center gap-1.5"><CircleAlertIcon class="size-4 shrink-0 text-destructive" />{{ error }}</ItemDescription>
      <ItemDescription v-else class="tabular-nums">{{ formatBytes(file.size) }}</ItemDescription>
      <Progress v-if="progress !== undefined && !error" :model-value="progress" class="mt-1" />
    </ItemContent>
    <ItemActions>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="ghost" size="icon-sm" :aria-label="`${removeLabel} ${file.name}`" @click="$emit('remove')"><XIcon /></Button>
        </TooltipTrigger>
        <TooltipContent>{{ removeLabel }}</TooltipContent>
      </Tooltip>
    </ItemActions>
  </Item>
</template>

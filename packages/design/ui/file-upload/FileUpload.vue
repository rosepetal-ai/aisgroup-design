<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { FileRejection } from '.'
import { UploadIcon } from '@lucide/vue'
import { ref } from 'vue'
import { cn } from '../../lib/utils'
import { Button } from '../button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../empty'
import { acceptsFile } from '.'

// A dashed drop zone, built from Empty: drop files on it or choose them with its button. It checks type (`accept`,
// as the file input reads it) and size (`maxSize`, in bytes) and emits the files it takes and the ones it rejects.
// The app keeps the list and shows it with FileUploadItem.
const props = withDefaults(defineProps<{
  accept?: string
  multiple?: boolean
  maxSize?: number
  disabled?: boolean
  label?: string
  description?: string
  buttonLabel?: string
  class?: HTMLAttributes['class']
}>(), {
  label: 'Drag files here',
  buttonLabel: 'Choose files',
})

const emits = defineEmits<{
  files: [files: File[]]
  reject: [rejections: FileRejection[]]
}>()

const input = ref<HTMLInputElement>()
const dragging = ref(false)

function take(list?: FileList | null) {
  dragging.value = false
  if (!list || props.disabled)
    return
  const files = props.multiple ? [...list] : [...list].slice(0, 1)
  const rejected: FileRejection[] = []
  const accepted = files.filter((file) => {
    const reason = !acceptsFile(file, props.accept) ? 'type' : props.maxSize && file.size > props.maxSize ? 'size' : undefined
    if (reason)
      rejected.push({ file, reason })
    return !reason
  })
  if (accepted.length)
    emits('files', accepted)
  if (rejected.length)
    emits('reject', rejected)
  if (input.value)
    input.value.value = ''
}

function leave(event: DragEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null))
    dragging.value = false
}
</script>

<template>
  <Empty
    data-slot="file-upload"
    :data-dragging="dragging || undefined"
    :data-disabled="disabled || undefined"
    :class="cn('border p-8 transition-colors data-dragging:border-ring data-dragging:bg-muted data-disabled:opacity-50', props.class)"
    @dragenter.prevent="dragging = !disabled"
    @dragover.prevent
    @dragleave="leave"
    @drop.prevent="take($event.dataTransfer?.files)"
  >
    <slot :open="() => input?.click()" :dragging="dragging">
      <EmptyHeader>
        <EmptyMedia><UploadIcon class="size-6 text-muted-foreground" /></EmptyMedia>
        <EmptyTitle class="text-base">{{ label }}</EmptyTitle>
        <EmptyDescription v-if="description">{{ description }}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" :disabled="disabled" @click="input?.click()">{{ buttonLabel }}</Button>
      </EmptyContent>
    </slot>
    <input
      ref="input"
      type="file"
      class="sr-only"
      tabindex="-1"
      aria-hidden="true"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="take(($event.target as HTMLInputElement).files)"
    >
  </Empty>
</template>

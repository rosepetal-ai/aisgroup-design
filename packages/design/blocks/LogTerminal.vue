<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Button } from '../ui/button'

export interface LogLine { time?: string, text: string, error?: boolean, highlight?: boolean }

const props = withDefaults(defineProps<{
  lines?: LogLine[]
  loading?: boolean
  error?: string | null
  fatal?: boolean
  retrying?: boolean
  hasMore?: boolean
  loadingLabel?: string
  emptyLabel?: string
  retryLabel?: string
  retryingLabel?: string
  loadMoreLabel?: string
}>(), {
  lines: () => [],
  error: null,
  loadingLabel: 'Loading logs...',
  emptyLabel: 'No logs yet',
  retryLabel: 'Retry',
  retryingLabel: 'Retrying...',
  loadMoreLabel: 'Load more',
})
const emit = defineEmits<{ retry: [], loadMore: [] }>()

const box = ref<HTMLElement | null>(null)
let atBottom = true

function onScroll() {
  const el = box.value!
  atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
}

watch(() => props.lines.length, async () => {
  if (!atBottom)
    return
  await nextTick()
  box.value?.scrollTo({ top: box.value.scrollHeight })
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div ref="box" class="scrollbar-visible overflow-y-auto bg-code-block px-4 py-3 font-mono text-sm leading-relaxed text-code-block-foreground" role="log" aria-live="polite" @scroll="onScroll">
    <p v-if="error" class="py-6 text-center" :class="fatal ? 'text-destructive' : 'text-warning'">
      {{ error }}
      <span v-if="retrying"> {{ retryingLabel }}</span>
      <Button v-else variant="terminal" size="sm" class="ml-2" :disabled="loading" @click="emit('retry')">{{ retryLabel }}</Button>
    </p>
    <p v-else-if="loading && !lines.length" class="py-6 text-center opacity-70">{{ loadingLabel }}</p>
    <p v-else-if="!lines.length" class="py-6 text-center opacity-70">{{ emptyLabel }}</p>
    <template v-else>
      <div v-for="(line, i) in lines" :key="i" class="flex gap-3 border-l-2 pl-2" :class="line.highlight ? 'border-info bg-info/10' : 'border-transparent'">
        <span class="w-16 shrink-0 tabular-nums" :class="line.error ? 'font-semibold text-destructive' : 'opacity-60'">{{ line.time }}</span>
        <span class="min-w-0 flex-1 wrap-break-word whitespace-pre-wrap wrap-anywhere" :class="line.error && 'text-destructive'">{{ line.text }}</span>
      </div>
      <Button v-if="hasMore" variant="terminal" size="sm" class="mt-2 w-full border-dashed" :disabled="loading" @click="emit('loadMore')">
        {{ loading ? loadingLabel : loadMoreLabel }}
      </Button>
    </template>
  </div>
</template>

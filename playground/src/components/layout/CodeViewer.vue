<script setup lang="ts">
// The source of a component, read from its own files, ready to copy or download to another project.
import { ChevronDownIcon, CodeIcon, CopyIcon, DownloadIcon } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SOURCES = import.meta.glob('../../../../packages/design/{ui/*,blocks}/*.{vue,ts}', { query: '?raw', import: 'default' }) as Record<string, () => Promise<string>>

const props = defineProps<{ files: string[] }>()
const { t } = useI18n()
const open = ref(false)
const file = ref(props.files[0]!)
const code = ref('')
const name = computed(() => file.value.split('/').pop()!)

watch(() => props.files, (files) => { file.value = files[0]! })
watch([open, file], async () => {
  if (open.value)
    code.value = await SOURCES[`../../../../${file.value}`]?.() ?? ''
}, { immediate: true })

async function copy() {
  await navigator.clipboard.writeText(code.value)
  toast.success(t('Copied'), { description: name.value })
}
function download() {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([code.value], { type: 'text/plain' }))
  link.download = name.value
  link.click()
  URL.revokeObjectURL(link.href)
}
</script>

<template>
  <Collapsible v-model:open="open" class="flex flex-col gap-3">
    <CollapsibleTrigger as-child>
      <Button variant="outline" size="sm" class="w-fit">
        <CodeIcon data-icon="inline-start" />
        {{ $t(open ? 'Hide code' : 'Show code') }}
        <ChevronDownIcon data-icon="inline-end" class="transition-transform" :class="open && 'rotate-180'" />
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent class="flex flex-col gap-2">
      <div class="flex flex-wrap items-center gap-2">
        <Select v-if="files.length > 1" v-model="file">
          <SelectTrigger size="sm" class="max-w-80" :aria-label="$t('File')"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem v-for="f in files" :key="f" :value="f">{{ f.split('/').pop() }}</SelectItem>
          </SelectContent>
        </Select>
        <code v-else class="min-w-0 truncate text-xs text-muted-foreground">{{ file }}</code>
        <div class="ml-auto flex gap-1">
          <Button variant="ghost" size="sm" :disabled="!code" @click="copy"><CopyIcon data-icon="inline-start" />{{ $t('Copy') }}</Button>
          <Button variant="ghost" size="sm" :disabled="!code" @click="download"><DownloadIcon data-icon="inline-start" />{{ $t('Download') }}</Button>
        </div>
      </div>
      <pre class="scrollbar-visible max-h-120 overflow-auto rounded-lg border bg-muted p-4 font-mono text-xs leading-relaxed"><code>{{ code }}</code></pre>
    </CollapsibleContent>
  </Collapsible>
</template>

<script setup>
// Source code with a copy button (the example's own .vue file).
import { ref } from 'vue';
import { CheckIcon, CopyIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
const props = defineProps({ code: { type: String, required: true } });
const copied = ref(false);
async function copy() {
    try {
        await navigator.clipboard.writeText(props.code);
        copied.value = true;
        setTimeout(() => (copied.value = false), 1500);
    } catch {}
}
</script>

<template>
  <div class="relative">
    <pre class="max-h-[32rem] overflow-auto rounded-lg border bg-muted p-4 font-mono text-sm leading-6"><code>{{ code }}</code></pre>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="icon-sm" class="absolute top-2 right-2" :aria-label="copied ? 'Copied' : 'Copy code'" @click="copy">
          <CheckIcon v-if="copied" /><CopyIcon v-else />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{{ copied ? 'Copied' : 'Copy code' }}</TooltipContent>
    </Tooltip>
  </div>
</template>

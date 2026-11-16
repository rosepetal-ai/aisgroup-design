<!-- A long action: the progress goes in its slot, and with background the only button is Continue, which leaves it running. The app closes the dialog and shows the progress elsewhere. -->
<script setup>
import { computed, ref } from 'vue';
import ConfirmDialog from '@aisgroup/design/blocks/ConfirmDialog.vue';
import { Button } from '@aisgroup/design/ui/button';
import { Progress } from '@aisgroup/design/ui/progress';
import { Spinner } from '@aisgroup/design/ui/spinner';

const TOTAL = 40;
const open = ref(true);
const done = ref(0);
const percent = computed(() => (done.value * 100) / TOTAL);

const action = () => new Promise((resolve) => {
  done.value = 0;
  const timer = setInterval(() => {
    done.value += 1;
    if (done.value === TOTAL) {
      clearInterval(timer);
      resolve();
    }
  }, 150);
});
</script>

<template>
  <Button variant="outline" @click="open = true">Delete 40 images</Button>
  <ConfirmDialog
    v-if="open"
    title="Delete images"
    confirm-label="Delete"
    loading-label="Deleting..."
    background
    :action="action"
    @close="open = false"
    @done="open = false"
    @background="open = false"
  >
    <p class="text-sm">40 images will be deleted. This cannot be undone.</p>
    <template #progress>
      <div class="flex flex-col gap-2">
        <p class="flex items-center gap-2 text-sm"><Spinner class="size-4 shrink-0 text-primary" />Deleting...</p>
        <Progress :model-value="percent" class="h-2" aria-label="Deleting" />
        <p class="text-xs text-muted-foreground tabular-nums">{{ done }} / {{ TOTAL }} images</p>
      </div>
    </template>
  </ConfirmDialog>
</template>

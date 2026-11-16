<!-- The app gives the texts and the action. While it runs the dialog cannot be closed; if it fails, it shows the error and offers Retry. -->
<script setup>
import { ref } from 'vue';
import ConfirmDialog from '@rosepetal/design/blocks/ConfirmDialog.vue';
import { Button } from '@rosepetal/design/ui/button';

const open = ref(true);
const fail = ref(false);
const wait = () => new Promise((resolve, reject) => setTimeout(() => (fail.value ? reject(new Error('The server did not answer')) : resolve()), 1200));
const start = (failing) => { fail.value = failing; open.value = true; };
</script>

<template>
  <div class="flex gap-2">
    <Button variant="outline" @click="start(false)">Delete model</Button>
    <Button variant="outline" @click="start(true)">Delete model, failing</Button>
    <ConfirmDialog
      v-if="open"
      title="Delete model"
      confirm-label="Delete"
      loading-label="Deleting..."
      error-title="The model could not be deleted"
      :action="wait"
      @close="open = false"
      @done="open = false"
    >
      <p class="text-sm">m-inspection-03 and its results will be deleted. This cannot be undone.</p>
    </ConfirmDialog>
  </div>
</template>

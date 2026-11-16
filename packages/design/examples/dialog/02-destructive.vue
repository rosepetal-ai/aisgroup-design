<!-- The layout of a delete. To really run one, with its loading and error states, use the ConfirmDialog block. -->
<script setup>
import { ref } from 'vue';
import { Button } from '@aisgroup/design/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@aisgroup/design/ui/dialog';
const open = ref(true);
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child><Button variant="destructive">Delete model</Button></DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Delete model</DialogTitle>
        <DialogDescription class="sr-only">Delete m-inspection-03.</DialogDescription>
      </DialogHeader>
      <DialogBody><p>m-inspection-03 and its results will be deleted. This cannot be undone.</p></DialogBody>
      <DialogFooter>
        <Button variant="secondary" size="modal" @click="open = false">Cancel</Button>
        <Button variant="destructive" size="modal" @click="open = false">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

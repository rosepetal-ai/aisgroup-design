<!-- A question asked from code, such as a menu item or a store: useConfirm().ask() opens the confirm dialog in the ConfirmHost that App mounts once, with the app's translated labels. The action runs in the dialog, with its progress, its errors and Retry. -->
<script setup>
import ConfirmHost from '@aisgroup/design/blocks/ConfirmHost.vue';
import { useConfirm } from '@aisgroup/design/blocks/confirm.ts';
import { Button } from '@aisgroup/design/ui/button';

const confirm = useConfirm();
const wait = () => new Promise(resolve => setTimeout(resolve, 1200));
function remove() {
  confirm.ask({
    title: 'Delete model',
    message: 'm-inspection-03 and its results will be deleted. This cannot be undone.',
    confirmLabel: 'Delete',
    loadingLabel: 'Deleting...',
    action: wait,
  });
}
remove();
</script>

<template>
  <Button variant="outline" @click="remove">Delete model</Button>
  <ConfirmHost cancel-label="Cancel" error-title="Something went wrong" retry-label="Retry" />
</template>

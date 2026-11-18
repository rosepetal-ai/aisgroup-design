<script setup lang="ts">
import { computed } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'
import { pending } from './confirm'

// Where useConfirm().ask() shows its questions: one host in App, and one in a page for its own group.
// The labels are the app's translations; a question may bring its own.
const props = withDefaults(defineProps<{
  group?: string
  confirmLabel?: string
  cancelLabel?: string
  loadingLabel?: string
  errorTitle?: string
  closeLabel?: string
  retryLabel?: string
}>(), {
  confirmLabel: 'Confirm',
})

const request = computed(() => (pending.value && pending.value.group === props.group ? pending.value : null))

function cancel() {
  const current = pending.value
  pending.value = null
  current?.onCancel?.()
}

function done() {
  pending.value = null
}
</script>

<template>
  <ConfirmDialog
    v-if="request"
    :key="request.id"
    :title="request.title"
    :confirm-label="request.confirmLabel ?? confirmLabel"
    :cancel-label="request.cancelLabel ?? cancelLabel"
    :loading-label="request.loadingLabel ?? loadingLabel"
    :error-title="errorTitle"
    :close-label="closeLabel"
    :retry-label="retryLabel"
    :variant="request.variant"
    :action="request.action ?? (() => undefined)"
    @close="cancel"
    @done="done"
  >
    <p v-if="request.message" class="text-sm">{{ request.message }}</p>
  </ConfirmDialog>
</template>

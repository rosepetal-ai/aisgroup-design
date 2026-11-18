<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { ButtonVariants } from '../ui/button'
import { CircleAlertIcon } from '@lucide/vue'
import { computed, ref, useId } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Spinner } from '../ui/spinner'

const props = withDefaults(defineProps<{
  title: string
  confirmLabel: string
  action: () => unknown
  loadingLabel?: string
  errorTitle?: string
  cancelLabel?: string
  closeLabel?: string
  retryLabel?: string
  continueLabel?: string
  variant?: ButtonVariants['variant']
  confirmText?: string
  confirmPrompt?: string
  confirmPlaceholder?: string
  mismatchText?: string
  disabled?: boolean
  background?: boolean
  focusConfirm?: boolean
  contentClass?: HTMLAttributes['class']
}>(), {
  loadingLabel: 'Working...',
  errorTitle: 'Something went wrong',
  cancelLabel: 'Cancel',
  closeLabel: 'Close',
  retryLabel: 'Retry',
  continueLabel: 'Continue',
  variant: 'destructive',
  confirmText: '',
  confirmPrompt: '',
  confirmPlaceholder: '',
  mismatchText: '',
  contentClass: '',
})
const emit = defineEmits<{ close: [], done: [result: unknown], background: [] }>()
// Its root, the Dialog, renders nothing: attributes (a test id) go on the visible dialog.
defineOptions({ inheritAttrs: false })

const uid = useId()
const typed = ref('')
const confirmButton = ref<InstanceType<typeof Button> | null>(null)
const loading = ref(false)
const error = ref('')

const needsTyping = computed(() => !!props.confirmText)
const matches = computed(() => !needsTyping.value || typed.value === props.confirmText)
const mismatch = computed(() => needsTyping.value && typed.value.length > 0 && !matches.value)
const canBackground = computed(() => loading.value && props.background)

function focusConfirmButton(event: Event) {
  if (!props.focusConfirm)
    return
  event.preventDefault()
  confirmButton.value?.$el?.focus()
}

function close() {
  if (!loading.value)
    emit('close')
  else if (props.background)
    emit('background')
}

async function confirm() {
  if (!matches.value || loading.value || props.disabled)
    return
  error.value = ''
  loading.value = true
  try {
    const result = await props.action()
    loading.value = false
    emit('done', result)
  }
  catch (err) {
    error.value = (err as Error)?.message || String(err || '')
    loading.value = false
  }
}
</script>

<template>
  <Dialog :open="true" @update:open="o => !o && close()">
    <DialogContent v-bind="$attrs" :class="contentClass" :show-close-button="!loading || canBackground" @open-auto-focus="focusConfirmButton" @escape-key-down="e => loading && !canBackground && e.preventDefault()" @pointer-down-outside="e => loading && !canBackground && e.preventDefault()">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription class="sr-only">{{ confirmText ? `${title}: ${confirmText}` : title }}</DialogDescription>
      </DialogHeader>

      <DialogBody>
        <slot />

        <Field v-if="needsTyping" :data-invalid="mismatch || undefined" :data-disabled="loading || undefined">
          <div class="flex flex-col items-start gap-1">
            <FieldLabel :for="`${uid}-confirm`" class="font-normal">{{ confirmPrompt }}</FieldLabel>
            <code class="rounded bg-muted px-1.5 py-0.5 font-semibold select-all">{{ confirmText }}</code>
          </div>
          <Input
            :id="`${uid}-confirm`"
            v-model="typed"
            :placeholder="confirmPlaceholder"
            :aria-invalid="mismatch || undefined"
            :disabled="loading"
            autocomplete="off"
            @keydown.enter="confirm"
          />
          <FieldError v-if="mismatch" class="text-sm">{{ mismatchText }}</FieldError>
        </Field>

        <slot v-if="loading" name="progress" />

        <Alert v-if="error" variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>{{ errorTitle }}</AlertTitle>
          <AlertDescription class="wrap-break-word">{{ error }}</AlertDescription>
        </Alert>
      </DialogBody>

      <DialogFooter>
        <Button v-if="canBackground" size="modal" @click="close">{{ continueLabel }}</Button>
        <template v-else>
          <Button variant="secondary" size="modal" :disabled="loading" @click="close">{{ error ? closeLabel : cancelLabel }}</Button>
          <Button ref="confirmButton" :variant="variant" size="modal" :disabled="!matches || loading || disabled" @click="confirm">
            <Spinner v-if="loading" data-icon="inline-start" />
            <template v-if="loading">{{ loadingLabel }}</template>
            <template v-else-if="error">{{ retryLabel }}</template>
            <template v-else>{{ confirmLabel }}</template>
          </Button>
        </template>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

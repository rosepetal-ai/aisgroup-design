<!-- A form that saves: it validates, cannot be closed while saving, and shows the error with Retry. The first save fails here, to show it. -->
<script setup>
import { CircleAlertIcon } from '@lucide/vue';
import { computed, ref, useId } from 'vue';
import { Alert, AlertDescription, AlertTitle } from '@aisgroup/design/ui/alert';
import { Button } from '@aisgroup/design/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@aisgroup/design/ui/dialog';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@aisgroup/design/ui/field';
import { Input } from '@aisgroup/design/ui/input';
import { Spinner } from '@aisgroup/design/ui/spinner';
import { Textarea } from '@aisgroup/design/ui/textarea';

const uid = useId();
const open = ref(true);
const name = ref('tapones_linea_3');
const description = ref('');
const loading = ref(false);
const error = ref('');
let attempts = 0;

const nameError = computed(() => (/^\w{1,32}$/.test(name.value) ? '' : 'Only letters, numbers and underscores'));

function start() {
  attempts = 0;
  error.value = '';
  open.value = true;
}

function close() {
  if (!loading.value) open.value = false;
}

async function save() {
  if (loading.value || nameError.value) return;
  loading.value = true;
  error.value = '';
  try {
    await new Promise((resolve, reject) => setTimeout(() => (attempts++ ? resolve() : reject(new Error('The server did not answer'))), 1000));
    loading.value = false;
    open.value = false;
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
}
</script>

<template>
  <Button variant="outline" @click="start">Edit dataset</Button>
  <Dialog :open="open" @update:open="o => !o && close()">
    <DialogContent :show-close-button="!loading">
      <DialogHeader>
        <DialogTitle>Edit dataset</DialogTitle>
        <DialogDescription class="sr-only">Name and description of the dataset</DialogDescription>
      </DialogHeader>
      <DialogBody>
        <FieldGroup class="gap-5">
          <Field :data-invalid="!!nameError || undefined" :data-disabled="loading || undefined">
            <FieldLabel :for="`${uid}-name`">Name</FieldLabel>
            <Input :id="`${uid}-name`" v-model="name" :disabled="loading" :aria-invalid="!!nameError || undefined" />
            <FieldError v-if="nameError" class="text-xs">{{ nameError }}</FieldError>
            <FieldDescription v-else class="text-xs">Up to 32 letters, numbers and underscores.</FieldDescription>
          </Field>
          <Field :data-disabled="loading || undefined">
            <FieldLabel :for="`${uid}-desc`">Description</FieldLabel>
            <Textarea :id="`${uid}-desc`" v-model="description" :disabled="loading" placeholder="What is this dataset for?" />
          </Field>
        </FieldGroup>

        <Alert v-if="error" variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>The dataset could not be saved</AlertTitle>
          <AlertDescription class="wrap-break-word">{{ error }}</AlertDescription>
        </Alert>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" size="modal" :disabled="loading" @click="close">Cancel</Button>
        <Button size="modal" :disabled="loading || !!nameError" @click="save">
          <Spinner v-if="loading" data-icon="inline-start" />
          {{ loading ? 'Saving...' : error ? 'Retry' : 'Save' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<!-- The header band holds the title; the footer, Cancel then the action, full width. A form submits from the footer. -->
<script setup>
import { ref } from 'vue';
import { Button } from '@rosepetal/design/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@rosepetal/design/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@rosepetal/design/ui/field';
import { Input } from '@rosepetal/design/ui/input';
const open = ref(true);
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child><Button variant="outline">Edit dataset</Button></DialogTrigger>
    <DialogContent class="sm:max-w-md" @open-auto-focus="event => { event.preventDefault(); event.target?.focus(); }" tabindex="-1">
      <DialogHeader>
        <DialogTitle>Edit dataset</DialogTitle>
        <DialogDescription class="sr-only">Change the name and description of the dataset.</DialogDescription>
      </DialogHeader>
      <DialogBody>
        <form id="edit-dataset" @submit.prevent="open = false">
          <FieldGroup>
            <Field><FieldLabel for="dl-name">Name</FieldLabel><Input id="dl-name" model-value="PCB inspection" /></Field>
            <Field><FieldLabel for="dl-desc">Description</FieldLabel><Input id="dl-desc" model-value="Top-side AOI after reflow" /></Field>
          </FieldGroup>
        </form>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" size="modal" @click="open = false">Cancel</Button>
        <Button size="modal" type="submit" form="edit-dataset">Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

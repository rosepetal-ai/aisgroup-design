<!-- A label beside every checkbox; a group of options as a field set. -->
<script setup>
import { Checkbox } from '@aisgroup/design/ui/checkbox';
import { Field, FieldLabel } from '@aisgroup/design/ui/field';
</script>

<template>
  <div class="flex flex-col gap-3">
    <Field orientation="horizontal"><Checkbox id="cb-1" :model-value="true" /><FieldLabel for="cb-1">Include unlabelled images</FieldLabel></Field>
    <Field orientation="horizontal"><Checkbox id="cb-2" /><FieldLabel for="cb-2">Only images with comments</FieldLabel></Field>
    <Field orientation="horizontal" data-disabled><Checkbox id="cb-3" disabled /><FieldLabel for="cb-3">Archived images</FieldLabel></Field>
  </div>
</template>

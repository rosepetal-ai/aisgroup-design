<!-- A setting on or off. Rows with a description use a switch row (see Field). -->
<script setup>
import { ref } from 'vue';
import { Field, FieldLabel } from '@aisgroup/design/ui/field';
import { Switch } from '@aisgroup/design/ui/switch';
const on = ref(true);
</script>

<template>
  <div class="flex flex-col gap-3">
    <Field orientation="horizontal"><Switch id="sw-1" v-model="on" /><FieldLabel for="sw-1">Legend</FieldLabel></Field>
    <Field orientation="horizontal" data-disabled><Switch id="sw-2" disabled /><FieldLabel for="sw-2">Stats</FieldLabel></Field>
  </div>
</template>

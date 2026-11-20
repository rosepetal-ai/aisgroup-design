<!-- Several options from a list, shown as tags: type to search, click or Enter to add. -->
<script setup>
import { ref } from 'vue';
import { Field, FieldLabel } from '@aisgroup/design/ui/field';
import { MultiSelect } from '@aisgroup/design/ui/multi-select';
const datasets = ['PCB inspection', 'Tortilla line', 'Blister packaging', 'Label packaging', 'Expiry dates', 'Cable harness'].map((d) => ({ value: d.toLowerCase().replace(/ /g, '-'), label: d }));
const chosen = ref(['pcb-inspection', 'cable-harness']);
</script>

<template>
  <Field class="w-full max-w-sm">
    <FieldLabel for="ms-datasets">Datasets</FieldLabel>
    <MultiSelect id="ms-datasets" v-model="chosen" :options="datasets" placeholder="Select datasets" />
  </Field>
</template>

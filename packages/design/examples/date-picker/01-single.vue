<!-- An outline button with the date written in the locale; the calendar opens under it and closes on a pick. -->
<script setup>
import { ref } from 'vue';
import { DatePicker } from '@aisgroup/design/ui/date-picker';
import { Field, FieldLabel } from '@aisgroup/design/ui/field';
const date = ref();
</script>

<template>
  <Field class="w-auto">
    <FieldLabel for="dp-delivery">Delivery date</FieldLabel>
    <DatePicker id="dp-delivery" v-model="date" />
  </Field>
</template>

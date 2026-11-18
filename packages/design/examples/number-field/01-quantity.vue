<!-- A whole number in a range, with minus and plus buttons; arrow keys and the wheel step it too. -->
<script setup>
import { ref } from 'vue';
import { Field, FieldLabel } from '@aisgroup/design/ui/field';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@aisgroup/design/ui/number-field';
const batch = ref(16);
</script>

<template>
  <Field class="w-full max-w-48">
    <FieldLabel for="nf-batch">Images per batch</FieldLabel>
    <NumberField id="nf-batch" v-model="batch" :min="1" :max="64">
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </Field>
</template>

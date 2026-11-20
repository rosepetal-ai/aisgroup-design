<!-- The format comes from the locale: a percentage, and a price in euros written the Spanish way. -->
<script setup>
import { ref } from 'vue';
import { Field, FieldGroup, FieldLabel } from '@aisgroup/design/ui/field';
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@aisgroup/design/ui/number-field';
const threshold = ref(0.85);
const price = ref(1250);
</script>

<template>
  <FieldGroup class="w-full max-w-48">
    <Field>
      <FieldLabel for="nf-threshold">Confidence threshold</FieldLabel>
      <NumberField id="nf-threshold" v-model="threshold" :min="0" :max="1" :step="0.05" :format-options="{ style: 'percent' }" locale="en-GB">
        <NumberFieldContent><NumberFieldDecrement /><NumberFieldInput /><NumberFieldIncrement /></NumberFieldContent>
      </NumberField>
    </Field>
    <Field>
      <FieldLabel for="nf-price">Unit price</FieldLabel>
      <NumberField id="nf-price" v-model="price" :min="0" :step="10" :format-options="{ style: 'currency', currency: 'EUR' }" locale="es-ES">
        <NumberFieldContent><NumberFieldDecrement /><NumberFieldInput /><NumberFieldIncrement /></NumberFieldContent>
      </NumberField>
    </Field>
  </FieldGroup>
</template>

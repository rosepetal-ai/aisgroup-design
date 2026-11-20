<!-- A short code, one digit per box: typing moves to the next box and a paste fills them all. -->
<script setup>
import { ref } from 'vue';
import { Field, FieldLabel } from '@aisgroup/design/ui/field';
import { PinInput, PinInputGroup, PinInputSlot } from '@aisgroup/design/ui/pin-input';
const code = ref([]);
</script>

<template>
  <Field class="w-auto">
    <FieldLabel for="pin-code">Verification code</FieldLabel>
    <PinInput id="pin-code" v-model="code" type="number">
      <PinInputGroup>
        <PinInputSlot v-for="(n, i) in 6" :key="n" :index="i" />
      </PinInputGroup>
    </PinInput>
  </Field>
</template>

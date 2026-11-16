<!-- A value in a range, with the value in words. -->
<script setup>
import { ref } from 'vue';
import { Field, FieldLabel } from '@rosepetal/design/ui/field';
import { Slider } from '@rosepetal/design/ui/slider';
const v = ref([24]);
</script>

<template>
  <Field class="w-full max-w-sm">
    <FieldLabel>Brush size, {{ v[0] }} px</FieldLabel>
    <Slider v-model="v" :min="2" :max="80" />
  </Field>
</template>

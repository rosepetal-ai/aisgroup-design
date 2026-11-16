<!-- A choice between modes, as choice cards. -->
<script setup>
import { ref } from 'vue';
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from '@rosepetal/design/ui/field';
import { RadioGroup, RadioGroupItem } from '@rosepetal/design/ui/radio-group';
const mode = ref('supervised');
</script>

<template>
  <RadioGroup v-model="mode" class="w-full max-w-md">
    <FieldLabel for="rg-1">
      <Field orientation="horizontal">
        <FieldContent><FieldTitle>Supervised</FieldTitle><FieldDescription>Learns from the tags you labelled.</FieldDescription></FieldContent>
        <RadioGroupItem id="rg-1" value="supervised" />
      </Field>
    </FieldLabel>
    <FieldLabel for="rg-2">
      <Field orientation="horizontal">
        <FieldContent><FieldTitle>Unsupervised</FieldTitle><FieldDescription>Learns what a good product looks like.</FieldDescription></FieldContent>
        <RadioGroupItem id="rg-2" value="unsupervised" />
      </Field>
    </FieldLabel>
  </RadioGroup>
</template>

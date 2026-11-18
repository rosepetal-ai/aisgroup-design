<!-- Free values as tags: Enter adds one, Backspace or the cross removes it. -->
<script setup>
import { ref } from 'vue';
import { Field, FieldLabel } from '@aisgroup/design/ui/field';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@aisgroup/design/ui/tags-input';
const keywords = ref(['Scratch', 'Dent']);
</script>

<template>
  <Field class="w-full max-w-sm">
    <FieldLabel for="ti-keywords">Defect keywords</FieldLabel>
    <TagsInput v-model="keywords">
      <TagsInputItem v-for="k in keywords" :key="k" :value="k"><TagsInputItemText /><TagsInputItemDelete /></TagsInputItem>
      <TagsInputInput id="ti-keywords" placeholder="Add a keyword" />
    </TagsInput>
  </Field>
</template>

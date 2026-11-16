<!-- A short list of options. -->
<script setup>
import { ref } from 'vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@rosepetal/design/ui/select';
const size = ref('small');
</script>

<template>
  <Select v-model="size">
    <SelectTrigger class="w-56" aria-label="Model size"><SelectValue /></SelectTrigger>
    <SelectContent>
      <SelectItem value="nano">Nano</SelectItem>
      <SelectItem value="small">Small</SelectItem>
      <SelectItem value="medium">Medium</SelectItem>
      <SelectItem value="large">Large</SelectItem>
    </SelectContent>
  </Select>
</template>

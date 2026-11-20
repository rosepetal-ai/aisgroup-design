<!-- A searchable listbox: type to filter the groups, arrows to move, Enter to choose; the chosen value is checked. -->
<script setup>
import { ref } from 'vue';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@aisgroup/design/ui/command';
const value = ref('m-inspection-02');
</script>

<template>
  <Command v-model="value" class="max-w-sm border">
    <CommandInput placeholder="Search models" />
    <CommandList>
      <CommandEmpty>No model matches.</CommandEmpty>
      <CommandGroup heading="PCB inspection">
        <CommandItem value="m-inspection-01">m-inspection-01</CommandItem>
        <CommandItem value="m-inspection-02">m-inspection-02</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Tortilla line">
        <CommandItem value="m-food-01">m-food-01</CommandItem>
        <CommandItem value="m-food-02">m-food-02</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>

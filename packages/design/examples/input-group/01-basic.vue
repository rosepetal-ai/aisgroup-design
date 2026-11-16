<!-- Icons, text or buttons inside the field. -->
<script setup>
import { SearchIcon, XIcon } from '@lucide/vue';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@rosepetal/design/ui/input-group';
</script>

<template>
  <div class="flex w-72 flex-col gap-3">
    <InputGroup>
      <InputGroupAddon><SearchIcon /></InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end"><InputGroupButton size="icon-xs" aria-label="Clear"><XIcon /></InputGroupButton></InputGroupAddon>
    </InputGroup>
    <InputGroup>
      <InputGroupInput type="number" model-value="640" />
      <InputGroupAddon align="inline-end"><InputGroupText>px</InputGroupText></InputGroupAddon>
    </InputGroup>
  </div>
</template>

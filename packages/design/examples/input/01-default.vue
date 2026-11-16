<!-- Text, number and search; a search has its icon as an addon. -->
<script setup>
import { SearchIcon } from '@lucide/vue';
import { Input } from '@rosepetal/design/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@rosepetal/design/ui/input-group';
</script>

<template>
  <div class="grid w-full max-w-sm gap-4">
    <Input placeholder="Dataset name" aria-label="Dataset name" />
    <Input type="number" model-value="640" aria-label="Width" />
    <InputGroup>
      <InputGroupAddon><SearchIcon /></InputGroupAddon>
      <InputGroupInput placeholder="Search images" aria-label="Search images" />
    </InputGroup>
    <Input disabled model-value="rosepetal-preview" aria-label="Project" />
  </div>
</template>

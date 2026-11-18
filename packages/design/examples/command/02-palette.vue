<!-- A command palette in a dialog, opened by its button or Ctrl K (Cmd K on a Mac): search, then run with Enter. -->
<script setup>
import { ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { DatabaseIcon, PlusIcon, SearchIcon, SettingsIcon, BoxIcon } from '@lucide/vue';
import { Button } from '@aisgroup/design/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@aisgroup/design/ui/command';
import { Kbd } from '@aisgroup/design/ui/kbd';
const open = ref(false);
useEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); open.value = !open.value; }
});
</script>

<template>
  <Button variant="outline" class="w-64 justify-start text-muted-foreground" @click="open = true">
    <SearchIcon data-icon="inline-start" />Search<Kbd class="ml-auto">Ctrl K</Kbd>
  </Button>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="Type a command or search" />
    <CommandList>
      <CommandEmpty>No results.</CommandEmpty>
      <CommandGroup heading="Create">
        <CommandItem value="new-dataset" @select="open = false"><PlusIcon />New dataset</CommandItem>
        <CommandItem value="new-model" @select="open = false"><PlusIcon />New model</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Go to">
        <CommandItem value="datasets" @select="open = false"><DatabaseIcon />Datasets</CommandItem>
        <CommandItem value="models" @select="open = false"><BoxIcon />Models</CommandItem>
        <CommandItem value="settings" @select="open = false"><SettingsIcon />Settings</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>

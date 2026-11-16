<!-- A section that opens and closes. -->
<script setup>
import { ChevronDownIcon } from '@lucide/vue';
import { Button } from '@rosepetal/design/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@rosepetal/design/ui/collapsible';
</script>

<template>
  <Collapsible class="flex w-72 flex-col gap-2">
    <CollapsibleTrigger as-child>
      <Button variant="outline" class="justify-between">Details<ChevronDownIcon data-icon="inline-end" /></Button>
    </CollapsibleTrigger>
    <CollapsibleContent class="rounded-md border p-3 text-sm text-muted-foreground">More about this item.</CollapsibleContent>
  </Collapsible>
</template>

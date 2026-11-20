<!-- A record's details beside the list it came from. Content wider than a filter list takes a larger size; sm stays the default. -->
<script setup>
import { Button } from '@aisgroup/design/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@aisgroup/design/ui/sheet';
import { StatusLabel } from '@aisgroup/design/ui/status-label';
const facts = [['Dataset', 'PCB inspection'], ['Images', '4,210'], ['Accuracy', '97.4%'], ['Started', '06/10/2026 09:12'], ['Finished', '06/10/2026 13:48'], ['Created by', 'Laura Vidal']];
</script>

<template>
  <Sheet>
    <SheetTrigger as-child><Button variant="outline">Open details</Button></SheetTrigger>
    <SheetContent size="lg">
      <SheetHeader>
        <SheetTitle>m-inspection-01</SheetTitle>
        <SheetDescription class="sr-only">The model's details.</SheetDescription>
      </SheetHeader>
      <div class="flex flex-1 flex-col gap-6 overflow-y-auto px-4">
        <StatusLabel tone="success">Finished</StatusLabel>
        <dl class="grid grid-cols-2 gap-x-6 gap-y-4">
          <div v-for="[label, value] in facts" :key="label" class="flex flex-col gap-1">
            <dt class="text-muted-foreground">{{ label }}</dt>
            <dd class="tabular-nums">{{ value }}</dd>
          </div>
        </dl>
      </div>
    </SheetContent>
  </Sheet>
</template>

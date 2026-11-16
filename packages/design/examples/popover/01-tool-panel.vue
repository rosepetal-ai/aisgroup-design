<!-- A panel anchored to its tool, with stock parts inside. -->
<script setup>
import { SlidersHorizontalIcon } from '@lucide/vue';
import { Button } from '@rosepetal/design/ui/button';
import { Field, FieldLabel } from '@rosepetal/design/ui/field';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@rosepetal/design/ui/popover';
import { Slider } from '@rosepetal/design/ui/slider';
</script>

<template>
  <Popover>
    <PopoverTrigger as-child><Button variant="outline"><SlidersHorizontalIcon data-icon="inline-start" />View options</Button></PopoverTrigger>
    <PopoverContent class="w-72">
      <PopoverHeader>
        <PopoverTitle>View options</PopoverTitle>
        <PopoverDescription>How the canvas shows the image.</PopoverDescription>
      </PopoverHeader>
      <Field class="mt-4"><FieldLabel>Brightness</FieldLabel><Slider :default-value="[50]" :max="100" /></Field>
    </PopoverContent>
  </Popover>
</template>

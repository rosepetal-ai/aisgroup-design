<!-- A side panel over the page, for filters or details on small screens. The header names it; the description is for screen readers. -->
<script setup>
import { FilterIcon } from '@lucide/vue';
import { Button } from '@rosepetal/design/ui/button';
import { Checkbox } from '@rosepetal/design/ui/checkbox';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@rosepetal/design/ui/field';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@rosepetal/design/ui/sheet';
</script>

<template>
  <Sheet>
    <SheetTrigger as-child><Button variant="outline"><FilterIcon data-icon="inline-start" />Filters</Button></SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription class="sr-only">Show only the images you need.</SheetDescription>
      </SheetHeader>
      <div class="flex-1 overflow-y-auto px-4">
        <FieldSet class="gap-3">
          <FieldLegend variant="label">State</FieldLegend>
          <FieldGroup class="gap-3">
            <Field orientation="horizontal"><Checkbox id="sheet-labeled" :model-value="true" /><FieldLabel for="sheet-labeled" class="font-normal">Labelled</FieldLabel></Field>
            <Field orientation="horizontal"><Checkbox id="sheet-unlabeled" /><FieldLabel for="sheet-unlabeled" class="font-normal">Not labelled</FieldLabel></Field>
            <Field orientation="horizontal"><Checkbox id="sheet-reviewed" /><FieldLabel for="sheet-reviewed" class="font-normal">Reviewed</FieldLabel></Field>
          </FieldGroup>
        </FieldSet>
      </div>
      <SheetFooter class="flex-row *:flex-1">
        <SheetClose as-child><Button variant="secondary" size="modal">Cancel</Button></SheetClose>
        <Button size="modal">Apply</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<!-- Settings as switch rows: several share one bordered list. -->
<script setup>
import { Field, FieldContent, FieldDescription, FieldLabel } from '@rosepetal/design/ui/field';
import { Switch } from '@rosepetal/design/ui/switch';
</script>

<template>
  <div class="w-full max-w-xl divide-y rounded-lg border">
    <Field orientation="horizontal" class="p-4">
      <FieldContent><FieldLabel for="s-1">Sync with the controller</FieldLabel><FieldDescription>New images upload as they are captured.</FieldDescription></FieldContent>
      <Switch id="s-1" :model-value="true" />
    </Field>
    <Field orientation="horizontal" class="p-4">
      <FieldContent><FieldLabel for="s-2">Sign out when idle</FieldLabel><FieldDescription>After 5 minutes without activity.</FieldDescription></FieldContent>
      <Switch id="s-2" />
    </Field>
  </div>
</template>

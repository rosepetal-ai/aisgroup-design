<!-- Label above the control, description under it, the error replacing it once touched. Units go in an addon. -->
<script setup>
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@aisgroup/design/ui/field';
import { Input } from '@aisgroup/design/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@aisgroup/design/ui/input-group';
</script>

<template>
  <FieldGroup class="w-full max-w-sm">
    <Field>
      <FieldLabel for="f-name">Format name</FieldLabel>
      <Input id="f-name" model-value="Demo bottle" />
      <FieldDescription>Shown in the Profiler gallery.</FieldDescription>
    </Field>
    <Field data-invalid>
      <FieldLabel for="f-diam">Diameter</FieldLabel>
      <InputGroup>
        <InputGroupInput id="f-diam" model-value="0" aria-invalid="true" />
        <InputGroupAddon align="inline-end">mm</InputGroupAddon>
      </InputGroup>
      <FieldError>Enter a diameter above 0 mm.</FieldError>
    </Field>
  </FieldGroup>
</template>

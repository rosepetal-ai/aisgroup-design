<!-- Longer text, with a label above. -->
<script setup>
import { Field, FieldLabel } from '@rosepetal/design/ui/field';
import { Textarea } from '@rosepetal/design/ui/textarea';
</script>

<template>
  <Field class="w-full max-w-sm"><FieldLabel for="ta">Comment</FieldLabel><Textarea id="ta" placeholder="What is wrong with this image?" /></Field>
</template>

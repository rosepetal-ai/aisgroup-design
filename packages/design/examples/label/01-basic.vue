<!-- The name of a field, tied to it with for. -->
<script setup>
import { Input } from '@aisgroup/design/ui/input';
import { Label } from '@aisgroup/design/ui/label';
</script>

<template>
  <div class="flex w-64 flex-col gap-2">
    <Label for="label-email">Email</Label>
    <Input id="label-email" type="email" placeholder="name@company.com" />
  </div>
</template>

<!-- In dialogs: Cancel first as secondary, the action second, both modal size. -->
<script setup>
import { Button } from '@rosepetal/design/ui/button';
</script>

<template>
  <div class="flex w-full max-w-md gap-3">
    <Button variant="secondary" size="modal" class="flex-1">Cancel</Button>
    <Button size="modal" class="flex-1">Save</Button>
  </div>
</template>

<!-- Six variants: default for the primary action, outline for secondary actions and toolbars, ghost for icon and row actions, secondary for Cancel in dialogs, destructive for deletes, and link. -->
<script setup>
import { Button } from '@rosepetal/design/ui/button';
</script>

<template>
  <Button>Save</Button>
  <Button variant="outline">Export</Button>
  <Button variant="ghost">Details</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="destructive">Delete</Button>
  <Button variant="link">Open guide</Button>
</template>

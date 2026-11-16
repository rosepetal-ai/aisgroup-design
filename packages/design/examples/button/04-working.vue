<!-- The button that is working shows a spinner and is disabled until it ends. -->
<script setup>
import { Button } from '@aisgroup/design/ui/button';
import { Spinner } from '@aisgroup/design/ui/spinner';
</script>

<template>
  <Button disabled><Spinner data-icon="inline-start" />Saving</Button>
  <Button variant="outline" disabled>Disabled</Button>
</template>

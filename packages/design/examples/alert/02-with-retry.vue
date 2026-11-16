<!-- A failed section says what failed and offers Retry, which repeats the same request. -->
<script setup>
import { CircleXIcon, RotateCwIcon } from '@lucide/vue';
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@aisgroup/design/ui/alert';
import { Button } from '@aisgroup/design/ui/button';
</script>

<template>
  <Alert variant="destructive" class="max-w-xl">
    <CircleXIcon />
    <AlertTitle>The datasets could not load</AlertTitle>
    <AlertDescription>The connection to the workspace was lost.</AlertDescription>
    <AlertAction><Button variant="outline" size="sm"><RotateCwIcon data-icon="inline-start" />Retry</Button></AlertAction>
  </Alert>
</template>

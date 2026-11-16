<!-- Every alert sits on the card surface with the default border; only the icon and the text take the tone. -->
<script setup>
import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon } from '@lucide/vue';
import { Alert, AlertDescription, AlertTitle } from '@rosepetal/design/ui/alert';
</script>

<template>
  <div class="grid w-full max-w-xl gap-4">
    <Alert>
      <InfoIcon />
      <AlertTitle>Validate before training</AlertTitle>
      <AlertDescription>12 images have no tag yet.</AlertDescription>
    </Alert>
    <Alert variant="success">
      <CircleCheckIcon />
      <AlertTitle>Model trained</AlertTitle>
      <AlertDescription>m-inspection-04 finished in 41 minutes.</AlertDescription>
    </Alert>
    <Alert variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>46 of 50 GB used this month.</AlertDescription>
    </Alert>
    <Alert variant="destructive">
      <CircleXIcon />
      <AlertTitle>The usage could not load</AlertTitle>
      <AlertDescription>The usage service did not answer.</AlertDescription>
    </Alert>
  </div>
</template>

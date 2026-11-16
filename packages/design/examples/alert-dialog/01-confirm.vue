<!-- Asks before something that cannot be undone. -->
<script setup>
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@rosepetal/design/ui/alert-dialog';
import { Button } from '@rosepetal/design/ui/button';
</script>

<template>
  <AlertDialog :default-open="true">
    <AlertDialogTrigger as-child><Button variant="outline">Delete dataset</Button></AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete this dataset?</AlertDialogTitle>
        <AlertDialogDescription>Its images and annotations are removed. This cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

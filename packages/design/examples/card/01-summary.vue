<!-- A summary with its primary action, like the dataset Overview. Cards are never boxes around sections. -->
<script setup>
import { Button } from '@aisgroup/design/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@aisgroup/design/ui/card';
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Training readiness</CardTitle>
      <CardDescription>PCB inspection</CardDescription>
    </CardHeader>
    <CardContent>
      <dl class="grid grid-cols-2 gap-4">
        <div><dt class="text-muted-foreground">Labelled</dt><dd>1,236 of 1,248</dd></div>
        <div><dt class="text-muted-foreground">Tags</dt><dd>3</dd></div>
      </dl>
    </CardContent>
    <CardFooter><Button class="w-full">New model</Button></CardFooter>
  </Card>
</template>

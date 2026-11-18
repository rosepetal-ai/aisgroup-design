<!-- A page under the top bar: the page width, its title, its actions and its sections. The app's content area scrolls. -->
<script setup>
import { PlusIcon } from '@lucide/vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Button } from '@aisgroup/design/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@aisgroup/design/ui/card';
</script>

<template>
  <div class="h-120 overflow-y-auto bg-page text-foreground">
    <PageLayout title="Datasets" description="Images and labels of this project">
      <template #actions>
        <Button><PlusIcon data-icon="inline-start" />New dataset</Button>
      </template>
      <div class="grid gap-4 xl:grid-cols-2">
        <Card class="shadow-none">
          <CardHeader><CardTitle>Storage</CardTitle><CardDescription>12.4 GB of 50 GB</CardDescription></CardHeader>
          <CardContent class="text-muted-foreground">Side-by-side cards share the height of their row.</CardContent>
        </Card>
        <Card class="shadow-none">
          <CardHeader><CardTitle>Recent uploads</CardTitle></CardHeader>
          <CardContent class="text-muted-foreground">3 uploads today</CardContent>
        </Card>
      </div>
    </PageLayout>
  </div>
</template>

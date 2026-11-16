<!-- Views of the same thing. Our apps use the line variant everywhere: page tabs, dataset tabs and the editor side panel. -->
<script setup>
import { Badge } from '@aisgroup/design/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@aisgroup/design/ui/tabs';
</script>

<template>
  <div class="flex w-full max-w-xl flex-col gap-8">
    <Tabs default-value="active">
      <TabsList variant="line">
        <TabsTrigger value="active">Active datasets<Badge variant="secondary" class="tabular-nums">12</Badge></TabsTrigger>
        <TabsTrigger value="archived">Archived datasets<Badge variant="secondary" class="tabular-nums">3</Badge></TabsTrigger>
      </TabsList>
      <TabsContent value="active" class="pt-2 text-muted-foreground">12 datasets.</TabsContent>
      <TabsContent value="archived" class="pt-2 text-muted-foreground">3 archived datasets.</TabsContent>
    </Tabs>
    <Tabs default-value="labels">
      <TabsList variant="line"><TabsTrigger value="labels">Labels</TabsTrigger><TabsTrigger value="data">Image data</TabsTrigger><TabsTrigger value="comments">Comments</TabsTrigger></TabsList>
    </Tabs>
  </div>
</template>

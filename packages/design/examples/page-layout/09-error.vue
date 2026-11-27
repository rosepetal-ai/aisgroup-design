<!-- The page could not load: the Empty fills the content, says what failed and offers Retry, which repeats the same request. A section that fails inside a loaded page is an Alert with Retry in its place. -->
<script setup>
import { CircleXIcon, PlusIcon, RotateCwIcon } from '@lucide/vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Button } from '@aisgroup/design/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@aisgroup/design/ui/empty';
</script>

<template>
  <div class="min-h-120 w-full bg-page text-foreground">
    <PageLayout title="Users">
      <template #actions>
        <Button disabled><PlusIcon data-icon="inline-start" />Invite user</Button>
      </template>
      <Empty class="min-h-80 bg-card">
        <EmptyHeader>
          <EmptyMedia variant="error"><CircleXIcon /></EmptyMedia>
          <EmptyTitle>The users could not load</EmptyTitle>
          <EmptyDescription>The server did not answer.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button variant="outline"><RotateCwIcon data-icon="inline-start" />Retry</Button></EmptyContent>
      </Empty>
    </PageLayout>
  </div>
</template>

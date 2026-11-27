<!-- Nothing to list yet: the Empty takes the place the list would fill, says why and offers the way out. The header stays as on the full page. -->
<script setup>
import { PlusIcon } from '@lucide/vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Button } from '@aisgroup/design/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@aisgroup/design/ui/empty';
</script>

<template>
  <div class="min-h-120 w-full bg-page text-foreground">
    <PageLayout title="Users">
      <template #actions>
        <Button><PlusIcon data-icon="inline-start" />Invite user</Button>
      </template>
      <Empty class="min-h-80 bg-card">
        <EmptyHeader>
          <EmptyTitle>No users yet</EmptyTitle>
          <EmptyDescription>Invite the people who work in this workspace.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button variant="outline"><PlusIcon data-icon="inline-start" />Invite user</Button></EmptyContent>
      </Empty>
    </PageLayout>
  </div>
</template>

<!-- A page the person may not see: the title stays, the Empty fills the content with the reason and who can help. Never a short dashed line with the page blank below. -->
<script setup>
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@aisgroup/design/ui/empty';
</script>

<template>
  <div class="min-h-120 w-full bg-page text-foreground">
    <PageLayout title="Licence renewals">
      <Empty class="min-h-80 bg-card">
        <EmptyHeader>
          <EmptyTitle>You don’t have access to this page</EmptyTitle>
          <EmptyDescription>Ask an administrator for the renewals permission.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PageLayout>
  </div>
</template>

<!-- The state of what the page shows beside its title (#status), and its facts as a line under it (#description) when they are more than plain text. -->
<script setup>
import { ExternalLinkIcon } from '@lucide/vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Button } from '@aisgroup/design/ui/button';
import { StatusLabel } from '@aisgroup/design/ui/status-label';
</script>

<template>
  <div class="h-60 overflow-y-auto bg-page text-foreground">
    <PageLayout title="line-3-inspection">
      <template #status>
        <StatusLabel tone="success">Online</StatusLabel>
      </template>
      <template #description>
        <span><span class="font-medium text-foreground">Pro</span> plan</span>
        <span>Expires in <span class="font-medium text-foreground tabular-nums">44</span> days</span>
        <span class="font-mono">rp-line-3</span>
      </template>
      <template #actions>
        <Button variant="outline">Open in Rosepetal<ExternalLinkIcon data-icon="inline-end" /></Button>
      </template>
    </PageLayout>
  </div>
</template>

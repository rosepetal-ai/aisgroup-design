<!-- The history of an object, newest first: each event has its marker, title, details and time. -->
<script setup>
import { CircleCheckIcon, PlayIcon, PlusIcon, UploadIcon } from '@lucide/vue';
import { ItemDescription, ItemTitle } from '@aisgroup/design/ui/item';
import { Timeline, TimelineItem } from '@aisgroup/design/ui/timeline';
const events = [
  { title: 'Deployed to Line 2', text: 'Replaces m-inspection-01.', time: '07/10/2026 16:40', icon: UploadIcon },
  { title: 'Training finished', text: 'Accuracy 97.4% on the test images.', time: '07/10/2026 14:05', icon: CircleCheckIcon, tone: 'text-success' },
  { title: 'Training started', text: '4,210 images, 120 epochs.', time: '07/10/2026 09:12', icon: PlayIcon },
  { title: 'Model created', text: 'From the PCB inspection dataset.', time: '06/10/2026 18:30', icon: PlusIcon },
];
</script>

<template>
  <Timeline class="max-w-md">
    <TimelineItem v-for="e in events" :key="e.title">
      <template #marker><component :is="e.icon" :class="e.tone" /></template>
      <ItemTitle>{{ e.title }}</ItemTitle>
      <ItemDescription>{{ e.text }}</ItemDescription>
      <time class="text-muted-foreground tabular-nums">{{ e.time }}</time>
    </TimelineItem>
  </Timeline>
</template>

<!-- The figures of an overview: one block per group that belongs together, each starting its own row. -->
<script setup>
import FigureCards from '@aisgroup/design/blocks/FigureCards.vue';

const account = [
  { id: 'balance', label: 'Your balance', value: '120 petals' },
  { id: 'available', label: 'Available', value: '90 petals' },
  { id: 'committed', label: 'Committed', value: '30 petals' },
  { id: 'pending', label: 'Pending requests', value: 2 },
];
const requests = [
  { id: 'gifts', label: 'Pending gifts', value: 3 },
  { id: 'challenges', label: 'Pending challenges', value: 1 },
  { id: 'stuck', label: 'Waiting over a week', value: 2 },
  { id: 'approved', label: 'Approved (7 days)', value: 5, detail: '+400 earned, −150 redeemed' },
];
</script>

<template>
  <div class="flex w-full flex-col gap-4 bg-page p-6 text-foreground">
    <FigureCards :figures="account" />
    <FigureCards :figures="requests" />
  </div>
</template>

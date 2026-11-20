<!-- A start and an end date across two months; the days between take the soft fill. -->
<script setup>
import { ref } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import { RangeCalendar } from '@aisgroup/design/ui/range-calendar';
const start = today(getLocalTimeZone());
const range = ref({ start, end: start.add({ days: 9 }) });
</script>

<template>
  <RangeCalendar v-model="range" locale="en-GB" :number-of-months="2" class="rounded-lg border" />
</template>

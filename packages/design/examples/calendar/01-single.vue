<!-- One month to pick a date. Today is marked; weeks start on the locale's first day. -->
<script setup>
import { ref } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import { Calendar } from '@aisgroup/design/ui/calendar';
const date = ref(today(getLocalTimeZone()));
</script>

<template>
  <Calendar v-model="date" locale="en-GB" class="rounded-lg border" />
</template>

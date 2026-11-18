<!-- A period, as a filter above a table: both ends in one button, two months side by side. -->
<script setup>
import { ref } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import { DateRangePicker } from '@aisgroup/design/ui/date-picker';
const end = today(getLocalTimeZone());
const period = ref({ start: end.subtract({ days: 6 }), end });
</script>

<template>
  <DateRangePicker v-model="period" />
</template>

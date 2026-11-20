<!-- The locale sets the language, the date format and the first day of the week. -->
<script setup>
import { ref } from 'vue';
import { getLocalTimeZone, today } from '@internationalized/date';
import { DatePicker } from '@aisgroup/design/ui/date-picker';
const date = ref(today(getLocalTimeZone()));
</script>

<template>
  <DatePicker v-model="date" locale="es-ES" placeholder="Elige una fecha" :format-options="{ dateStyle: 'long' }" />
</template>

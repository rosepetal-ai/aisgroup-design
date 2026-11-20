<script setup lang="ts">
import type { DateValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon } from '@lucide/vue'
import { computed, ref } from 'vue'
import { cn } from '../../lib/utils'
import { Button } from '../button'
import { Calendar } from '../calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

// One date: an outline button with the date written in the locale, and the calendar in a popover that closes on a pick.
const props = withDefaults(defineProps<{
  id?: string
  locale?: string
  placeholder?: string
  formatOptions?: Intl.DateTimeFormatOptions
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}>(), {
  locale: 'en-GB',
  placeholder: 'Pick a date',
  formatOptions: () => ({ dateStyle: 'medium' }),
})

const value = defineModel<DateValue | undefined>()
const open = ref(false)
const formatter = computed(() => new DateFormatter(props.locale, props.formatOptions))

function pick(date: DateValue | DateValue[] | undefined) {
  value.value = Array.isArray(date) ? date[0] : date
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        data-slot="date-picker"
        :id="id"
        variant="outline"
        :disabled="disabled"
        :class="cn('w-60 justify-start font-normal', !value && 'text-muted-foreground', props.class)"
      >
        <CalendarIcon data-icon="inline-start" />
        {{ value ? formatter.format(value.toDate(getLocalTimeZone())) : placeholder }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        :model-value="value"
        :locale="locale"
        :min-value="minValue"
        :max-value="maxValue"
        :is-date-unavailable="isDateUnavailable"
        initial-focus
        @update:model-value="pick"
      />
    </PopoverContent>
  </Popover>
</template>

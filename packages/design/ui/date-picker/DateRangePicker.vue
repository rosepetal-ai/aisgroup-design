<script setup lang="ts">
import type { DateRange, DateValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { CalendarIcon } from '@lucide/vue'
import { computed, ref } from 'vue'
import { cn } from '../../lib/utils'
import { Button } from '../button'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { RangeCalendar } from '../range-calendar'

// A date range: the button writes both ends in the locale; two months side by side; it closes once both ends are set.
const props = withDefaults(defineProps<{
  id?: string
  locale?: string
  placeholder?: string
  formatOptions?: Intl.DateTimeFormatOptions
  numberOfMonths?: number
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}>(), {
  locale: 'en-GB',
  placeholder: 'Pick a date range',
  formatOptions: () => ({ dateStyle: 'medium' }),
  numberOfMonths: 2,
})

const value = defineModel<DateRange | undefined>()
const open = ref(false)
const formatter = computed(() => new DateFormatter(props.locale, props.formatOptions))
const label = computed(() => {
  const { start, end } = value.value ?? {}
  if (!start)
    return props.placeholder
  const zone = getLocalTimeZone()
  return end ? formatter.value.formatRange(start.toDate(zone), end.toDate(zone)) : formatter.value.format(start.toDate(zone))
})

function pick(range: DateRange) {
  value.value = range
  if (range.start && range.end)
    open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        data-slot="date-range-picker"
        :id="id"
        variant="outline"
        :disabled="disabled"
        :class="cn('w-72 justify-start font-normal', !value?.start && 'text-muted-foreground', props.class)"
      >
        <CalendarIcon data-icon="inline-start" />
        {{ label }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <RangeCalendar
        :model-value="value"
        :locale="locale"
        :number-of-months="numberOfMonths"
        :min-value="minValue"
        :max-value="maxValue"
        :is-date-unavailable="isDateUnavailable"
        initial-focus
        @update:model-value="pick"
      />
    </PopoverContent>
  </Popover>
</template>

<script lang="ts" setup>
import type { CalendarRootEmits, CalendarRootProps, DateValue } from 'reka-ui'
import type { HTMLAttributes, Ref } from 'vue'
import { getLocalTimeZone, today } from '@internationalized/date'
import { reactiveOmit, useVModel } from '@vueuse/core'
import { cn } from '../../lib/utils'
import { CalendarRoot, useForwardPropsEmits } from 'reka-ui'
import { CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNextButton, CalendarPrevButton } from '.'

// Rosepetal: no month and year dropdown layout (stock builds it on a native select); the heading slot takes any control.
const props = withDefaults(defineProps<CalendarRootProps & { class?: HTMLAttributes['class'] }>(), {
  modelValue: undefined,
})
const emits = defineEmits<CalendarRootEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'placeholder')

const placeholder = useVModel(props, 'placeholder', emits, {
  passive: true,
  defaultValue: props.defaultPlaceholder ?? today(getLocalTimeZone()),
}) as Ref<DateValue>

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <CalendarRoot
    v-slot="{ grid, weekDays, date }"
    v-bind="forwarded"
    v-model:placeholder="placeholder"
    data-slot="calendar"
    :class="cn('p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)] group/calendar bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent', props.class)"
  >
    <CalendarHeader class="pt-0">
      <slot name="calendar-heading" :date="date">
        <CalendarHeading />
      </slot>

      <nav class="pointer-events-none flex items-center gap-1 absolute top-0 inset-x-0 justify-between">
        <CalendarPrevButton>
          <slot name="calendar-prev-icon" />
        </CalendarPrevButton>
        <CalendarNextButton>
          <slot name="calendar-next-icon" />
        </CalendarNextButton>
      </nav>
    </CalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell
              v-for="day in weekDays" :key="day"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>

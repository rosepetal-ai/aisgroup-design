<script setup lang="ts">
import type { TabsTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TabsTrigger, useForwardProps } from 'reka-ui'
import { cn } from '../../lib/utils'

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    :class="cn(
      'gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg:not([class*=size-])]:size-4 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/15 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0',
      'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent',
      'data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground',
      'after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-1.25 group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
      // nav: rows of a view's section menu (Settings), Rosepetal style
      'group-data-[variant=nav]/tabs-list:h-auto group-data-[variant=nav]/tabs-list:flex-none group-data-[variant=nav]/tabs-list:gap-2 group-data-[variant=nav]/tabs-list:rounded-none group-data-[variant=nav]/tabs-list:border-0 group-data-[variant=nav]/tabs-list:px-5 group-data-[variant=nav]/tabs-list:py-4 group-data-[variant=nav]/tabs-list:font-normal group-data-[variant=nav]/tabs-list:text-foreground group-data-[variant=nav]/tabs-list:hover:bg-muted/60 group-data-[variant=nav]/tabs-list:after:hidden group-data-[variant=nav]/tabs-list:data-active:bg-muted group-data-[variant=nav]/tabs-list:data-active:font-medium group-data-[variant=nav]/tabs-list:data-active:text-brand dark:group-data-[variant=nav]/tabs-list:data-active:border-transparent dark:group-data-[variant=nav]/tabs-list:data-active:bg-muted dark:group-data-[variant=nav]/tabs-list:data-active:text-foreground group-data-[variant=nav]/tabs-list:[&_svg:not([class*=size-])]:size-5 lg:group-data-[variant=nav]/tabs-list:border-t max-lg:group-data-[variant=nav]/tabs-list:w-auto max-lg:group-data-[variant=nav]/tabs-list:px-4',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </TabsTrigger>
</template>

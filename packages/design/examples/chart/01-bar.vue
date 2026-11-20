<!-- Columns for a few discrete periods: one series in the first chart colour, square ends, at most 24 px wide; the title names it, so no legend. Hover shows the value. -->
<script setup>
import { VisAxis, VisStackedBar, VisXYContainer } from '@unovis/vue';
import { ChartContainer, ChartCrosshair, ChartTooltip, ChartTooltipContent, componentToString } from '@aisgroup/design/ui/chart';
const data = [{ day: 'Mon', rejected: 42 }, { day: 'Tue', rejected: 38 }, { day: 'Wed', rejected: 51 }, { day: 'Thu', rejected: 29 }, { day: 'Fri', rejected: 47 }, { day: 'Sat', rejected: 18 }];
const config = { rejected: { label: 'Rejected parts', color: 'var(--chart-1)' } };
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-4">
    <div class="flex flex-col gap-1">
      <p class="font-medium">Rejected parts per day</p>
      <p class="text-muted-foreground">Line 2, last week</p>
    </div>
    <ChartContainer :config="config" class="aspect-[2/1]">
      <VisXYContainer :data="data" :padding="{ top: 8 }">
        <VisStackedBar :x="(d, i) => i" :y="(d) => d.rejected" :color="config.rejected.color" :rounded-corners="0" :bar-max-width="24" />
        <VisAxis type="x" :x="(d, i) => i" :tick-format="(i) => data[i]?.day" :tick-values="data.map((d, i) => i)" :tick-line="false" :domain-line="false" :grid-line="false" />
        <VisAxis type="y" :num-ticks="3" :tick-line="false" :domain-line="false" />
        <ChartTooltip />
        <ChartCrosshair :template="componentToString(config, ChartTooltipContent, { labelFormatter: (i) => data[i]?.day })" color="#0000" />
      </VisXYContainer>
    </ChartContainer>
  </div>
</template>

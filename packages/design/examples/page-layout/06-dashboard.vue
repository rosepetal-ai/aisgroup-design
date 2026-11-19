<!-- A dashboard: the figures first in Figure cards, then one Card per subject with its real content, side by side and as tall as their row. -->
<script setup>
import { VisAxis, VisStackedBar, VisXYContainer } from '@unovis/vue';
import FigureCards from '@aisgroup/design/blocks/FigureCards.vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Button } from '@aisgroup/design/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@aisgroup/design/ui/card';
import { ChartContainer, ChartCrosshair, ChartTooltip, ChartTooltipContent, componentToString } from '@aisgroup/design/ui/chart';

const figures = [{ id: 'users', label: 'Users', value: 10 }, { id: 'automations', label: 'Active automations', value: '0 of 1' }, { id: 'integrations', label: 'Integrations', value: 7 }, { id: 'actions', label: 'Actions today', value: 24 }];
const validations = [['Expense report, March', 'Jordi Ferrer', '2 days'], ['Holiday request', 'Anna Roca', '1 day'], ['New supplier', 'Marc Puig', '5 hours']];
const activity = [{ day: 'Mon', actions: 31 }, { day: 'Tue', actions: 42 }, { day: 'Wed', actions: 28 }, { day: 'Thu', actions: 37 }, { day: 'Fri', actions: 45 }, { day: 'Sat', actions: 6 }, { day: 'Sun', actions: 24 }];
const config = { actions: { label: 'Actions', color: 'var(--chart-1)' } };
</script>

<template>
  <div class="min-h-120 w-full bg-page text-foreground">
    <PageLayout title="Dashboard">
      <FigureCards :figures="figures" />
      <div class="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending validations</CardTitle>
            <CardDescription>3 waiting for you</CardDescription>
            <CardAction><Button variant="outline" size="sm">Open</Button></CardAction>
          </CardHeader>
          <CardContent>
            <ul class="divide-y">
              <li v-for="[name, by, age] in validations" :key="name" class="flex items-center justify-between gap-4 py-3">
                <span class="flex min-w-0 flex-col"><span class="truncate font-medium">{{ name }}</span><span class="text-muted-foreground">{{ by }}</span></span>
                <span class="shrink-0 text-muted-foreground tabular-nums">{{ age }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Actions per day, last week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer :config="config" class="aspect-[2/1] max-h-56 w-full">
              <VisXYContainer :data="activity" :padding="{ top: 8 }">
                <VisStackedBar :x="(d, i) => i" :y="(d) => d.actions" :color="config.actions.color" :rounded-corners="0" :bar-max-width="24" />
                <VisAxis type="x" :x="(d, i) => i" :tick-format="(i) => activity[i]?.day" :tick-values="activity.map((d, i) => i)" :tick-line="false" :domain-line="false" :grid-line="false" />
                <VisAxis type="y" :num-ticks="3" :tick-line="false" :domain-line="false" />
                <ChartTooltip />
                <ChartCrosshair :template="componentToString(config, ChartTooltipContent, { labelFormatter: (i) => activity[i]?.day })" color="transparent" />
              </VisXYContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  </div>
</template>

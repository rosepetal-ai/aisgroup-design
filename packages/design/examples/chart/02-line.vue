<!-- Change over time: 2 px lines with their area at 10%, a legend above for two series, a crosshair with every value, and the same data as a table. -->
<script setup>
import { VisArea, VisAxis, VisLine, VisXYContainer } from '@unovis/vue';
import { ChartContainer, ChartCrosshair, ChartLegendContent, ChartTooltip, ChartTooltipContent, componentToString } from '@aisgroup/design/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@aisgroup/design/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@aisgroup/design/ui/tabs';
const data = [
  { month: 'Jan', line1: 182, line2: 120 }, { month: 'Feb', line1: 196, line2: 131 }, { month: 'Mar', line1: 204, line2: 158 },
  { month: 'Apr', line1: 199, line2: 172 }, { month: 'May', line1: 221, line2: 169 }, { month: 'Jun', line1: 236, line2: 184 },
];
const config = { line1: { label: 'Line 1', color: 'var(--chart-1)' }, line2: { label: 'Line 2', color: 'var(--chart-2)' } };
const x = (d, i) => i;
const y = [(d) => d.line1, (d) => d.line2];
const colors = [config.line1.color, config.line2.color];
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-4">
    <div class="flex flex-col gap-1">
      <p class="font-medium">Parts inspected</p>
      <p class="text-muted-foreground">Thousands per month, January to June</p>
    </div>
    <Tabs default-value="chart">
      <TabsList variant="line"><TabsTrigger value="chart">Chart</TabsTrigger><TabsTrigger value="table">Table</TabsTrigger></TabsList>
      <TabsContent value="chart" class="pt-2">
        <ChartContainer :config="config" cursor class="aspect-[2/1]">
          <ChartLegendContent vertical-align="top" class="justify-start" />
          <VisXYContainer :data="data" :padding="{ top: 8 }">
            <VisArea v-for="(acc, i) in y" :key="i" :x="x" :y="acc" :color="colors[i]" :opacity="0.1" />
            <VisLine :x="x" :y="y" :color="colors" :line-width="2" />
            <VisAxis type="x" :x="x" :tick-format="(i) => data[i]?.month" :tick-values="data.map((d, i) => i)" :tick-line="false" :domain-line="false" :grid-line="false" />
            <VisAxis type="y" :num-ticks="3" :tick-line="false" :domain-line="false" />
            <ChartTooltip />
            <ChartCrosshair :template="componentToString(config, ChartTooltipContent, { labelFormatter: (i) => data[i]?.month })" :color="colors" />
          </VisXYContainer>
        </ChartContainer>
      </TabsContent>
      <TabsContent value="table" class="pt-2">
        <Table>
          <TableHeader><TableRow><TableHead>Month</TableHead><TableHead class="text-right">Line 1</TableHead><TableHead class="text-right">Line 2</TableHead></TableRow></TableHeader>
          <TableBody>
            <TableRow v-for="d in data" :key="d.month"><TableCell>{{ d.month }}</TableCell><TableCell class="text-right tabular-nums">{{ d.line1 }}</TableCell><TableCell class="text-right tabular-nums">{{ d.line2 }}</TableCell></TableRow>
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  </div>
</template>

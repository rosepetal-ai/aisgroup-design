<!-- Part of a whole, only with two or three parts: a donut in the dataset division colours, the total in the middle and a legend with each share. -->
<script setup>
import { VisDonut, VisSingleContainer } from '@unovis/vue';
import { ChartContainer, ChartLegendContent } from '@aisgroup/design/ui/chart';
const data = [{ split: 'train', images: 8680 }, { split: 'validation', images: 2480 }, { split: 'test', images: 1240 }];
const config = {
  train: { label: 'Training, 70%', color: 'var(--split-train)' },
  validation: { label: 'Validation, 20%', color: 'var(--split-validation)' },
  test: { label: 'Test, 10%', color: 'var(--split-test)' },
};
const total = data.reduce((sum, d) => sum + d.images, 0).toLocaleString('en-GB');
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-4">
    <p class="font-medium">Dataset division</p>
    <ChartContainer :config="config" class="aspect-square">
      <VisSingleContainer :data="data">
        <VisDonut :value="(d) => d.images" :color="(d) => config[d.split].color" :arc-width="24" :pad-angle="0.01" :central-label="total" central-sub-label="images" />
      </VisSingleContainer>
      <ChartLegendContent />
    </ChartContainer>
  </div>
</template>

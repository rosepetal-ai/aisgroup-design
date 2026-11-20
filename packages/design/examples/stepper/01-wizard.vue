<!-- The steps of a task in order: done steps show a check, the current one is filled; Back and Next move through them. -->
<script setup>
import { ref } from 'vue';
import { CheckIcon } from '@lucide/vue';
import { Button } from '@aisgroup/design/ui/button';
import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@aisgroup/design/ui/stepper';
const steps = ['Dataset', 'Settings', 'Review'];
const step = ref(2);
</script>

<template>
  <div class="flex w-full max-w-lg flex-col gap-8">
    <Stepper v-model="step" class="flex w-full items-start gap-2">
      <StepperItem v-for="(title, i) in steps" :key="title" v-slot="{ state }" :step="i + 1" class="relative flex w-full flex-col items-center">
        <StepperSeparator v-if="i < steps.length - 1" class="absolute top-5 right-[calc(-50%+20px)] left-[calc(50%+20px)] h-0.5 rounded-full" />
        <StepperTrigger>
          <StepperIndicator>
            <CheckIcon v-if="state === 'completed'" />
            <span v-else class="tabular-nums">{{ i + 1 }}</span>
          </StepperIndicator>
          <StepperTitle>{{ title }}</StepperTitle>
        </StepperTrigger>
      </StepperItem>
    </Stepper>
    <div class="flex justify-between gap-2">
      <Button variant="outline" :disabled="step === 1" @click="step--">Back</Button>
      <Button @click="step < steps.length && step++">{{ step === steps.length ? 'Train model' : 'Next' }}</Button>
    </div>
  </div>
</template>

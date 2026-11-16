<!-- One item at a time, with arrows. -->
<script setup>
import { Card, CardContent } from '@rosepetal/design/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@rosepetal/design/ui/carousel';
</script>

<template>
  <Carousel class="w-full max-w-xs">
    <CarouselContent>
      <CarouselItem v-for="n in 5" :key="n">
        <Card><CardContent class="flex aspect-square items-center justify-center text-4xl font-semibold">{{ n }}</CardContent></Card>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>

<script setup lang="ts">
// The explainer's control bar: the design system's PlayerBar on the shared player state. Until it is mounted it shows
// the state the server rendered (paused at 0), so hydration never disagrees with the page.
import PlayerBar from '@aisgroup/design/blocks/PlayerBar.vue';
import { onMounted, ref } from 'vue';
import { barChapters, barViews, player } from './player';

const ready = ref(false);
onMounted(() => { ready.value = true; });
</script>

<template>
  <PlayerBar
    :playing="ready && player.playing"
    :time="ready ? player.time : 0"
    :view="ready ? player.view : 'auto'"
    :speed="ready ? player.speed : 1"
    :duration="player.duration"
    :chapters="barChapters"
    :views="barViews"
    :fullscreen="!ready || player.canFull"
    :is-fullscreen="ready && player.full"
    @update:playing="(v: boolean) => (player.playing = v)"
    @update:view="(v?: string) => v && (player.view = v)"
    @update:speed="(v: number) => (player.speed = v)"
    @seek="(t: number) => player.seek(t)"
    @fullscreen="player.toggleFull()"
  />
</template>

<script setup lang="ts">
// The control bar of a piece the viewer drives (an explainer: a live animation with controls), like a video player's:
// play and pause, back and forward 5 s, the timeline with its chapters (a hairline at each, its name in a tooltip on
// hover or focus), the time, the camera views as one toggle group and full screen where the browser can; under them a
// second row with the chapters and the speeds as text buttons, so the viewer navigates by name. Narrower than the
// second row needs, the chapters and speeds move into one menu (and the views too on narrower bars); on a phone, play,
// the timeline and the menu. Space plays and pauses, the arrows seek. The piece owns the clock: it passes the time, and
// hears `seek` and the models (playing, view, speed). Chapter names are button labels: one to four words.
//
// Slot `actions` (optional): the piece's own action that is not a moment of the timeline, such as a demo with its own
// clock («How the ejector works»), as a design-system Button. It stands in the first row after the views; on bars
// under 768 px it moves to the top of the menu, where the slot gets `menu: true` and renders a DropdownMenuItem.
//
// Website form: square corners (the page sets --radius: 0), 36 px controls, a white bar with a hairline and the raised
// shadow, 56 px for one row and 100 px for two; no round buttons, no round thumb, no circled icons.
import type { HTMLAttributes } from 'vue'
import { ArrowLeft, ArrowRight, Maximize, Minimize, Pause, Play, SlidersHorizontal } from '@lucide/vue'
import { useElementSize } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { cn } from '../lib/utils'
import { Button } from '../ui/button'
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Kbd } from '../ui/kbd'
import { Slider } from '../ui/slider'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

export interface PlayerChapter { at: number, name: string }
export interface PlayerView { id: string, name: string }
export interface PlayerText {
  captions: string, controls: string, play: string, pause: string, back: string, forward: string, step: string, timeline: string,
  views: string, menu: string, speed: string, chapter: string, view: string, full: string, exitFull: string,
}

const props = withDefaults(defineProps<{
  /** Seconds the piece lasts, and the time now (both in the viewer's seconds at 1×). */
  duration: number
  time: number
  chapters?: PlayerChapter[]
  views?: PlayerView[]
  speeds?: number[]
  /** Show the full-screen button (false where the browser can't, e.g. iPhone). */
  fullscreen?: boolean
  isFullscreen?: boolean
  /** Seconds a step back or forward moves. */
  step?: number
  /** Space and the arrow keys on the whole page. */
  keys?: boolean
  text?: Partial<PlayerText>
  class?: HTMLAttributes['class']
}>(), {
  chapters: () => [],
  views: () => [],
  speeds: () => [0.25, 0.5, 1],
  fullscreen: true,
  isFullscreen: false,
  step: 5,
  keys: true,
})
const captions = defineModel<boolean>('captions',{default:undefined})
const playing = defineModel<boolean>('playing', { default: false })
const view = defineModel<string>('view')
const speed = defineModel<number>('speed', { default: 1 })
const emit = defineEmits<{ seek: [time: number], fullscreen: [] }>()

const T = computed<PlayerText>(() => ({
  captions:'Captions', controls: 'Player', play: 'Play', pause: 'Pause', back: 'Back', forward: 'Forward', step: `${props.step} s`, timeline: 'Timeline',
  views: 'Camera', menu: 'Speed and chapters', speed: 'Speed', chapter: 'Chapter', view: 'Camera', full: 'Full screen', exitFull: 'Exit full screen',
  ...props.text,
}))

const clamp = (t: number) => Math.min(props.duration, Math.max(0, t))
const seek = (t: number) => emit('seek', clamp(t))
const toggle = () => { playing.value = !playing.value }
const clock = (s: number) => { const v = Math.max(0, Math.floor(s)); return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}` }

const chapterAt = (t: number) => {
  let i = -1
  props.chapters.forEach((c, k) => { if (c.at <= t + 1e-6) i = k })
  return i
}
const current = computed(() => chapterAt(props.time))
const ticks = computed(() => props.chapters.filter(c => c.at > 0 && c.at < props.duration))

// The timeline's tooltip: the chapter under the pointer, or the current one while the thumb has focus; anchored on the
// track at that time.
const line = useTemplateRef<HTMLElement>('line')
const hover = ref<number | null>(null)
const focused = ref(false)
const tipAt = computed(() => hover.value ?? (focused.value ? props.time : null))
const tipName = computed(() => (tipAt.value == null ? '' : props.chapters[chapterAt(tipAt.value)]?.name ?? ''))
const anchor = {
  getBoundingClientRect() {
    const r = line.value?.getBoundingClientRect() ?? new DOMRect()
    const x = r.left + (r.width * (tipAt.value ?? 0)) / (props.duration || 1)
    return new DOMRect(x, r.top + r.height / 2 - 8, 0, 16)
  },
}
function onMove(e: PointerEvent) {
  const r = line.value?.getBoundingClientRect()
  if (r && r.width) hover.value = clamp(((e.clientX - r.left) / r.width) * props.duration)
}

// The views move into the menu when the bar is narrower than they need (the bar's own width, not the window's).
const bar = useTemplateRef<HTMLElement>('bar')
const { width } = useElementSize(bar)
const viewsInMenu = computed(() => props.views.length > 0 && width.value > 0 && width.value < 896)
const slots = defineSlots<{ actions?: (props: { menu: boolean }) => unknown }>()
const actionsInMenu = computed(() => (!!slots.actions || captions.value !== undefined) && width.value > 0 && width.value < 768)

function onKey(e: KeyboardEvent) {
  if (!props.keys || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
  const el = e.target instanceof HTMLElement ? e.target : null
  if (el?.closest('input, textarea, select, [contenteditable="true"], [role="menu"], [role="listbox"], [data-slot="toggle-group"]')) return
  const thumb = !!el?.closest('[data-slot="slider-thumb"]')
  if (e.key === ' ') {
    if (!thumb && el?.closest('button, a, [role="button"]')) return // the focused control's own Space
    e.preventDefault()
    toggle()
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault()
    e.stopPropagation() // the slider's own arrows would step by its 0.05 s
    seek(props.time + (e.key === 'ArrowLeft' ? -props.step : props.step))
  }
}
onMounted(() => window.addEventListener('keydown', onKey, { capture: true }))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey, { capture: true }))
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <div
      ref="bar"
      data-slot="player-bar"
      role="group"
      :aria-label="T.controls"
      :class="cn('@container flex min-w-0 flex-col gap-2 border border-border bg-card p-2.5 text-foreground shadow-[0_2px_6px_rgb(15_23_41/0.04),0_12px_24px_rgb(15_23_41/0.06)] [--radius:0px]', props.class)"
    >
      <div class="flex h-9 min-w-0 items-center gap-2">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon" :aria-label="playing ? T.pause : T.play" data-play @click="toggle">
              <Pause v-if="playing" />
              <Play v-else />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="8" class="rounded-none">
            {{ playing ? T.pause : T.play }} <Kbd>Space</Kbd>
          </TooltipContent>
        </Tooltip>

        <div class="flex items-center @max-xl:hidden">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" :aria-label="`${T.back} ${T.step}`" @click="seek(time - step)">
                <ArrowLeft /> <span data-player-label>{{ T.step }}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" :side-offset="8" class="rounded-none">
              {{ T.back }} {{ T.step }} <Kbd>←</Kbd>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" :aria-label="`${T.forward} ${T.step}`" @click="seek(time + step)">
                <span data-player-label>{{ T.step }}</span> <ArrowRight />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" :side-offset="8" class="rounded-none">
              {{ T.forward }} {{ T.step }} <Kbd>→</Kbd>
            </TooltipContent>
          </Tooltip>
        </div>

        <span class="w-11 shrink-0 text-right text-sm tabular-nums @max-xl:hidden" aria-hidden="true">{{ clock(time) }}</span>

        <Tooltip :open="tipAt != null && !!tipName">
          <TooltipTrigger as-child :reference="anchor">
            <div
              ref="line"
              class="relative mx-1 min-w-0 flex-1"
              @pointermove="onMove"
              @pointerleave="hover = null"
              @focusin="focused = true"
              @focusout="focused = false"
            >
              <span
                v-for="c in ticks"
                :key="c.at"
                aria-hidden="true"
                class="pointer-events-none absolute top-1/2 z-10 h-3 w-px -translate-y-1/2 bg-input"
                :style="{ left: `${(100 * c.at) / duration}%` }"
              />
              <Slider
                variant="timeline"
                :model-value="[time]"
                :min="0"
                :max="duration"
                :step="0.05"
                :thumb-attrs="{ 'aria-label': T.timeline, 'aria-valuetext': `${clock(time)} of ${clock(duration)}${current >= 0 ? `, ${chapters[current].name}` : ''}` }"
                @update:model-value="(v) => v && seek(v[0])"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="4" update-position-strategy="always" class="rounded-none px-2 py-1 text-xs">
            {{ tipName }}
          </TooltipContent>
        </Tooltip>

        <span class="w-11 shrink-0 text-sm tabular-nums text-muted-foreground @max-xl:hidden" aria-hidden="true">{{ clock(duration) }}</span>

        <ToggleGroup
          orientation="horizontal"
          v-if="views.length"
          type="single"
          variant="outline"
          :aria-label="T.views"
          :model-value="view"
          class="ml-2 @max-4xl:hidden"
          @update:model-value="(v) => { if (typeof v === 'string' && v) view = v }"
        >
          <ToggleGroupItem v-for="v in views" :key="v.id" :value="v.id">
            <span data-player-label>{{ v.name }}</span>
          </ToggleGroupItem>
        </ToggleGroup>

        <div v-if="(slots.actions || captions !== undefined) && !actionsInMenu" class="ml-2 flex shrink-0 items-center gap-2">
          <Button v-if="captions !== undefined" :variant="captions ? 'default' : 'outline'" :aria-pressed="captions" @click="captions = !captions"><span data-player-label>{{ T.captions }}</span></Button>
          <slot name="actions" :menu="false" />
        </div>

        <!-- The tooltip outside the whole menu: a menu trigger inside a Tooltip registers its anchor with the tooltip's
             popper, and the menu then never gets placed -->
        <Tooltip>
          <TooltipTrigger as-child>
            <span class="inline-flex @min-6xl:hidden">
              <DropdownMenu :modal="false">
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" size="icon" :aria-label="T.menu">
                    <SlidersHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" :side-offset="12" class="w-56 rounded-none" data-player-menu>
                  <template v-if="actionsInMenu">
                    <DropdownMenuCheckboxItem v-if="captions !== undefined" v-model="captions"><span data-player-label>{{ T.captions }}</span></DropdownMenuCheckboxItem>
                    <slot name="actions" :menu="true" />
                    <DropdownMenuSeparator />
                  </template>
                  <template v-if="viewsInMenu">
                    <DropdownMenuLabel>{{ T.view }}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup :model-value="view" @update:model-value="(v) => { if (typeof v === 'string') view = v }">
                      <DropdownMenuRadioItem v-for="v in views" :key="v.id" :value="v.id">
                        <span data-player-label>{{ v.name }}</span>
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSeparator />
                  </template>
                  <DropdownMenuLabel>{{ T.speed }}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup :model-value="String(speed)" @update:model-value="(v) => { speed = Number(v) }">
                    <DropdownMenuRadioItem v-for="s in speeds" :key="s" :value="String(s)">
                      <span data-player-label>{{ s }}×</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <template v-if="chapters.length">
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>{{ T.chapter }}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup :model-value="String(current)" @update:model-value="(v) => seek(chapters[Number(v)].at)">
                      <DropdownMenuRadioItem v-for="(c, i) in chapters" :key="c.at" :value="String(i)">
                        <span data-player-label>{{ c.name }}</span>
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </template>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="8" class="rounded-none">
            {{ T.menu }}
          </TooltipContent>
        </Tooltip>

        <Tooltip v-if="fullscreen">
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="@max-xl:hidden" :aria-label="isFullscreen ? T.exitFull : T.full" data-full @click="emit('fullscreen')">
              <Minimize v-if="isFullscreen" />
              <Maximize v-else />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" :side-offset="8" class="rounded-none">
            {{ isFullscreen ? T.exitFull : T.full }}
          </TooltipContent>
        </Tooltip>
      </div>

      <div class="flex min-w-0 items-center justify-between gap-6 @max-6xl:hidden">
        <ToggleGroup
          orientation="horizontal"
          v-if="chapters.length"
          type="single"
          variant="outline"
          :aria-label="T.chapter"
          :model-value="String(current)"
          class="min-w-0 overflow-x-auto"
          @update:model-value="(v) => { const i = v ? Number(v) : current; if (i >= 0) seek(chapters[i].at) }"
        >
          <ToggleGroupItem v-for="(c, i) in chapters" :key="c.at" :value="String(i)">
            <span data-player-label>{{ c.name }}</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          orientation="horizontal"
          type="single"
          variant="outline"
          :aria-label="T.speed"
          :model-value="String(speed)"
          class="ml-auto"
          @update:model-value="(v) => { if (v) speed = Number(v) }"
        >
          <ToggleGroupItem v-for="s in speeds" :key="s" :value="String(s)" class="tabular-nums">
            <span data-player-label>{{ s }}×</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  </TooltipProvider>
</template>

<style>
/* Use the same cap-height baseline for words with and without descenders. */
[data-player-label] { display: block; text-box: trim-both cap alphabetic; }
[data-player-menu] [role^="menuitem"] { min-height: 2rem; }
</style>

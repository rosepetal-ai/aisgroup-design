<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from "vue";
import PlayerBar from "../../templates/explainer/vendor/aisgroup/design/blocks/PlayerBar.vue";
import mark from "../station-kit/ais-vision-systems-blue.svg?url";
import { station } from "./scene";
import { duration, sideReject } from "./flow";
import { cycle } from "./reject-cycle.mjs";
import { AIS_IN, AIS_OUT } from "./ease";
import job from "./job.mjs";
import { renderOverlay } from "official-inspection-overlay";

const canvas = ref<HTMLCanvasElement>(),
  time = ref(0),
  speed = ref(1),
  playing = ref(false),
  view = ref("auto"),
  captions = ref(true),
  ready = ref(false),
  full = ref(false),
  error = ref("");
const chapters = [
  { at: 0, name: job.chapters[0] },
  { at: 3.32, name: job.chapters[1] },
  { at: 8.32, name: job.chapters[2] },
];
const views = [
  { id: "auto", name: "Auto" },
  { id: "wide", name: "Station" },
  { id: "reader", name: "Reader" },
];
if (sideReject) {
  chapters.push({ at: cycle.stop, name: job.chapters[3] });
  views.push({ id: "reject", name: "Pusher" });
}
let scene: Awaited<ReturnType<typeof station>>,
  frame = 0,
  last = 0;
const records = ref<ReturnType<Awaited<ReturnType<typeof station>>["draw"]>>(
  [],
);
const evidence = computed(() =>
  records.value.filter((c) => c.result && time.value - c.read < 3.7).at(-1),
);
// Use the brand renderer's own chip bounds so long article IDs retain their last character.
const verdictById = new Map(job.items.map(({ id, readable }) => {
  const markup = renderOverlay({
    width: 150,
    height: 46,
    verdict: { result: readable ? "pass" : "reject", text: readable ? "OK" : "NOK", detail: id },
  });
  const svg = new DOMParser().parseFromString(markup, "image/svg+xml").documentElement;
  const chip = svg.querySelector("rect")!;
  const width = 2 * Number(chip.getAttribute("x")) + Number(chip.getAttribute("width"));
  svg.setAttribute("viewBox", `0 0 ${width} 46`);
  svg.setAttribute("width", String(width));
  return [id, svg.outerHTML];
}));
const verdict = computed(() => verdictById.get(evidence.value?.id) ?? "");
const marks = computed(() => {
  const el = canvas.value;
  if (!el || !records.value.length) return "";
  const width = el.clientWidth,
    height = el.clientHeight;
  const items = records.value
    .filter(
      (c) =>
        c.result && c.x > 0.49 && c.left >= 16 && c.left + c.width < width - 16,
    )
    .map((c) => ({
      type: "box",
      state: c.pass ? "found" : "defect",
      x: c.left,
      y: c.top,
      w: c.width,
      h: c.height,
      label: c.label,
      value: c.result,
      chip: "below",
    }));
  return renderOverlay({ width, height, items });
});
const captionStarts = [0, 2.2, 3.32, 6.0, 8.32, 11];
if (sideReject) captionStarts.push(cycle.contact, cycle.return);
if (job.captions.length !== captionStarts.length || chapters.some(chapter => !chapter.name)) {
  throw new Error("Each physical beat needs its chapter label or caption in the job.");
}
const beat = computed(() => captionStarts.filter(at => time.value >= at).length - 1);
const caption = computed(() => job.captions[beat.value]);
const exportingFilm = new URLSearchParams(location.search).has("film");
const captionStyle = computed(() => {
  if (!playing.value && !exportingFilm) return {};
  const start = captionStarts[beat.value];
  const next = captionStarts[beat.value + 1];
  const entered = beat.value === 0 ? 1 : AIS_IN((time.value - start) / 0.5);
  const left = next === undefined ? 0 : AIS_OUT((time.value - next + 0.18) / 0.18);
  return { opacity: entered * (1 - left), transform: `translateY(${(1 - entered) * 1.481}dvh)` };
});
function draw() {
  if (scene) records.value = scene.draw(time.value, view.value);
}
function seek(t: number) {
  if (!Number.isFinite(t)) return;
  time.value = Math.max(0, Math.min(duration, t));
  draw();
}
function tick(now: number) {
  if (!playing.value) return;
  seek(time.value + ((now - last) * speed.value) / 1000);
  last = now;
  if (time.value >= duration) playing.value = false;
  else frame = requestAnimationFrame(tick);
}
watch(playing, (on) => {
  cancelAnimationFrame(frame);
  if (on) {
    if (time.value >= duration) seek(0);
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }
});
watch(view, draw);
const fs = () =>
  document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen();
onMounted(async () => {
  try {
    document.title = job.title.join(" ") + " | AIS Vision Systems";
    scene = await station(canvas.value!);
    await document.fonts.ready;
    seek(Number(new URLSearchParams(location.search).get("t") || 0));
    new ResizeObserver(draw).observe(canvas.value!);
    ready.value = true;
    document.addEventListener(
      "fullscreenchange",
      () => (full.value = !!document.fullscreenElement),
    );
    Object.assign(window, {
      __anim: { duration, seek, wall: () => time.value, time: () => time.value },
      inspectionReview: {
        inventory: scene.inventory,
        auditClearance: scene.auditClearance,
        auditReject: scene.auditReject,
        rejectFraming: scene.rejectFraming,
        geometryDetail: scene.geometryDetail,
        seek,
        records: () =>
          records.value.map(({ id, x, z, result, left, top, width, height }) => ({
            id, x, z, result, left, top, width, height,
          })),
        view: (s: string) => (view.value = s),
      },
    });
    await nextTick();
    document.querySelector("#app")?.classList.add("is-live");
  } catch (e) {
    error.value = "The inspection scene requires WebGL.";
    console.error(e);
  }
});
</script>
<template>
  <canvas
    ref="canvas"
    :aria-label="job.sceneDescription"
  />
  <img class="identity" :src="mark" alt="AIS Vision Systems" />
  <h1
    data-scene-opening
    v-if="time < 1.9"
    class="opening"
    :style="{ opacity: Math.min(1, (1.9 - time) / 0.5) }"
  >
    <template v-for="(line, index) in job.title" :key="index"><br v-if="index" />{{ line }}</template>
  </h1>
  <div class="marks" aria-hidden="true" v-html="marks"></div>
  <aside
    v-if="evidence"
    class="evidence"
    :aria-label="'Reader view of ' + evidence.label"
  >
    <img :src="evidence.image" :alt="'Code printed on ' + evidence.label" />
    <div class="verdict" v-html="verdict"></div>
  </aside>
  <footer>
    <p v-show="captions || !ready" class="phase" data-scene-caption :style="captionStyle">
      <span>{{
        error || (ready ? caption : "Loading inspection station…")
      }}</span>
    </p>
    <PlayerBar
      v-if="ready && !exportingFilm"
      v-model:captions="captions"
      v-model:playing="playing"
      v-model:speed="speed"
      v-model:view="view"
      :time="time"
      :duration="duration"
      :chapters="chapters"
      :views="views"
      :is-fullscreen="full"
      @seek="seek"
      @fullscreen="fs"
    />
  </footer>
</template>

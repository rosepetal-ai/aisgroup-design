<template>
	<canvas ref="canvas" class="pointer-events-none absolute inset-0 w-full h-full" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{ paused?: boolean }>(), { paused: false });

const GAP = 26;
const SWEEP = 12;
const REST = 1.5;
const R = 15;
const CELL = R + 3;
type Point = [number, number];
const DIRS: Point[] = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];

const canvas = ref<HTMLCanvasElement | null>(null);
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

let raf = 0;
let t = 0;
let last = 0;
let w = 0;
let h = 0;
let ro: ResizeObserver | null = null;
let motif = "";
let found: { key: string, hexes: Point[] } = { key: "", hexes: [] };

const alpha = (a: number) => motif + Math.round(Math.min(1, Math.max(0, a)) * 255).toString(16).padStart(2, "0");

const rand = (i: number, j: number) => {
	const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
	return s - Math.floor(s);
};

const hexagon = (ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
	ctx.beginPath();
	for (let i = 0; i < 6; i++) {
		const a = Math.PI / 3 * i;
		ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
	}
	ctx.closePath();
	ctx.stroke();
};

const cluster = (x: number, y: number, pass: number): Point[] => {
	const n = 1 + Math.floor(rand(x + pass, y + 0.5) ** 2 * 5);
	const cells: Point[] = [[0, 0]];
	for (let k = 1; cells.length < n && k < 4 * n; k++) {
		const [q, r] = cells[Math.floor(rand(x + k, y + pass) * cells.length)]!;
		const [dq, dr] = DIRS[Math.floor(rand(x + pass, y + k) * 6)]!;
		if (!cells.some(c => c[0] === q + dq && c[1] === r + dr)) cells.push([q + dq, r + dr]);
	}
	return cells.map(([q, r]) => [x + CELL * 1.5 * q, y + CELL * Math.sqrt(3) * (r + q / 2)]);
};

const detections = (pass: number) => {
	const key = `${pass}:${w}:${h}`;
	if (found.key === key) return found.hexes;
	const hexes: Point[] = [];
	for (let x = GAP / 2; x < w; x += GAP) {
		for (let y = GAP / 2; y < h; y += GAP) {
			if (rand(x + pass, y) <= 0.99) continue;
			const c = cluster(x, y, pass);
			if (c.every(([cx, cy]) => hexes.every(([hx, hy]) => Math.hypot(cx - hx, cy - hy) >= 2.5 * CELL))) hexes.push(...c);
		}
	}
	found = { key, hexes };
	return hexes;
};

const draw = (ctx: CanvasRenderingContext2D) => {
	const k = (t % (SWEEP + REST)) / SWEEP;
	const scanX = k <= 1 ? -40 + k * (w + 80) : -1000;
	const pass = Math.floor(t / (SWEEP + REST));

	for (let x = GAP / 2; x < w; x += GAP) {
		for (let y = GAP / 2; y < h; y += GAP) {
			const d = scanX - x;
			const lit = d >= 0 && d < 160 ? 1 - d / 160 : 0;
			ctx.fillStyle = alpha(0.12 + 0.6 * lit);
			ctx.fillRect(x - 1, y - 1, 2, 2);
		}
	}

	ctx.lineWidth = 1;
	for (const [cx, cy] of detections(pass)) {
		const e = scanX - cx;
		if (e < 0 || e >= 160) continue;
		ctx.strokeStyle = alpha(0.9 * (1 - e / 160));
		hexagon(ctx, cx, cy);
	}

	if (k <= 1) {
		const g = ctx.createLinearGradient(scanX - 60, 0, scanX, 0);
		g.addColorStop(0, alpha(0));
		g.addColorStop(1, alpha(0.12));
		ctx.fillStyle = g;
		ctx.fillRect(scanX - 60, 0, 60, h);
		ctx.fillStyle = alpha(0.45);
		ctx.fillRect(scanX, 0, 1, h);
	}
};

const running = () => !props.paused && !reduced.matches && !document.hidden;

const frame = (now: number) => {
	const ctx = canvas.value?.getContext("2d");
	if (!ctx) return;
	if (last) t += Math.min(0.1, (now - last) / 1000);
	last = now;
	ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
	ctx.clearRect(0, 0, w, h);
	draw(ctx);
	if (running()) raf = requestAnimationFrame(frame);
};

const start = () => {
	cancelAnimationFrame(raf);
	last = 0;
	raf = requestAnimationFrame(frame);
};

const resize = () => {
	const el = canvas.value;
	if (!el) return;
	const r = el.getBoundingClientRect();
	w = r.width;
	h = r.height;
	el.width = Math.round(w * devicePixelRatio);
	el.height = Math.round(h * devicePixelRatio);
	start();
};

watch(() => props.paused, start);

onMounted(() => {
	motif = getComputedStyle(canvas.value!).getPropertyValue("--brand-muted").trim();
	ro = new ResizeObserver(resize);
	ro.observe(canvas.value!);
	document.addEventListener("visibilitychange", start);
	reduced.addEventListener("change", start);
});

onBeforeUnmount(() => {
	cancelAnimationFrame(raf);
	ro?.disconnect();
	document.removeEventListener("visibilitychange", start);
	reduced.removeEventListener("change", start);
});
</script>

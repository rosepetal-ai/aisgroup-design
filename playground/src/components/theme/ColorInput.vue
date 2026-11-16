<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const props = defineProps({
	class: { type: [String, Array, Object], default: '' },
	disabled: { type: Boolean, default: false }
});
const model = defineModel({ type: String, required: true });
</script>

<template>
	<Input
		v-model="model"
		type="color"
		:disabled="disabled"
		:class="cn('h-9 w-11 shrink-0 cursor-pointer p-1', props.class)"
	/>
</template>

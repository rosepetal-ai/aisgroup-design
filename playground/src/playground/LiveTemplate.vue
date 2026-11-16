<script setup>
// Renders a Vue template string with the given components and state: the component playground shows
// the code it renders, from one source. Compiled in the browser (the playground only).
import * as Vue from 'vue';
import { compile } from '@vue/compiler-dom';
import { computed, defineComponent, h } from 'vue';

const props = defineProps({
    template: { type: String, required: true },
    components: { type: Object, default: () => ({}) },
    state: { type: Object, default: () => ({}) },
});
const view = computed(() => {
    try {
        const { code } = compile(props.template, { mode: 'function' });
        const render = new Function('Vue', code)(Vue);
        // The compiled code uses `with`, which looks up this symbol: declared, Vue's proxy does not warn about it.
        return defineComponent({ components: props.components, setup: () => ({ ...props.state, [Symbol.unscopables]: undefined }), render });
    } catch (e) {
        return defineComponent({ render: () => h('p', { class: 'text-destructive' }, String(e.message ?? e)) });
    }
});
</script>

<template>
  <component :is="view" />
</template>

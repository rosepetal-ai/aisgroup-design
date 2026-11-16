<script setup>
// A component of the app's src/components/ui, shown through its examples: each .vue file in
// packages/design/examples/<component id>/ is rendered and shown as code (its first comment is its description).
import { computed, defineAsyncComponent, ref } from 'vue';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeViewer from '@/components/layout/CodeViewer.vue';
import CodeBlock from './CodeBlock.vue';
import PageHeader from './PageHeader.vue';
import ComponentPlayground from './ComponentPlayground.vue';
import { CONTROLS } from './controls';

const props = defineProps({ page: { type: Object, required: true } });
const modules = import.meta.glob('../../../packages/design/examples/*/*.vue');
const sources = import.meta.glob('../../../packages/design/examples/*/*.vue', { query: '?raw', import: 'default', eager: true });
const UI_FILES = Object.keys(import.meta.glob('../../../packages/design/ui/*/*.{vue,ts}')).map(f => f.replace('../../../', ''));
const BLOCK_FILES = Object.keys(import.meta.glob('../../../packages/design/blocks/*.vue')).map(f => f.replace('../../../', ''));
const BLOCKS = { 'top-bar': ['TopBar', 'BrandLogo'], 'login-page': ['LoginPage', 'InspectionGrid', 'BrandLogo'], 'log-terminal': ['LogTerminal'], 'confirm-dialog': ['ConfirmDialog'] };

const examples = computed(() => Object.keys(modules)
    .filter(path => path.includes(`/examples/${props.page.id}/`))
    .sort()
    .map((path) => {
        const raw = sources[path];
        const note = /^<!--\s*([\s\S]*?)\s*-->\s*/.exec(raw);
        const name = path.split('/').pop().replace(/\.vue$/, '').replace(/^\d+-/, '').replace(/-/g, ' ');
        return {
            path,
            title: name.charAt(0).toUpperCase() + name.slice(1),
            description: note?.[1] ?? '',
            code: note ? raw.slice(note[0].length) : raw,
            component: defineAsyncComponent(modules[path]),
        };
    }));
const tabs = ref({});
const files = computed(() => (BLOCKS[props.page.id]
    ? BLOCKS[props.page.id].map(n => BLOCK_FILES.find(f => f.endsWith(`/${n}.vue`)))
    : UI_FILES.filter(f => f.split('/')[3] === props.page.id)));
</script>

<template>
  <div class="flex flex-col gap-10">
    <PageHeader :title="$t(page.title)" :description="page.description ? $t(page.description) : ''" />
    <CodeViewer :files="files" />
    <ComponentPlayground v-if="CONTROLS[page.id]" :key="page.id" :spec="CONTROLS[page.id]" />
    <section v-for="ex in examples" :key="ex.path" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <h2 class="font-heading text-lg font-medium">{{ ex.title }}</h2>
        <p v-if="ex.description" class="text-muted-foreground">{{ ex.description }}</p>
      </div>
      <Tabs :model-value="tabs[ex.path] ?? 'preview'" @update:model-value="v => (tabs[ex.path] = v)">
        <TabsList variant="line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="flex min-h-48 flex-wrap items-center justify-center gap-4 rounded-lg border bg-card p-6 sm:p-10">
            <component :is="ex.component" />
          </div>
        </TabsContent>
        <TabsContent value="code"><CodeBlock :code="ex.code" /></TabsContent>
      </Tabs>
    </section>
  </div>
</template>

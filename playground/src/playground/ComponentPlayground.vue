<script setup>
// A component's playground: every prop and variant as a control, the preview and the code it renders.
// Controls and template come from controls.js; options the app keeps for one place are grouped apart.
import { computed, reactive } from 'vue';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RotateCcwIcon } from '@lucide/vue';
import CodeBlock from './CodeBlock.vue';
import LiveTemplate from './LiveTemplate.vue';
import { COMPONENTS } from './controls';

const props = defineProps({ spec: { type: Object, required: true } });
const USAGE = {};
const APPS = {};
const usageOf = (c, value) => {
    const [tag, prop] = c.usage?.split('.') ?? [];
    return USAGE[tag]?.[prop]?.[value] ?? null;
};
const total = u => (u ? Object.values(u).reduce((a, b) => a + b, 0) : 0);
const where = u => Object.entries(u).map(([app, n]) => `${APPS[app]} ${n}`).join(', ');
// A control with usage starts on what the apps use most.
const controls = props.spec.controls().map((c) => {
    if (c.type !== 'select' || !c.usage) return c;
    const top = c.options.filter(o => !o.note).sort((a, b) => total(usageOf(c, b.value)) - total(usageOf(c, a.value)))[0];
    return total(usageOf(c, top?.value)) ? { ...c, value: top.value } : c;
});
const initial = () => Object.fromEntries(controls.map(c => [c.name, c.value]));
const values = reactive(initial());
const reset = () => Object.assign(values, initial());
const state = props.spec.state?.() ?? {};
const code = computed(() => props.spec.template(values));
const used = c => c.options.filter(o => !o.note && total(usageOf(c, o.value))).sort((a, b) => total(usageOf(c, b.value)) - total(usageOf(c, a.value)));
const stock = c => c.options.filter(o => !o.note);
const appOnly = c => c.options.filter(o => o.note);
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-6">
      <div class="flex flex-col gap-1">
        <h2 class="font-heading text-lg font-medium">Playground</h2>
        <p class="text-muted-foreground">Every option of the component. The code under the preview is what it renders.</p>
      </div>
      <Button variant="outline" @click="reset"><RotateCcwIcon data-icon="inline-start" />Reset</Button>
    </div>
    <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <Tabs default-value="preview" class="min-w-0">
        <TabsList variant="line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div class="flex min-h-64 flex-wrap items-center justify-center gap-4 rounded-lg border bg-card p-6 sm:p-10">
            <LiveTemplate :template="code" :components="COMPONENTS" :state="state" />
          </div>
        </TabsContent>
        <TabsContent value="code"><CodeBlock :code="code" /></TabsContent>
      </Tabs>
      <FieldGroup class="gap-4">
        <template v-for="c in controls" :key="c.name">
          <Field v-if="c.type === 'boolean'" orientation="horizontal">
            <FieldLabel :for="`pg-c-${c.name}`">{{ c.label }}</FieldLabel>
            <Switch :id="`pg-c-${c.name}`" v-model="values[c.name]" />
          </Field>
          <Field v-else>
            <FieldLabel :for="`pg-c-${c.name}`">{{ c.label }}</FieldLabel>
            <Select v-if="c.type === 'select'" v-model="values[c.name]">
              <SelectTrigger :id="`pg-c-${c.name}`" class="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectGroup v-if="used(c).length">
                  <SelectLabel>Used in our apps</SelectLabel>
                  <SelectItem v-for="o in used(c)" :key="o.value" :value="o.value">{{ o.value }}</SelectItem>
                </SelectGroup>
                <SelectSeparator v-if="used(c).length && stock(c).length" />
                <SelectGroup v-if="stock(c).length">
                                    <SelectItem v-for="o in stock(c)" :key="o.value" :value="o.value">{{ o.value }}</SelectItem>
                </SelectGroup>
                <template v-if="appOnly(c).length">
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Rosepetal</SelectLabel>
                    <SelectItem v-for="o in appOnly(c)" :key="o.value" :value="o.value">{{ o.value }}, {{ o.note }}</SelectItem>
                  </SelectGroup>
                </template>
              </SelectContent>
            </Select>
            <Input v-else-if="c.type === 'number'" :id="`pg-c-${c.name}`" v-model.number="values[c.name]" type="number" :min="c.min" :max="c.max" :step="c.step" />
            <Input v-else :id="`pg-c-${c.name}`" v-model="values[c.name]" />
          </Field>
        </template>
      </FieldGroup>
    </div>
  </section>
</template>

<!-- A settings page with its side menu, as PageLayout's: one section per tab, labels above the controls, switches as rows of one bordered list, Save then Cancel at the bottom left. -->
<script setup>
import { ref } from 'vue';
import { BellIcon, SlidersHorizontalIcon } from '@lucide/vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Button } from '@aisgroup/design/ui/button';
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@aisgroup/design/ui/field';
import { Input } from '@aisgroup/design/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@aisgroup/design/ui/select';
import { Switch } from '@aisgroup/design/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@aisgroup/design/ui/tabs';

const tab = ref('general');
</script>

<template>
  <div class="h-120 w-full overflow-y-auto bg-page text-foreground">
    <Tabs v-model="tab" orientation="vertical" class="h-full">
      <PageLayout title="Settings">
        <template #nav>
          <TabsList variant="nav" class="max-lg:flex-row! max-lg:overflow-x-auto">
            <TabsTrigger value="general"><SlidersHorizontalIcon />General</TabsTrigger>
            <TabsTrigger value="notifications"><BellIcon />Notifications</TabsTrigger>
          </TabsList>
        </template>
        <TabsContent value="general">
          <form class="flex max-w-sm flex-col gap-6" @submit.prevent>
            <h2 class="font-heading text-lg font-medium">Workspace</h2>
            <FieldGroup>
              <Field>
                <FieldLabel for="s-name">Name</FieldLabel>
                <Input id="s-name" model-value="Line 2" class="bg-card" />
              </Field>
              <Field>
                <FieldLabel for="s-zone">Time zone</FieldLabel>
                <Select model-value="madrid">
                  <SelectTrigger id="s-zone" class="w-full bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="madrid">Europe/Madrid</SelectItem>
                    <SelectItem value="london">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <div class="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline">Cancel</Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="notifications">
          <section class="flex max-w-sm flex-col gap-4">
            <h2 class="font-heading text-lg font-medium">Email</h2>
            <div class="divide-y rounded-lg border bg-card">
              <Field orientation="horizontal" class="p-4">
                <FieldContent><FieldLabel for="s-mail">When a validation waits</FieldLabel><FieldDescription>One email a day at most.</FieldDescription></FieldContent>
                <Switch id="s-mail" :model-value="true" />
              </Field>
              <Field orientation="horizontal" class="p-4">
                <FieldContent><FieldLabel for="s-fail">When an automation fails</FieldLabel></FieldContent>
                <Switch id="s-fail" />
              </Field>
            </div>
          </section>
        </TabsContent>
      </PageLayout>
    </Tabs>
  </div>
</template>

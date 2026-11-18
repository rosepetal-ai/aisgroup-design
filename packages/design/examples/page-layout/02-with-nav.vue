<!-- With a side menu, as Settings: the title and the menu stay, only the content scrolls; below 1024 px the menu is a row above it. -->
<script setup>
import { KeyRoundIcon, RefreshCwIcon, UsersIcon } from '@lucide/vue';
import { ref } from 'vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@aisgroup/design/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@aisgroup/design/ui/tabs';

const tab = ref('users');
const tabs = [
  { id: 'users', name: 'Users', icon: UsersIcon },
  { id: 'access', name: 'Access', icon: KeyRoundIcon },
  { id: 'sync', name: 'Synchronization', icon: RefreshCwIcon },
];
</script>

<template>
  <div class="h-120 overflow-y-auto bg-page text-foreground">
    <Tabs v-model="tab" orientation="vertical" class="h-full">
      <PageLayout title="Settings" description="Users, access and synchronization of this project">
        <template #nav>
          <TabsList variant="nav" class="max-lg:flex-row! max-lg:overflow-x-auto">
            <TabsTrigger v-for="item in tabs" :key="item.id" :value="item.id"><component :is="item.icon" />{{ item.name }}</TabsTrigger>
          </TabsList>
        </template>
        <TabsContent v-for="item in tabs" :key="item.id" :value="item.id" class="flex flex-col gap-4">
          <Card v-for="n in 4" :key="n" class="shadow-none">
            <CardHeader><CardTitle>{{ item.name }} {{ n }}</CardTitle></CardHeader>
            <CardContent class="h-24 text-muted-foreground">Only this column scrolls.</CardContent>
          </Card>
        </TabsContent>
      </PageLayout>
    </Tabs>
  </div>
</template>

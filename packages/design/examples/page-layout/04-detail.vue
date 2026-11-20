<!-- A detail page: the person's name as the title, then sections separated by space. Facts are a label-over-value grid, lists are divided rows, the side column holds the access summary. -->
<script setup>
import { CircleCheckIcon, CircleXIcon, ClockIcon, EllipsisIcon, PencilIcon, UserXIcon } from '@lucide/vue';
import PageLayout from '@aisgroup/design/blocks/PageLayout.vue';
import { Button } from '@aisgroup/design/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@aisgroup/design/ui/dropdown-menu';

const details = [['Email', 'laura.vidal@example.com'], ['Phone', '+34 600 123 456'], ['Department', 'Quality'], ['Manager', 'Marc Puig'], ['Location', 'Barcelona'], ['Started', '3 March 2025']];
const access = [['Role', 'Owner'], ['Last sign-in', 'Today, 08:12'], ['Two-step sign-in', 'On']];
const trainings = [
  { name: 'Machine safety', date: '12 May 2026', status: 'Valid', icon: CircleCheckIcon, tone: 'text-success' },
  { name: 'Forklift licence', date: '2 December 2026', status: 'Expires soon', icon: ClockIcon, tone: 'text-warning' },
  { name: 'First aid', date: '15 January 2026', status: 'Expired', icon: CircleXIcon, tone: 'text-destructive' },
];
</script>

<template>
  <div class="min-h-120 w-full bg-page text-foreground">
    <PageLayout title="Laura Vidal" description="Quality engineer">
      <template #actions>
        <Button variant="outline"><PencilIcon data-icon="inline-start" />Edit</Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child><Button variant="outline" size="icon" aria-label="More actions"><EllipsisIcon /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive"><UserXIcon />Deactivate</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div class="flex flex-col gap-10">
          <section class="flex flex-col gap-4">
            <h2 class="font-heading text-lg font-medium">Details</h2>
            <dl class="grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
              <div v-for="[label, value] in details" :key="label" class="min-w-0"><dt class="text-muted-foreground">{{ label }}</dt><dd class="break-words">{{ value }}</dd></div>
            </dl>
          </section>
          <section class="flex flex-col gap-4">
            <div class="flex items-center justify-between gap-6">
              <div class="flex flex-col gap-1">
                <h2 class="font-heading text-lg font-medium">Trainings</h2>
                <p class="text-muted-foreground">1 expired</p>
              </div>
              <Button variant="outline">Add training</Button>
            </div>
            <ul class="divide-y border-y">
              <li v-for="t in trainings" :key="t.name" class="flex items-center justify-between gap-4 py-3">
                <span class="font-medium">{{ t.name }}</span>
                <span class="flex items-center gap-4 text-muted-foreground">
                  <span class="tabular-nums max-sm:hidden">{{ t.date }}</span>
                  <span class="flex w-32 items-center gap-1.5"><component :is="t.icon" class="size-4" :class="t.tone" />{{ t.status }}</span>
                </span>
              </li>
            </ul>
          </section>
        </div>
        <section class="flex flex-col gap-4">
          <h2 class="font-heading text-lg font-medium">Access</h2>
          <dl class="flex flex-col gap-4">
            <div v-for="[label, value] in access" :key="label"><dt class="text-muted-foreground">{{ label }}</dt><dd>{{ value }}</dd></div>
          </dl>
        </section>
      </div>
    </PageLayout>
  </div>
</template>

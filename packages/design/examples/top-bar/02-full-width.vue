<!-- Edge to edge, for full-screen work like Labeling or the Editor: a separator after the logo, a breadcrumb instead of the menu, and the way out. -->
<script setup>
import { LogOutIcon, MoonIcon } from '@lucide/vue';
import TopBar from '@aisgroup/design/blocks/TopBar.vue';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@aisgroup/design/ui/breadcrumb';
import { Button } from '@aisgroup/design/ui/button';
</script>

<template>
  <div class="w-full">
    <TopBar full>
      <Breadcrumb class="min-w-0">
        <BreadcrumbList class="flex-nowrap text-topbar-muted">
          <BreadcrumbItem><BreadcrumbLink as-child class="hover:text-topbar-foreground"><button type="button">Datasets</button></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink as-child class="hover:text-topbar-foreground"><button type="button">Tapones línea 3</button></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage class="truncate text-topbar-foreground">img-1.jpg</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <template #actions>
        <Button variant="topbar" size="icon-round" aria-label="Dark mode"><MoonIcon /></Button>
        <Button variant="topbar-tab"><LogOutIcon data-icon="inline-start" />Exit</Button>
      </template>
    </TopBar>
  </div>
</template>

<!-- A side menu: one group per section, a label and its links. -->
<script setup>
import { BoxIcon, HomeIcon, SettingsIcon } from '@lucide/vue';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@aisgroup/design/ui/sidebar';
const items = [{ name: 'Dashboard', icon: HomeIcon }, { name: 'Datasets', icon: BoxIcon }, { name: 'Settings', icon: SettingsIcon }];
</script>

<template>
  <SidebarProvider class="min-h-64 w-full overflow-hidden rounded-md border">
    <Sidebar collapsible="none">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="(item, i) in items" :key="item.name">
                <SidebarMenuButton :is-active="i === 0"><component :is="item.icon" />{{ item.name }}</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <SidebarInset class="p-4 text-sm text-muted-foreground">Page content</SidebarInset>
  </SidebarProvider>
</template>

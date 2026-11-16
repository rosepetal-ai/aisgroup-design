<script setup lang="ts">
// The playground's menu: the groups of data/menu.ts, with a search over the names of their pages.
import { BookOpenIcon, PaletteIcon, SearchIcon } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import RosepetalRing from '@/components/brand/RosepetalRing.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { MENU, PAGES, PRESET_PAGE } from '@/data/menu'

const GUIDE_URL = import.meta.env.VITE_GUIDE_URL || 'http://localhost:4321'

const current = defineModel<string>({ required: true })
const { t } = useI18n()

const query = ref('')

const label = (id: string) => t(PAGES[id]!.item.name)
const groups = computed(() => {
  const text = query.value.trim().toLowerCase()
  return MENU
    .map(g => ({ ...g, pages: g.pages.filter(id => label(id).toLowerCase().includes(text)) }))
    .filter(g => g.pages.length)
})
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" class="pointer-events-none">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <RosepetalRing class="size-7!" />
            </div>
            <span class="font-medium">RP Playground</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton as-child size="sm" class="text-muted-foreground">
            <a :href="GUIDE_URL" target="_blank" rel="noopener"><BookOpenIcon /><span>{{ $t('Brand guide') }}</span></a>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton size="sm" class="text-muted-foreground" :is-active="current === PRESET_PAGE" @click="current = PRESET_PAGE">
            <PaletteIcon />
            <span>{{ $t('Preset') }}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <div class="relative">
        <SearchIcon class="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
        <SidebarInput id="sidebar-search" v-model="query" :placeholder="$t('Search')" class="pl-8" />
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-for="g in groups" :key="g.id">
        <SidebarGroupLabel>{{ $t(g.name) }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="id in g.pages" :key="id">
              <SidebarMenuButton :is-active="current === id" @click="current = id">
                <component :is="PAGES[id]!.icon" />
                <span>{{ label(id) }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>

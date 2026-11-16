<script setup lang="ts">
// The playground itself: the sidebar menu, the header (breadcrumb, device, language, theme) and the
// page picked in the menu. Loaded on demand by App.vue, so a device preview (embed) never loads it.
import { MoonIcon, SunIcon } from '@lucide/vue'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LocaleToggle from '@/components/layout/LocaleToggle.vue'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from '@/composables/useTheme'
import { setLocale } from '@/i18n'
import { firstPage, MENU, PAGES, PRESET_PAGE } from '@/data/menu'
// The views load on demand (each page fetches what it shows)
const AppSidebar = defineAsyncComponent(() => import('@/components/layout/AppSidebar.vue'))
const AssetsView = defineAsyncComponent(() => import('@/views/AssetsView.vue'))
const ComponentPage = defineAsyncComponent(() => import('@/playground/ComponentPage.vue'))
const IconsView = defineAsyncComponent(() => import('@/views/IconsView.vue'))
const PresetView = defineAsyncComponent(() => import('@/views/theme/PresetView.vue'))

const { isDark, toggle } = useTheme()
const { t } = useI18n()

// Inside the brand guide (?embed=1): only the page, in the guide's language.
const params = new URLSearchParams(location.search)
const embedded = params.has('embed')
const lang = params.get('lang')
if (lang === 'es' || lang === 'en')
  setLocale(lang)

// The selected page lives in the URL hash (#download-media) so it survives reloads and can be linked.
// A hash the menu doesn't know (yet: the saved layout may still be loading) is kept, and the first
// page of the menu is shown meanwhile.
const fromHash = () => location.hash.slice(1) || firstPage()
const current = ref(fromHash())
watch(current, (id) => {
  window.scrollTo({ top: 0 })
  try {
    history.replaceState(null, '', `#${id}`)
  }
  catch {} // sandboxed viewers may refuse it; the page still works without the hash
})
window.addEventListener('hashchange', () => (current.value = fromHash()))

const isPreset = computed(() => current.value === PRESET_PAGE)
const info = computed(() => PAGES[current.value] ?? PAGES[firstPage()]!)
// Breadcrumb: sidebar group › this page.
const group = computed(() => isPreset.value ? undefined : MENU.find(g => g.pages.includes(info.value.id))?.name)
const title = computed(() => t(isPreset.value ? 'Preset' : info.value.item.name))
</script>

<template>
  <SidebarProvider>
    <AppSidebar v-if="!embedded" v-model="current" />
    <SidebarInset>
      <header v-if="!embedded" class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb class="min-w-0 flex-1">
          <BreadcrumbList>
            <template v-if="group">
              <BreadcrumbItem class="hidden sm:inline-flex">{{ $t(group) }}</BreadcrumbItem>
              <BreadcrumbSeparator class="hidden sm:inline-flex" />
            </template>
            <BreadcrumbItem>
              <BreadcrumbPage class="truncate">{{ title }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <LocaleToggle />
        <Button variant="ghost" size="icon" :aria-label="$t(isDark ? 'Light mode' : 'Dark mode')" @click="toggle">
          <SunIcon v-if="isDark" />
          <MoonIcon v-else />
        </Button>
      </header>

      <main class="mx-auto w-[90%] flex-1 py-4 sm:py-6">
        <PresetView v-if="isPreset" />
        <ComponentPage v-else-if="info.kind === 'component'" :key="info.id" :page="{ id: info.id, title: info.item.name, description: info.item.description }" />
        <AssetsView v-else-if="info.id === 'view-assets'" />
        <IconsView v-else-if="info.id === 'view-icons'" />
      </main>
    </SidebarInset>
    <Toaster rich-colors />
  </SidebarProvider>
</template>

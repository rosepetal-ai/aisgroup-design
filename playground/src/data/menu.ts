// The sidebar: the package's components and blocks, in the catalog's order, and the playground's resources.
import type { Component } from 'vue'
import type { CatalogItem } from './catalog'
import { PuzzleIcon } from '@lucide/vue'
import { blockItems, componentItems, resourceItems } from './catalog'

export interface PageInfo { id: string, kind: 'component' | 'view', item: CatalogItem, icon: Component }

/** The Preset page (fonts, corners and colours of styles.css), opened from the sidebar header. */
export const PRESET_PAGE = 'preset'

export const PAGES: Record<string, PageInfo> = {}
for (const item of [...componentItems, ...blockItems])
  PAGES[item.id] = { id: item.id, kind: 'component', item, icon: PuzzleIcon }
for (const v of resourceItems)
  PAGES[v.id] = { id: v.id, kind: 'view', item: v, icon: v.icon }

export const MENU = [
  { id: 'components', name: 'Components', pages: componentItems.map(c => c.id) },
  { id: 'blocks', name: 'Blocks', pages: blockItems.map(b => b.id) },
  { id: 'resources', name: 'Resources', pages: resourceItems.map(r => r.id) },
]

export const firstPage = () => MENU[0]!.pages[0]!

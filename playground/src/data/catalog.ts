// What the sidebar lists: the package's components and blocks, and the playground's own resources.
import type { Component } from 'vue'
import type { CatalogItem } from '../../../packages/design/catalog'
import { ImagesIcon, ShapesIcon } from '@lucide/vue'

export { blockItems, componentItems } from '../../../packages/design/catalog'
export type { CatalogItem } from '../../../packages/design/catalog'

export const resourceItems: (CatalogItem & { icon: Component })[] = [
  { id: 'view-assets', name: 'Assets', ready: true, icon: ImagesIcon },
  { id: 'view-icons', name: 'Icons', ready: true, icon: ShapesIcon },
]

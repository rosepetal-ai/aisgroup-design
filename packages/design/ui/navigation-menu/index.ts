import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as NavigationMenu } from './NavigationMenu.vue'
export { default as NavigationMenuContent } from './NavigationMenuContent.vue'
export { default as NavigationMenuIndicator } from './NavigationMenuIndicator.vue'
export { default as NavigationMenuItem } from './NavigationMenuItem.vue'
export { default as NavigationMenuLink } from './NavigationMenuLink.vue'
export { default as NavigationMenuList } from './NavigationMenuList.vue'
export { default as NavigationMenuTrigger } from './NavigationMenuTrigger.vue'
export { default as NavigationMenuViewport } from './NavigationMenuViewport.vue'

export const navigationMenuTriggerStyle = cva(
  'focus-visible:ring-ring/15 rounded-md transition-all focus-visible:ring-3 focus-visible:outline-1 disabled:opacity-50 group/navigation-menu-trigger inline-flex w-max items-center justify-center outline-none disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'hover:bg-muted focus:bg-muted data-open:hover:bg-muted data-open:focus:bg-muted data-open:bg-muted/50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted h-9 px-4 py-2 text-sm font-medium',
        // Controller bar under the top bar.
        topbar: 'hover:bg-topbar-hover focus:bg-topbar-hover data-open:bg-topbar-hover h-8 px-3 text-sm font-normal',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export type NavigationMenuTriggerVariants = VariantProps<typeof navigationMenuTriggerStyle>

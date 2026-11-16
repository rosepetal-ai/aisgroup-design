import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Progress } from './Progress.vue'

// Colour of the filled part. Not in stock shadcn: usage meters go green → amber → red.
export const progressIndicatorVariants = cva('size-full flex-1 transition-all', {
  variants: {
    variant: {
      default: 'bg-primary',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-destructive',
      muted: 'bg-muted-foreground/40',
    },
  },
  defaultVariants: { variant: 'default' },
})
export type ProgressIndicatorVariants = VariantProps<typeof progressIndicatorVariants>

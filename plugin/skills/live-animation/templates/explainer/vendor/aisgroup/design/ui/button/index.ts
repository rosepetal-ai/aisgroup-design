import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'focus-visible:border-ring focus-visible:ring-ring/15 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3 active:not-aria-[haspopup]:translate-y-px [&_svg:not([class*=size-])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        outline: 'border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground shadow-xs',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost: 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20',
        link: 'text-primary underline-offset-4 hover:underline',
        // Top bar (navy): full-height segments; active/open item in white.
        topbar: 'rounded-none text-topbar-muted hover:text-topbar-foreground aria-[current=page]:text-topbar-foreground aria-expanded:text-topbar-foreground focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-topbar-foreground/40 active:not-aria-[haspopup]:translate-y-0',
        // Top bar, "rounded tabs" alternative: the active item gets a soft tint.
        'topbar-tab': 'text-topbar-muted hover:bg-topbar-foreground/10 hover:text-topbar-foreground aria-[current=page]:bg-topbar-foreground/15 aria-[current=page]:text-topbar-foreground aria-expanded:text-topbar-foreground focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-topbar-foreground/40',
        // Top bar, soft filled control (controller picker).
        'topbar-soft': 'bg-topbar-foreground/5 text-topbar-foreground hover:bg-topbar-foreground/12 aria-expanded:bg-topbar-foreground/12 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-topbar-foreground/40',
        // Top bar status pills (licence): quiet outline, dashed when unknown, amber, red.
        'topbar-outline': 'border-topbar-foreground/25 text-topbar-foreground hover:bg-topbar-foreground/10 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-topbar-foreground/40',
        'topbar-dashed': 'border-dashed border-topbar-foreground/25 text-topbar-muted hover:bg-topbar-foreground/10 hover:text-topbar-foreground focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-topbar-foreground/40',
        'warning': 'bg-warning-solid text-warning-solid-foreground hover:bg-warning-solid-hover',
        'danger': 'bg-danger-solid text-danger-solid-foreground hover:bg-danger-solid-hover',
        // Destructive action that should not shout: outline / ghost with red text.
        'outline-destructive': 'border-border bg-background text-destructive shadow-xs hover:bg-destructive/10 hover:text-destructive dark:border-input dark:bg-input/30 dark:hover:bg-destructive/20',
        'ghost-destructive': 'text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20',
        // Buttons inside a log terminal (dark code block).
        'terminal': 'border-code-block-foreground/30 bg-transparent font-mono text-code-block-foreground hover:bg-code-block-foreground/10 hover:text-code-block-foreground',
        // Buttons on an inverted surface (the labeling selection bar).
        'inverse': 'text-background hover:bg-background/15 aria-expanded:bg-background/15 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-background/40',
        'inverse-solid': 'bg-background text-foreground hover:bg-background/85 dark:bg-topbar dark:text-topbar-foreground dark:hover:bg-topbar/85 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-background/40',
        'inverse-outline': 'border-background/30 text-background hover:bg-background/15 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-background/40',
      },
      size: {
        'default': 'h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        'sm': 'h-8 gap-1 rounded-md px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
        'lg': 'h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        'modal': 'h-10 min-w-30 gap-2 rounded-lg px-6 font-normal',
        'icon': 'size-9',
        'icon-sm': 'size-8 rounded-md in-data-[slot=button-group]:rounded-md',
        'icon-lg': 'size-10',
        // Round icon button (top bar).
        'icon-round': 'size-9 rounded-full',
        // Small rounded pill (top bar status).
        'pill': 'h-8 gap-1.5 rounded-full px-3',
        // A whole card as one button (asset tiles): content laid out by the card, not the button.
        'card': 'h-auto w-full flex-col items-stretch justify-start gap-0 rounded-none p-0 text-left font-normal whitespace-normal active:not-aria-[haspopup]:translate-y-0',
        // Top bar items: full bar height, 20px icons.
        'bar': 'h-full gap-2 px-3 [&_svg:not([class*=size-])]:size-5',
        // Inline in a sentence: no box, the text's own size and weight.
        'inline': 'h-auto rounded-sm p-0 align-baseline text-[length:inherit] font-[inherit] whitespace-normal',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>

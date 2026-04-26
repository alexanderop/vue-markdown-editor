import { type VariantProps, cva } from 'class-variance-authority'

// Exported so tests can enumerate the variant surface without re-listing
// the keys. Inspired by Nuxt UI's pattern of driving snapshot matrices off
// the theme config: adding a new variant forces a snapshot update; removing
// one breaks the matrix test.
export const baseButtonVariantConfig = {
  variants: {
    variant: {
      default: 'bg-accent text-white hover:bg-accent-hover active:bg-accent-active shadow-xs',
      secondary: 'bg-secondary text-foreground hover:bg-border',
      outline:
        'border border-border bg-transparent text-foreground hover:border-border-strong hover:bg-accent-soft',
      ghost: 'bg-transparent text-foreground hover:bg-accent-soft',
      link: 'bg-transparent text-accent underline-offset-4 hover:underline px-0',
      destructive: 'bg-destructive text-white hover:bg-destructive/90 shadow-xs',
    },
    size: {
      sm: 'h-6 px-2 text-xs rounded-sm gap-1',
      md: 'h-7 px-3 text-[13px] rounded-md gap-1.5',
      lg: 'h-8 px-3.5 text-sm rounded-md gap-1.5',
      icon: 'size-7 rounded-md',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
} as const

const baseButtonClasses =
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-[color,background-color,border-color] duration-fast ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 aria-invalid:border-destructive focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1"

export const baseButtonVariants = cva(baseButtonClasses, baseButtonVariantConfig)

export type BaseButtonVariants = VariantProps<typeof baseButtonVariants>

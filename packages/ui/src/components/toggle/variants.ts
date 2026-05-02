import { type VariantProps, cva } from 'class-variance-authority'

// Exported so tests / context-driven groups can enumerate the variant
// surface without re-listing the keys. Mirrors `baseButtonVariantConfig`.
export const baseToggleVariantConfig = {
  variants: {
    variant: {
      default:
        'bg-transparent text-foreground hover:bg-muted data-[state=on]:bg-accent-soft data-[state=on]:text-accent',
      outline:
        'border border-border bg-transparent text-foreground shadow-xs hover:border-border-strong data-[state=on]:bg-accent-soft data-[state=on]:text-accent data-[state=on]:border-transparent',
    },
    size: {
      sm: 'h-6 px-1.5',
      md: 'h-7 px-2',
      lg: 'h-8 px-2.5',
      icon: 'size-7',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
} as const

const baseToggleClasses =
  "inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium duration-fast ease-out outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow,background-color,border-color] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"

export const baseToggleVariants = cva(baseToggleClasses, baseToggleVariantConfig)

export type BaseToggleVariants = VariantProps<typeof baseToggleVariants>

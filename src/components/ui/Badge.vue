<template>
  <div :class="badgeVariants({ variant, class: props.class })">
    <slot />
  </div>
</template>

<script setup lang="ts">
/*
  Badge component for displaying skills, technologies, and status indicators
  Provides multiple variants for different use cases in the portfolio
*/

import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface Props {
  variant?: VariantProps<typeof badgeVariants>['variant']
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})
</script>


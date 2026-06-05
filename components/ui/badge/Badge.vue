<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-1 text-xs font-bold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-muted text-primary',
        secondary: 'border-border bg-card text-muted-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

type BadgeVariants = VariantProps<typeof badgeVariants>

const props = withDefaults(
  defineProps<{
    class?: string
    variant?: BadgeVariants['variant']
  }>(),
  {
    variant: 'default'
  }
)
</script>

<template>
  <span :class="cn(badgeVariants({ variant }), props.class)">
    <slot />
  </span>
</template>

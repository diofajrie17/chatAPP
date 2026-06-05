<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const alertVariants = cva(
  'rounded-lg border bg-card px-4 py-3 text-sm leading-relaxed',
  {
    variants: {
      variant: {
        default: 'border-border text-foreground',
        destructive: 'border-destructive/30 text-destructive'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

type AlertVariants = VariantProps<typeof alertVariants>

const props = withDefaults(
  defineProps<{
    class?: string
    variant?: AlertVariants['variant']
  }>(),
  {
    variant: 'default'
  }
)
</script>

<template>
  <div role="alert" :class="cn(alertVariants({ variant }), props.class)">
    <slot />
  </div>
</template>

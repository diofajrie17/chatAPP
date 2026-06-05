<script setup lang="ts">
import { Label } from 'reka-ui'
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: string
  for?: string
}>()
</script>

<template>
  <Label :class="cn('text-sm font-bold leading-tight text-foreground', props.class)" :for="props.for">
    <slot />
  </Label>
</template>

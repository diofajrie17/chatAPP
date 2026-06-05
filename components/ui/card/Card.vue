<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <section
    :class="cn('rounded-lg border border-border bg-card text-foreground shadow-sm', props.class)"
  >
    <slot />
  </section>
</template>

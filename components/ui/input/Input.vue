<script setup lang="ts">
import { cn } from '~/lib/utils'

const model = defineModel<string>()

const props = withDefaults(
  defineProps<{
    autocomplete?: string
    class?: string
    inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
    name?: string
    required?: boolean
    type?: string
  }>(),
  {
    type: 'text'
  }
)
</script>

<template>
  <input
    v-model="model"
    :autocomplete="autocomplete"
    :class="cn('flex min-h-11 w-full rounded-lg border border-input bg-card px-3 py-2 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70', props.class)"
    :inputmode="inputmode"
    :name="name"
    :required="required"
    :type="type"
  >
</template>

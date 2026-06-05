<script setup lang="ts">
import Badge from '~/components/ui/badge/Badge.vue'
import Card from '~/components/ui/card/Card.vue'

defineProps<{
  description: string
  status: string
  title: string
}>()
</script>

<template>
  <Card class="feature-card" aria-disabled="true">
    <div class="feature-card-header">
      <h2>{{ title }}</h2>
      <Badge>{{ status }}</Badge>
    </div>
    <p>{{ description }}</p>
  </Card>
</template>

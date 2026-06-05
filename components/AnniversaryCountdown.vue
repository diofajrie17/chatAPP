<script setup lang="ts">
import Badge from '~/components/ui/badge/Badge.vue'
import Card from '~/components/ui/card/Card.vue'

const props = defineProps<{
  anniversaryDate?: string
}>()

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

const anniversary = computed(() => {
  if (!props.anniversaryDate || !/^\d{4}-\d{2}-\d{2}$/.test(props.anniversaryDate)) {
    return null
  }

  const [year, month, day] = props.anniversaryDate.split('-').map(Number)

  if (!year || !month || !day) {
    return null
  }

  const today = new Date()
  let next = new Date(today.getFullYear(), month - 1, day)

  if (next < startOfDay(today)) {
    next = new Date(today.getFullYear() + 1, month - 1, day)
  }

  const days = Math.ceil(
    (startOfDay(next).getTime() - startOfDay(today).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return {
    configuredDate: new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(year, month - 1, day)),
    nextDate: new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(next),
    days
  }
})
</script>

<template>
  <Card class="anniversary-panel">
    <div>
      <p class="eyebrow">Next anniversary</p>
      <h2 v-if="anniversary">
        {{ anniversary.days }} day{{ anniversary.days === 1 ? '' : 's' }}
      </h2>
      <h2 v-else>Private date</h2>
      <p class="muted">
        {{
          anniversary
            ? `${anniversary.configuredDate} is saved for your private space. Next: ${anniversary.nextDate}.`
            : 'Your anniversary date will appear here once your private space is ready.'
        }}
      </p>
      <Badge class="anniversary-badge">
        Anniversary
      </Badge>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Alert from '~/components/ui/alert/Alert.vue'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import Input from '~/components/ui/input/Input.vue'
import Label from '~/components/ui/label/Label.vue'

const {
  couple,
  error,
  isLoading,
  isUpdating,
  loadCoupleSpace,
  updateCoupleMetadata
} = useCoupleSpace()

const displayName = ref('')
const anniversaryDate = ref('')
const validationError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const syncForm = () => {
  displayName.value = couple.value?.displayName || ''
  anniversaryDate.value = couple.value?.anniversaryDate || ''
}

onMounted(async () => {
  await loadCoupleSpace()
  syncForm()
})

watch(couple, syncForm)

const submitSettings = async () => {
  validationError.value = null
  successMessage.value = null

  const nextDisplayName = displayName.value.trim()
  const nextAnniversaryDate = anniversaryDate.value.trim()

  if (!nextDisplayName) {
    validationError.value = 'Enter a private space name.'
    return
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(nextAnniversaryDate)) {
    validationError.value = 'Choose a valid anniversary date.'
    return
  }

  await updateCoupleMetadata({
    anniversaryDate: nextAnniversaryDate,
    displayName: nextDisplayName
  })

  successMessage.value = 'Private space updated.'
  window.setTimeout(() => {
    void navigateTo('/dashboard')
  }, 700)
}
</script>

<template>
  <section class="settings-page">
    <Card class="settings-panel">
      <div class="settings-header">
        <div>
          <p class="eyebrow">Private settings</p>
          <h1>Space details</h1>
          <p class="muted">
            Update the shared name and anniversary date for this private space.
          </p>
        </div>

        <Button variant="secondary" type="button" @click="navigateTo('/dashboard')">
          Return to dashboard
        </Button>
      </div>

      <div v-if="isLoading" class="settings-status">
        Loading your private space...
      </div>

      <form v-else class="settings-form" @submit.prevent="submitSettings">
        <Alert v-if="successMessage">
          {{ successMessage }}
        </Alert>

        <Alert v-if="error" variant="destructive">
          {{ error }}
        </Alert>

        <Alert v-if="validationError" variant="destructive">
          {{ validationError }}
        </Alert>

        <div class="grid gap-2">
          <Label for="displayName">Private space name</Label>
          <Input
            id="displayName"
            v-model="displayName"
            autocomplete="organization"
            name="displayName"
            required
          />
        </div>

        <div class="grid gap-2">
          <Label for="anniversaryDate">Anniversary date</Label>
          <Input
            id="anniversaryDate"
            v-model="anniversaryDate"
            name="anniversaryDate"
            required
            type="date"
          />
        </div>

        <div class="settings-actions">
          <Button :disabled="isUpdating" type="submit">
            {{ isUpdating ? 'Updating...' : 'Update private space' }}
          </Button>
        </div>
      </form>
    </Card>
  </section>
</template>

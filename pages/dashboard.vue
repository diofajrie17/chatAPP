<script setup lang="ts">
import Alert from '~/components/ui/alert/Alert.vue'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import Skeleton from '~/components/ui/skeleton/Skeleton.vue'
import type { CoupleAccessErrorCode } from '~/composables/useCoupleSpace'

const { logout, user } = useFirebaseAuth()
const { accessErrorCode, couple, isLoading, loadCoupleSpace, profile } =
  useCoupleSpace()

const featureCards = [
  {
    title: 'Chat',
    status: 'Phase 2',
    description: 'Reserved for end-to-end encrypted messages after key design is complete.'
  },
  {
    title: 'Notes',
    status: 'Later',
    description: 'A quiet place for letters, drafts, and saved notes.'
  },
  {
    title: 'Album',
    status: 'Later',
    description: 'Shared photos will use Firebase Storage after access rules are designed.'
  }
]

const accessErrorCopy: Record<
  CoupleAccessErrorCode,
  { title: string; body: string }
> = {
  'missing-profile': {
    title: 'This account is not configured yet',
    body: 'Ask the app owner to run the trusted setup script for this account, then sign in again.'
  },
  'missing-couple': {
    title: 'Your private space setup is incomplete',
    body: 'Check the seeded couple record or rerun the Firebase setup script, then refresh this page.'
  },
  'malformed-couple': {
    title: 'Your private space setup is incomplete',
    body: 'Check the seeded couple record or rerun the Firebase setup script, then refresh this page.'
  },
  'not-member': {
    title: 'Private space unavailable',
    body: 'This account is not one of the two configured members for this private space.'
  },
  unknown: {
    title: 'We could not load your private space',
    body: 'Try refreshing, or sign out and check the Firebase setup before returning.'
  }
}

const activeAccessError = computed(() =>
  accessErrorCode.value ? accessErrorCopy[accessErrorCode.value] : null
)

onMounted(async () => {
  await loadCoupleSpace()
})
</script>

<template>
  <section class="dashboard-page">
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Couple dashboard</p>
        <h1>{{ couple?.displayName || 'Our private space' }}</h1>
        <p class="muted">
          Signed in as {{ profile?.displayName || user?.email || 'your account' }}.
        </p>
      </div>

      <div class="dashboard-actions">
        <Button variant="secondary" type="button" @click="navigateTo('/settings')">
          Settings
        </Button>
        <Button variant="secondary" type="button" @click="logout">
          Log out
        </Button>
      </div>
    </header>

    <Card v-if="isLoading" class="status-panel">
      <Skeleton class="h-5 w-48" />
      <Skeleton class="mt-4 h-12 w-full" />
    </Card>

    <Card v-else-if="activeAccessError" class="status-panel">
      <Alert variant="destructive">
        <h2>{{ activeAccessError.title }}</h2>
        <p>{{ activeAccessError.body }}</p>
      </Alert>
      <div class="status-actions">
        <Button variant="secondary" type="button" @click="logout">
          Log out
        </Button>
      </div>
    </Card>

    <template v-else>
      <AnniversaryCountdown :anniversary-date="couple?.anniversaryDate" />

      <section class="feature-grid" aria-label="Planned couple features">
        <FeatureCard
          v-for="card in featureCards"
          :key="card.title"
          :description="card.description"
          :status="card.status"
          :title="card.title"
        />
      </section>
    </template>
  </section>
</template>

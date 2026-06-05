<script setup lang="ts">
import Alert from '~/components/ui/alert/Alert.vue'
import Button from '~/components/ui/button/Button.vue'
import Card from '~/components/ui/card/Card.vue'
import Input from '~/components/ui/input/Input.vue'
import Label from '~/components/ui/label/Label.vue'

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const { error, login } = useFirebaseAuth()

const submitLogin = async () => {
  isSubmitting.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/dashboard')
  } catch {
    password.value = ''
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <Card class="auth-panel">
      <p class="eyebrow">Private couple space</p>
      <h1>Sign in</h1>
      <p class="muted">
        Use one of the two Firebase Auth accounts configured for this private app.
      </p>

      <form class="auth-form" @submit.prevent="submitLogin">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            v-model="email"
            autocomplete="email"
            inputmode="email"
            name="email"
            required
            type="email"
          />
        </div>

        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input
            id="password"
            v-model="password"
            autocomplete="current-password"
            name="password"
            required
            type="password"
          />
        </div>

        <Alert v-if="error" variant="destructive">
          {{ error }}
        </Alert>

        <Button :disabled="isSubmitting" type="submit">
          {{ isSubmitting ? 'Signing in...' : 'Sign in to space' }}
        </Button>
      </form>
    </Card>
  </section>
</template>

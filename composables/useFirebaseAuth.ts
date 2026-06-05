import type { User } from 'firebase/auth'
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

let authReadyPromise: Promise<User | null> | null = null

export const useFirebaseAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const isReady = useState('auth:isReady', () => false)
  const error = useState<string | null>('auth:error', () => null)
  const nuxtApp = useNuxtApp()

  const initAuthListener = () => {
    if (authReadyPromise) {
      return authReadyPromise
    }

    authReadyPromise = new Promise((resolve) => {
      onAuthStateChanged(nuxtApp.$firebase.auth, (currentUser) => {
        user.value = currentUser
        isReady.value = true
        resolve(currentUser)
      })
    })

    return authReadyPromise
  }

  const login = async (email: string, password: string) => {
    error.value = null
    await setPersistence(nuxtApp.$firebase.auth, browserLocalPersistence)
    try {
      const credential = await signInWithEmailAndPassword(
        nuxtApp.$firebase.auth,
        email,
        password
      )
      user.value = credential.user
      return credential.user
    } catch (authError) {
      console.error('Firebase sign-in failed', authError)
      error.value = 'Unable to sign in. Please check your email and password.'
      throw authError
    }
  }

  const logout = async () => {
    await signOut(nuxtApp.$firebase.auth)
    user.value = null
    useState('couple:profile', () => null).value = null
    useState('couple:current', () => null).value = null
    useState('couple:error', () => null).value = null
    useState('couple:accessErrorCode', () => null).value = null
    useState('couple:isLoading', () => false).value = false
    useState('couple:isUpdating', () => false).value = false
    await navigateTo('/login')
  }

  return {
    error,
    initAuthListener,
    isReady,
    login,
    logout,
    user
  }
}

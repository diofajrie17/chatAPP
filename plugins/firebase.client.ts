import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        apiKey: config.public.firebaseApiKey,
        authDomain: config.public.firebaseAuthDomain,
        projectId: config.public.firebaseProjectId,
        storageBucket: config.public.firebaseStorageBucket,
        messagingSenderId: config.public.firebaseMessagingSenderId,
        appId: config.public.firebaseAppId
      })

  const services: FirebaseServices = {
    app,
    auth: getAuth(app),
    db: getFirestore(app)
  }

  return {
    provide: {
      firebase: services
    }
  }
})

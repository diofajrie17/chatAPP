import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
}

declare module '#app' {
  interface NuxtApp {
    $firebase: FirebaseServices
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $firebase: FirebaseServices
  }
}

export {}

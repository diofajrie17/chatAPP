import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const root = resolve(new URL('..', import.meta.url).pathname)

const readEnvFile = (fileName) => {
  const path = resolve(root, fileName)

  if (!existsSync(path)) {
    return
  }

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()

    if (!process.env[key]) {
      process.env[key] = value.replace(/^["']|["']$/g, '')
    }
  }
}

readEnvFile('.env')
readEnvFile('.env.seed')

const seedEnvPath = resolve(root, '.env.seed')
const defaultServiceAccountPath = '.firebase/service-account.json'

const required = (key) => {
  const value = process.env[key]

  if (!value) {
    throw new Error(
      `Missing required environment value: ${key}. Create .env.seed from .env.seed.example and fill it in before running npm run firebase:seed.`
    )
  }

  return value
}

if (!existsSync(seedEnvPath)) {
  throw new Error(
    'Missing .env.seed. Run `cp .env.seed.example .env.seed`, then edit .env.seed with your two test accounts.'
  )
}

const projectId =
  process.env.FIREBASE_PROJECT_ID || required('NUXT_PUBLIC_FIREBASE_PROJECT_ID')
const serviceAccountPath = resolve(
  root,
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || defaultServiceAccountPath
)

if (!existsSync(serviceAccountPath)) {
  throw new Error(
    `Service account file not found at ${serviceAccountPath}. Download it from Firebase Console > Project settings > Service accounts, then save it there or set FIREBASE_SERVICE_ACCOUNT_PATH in .env.seed.`
  )
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId
  })
}

const auth = getAuth()
const db = getFirestore()

const coupleId = process.env.SEED_COUPLE_ID || 'main-couple'
const anniversaryDate = required('SEED_ANNIVERSARY_DATE')

const partners = [
  {
    email: required('SEED_PARTNER_A_EMAIL'),
    password: required('SEED_PARTNER_A_PASSWORD'),
    displayName: required('SEED_PARTNER_A_DISPLAY_NAME')
  },
  {
    email: required('SEED_PARTNER_B_EMAIL'),
    password: required('SEED_PARTNER_B_PASSWORD'),
    displayName: required('SEED_PARTNER_B_DISPLAY_NAME')
  }
]

const assertValidPassword = (password, label) => {
  if (password.length < 6) {
    throw new Error(`${label} must be at least 6 characters for Firebase Auth.`)
  }
}

const upsertAuthUser = async ({ email, password, displayName }) => {
  assertValidPassword(password, email)

  try {
    const existing = await auth.getUserByEmail(email)
    await auth.updateUser(existing.uid, {
      displayName,
      email,
      password
    })

    return existing.uid
  } catch (error) {
    if (error?.code !== 'auth/user-not-found') {
      throw error
    }

    const created = await auth.createUser({
      displayName,
      email,
      emailVerified: true,
      password
    })

    return created.uid
  }
}

try {
  const partnerUsers = []

  for (const partner of partners) {
    const uid = await upsertAuthUser(partner)
    partnerUsers.push({ ...partner, uid })
  }

  const now = FieldValue.serverTimestamp()
  const memberIds = partnerUsers.map((partner) => partner.uid)

  await db.doc(`couples/${coupleId}`).set(
    {
      anniversaryDate,
      createdAt: now,
      displayName: process.env.SEED_COUPLE_DISPLAY_NAME || 'Our Space',
      memberIds,
      updatedAt: now
    },
    { merge: true }
  )

  for (const partner of partnerUsers) {
    await db.doc(`users/${partner.uid}`).set(
      {
        coupleId,
        createdAt: now,
        displayName: partner.displayName,
        email: partner.email,
        role: 'partner',
        uid: partner.uid,
        updatedAt: now
      },
      { merge: true }
    )
  }

  console.log('Seed complete.')
  console.table(
    partnerUsers.map(({ displayName, email, uid }) => ({
      displayName,
      email,
      uid
    }))
  )
  console.log(`Couple document: couples/${coupleId}`)
} catch (error) {
  if (error?.code === 'auth/configuration-not-found') {
    console.error(
      [
        'Firebase Auth is not ready for this project.',
        '',
        'Open Firebase Console:',
        'Authentication > Get started',
        'Authentication > Sign-in method > Email/Password > Enable > Save',
        '',
        'Then run `npm run firebase:seed` again.'
      ].join('\n')
    )
    process.exit(1)
  }

  throw error
}

# Private Couple App

MVP foundation for a private two-person couple space built with Nuxt 3, Vue 3, TypeScript, Firebase Auth, and Firestore.

Phase 1 includes authentication, protected routes, a couple dashboard, an anniversary countdown, placeholder feature cards, safe metadata settings, and install metadata for **Our Private Space**. Chat, messages, media uploads, offline behavior, service workers, and encryption are intentionally not implemented yet.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the Firebase environment template:

```bash
cp .env.example .env
```

3. Fill `.env` with the web app config from Firebase:

```bash
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
```

4. Enable Email/Password sign-in in Firebase Auth.

5. Create exactly two Firebase Auth users manually in the Firebase console.

6. Create matching Firestore documents for those two users and one couple document. Do this from the Firebase console or a trusted Admin SDK script, not from the client app.

7. Run the app:

```bash
npm run dev
```

## Seed Firebase For Local Testing

The app has no public sign-up flow in Phase 1. Use the local seed script to create or update exactly two Firebase Auth users and the matching Firestore documents.

1. In Firebase Console, open Project settings > Service accounts.
2. Generate a new private key.
3. Save it locally as `.firebase/service-account.json`.
4. Copy the seed template:

```bash
cp .env.seed.example .env.seed
```

5. Edit `.env.seed` with your two email/password test accounts and anniversary date.
6. Run:

```bash
npm run firebase:seed
```

The script writes:

- `users/{partnerAUid}`
- `users/{partnerBUid}`
- `couples/{SEED_COUPLE_ID}`

Never commit `.env.seed` or `.firebase/service-account.json`.

## Firestore Data Model

### `users/{userId}`

The document ID must be the Firebase Auth UID. This prevents a user from creating or reading a profile under another UID.

```json
{
  "uid": "auth-user-uid-a",
  "email": "person@example.com",
  "displayName": "Person",
  "coupleId": "couple-doc-id",
  "role": "partner",
  "createdAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

### `couples/{coupleId}`

`memberIds` must contain exactly two unique Firebase Auth UIDs.

```json
{
  "memberIds": ["auth-user-uid-a", "auth-user-uid-b"],
  "displayName": "Our Space",
  "anniversaryDate": "2020-06-14",
  "createdAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

## Security Model

- The app does not store chat or message content in Phase 1.
- The app does not implement or claim encryption in Phase 1.
- Users can only read `users/{userId}` when `userId` equals `request.auth.uid`.
- Couple documents are readable only when the signed-in UID is present in `couples/{coupleId}.memberIds`.
- Couple documents must keep exactly two unique members.
- Client writes to `users` and all subcollections are denied in Phase 1.
- Configured couple members may update only `displayName` and `anniversaryDate` on their existing couple document.
- Client-side checks mirror the security rules, but Firestore rules are the real access boundary.

The Phase 1 setup is still owner/admin bootstrapped. Deploy `firestore.rules` with Firebase CLI after reviewing them for your project:

```bash
firebase deploy --only firestore:rules
```

## Architecture

- `plugins/firebase.client.ts` initializes Firebase on the client and provides Auth and Firestore through Nuxt.
- `composables/useFirebaseAuth.ts` owns the Firebase Auth listener, login, logout, and shared auth state.
- `middleware/auth.global.ts` protects all routes except `/login`.
- `composables/useCoupleSpace.ts` loads the signed-in user's profile and couple document.
- `pages/dashboard.vue` renders the private couple dashboard and Phase 1 placeholders.
- `components/AnniversaryCountdown.vue` and `components/FeatureCard.vue` hold reusable dashboard UI.
- `firestore.rules` defines the initial access model for users and couples.
- `firebase.json` points Firebase CLI deployments at the Firestore rules file.

## Phase 1 Verification

Run the local automated checks:

```bash
npm run typecheck
npm run build
```

Verify the authenticated app flow with the two seeded Firebase Auth users:

1. Sign in at `/login`.
2. Refresh the page and confirm the session persists.
3. Open `/dashboard` and confirm the private space name, anniversary countdown, Settings action, Log out action, and disabled Chat, Notes, and Album previews.
4. Open `/settings`.
5. Update `displayName` and `anniversaryDate`.
6. Confirm the dashboard reflects the changed private space metadata.
7. Log out and confirm protected routes return to login.

Inspect the install metadata:

1. Open browser devtools and inspect `/manifest.webmanifest`.
2. Confirm the app name is `Our Private Space`.
3. Confirm icons load from `/icons/icon-192.png` and `/icons/icon-512.png`.
4. Perform a manual Add to Home Screen check on the target device/browser.

Phase 1 only adds manifest, icon, and theme metadata. It does not add a service worker, offline shell, precaching, push behavior, or any offline privacy guarantee.

Verify the local repository remote without pushing:

```bash
git remote -v
```

Expected output:

```text
origin	https://github.com/diofajrie17/chatAPP.git (fetch)
origin	https://github.com/diofajrie17/chatAPP.git (push)
```

Phase 1 does not push to GitHub unless you explicitly ask for it.

## Phase 2 TODO: Encrypted Chat

- Design an end-to-end encryption approach before creating any message collection.
- Decide how device keys are generated, stored, rotated, and recovered.
- Store only ciphertext and required metadata in Firestore.
- Add message rules that allow access only to members of the couple.
- Add tests or emulator coverage for non-member denial, UID spoofing, and member-only reads.
- Document security limits honestly; do not claim WhatsApp-level guarantees.

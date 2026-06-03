# Research Summary: Private Couple Chat App

**Date:** 2026-06-03

## Key Findings

**Stack:** Keep Nuxt 3/Vue 3/TypeScript with Firebase Auth, Firestore, Storage, FCM, Security Rules, and Web Crypto. The repository already has the right foundation.

**Table Stakes:** Authenticated two-user access, member-only couple data, realtime encrypted chat, encrypted notes, private album metadata/storage, installable PWA behavior, and generic push notifications.

**Watch Out For:** Security rules are the real boundary, not composables. Web Crypto is low-level and easy to misuse. AES-GCM IVs must be unique per key. PWA installation and notification UX differ by platform. Do not overclaim encryption strength.

## Phase Guidance

### Phase 1: Basic Private Space

Finish and verify the existing Nuxt/Firebase foundation: auth, seeded couple data, dashboard, PWA basics, and rule-tested member-only reads. This phase is partially implemented in the repo and should be audited before adding more.

### Phase 2: Basic Encrypted Chat

Add the encryption wrapper, key metadata, message collection, realtime listener, send/delete states, and sender validation rules.

### Phase 3: Couple Memories

Add anniversary enhancements, encrypted notes, private photo album metadata/storage, and theme personalization.

### Phase 4: Security Hardening

Add emulator rule tests, encryption tests, no-plaintext checks, XSS/CSP review, threat model, and key-change/recovery decisions.

### Phase 5: Business-Ready Preparation

Prepare multi-couple data model, invite/onboarding flow, deployment checklist, pricing research, privacy/delete docs, and theme/template strategy.

## Source URLs

- Firestore pricing and free quota: https://firebase.google.com/docs/firestore/pricing
- Firebase Security Rules data validation: https://firebase.google.com/docs/rules/data-validation
- Firebase Cloud Messaging: https://firebase.google.com/docs/cloud-messaging
- Web Crypto API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- AES-GCM parameters: https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
- IndexedDB API: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- PWA installation: https://web.dev/learn/pwa/installation
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/

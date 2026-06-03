# Stack Research: Private Couple Chat App

**Date:** 2026-06-03
**Source:** Inline GSD research from `.codex/PRD.md`

## Recommendation

Keep the PRD stack:

- Nuxt 3 / Vue 3 / TypeScript for the installable web app.
- Firebase Auth for email/password sign-in and session persistence.
- Cloud Firestore for users, couples, messages, notes, albums, photos, and device metadata.
- Firebase Storage for photo files.
- Firebase Cloud Messaging for generic push notifications after chat works.
- Firebase Security Rules and emulator tests as the primary access-control gate.
- Web Crypto API for an MVP encryption wrapper, with a strong warning that key management must be reviewed before making strong E2EE claims.

## Current Official-Doc Findings

- Cloud Firestore has a free quota suitable for personal testing: one free database, 1 GiB stored data, 50,000 document reads/day, 20,000 writes/day, 20,000 deletes/day, and 10 GiB/month outbound transfer. Source: https://firebase.google.com/docs/firestore/pricing
- Firestore billing counts document reads/writes/deletes and can also count index entry reads, so realtime listeners and dashboard previews must stay narrow. Source: https://firebase.google.com/docs/firestore/pricing
- Firebase Security Rules support data validation with `resource` and `request.resource`, which is essential for enforcing immutable sender IDs, exactly two couple members, and member-only access. Source: https://firebase.google.com/docs/rules/data-validation
- FCM supports web clients and instant-messaging style payloads, but notification content must remain generic for this product. Source: https://firebase.google.com/docs/cloud-messaging
- Web Crypto is widely available in secure contexts, but MDN warns that it is low-level and easy to misuse. Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API
- AES-GCM IVs must be unique per encryption operation for a given key. Source: https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams
- IndexedDB can store structured client-side data and follows same-origin policy; it is the practical PWA storage candidate for local key material, but it is still exposed to same-origin JavaScript if XSS occurs. Source: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- PWA installation differs by platform. iOS/iPadOS still require manual Add to Home Screen flow through the share menu; Android/Chromium can show install dialogs. Source: https://web.dev/learn/pwa/installation
- OWASP ASVS 5.0.0 is the latest stable version and is appropriate as a lightweight verification reference for the security hardening phase. Source: https://owasp.org/www-project-application-security-verification-standard/

## Version Guidance

- Keep Nuxt, Vue, Firebase, TypeScript, and Firebase Admin versions pinned through `package-lock.json`.
- Before implementation phases, run `npm outdated` and review breaking changes rather than blindly upgrading.
- Avoid adding a custom backend until push notifications, invite flow, or encryption recovery require it.

## Do Not Use Yet

- Signal Protocol or Matrix Olm/Megolm unless the phase explicitly includes implementation research, tests, and review capacity.
- Cloud Functions for every write unless Security Rules cannot express the required invariant.
- Public invite/sign-up flows before the two-member allowlist and couple creation invariants are tested.

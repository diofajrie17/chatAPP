# Architecture Research: Private Couple Chat App

**Date:** 2026-06-03
**Source:** Inline GSD research from `.codex/PRD.md`

## Recommended Components

### Client App

- Nuxt pages for login, dashboard, chat, notes, album, and settings.
- Composables for Firebase Auth, couple-space loading, encryption, messages, notes, photos, and notifications.
- Client-only Firebase plugin for Auth, Firestore, Storage, and Messaging.

### Firebase Data

- `users/{userId}`: profile, display name, email, coupleId, public key, notification settings.
- `couples/{coupleId}`: displayName/name, exactly two member IDs, anniversaryDate, theme metadata.
- `couples/{coupleId}/messages/{messageId}`: senderId, ciphertext, nonce/iv, algorithm, keyVersion, createdAt, updatedAt, deletedAt, type.
- `couples/{coupleId}/notes/{noteId}`: authorId, ciphertext, nonce/iv, algorithm, keyVersion, title policy, openAt, createdAt, updatedAt, deletedAt.
- `couples/{coupleId}/photos/{photoId}`: uploaderId, storagePath, encrypted caption/metadata, createdAt, deletedAt.
- `couples/{coupleId}/devices/{deviceId}`: ownerId, public key info, push token metadata, notification opt-in status.

### Access Control

- Firestore and Storage rules should derive access from authenticated UID membership in the target couple document.
- Rules must reject sender spoofing by requiring message senderId to equal `request.auth.uid`.
- Rules must prevent arbitrary couple creation or member changes from the client until an explicit invite/onboarding model exists.

### Encryption

- MVP can use a shared conversation key with AES-GCM for message/note payloads, but only after documenting generation, storage, recovery, rotation, and key-change warning behavior.
- Store algorithm, keyVersion, and nonce/iv with every encrypted record.
- Do not store private keys in Firestore.

## Suggested Build Order

1. Finish private space and rule-tested member access.
2. Add encryption utility and key storage decisions.
3. Add encrypted chat write/list/delete behavior.
4. Add notes and photo album using the same encrypted payload and membership model.
5. Add push notifications with generic content.
6. Harden security, tests, CSP/XSS posture, and business-ready onboarding.

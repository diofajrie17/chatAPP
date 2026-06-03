# Private Couple Chat App MVP

## What This Is

Private Couple Chat App is a private, installable web app for one couple. It gives two approved users a dedicated digital home for encrypted chat, shared memories, love notes, anniversary milestones, and private relationship context without public social features or ad-driven noise.

The first version is for personal use between the user and his wife, but the architecture should stay clean enough to evolve into a small SaaS for multiple couples later.

## Core Value

Two approved partners can safely share a private couple-only space where sensitive messages and notes are never stored as plaintext in Firebase.

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] Authenticate exactly two approved users and keep unknown users out of the couple space.
- [ ] Store and enforce a single couple document with exactly two members.
- [ ] Render an authenticated dashboard with couple name, anniversary context, and private feature entry points.
- [ ] Send and receive encrypted text messages in real time.
- [ ] Store encrypted love notes and private photo metadata under the couple space.
- [ ] Enforce Firestore and Storage membership rules for every couple-owned resource.
- [ ] Keep the app installable as a PWA for daily mobile use.
- [ ] Add security tests and a clear threat model before any business-ready expansion.
- [ ] Prepare the data model and onboarding path for future multiple-couple support without building the SaaS product yet.

### Out of Scope

- Public social features - the product is a private couple space, not a feed or network.
- Group chat - the MVP is exactly two users.
- Multi-couple admin dashboard - future business scope only.
- Native App Store or Play Store release - PWA first keeps cost and complexity low.
- WhatsApp-level or Signal-level protocol claims - basic client-side encryption is the MVP target unless a mature protocol is adopted correctly.
- Multi-device encrypted sync - deferred until key backup and recovery are designed.
- Voice calls, video calls, AI chatbot, payments, public marketplace, and complex moderation - explicitly excluded from MVP.

## Context

- The repository already contains a Nuxt 3, Vue 3, TypeScript, Firebase Auth, and Firestore foundation.
- Existing code includes client Firebase initialization, email/password sign-in, route protection, a couple-space loader, a dashboard, anniversary countdown component, seed script, and a read-only first Firestore rules draft.
- The README describes Phase 1 as partially implemented and explicitly defers chat, message storage, PWA behavior, media uploads, and encryption.
- The PRD chooses Firebase or similar BaaS to avoid a custom backend in the MVP.
- The app must be honest about encryption limits: use wording like "Private encrypted couple space", not "military-grade" or "WhatsApp-level".
- Push notifications must avoid plaintext content; generic copy such as "New message from your partner" is acceptable.

## Constraints

- **Tech stack**: Nuxt 3, Vue 3, TypeScript, Firebase Auth, Cloud Firestore, Firebase Storage, Firebase Cloud Messaging, and Firebase Security Rules - chosen in the PRD and already started in the repo.
- **Budget**: Keep operating cost close to free for personal use - avoid unnecessary Cloud Functions, paid-only Firebase features, or high-read data models early.
- **Security**: Sensitive message and note plaintext must be encrypted before Firebase writes - database/admin access should not expose content.
- **Access control**: Every couple-owned read/write must be gated by authenticated membership and exactly two-member couple constraints.
- **Privacy**: Analytics may track technical events and counts only; message body, note body, photo content, captions, partner conversations, and keys are forbidden analytics inputs.
- **Platform**: PWA install and notification behavior differs across Android, iOS, and desktop browsers, so the MVP must verify actual target-device behavior.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Nuxt 3/Vue 3 with Firebase BaaS for MVP | Matches PRD, avoids custom backend, and aligns with the existing codebase | - Pending |
| Treat the first version as a two-account private deployment | Keeps security rules, onboarding, and key management tractable | - Pending |
| Use client-side encryption for messages and notes before saving to Firestore | Protects sensitive content from database reads and admin visibility | - Pending |
| Defer mature E2EE protocol claims until specialist review or a reviewed protocol is adopted | Web Crypto is low-level and key management is hard to get right | - Pending |
| Keep push notification content generic | Prevents sensitive message leakage through notification payloads | - Pending |
| Use vertical MVP phases | Each phase should deliver an end-to-end user capability rather than isolated technical layers | - Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-03 after initialization from .codex/PRD.md*

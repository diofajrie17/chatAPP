# Walking Skeleton - Private Couple Chat App MVP

**Phase:** 1
**Generated:** 2026-06-03

## Capability Proven End-to-End

A configured partner can sign in, load the seeded couple dashboard, update safe couple metadata, and see the updated private-space identity from local Nuxt/Firebase code.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Nuxt 3 + Vue 3 + TypeScript | Matches the existing app and supports file-based routing for `/login`, `/dashboard`, and `/settings`. |
| UI system | shadcn-vue official components + Tailwind CSS | Gives consistent app controls for forms, cards, alerts, buttons, and loading states while staying compatible with Vue/Nuxt. |
| Data layer | Firebase Auth + Cloud Firestore | Matches the PRD and current seed-controlled two-user private space model. |
| Auth | Firebase email/password Auth with browser-local persistence | Already implemented locally and fits the private two-account MVP. |
| Access control | Firestore rules enforce signed-in member-only reads and safe metadata updates | Keeps couple setup trusted while allowing only `displayName` and `anniversaryDate` client edits. |
| Deployment target | Local full-stack run for Phase 1; GitHub origin configured for future push/deploy flow | The user requested everything local for now, with repository connection to `https://github.com/diofajrie17/chatAPP.git`. |
| Directory layout | Nuxt root directories: `pages/`, `components/`, `composables/`, `plugins/`, `types/`, `scripts/`, `public/` | Preserves the existing project shape and keeps later slices easy to extend. |

## Stack Touched in Phase 1

- [x] Project scaffold (Nuxt app, package scripts, TypeScript, Firebase config)
- [x] Routing - authenticated `/dashboard` and public `/login` already exist; `/settings` is added in Phase 1 execution
- [x] Database - trusted seed script writes user/couple docs; settings flow reads and updates safe couple metadata
- [x] UI - settings form submits to Firestore and dashboard renders updated data
- [x] Deployment - local full-stack run commands documented and GitHub `origin` verified

## Out of Scope (Deferred to Later Slices)

- Chat routes, message collections, realtime message listeners, and encrypted message storage
- Notes, photo album, storage rules, and upload UI
- Push notifications and notification token storage
- Offline shell, service worker, and precaching behavior
- Public onboarding, invites, arbitrary couple creation, group membership, and SaaS admin workflows
- Personal/couple imagery in PWA icons

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without changing the Phase 1 architectural choices:

- Phase 2: encrypted realtime private chat and generic notifications
- Phase 3: encrypted notes, photo album, and richer couple memories
- Phase 4: rule tests, encryption tests, threat model, XSS/CSP review, and privacy hardening
- Phase 5: business-ready multi-couple preparation, invite/onboarding design, deployment checklist, and SaaS research

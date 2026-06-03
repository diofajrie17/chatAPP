# Roadmap: Private Couple Chat App MVP

## Overview

The MVP moves from a private two-person Firebase foundation to encrypted realtime chat, then relationship-specific memories, then security hardening, and finally business-ready preparation. The phase sequence preserves the PRD milestone shape while recognizing that Phase 1 already has partial implementation in the current repository and should be audited before execution continues.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Basic Private Space** - Finish and verify the two-user Nuxt/Firebase private space foundation and GitHub repository connection.
- [ ] **Phase 2: Basic Encrypted Chat** - Add client-side encrypted realtime text chat and generic message notifications.
- [ ] **Phase 3: Couple Memories** - Add encrypted notes, shared photo album, anniversary enhancements, and personalization.
- [ ] **Phase 4: Security Hardening** - Add rules tests, encryption tests, threat model, XSS/CSP review, and privacy checks.
- [ ] **Phase 5: Business-Ready Preparation** - Prepare multi-couple architecture, invite/onboarding design, deployment, and SaaS research.

## Phase Details

### Phase 1: Basic Private Space
**Goal:** As one approved partner, I want to sign in and see our private couple dashboard, so that only the two configured members can access the couple space.
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** [AUTH-01, AUTH-02, AUTH-03, AUTH-04, SPCE-01, SPCE-02, SPCE-03, SPCE-04, DASH-01, DASH-02, PWA-01, REPO-01]
**Success Criteria** (what must be TRUE):
  1. User can sign in, refresh, and remain authenticated until logout.
  2. Dashboard loads only after authentication and shows the configured couple name.
  3. Firestore rules allow the two configured members to read their own user and couple documents.
  4. Unknown users cannot create arbitrary couple spaces or read/write couple data.
  5. The app has the PWA metadata baseline needed for Add to Home Screen testing.
  6. Local git remote `origin` is configured to `https://github.com/diofajrie17/chatAPP.git` for fetch and push.
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 1 --prd .codex/PRD.md` to break down)

### Phase 2: Basic Encrypted Chat
**Goal:** As a partner, I want to send and receive encrypted realtime text messages, so that private chat content is never stored as plaintext in Firebase.
**Mode:** mvp
**Depends on:** Phase 1
**Requirements:** [CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CRYP-01, CRYP-03, CRYP-04, DASH-03, NOTF-01, NOTF-02, NOTF-03]
**Success Criteria** (what must be TRUE):
  1. User can send text messages that Firestore stores as ciphertext plus nonce/iv, algorithm, and keyVersion metadata.
  2. Partner receives messages in realtime ordered by creation time.
  3. Firestore rules reject senderId spoofing and non-member message access.
  4. User sees sending, sent, failed, and deleted-message states.
  5. Notification payloads are generic and do not include plaintext message content.
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 2 --prd .codex/PRD.md` to break down)

### Phase 3: Couple Memories
**Goal:** As a couple member, I want notes, photos, and anniversary context in one private space, so that the app feels like a relationship home rather than generic chat.
**Mode:** mvp
**Depends on:** Phase 2
**Requirements:** [NOTE-01, NOTE-02, NOTE-03, ALBM-01, ALBM-02, ALBM-03, ALBM-04, ALBM-05, CRYP-02, DASH-04, PWA-02]
**Success Criteria** (what must be TRUE):
  1. User can create, view, edit, and delete authorized encrypted notes.
  2. User can upload, view, and delete private couple-scoped photos.
  3. Album metadata and Storage paths are member-scoped and not guessable.
  4. Dashboard shows recent notes and photos without leaking private content.
  5. PWA install behavior is checked on target mobile browsers.
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 3 --prd .codex/PRD.md` to break down)

### Phase 4: Security Hardening
**Goal:** As the owner of a private couple app, I want rule tests, encryption tests, and a threat model, so that the MVP is safe enough to use honestly before expanding scope.
**Mode:** mvp
**Depends on:** Phase 3
**Requirements:** [CRYP-05, CRYP-06, SECU-01, SECU-02, SECU-03, SECU-04, SECU-05, SECU-06, SECU-07]
**Success Criteria** (what must be TRUE):
  1. Automated rules tests cover unauthenticated denial, non-member denial, sender spoof denial, and member allow cases.
  2. Encryption tests prove round-trip decrypt, wrong-key failure, and nonce-varying ciphertext.
  3. Threat model documents unauthorized access, database leak, admin visibility, stolen device, spoofing, notification leak, guessed file URL, and XSS risks.
  4. Product copy avoids overclaiming encryption strength.
  5. Analytics/logging policy excludes sensitive content and keys.
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 4 --prd .codex/PRD.md` to break down)

### Phase 5: Business-Ready Preparation
**Goal:** As the future product owner, I want the personal MVP prepared for multiple couples, onboarding, deployment, and pricing research, so that business validation can start after personal usage proves value.
**Mode:** mvp
**Depends on:** Phase 4
**Requirements:** [BIZ-01, BIZ-02, BIZ-03, BIZ-04]
**Success Criteria** (what must be TRUE):
  1. Data model and rules design identify changes needed for multiple couples.
  2. Admin-controlled invite/onboarding flow is specified without opening arbitrary public couple creation.
  3. Deployment checklist covers Firebase config, rules deployment, environment variables, and rollback basics.
  4. Pricing, privacy policy, data deletion, and terms research are documented for future SaaS validation.
**Plans:** 0 plans

Plans:
- [ ] TBD (run `$gsd-plan-phase 5 --prd .codex/PRD.md` to break down)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Basic Private Space | 0/0 | Not started | - |
| 2. Basic Encrypted Chat | 0/0 | Not started | - |
| 3. Couple Memories | 0/0 | Not started | - |
| 4. Security Hardening | 0/0 | Not started | - |
| 5. Business-Ready Preparation | 0/0 | Not started | - |

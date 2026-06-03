# Requirements: Private Couple Chat App MVP

**Defined:** 2026-06-03
**Core Value:** Two approved partners can safely share a private couple-only space where sensitive messages and notes are never stored as plaintext in Firebase.

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can sign in with email/password and reach the private app only after authentication.
- [ ] **AUTH-02**: User session persists across browser refresh and user can log out.
- [ ] **AUTH-03**: Only the two approved user IDs can access the configured couple space.
- [ ] **AUTH-04**: Unknown authenticated users cannot create arbitrary couple spaces or read/write couple data.

### Couple Space

- [ ] **SPCE-01**: One couple space can be created manually or through a trusted seed/setup script.
- [ ] **SPCE-02**: Couple document stores exactly two unique member user IDs.
- [ ] **SPCE-03**: Dashboard shows the couple name for both members.
- [ ] **SPCE-04**: Member can update couple display name and anniversary date when rules allow metadata updates.

### Private Chat

- [ ] **CHAT-01**: User can send encrypted text messages to the couple message collection.
- [ ] **CHAT-02**: Partner receives messages in real time ordered by creation time.
- [ ] **CHAT-03**: Message sender is displayed correctly and cannot be spoofed in Firestore writes.
- [ ] **CHAT-04**: User can see sending, sent, and failed delivery states.
- [ ] **CHAT-05**: User can delete or soft-delete their own message and deleted messages are hidden or replaced with "message deleted."

### Encryption and Key Management

- [ ] **CRYP-01**: Message plaintext is encrypted on the sender device before Firestore write.
- [ ] **CRYP-02**: Note content is encrypted on the author device before Firestore write.
- [ ] **CRYP-03**: Encrypted records store ciphertext, nonce or iv, algorithm, and keyVersion metadata.
- [ ] **CRYP-04**: Private keys are not uploaded to Firestore.
- [ ] **CRYP-05**: Encryption tests prove round-trip decrypt works, wrong-key decrypt fails, and repeated plaintext creates different ciphertext when nonce changes.
- [ ] **CRYP-06**: Product copy documents MVP security limits and avoids WhatsApp-level, military-grade, or impossible-to-hack claims.

### Dashboard and Milestones

- [ ] **DASH-01**: Dashboard loads only after authentication and only shows data from the user's couple space.
- [ ] **DASH-02**: Dashboard shows anniversary countdown from the configured anniversary date.
- [ ] **DASH-03**: Dashboard can show latest message preview without storing plaintext preview content in Firebase.
- [ ] **DASH-04**: Dashboard can show recent photos and recent notes after those features exist.

### Love Notes

- [ ] **NOTE-01**: User can create an encrypted note.
- [ ] **NOTE-02**: Couple members can view notes they are authorized to read.
- [ ] **NOTE-03**: Note author can edit and delete their own note.

### Shared Photo Album

- [ ] **ALBM-01**: User can upload an image to a protected couple-scoped storage path.
- [ ] **ALBM-02**: User can view shared album photos for their couple.
- [ ] **ALBM-03**: Photo metadata is attached to the couple ID and uploader ID.
- [ ] **ALBM-04**: Storage paths are not guessable and Storage rules validate membership before file access.
- [ ] **ALBM-05**: User can delete their own uploaded photo and associated metadata.

### Push Notifications

- [ ] **NOTF-01**: User can opt in to push notifications.
- [ ] **NOTF-02**: New message can trigger a generic notification that does not include plaintext message content.
- [ ] **NOTF-03**: Push token is associated with the authenticated user and user can disable notifications.

### Security and Privacy

- [ ] **SECU-01**: Firestore rules enforce authenticated member-only reads and writes for every couple-owned collection.
- [ ] **SECU-02**: Firestore rules reject message senderId values that do not equal the authenticated UID.
- [ ] **SECU-03**: Users cannot add arbitrary members to a couple or change another user's UID or role.
- [ ] **SECU-04**: Automated rule tests cover unauthenticated denial, authenticated non-member denial, sender spoof denial, and member allow cases.
- [ ] **SECU-05**: Frontend security review covers XSS risk, CSP/security headers, and sanitized user-generated content.
- [ ] **SECU-06**: Analytics and logs exclude message bodies, note bodies, photo content, private captions, partner conversations, and encryption keys.
- [ ] **SECU-07**: Threat model is documented before moving beyond MVP.

### PWA and Business Preparation

- [ ] **PWA-01**: App has manifest/icon/service-worker behavior needed for Add to Home Screen testing.
- [ ] **PWA-02**: PWA install behavior is manually verified on target mobile browsers.
- [ ] **BIZ-01**: Data model can support future multiple-couple operation without changing the personal MVP user experience.
- [ ] **BIZ-02**: Future invite/onboarding flow is designed for admin-controlled couple creation.
- [ ] **BIZ-03**: Deployment checklist documents Firebase config, rules deployment, environment variables, and rollback basics.
- [ ] **BIZ-04**: Business-readiness research covers pricing, privacy policy, data deletion, and terms needs for future SaaS.

## v2 Requirements

### Relationship Features

- **V2-REL-01**: User can add custom countdowns such as vacation, birthday, or wedding anniversary.
- **V2-REL-02**: User can create "open when..." note categories.
- **V2-REL-03**: User can add reactions and reply-to-message.
- **V2-REL-04**: User can add album captions and categories.
- **V2-REL-05**: Couple can customize theme color and cover image.

### Business Features

- **V2-BIZ-01**: Multiple couples can self-onboard through an invite flow.
- **V2-BIZ-02**: Admin can manage templates, themes, and couple setup.
- **V2-BIZ-03**: Payment or paid pilot flow can be evaluated after personal validation.
- **V2-BIZ-04**: Custom URL or domain options can be researched for gift packaging.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Public social features | Contradicts private couple-only product value |
| Group chat | MVP is exactly two users |
| Multi-couple admin dashboard | Future SaaS scope, not personal MVP |
| Native mobile release | PWA first controls cost and scope |
| Full WhatsApp-level encryption protocol | Requires mature protocol and specialist review |
| Multi-device encrypted sync | Requires key backup/recovery design |
| Voice/video calls | Not needed for core value |
| AI chatbot | Explicit PRD non-goal |
| Payment system | Business validation later |
| Public marketplace | Not part of private MVP |
| Complex moderation tools | No public social surface in MVP |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| SPCE-01 | Phase 1 | Pending |
| SPCE-02 | Phase 1 | Pending |
| SPCE-03 | Phase 1 | Pending |
| SPCE-04 | Phase 1 | Pending |
| DASH-01 | Phase 1 | Pending |
| DASH-02 | Phase 1 | Pending |
| PWA-01 | Phase 1 | Pending |
| CHAT-01 | Phase 2 | Pending |
| CHAT-02 | Phase 2 | Pending |
| CHAT-03 | Phase 2 | Pending |
| CHAT-04 | Phase 2 | Pending |
| CHAT-05 | Phase 2 | Pending |
| CRYP-01 | Phase 2 | Pending |
| CRYP-03 | Phase 2 | Pending |
| CRYP-04 | Phase 2 | Pending |
| DASH-03 | Phase 2 | Pending |
| NOTF-01 | Phase 2 | Pending |
| NOTF-02 | Phase 2 | Pending |
| NOTF-03 | Phase 2 | Pending |
| NOTE-01 | Phase 3 | Pending |
| NOTE-02 | Phase 3 | Pending |
| NOTE-03 | Phase 3 | Pending |
| ALBM-01 | Phase 3 | Pending |
| ALBM-02 | Phase 3 | Pending |
| ALBM-03 | Phase 3 | Pending |
| ALBM-04 | Phase 3 | Pending |
| ALBM-05 | Phase 3 | Pending |
| CRYP-02 | Phase 3 | Pending |
| DASH-04 | Phase 3 | Pending |
| PWA-02 | Phase 3 | Pending |
| CRYP-05 | Phase 4 | Pending |
| CRYP-06 | Phase 4 | Pending |
| SECU-01 | Phase 4 | Pending |
| SECU-02 | Phase 4 | Pending |
| SECU-03 | Phase 4 | Pending |
| SECU-04 | Phase 4 | Pending |
| SECU-05 | Phase 4 | Pending |
| SECU-06 | Phase 4 | Pending |
| SECU-07 | Phase 4 | Pending |
| BIZ-01 | Phase 5 | Pending |
| BIZ-02 | Phase 5 | Pending |
| BIZ-03 | Phase 5 | Pending |
| BIZ-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 47 total
- Mapped to phases: 47
- Unmapped: 0

---
*Requirements defined: 2026-06-03*
*Last updated: 2026-06-03 after initialization from .codex/PRD.md*

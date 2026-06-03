# Feature Research: Private Couple Chat App

**Date:** 2026-06-03
**Source:** Inline GSD research from `.codex/PRD.md`

## Table Stakes

- Authentication with session persistence and logout.
- Exactly one private couple space for the two approved members.
- Member-only Firestore and Storage access enforced by rules, not just UI checks.
- Real-time text chat with correct ordering and sender display.
- Client-side encryption for sensitive message and note content before persistence.
- Honest dashboard that only shows authenticated couple data.
- Installable PWA behavior for daily mobile use.
- Generic notifications that do not expose message plaintext.

## Differentiators

- Love notes or letters as a relationship-specific feature.
- Anniversary countdown and days-together context.
- Shared photo album scoped to the couple.
- Theme color and cover image for a more personal digital home.
- Future gift/SaaS packaging for long-distance couples, newly married couples, and anniversary gifts.

## Anti-Features

- Public social sharing, public profiles, feeds, likes, or marketplace behavior.
- Group chat or arbitrary member management.
- Claims of WhatsApp-level or impossible-to-hack encryption.
- Analytics that capture private content or captions.
- Plaintext push notification content.

## Dependencies Between Features

- Chat, notes, albums, and notifications depend on the couple-space access model.
- Message encryption depends on a key management decision and nonce/version metadata.
- Push notifications depend on chat send events and device token storage.
- Photo uploads depend on Storage rules and nonguessable member-scoped paths.
- Business-ready multi-couple support depends on refactoring the personal-only seed/onboarding model.

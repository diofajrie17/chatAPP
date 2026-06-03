# Pitfalls Research: Private Couple Chat App

**Date:** 2026-06-03
**Source:** Inline GSD research from `.codex/PRD.md`

## Critical Pitfalls

### Treating Client Checks as Security

Warning signs:
- UI checks `memberIds` but Firestore rules allow broad reads or writes.
- Client can create or update couple member arrays.

Prevention:
- Write rules and emulator tests for every collection before enabling client writes.
- Validate exactly two members and immutable sender/owner IDs in rules.

Phase mapping: Phases 1, 2, 3, and 4.

### Storing Plaintext Sensitive Content

Warning signs:
- `text`, `body`, `caption`, or note content fields appear in Firestore writes.
- Dashboard preview stores decrypted snippets.

Prevention:
- Require `ciphertext`, `nonce` or `iv`, `algorithm`, and `keyVersion` for sensitive payloads.
- Keep previews decrypted only in memory after authorized reads.

Phase mapping: Phases 2, 3, and 4.

### Misusing Web Crypto

Warning signs:
- Reused AES-GCM IVs/nonces.
- No key versioning.
- No recovery/key-change story.
- Marketing copy overclaims security.

Prevention:
- Use unique random IVs per encryption operation.
- Store algorithm and keyVersion with each payload.
- Add tests for encrypt/decrypt, wrong key failure, and different ciphertext for repeated plaintext.
- Document limitations plainly.

Phase mapping: Phases 2 and 4.

### Overbuilding Business Features Too Early

Warning signs:
- Admin dashboards, payments, custom URLs, or public onboarding appear before personal MVP validation.

Prevention:
- Keep Phase 5 to preparation and research unless personal usage validates demand.
- Separate future SaaS requirements from the personal MVP.

Phase mapping: Phase 5.

### PWA and Notification Assumptions

Warning signs:
- Assuming install prompts and push flows behave the same on iOS and Android.
- Notification payload includes sender text.

Prevention:
- Verify install and notification behavior on target devices.
- Keep notification payload generic.

Phase mapping: Phases 2, 4, and 5.

---
phase: 01-basic-private-space
reviewed: 2026-06-05T09:17:03Z
depth: standard
files_reviewed: 23
files_reviewed_list:
  - README.md
  - assets/css/main.css
  - components/AnniversaryCountdown.vue
  - components/FeatureCard.vue
  - components/ui/alert/Alert.vue
  - components/ui/badge/Badge.vue
  - components/ui/button/Button.vue
  - components/ui/card/Card.vue
  - components/ui/input/Input.vue
  - components/ui/label/Label.vue
  - components/ui/skeleton/Skeleton.vue
  - composables/useCoupleSpace.ts
  - composables/useFirebaseAuth.ts
  - firestore.rules
  - lib/utils.ts
  - nuxt.config.ts
  - package.json
  - pages/dashboard.vue
  - pages/login.vue
  - pages/settings.vue
  - public/manifest.webmanifest
  - tailwind.config.ts
  - types/couple.ts
findings:
  critical: 1
  warning: 3
  info: 0
  total: 4
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-06-05T09:17:03Z
**Depth:** standard
**Files Reviewed:** 23
**Status:** issues_found

## Summary

Reviewed the Phase 01 Nuxt/Firebase source files at standard depth, including the configured file list plus directly referenced Firebase plugin and auth middleware for context. `npm run typecheck` and `npm run build` both pass, but the implementation still has a privacy-blocking stale-state bug and several robustness/verification gaps around Firestore-backed metadata.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01 [BLOCKER]: Couple state can leak across logout and account switches

**File:** `composables/useCoupleSpace.ts:66`

**Issue:** `loadCoupleSpace()` starts a new authenticated load by setting loading/error flags, but it does not clear the existing `profile` or `couple` state before fetching the new user's Firestore documents. Those states are Nuxt `useState()` values, so they survive route changes in the same browser session. `logout()` in `composables/useFirebaseAuth.ts:52` clears only `auth:user`, and the dashboard renders `couple?.displayName` and `profile?.displayName` in `pages/dashboard.vue:70` and `pages/dashboard.vue:72` even while the next load is pending. If a user logs out and another user signs in on the same device, the second user can see the prior couple name/profile during loading; if their profile/couple load fails, the stale values remain behind the error state. `pages/settings.vue:84` can also render the form after a failed load using stale `couple` data.

**Fix:**

```ts
const clearCoupleSpace = () => {
  profile.value = null
  couple.value = null
}

const loadCoupleSpace = async () => {
  clearCoupleSpace()

  if (!user.value) {
    accessErrorCode.value = null
    error.value = null
    return
  }

  isLoading.value = true
  error.value = null
  accessErrorCode.value = null

  try {
    // existing profile/couple reads
  } catch (loadError) {
    clearCoupleSpace()
    // existing error mapping
  } finally {
    isLoading.value = false
  }
}
```

Also clear the couple-space state on logout, or expose a `resetCoupleSpace()` composable helper and call it before navigating to `/login`.

## Warnings

### WR-01 [WARNING]: Anniversary dates are only regex-checked and Firestore accepts arbitrary strings

**File:** `firestore.rules:19`

**Issue:** Firestore rules only require `anniversaryDate is string`, while the client validators in `composables/useCoupleSpace.ts:34` and `pages/settings.vue:46` only check the `YYYY-MM-DD` shape. Invalid dates such as `2024-02-31` pass the client regex and are normalized by JavaScript `Date` in `components/AnniversaryCountdown.vue:23`, producing a different calendar day. A member can also bypass the UI and write any string that passes the current security rules, leaving the dashboard in an invalid or misleading state.

**Fix:** Use one shared client-side validator that round-trips the parsed date, and tighten Firestore rules to at least enforce the allowed wire format and bounded string shape.

```ts
const isValidAnniversaryDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const [, year, month, day] = match.map(Number)
  const parsed = new Date(year, month - 1, day)

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  )
}
```

For rules, add a helper such as `isAnniversaryDate(value)` using `matches()` to reject arbitrary strings, and call it from `hasValidCoupleShape()`.

### WR-02 [WARNING]: Settings submit rethrows handled update failures into Vue's global error path

**File:** `pages/settings.vue:51`

**Issue:** `updateCoupleMetadata()` catches Firestore update failures, sets a user-facing error, and rethrows. `submitSettings()` awaits it without a local `try/catch`, so permission/network failures bubble out of the form submit handler after the composable has already handled them. This can produce noisy global errors and makes the page's failure path depend on framework-level error handling.

**Fix:**

```ts
try {
  await updateCoupleMetadata({
    anniversaryDate: nextAnniversaryDate,
    displayName: nextDisplayName
  })

  successMessage.value = 'Private space updated.'
  window.setTimeout(() => {
    void navigateTo('/dashboard')
  }, 700)
} catch {
  successMessage.value = null
}
```

Alternatively, stop rethrowing inside `updateCoupleMetadata()` once it has set the composable error state.

### WR-03 [WARNING]: Security rules have no automated verification despite being the access boundary

**File:** `package.json:5`

**Issue:** The only automated checks documented for Phase 01 are `npm run typecheck` and `npm run build` in `README.md:132`, and `package.json` has no script for Firestore rules tests. The README correctly states that Firestore rules are the real access boundary, but there is no emulator/rules-unit test coverage for non-member denial, UID spoofing, member-only reads, or metadata-only updates. This leaves the most security-sensitive Phase 01 behavior manually verified at best.

**Fix:** Add Firestore emulator rules tests and wire them into package scripts.

```json
{
  "scripts": {
    "test:rules": "firebase emulators:exec --only firestore \"vitest run tests/firestore-rules\"",
    "verify": "npm run typecheck && npm run test:rules && npm run build"
  },
  "devDependencies": {
    "@firebase/rules-unit-testing": "^4.0.0",
    "vitest": "^3.0.0"
  }
}
```

At minimum, cover: a user cannot read another `users/{uid}` document, non-members cannot read a couple, members cannot change `memberIds`, members cannot create/delete couples, and metadata updates reject invalid `anniversaryDate` values.

---

_Reviewed: 2026-06-05T09:17:03Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_

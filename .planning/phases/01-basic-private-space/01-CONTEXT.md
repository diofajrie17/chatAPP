# Phase 01: Basic Private Space - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 finishes the private two-user Nuxt/Firebase foundation. It covers sign-in, session persistence, seeded user/couple data, authenticated dashboard, member-only Firestore access, safe couple metadata editing, calm access-error states, install metadata for a PWA baseline, and local GitHub repository setup.

This phase does not add chat, encrypted message storage, notes, album uploads, push notifications, public onboarding, group membership, or business/SaaS flows.

</domain>

<decisions>
## Implementation Decisions

### Seeded Setup Policy
- **D-01:** Couple and user creation remains admin/seed-controlled. Phase 1 must not add arbitrary client-side couple creation or user profile creation.
- **D-02:** Configured couple members may edit safe couple metadata only: `displayName` and `anniversaryDate`.
- **D-03:** `memberIds`, roles, user UIDs, document IDs, and couple membership stay immutable from the client.
- **D-04:** Phase 1 should include the actual edit UI for safe couple metadata.
- **D-05:** Safe metadata editing belongs on a separate `/settings` route.
- **D-06:** `/settings` uses the same member-only access policy as `/dashboard`; either configured member can edit safe couple metadata.
- **D-07:** Anniversary editing uses a required browser date input with `YYYY-MM-DD` validation and inline validation before save.
- **D-08:** After successful save, show a brief success state and navigate back to `/dashboard`.

### Dashboard Shape
- **D-09:** Dashboard should feel like a private home overview, not a setup console.
- **D-10:** Dashboard shows couple name, anniversary countdown, configured anniversary date, and clear feature cards for upcoming Chat, Notes, and Album.
- **D-11:** Chat/Notes/Album cards are disabled preview cards in Phase 1 and must not navigate to placeholder pages.
- **D-12:** Add a visible Settings button near Logout in the dashboard header.

### Access Errors
- **D-13:** If a signed-in user's `users/{uid}` document is missing, show calm "not configured yet" copy with logout and setup guidance.
- **D-14:** If the user document exists but the couple document is missing or malformed, show "setup incomplete" copy and suggest rerunning the seed script or checking Firebase.
- **D-15:** If a signed-in user is not one of the couple's two `memberIds`, show calm "private space unavailable" copy saying the account is not a member of this private space.
- **D-16:** User-facing setup/access errors should not show raw Firebase paths, exception text, or technical details. Detailed errors may go to console/dev logs only.

### PWA Baseline
- **D-17:** Phase 1 PWA scope is install metadata only: web app manifest, app name, icons, theme color, and mobile-friendly install metadata.
- **D-18:** Phase 1 should not add offline shell/service-worker behavior yet.
- **D-19:** Manifest app identity should be `Our Private Space`.
- **D-20:** Use simple generated/static icons matching the current app palette; do not use personal/couple imagery in Phase 1.
- **D-21:** PWA verification should be a documented manual Add to Home Screen check on target device/browser.

### GitHub Repository Setup
- **D-22:** Phase 1 must ensure the local git repository has `origin` configured to `https://github.com/diofajrie17/chatAPP.git` for fetch and push.
- **D-23:** Phase 1 should verify the remote with `git remote -v`; pushing is a separate user-controlled action unless explicitly requested.

### the agent's Discretion
- Technical implementation details are open as long as they preserve the locked decisions above and existing Nuxt/Firebase patterns.
- The planner may decide exact component/composable structure for `/settings`, validation helpers, and Firestore update calls.
- The planner may choose exact calm error copy, provided it avoids raw technical details in the user-facing UI.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product And Scope
- `.codex/PRD.md` - Original product requirements, MVP scope, non-goals, security goals, data model, and milestone breakdown.
- `.planning/PROJECT.md` - Project context, core value, constraints, and locked project-level decisions.
- `.planning/REQUIREMENTS.md` - Phase 1 requirement IDs and traceability.
- `.planning/ROADMAP.md` - Phase boundary, success criteria, and MVP mode.
- `.planning/STATE.md` - Current project state and Phase 1 partial-implementation concern.
- `README.md` - Existing Phase 1 behavior, seed setup, security model, and architecture notes.

### Existing Code
- `plugins/firebase.client.ts` - Firebase client initialization and injected Auth/Firestore services.
- `composables/useFirebaseAuth.ts` - Auth listener, email/password login, persistence, logout, and shared auth state.
- `middleware/auth.global.ts` - Client route protection and login/dashboard redirects.
- `composables/useCoupleSpace.ts` - Existing user profile and couple document loading logic.
- `pages/dashboard.vue` - Existing authenticated dashboard, logout action, feature cards, and anniversary panel integration.
- `pages/login.vue` - Existing sign-in page and login submit flow.
- `components/AnniversaryCountdown.vue` - Existing anniversary countdown behavior and date display hook point.
- `types/couple.ts` - Existing `UserProfile` and `Couple` types.
- `firestore.rules` - Existing read-only member access rules.
- `scripts/seedFirebase.mjs` - Existing trusted seed script for two users and one couple document.
- `assets/css/main.css` - Current visual palette and component styling patterns.
- `.git/config` - Local-only git remote configuration; verify `origin` points to `https://github.com/diofajrie17/chatAPP.git`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useFirebaseAuth()` already provides `user`, `login`, `logout`, and `initAuthListener`; `/settings` should reuse it rather than adding separate auth state.
- `useCoupleSpace()` already loads `profile` and `couple`; extend or complement this composable for safe metadata updates.
- `AnniversaryCountdown.vue` already calculates the next anniversary from a `YYYY-MM-DD` string and displays the configured date.
- `FeatureCard.vue` and `assets/css/main.css` provide existing card, panel, and button styling for dashboard previews and settings UI.
- `scripts/seedFirebase.mjs` is the trusted setup path and should remain the only Phase 1 creation path for users/couples.

### Established Patterns
- Nuxt composables store shared state with `useState`.
- Firebase services are accessed through `nuxtApp.$firebase`.
- Routes are protected by `middleware/auth.global.ts`, with `/login` as the only public route so far.
- The UI uses calm, card-like panels, 8px radii, and a muted warm/teal palette.
- Firestore rules currently deny client writes to `users`, `couples`, and subcollections; Phase 1 planning must add only narrow member writes for `displayName` and `anniversaryDate`.

### Integration Points
- Add `/settings` as a protected page under the existing global auth middleware.
- Add a Settings button near Logout in `pages/dashboard.vue`.
- Add Firestore update support for `couples/{coupleId}.displayName` and `couples/{coupleId}.anniversaryDate`.
- Update `firestore.rules` to allow member-only updates for those two safe fields while preserving immutable `memberIds`.
- Update docs with manual PWA Add to Home Screen verification steps.
- Verify local git remote setup with `git remote -v`.

</code_context>

<specifics>
## Specific Ideas

- Dashboard should read as a private home overview, not a setup or admin console.
- Access-error language should be calm and non-technical:
  - missing user document: "not configured yet"
  - missing/malformed couple: "setup incomplete"
  - non-member: "private space unavailable"
- `/settings` should be visibly reachable but not dominate the dashboard.
- Manifest display name should be `Our Private Space`.
- GitHub remote URL should be `https://github.com/diofajrie17/chatAPP.git`.

</specifics>

<deferred>
## Deferred Ideas

- Offline shell/service worker behavior is deferred beyond Phase 1.
- Client-side onboarding/couple creation is deferred beyond Phase 1.
- Placeholder pages for unavailable Chat/Notes/Album are deferred; Phase 1 uses disabled preview cards.
- Personal/couple imagery for PWA icons is deferred.

</deferred>

---

*Phase: 01-Basic Private Space*
*Context gathered: 2026-06-03*

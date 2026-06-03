# Phase 01: Basic Private Space - Research

**Researched:** 2026-06-03
**Status:** Ready for UI design gate
**Phase requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, SPCE-01, SPCE-02, SPCE-03, SPCE-04, DASH-01, DASH-02, PWA-01, REPO-01

## Research Question

What does the planner need to know to finish Phase 1 without widening the app beyond a private, seed-controlled two-person Nuxt/Firebase foundation?

## Existing Implementation Inventory

- `plugins/firebase.client.ts` initializes Firebase Auth and Firestore from Nuxt runtime config and injects them through `nuxtApp.$firebase`.
- `composables/useFirebaseAuth.ts` already owns shared auth state, email/password login, browser-local session persistence, logout, and auth listener initialization.
- `middleware/auth.global.ts` already protects every client route except `/login`, so adding `pages/settings.vue` should inherit the same authenticated-route guard.
- `composables/useCoupleSpace.ts` already loads `users/{uid}`, then `couples/{coupleId}`, validates profile UID and membership, and exposes `profile`, `couple`, `isLoading`, `error`, and `loadCoupleSpace`.
- `pages/dashboard.vue` already shows the couple name, signed-in identity, logout, `AnniversaryCountdown`, and disabled-looking feature cards. It needs a clearer private-home layout, a Settings action near Logout, and calmer access-error mapping.
- `components/AnniversaryCountdown.vue` already accepts a `YYYY-MM-DD` anniversary string and shows both countdown and date-oriented copy.
- `firestore.rules` currently allows only self reads on `users/{userId}` and member reads on valid existing `couples/{coupleId}` documents; all client writes are denied.
- `scripts/seedFirebase.mjs` is the trusted setup path and should remain the only Phase 1 path that creates Auth users, user profile documents, and the couple document.
- `origin` is already configured locally to `https://github.com/diofajrie17/chatAPP.git`; the plan only needs a verification task, not another remote mutation.

## Official Documentation Findings

- Firestore rules support field-level update control with `request.resource.data.diff(resource.data).affectedKeys().hasOnly([...])`, which is the right primitive for allowing only `displayName` and `anniversaryDate` metadata edits. Source: [Firebase - Control access to specific fields](https://firebase.google.com/docs/firestore/security/rules-fields).
- Firestore rules can enforce types with the `is` operator, including `string`; optional fields should be checked with `get(field, default)` to avoid deny-by-error surprises. Source: [Firebase - Control access to specific fields](https://firebase.google.com/docs/firestore/security/rules-fields).
- Client-side Firestore partial updates should use the modular Web SDK `updateDoc(docRef, fields)` rather than `setDoc` for this metadata edit, because Phase 1 must not overwrite or recreate couple documents from the client. Source: [Firebase - Add data to Cloud Firestore](https://firebase.google.com/docs/firestore/manage-data/add-data).
- Nuxt creates routes from files in `pages/`, and global route middleware with a `.global` suffix runs on every route change. This supports adding `pages/settings.vue` without adding a separate route-registration layer. Source: [Nuxt - Routing](https://nuxt.com/docs/3.x/getting-started/routing), [Nuxt - Middleware](https://nuxt.com/docs/3.x/guide/directory-structure/middleware).
- A PWA manifest should be linked from HTML, can be named `app.webmanifest` or `manifest.json`, and includes app metadata such as name, icons, and theme color. Browser devtools can inspect it; Safari install verification is manual. Source: [web.dev - Web app manifest](https://web.dev/learn/pwa/web-app-manifest?hl=en).
- `theme_color` should be a valid opaque color and may be used by browsers for app-like UI surfaces after install. Source: [MDN - theme_color](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color).

## Planning Implications

### Safe Metadata Editing

The plan should add a member-only `/settings` page that:

- Loads the existing `couple` through `useCoupleSpace`.
- Lets either configured member edit `displayName` and `anniversaryDate` only.
- Uses a required `<input type="date">` for `anniversaryDate`.
- Performs inline validation before save: non-empty date string and `YYYY-MM-DD` shape.
- Calls a composable method such as `updateCoupleMetadata({ displayName, anniversaryDate })`.
- Uses Firestore `updateDoc(doc(db, 'couples', profile.coupleId), { displayName, anniversaryDate })`.
- Updates local `couple` state after save or reloads the couple space.
- Shows brief success feedback, then navigates back to `/dashboard`.

The plan should not add client-side user creation, couple creation, arbitrary profile edits, member management, role edits, or document ID changes.

### Firestore Rules

The rules plan should keep the current read model and add only a narrow `allow update` for `couples/{coupleId}`. Recommended shape:

- `signedIn()` remains required.
- Membership should be checked against the existing `resource.data.memberIds`, not client-submitted `request.resource.data.memberIds`.
- Existing couple shape must still be valid before and after update.
- Changed fields must satisfy `request.resource.data.diff(resource.data).affectedKeys().hasOnly(['displayName', 'anniversaryDate'])`.
- `request.resource.data.memberIds == resource.data.memberIds` should be explicit even though `hasOnly` already blocks changed fields, because membership immutability is a central product guarantee.
- `anniversaryDate` must remain a string.
- `displayName` should remain a string. If the field is optional, use `request.resource.data.get('displayName', '') is string`.
- Client `create` and `delete` for couples remain denied.
- `users/{userId}` client writes remain denied.
- Couple subcollections remain denied until later phases introduce chat, notes, and album rules.

Do not allow `updatedAt` from the client in Phase 1 unless the planner explicitly decides it is worth adding and rules restrict it. It is simpler and safer to skip client timestamps for this metadata-only slice.

### Dashboard And Access Errors

The planner should treat the dashboard as a private home overview:

- Keep couple name as the primary page identity.
- Show anniversary countdown and configured anniversary date.
- Show disabled preview cards for Chat, Notes, and Album. The current fourth "Memories" card is outside locked Phase 1 decisions and should be removed or folded into deferred copy.
- Add a Settings button beside Logout, with visual weight below the main private-home content.
- Do not add placeholder routes for disabled features.

`useCoupleSpace` should stop surfacing raw exception messages directly to the UI. Recommended plan:

- Introduce a small access-error category, for example `missing-profile`, `missing-couple`, `malformed-couple`, `not-member`, and `unknown`.
- User-facing copy:
  - Missing `users/{uid}`: "This account is not configured yet."
  - Missing or malformed couple doc: "Your private space setup is incomplete."
  - Non-member: "This account is not a member of this private space."
- Log raw technical details only to `console.error` or dev logs.
- Provide Logout from access-error panels.

### PWA Baseline

Phase 1 should add install metadata only:

- Add a manifest with `name: "Our Private Space"`, a short name, `start_url`, `scope`, `display: "standalone"`, `background_color`, `theme_color`, and 192/512 icon entries.
- Link the manifest and theme color via Nuxt app head configuration.
- Add simple static/generated icons in the existing palette; avoid personal imagery.
- Do not add service worker, offline shell, precaching, or push behavior yet.
- Document a manual Add to Home Screen verification step in `README.md`.

### GitHub Remote

The plan should verify, not mutate unless necessary:

- Run `git remote -v`.
- Confirm both fetch and push `origin` entries equal `https://github.com/diofajrie17/chatAPP.git`.
- Do not push as part of Phase 1 unless the user explicitly asks.

## Suggested Plan Slices

1. Harden and classify couple-space loading errors.
2. Add safe metadata update support in the composable layer.
3. Add `/settings` route and form flow.
4. Update dashboard navigation, preview cards, and access-error panels.
5. Narrowly update Firestore rules for member metadata edits.
6. Add PWA manifest, icons, head tags, and manual install documentation.
7. Verify git remote and run local checks.

## Verification Targets

- `npm run typecheck`
- `npm run build`
- Manual browser check: login -> dashboard -> settings -> save metadata -> success -> dashboard shows updated name/date.
- Manual negative rules checks or Firebase console/emulator smoke checks:
  - unauthenticated read denied
  - non-member couple read denied
  - member metadata update allowed
  - member update attempting `memberIds` or extra fields denied
  - client user/couple creation denied
- Manifest check in browser devtools plus documented manual Add to Home Screen check.
- `git remote -v` confirms `origin` fetch and push URL.

## Risks And Pitfalls

- `useCoupleSpace` currently casts Firestore data to `Couple`; malformed data can still produce runtime errors before calm category mapping unless guarded carefully.
- Firestore rules can deny by evaluation error when optional fields are accessed directly; use `get()` for optional `displayName`.
- Client-side validation is user experience only; Firestore rules still need type and changed-field restrictions.
- `updateDoc` fails if the couple document does not exist, which is desired because client creation is out of scope.
- PWA install behavior varies by browser. Treat Safari/iOS verification as manual rather than automatable in Phase 1.
- The current app files are untracked in git. Planning and documentation commits should stage only `.planning` artifacts unless the user starts execution work.

## Research Conclusion

Phase 1 can be planned as a narrow completion pass over the existing Nuxt/Firebase foundation. The key planning constraint is to allow exactly one new client write surface, the couple metadata update, while keeping setup seed-controlled and preserving member-only access. The frontend work is real enough to require a UI design contract before `PLAN.md` is generated.

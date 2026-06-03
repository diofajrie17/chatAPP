# Phase 01: Basic Private Space - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 01-Basic Private Space
**Areas discussed:** Seeded Setup Policy, Dashboard Shape, Access Errors, PWA Baseline, GitHub Repository Setup

---

## Seeded Setup Policy

| Option | Description | Selected |
|--------|-------------|----------|
| Admin seed only | Keep all profile/couple creation and edits in `npm run firebase:seed` or Firebase Console; client reads only. | |
| Members can edit metadata | Members can update safe fields like couple display name and anniversary date, but cannot change member IDs. | Yes |
| Client onboarding | One signed-in user can create the couple space from the app; partner setup is still constrained. | |

**User's choice:** Members can edit metadata.
**Notes:** Creation remains admin/seed-controlled. Members may edit safe metadata only.

| Option | Description | Selected |
|--------|-------------|----------|
| Display name + anniversary only | Members can update `displayName` and `anniversaryDate`; `memberIds`, roles, user UIDs, and couple ID stay immutable. | Yes |
| Display name only | Keep anniversary seeded/admin-controlled for now. | |
| All non-member couple fields | Members can update `displayName`, `anniversaryDate`, and future safe metadata like theme placeholders. | |

**User's choice:** Display name + anniversary only.
**Notes:** This locks the Phase 1 safe-write boundary.

| Option | Description | Selected |
|--------|-------------|----------|
| Include edit UI | Add a small settings/edit surface for couple display name and anniversary date in Phase 1. | Yes |
| Rules/data only | Allow safe writes in rules/composable, but leave UI editing for a later phase. | |
| No edits until later | Record the member-edit decision, but keep Phase 1 read-only in implementation. | |

**User's choice:** Include edit UI.
**Notes:** Editing must be part of Phase 1, not just a backend/rules allowance.

| Option | Description | Selected |
|--------|-------------|----------|
| Inline dashboard settings | A compact edit panel on the dashboard updates display name and anniversary date. | |
| Separate settings page | Add a dedicated `/settings` route for couple metadata. | Yes |
| Modal edit dialog | Keep dashboard clean and open edits in a modal. | |

**User's choice:** Separate settings page.
**Notes:** `/settings` is the canonical edit surface.

| Option | Description | Selected |
|--------|-------------|----------|
| Same member-only access as dashboard | Any configured couple member can open `/settings` and edit safe couple metadata. | Yes |
| Owner/admin only | Only one seeded owner user can edit, partner can view dashboard but not settings. | |
| Password re-entry before save | Either member can edit, but saving requires re-entering password. | |

**User's choice:** Same member-only access as dashboard.
**Notes:** No owner/admin distinction in Phase 1 settings.

| Option | Description | Selected |
|--------|-------------|----------|
| Simple date input | Use browser date input; require `YYYY-MM-DD`; show an inline validation message before saving. | Yes |
| Allow blank anniversary | User can clear the date and dashboard falls back to "Set in settings." | |
| Month/day only | Store only month and day so the year is never part of the relationship date. | |

**User's choice:** Simple date input.
**Notes:** Anniversary remains required and stored as `YYYY-MM-DD`.

| Option | Description | Selected |
|--------|-------------|----------|
| Return to dashboard | Save, show a brief success state, then navigate back to `/dashboard`. | Yes |
| Stay on settings | Save and keep the user on `/settings` with updated values. | |
| Ask each time | Offer "Save and stay" and "Save and return." | |

**User's choice:** Return to dashboard.
**Notes:** Save flow should briefly confirm success, then return home.

---

## Dashboard Shape

| Option | Description | Selected |
|--------|-------------|----------|
| Private home overview | Couple name, anniversary countdown, and clear feature cards for Chat/Notes/Album as "coming next." | Yes |
| Setup-focused dashboard | Emphasize Firebase/setup status, seeded user/couple status, and links to `/settings`. | |
| Minimal dashboard | Only couple name, anniversary countdown, logout, and settings link; no feature cards yet. | |

**User's choice:** Private home overview.
**Notes:** Dashboard should feel like a private home, not a setup console.

| Option | Description | Selected |
|--------|-------------|----------|
| Disabled preview cards | Show Chat/Notes/Album as upcoming features, but do not navigate yet. | Yes |
| Navigate to placeholder pages | Each card opens a simple "coming soon" page. | |
| Hide unavailable features | Only show features that are implemented in Phase 1. | |

**User's choice:** Disabled preview cards.
**Notes:** No placeholder routes for unavailable features in Phase 1.

| Option | Description | Selected |
|--------|-------------|----------|
| Header button | Add a visible Settings button near Logout. | Yes |
| Feature card | Add Settings as one of the dashboard cards. | |
| Text link only | Add a quieter settings link under the couple metadata. | |

**User's choice:** Header button.
**Notes:** `/settings` should be easy to find.

| Option | Description | Selected |
|--------|-------------|----------|
| Countdown only | Keep "days until next anniversary" as the primary display. | |
| Countdown + date | Show days until next anniversary plus the configured date. | Yes |
| Countdown + days together | Add "days together" now too. | |

**User's choice:** Countdown + date.
**Notes:** Do not add days-together in Phase 1.

---

## Access Errors

| Option | Description | Selected |
|--------|-------------|----------|
| Not configured yet | Calm message with logout and setup instructions. | Yes |
| Access denied | Stricter security-style denial with logout only. | |
| Setup troubleshooting | Detailed checklist explaining missing user doc, couple doc, and seed script steps. | |

**User's choice:** Not configured yet.
**Notes:** Applies when `users/{uid}` is missing after sign-in.

| Option | Description | Selected |
|--------|-------------|----------|
| Setup incomplete | Explain that the private space setup is incomplete and suggest rerunning the seed script or checking Firebase. | Yes |
| Access denied | Treat all couple-load failures as denial to avoid exposing setup details. | |
| Technical error details | Show exact Firestore path/error for easier local debugging. | |

**User's choice:** Setup incomplete.
**Notes:** Applies when the couple document is missing or malformed.

| Option | Description | Selected |
|--------|-------------|----------|
| Private space unavailable | Calm, non-technical copy that says this account is not a member of the private space. | Yes |
| Unauthorized | Clear security wording that the account is not authorized. | |
| Setup mismatch | Explain that the signed-in UID does not match the configured couple members. | |

**User's choice:** Private space unavailable.
**Notes:** Applies to signed-in non-members.

| Option | Description | Selected |
|--------|-------------|----------|
| Console only | User-facing UI stays calm; detailed errors can go to console/dev logs. | Yes |
| Expandable details | User sees calm copy with an optional Details expander. | |
| Always visible | Show technical error text directly in the UI for local debugging. | |

**User's choice:** Console only.
**Notes:** Raw Firebase/debug details must not appear in the user-facing UI.

---

## PWA Baseline

| Option | Description | Selected |
|--------|-------------|----------|
| Install metadata only | Web app manifest, app name, icons, theme color, and mobile-friendly install metadata. No offline shell yet. | Yes |
| Offline shell too | Add service worker/offline fallback so the app opens when offline, even if Firebase data cannot load. | |
| Documentation only | Document PWA setup steps but do not implement PWA files yet. | |

**User's choice:** Install metadata only.
**Notes:** Offline shell/service worker behavior is deferred.

| Option | Description | Selected |
|--------|-------------|----------|
| Private Couple App | Generic and safe if screenshots/device UI are seen. | |
| Our Private Space | Warmer and more personal. | Yes |
| Custom couple name from Firebase | More personal, but manifest is static and cannot easily follow Firestore data. | |

**User's choice:** Our Private Space.
**Notes:** Use this as the manifest app identity.

| Option | Description | Selected |
|--------|-------------|----------|
| Simple generated icons | Add basic static icons that match the current app palette; no custom couple imagery yet. | Yes |
| No icons yet | Manifest only, icon work deferred. | |
| User-provided image | Use a personal/couple image as the icon source. | |

**User's choice:** Simple generated icons.
**Notes:** No personal/couple imagery in Phase 1 icons.

| Option | Description | Selected |
|--------|-------------|----------|
| Documented manual check | Add README steps to verify Add to Home Screen on target device/browser. | Yes |
| Automated Lighthouse check | Add a command/check that validates manifest basics. | |
| Both manual + automated | Document target-device check and add an automated manifest/Lighthouse-style sanity check. | |

**User's choice:** Documented manual check.
**Notes:** Manual Add to Home Screen check is the Phase 1 verification requirement.

---

## the agent's Discretion

- Exact component/composable structure for settings.
- Exact calm error copy, as long as it matches the selected tone and hides technical details.
- Exact generated icon files and palette application.
- Exact placement of GitHub remote verification in the plan, as long as Phase 1 verifies `origin` points to `https://github.com/diofajrie17/chatAPP.git`.

## Deferred Ideas

- Offline shell/service worker behavior.
- Client-side onboarding/couple creation.
- Placeholder pages for Chat/Notes/Album.
- Personal/couple imagery for PWA icons.

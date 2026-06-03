---
phase: 01
slug: basic-private-space
status: approved
shadcn_initialized: false
preset: planned via shadcn-vue init
created: 2026-06-03
---

# Phase 01 - UI Design Contract

> Visual and interaction contract for Phase 1 frontend work. This contract covers login continuity, the authenticated dashboard, `/settings`, calm access-error states, and PWA install metadata.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn-vue planned for Phase 1 execution |
| Preset | Use shadcn-vue default Nuxt setup after initialization |
| Component library | shadcn-vue official components, built on Reka UI and Tailwind CSS |
| Icon library | none |
| Font | Inter fallback stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |

Phase 1 should introduce shadcn-vue for the app UI while preserving the current Nuxt/Vue architecture. The execution plan must include installing and configuring Tailwind plus shadcn-vue for Nuxt before migrating the Phase 1 screens. Do not use React shadcn/ui packages.

Approved shadcn-vue components for this phase:

- `Button`
- `Card`
- `Input`
- `Label`
- `Alert`
- `Badge`
- `Skeleton`

Do not add Dialog, Sheet, Drawer, Toast/Sonner, Sidebar, Calendar, or third-party registry blocks in Phase 1 unless a later plan explicitly justifies and vets them.

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Inline icon/text gaps only if icons are later introduced |
| sm | 8px | Label-to-input gaps, compact badge padding |
| md | 16px | Card grid gaps, form field groups |
| lg | 24px | Panel padding, section rhythm, mobile page padding |
| xl | 32px | Desktop page padding, major content gaps |
| 2xl | 48px | Top-level dashboard section breaks only |
| 3xl | 64px | Reserved for future full-page sections; not required in Phase 1 |

Exceptions: button horizontal padding may be 18px only where already present; avoid adding new non-scale values.

---

## Typography

Use exactly these four sizes and two weights in Phase 1 UI work. Tailwind/shadcn utility classes must map to this scale. Do not use viewport-scaled font sizes for new work.

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.55 |
| Label | 14px | 700 | 1.3 |
| Heading | 20px | 700 | 1.25 |
| Display | 40px desktop / 32px mobile | 700 | 1.0 |

Allowed weights: 400 and 700.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | #f8f5f1 | Page background and app shell only |
| Secondary (30%) | #ffffff | shadcn cards, forms, alerts, and error surfaces |
| Accent (10%) | #2f4d4f | Primary CTA, focus ring, active settings/dashboard action, anniversary display |
| Support accent | #9b4d45 | Eyebrow labels only |
| Muted text | #687174 | Secondary body copy |
| Border | #d8d1ca | Inputs and low-emphasis dividers |
| Destructive | #9f2d28 | Form errors and access-denied emphasis only |

Accent reserved for: primary action buttons, focus rings, active route/action state, and the anniversary countdown number. Do not use accent for every link, card title, badge, or decorative background.

---

## Screen Contracts

### Login

- Focal point: centered authentication panel.
- Primary CTA: `Sign in to space`.
- Error copy should be concise and user-actionable; avoid exposing Firebase exception text.
- Use a shadcn-vue `Card` with `Input`, `Label`, and `Button`.
- Keep the panel width at `min(100%, 440px)` and use the existing shell background color.

### Dashboard

- Focal point: couple name and anniversary countdown.
- Header actions: `Settings` and `Log out`, visually grouped on the right on desktop and stacked below the title on mobile.
- Dashboard must feel like a private home overview, not a setup console.
- Feature previews must show exactly three disabled cards: Chat, Notes, Album.
- Disabled feature cards must not look clickable and must not navigate.
- Remove or avoid a fourth "Memories" card in Phase 1.
- Use shadcn-vue `Card` for the anniversary area and feature previews, `Badge` for phase labels, and `Button` for header actions.

### Settings

- Focal point: metadata edit form for couple display name and anniversary date.
- Primary CTA: `Update private space`.
- Secondary CTA: `Return to dashboard`.
- Required fields: display name text input and anniversary date browser date input.
- Inline validation belongs below the relevant field.
- Success state copy appears above the form briefly before navigating back to dashboard.
- Use shadcn-vue `Card`, `Input`, `Label`, `Alert`, and `Button`.

### Access Errors

- Focal point: a single calm status panel with one problem, one next step, and a logout action.
- Missing user profile heading: `This account is not configured yet`.
- Missing or malformed couple heading: `Your private space setup is incomplete`.
- Non-member heading: `Private space unavailable`.
- Do not show Firestore paths, raw exception text, UIDs, document IDs, or rules details in user-facing copy.
- Use shadcn-vue `Alert` inside a single status `Card`.

---

## Interaction States

| Element | Required States |
|---------|-----------------|
| Primary button | default, hover/focus, disabled, submitting |
| Secondary button | default, hover/focus, disabled |
| Text/date inputs | default, focus, invalid |
| Status panel | loading, success, calm warning, error |
| Feature cards | disabled preview only |

Focus rings use #2f4d4f with visible contrast. Buttons and inputs keep minimum 44px touch targets.

When adding shadcn-vue components, keep copied components local to the repository and style them through the project theme/tokens rather than one-off per-screen overrides.

---

## Responsive Contract

| Breakpoint | Layout |
|------------|--------|
| >= 1120px | Page content max-width 1120px, dashboard header horizontal, feature grid 3 columns |
| 821px-1119px | Same max-width behavior, feature grid 3 columns where space permits |
| 561px-820px | Header stacks, settings/logout actions remain adjacent or wrap as a compact action row, feature grid 2 columns |
| <= 560px | Single-column layout, full-width form controls and buttons, feature grid 1 column |

Text must not overflow buttons, cards, status panels, or badges. Long copy wraps before it can overlap neighboring content.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Login primary CTA | `Sign in to space` |
| Dashboard settings CTA | `Settings` |
| Dashboard logout CTA | `Log out` |
| Settings primary CTA | `Update private space` |
| Settings secondary CTA | `Return to dashboard` |
| Settings success | `Private space updated.` |
| Missing profile heading | `This account is not configured yet` |
| Missing profile body | `Ask the app owner to run the trusted setup script for this account, then sign in again.` |
| Setup incomplete heading | `Your private space setup is incomplete` |
| Setup incomplete body | `Check the seeded couple record or rerun the Firebase setup script, then refresh this page.` |
| Non-member heading | `Private space unavailable` |
| Non-member body | `This account is not one of the two configured members for this private space.` |
| Unknown access error heading | `We could not load your private space` |
| Unknown access error body | `Try refreshing, or sign out and check the Firebase setup before returning.` |
| Destructive confirmation | none; Phase 1 has no destructive UI action |

Do not use generic CTA labels such as `Submit`, `OK`, `Cancel`, or `Save`.

---

## PWA Visual Contract

- Manifest name: `Our Private Space`.
- Icons: simple static/generated marks using #f8f5f1 background, #2f4d4f primary shape, and #9b4d45 as a small support detail.
- Icons must not use personal/couple imagery.
- Theme color: #2f4d4f.
- PWA install docs should describe the manual check in README, not in the app UI.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn-vue official | Button, Card, Input, Label, Alert, Badge, Skeleton | official registry only |

No third-party UI registries or generated component blocks are approved for Phase 1.

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-06-03

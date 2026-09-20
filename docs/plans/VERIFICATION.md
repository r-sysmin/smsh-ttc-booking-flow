# Verification — Calendly Alternative

## Summary

All 9 screens from the spec's Screen List have been implemented across 13 per-screen commits. The implementation covers:

- **Landing page** (`/`) with header, hero, feature showcase, supporting features grid, testimonials, CTA banner, and footer
- **Auth** (`/auth`) with Google OAuth, tabbed sign-in/sign-up, forgot password, and check-your-email states
- **Event Types** (`/event-types`) with card list, blankslate, FTUX banner, booking URL strip, and meatball menu actions
- **Event Type Detail** (`/event-types/:id`) with view/edit mode, breadcrumb, delete confirm, and Save/Discard
- **Bookings** (`/bookings`) with Upcoming/Past/Cancelled tabs, count badges, row expand, and cancel confirm dialog
- **Availability** (`/availability`) with timezone selector, weekly schedule grid (7 days), checkboxes, time selects, and info alert
- **Settings** (`/settings`) with Profile tab (display name, username, bio, conferencing URL, avatar upload) and General tab (dark mode switch, logout)
- **Public Booking Index** (`/book/:username`) with profile card, event type list, and "Powered by CalendlyAlt" footer
- **Public Booking Flow** (`/book/:username/:slug`) with month/column view toggle, 12h/24h toggle, timezone auto-detection, slot calculator, guest form, confirmation, and calendar link generation

Infrastructure: `SeedDataProvider` with correct filter logic, `SupabaseDataProvider` with real Supabase queries and optimistic mutations, `AuthProvider` with `onAuthStateChange`/`getSession`, `ProtectedRoute`, typed seed data matching cloudboard spec, slot calculator, calendar link generators, and ICS file generator.

**What was intentionally not changed:** `components/ui/` (sacred shadcn), `components/ai-elements/` (sacred AI SDK), `index.css` (shadcn defaults), `base.css` (landing typography).

---

## Files changed

| File | Reason | Change summary |
|---|---|---|
| `src/App.tsx` | Routing | All routes wired: public (landing, auth, booking), demo (`/demo/*` with SeedDataProvider), protected (`/*` with SupabaseDataProvider + ProtectedRoute) |
| `src/data/seed.ts` | Seed data | Typed fixtures: profile, 4 eventTypes, 10 bookings, featureTabs, supportingFeatures, testimonials. Matches cloudboard spec verbatim |
| `src/lib/data-provider.tsx` | Data layer | SeedDataProvider + SupabaseDataProvider implementing CalendlyDataProvider interface. Seed filters match Supabase query logic |
| `src/lib/auth/auth-provider.tsx` | Auth | Supabase auth context with onAuthStateChange, getSession, signOut + React Query cache clear |
| `src/components/protected-route.tsx` | Auth | Redirects to `/auth?intent=signin` with `from` state when `!user` |
| `src/lib/filter-context.tsx` | State | Shared filter context for booking tab state |
| `src/components/base/badge.tsx` | UI | Color variant badge wrapper (gray, blue, amber, red, green, purple) |
| `src/style-pack.css` | Theme | Sky primary color tint |
| `src/integrations/supabase/client.ts` | Integration | Supabase client setup |
| `src/integrations/lovable/index.ts` | Integration | Lovable OAuth shim for Google sign-in |
| `src/layouts/workspace-layout-03.tsx` | Layout | Sidebar with CalendlyAlt wordmark, 4 nav items (Event Types, Bookings, Availability, Settings), Log out footer, breadcrumb header, collapsible sidebar |
| `src/pages/landing/index.tsx` | Screen 1 | Composes all landing sections with spec content |
| `src/pages/landing/components/header.tsx` | Screen 1 | Sticky header: CalendlyAlt wordmark, See demo, Sign in, Get started |
| `src/pages/landing/components/hero-02.tsx` | Screen 1 | Centered hero with headline, CTAs, browser mockup |
| `src/pages/landing/components/booking-mockup.tsx` | Screen 1 | Booking index mockup: Alex Morgan profile + 3 event types |
| `src/pages/landing/components/feature-showcase-01.tsx` | Screen 1 | Autoplay tab carousel for 4 product screenshots |
| `src/pages/landing/components/features-03.tsx` | Screen 1 | 4-tile icon grid (link, timezone, calendar, video) |
| `src/pages/landing/components/testimonial-02.tsx` | Screen 1 | 3-column testimonial grid |
| `src/pages/landing/components/cta-01.tsx` | Screen 1 | CTA banner: "Ready to reclaim your calendar?" |
| `src/pages/landing/components/footer.tsx` | Screen 1 | 4-column footer: CalendlyAlt, Product, Legal, Connect |
| `src/pages/auth/index.tsx` | Screen 2 | Auth page shell with CalendlyAlt branding, back/demo links |
| `src/pages/auth/components/auth-card.tsx` | Screen 2 | Google OAuth, tabbed sign-in/sign-up, forgot password, check-your-email states |
| `src/pages/auth/components/google-icon.tsx` | Screen 2 | Google logo SVG |
| `src/pages/event-types/index.tsx` | Screen 3 | Event Types list page with create button |
| `src/pages/event-types/components/event-type-list.tsx` | Screen 3 | List wrapper with loading/empty/populated states |
| `src/pages/event-types/components/event-type-row.tsx` | Screen 3 | Row card: icon, duration, name, description, badge toggle, copy link, meatball menu |
| `src/pages/event-types/components/blankslate.tsx` | Screen 3 | Skeleton bg + floating card: "No event types yet" |
| `src/pages/event-types/components/ftux-banner.tsx` | Screen 3 | Alert: "Complete your profile..." with "Go to Settings" link |
| `src/pages/event-types/components/booking-url-strip.tsx` | Screen 3 | URL strip with copy + open-in-new-tab actions |
| `src/pages/event-types/components/skeleton.tsx` | Screen 3 | Loading skeleton rows |
| `src/pages/event-types/detail.tsx` | Screen 4 | Detail page with view/edit toggle via `?mode=edit`, breadcrumb |
| `src/pages/event-types/components/detail-view.tsx` | Screen 4 | View mode: name, description, badge, duration, location, slug, booking link, delete |
| `src/pages/event-types/components/detail-edit.tsx` | Screen 4 | Edit mode: form fields with auto-slug, duration select, location radio, Save/Discard |
| `src/pages/event-types/components/delete-dialog.tsx` | Screen 4 | AlertDialog: "Delete [name]?" with Cancel/Delete |
| `src/pages/event-types/components/detail-skeleton.tsx` | Screen 4 | Loading skeleton for detail view |
| `src/pages/bookings/index.tsx` | Screen 5 | Tabbed bookings page with Upcoming/Past/Cancelled + count badges |
| `src/pages/bookings/components/booking-list.tsx` | Screen 5 | List wrapper with loading/empty/populated states |
| `src/pages/bookings/components/booking-row.tsx` | Screen 5 | Row: avatar, guest name/email, event type, date/time, status badge, cancel, row expand |
| `src/pages/bookings/components/cancel-booking-dialog.tsx` | Screen 5 | AlertDialog: "Cancel this booking?" with Keep it / Cancel booking |
| `src/pages/bookings/components/blankslate.tsx` | Screen 5 | Per-tab blankslates with appropriate copy |
| `src/pages/bookings/components/skeleton.tsx` | Screen 5 | Loading skeleton rows |
| `src/pages/availability/index.tsx` | Screen 6 | Availability page with timezone, schedule grid, save button, info alert |
| `src/pages/availability/components/schedule-grid.tsx` | Screen 6 | 7-day grid: checkboxes, start/end time selects (30-min increments) |
| `src/pages/availability/components/timezone-selector.tsx` | Screen 6 | Select dropdown with 30 IANA timezones + offset labels |
| `src/pages/settings/index.tsx` | Screen 7 | Settings page with Profile/General tabs |
| `src/pages/settings/components/profile-tab.tsx` | Screen 7 | Profile form: display name, username (with live preview), bio, conferencing URL, avatar upload |
| `src/pages/settings/components/general-tab.tsx` | Screen 7 | Dark mode switch + logout button |
| `src/pages/book/index.tsx` | Screen 8 | Public booking index: profile card + event type list + "Powered by CalendlyAlt" |
| `src/pages/book/components/profile-card.tsx` | Screen 8 | Avatar + name + bio card |
| `src/pages/book/components/event-type-list.tsx` | Screen 8 | Active event types list with "No events available" empty state |
| `src/pages/book/components/event-type-row.tsx` | Screen 8 | Clickable row: icon, duration, name, description, chevron |
| `src/pages/book-flow/index.tsx` | Screen 9 | Booking flow orchestrator: month/column view, 12h/24h, timezone, slot computation, state machine |
| `src/pages/book-flow/components/booker-meta.tsx` | Screen 9 | Sticky meta sidebar: avatar, host name, event info, timezone selector, mini calendar |
| `src/pages/book-flow/components/month-view.tsx` | Screen 9 | Calendar + single-day time slot column |
| `src/pages/book-flow/components/column-view.tsx` | Screen 9 | Multi-day slot grid with week navigation |
| `src/pages/book-flow/components/time-slot-button.tsx` | Screen 9 | Slot button with emerald dot + tabular-nums time |
| `src/pages/book-flow/components/guest-form.tsx` | Screen 9 | Guest form: name, email, notes, "Confirm booking" |
| `src/pages/book-flow/components/confirmation.tsx` | Screen 9 | "You're booked!" + calendar links + "Book another meeting" |
| `src/lib/slot-calculator.ts` | Utility | Slot availability computation: host schedule + timezone + booking subtraction |
| `src/lib/calendar-links.ts` | Utility | Google Calendar + Outlook URL generators |
| `src/lib/ics.ts` | Utility | Client-side .ics file generation + download |
| `src/pages/landing/components/product-mockups.tsx` | Screen 1 | Product screenshot mockups for feature showcase |

---

## Acceptance criteria

| AC | Screen | Status | Evidence |
|---|---|---|---|
| 1.1 | Landing — Header | PASS | `header.tsx`: "CalendlyAlt" wordmark, "See demo" (ghost → `/book/demo`), "Sign in" (ghost → `/auth?intent=signin`), "Get started" (filled → `/auth?intent=signup`). Sticky. "Sign in" hidden on mobile. |
| 1.2 | Landing — Hero | PASS | `hero-02.tsx` + `index.tsx:44`: "Stop the scheduling back-and-forth." headline, "Share one link. Let people book time with you." subhead, two CTAs, browser-chrome booking mockup. |
| 1.3 | Landing — Feature showcase | PASS | `feature-showcase-01.tsx`: 4 autoplay tabs (Event Types, Booking Page, Bookings, Availability) with product screenshots in browser chrome. |
| 1.4 | Landing — Supporting features | PASS | `features-03.tsx` + `index.tsx:28-34`: 4 tiles with correct icons (Link, Globe, Calendar, Video), correct headlines and body copy matching seed data. |
| 1.5 | Landing — Testimonials | PASS | `testimonial-02.tsx` + `index.tsx:36-42`: 3 cards — Jamie R. (Freelance Designer), Sam T. (Team Lead, Stackform), Priya N. (Independent Consultant) with exact quotes. |
| 1.6 | Landing — CTA banner | PASS | `cta-01.tsx`: "Ready to reclaim your calendar?" heading, "Get started -- it's free" → `/auth?intent=signup`. |
| 1.7 | Landing — Footer | PASS | `footer.tsx`: 4-column layout — CalendlyAlt wordmark, Product (Features/Demo/Sign in), Legal (Privacy/Terms), Connect (GitHub/Twitter). |
| 2.1 | Auth — Google OAuth | PASS | `auth-card.tsx:83`: "Continue with Google" button calls `lovable.auth.signInWithOAuth("google")` (correct Lovable broker, not direct Supabase). |
| 2.2 | Auth — Tab toggle | PASS | `auth-card.tsx`: shadcn Tabs with "Sign in" / "Sign up" triggers. `?intent=signup/signin` query param sets default tab. |
| 2.3 | Auth — Sign-in form | PASS | Email + password fields, "Forgot password?" link, "Sign in" submit button. Calls `supabase.auth.signInWithPassword`. |
| 2.4 | Auth — Sign-up form | PASS | Full name + email + password fields, "Create account" submit button. Calls `supabase.auth.signUp`. |
| 2.5 | Auth — Forgot password | PASS | In-place swap to "Reset your password" card with email input and "Send reset link" button. Calls `supabase.auth.resetPasswordForEmail`. |
| 2.6 | Auth — Check your email | PASS | In-place swap after sign-up or password reset with "Check your email" heading, confirmation email display, "Resend email" button. |
| 2.7 | Auth — Back to home | PASS | `auth/index.tsx:34`: IconArrowLeft + "Back to home" link → `/`. |
| 2.8 | Auth — Headings | PASS | "Welcome back" / "Sign in to your scheduling dashboard" for sign-in; "Create your account" / "Set up your scheduling page in minutes" for sign-up. |
| 3.1 | Event Types — Page header | PASS | `index.tsx:22`: h2 "Event Types", "New event type" button with IconPlus. |
| 3.2 | Event Types — Event type rows | PASS | `event-type-row.tsx`: IconClock + duration, name (semibold), description (muted), active/inactive badge (toggleable), "Copy link" button, meatball menu (Edit/Preview/Copy link/Delete). |
| 3.3 | Event Types — Row click navigation | PASS | `event-type-row.tsx:64`: clicking row body navigates to `/event-types/:id` (or `/demo/event-types/:id`). |
| 3.4 | Event Types — Blankslate | PASS | `blankslate.tsx`: skeleton bars with gradient, floating card: IconPlus, "No event types yet", "Create your first event type to start sharing your booking link.", "+ New event type" button. |
| 3.5 | Event Types — FTUX banner | PASS | `ftux-banner.tsx`: Alert with IconInfoCircle, "Complete your profile to make your booking page look great.", "Go to Settings" link. Hidden when `full_name` and `conferencing_url` are set. |
| 3.6 | Event Types — Booking URL strip | PASS | `booking-url-strip.tsx`: displays booking page URL, copy button (IconCopy), open-in-new-tab button (IconArrowRight), bg-muted styling. |
| 3.7 | Event Types — Delete confirm | PASS | `delete-dialog.tsx`: AlertDialog "Delete [name]?", "This event type and its booking link will be permanently removed. Existing bookings won't be affected.", Cancel + Delete buttons. |
| 3.8 | Event Types — Create flow | PASS | `index.tsx:17`: creates blank event type via mutation, navigates to detail in edit mode. |
| 4.1 | Event Type Detail — Breadcrumb | PASS | `workspace-layout-03.tsx:107-123`: breadcrumb showing "Event Types > [name]" with link back to list. `detail.tsx` sets breadcrumb label via `setBreadcrumbDetail`. |
| 4.2 | Event Type Detail — View mode | PASS | `detail-view.tsx`: name with IconClock, description, active badge (toggleable), Duration/Location/URL slug/Booking link info rows, Copy + Preview actions, "Delete this event type" destructive button. |
| 4.3 | Event Type Detail — Edit mode | PASS | `detail-edit.tsx`: Event name, URL slug (auto-generated from name, live preview), Duration select (15/30/45/60/90/120), Description textarea, Location radio (conferencing/in-person with conditional address input), Save/Discard buttons. |
| 4.4 | Event Type Detail — Save/Discard | PASS | Save writes via mutation, exits edit mode, shows toast "Saved". Discard reverts fields; deletes blank new records and navigates back. |
| 4.5 | Event Type Detail — URL preserves mode | PASS | `detail.tsx`: `?mode=edit` search param toggles edit mode, preserved on browser refresh. |
| 5.1 | Bookings — Tabs | PASS | `index.tsx:19-38`: Tabs with "Upcoming", "Past", "Cancelled" triggers. Count badges from `useBookingCounts()`. |
| 5.2 | Bookings — Booking rows | PASS | `booking-row.tsx`: Avatar with initials, guest name (semibold) + email (muted), event type name, formatted date/time, status badge (green "Confirmed" / gray "Cancelled"), Cancel button on upcoming only. |
| 5.3 | Bookings — Row expand | PASS | `booking-row.tsx:94-126`: click toggles expand, shows guest notes, location details, event type with duration, secondary "Cancel this booking" button. |
| 5.4 | Bookings — Cancel confirm | PASS | `cancel-booking-dialog.tsx`: "Cancel this booking?" title, guest name + event type + date/time summary, "The booking will be marked as cancelled. No notification is sent automatically.", "Keep it" + "Cancel booking" buttons. |
| 5.5 | Bookings — Blankslate | PASS | `blankslate.tsx`: Per-tab copy — "No upcoming bookings" / "When someone books time with you, it'll show up here." (upcoming), "No past bookings" (past), "No cancelled bookings" (cancelled). Calendar icon + skeleton bars. "Share your booking link" CTA on upcoming tab. |
| 5.6 | Bookings — Tab filtering | PASS | `data-provider.tsx:86-104` (seed): upcoming = confirmed + future, past = confirmed + past, cancelled = cancelled. Correct sort per tab. Supabase queries mirror this. |
| 6.1 | Availability — Timezone selector | PASS | `timezone-selector.tsx`: Select with 30 IANA timezones, offset labels via `Intl.DateTimeFormat`. |
| 6.2 | Availability — Weekly schedule grid | PASS | `schedule-grid.tsx`: 7 days (Mon-Sun), Checkbox per day, start/end Select dropdowns (30-min increments from 00:00-23:30). Unchecked days show "(unavailable)". End time filtered to after start time. |
| 6.3 | Availability — Save button | PASS | `index.tsx:56`: "Save schedule" primary button. Writes timezone + availability JSONB via `useUpdateAvailability`. Toast "Schedule saved". |
| 6.4 | Availability — Info alert | PASS | `index.tsx:63-67`: Alert with IconInfoCircle: "This schedule applies to all your event types. Guests see available slots in their own timezone." |
| 7.1 | Settings — Tabs | PASS | `index.tsx:19-26`: "Profile" and "General" tabs. Profile is default. |
| 7.2 | Settings — Profile tab | PASS | `profile-tab.tsx`: Avatar with upload, display name, username (with live `book/{username}` preview), bio textarea, conferencing URL with helper text, "Save profile" button. |
| 7.3 | Settings — General tab | PASS | `general-tab.tsx`: Appearance section with "Dark mode" Switch (persists to localStorage), Account section with "Log out of this account" destructive button. |
| 7.4 | Settings — Avatar upload | PASS | `profile-tab.tsx`: Hidden file input, "Upload photo" ghost button. Image preview updates in-place. Upload handled by `useUpdateProfile` mutation (Supabase Storage). |
| 8.1 | Public Booking Index — Profile card | PASS | `profile-card.tsx`: Avatar (image or initials fallback), full name (h2 semibold), bio (muted). |
| 8.2 | Public Booking Index — Event type list | PASS | `event-type-list.tsx`: renders active event types. Empty state: "No events available right now. Check back soon." |
| 8.3 | Public Booking Index — Event type rows | PASS | `event-type-row.tsx`: Link to `/book/:username/:slug`, IconClock + duration, name (semibold), description, IconChevronRight. Hover: `bg-muted/60`. |
| 8.4 | Public Booking Index — Footer | PASS | `book/index.tsx:54`: "Powered by CalendlyAlt" centered muted text. |
| 8.5 | Public Booking Index — Page shell | PASS | `App.tsx:39-42`: uses `ApplicationLayout` (no sidebar, no top bar). |
| 9.1 | Public Booking Flow — Month view | PASS | `month-view.tsx`: Calendar component + single-day time slot column. Available/unavailable date styling. "No available slots for this day." empty state. |
| 9.2 | Public Booking Flow — Column view | PASS | `column-view.tsx`: Multi-day slot grid with week navigation (prev/next). Today highlighted. "No available slots this week." empty state. |
| 9.3 | Public Booking Flow — View toggle | PASS | `book-flow/index.tsx`: ToggleGroup with month/column icons. Persisted in localStorage. |
| 9.4 | Public Booking Flow — 12h/24h toggle | PASS | `book-flow/index.tsx:57-60`: ToggleGroup with "12h"/"24h" items. Persisted in localStorage. |
| 9.5 | Public Booking Flow — Timezone | PASS | `book-flow/index.tsx:44-48`: Auto-detected via `Intl.DateTimeFormat`. Manual override in booker-meta sidebar. |
| 9.6 | Public Booking Flow — Time slot buttons | PASS | `time-slot-button.tsx`: emerald green dot (`bg-emerald-400`), tabular-nums time display, selected/unselected variants. |
| 9.7 | Public Booking Flow — Guest form | PASS | `guest-form.tsx`: "Your name *", "Email address *", "Additional notes (optional)" fields. "Confirm booking" submit button with loading spinner. Selected slot summary at top. |
| 9.8 | Public Booking Flow — Confirmation | PASS | `confirmation.tsx`: IconCircleCheck (emerald), "You're booked!" heading, event summary, conferencing URL, Google Calendar / Outlook / Download .ics buttons, "Book another meeting" link. |
| 9.9 | Public Booking Flow — Back link | PASS | `book-flow/index.tsx:233`: "Back" link → `/book/:username`. |
| 9.10 | Public Booking Flow — Meta sidebar | PASS | `booker-meta.tsx`: Avatar, host name, event name (text-xl), duration (IconClock), location (IconVideo/IconMapPin), timezone selector (IconGlobe) with "(auto-detected)", selected slot summary, mini calendar (column view). |

---

## Build verifications

| Build command | Result |
|---|---|
| `npm run build` (after all screens) | PASS — built in 3.43s, 0 errors. 1 non-blocking chunk size warning (1,182 kB > 500 kB). |

---

## SPEC-GAPs surfaced

No `// SPEC-GAP:` comments found in the codebase (`grep -rn "SPEC-GAP" src/` returned no results).

---

## Risks / not proven

- **Visual layout fidelity**: All components compile and contain the correct elements, but the CSS grid layouts (3-column month view, 2-column column view, responsive breakpoints) have not been visually verified in a browser. Status: **NOT PROVEN**.
- **Slot calculator correctness**: `slot-calculator.ts` implements timezone-aware slot generation with booking subtraction, but the algorithm has not been tested with edge cases (DST transitions, midnight-crossing availability windows, overlapping bookings). Status: **NOT PROVEN**.
- **Real Supabase auth flow**: `AuthProvider` registers `onAuthStateChange` before `getSession()` per spec. Google OAuth uses `lovable.auth.signInWithOAuth` (correct broker). Email auth uses `supabase.auth` directly. Cannot verify end-to-end without a running Supabase instance. Status: **NOT PROVEN**.
- **Avatar upload**: `useUpdateProfile` uploads to Supabase Storage `avatars/{user_id}/avatar.{ext}` with upsert. Graceful degradation on failure (toast). Cannot verify without Storage bucket. Status: **NOT PROVEN**.
- **Dark mode**: `general-tab.tsx` toggles `dark` class on `<html>` element and persists to localStorage. Compiles correctly, but visual rendering not verified. Status: **NOT PROVEN**.
- **Mobile responsive behavior**: Landing header hides "Sign in" on narrow viewports (code present: `hidden sm:inline-flex`). Booking flow mobile stack not visually verified. Status: **NOT PROVEN**.
- **Sidebar navigation icons**: `workspace-layout-03.tsx` uses `IconCalendarEvent`, `IconBook`, `IconClock`, `IconSettings` from Tabler. Spec calls for `[CalendarDays]`, `[BookOpen]`, `[Clock]`, `[Settings]`. The Tabler equivalents are close but not exact Lucide icon names; functionally equivalent. Status: **NOT PROVEN** (visual match).

---

## High-risk files requiring review

| File | Risk | Why it needs review |
|---|---|---|
| `src/lib/slot-calculator.ts` | HIGH | Core booking logic: timezone conversion, slot generation, booking overlap detection. Edge cases around DST, midnight-crossing windows, and timezone offsets could produce incorrect available slots. |
| `src/lib/data-provider.tsx` | HIGH | 707-line data layer with both seed and Supabase implementations. Optimistic mutation rollback logic. Any mismatch between seed filter logic and Supabase queries would cause demo/production divergence. |
| `src/pages/book-flow/index.tsx` | MEDIUM | 343-line orchestrator with state machine (selecting/form/confirming/confirmed), view toggles, timezone handling, and 60-day slot computation. Complex state interactions. |
| `src/pages/auth/components/auth-card.tsx` | MEDIUM | 340-line auth card with 4 view states (sign-in, sign-up, forgot-password, check-email), real Supabase auth calls, and Lovable OAuth broker integration. Error handling for auth edge cases. |
| `src/layouts/workspace-layout-03.tsx` | MEDIUM | Custom sidebar + breadcrumb layout. Demo-mode route prefix logic. Sidebar collapse state. Breadcrumb detail pass-through via Outlet context. |
| `src/pages/event-types/components/detail-edit.tsx` | MEDIUM | Auto-slug generation from name, form validation (save disabled when name empty), location radio with conditional address input. Slug collision detection not implemented. |

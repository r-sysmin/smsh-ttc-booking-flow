# Calendly Alternative

## Product Overview

**Calendly Alternative** is a personal scheduling tool that lets professionals share a booking link and let clients, colleagues, and collaborators pick time without the back-and-forth. Create event types (discovery call, 30-min sync, office hours), set weekly availability, and manage all bookings from one dashboard — no calendar sync or external API required.

**Core actions:**

- **Create event types** — define name, duration, location, and slug so others can book a specific type of meeting with you
- **Share your booking page** — send one link; visitors pick an event type, choose a slot, and confirm without any account
- **Manage bookings** — view upcoming, past, and cancelled appointments in one place with tabs and status badges
- **Set availability** — configure weekly hours and timezone once; all event types respect the same schedule

**Category**: `productivity` · **Tech stack**: Vite, React, TypeScript, Tailwind CSS, shadcn/ui · **Pages**: `/` (landing), `/auth` (sign in / sign up tabs), `/event-types` + `/demo/event-types` (event types list), `/event-types/:id` + `/demo/event-types/:id` (event type detail), `/bookings` + `/demo/bookings` (booking management), `/availability` + `/demo/availability` (weekly schedule), `/settings` + `/demo/settings` (profile + conferencing), `/book/:username` (public booking index), `/book/:username/:slug` (public booking flow)

* * *

## Breadboard

Places, affordances, and connections. Play through the use case — does the flow work?

```
Landing Page (/)                        Auth (/auth)
────────────────                        ────────────
  Get started ──→ Auth (/auth?intent=signup)          Google OAuth ──→ Event Types (/event-types, auto)
  Sign in ──→ Auth (/auth?intent=signin)              Tab toggle (sign-in ↔ sign-up) ──→ (in-place)
  Features ──→ #features-section                      Email/password sign-in ──→ Event Types (/event-types)
  See demo ──→ /book/demo (public page)               Email/password sign-up ──→ Auth (check email)
                                                      Forgot password ──→ (in-place — reset email sent)
                                                      Back to home ──→ Landing (/)

Event Types (/event-types)              Event Type Detail (/event-types/:id)
──────────────────────────              ────────────────────────────────────
  + New event type ──→ Event Type Detail (blank record created)
  Toggle active/inactive ──→ (in-place — badge updates)                    ← Back to event types ──→ Event Types (/event-types)
  Copy link ──→ (in-place — toast "Link copied")                           Edit button ──→ (in-place — fields become editable)
  Click event type row ──→ Event Type Detail (/event-types/:id)            Save changes ──→ (in-place — fields lock, toast "Saved")
  Meatball menu: Edit ──→ Event Type Detail (/event-types/:id?mode=edit)   Discard ──→ (in-place — fields revert)
  Meatball menu: Preview ──→ Public Booking Flow (new tab)                 Toggle active ──→ (in-place — badge flips)
  Meatball menu: Copy link ──→ (in-place — toast "Link copied")            Copy booking link ──→ (in-place — toast "Link copied")
  Meatball menu: Delete ──→ Confirm Dialog → Event Types (row removed)     Preview public page ──→ Public Booking Flow (new tab)
  Logout ──→ Sign out (clears session, returns to /)                       Delete event type ──→ Confirm Dialog → Event Types (/event-types)

Bookings (/bookings)                    Availability (/availability)            Settings (/settings)
────────────────────                    ────────────────────────────            ────────────────────
  Upcoming tab ──→ (in-place — confirmed + future)     Day toggle on/off ──→ (in-place)            Profile tab ──→ (in-place — profile form)
  Past tab ──→ (in-place — confirmed + past)           Start time select ──→ (in-place)            General tab ──→ (in-place — general options)
  Cancelled tab ──→ (in-place — cancelled)             End time select ──→ (in-place)              Display name ──→ (in-place — editable field)
  Cancel booking ──→ Confirm Dialog → (in-place — status → Cancelled)      Timezone select ──→ (in-place)              Username/slug ──→ (in-place — editable field)
  (Cancel only appears on upcoming bookings)           Save schedule ──→ (in-place — toast)        Bio ──→ (in-place — editable field)
  View details ──→ (in-place — row expands with guest info + location)                             Conferencing URL ──→ (in-place — editable field)
  Logout ──→ Sign out (clears session, returns to /)                                               Avatar upload ──→ (in-place — preview updates)
                                                                                                   Save profile ──→ (in-place — toast "Profile saved")
                                                                                                   Logout ──→ Sign out (clears session, returns to /)

Public Booking Index (/book/:username)          Public Booking Flow (/book/:username/:slug)
──────────────────────────────────────          ──────────────────────────────────────────
  Profile card (avatar, name, title) ──→ (static)   ← Back to events ──→ Public Booking Index (/book/:username)
  Click event type ──→ Public Booking Flow           Timezone selector ──→ (in-place — slots recalculate in guest timezone)
  (no auth required)                                 Calendar ──→ (in-place — month navigation)
                                                     Pick date ──→ (in-place — time slots appear, or "No slots" empty state)
                                                     Pick time slot ──→ (in-place — guest form appears)
                                                     Enter name ──→ (in-place)
                                                     Enter email ──→ (in-place)
                                                     Enter notes ──→ (in-place, optional)
                                                     Confirm booking ──→ Confirmation (in-place)
                                                     Add to Google Calendar ──→ (external URL, new tab)
                                                     Add to Outlook ──→ (external URL, new tab)
                                                     Download .ics ──→ (file download)
                                                     Book another ──→ Public Booking Index (/book/:username)

FTUX — First Session
─────────────────────
  Sign up completes ──→ Event Types (/event-types), first-time empty state
  Click "+ New event type" ──→ Event Type Detail (blank record, edit mode)
  Fill name, duration, location → Save ──→ Event Type Detail (view mode, toast "Saved")
  Click "← Back to event types" ──→ Event Types (first card appears)
  Click "Copy link" ──→ (toast "Link copied")
  Note: availability pre-filled Mon–Fri 9–5 in browser timezone as default
  Note: FTUX nudge — if display name or conferencing URL is unset, a banner on Event Types says
        "Complete your profile to make your booking page look great" → Settings (/settings)
```

* * *

## Screen List

| # | Route | Screen | Description |
| --- | --- | --- | --- |
| 1 | `/` | Landing page | Marketing page — hero with booking page mockup, features showcase, testimonials, footer with "Get started" and "Sign in" CTAs |
| 2 | `/auth` | Auth | Single card: Google OAuth button, then "Sign in / Sign up" tab toggle. Sign-in tab: email + password + "Forgot password?". Sign-up tab: name + email + password, swaps to "Check your email" on success. "Back to home" link. NOT two separate routes. |
| 3 | `/event-types` | Event Types | Card list of all event types with name, duration badge, active toggle, copy-link, and meatball menu (Edit, Preview, Copy, Delete) per row. "+ New event type" creates blank and navigates to detail. |
| 4 | `/event-types/:id` | Event Type Detail | View/edit page: name, slug, duration, description, location type. Edit mode with Save/Discard. Active toggle, copy link, preview, delete. Breadcrumb back to list. |
| 5 | `/bookings` | Bookings | Tabbed view: Upcoming (confirmed + future), Past (confirmed + past), Cancelled. Each booking shows guest name + email, event type, date/time, status badge. Cancel action on upcoming only. Row expand for details. |
| 6 | `/availability` | Availability | Weekly schedule grid — day toggles, start/end time pickers per day, timezone selector, Save button. Pre-filled Mon–Fri 9–5 for new users. |
| 7 | `/settings` | Settings | Profile tab: display name, username/slug, bio, avatar, conferencing URL. General tab: theme toggle, log out. |
| 8 | `/book/:username` | Public Booking Index | Public-facing profile card (avatar, name, title/bio) + list of active event types. No auth required. |
| 9 | `/book/:username/:slug` | Public Booking Flow | Guest timezone auto-detected with manual override. Calendar → date → time slots (or "No available slots" empty state) → guest form (name, email, notes) → confirmation with "Add to calendar" buttons. Back link to event list. No auth required. |

* * *

## Key Decisions

| # | Decision | Rationale |
| --- | --- | --- |
| D1 | Seed data: 4 event types (15-min quick chat, 30-min meeting, 60-min strategy session, 45-min coffee meetup — inactive), 10 bookings across tabs, weekly availability Mon–Fri 9–5 | Enough variety to fill all screens. `/demo/*` reads `src/data/seed.ts`, real accounts start empty except pre-filled availability |
| D2 | Dual routing — `/*` (Supabase-backed, auth required) and `/demo/*` + `/book/demo` (seed data, no auth) | `/*` is the real product. `/demo/*` mirrors app screens with seed data for template marketing. Public booking at `/book/:username` works without auth for any real user |
| D3 | No calendar sync (Google/Outlook API), no email notifications, no video conferencing API | These require OAuth scopes and server-side infra that break the "clone and run" promise. Conferencing is a saved URL string — users paste their Zoom/Meet link once in Settings. "Add to calendar" buttons use URL patterns (Google Calendar) and .ics file generation (client-side) — no email API needed |
| D4 | Supabase tables: `profiles` (id, full_name, username, bio, avatar_url, conferencing_url, timezone, availability JSONB), `event_types` (id, user_id, name, slug, duration_minutes, description, location_type, location_value, is_active), `bookings` (id, event_type_id, host_user_id, guest_name, guest_email, guest_notes, start_time timestamptz, end_time timestamptz, status text, cancelled_at timestamptz) | Minimal schema. Availability stored as JSONB on profiles (one weekly schedule per user, e.g. `{"mon": [{"start": "09:00", "end": "17:00"}], "sat": null}`). Booking `status` is `"confirmed"` or `"cancelled"` only — tabs derive Upcoming (confirmed + future), Past (confirmed + past), Cancelled from status + start_time vs now(). All times stored in UTC. RLS on all tables by `user_id`. Public booking reads profiles + event_types via anon key, inserts bookings without auth |
| D5 | Edit mode on Event Type Detail is a toggle (view → edit → save/discard), not a separate route | Keeps the URL stable. Prevents unsaved-navigation issues. Matches the Save/Discard pattern established in the link shortener. Detail page routed by `:id` (not `:slug`) so editing the slug doesn't break the URL |
| D6 | First-run: user signs up → empty Event Types with blankslate → creates first event type → copies link. Availability pre-filled Mon–Fri 9–5 in browser timezone. FTUX banner nudges Settings if display name or conferencing URL is unset | Empty state uses skeleton bg + gradient fade + floating card per blankslate spec. Pre-filled availability means users have a working schedule immediately. FTUX banner on Event Types: "Complete your profile to make your booking page look great" → links to Settings |
| D7 | Teams, round-robin, routing, workflows, recurring bookings, reschedule flow, custom booking questions, payment collection, buffer times, date range limits, and calendar sync are explicitly cut | These are the features that make Calendly and Cal.com complex. Reschedule requires the full booking flow again — guests can cancel and rebook instead. The data model supports adding team scoping later but it's not worth the surface area for a personal tool |
| D8 | Guest timezone handling: auto-detected via `Intl.DateTimeFormat().resolvedOptions().timeZone` with manual override dropdown on the booking flow page. Time slots displayed in guest timezone | Essential for a scheduling tool. All times stored as UTC in the database. The host's availability schedule is stored as HH:mm strings in the host's timezone. Slot calculation: host schedule → UTC → subtract confirmed bookings → convert to guest timezone for display |

* * *

## Design Decisions

**Primary color**: `sky`

**Section decisions**:

| Slot | Considered | Chosen | Why this one, not the others |
| --- | --- | --- | --- |
| Header | `header` | `header` | Only header variant available; two CTAs ("Get started" → `/auth?intent=signup`, "Sign in" → `/auth?intent=signin`) |
| Hero | `hero-01`, `hero-02`, `hero-03`, `hero` | `hero-02` | Scheduling tools are inherently visual — a centered layout with a browser-chrome mockup of the booking page immediately answers "what is this?" Hero-01 is a plain text-centered announcement with no product mockup. Hero-03 skews toward editorial/blog. Hero (base) is too minimal for a product landing. Hero-02's centered headline + product screenshot gives the busy professional instant context |
| Features (primary showcase) | `feature-showcase-01`, `feature-showcase-02`, `feature-showcase`, `features-03` | `feature-showcase-01` | The product has four distinct surfaces (event types, booking page, bookings list, availability). Feature-showcase-01 renders each as a tabbed showcase with a full-width preview — ideal for walking a visitor through each screen. Feature-showcase-02 is a bento grid, which works for abstract capabilities but not sequential screens. Feature-showcase (base) is a plain alternating layout without tabs. Features-03 is icon-only — too lightweight for a tool where seeing the UI is the sell |
| Features (secondary) | `feature-showcase-01`, `feature-showcase-02`, `feature-showcase`, `features-03` | `features-03` | A second feature pass with icon + short copy covers the supporting details (one-link sharing, timezone handling, "add to calendar") that don't need a full screenshot. Features-03's icon-grid format is right for this supporting role — scanning 3–4 capability bullets, not deep product exploration |
| Testimonials | `testimonial-01`, `testimonial-02`, `testimonial-03`, `testimonial-slider` | `testimonial-02` | Scheduling tools are used by freelancers, consultants, and solopreneurs who respond to peer proof. Testimonial-02 renders a compact multi-card grid — good for showing 3 quotes from different professional archetypes (freelancer, team lead, consultant) at a glance. Testimonial-01 is a single large quote — too thin for social proof. Testimonial-03 is a full-bleed feature callout that upstages the copy. Testimonial-slider auto-advances and feels gimmicky for a professional tool |
| Sidebar (app) | `workspace-layout-01`, `workspace-layout-02`, `workspace-layout-03`, `workspace-layout-04` | `workspace-layout-03` | The app has 5 distinct sections (Event Types, Event Type Detail, Bookings, Availability, Settings) that need clear persistent navigation. Workspace-layout-03 provides a standard sidebar with breadcrumbs — the breadcrumb trail is essential on the Event Type Detail page so users know where they are inside an id-based route. Layout-01's peekable sidebar hides nav items and forces extra clicks. Layout-02's pill-tab top-bar suits a 2–3 tab product, not a 5-section tool. Layout-04's icon-only header lacks the label clarity needed for a tool where each section does a different job |

* * *

## Plans

| # | Document | What it covers |
| --- | --- | --- |
| 00 | [00-breadboard.md](00-breadboard.md) | This doc — scope, breadboard, decisions |
| 00 | [00-screenboard.md](00-screenboard.md) | Per-screen wireframes, design system, mock data |
| 00 | [00-storyboard.md](00-storyboard.md) | Transitions between screens, copy decisions |
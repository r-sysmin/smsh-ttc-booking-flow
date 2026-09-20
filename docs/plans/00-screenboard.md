# Screens — Calendly Alternative

One entry per screen from the plan's Screen List. Read [00-breadboard.md](00-breadboard.md) for product scope and component choices.

* * *

## Landing page (`/`)

Marketing page that sells the scheduling tool to busy professionals. Primary CTA leads to sign-up; "See demo" opens the public booking page.

**Populated wireframe**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [CalendlyAlt]                              [See demo]  [Sign in]  [Get started] │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│              Stop the scheduling back-and-forth.                            │
│              Share one link. Let people book time with you.                 │
│                                                                              │
│              [Get started — it's free]      [See demo →]                   │
│                                                                              │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │ ● ● ●  cal.yourdomain.com/book/alexmorgan                        │    │
│   │  ┌──────────────────────────────────────────────────────────┐   │    │
│   │  │  [AM]  Alex Morgan                                        │   │    │
│   │  │        Product Consultant · "Happy to chat anytime."      │   │    │
│   │  │  ─────────────────────────────────────────────────────   │   │    │
│   │  │  [Clock] 15-min Quick Chat           [→]                 │   │    │
│   │  │  [Clock] 30-min Discovery Call       [→]                 │   │    │
│   │  │  [Clock] 60-min Strategy Session     [→]                 │   │    │
│   │  └──────────────────────────────────────────────────────────┘   │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ── How it works ─────────────────────────────────────────────────────────  │
│  [ Event Types ]  [ Booking Page ]  [ Bookings ]  [ Availability ]         │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │ ● ● ●  (product screenshot for active tab)                        │    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ── Why it's simpler ─────────────────────────────────────────────────────  │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   │
│  │  [Link]     │   │  [Globe]    │   │  [Calendar] │   │  [Video]    │   │
│  │  One link   │   │  Timezone-  │   │  Add to     │   │  Paste your │   │
│  │  for all    │   │  aware slots│   │  any        │   │  Zoom link  │   │
│  │  meeting    │   │  auto-      │   │  calendar   │   │  once       │   │
│  │  types      │   │  detected   │   │             │   │             │   │
│  └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   │
│                                                                              │
│  ── What professionals say ───────────────────────────────────────────────  │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ │
│  │ "My clients book    │  │ "Set it up in 10    │  │ "Finally a tool     │ │
│  │ their own slots     │  │ minutes. Now I just │  │ that doesn't need a │ │
│  │ without a single    │  │ share the link."    │  │ PhD to configure."  │ │
│  │ email."             │  │                     │  │                     │ │
│  │ Jamie R.            │  │ Sam T., Team Lead   │  │ Priya N., Consultant│ │
│  │ Freelance Designer  │  │                     │  │                     │ │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘ │
│                                                                              │
│  ── CTA banner ───────────────────────────────────────────────────────────  │
│              Ready to reclaim your calendar?                                │
│              [Get started — it's free]                                      │
│                                                                              │
│  ── Footer ───────────────────────────────────────────────────────────────  │
│  CalendlyAlt    Product    Legal    Connect                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Header

- `header` component. Sticky. Wordmark left. Three items right: "See demo" (`button` ghost), "Sign in" (`button` ghost, routes to `/auth?intent=signin`), "Get started" (`button` filled, routes to `/auth?intent=signup`).
- No mobile hamburger nav — the three links are the entire nav. At narrow viewports, drop "Sign in" and keep "Get started" as the sole CTA.
- Deliberately not: logo lockup with tagline, nav mega-menu, announcement banner. The header's job is wayfinding, not selling.

### Hero

- `hero-02` component. Centered headline + subhead, two CTAs, browser-chrome mockup below.
- Headline: "Stop the scheduling back-and-forth." Subhead: "Share one link. Let people book time with you."
- Primary CTA: "Get started — it's free" → `/auth?intent=signup`. Secondary CTA: "See demo →" → `/book/demo`.
- Browser mockup (`mockups` component) renders the public booking index seed view — avatar, name, bio, and three event type rows — so visitors immediately see the product output, not an abstract promise.
- No video embed, no animated hero. The static mockup loads instantly and shows exactly what a guest sees when they follow the shared link.

### Features showcase

- `feature-showcase-01` component. Four tabs auto-cycle: "Event Types", "Booking Page", "Bookings", "Availability". Each tab shows a full-width product screenshot in a browser chrome wrapper.
- Tab labels are short nouns, not benefit statements — the screenshot does the explaining.
- No separate "How it works" numbered steps. The tabs are the walkthrough — the visitor clicks through the product at their own pace.

### Supporting features grid

- `features-03` component. Four icon + headline + one-line description tiles in a 2×2 (mobile) or 4-column (desktop) grid.
- Tiles: "One link for all meeting types" `[Link]`, "Timezone-aware slots, auto-detected" `[Globe]`, "Add to Google, Outlook, or download .ics" `[Calendar]`, "Paste your Zoom link once" `[Video]`.
- Icon color uses primary (`sky`). No filled cards — tiles are borderless on a muted background.
- No pricing column, no feature comparison table. Those imply a SaaS tier model that this template doesn't have.

### Testimonials

- `testimonial-02` component. Three-column card grid. Each card: quote in body text, name in semibold, role/title in muted.
- Personas chosen to match the product's core users: freelancer, team lead, consultant. One sentence each — scannable at a glance.
- No star ratings — this is a developer template, not a marketplace listing.

### CTA banner

- `cta-01` component. Short centered heading "Ready to reclaim your calendar?" + single primary CTA "Get started — it's free" → `/auth?intent=signup`.
- No secondary link in the banner — the page already showed it twice. One conversion moment at the end.

### Footer

- Minimal four-column `footer` layout: wordmark, Product links (Event Types, Bookings, Availability, Settings), Legal (Privacy, Terms), Connect (GitHub, Twitter).
- No newsletter signup. No cookie banner. No language selector.

* * *

**Data shape** (`src/data/seed.ts`):

- Feature tabs: 4 entries — "Event Types" (screenshot of card list with 3 event types), "Booking Page" (screenshot of public booking index), "Bookings" (screenshot of tabbed booking table), "Availability" (screenshot of weekly grid)
- Supporting features: 4 entries — {icon: "Link", headline: "One link for all meeting types", body: "Share a single URL. Guests pick the meeting type that fits."}, {icon: "Globe", headline: "Timezone-aware slots", body: "Guest timezone auto-detected. Times shown in their local time."}, {icon: "Calendar", headline: "Add to any calendar", body: "Google Calendar, Outlook, or .ics download — no email needed."}, {icon: "Video", headline: "Paste your Zoom link once", body: "Store your conferencing URL in settings. It appears on every booking."}
- Testimonials: 3 entries — {quote: "My clients book their own slots without a single email.", name: "Jamie R.", role: "Freelance Designer"}, {quote: "Set it up in 10 minutes. Now I just share the link.", name: "Sam T.", role: "Team Lead, Stackform"}, {quote: "Finally a tool that doesn't need a PhD to configure.", name: "Priya N.", role: "Independent Consultant"}
- Footer links: Product (Features, Demo, Sign in), Legal (Privacy, Terms), Connect (GitHub, Twitter)

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | none |
| **Read** | feature tabs, supporting features, testimonials, footer links (static marketing content) |
| **Update** | none |
| **Delete** | none |
| **Filter** | none |
| **Sort** | none |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | none |
| **Drill down** | none |
| **Auth** | public |

**States**: populated only — landing has no empty state

* * *

## Auth (`/auth`)

Single card with Google OAuth and email/password sign-in or sign-up. Tab toggles between sign-in and sign-up in place.

**Populated wireframe** (sign-in tab):

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                    [CalendlyAlt wordmark]                                   │
│                                                                              │
│              ┌────────────────────────────────────────────┐                 │
│              │                                            │                 │
│              │   Welcome back                             │                 │
│              │   Sign in to your scheduling dashboard     │                 │
│              │                                            │                 │
│              │   [Google]  Continue with Google           │                 │
│              │                                            │                 │
│              │   ──────────── or ────────────             │                 │
│              │                                            │                 │
│              │   [ Sign in ]   [ Sign up ]                │                 │
│              │   ──────────────────────────               │                 │
│              │                                            │                 │
│              │   Email                                     │                 │
│              │   ┌──────────────────────────────────┐     │                 │
│              │   │ you@example.com                  │     │                 │
│              │   └──────────────────────────────────┘     │                 │
│              │                                            │                 │
│              │   Password                                  │                 │
│              │   ┌──────────────────────────────────┐     │                 │
│              │   │ ••••••••••                       │     │                 │
│              │   └──────────────────────────────────┘     │                 │
│              │                        Forgot password?    │                 │
│              │                                            │                 │
│              │   [          Sign in          ]            │                 │
│              │                                            │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                              │
│                          ← Back to home                                     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Sign-up tab wireframe**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                    [CalendlyAlt wordmark]                                   │
│                                                                              │
│              ┌────────────────────────────────────────────┐                 │
│              │                                            │                 │
│              │   Create your account                      │                 │
│              │   Set up your scheduling page in minutes   │                 │
│              │                                            │                 │
│              │   [Google]  Continue with Google           │                 │
│              │                                            │                 │
│              │   ──────────── or ────────────             │                 │
│              │                                            │                 │
│              │   [ Sign in ]   [ Sign up ]                │                 │
│              │   ──────────────────────────               │                 │
│              │                                            │                 │
│              │   Full name                                │                 │
│              │   ┌──────────────────────────────────┐     │                 │
│              │   │ Alex Morgan                      │     │                 │
│              │   └──────────────────────────────────┘     │                 │
│              │                                            │                 │
│              │   Email                                     │                 │
│              │   ┌──────────────────────────────────┐     │                 │
│              │   └──────────────────────────────────┘     │                 │
│              │                                            │                 │
│              │   Password                                  │                 │
│              │   ┌──────────────────────────────────┐     │                 │
│              │   └──────────────────────────────────┘     │                 │
│              │                                            │                 │
│              │   [       Create account        ]          │                 │
│              │                                            │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                              │
│                          ← Back to home                                     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Auth card

- Centered card using `card` (shadcn). `application-layout` wraps the page — no sidebar, no top bar.
- Card heading and subhead swap between tabs: sign-in shows "Welcome back / Sign in to your scheduling dashboard"; sign-up shows "Create your account / Set up your scheduling page in minutes".
- Google OAuth button: full-width outlined button with Google `[Google]` icon. Highest prominence — OAuth is the lowest-friction path.
- Separator "or" between OAuth and email/password fields.
- Tab toggle (`tabs` shadcn) for "Sign in" / "Sign up" — in-place swap, no navigation.
- Sign-in fields: Email (`input`), Password (`input` type=password), "Forgot password?" link right-aligned below password field.
- Sign-up fields: Full name (`input`), Email (`input`), Password (`input` type=password). No confirm-password field — adds friction without security benefit at this scope.
- Primary `button` fills full card width. Label matches active tab: "Sign in" or "Create account".
- "Forgot password?" triggers an in-place state swap — fields replaced with "Enter your email and we'll send a reset link." and a single email input + "Send reset link" button.
- "Check your email" state after sign-up: fields replaced with a confirmation message — no redirect.
- `?intent=signup` query param pre-selects the Sign up tab on load; `?intent=signin` pre-selects Sign in.

### Back to home

- Plain text link below the card: "← Back to home" → `/`. Not a button — shouldn't compete with the card's primary action.
- No "Don't have an account? Sign up" links at the bottom of the sign-in form — the tab toggle covers this.

* * *

**Data shape** (`src/data/seed.ts`):

- No seed data — auth is stateless UI. Tab state and form values are local component state only.

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | sign-up form creates a new Supabase auth user + profile row |
| **Read** | none |
| **Update** | none |
| **Delete** | none |
| **Filter** | none |
| **Sort** | none |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | none |
| **Drill down** | none |
| **Auth** | public |

**First-time view notes**:

- Arrives via "Get started" with `?intent=signup` — sign-up tab active.
- Primary CTA: "Create account" or "Continue with Google".
- After successful sign-up: in-place "Check your email" state. After OAuth: redirect to `/event-types`.

**States**: sign-in tab, sign-up tab, forgot-password (in-place), check-your-email (in-place), loading (button disabled + spinner while submitting)

* * *

## Event Types (`/event-types`)

Card list of all event types the user has created. The main dashboard for the scheduling tool — where users manage what meetings they offer.

(Demo route `/demo/event-types` mirrors this screen pre-populated with seed data — no separate wireframe needed.)

**First-time wireframe** (new user, no event types yet):

```
┌─────────────────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR                 │  MAIN CONTENT                                      │
│                         │                                                    │
│  [CalendlyAlt]          │  Event Types              [+ New event type]       │
│                         │                                                    │
│  [CalendarDays] Event   │  ┌─────────────────────────────────────────────┐  │
│               Types  ●  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  [BookOpen]  Bookings   │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  [Clock]   Availability │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  [Settings]  Settings   │  │                    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  │
│                         │  │            ┌──────────────────────────────┐│  │
│  ─────────────────────  │  │            │  [Plus]                      ││  │
│  [LogOut]    Log out    │  │            │  No event types yet          ││  │
│                         │  │            │                              ││  │
│                         │  │            │  Create your first event     ││  │
│                         │  │            │  type to start sharing       ││  │
│                         │  │            │  your booking link.          ││  │
│                         │  │            │                              ││  │
│                         │  │            │  [+ New event type]          ││  │
│                         │  └────────────┴──────────────────────────────┘┘  │
│                         │                                                    │
│                         │  ┌─────────────────────────────────────────────┐  │
│                         │  │ [Info] Complete your profile to make your   │  │
│                         │  │ booking page look great  →  Go to Settings  │  │
│                         │  └─────────────────────────────────────────────┘  │
└─────────────────────────┴────────────────────────────────────────────────────┘
```

**Populated wireframe**:

```
┌─────────────────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR                 │  MAIN CONTENT                                      │
│                         │                                                    │
│  [CalendlyAlt]          │  Event Types              [+ New event type]       │
│                         │                                                    │
│  [CalendarDays] Event   │  ┌─────────────────────────────────────────────┐  │
│               Types  ●  │  │  [Clock] 15-min Quick Chat                  │  │
│  [BookOpen]  Bookings   │  │  Casual intro or quick question              │  │
│  [Clock]   Availability │  │  [●Active]  [Copy link]    [⋯]             │  │
│  [Settings]  Settings   │  ├─────────────────────────────────────────────┤  │
│                         │  │  [Clock] 30-min Discovery Call              │  │
│  ─────────────────────  │  │  Walk through your goals and challenges      │  │
│  [LogOut]    Log out    │  │  [●Active]  [Copy link]    [⋯]             │  │
│                         │  ├─────────────────────────────────────────────┤  │
│                         │  │  [Clock] 60-min Strategy Session            │  │
│                         │  │  Deep-dive planning session                  │  │
│                         │  │  [●Active]  [Copy link]    [⋯]             │  │
│                         │  ├─────────────────────────────────────────────┤  │
│                         │  │  [Clock] 45-min Coffee Meetup               │  │
│                         │  │  Casual chat — virtual or in person          │  │
│                         │  │  [○Inactive]  [Copy link]   [⋯]            │  │
│                         │  └─────────────────────────────────────────────┘  │
│                         │                                                    │
│                         │  Your booking page:                               │
│                         │  cal.yourdomain.com/book/alexmorgan  [Copy] [→]   │
└─────────────────────────┴────────────────────────────────────────────────────┘
```

### Sidebar

- `workspace-layout-03` provides the sidebar shell. `app-sidebar` component inside.
- Navigation items in sidebar body: "Event Types" `[CalendarDays]`, "Bookings" `[BookOpen]`, "Availability" `[Clock]`, "Settings" `[Settings]`. Active item highlighted with primary color left indicator.
- Separator above footer. Footer: "Log out" `[LogOut]` — triggers sign-out and redirects to `/`.
- No search input in sidebar — there are only 4 nav destinations. No history list — this is a tool, not a chat app.

### Page header

- Page title "Event Types" left-aligned in `h2`. "+ New event type" `[Plus]` filled primary `button` right-aligned.
- Clicking "+ New event type" creates a blank record via Supabase insert and navigates immediately to `/event-types/:newId?mode=edit`.
- No filter or search in the header — at this scale (typically 3-8 event types), scanning is faster. Add later if needed.

### Event type list

- Flat list of `card` rows, one per event type. No grid — rows are the right format when actions per item matter.
- Each row anatomy:
  - `[Clock]` icon + duration in muted text (e.g. "15 min") left-most column
  - Event type name in `semibold` foreground + short description in `muted-foreground` below
  - Active/inactive `badge` — green filled for active, gray outline for inactive
  - "Copy link" `button` ghost — copies `/book/:username/:slug` to clipboard, shows `sonner` toast "Link copied"
  - Meatball menu `[MoreHorizontal]` `dropdown-menu`: Edit (→ `/event-types/:id?mode=edit`), Preview (→ `/book/:username/:slug` new tab), Copy link (toast), Delete (→ `alert-dialog` confirm)
- Clicking anywhere on the row body (not the controls) navigates to `/event-types/:id` view mode.
- Row hover: `bg-muted/60` wash. No border on hover — the card already has surface depth.
- Delete confirm `alert-dialog`: "Delete this event type? This can't be undone." — Cancel + Delete buttons.
- No drag-to-reorder — order is by created_at descending. Reordering is a power feature that adds complexity without clear benefit for a personal tool.

### Booking page URL strip

- Narrow strip below the list showing the user's public booking page URL: `cal.yourdomain.com/book/alexmorgan`.
- Two inline actions: "Copy" `[Copy]` (toast) and "→" (opens `/book/alexmorgan` in new tab).
- Muted background, no card wrapper — it's a supporting affordance, not a primary section.

### FTUX banner

- `alert` component (shadcn) with `[Info]` icon. Text: "Complete your profile to make your booking page look great." Link: "Go to Settings" → `/settings`.
- Shown only when `full_name` or `conferencing_url` is null on the user's profile. Dismissed after Settings is saved.
- No persistent dismissal button — it goes away naturally once the profile is complete. A manual dismiss button would let users ignore the nudge forever.

### Blankslate

- Skeleton background with bottom gradient fade per blankslate spec. Floating `card` with `shadow-lg` centered in the empty area.
- Card contents: `[Plus]` icon, heading "No event types yet", body "Create your first event type to start sharing your booking link.", primary `button` "+ New event type".
- FTUX banner still visible below the blankslate — even with no event types, the profile nudge applies.

* * *

**Data shape** (`src/data/seed.ts`):

- Event types: 4 entries —
  - `{id: "et1", name: "15-min Quick Chat", slug: "quick-chat", duration_minutes: 15, description: "Casual intro or quick question", location_type: "conferencing", location_value: null, is_active: true, created_at: "2024-11-01T10:00:00Z"}`
  - `{id: "et2", name: "30-min Discovery Call", slug: "discovery-call", duration_minutes: 30, description: "Walk through your goals and challenges", location_type: "conferencing", location_value: null, is_active: true, created_at: "2024-11-02T10:00:00Z"}`
  - `{id: "et3", name: "60-min Strategy Session", slug: "strategy-session", duration_minutes: 60, description: "Deep-dive planning session", location_type: "conferencing", location_value: null, is_active: true, created_at: "2024-11-03T10:00:00Z"}`
  - `{id: "et4", name: "45-min Coffee Meetup", slug: "coffee-meetup", duration_minutes: 45, description: "Casual chat — virtual or in person", location_type: "in_person", location_value: "Shoreditch, London", is_active: false, created_at: "2024-11-04T10:00:00Z"}`

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | "+ New event type" button — creates blank record, navigates to detail in edit mode |
| **Read** | event types list (name, slug, duration, description, is_active) |
| **Update** | active toggle per row (in-place badge flip); copy link (clipboard) |
| **Delete** | meatball menu → Delete → `alert-dialog` confirm → row removed |
| **Filter** | none |
| **Sort** | created_at descending (newest first) |
| **Search** | none |
| **Paginate** | none — personal tools rarely exceed 10 event types |
| **Aggregate** | none |
| **Drill down** | click row body → Event Type Detail (`/event-types/:id`) |
| **Auth** | protected; `/demo/event-types` public with seed data |

**First-time view notes**:

- Blankslate: "No event types yet. Create your first event type to start sharing your booking link."
- Primary CTA: "+ New event type" (both in page header and inside the blankslate card)
- FTUX banner visible even in empty state: "Complete your profile to make your booking page look great → Go to Settings"

**States**: first-time (blankslate + FTUX banner), populated (card list), delete-confirm (alert-dialog open), loading (skeleton rows while fetching)

* * *

## Event Type Detail (`/event-types/:id`)

View and edit a single event type. Breadcrumb back to list. Toggle edit mode with Save/Discard. Full page, not a modal — the user is in a focused editing task.

(Demo route `/demo/event-types/:id` mirrors this screen pre-populated with seed data — no separate wireframe needed.)

**First-time wireframe** (blank record, edit mode — what a new user sees after clicking "+ New event type"):

```
┌─────────────────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR                 │  MAIN CONTENT                                      │
│                         │                                                    │
│  [CalendlyAlt]          │  Event Types > New event type                      │
│                         │                                                    │
│  [CalendarDays] Event   │  ┌──────────────────────────────────────────────┐  │
│               Types     │  │  Event name                                  │  │
│  [BookOpen]  Bookings   │  │  ┌────────────────────────────────────────┐  │  │
│  [Clock]   Availability │  │  │ e.g. 30-min Discovery Call             │  │  │
│  [Settings]  Settings   │  │  └────────────────────────────────────────┘  │  │
│                         │  │                                              │  │
│  ─────────────────────  │  │  URL slug                                    │  │
│  [LogOut]    Log out    │  │  ┌────────────────────────────────────────┐  │  │
│                         │  │  │ e.g. discovery-call                    │  │  │
│                         │  │  └────────────────────────────────────────┘  │  │
│                         │  │  book/alexmorgan/[slug]                      │  │
│                         │  │                                              │  │
│                         │  │  Duration                                    │  │
│                         │  │  ┌────────────────────────────────────────┐  │  │
│                         │  │  │ 30 minutes                         [v] │  │  │
│                         │  │  └────────────────────────────────────────┘  │  │
│                         │  │                                              │  │
│                         │  │  Description (optional)                     │  │
│                         │  │  ┌────────────────────────────────────────┐  │  │
│                         │  │  │                                        │  │  │
│                         │  │  └────────────────────────────────────────┘  │  │
│                         │  │                                              │  │
│                         │  │  Location                                    │  │
│                         │  │  ( ) Conferencing link  ( ) In person        │  │
│                         │  │                                              │  │
│                         │  │  [Save]   [Discard]                         │  │
│                         │  └──────────────────────────────────────────────┘  │
└─────────────────────────┴────────────────────────────────────────────────────┘
```

**Populated wireframe** (view mode):

```
┌─────────────────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR                 │  MAIN CONTENT                                      │
│                         │                                                    │
│  [CalendlyAlt]          │  Event Types > 30-min Discovery Call               │
│                         │                                                    │
│  [CalendarDays] Event   │  ┌──────────────────────────────────────────────┐  │
│               Types     │  │                             [●Active] [Edit]  │  │
│  [BookOpen]  Bookings   │  │  [Clock] 30-min Discovery Call               │  │
│  [Clock]   Availability │  │  Walk through your goals and challenges       │  │
│  [Settings]  Settings   │  │                                              │  │
│                         │  │  ─────────────────────────────────────────   │  │
│  ─────────────────────  │  │                                              │  │
│  [LogOut]    Log out    │  │  Duration       30 minutes                   │  │
│                         │  │  Location       Conferencing link            │  │
│                         │  │  URL slug       discovery-call               │  │
│                         │  │  Booking link   book/alexmorgan/discovery-   │  │
│                         │  │                 call  [Copy] [Preview →]     │  │
│                         │  │                                              │  │
│                         │  │  ─────────────────────────────────────────   │  │
│                         │  │                                              │  │
│                         │  │  [Delete this event type]                   │  │
│                         │  └──────────────────────────────────────────────┘  │
└─────────────────────────┴────────────────────────────────────────────────────┘
```

### Breadcrumb

- `breadcrumb` (shadcn) component. "Event Types" → `/event-types` / current event type name. Built into `workspace-layout-03`'s header slot.
- Breadcrumb text is the actual event type name, not "Event Type Detail" — the user navigated here from a named row.
- No back arrow button — the breadcrumb is the back affordance. Duplicating it with an arrow adds visual noise.

### Detail card (view mode)

- Single `card` with `max-w-3xl mx-auto` — detail/reading view per design guidelines.
- Card header: event type name in `h2 semibold`, description in `muted-foreground`. Right-aligned: active/inactive `badge` + "Edit" `button` (outlined).
- Info rows below separator: Duration, Location, URL slug — each a two-column label/value layout. Not a form — these are display values in view mode.
- Booking link row: full URL as muted text + "Copy" `[Copy]` ghost button (toast) + "Preview →" ghost button (opens public booking flow in new tab).
- Separator + "Delete this event type" destructive `button` (outlined, red variant) at the bottom. Opens `alert-dialog` confirm before executing.
- No stats (bookings count, views) on this page — that data belongs on the Bookings screen, not the event type editor.

### Detail card (edit mode)

- Triggered by "Edit" button. Card transitions in-place — no navigation, URL gains `?mode=edit` (for browser refresh preservation, per D5).
- Fields become `input` and `select` components. All labels remain the same position.
- Event name: `input` text. Required — Save disabled if empty.
- URL slug: `input` text. Auto-generated from name (kebab-case) on first edit; editable manually. Helper text below: `book/alexmorgan/[slug]` updates live as the user types.
- Duration: `select` dropdown — 15 min, 30 min, 45 min, 60 min, 90 min, 120 min.
- Description: `textarea` (optional). Placeholder: "What should guests know before booking?"
- Location: `radio-group` — "Conferencing link" / "In person". Selecting "In person" reveals a text `input` for the address. Selecting "Conferencing link" hides the address input — the conferencing URL from Settings is used automatically.
- Footer: "Save" primary `button` + "Discard" ghost `button`. Save writes to Supabase and reverts to view mode with `sonner` toast "Saved". Discard reverts fields to their pre-edit values without writing — no confirm dialog (changes are minor form edits, not deletions).
- No active toggle in edit mode — that's in view mode only. Prevents accidental deactivation mid-edit.

### Delete confirm modal

```
┌───────────────────────────────────────────────────┐
│  Delete "30-min Discovery Call"?                  │
│                                                   │
│  This event type and its booking link will be     │
│  permanently removed. Existing bookings won't     │
│  be affected.                                     │
│                                                   │
│           [Cancel]   [Delete]                     │
└───────────────────────────────────────────────────┘
```

- `alert-dialog` (shadcn). Opened by the "Delete this event type" button.
- Destructive action: "Delete" button is red/destructive variant. "Cancel" is ghost.
- Body copy clarifies existing bookings are not deleted — reduces fear of data loss.
- On confirm: delete row from Supabase, navigate to `/event-types`.

* * *

**Data shape** (`src/data/seed.ts`):

- Uses same 4 event type entries as Event Types screen. No additional entities.

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | none (record already created on "+ New event type" click) |
| **Read** | single event type record (name, slug, duration, description, location_type, location_value, is_active) |
| **Update** | edit mode form — name, slug, duration, description, location type/value, is_active toggle |
| **Delete** | "Delete this event type" → alert-dialog → Supabase delete → redirect to list |
| **Filter** | none |
| **Sort** | none |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | none |
| **Drill down** | none |
| **Auth** | protected; `/demo/event-types/:id` public with seed data |

**First-time view notes**:

- Arrives in edit mode with all fields blank/defaulted (duration defaults to 30 min, location defaults to conferencing).
- Primary CTA: "Save" — user must fill name and slug before Save enables.
- Discard on a blank new record navigates back to `/event-types` and deletes the blank record (no orphan rows).

**States**: view mode, edit mode, saving (button loading), delete-confirm open, loading (skeleton fields while fetching)

* * *

## Bookings (`/bookings`)

Tabbed list of all bookings — upcoming, past, and cancelled. The host's command center for seeing who has booked time.

(Demo route `/demo/bookings` mirrors this screen pre-populated with seed data — no separate wireframe needed.)

**First-time wireframe** (no bookings yet):

```
┌─────────────────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR                 │  MAIN CONTENT                                      │
│                         │                                                    │
│  [CalendlyAlt]          │  Bookings                                          │
│                         │                                                    │
│  [CalendarDays] Event   │  [ Upcoming ]  [ Past ]  [ Cancelled ]            │
│               Types     │                                                    │
│  [BookOpen]  Bookings ● │  ┌─────────────────────────────────────────────┐  │
│  [Clock]   Availability │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│  [Settings]  Settings   │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │
│                         │  │                   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  │
│  ─────────────────────  │  │           ┌───────────────────────────────┐│  │
│  [LogOut]    Log out    │  │           │  [Calendar]                   ││  │
│                         │  │           │  No upcoming bookings         ││  │
│                         │  │           │                               ││  │
│                         │  │           │  When someone books time with ││  │
│                         │  │           │  you, it'll show up here.     ││  │
│                         │  │           │                               ││  │
│                         │  │           │  [Share your booking link]    ││  │
│                         │  └───────────┴───────────────────────────────┘┘  │
└─────────────────────────┴────────────────────────────────────────────────────┘
```

**Populated wireframe**:

```
┌─────────────────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR                 │  MAIN CONTENT                                      │
│                         │                                                    │
│  [CalendlyAlt]          │  Bookings                                          │
│                         │                                                    │
│  [CalendarDays] Event   │  [ Upcoming (4) ]  [ Past (5) ]  [ Cancelled (1) ]│
│               Types     │                                                    │
│  [BookOpen]  Bookings ● │  ┌─────────────────────────────────────────────┐  │
│  [Clock]   Availability │  │  [SM]  Sofia Mendez         30-min Discovery │  │
│  [Settings]  Settings   │  │        sofia@acme.co         Call            │  │
│                         │  │        Tue 14 Jan, 10:00am  [●Confirmed]    │  │
│  ─────────────────────  │  ├─────────────────────────────────────────────┤  │
│  [LogOut]    Log out    │  │  [JL]  James Liu            15-min Quick     │  │
│                         │  │        james@loop.io         Chat            │  │
│                         │  │        Wed 15 Jan, 2:00pm   [●Confirmed]    │  │
│                         │  ├─────────────────────────────────────────────┤  │
│                         │  │  [PN]  Priya Nair            60-min Strategy │  │
│                         │  │        priya@stackform.io    Session         │  │
│                         │  │        Thu 16 Jan, 11:00am  [●Confirmed]    │  │
│                         │  ├─────────────────────────────────────────────┤  │
│                         │  │  [TR]  Tom Reynolds         30-min Discovery │  │
│                         │  │        tom@freelance.co      Call            │  │
│                         │  │        Fri 17 Jan, 3:00pm   [●Confirmed]    │  │
│                         │  └─────────────────────────────────────────────┘  │
└─────────────────────────┴────────────────────────────────────────────────────┘
```

### Tabs

- `tabs` (shadcn) component. Three tabs: "Upcoming", "Past", "Cancelled". Badge counts inside tab labels (e.g. "Upcoming (4)").
- Tab selection is the only filter. No date range picker, no event type filter — the tabs cover the three states a booking occupies, and the list is short enough to scan.
- Default tab on load: Upcoming. URL does not encode tab state — navigating away and back resets to Upcoming (simpler, no edge cases).

### Booking list

- `table` (shadcn) rows, one booking per row. No column headers — the row layout is consistent enough to read without them.
- Row anatomy:
  - Guest avatar: initials `avatar` component (e.g. "SM" for Sofia Mendez). Sky background, white initials.
  - Guest name in `semibold foreground` + email in `muted-foreground` below, stacked left.
  - Event type name center-column in `muted-foreground`.
  - Date + time right-aligned in `muted-foreground` (e.g. "Tue 14 Jan, 10:00am").
  - Status `badge`: green filled "Confirmed" for upcoming/past, gray outline "Cancelled" for cancelled tab.
  - On Upcoming rows only: "Cancel" `button` ghost destructive on far right. Hidden on Past and Cancelled rows — you can't cancel what's already done.
- Row hover: `bg-muted/60`. Clicking anywhere on the row (not the cancel button) expands the row to show full details.

### Expanded row (booking details)

- Clicking a row expands an inline panel below the row — no navigation, no sheet, no modal.
- Expanded content: guest notes (if any), full location value ("Conferencing link: zoom.us/j/..."), event type description.
- "Cancel this booking" destructive `button` in the expanded panel (for upcoming) — opens `alert-dialog` confirm before executing.
- On cancel confirm: status → "cancelled", cancelled_at → now(), row moves to Cancelled tab on next load.
- No reschedule button — per D7, guests cancel and rebook. Reschedule requires the full booking flow re-entry, which is out of scope.

### Cancel confirm modal

```
┌───────────────────────────────────────────────────┐
│  Cancel this booking?                             │
│                                                   │
│  Sofia Mendez · 30-min Discovery Call             │
│  Tue 14 Jan, 10:00am                             │
│                                                   │
│  The booking will be marked as cancelled.         │
│  No notification is sent automatically.           │
│                                                   │
│           [Keep it]   [Cancel booking]            │
└───────────────────────────────────────────────────┘
```

- `alert-dialog` (shadcn). Opened by "Cancel" button in row or expanded panel.
- Clarifies no notification is sent (per D3 — no email API). Sets honest expectations.
- "Keep it" (primary) / "Cancel booking" (destructive outlined).

* * *

**Data shape** (`src/data/seed.ts`):

- Bookings: 10 entries —
  - `{id: "b1", event_type_id: "et2", host_user_id: "u1", guest_name: "Sofia Mendez", guest_email: "sofia@acme.co", guest_notes: "Looking to discuss Q1 targets", start_time: "2025-01-14T10:00:00Z", end_time: "2025-01-14T10:30:00Z", status: "confirmed"}`
  - `{id: "b2", event_type_id: "et1", host_user_id: "u1", guest_name: "James Liu", guest_email: "james@loop.io", guest_notes: "", start_time: "2025-01-15T14:00:00Z", end_time: "2025-01-15T14:15:00Z", status: "confirmed"}`
  - `{id: "b3", event_type_id: "et3", host_user_id: "u1", guest_name: "Priya Nair", guest_email: "priya@stackform.io", guest_notes: "Interested in product strategy partnership", start_time: "2025-01-16T11:00:00Z", end_time: "2025-01-16T12:00:00Z", status: "confirmed"}`
  - `{id: "b4", event_type_id: "et2", host_user_id: "u1", guest_name: "Tom Reynolds", guest_email: "tom@freelance.co", guest_notes: "", start_time: "2025-01-17T15:00:00Z", end_time: "2025-01-17T15:30:00Z", status: "confirmed"}`
  - `{id: "b5", event_type_id: "et1", host_user_id: "u1", guest_name: "Dana Kim", guest_email: "dana@venture.io", guest_notes: "", start_time: "2024-12-20T09:00:00Z", end_time: "2024-12-20T09:15:00Z", status: "confirmed"}`
  - `{id: "b6", event_type_id: "et3", host_user_id: "u1", guest_name: "Marcus Webb", guest_email: "marcus@design.co", guest_notes: "Portfolio review", start_time: "2024-12-18T14:00:00Z", end_time: "2024-12-18T15:00:00Z", status: "confirmed"}`
  - `{id: "b7", event_type_id: "et2", host_user_id: "u1", guest_name: "Lena Hoffmann", guest_email: "lena@berlin.de", guest_notes: "", start_time: "2024-12-15T10:00:00Z", end_time: "2024-12-15T10:30:00Z", status: "confirmed"}`
  - `{id: "b8", event_type_id: "et2", host_user_id: "u1", guest_name: "Raj Patel", guest_email: "raj@consult.in", guest_notes: "Partnership opportunity", start_time: "2024-12-10T11:00:00Z", end_time: "2024-12-10T11:30:00Z", status: "confirmed"}`
  - `{id: "b9", event_type_id: "et1", host_user_id: "u1", guest_name: "Claire Dubois", guest_email: "claire@paris.fr", guest_notes: "", start_time: "2024-12-05T16:00:00Z", end_time: "2024-12-05T16:15:00Z", status: "confirmed"}`
  - `{id: "b10", event_type_id: "et2", host_user_id: "u1", guest_name: "Alex Torres", guest_email: "alex@startupco.io", guest_notes: "Reschedule attempt", start_time: "2024-12-22T10:00:00Z", end_time: "2024-12-22T10:30:00Z", status: "cancelled", cancelled_at: "2024-12-21T08:00:00Z"}`

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | none |
| **Read** | bookings list filtered by tab (upcoming = confirmed + start_time > now, past = confirmed + start_time ≤ now, cancelled = status=cancelled) |
| **Update** | cancel booking — sets status to "cancelled", cancelled_at to now() |
| **Delete** | none — bookings are cancelled, not deleted |
| **Filter** | tab selection filters by status + start_time relative to now() |
| **Sort** | upcoming: start_time ascending; past: start_time descending; cancelled: cancelled_at descending |
| **Search** | none |
| **Paginate** | none — 10 bookings in seed; load all for personal-scale tool |
| **Aggregate** | tab count badges derived from filtered row counts |
| **Drill down** | click row → in-place row expand with guest notes, location, cancel action |
| **Auth** | protected; `/demo/bookings` public with seed data |

**First-time view notes**:

- Blankslate: "No upcoming bookings. When someone books time with you, it'll show up here."
- CTA inside blankslate: "Share your booking link" → copies the user's booking URL and shows toast "Link copied".
- Past and Cancelled tabs also show blankslates if empty: "No past bookings" / "No cancelled bookings" with brief body copy only — no CTA needed.

**States**: first-time (blankslate), upcoming tab populated (shown above), past tab, cancelled tab, row expanded, cancel-confirm open, loading (skeleton rows)

* * *

## Availability (`/availability`)

Weekly availability schedule — day toggles, time pickers per day, timezone selector. One schedule for all event types.

(Demo route `/demo/availability` mirrors this screen pre-populated with seed data — no separate wireframe needed.)

**First-time wireframe** (new user — pre-filled Mon–Fri 9–5):

```
┌─────────────────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR                 │  MAIN CONTENT                                      │
│                         │                                                    │
│  [CalendlyAlt]          │  Availability                                      │
│                         │                                                    │
│  [CalendarDays] Event   │  Timezone                                          │
│               Types     │  ┌──────────────────────────────────────────────┐  │
│  [BookOpen]  Bookings   │  │ Europe/London (GMT+0)                    [v] │  │
│  [Clock] Availability ● │  └──────────────────────────────────────────────┘  │
│  [Settings]  Settings   │                                                    │
│                         │  Weekly schedule                                   │
│  ─────────────────────  │  ┌──────────────────────────────────────────────┐  │
│  [LogOut]    Log out    │  │  [✓] Monday      09:00 [v]  –  17:00 [v]    │  │
│                         │  │  [✓] Tuesday     09:00 [v]  –  17:00 [v]    │  │
│                         │  │  [✓] Wednesday   09:00 [v]  –  17:00 [v]    │  │
│                         │  │  [✓] Thursday    09:00 [v]  –  17:00 [v]    │  │
│                         │  │  [✓] Friday      09:00 [v]  –  17:00 [v]    │  │
│                         │  │  [ ] Saturday    (unavailable)               │  │
│                         │  │  [ ] Sunday      (unavailable)               │  │
│                         │  └──────────────────────────────────────────────┘  │
│                         │                                                    │
│                         │  [Save schedule]                                   │
│                         │                                                    │
│                         │  ℹ  This schedule applies to all your event       │
│                         │     types. Guests see available slots in their    │
│                         │     own timezone.                                  │
└─────────────────────────┴────────────────────────────────────────────────────┘
```

**Populated wireframe** (user has customized — Tuesday off, Thursday extended):

```
┌─────────────────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR                 │  MAIN CONTENT                                      │
│                         │                                                    │
│  [CalendlyAlt]          │  Availability                                      │
│                         │                                                    │
│  [CalendarDays] Event   │  Timezone                                          │
│               Types     │  ┌──────────────────────────────────────────────┐  │
│  [BookOpen]  Bookings   │  │ America/New_York (GMT-5)                 [v] │  │
│  [Clock] Availability ● │  └──────────────────────────────────────────────┘  │
│  [Settings]  Settings   │                                                    │
│                         │  Weekly schedule                                   │
│  ─────────────────────  │  ┌──────────────────────────────────────────────┐  │
│  [LogOut]    Log out    │  │  [✓] Monday      09:00 [v]  –  17:00 [v]    │  │
│                         │  │  [ ] Tuesday     (unavailable)               │  │
│                         │  │  [✓] Wednesday   09:00 [v]  –  17:00 [v]    │  │
│                         │  │  [✓] Thursday    08:00 [v]  –  19:00 [v]    │  │
│                         │  │  [✓] Friday      09:00 [v]  –  17:00 [v]    │  │
│                         │  │  [ ] Saturday    (unavailable)               │  │
│                         │  │  [ ] Sunday      (unavailable)               │  │
│                         │  └──────────────────────────────────────────────┘  │
│                         │                                                    │
│                         │  [Save schedule]                                   │
│                         │                                                    │
│                         │  ℹ  This schedule applies to all your event       │
│                         │     types. Guests see available slots in their    │
│                         │     own timezone.                                  │
└─────────────────────────┴────────────────────────────────────────────────────┘
```

### Timezone selector

- `select` (shadcn) full-width. Options are IANA timezone strings with offset labels (e.g. "America/New_York (GMT-5)").
- Pre-populated on sign-up from `Intl.DateTimeFormat().resolvedOptions().timeZone`. User can override.
- Positioned above the weekly grid — timezone context before schedule makes logical sense.
- No "Detect my timezone" button alongside — the pre-population already handles this. Adding it creates confusion about whether they're using their current timezone or a saved one.

### Weekly schedule grid

- Custom page-level component. Seven rows, one per day of the week, inside a single `card`.
- Each row: `checkbox` (shadcn) left — toggles the day available/unavailable. Day label in `semibold`. When checked: start time `select` + dash separator + end time `select`. When unchecked: "(unavailable)" in `muted-foreground`; time selects hidden.
- Time `select` options: 30-minute increments from 00:00 to 23:30 (e.g. "09:00", "09:30", "10:00", …).
- End time options start from the selected start time + 30 min to prevent invalid ranges.
- No multiple time windows per day (e.g. 9–12 and 1–5) — per D7, one window per day is enough for a personal tool. Complexity is cut deliberately.
- Days are always shown in Mon–Sun order regardless of locale. Reordering by locale is a power feature not worth the implementation cost here.

### Save button

- Single primary `button` "Save schedule" below the grid. Writes the full availability JSONB to Supabase on the `profiles` row. Shows `sonner` toast "Schedule saved".
- No auto-save — the user controls when changes apply. Auto-save on every checkbox click would cause partial saves mid-edit.

### Info note

- `alert` (shadcn) with `[Info]` icon below the Save button. Text: "This schedule applies to all your event types. Guests see available slots in their own timezone."
- Static — not dismissable. The user needs this reminder every time they edit, not just the first time.

* * *

**Data shape** (`src/data/seed.ts`):

- Availability (stored as JSONB on `profiles`):\`\`\` { mon: [{start: "09:00", end: "17:00"}], tue: [{start: "09:00", end: "17:00"}], wed: [{start: "09:00", end: "17:00"}], thu: [{start: "09:00", end: "17:00"}], fri: [{start: "09:00", end: "17:00"}], sat: null, sun: null }

```
- Profile timezone: `"America/New_York"`

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | none |
| **Read** | availability JSONB + timezone from profiles row |
| **Update** | day toggles, time selects → Save writes full JSONB to profiles |
| **Delete** | none — toggling a day off sets its value to null, not a row delete |
| **Filter** | none |
| **Sort** | none |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | none |
| **Drill down** | none |
| **Auth** | protected; `/demo/availability` public with seed data |

**First-time view notes**:

- Pre-filled Mon–Fri 9–5 in the browser timezone on account creation (per D6). User arrives at a working schedule, not a blank form.
- No blankslate — the pre-filled state IS the first-time view. Primary CTA: "Save schedule" to confirm and persist the defaults.

**States**: pre-filled defaults (first-time), customized (populated), saving (button loading + disabled), saved (toast visible)

* * *

## Settings (`/settings`)

Profile and general preferences. Display name, username, bio, avatar, conferencing URL. Theme toggle and logout in the General tab.

(Demo route `/demo/settings` mirrors this screen pre-populated with seed data — no separate wireframe needed.)

**First-time wireframe** (new user — fields mostly empty):
```

┌─────────────────────────┬────────────────────────────────────────────────────┐ │ SIDEBAR │ MAIN CONTENT │ │ │ │ │ [CalendlyAlt] │ Settings │ │ │ │ │ [CalendarDays] Event │ [ Profile ] [ General ] │ │ Types │ │ │ [BookOpen] Bookings │ ┌──────────────────────────────────────────────┐ │ │ [Clock] Availability │ │ Avatar │ │ │ [Settings] Settings ● │ │ ┌──────┐ │ │ │ │ │ │ AM │ [Upload photo] │ │ │ ───────────────────── │ │ └──────┘ │ │ │ [LogOut] Log out │ │ │ │ │ │ │ Display name │ │ │ │ │ ┌────────────────────────────────────────┐ │ │ │ │ │ │ │ │ │ │ │ │ └────────────────────────────────────────┘ │ │ │ │ │ │ │ │ │ │ Username │ │ │ │ │ ┌────────────────────────────────────────┐ │ │ │ │ │ │ │ │ │ │ │ │ └────────────────────────────────────────┘ │ │ │ │ │ book/[username] │ │ │ │ │ │ │ │ │ │ Bio (optional) │ │ │ │ │ ┌────────────────────────────────────────┐ │ │ │ │ │ │ │ │ │ │ │ │ └────────────────────────────────────────┘ │ │ │ │ │ │ │ │ │ │ Conferencing URL (optional) │ │ │ │ │ ┌────────────────────────────────────────┐ │ │ │ │ │ │ e.g. [https://zoom.us/j/your-meeting](https://zoom.us/j/your-meeting) │ │ │ │ │ │ └────────────────────────────────────────┘ │ │ │ │ │ Paste your Zoom, Meet, or Teams link once. │ │ │ │ │ It appears on every booking confirmation. │ │ │ │ │ │ │ │ │ │ [Save profile] │ │ │ │ └──────────────────────────────────────────────┘ │ └─────────────────────────┴────────────────────────────────────────────────────┘

```

**Populated wireframe** (Profile tab):
```

┌─────────────────────────┬────────────────────────────────────────────────────┐ │ SIDEBAR │ MAIN CONTENT │ │ │ │ │ [CalendlyAlt] │ Settings │ │ │ │ │ [CalendarDays] Event │ [ Profile ] [ General ] │ │ Types │ │ │ [BookOpen] Bookings │ ┌──────────────────────────────────────────────┐ │ │ [Clock] Availability │ │ Avatar │ │ │ [Settings] Settings ● │ │ ┌──────┐ │ │ │ │ │ │ [img]│ [Upload photo] │ │ │ ───────────────────── │ │ └──────┘ │ │ │ [LogOut] Log out │ │ │ │ │ │ │ Display name │ │ │ │ │ ┌────────────────────────────────────────┐ │ │ │ │ │ │ Alex Morgan │ │ │ │ │ │ └────────────────────────────────────────┘ │ │ │ │ │ │ │ │ │ │ Username │ │ │ │ │ ┌────────────────────────────────────────┐ │ │ │ │ │ │ alexmorgan │ │ │ │ │ │ └────────────────────────────────────────┘ │ │ │ │ │ book/alexmorgan │ │ │ │ │ │ │ │ │ │ Bio (optional) │ │ │ │ │ ┌────────────────────────────────────────┐ │ │ │ │ │ │ Product Consultant · Happy to chat │ │ │ │ │ │ │ anytime. │ │ │ │ │ │ └────────────────────────────────────────┘ │ │ │ │ │ │ │ │ │ │ Conferencing URL (optional) │ │ │ │ │ ┌────────────────────────────────────────┐ │ │ │ │ │ │ [https://zoom.us/j/94821039211](https://zoom.us/j/94821039211) │ │ │ │ │ │ └────────────────────────────────────────┘ │ │ │ │ │ Paste your Zoom, Meet, or Teams link once. │ │ │ │ │ It appears on every booking confirmation. │ │ │ │ │ │ │ │ │ │ [Save profile] │ │ │ │ └──────────────────────────────────────────────┘ │ └─────────────────────────┴────────────────────────────────────────────────────┘

```

**General tab wireframe**:
```

┌─────────────────────────┬────────────────────────────────────────────────────┐ │ SIDEBAR │ MAIN CONTENT │ │ │ │ │ [CalendlyAlt] │ Settings │ │ │ │ │ [CalendarDays] Event │ [ Profile ] [ General ] │ │ Types │ │ │ [BookOpen] Bookings │ ┌──────────────────────────────────────────────┐ │ │ [Clock] Availability │ │ Appearance │ │ │ [Settings] Settings ● │ │ Dark mode [toggle off] │ │ │ │ │ │ │ │ ───────────────────── │ │ ───────────────────────────────────────── │ │ │ [LogOut] Log out │ │ │ │ │ │ │ Account │ │ │ │ │ [Log out of this account] │ │ │ │ └──────────────────────────────────────────────┘ │ └─────────────────────────┴────────────────────────────────────────────────────┘

```

### Tabs

- `tabs` (shadcn). Two tabs: "Profile" and "General". In-place swap, no navigation.
- Profile is the default tab and the higher-priority job — the FTUX banner comes from incomplete profile data.
- No "Notifications" tab — email notifications are cut (D3). No "Billing" tab — no payment collection (D7).

### Profile tab — avatar

- `avatar` (shadcn) showing initials or uploaded image. "Upload photo" ghost `button` next to it.
- Avatar upload: file input `input type=file`, accepts image/*. On select, preview updates in-place. Save profile writes the file to Supabase Storage and saves the URL.
- No crop tool — the template keeps image handling simple. Supabase Storage handles serving the original.

### Profile tab — form fields

- `form` (shadcn, with react-hook-form) inside a `card`. `max-w-3xl mx-auto` per design guidelines.
- Display name: `input` text. Required. Used as the name on the public booking page.
- Username: `input` text. Required. Slug-safe characters only (alphanumeric + hyphens). Helper text below: "book/[username]" updates live as the user types.
- Bio: `textarea`. Optional. Short bio shown on the public booking index below the user's name.
- Conferencing URL: `input` text. Optional. Helper text: "Paste your Zoom, Meet, or Teams link once. It appears on every booking confirmation."
- "Save profile" primary `button` at the bottom. Writes to `profiles` table. `sonner` toast "Profile saved". After save, FTUX banner on Event Types dismisses automatically.
- No separate "cancel" / "discard" button — settings forms conventionally save or the user navigates away. The fields are always live-editable.

### General tab

- Single `card`. Two sections separated by a `separator`.
- Appearance section: "Dark mode" label + `switch` (shadcn) toggle. Toggles Tailwind dark class on the `<html>` element. No save needed — persisted to `localStorage` and applied on load.
- Account section: "Log out of this account" ghost destructive `button`. Signs out via Supabase auth and redirects to `/`.
- No data export, no account deletion — those are support-level features beyond the template's scope.

* * *

**Data shape** (`src/data/seed.ts`):

- Profile: 1 entry — `{id: "u1", full_name: "Alex Morgan", username: "alexmorgan", bio: "Product Consultant · Happy to chat anytime.", avatar_url: null, conferencing_url: "https://zoom.us/j/94821039211", timezone: "America/New_York"}`

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | none |
| **Read** | profile row (full_name, username, bio, avatar_url, conferencing_url) |
| **Update** | Profile tab: full_name, username, bio, avatar_url, conferencing_url — all via Save profile; General tab: dark mode toggle (localStorage) |
| **Delete** | none |
| **Filter** | none |
| **Sort** | none |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | none |
| **Drill down** | none |
| **Auth** | protected; `/demo/settings` public with seed data |

**First-time view notes**:

- All fields empty except what was captured at sign-up (full_name from OAuth or sign-up form, username auto-generated from name).
- Primary CTA: "Save profile" — user fills display name, username, bio, and conferencing URL.
- No secondary option — there's no import or template for a profile.

**States**: profile tab (first-time empty), profile tab populated, general tab, saving (button loading), saved (toast visible)

* * *

## Public Booking Index (`/book/:username`)

Public-facing profile page. Anyone with the link sees this — no account required. Profile card + list of active event types.

**First-time wireframe** (host has no active event types):
```

┌──────────────────────────────────────────────────────────────────────────────┐ │ │ │ ┌──────────────────────────────────────┐ │ │ │ │ │ │ │ ┌──────┐ Alex Morgan │ │ │ │ │ AM │ Product Consultant · │ │ │ │ └──────┘ Happy to chat anytime. │ │ │ │ │ │ │ │ ───────────────────────────────── │ │ │ │ │ │ │ │ No events available right now. │ │ │ │ Check back soon. │ │ │ │ │ │ │ └──────────────────────────────────────┘ │ │ │ │ Powered by CalendlyAlt │ │ │ └──────────────────────────────────────────────────────────────────────────────┘

```

**Populated wireframe**:
```

┌──────────────────────────────────────────────────────────────────────────────┐ │ │ │ ┌──────────────────────────────────────┐ │ │ │ │ │ │ │ ┌──────┐ Alex Morgan │ │ │ │ │ [img]│ Product Consultant · │ │ │ │ └──────┘ Happy to chat anytime. │ │ │ │ │ │ │ │ ───────────────────────────────── │ │ │ │ │ │ │ │ [Clock] 15-min Quick Chat │ │ │ │ Casual intro or quick │ │ │ │ question [→] │ │ │ │ │ │ │ │ [Clock] 30-min Discovery Call │ │ │ │ Walk through your goals │ │ │ │ and challenges [→] │ │ │ │ │ │ │ │ [Clock] 60-min Strategy Session │ │ │ │ Deep-dive planning │ │ │ │ session [→] │ │ │ │ │ │ │ └──────────────────────────────────────┘ │ │ │ │ Powered by CalendlyAlt │ │ │ └──────────────────────────────────────────────────────────────────────────────┘

```

### Page shell

- `application-layout` — no sidebar, no top bar. This is a public page; authenticated app chrome would confuse guests.
- Centered single-column layout. Max width ~480px for the card — booking pages are phone-friendly by convention.
- No header with sign-in CTA — this page is for guests, not for converting them to users. The "Powered by CalendlyAlt" footer attribution suffices.

### Profile card

- Single `card`. Avatar (`avatar` shadcn, image if set, initials fallback), display name in `h2 semibold`, bio in `muted-foreground`. Compact — guests need just enough context to trust they're in the right place.
- `separator` below the profile block, above the event type list.
- No social links, no external URL, no contact button — those are power features. The booking list IS the contact mechanism.

### Event type list

- Flat list inside the same `card`. Only `is_active = true` event types shown — inactive types are the host's drafts.
- Each row: `[Clock]` icon + duration in `muted-foreground`, event type name in `semibold`, description in `muted-foreground` below. `[ChevronRight]` icon right-aligned.
- Row hover: `bg-muted/60`. Full row is clickable → `/book/:username/:slug`.
- No copy-link affordance — guests book, they don't manage. The host's copy-link lives in the app.
- If no active event types: plain text "No events available right now. Check back soon." — no CTA, no encouragement to sign up. The guest arrived expecting to book; no events means nothing to do here.

### Footer attribution

- Single centered muted text line: "Powered by CalendlyAlt". No links, no nav. Minimal brand presence — the host's profile is the hero.

* * *

**Data shape** (`src/data/seed.ts`):

- Uses the `profiles` and `event_types` entities already defined above. Public booking index reads: `{full_name, username, bio, avatar_url}` from profiles + all `event_types` where `user_id = host_user_id AND is_active = true`.
- Demo username: `"demo"` at `/book/demo`.

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | none |
| **Read** | profile (full_name, bio, avatar_url) + active event types (name, slug, duration_minutes, description) for the given username |
| **Update** | none |
| **Delete** | none |
| **Filter** | only is_active = true event types shown |
| **Sort** | event types by created_at ascending (oldest first — gives stable order the host can rely on) |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | none |
| **Drill down** | click event type row → Public Booking Flow (`/book/:username/:slug`) |
| **Auth** | public (no auth required) |

**First-time view notes**:

- No blankslate in the traditional sense — if the host has no active event types, the card shows "No events available right now. Check back soon."
- No CTA for the guest — nothing to do without an event type. The host needs to activate an event type first.

**States**: populated (shown above), no-active-events empty state, loading (skeleton rows while fetching)

* * *

## Public Booking Flow (`/book/:username/:slug`)

Guest-facing booking page with two view modes: month view (3-column: meta | calendar | slots) and column view (2-column: meta with mini calendar | multi-day slot grid). Matches the Cal.com layout pattern. No account required.

**Month view wireframe** (default — today pre-selected, slots visible immediately):
```

┌──────────────────────────────────────────────────────────────────────────────┐ │ ← Back [12h][24h] [📅][⊟] │ │ │ │ META (280px, sticky) │ CALENDAR (1fr) │ TIMESLOTS (280px) │ │ ──────────────────────│─────────────────────────────│───────────────────── │ │ │ │ │ │ (○) Alex Morgan │ July 2026 [<] [>] │ Tue 1 [12h][24h] │ │ │ │ │ │ 30-min Discovery Call │ SUN MON TUE WED THU FRI SAT│ ┌────────────────┐ │ │ │ [1] 2 3 4 5│ │ ● 1:00pm │ │ │ ⏱ 30m │ 6 7 8 9 10 11 12│ └────────────────┘ │ │ 📹 Conferencing link │ 13 14 15 16 17 18 19│ ┌────────────────┐ │ │ 🌐 America/Chicago ▾ │ 20 21 22 23 24 25 26│ │ ● 1:30pm │ │ │ (auto-detected) │ 27 28 29 30 31 │ └────────────────┘ │ │ │ │ ┌────────────────┐ │ │ │ Past: muted, disabled │ │ ● 2:00pm │ │ │ │ Available: bg-emphasis │ └────────────────┘ │ │ │ Today: bg-brand + dot │ ┌────────────────┐ │ │ │ Selected: border-brand │ │ ● 2:30pm │ │ │ │ │ └────────────────┘ │ │ │ │ ┌────────────────┐ │ │ │ │ │ ● 3:00pm │ │ │ │ │ └────────────────┘ │ │ │ │ ... │ ├──────────────────────────────────────────────────────────────────────────────┤ │ Powered by CalendlyAlt │ └──────────────────────────────────────────────────────────────────────────────┘

```

**Column view wireframe** (multi-day slot grid — all days' slots visible at once):
```

┌──────────────────────────────────────────────────────────────────────────────┐ │ ← Back [12h][24h] [📅][⊟] │ │ │ │ META (424px, sticky) │ SLOT COLUMNS (1fr) │ │ ────────────────────────────│──────────────────────────────────────────────│ │ │ │ │ (○) Alex Morgan │ TUE 1 WED 2 THU 3 FRI 4 │ │ │ ● 1:00pm ● 1:00pm ● 1:00pm ● 1:00pm │ │ 30-min Discovery Call │ ● 1:30pm ● 1:30pm ● 1:30pm ● 1:30pm │ │ │ ● 2:00pm ● 2:00pm ● 2:00pm ● 2:00pm │ │ ⏱ 30m │ ● 2:30pm ● 2:30pm ● 2:30pm ● 2:30pm │ │ 📹 Conferencing link │ ● 3:00pm ● 3:00pm ● 3:00pm ● 3:00pm │ │ 🌐 America/Chicago ▾ │ ● 3:30pm ● 3:30pm ● 3:30pm ● 3:30pm │ │ (auto-detected) │ ● 4:00pm ● 4:00pm ● 4:00pm ● 4:00pm │ │ │ ● 4:30pm ● 4:30pm ● 4:30pm ● 4:30pm │ │ July 2026 [<] [>] │ │ │ SUN MON TUE WED THU FRI SAT│ (weekends skipped — no availability) │ │ [1] 2 3 4 5 │ (today's column header uses brand bg) │ │ 6 7 8 9 10 11 12 │ │ │ 13 14 15 16 17 18 19 │ MON 7 TUE 8 │ │ 20 21 22 23 24 25 26 │ ● 1:00pm ● 1:00pm │ │ 27 28 29 30 31 │ ● 1:30pm ● 1:30pm │ │ │ ... ... │ ├──────────────────────────────┴──────────────────────────────────────────────┤ │ Powered by CalendlyAlt │ └──────────────────────────────────────────────────────────────────────────────┘

```

**Guest form wireframe** (appears after selecting a time slot in either view):
```

┌──────────────────────────────────────────────────────────────────────────────┐ │ ← Back │ │ │ │ META (280px, sticky) │ GUEST FORM (centered, max-w-md) │ │ ──────────────────────│─────────────────────────────────────────────────── │ │ │ │ │ (○) Alex Morgan │ 30-min Discovery Call │ │ │ Tuesday, July 1 · 1:00pm – 1:30pm │ │ 30-min Discovery Call │ America/Chicago │ │ │ │ │ ⏱ 30m │ ───────────────────────────────────────────── │ │ 📹 Conferencing link │ │ │ 🌐 America/Chicago │ Your name * │ │ │ ┌──────────────────────────────────────────┐ │ │ Tue, Jul 1 │ │ Sofia Mendez │ │ │ 1:00pm – 1:30pm │ └──────────────────────────────────────────┘ │ │ │ │ │ │ Email address * │ │ │ ┌──────────────────────────────────────────┐ │ │ │ │ [sofia@acme.co](mailto:sofia@acme.co) │ │ │ │ └──────────────────────────────────────────┘ │ │ │ │ │ │ Additional notes (optional) │ │ │ ┌──────────────────────────────────────────┐ │ │ │ │ Looking to discuss Q1 targets │ │ │ │ └──────────────────────────────────────────┘ │ │ │ │ │ │ [Confirm booking] │ ├──────────────────────────────────────────────────────────────────────────────┤ │ Powered by CalendlyAlt │ └──────────────────────────────────────────────────────────────────────────────┘

```

**Confirmation wireframe**:
```

┌──────────────────────────────────────────────────────────────────────────────┐ │ │ │ [CheckCircle] │ │ You're booked! │ │ │ │ 30-min Discovery Call with Alex Morgan │ │ Tuesday, July 1 · 1:00pm – 1:30pm (America/Chicago) │ │ [Video] Conferencing link: zoom.us/j/94821039211 │ │ │ │ Add to your calendar │ │ [Google Calendar] [Outlook] [Download .ics] │ │ │ │ ────────────────────────────────────────── │ │ [← Book another meeting] │ │ │ │ Powered by CalendlyAlt │ └──────────────────────────────────────────────────────────────────────────────┘

```

### Page shell

- `application-layout` — no sidebar, no top bar. Public shell, same as booking index.
- "← Back" plain text link top-left → `/book/:username`. Low-emphasis escape.
- View mode toggle top-right: `toggle-group` (shadcn) with two icons — month view `[Calendar]` (default) and column view `[Columns]`. Persisted in `localStorage` so returning guests keep their preference.
- `12h` / `24h` toggle alongside view toggle. Also persisted in `localStorage`.

### Layout: Month view (default)

- CSS grid: `grid-template-columns: var(--booker-meta-width) 1fr var(--booker-timeslots-width)`. Matches Cal.com's `meta | main | timeslots` pattern.
- `--booker-meta-width: 240px` (lg: `280px`), `--booker-timeslots-width: 240px` (lg: `280px`).
- Container has `border-subtle border rounded-md` — a card, not full-viewport.
- All three columns visible simultaneously — no progressive reveal. Today is pre-selected on load, so time slots show immediately.
- On mobile (<640px): stacks vertically — meta on top, calendar below, time slots below calendar. Single column.

### Layout: Column view

- CSS grid: `grid-template-columns: var(--booker-meta-width) 1fr`. Two columns — meta (wider, with mini calendar) and multi-day slot grid.
- `--booker-meta-width: 340px` (lg: `424px`). Wider than month view because the mini calendar moves here.
- Mini `calendar` (shadcn) renders below the event info in the meta sidebar. Same calendar component, just at a smaller scale.
- Main area: horizontal grid of slot columns, one per available day in the current week/range. Day headers at the top: "TUE 1", "WED 2", etc. Days without availability (weekends, toggled-off days) are skipped — no empty columns.
- Today's column header uses `bg-brand-default text-brand` pill (matching Cal.com).
- Week navigation: `[<]` / `[>]` buttons in a sticky header row above the columns, showing the date range ("Jul 1 – Jul 7, 2026").
- Each column is a scrollable list of the same slot `button` components used in month view. Identical markup, just arranged in N columns instead of 1.

### Meta sidebar (shared by both views)

- `position: sticky; top: 0`. Stays pinned while the main area scrolls.
- Small circular `avatar` (24px, `w-6 h-6`) — host photo or initials fallback. Links to `/book/:username`.
- Host name: `text-sm font-semibold text-subtle`.
- Event type name: `text-xl font-semibold text-default`.
- Info rows with 16px icons: `[Clock]` + duration, `[Video]`/`[MapPin]` + location label, `[Globe]` + timezone `select` dropdown.
- Timezone `select` pre-populated from `Intl.DateTimeFormat().resolvedOptions().timeZone`. Label shows "(auto-detected)" until manually overridden. Changing timezone recalculates all slot times in-place.
- In column view: mini `calendar` (shadcn) appears below the info rows with month navigation. Clicking a day in the mini calendar scrolls the column view to that day's column.

### Calendar (month view center column)

- `calendar` (shadcn). Single-month view. Month navigation `[<]` / `[>]` buttons.
- Today: `bg-brand-default text-brand` fill + 5px `bg-brand-accent` dot below the number — pre-selected on first load.
- Available days: `bg-emphasis text-emphasis`, `hover:border-brand-default`. Clickable.
- Past days and fully-booked days: `text-bookinglighter`, disabled, no hover.
- Day headers: `text-xs font-medium uppercase tracking-widest` (SUN, MON, TUE...).
- Selecting a day updates the timeslots column to show that day's available slots.

### Time slots (month view right column / column view per-day columns)

- Column header: day name + date number, e.g. "Tue 1". `text-emphasis font-semibold`. In month view, the `12h`/`24h` toggle sits in this header row.
- Each slot: `button` (shadcn) with `bg-default border border-default rounded-lg min-h-9`. Full-width within the column.
- Green dot: `inline-block h-2 w-2 rounded-full bg-emerald-400` to the left of the time.
- Time text: `tabular-nums text-center min-w-[4rem] text-sm`.
- Hover: `hover:bg-cal-muted hover:text-emphasis hover:border-brand-default`.
- Selected: `bg-brand-default text-brand` fill. Selecting a slot transitions to the guest form.
- Scrollable: `scroll-area` (shadcn), `md:h-[400px] overflow-y-auto` with `no-scrollbar` class.
- "No available slots for this day." empty state: plain text centered in the column. Guest should pick a different date.

### Guest form (after slot selection)

- Replaces the calendar/slots area in-place. Meta sidebar remains visible with the selected date + time appended below the event info.
- Centered `max-w-md` form. Summary at top: event name, date + time range, timezone.
- Fields: "Your name" (`input` text, required), "Email address" (`input` email, required), "Additional notes" (`textarea`, optional, placeholder: "Anything you'd like me to know?").
- "Confirm booking" primary `button`. On click: validates, inserts booking row to Supabase (anon key, no auth), transitions to confirmation.
- No phone number, no custom questions — per D7.

### Confirmation state

- Full-page centered card (meta sidebar hidden — the booking is done, no more context needed).
- `[CheckCircle]` icon + "You're booked!" heading.
- Summary: event type name + "with [host name]", date + time range in guest timezone, conferencing URL (if set).
- "Add to your calendar" row: "Google Calendar" (external URL), "Outlook" (external URL), "Download .ics" (client-side Blob URL download).
- "← Book another meeting" ghost link → `/book/:username`.
- No email confirmation copy — per D3, no email API. The confirmation page is the source of truth.

* * *

**Data shape** (`src/data/seed.ts`):

- Uses `profiles`, `event_types`, and `bookings` entities already defined.
- Public booking flow reads:
  - `profiles` row for `:username` → `{full_name, conferencing_url, timezone, availability}`
  - `event_types` row for `:slug` → `{name, duration_minutes, description, location_type, location_value}`
  - `bookings` where `event_type_id` matches and `status = "confirmed"` → used for slot subtraction
- On confirm: inserts new `bookings` row with `guest_name, guest_email, guest_notes, start_time, end_time, status: "confirmed"`.

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | "Confirm booking" button inserts booking row (anon, no auth) |
| **Read** | host profile (name, conferencing_url, timezone, availability), event type (name, duration, description, location), existing bookings for slot calculation |
| **Update** | none |
| **Delete** | none |
| **Filter** | time slots filtered by host availability + existing confirmed bookings |
| **Sort** | time slots ascending by start time |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | slot calculation derives available windows from raw availability + booked intervals |
| **Drill down** | none |
| **Auth** | public (anon Supabase key for reads and booking insert) |

**First-time view notes**:

- Guest arrives and sees the full 3-column layout immediately — meta sidebar, calendar with today pre-selected, today's time slots already visible. No "pick a date first" empty state.
- No account needed — the guest form collects name + email at slot selection time.
- If the host has no availability configured or no slots available in the current month, the calendar shows all days as muted. Time slots column shows "No available slots."
- View mode persisted in `localStorage` — returning guests keep their month/column preference.

**States**: month-view-default (today selected, slots visible), column-view (multi-day grid), date-changed (different day selected, slots update), no-slots ("No available slots for this day"), slot-selected (guest form replaces calendar area), confirming (button loading), confirmed (full-page confirmation card), loading (skeleton while fetching host data)

* * *

## What's NOT Changing

- `components/ui/` — sacred shadcn components; used as-is throughout
- `components/ai-elements/` — not used in this template; left untouched
- `layouts/application-layout.tsx` — used for landing, auth, and all public booking routes
- `index.css` — shadcn color token defaults; not modified
- `base.css` — landing typography; not modified

Removed:

- `pages/workspace/` — replaced by `pages/app/` with template-specific page folders

Renames:

- `pages/landing/` → kept as-is (landing page lives here)
- `workspace-layout-03` → used as the app shell for all authenticated screens (`/event-types`, `/bookings`, `/availability`, `/settings`)

New files:

- `src/pages/auth/index.tsx` — Auth page (sign-in / sign-up card)
- `src/pages/event-types/index.tsx` — Event Types list page
- `src/pages/event-types/components/event-type-card.tsx` — single event type row with controls
- `src/pages/event-types/[id]/index.tsx` — Event Type Detail page (view + edit mode)
- `src/pages/bookings/index.tsx` — Bookings tabbed list
- `src/pages/bookings/components/booking-row.tsx` — single booking row with expand behavior
- `src/pages/availability/index.tsx` — Weekly availability grid page
- `src/pages/availability/components/day-row.tsx` — single day row (checkbox + time selects)
- `src/pages/settings/index.tsx` — Settings page (Profile + General tabs)
- `src/pages/book/[username]/index.tsx` — Public Booking Index
- `src/pages/book/[username]/[slug]/index.tsx` — Public Booking Flow (month + column view toggle)
- `src/pages/book/[username]/[slug]/components/booker-meta.tsx` — sticky meta sidebar (avatar, event info, timezone select, mini calendar in column view)
- `src/pages/book/[username]/[slug]/components/month-view.tsx` — 3-column layout: calendar center + single-day slots right
- `src/pages/book/[username]/[slug]/components/column-view.tsx` — multi-day slot grid (N columns of slot buttons, skips unavailable days)
- `src/pages/book/[username]/[slug]/components/time-slot-button.tsx` — single slot button (emerald dot + tabular-nums time, shared by both views)
- `src/pages/book/[username]/[slug]/components/guest-form.tsx` — guest name/email/notes form (replaces calendar area after slot selection)
- `src/pages/book/[username]/[slug]/components/confirmation.tsx` — booking confirmation + add-to-calendar buttons
- `src/data/seed.ts` — typed seed fixtures for all entities (profiles, event_types, bookings, availability)
- `src/lib/slot-calculator.ts` — client-side slot availability calculation (host schedule → UTC → subtract bookings → guest timezone)
- `src/lib/ics.ts` — client-side .ics file generation for calendar download
```
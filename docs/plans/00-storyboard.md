# Storyboard — Calendly Alternative

A sequential user journey. Read [00-screenboard.md](00-screenboard.md) for the UI inventory (every element on every screen).

* * *

## Act 1: First Visit (landing → sign-up)

A visitor arrives at the landing page and decides to sign up.

### Step 1: Visitor lands on the marketing page

- **Action**: Navigate to `/`
- **Screen**: Landing page (`/`), populated
- **Result**: Hero loads with headline "Stop the scheduling back-and-forth." and two CTAs. Browser-chrome mockup below shows Alex Morgan's public booking index with three event type rows. Header shows "See demo", "Sign in", "Get started".
- **See**: Landing page screen.

### Step 2: Visitor clicks "See demo" in the header

- **Action**: Click `[See demo]` ghost button in header
- **Screen**: Landing page (`/`) → Public Booking Index (`/book/demo`)
- **Result**: Public booking index opens. Profile card shows "Alex Morgan — Product Consultant · Happy to chat anytime." Three active event types listed: 15-min Quick Chat, 30-min Discovery Call, 60-min Strategy Session.
- **See**: Public Booking Index screen.

### Step 3: Visitor navigates back and scrolls the landing page

- **Action**: Click browser back → scroll through feature showcase and testimonials
- **Screen**: Landing page (`/`), populated
- **Result**: Feature showcase tabs show "Event Types", "Booking Page", "Bookings", "Availability" with product screenshots. Supporting features grid shows four tiles. Three testimonial cards visible: Jamie R., Sam T., Priya N.
- **See**: Landing page screen.

### Step 4: Visitor clicks the hero CTA

- **Action**: Click `[Get started — it's free]` hero CTA
- **Screen**: Landing page (`/`) → Auth (`/auth?intent=signup`)
- **Result**: Auth page loads with Sign up tab pre-selected. Card heading reads "Create your account".
- **See**: Auth screen, sign-up tab.
- **Copy**: `"Get started — it's free"` (action-first, §3)

### Step 5: Visitor signs up with email

- **Action**: Click Sign up tab (already active) → fill Full name "Alex Morgan", Email "[alex@example.com](mailto:alex@example.com)", Password "••••••••••" → click `[Create account]`
- **Screen**: Auth (`/auth`), sign-up tab → check-your-email state
- **Result**: Form submits. Fields replaced in-place with confirmation state.
- **Wireframe** (check your email — in-place):```
┌────────────────────────────────────────────┐
│  Check your email                          │
│                                            │
│  We sent a confirmation link to            │
│  alex@example.com                          │
│                                            │
│  Didn't get it? [Resend email]             │
└────────────────────────────────────────────┘
```
- **Copy**: `"Create account"` (action-first, §3), `"Check your email"` (direct, §1)

### Step 6: User confirms email and lands on Event Types

- **Action**: Click confirmation link in email → auto-redirect (auto)
- **Screen**: Auth → Event Types (`/event-types`), first-time view
- **Result**: Session established. `handle_new_user()` trigger fires — profile row created with full_name "Alex Morgan", username "alexmorgan", Mon–Fri 9–5 availability. Event Types loads with blankslate empty state and FTUX banner.
- **See**: Event Types screen, first-time view.

* * *

## Act 2: First-Time Experience (empty → first creation)

The user just signed up. Every screen is empty. They take their first action.

### Step 7: User sees the empty Event Types screen

- **Action**: (arrived from sign-up confirmation)
- **Screen**: Event Types (`/event-types`), first-time view
- **Result**: Skeleton background with gradient fade. Floating blankslate card: `[Plus]` icon, "No event types yet", "Create your first event type to start sharing your booking link.", `[+ New event type]` button. FTUX banner below: "Complete your profile to make your booking page look great → Go to Settings".
- **See**: Event Types screen, first-time view.

### Step 8: User reads the FTUX banner and navigates to Settings first

- **Action**: Click "Go to Settings" link in the FTUX banner
- **Screen**: Event Types (`/event-types`) → Settings (`/settings`)
- **Result**: Settings page loads with Profile tab active. Display name field is empty, username shows "alexmorgan" (auto-generated). Bio and Conferencing URL fields are empty.
- **See**: Settings screen, first-time view.

### Step 9: User fills in their profile

- **Action**: Fill Display name "Alex Morgan", leave Username as "alexmorgan", fill Bio "Product Consultant · Happy to chat anytime.", fill Conferencing URL "[https://zoom.us/j/94821039211](https://zoom.us/j/94821039211)" → click `[Save profile]`
- **Screen**: Settings (`/settings`), Profile tab
- **Result**: Profile writes to Supabase `profiles` row. Toast appears.
- **Wireframe** (toast — save profile):```
┌──────────────────────────────┐
│  ✓  Profile saved            │
└──────────────────────────────┘
```
- **Copy**: `"Save profile"` (action-first, §3), `"Profile saved"` (direct confirmation, §1)

### Step 10: User navigates to Event Types via sidebar

- **Action**: Click "Event Types" `[CalendarDays]` in sidebar
- **Screen**: Settings (`/settings`) → Event Types (`/event-types`)
- **Result**: Event Types loads. FTUX banner is now gone (profile complete). Blankslate still visible — no event types yet. Booking page URL strip at the bottom shows `cal.yourdomain.com/book/alexmorgan`.
- **See**: Event Types screen, first-time view (no FTUX banner).

### Step 11: User creates their first event type

- **Action**: Click `[+ New event type]` inside the blankslate card
- **Screen**: Event Types (`/event-types`) → Event Type Detail (`/event-types/:newId?mode=edit`), blank edit mode
- **Result**: Blank record created via Supabase insert. Navigates to detail page in edit mode. All fields empty. Duration defaults to "30 minutes". Location defaults to "Conferencing link" radio selected. Save button disabled until name is filled.
- **See**: Event Type Detail screen, first-time view (blank edit mode).

### Step 12: User fills in the event type form

- **Action**: Fill Event name "30-min Discovery Call" → URL slug auto-generates to "discovery-call" → helper text shows `book/alexmorgan/discovery-call` → Duration select stays at "30 minutes" → fill Description "Walk through your goals and challenges" → Location radio stays on "Conferencing link"
- **Screen**: Event Type Detail (`/event-types/:newId?mode=edit`), edit mode
- **Result**: Slug field shows "discovery-call". Helper text updates live. Save button becomes enabled once name is populated.
- **See**: Event Type Detail screen, edit mode.

### Step 13: User saves the event type

- **Action**: Click `[Save]`
- **Screen**: Event Type Detail (`/event-types/:id?mode=edit`) → view mode
- **Result**: Fields lock. Page transitions in-place to view mode. Toast appears. Breadcrumb updates to "Event Types > 30-min Discovery Call".
- **Wireframe** (toast — saved):```
┌──────────────────────────────┐
│  ✓  Saved                    │
└──────────────────────────────┘
```
- **Copy**: `"Save"` (action-first, §3), `"Saved"` (direct confirmation, §1)

### Step 14: User sees the event type in view mode

- **Action**: (arrived from save)
- **Screen**: Event Type Detail (`/event-types/:id`), view mode
- **Result**: Card shows event name "30-min Discovery Call" in h2, description "Walk through your goals and challenges" in muted text. Info rows: Duration "30 minutes", Location "Conferencing link", URL slug "discovery-call". Booking link row: `book/alexmorgan/discovery-call` with Copy and Preview actions. Active badge shows `●Active`. Edit button available.
- **See**: Event Type Detail screen, populated view mode.

### Step 15: User navigates back to the event types list

- **Action**: Click "Event Types" breadcrumb link
- **Screen**: Event Type Detail (`/event-types/:id`) → Event Types (`/event-types`)
- **Result**: Event Types list now shows one card row: `[Clock]` icon, "30-min Discovery Call", "Walk through your goals and challenges", `●Active` badge, Copy link button, meatball menu.
- **See**: Event Types screen, populated (one item).

### Step 16: User copies their booking link

- **Action**: Click `[Copy link]` on the "30-min Discovery Call" row
- **Screen**: Event Types (`/event-types`), populated
- **Result**: URL `/book/alexmorgan/discovery-call` copied to clipboard. Toast appears.
- **Wireframe** (toast — link copied):```
┌──────────────────────────────┐
│  ✓  Link copied              │
└──────────────────────────────┘
```
- **Copy**: `"Link copied"` (direct confirmation, §1)

### Step 17: User creates a second event type via the page header button

- **Action**: Click `[+ New event type]` in the page header
- **Screen**: Event Types (`/event-types`) → Event Type Detail (`/event-types/:newId2?mode=edit`), blank edit mode
- **Result**: Second blank record created. Edit mode loads.
- **See**: Event Type Detail screen, first-time view (blank edit mode).

### Step 18: User fills in and saves the second event type

- **Action**: Fill Event name "15-min Quick Chat" → slug auto-fills "quick-chat" → Duration select → choose "15 minutes" → Description "Casual intro or quick question" → click `[Save]`
- **Screen**: Event Type Detail (`/event-types/:newId2`), edit → view mode
- **Result**: Toast "Saved". View mode loads showing "15-min Quick Chat". Duration row shows "15 minutes".
- **See**: Event Type Detail screen, populated view mode.

### Step 19: User checks the Availability screen

- **Action**: Click "Availability" `[Clock]` in the sidebar
- **Screen**: Event Type Detail → Availability (`/availability`)
- **Result**: Availability loads pre-filled with Mon–Fri 9–5, Sat/Sun unchecked. Timezone selector shows the auto-detected browser timezone. Info note visible below Save button.
- **See**: Availability screen, first-time view (pre-filled Mon–Fri 9–5).

### Step 20: User saves the pre-filled schedule to persist it

- **Action**: Click `[Save schedule]`
- **Screen**: Availability (`/availability`)
- **Result**: Schedule writes to Supabase `profiles.availability`. Toast appears.
- **Wireframe** (toast — schedule saved):```
┌──────────────────────────────┐
│  ✓  Schedule saved           │
└──────────────────────────────┘
```
- **Copy**: `"Save schedule"` (action-first, §3), `"Schedule saved"` (direct confirmation, §1)

### Step 21: User visits their public booking page as a guest would

- **Action**: Click `[→]` in the booking page URL strip at the bottom of the Event Types page (navigate back to Event Types first via sidebar, then click the arrow)
- **Screen**: Event Types (`/event-types`) → Public Booking Index (`/book/alexmorgan`, new tab)
- **Result**: New tab opens. Profile card shows avatar "AM", "Alex Morgan", "Product Consultant · Happy to chat anytime." Two active event types listed: 15-min Quick Chat, 30-min Discovery Call.
- **See**: Public Booking Index screen, populated.

### Step 22: Guest clicks an event type to book

- **Action**: Click "30-min Discovery Call" row
- **Screen**: Public Booking Index (`/book/alexmorgan`) → Public Booking Flow (`/book/alexmorgan/discovery-call`), month view
- **Result**: 3-column layout loads. Meta sidebar shows avatar, "Alex Morgan", "30-min Discovery Call", `[Clock]` 30m, `[Video]` Conferencing link, `[Globe]` timezone auto-detected. Calendar center column shows current month with today pre-selected. Time slots right column shows today's available slots (1:00pm, 1:30pm, 2:00pm, etc. in guest timezone).
- **See**: Public Booking Flow screen, month view.

### Step 23: Guest picks a date and time slot

- **Action**: Click a date in the calendar (e.g. Tuesday the 14th) → click `● 1:00pm` slot
- **Screen**: Public Booking Flow (`/book/alexmorgan/discovery-call`), slot selected → guest form
- **Result**: Calendar area transitions in-place to the guest form. Meta sidebar updates to show selected date/time: "Tue, Jan 14 · 1:00pm – 1:30pm". Form shows fields: "Your name", "Email address", "Additional notes (optional)".
- **See**: Public Booking Flow screen, guest form.

### Step 24: Guest fills in the booking form

- **Action**: Fill Your name "Sofia Mendez" → Email address "[sofia@acme.co](mailto:sofia@acme.co)" → Additional notes "Looking to discuss Q1 targets" → click `[Confirm booking]`
- **Screen**: Public Booking Flow (`/book/alexmorgan/discovery-call`), guest form → confirming (auto)
- **Result**: Button enters loading state. Booking row inserted to Supabase via anon key. Confirmation state loads.
- **Wireframe** (confirming — button loading):```
┌────────────────────────────────────────────┐
│  [Confirm booking]  ◐                      │
└────────────────────────────────────────────┘
```
- **Copy**: `"Confirm booking"` (action-first, §3)

### Step 25: Guest sees the confirmation

- **Action**: (auto — arrived from successful booking insert)
- **Screen**: Public Booking Flow (`/book/alexmorgan/discovery-call`), confirmation state
- **Result**: Full-page centered confirmation card. `[CheckCircle]` icon. "You're booked!" heading. Summary: "30-min Discovery Call with Alex Morgan · Tuesday, January 14 · 1:00pm – 1:30pm (America/Chicago) · Conferencing link: zoom.us/j/94821039211". Three calendar buttons: `[Google Calendar]`, `[Outlook]`, `[Download .ics]`. "← Book another meeting" ghost link.
- **See**: Public Booking Flow screen, confirmation state.
- **Copy**: `"You're booked!"` (direct, §1), `"← Book another meeting"` (action-first, §3)

### Step 26: User returns to the app and checks their bookings

- **Action**: Switch back to the app tab → click "Bookings" `[BookOpen]` in sidebar
- **Screen**: Bookings (`/bookings`), Upcoming tab
- **Result**: Bookings loads. Upcoming tab active with count "Upcoming (1)". Sofia Mendez's booking row visible: avatar "SM", "Sofia Mendez", "[sofia@acme.co](mailto:sofia@acme.co)", "30-min Discovery Call", date/time, `●Confirmed` badge, "Cancel" ghost button.
- **See**: Bookings screen, Upcoming tab populated.

* * *

## Act 3: Using the Product (populated interactions)

The user now has data. They explore and edit every distinct interaction.

### Step 27: User adds the remaining seed event types (populated baseline)

- **Action**: Click `[+ New event type]` → create "60-min Strategy Session" (slug: strategy-session, 60 min, "Deep-dive planning session", Conferencing link) → Save → repeat for "45-min Coffee Meetup" (slug: coffee-meetup, 45 min, "Casual chat — virtual or in person", In person → type "Shoreditch, London")
- **Screen**: Event Types → Event Type Detail (×2), edit mode each
- **Result**: After both saves, Event Types list shows four rows. "45-min Coffee Meetup" created with location value "Shoreditch, London".
- **See**: Event Types screen, populated (four items).

### Step 28: User toggles an event type inactive

- **Action**: On the "45-min Coffee Meetup" row, click the `●Active` toggle badge
- **Screen**: Event Types (`/event-types`), populated
- **Result**: Badge flips to `○Inactive` in-place. The row remains in the list but the booking link for that type will not show on the public booking page.
- **See**: Event Types screen, populated.

### Step 29: User opens an event type via the meatball menu

- **Action**: Click `[⋯]` meatball menu on "60-min Strategy Session" → click "Edit"
- **Screen**: Event Types (`/event-types`) → Event Type Detail (`/event-types/et3?mode=edit`), edit mode
- **Result**: Detail page loads in edit mode with all fields pre-filled. Name "60-min Strategy Session", slug "strategy-session", duration "60 minutes", description "Deep-dive planning session", Location "Conferencing link" selected.
- **See**: Event Type Detail screen, edit mode.

### Step 30: User edits the event type and discards changes

- **Action**: Change Description to "Extended planning — bring your roadmap" → click `[Discard]`
- **Screen**: Event Type Detail (`/event-types/et3`), edit mode → view mode
- **Result**: Fields revert to pre-edit values. No write to Supabase. Page transitions back to view mode. Description shows "Deep-dive planning session" unchanged.
- **See**: Event Type Detail screen, populated view mode.

### Step 31: User previews the public booking page from the meatball menu

- **Action**: Click `[⋯]` on "30-min Discovery Call" → click "Preview"
- **Screen**: Event Types (`/event-types`) → Public Booking Flow (`/book/alexmorgan/discovery-call`, new tab)
- **Result**: New tab opens on the booking flow for "30-min Discovery Call". Month view loads.
- **See**: Public Booking Flow screen, month view.

### Step 32: User switches to column view on the booking flow

- **Action**: Click `[⊟]` (column view toggle) in the top-right toggle group
- **Screen**: Public Booking Flow (`/book/alexmorgan/discovery-call`), column view
- **Result**: Layout switches to 2-column. Meta sidebar widens with mini calendar appearing below event info. Main area shows multi-day slot grid: TUE, WED, THU, FRI columns each showing available slots. Weekends skipped. Preference saved to localStorage.
- **See**: Public Booking Flow screen, column view.

### Step 33: User switches time format to 24h

- **Action**: Click `[24h]` toggle
- **Screen**: Public Booking Flow (`/book/alexmorgan/discovery-call`), column view
- **Result**: Slot times in all columns reformat to 24-hour display: "13:00", "13:30", "14:00", etc. Preference saved to localStorage.
- **See**: Public Booking Flow screen, column view.

### Step 34: User changes guest timezone

- **Action**: Click `[Globe]` timezone `select` in meta sidebar → select "Europe/London (GMT+0)"
- **Screen**: Public Booking Flow (`/book/alexmorgan/discovery-call`), column view
- **Result**: All slot times recalculate in-place to Europe/London timezone. Label updates to show "Europe/London" with "(auto-detected)" removed.
- **See**: Public Booking Flow screen, column view.

### Step 35: User picks a date with no availability

- **Action**: Switch back to month view → click a Saturday date in the calendar
- **Screen**: Public Booking Flow, month view
- **Result**: Saturday is muted/disabled — cannot be selected (host has no Saturday availability). Time slots column shows "No available slots for this day." if user manages to select an empty day.
- **See**: Public Booking Flow screen, month view.

### Step 36: User closes the demo tab and manages bookings

- **Action**: Close the public booking tab → in app, navigate to Bookings → click "Past" tab
- **Screen**: Bookings (`/bookings`), Past tab
- **Result**: Past tab shows 5 rows sorted by start_time descending: Dana Kim (15-min Quick Chat, Dec 20), Marcus Webb (60-min Strategy Session, Dec 18), Lena Hoffmann (30-min Discovery Call, Dec 15), Raj Patel (30-min Discovery Call, Dec 10), Claire Dubois (15-min Quick Chat, Dec 5). Status badges all `●Confirmed`.
- **See**: Bookings screen, Past tab.

### Step 37: User expands a booking row for details

- **Action**: Click the Priya Nair row on the Upcoming tab
- **Screen**: Bookings (`/bookings`), Upcoming tab → row expanded
- **Result**: Row expands inline below the row. Guest notes: "Interested in product strategy partnership". Location: "Conferencing link: zoom.us/j/94821039211". "Cancel this booking" destructive button visible in the expanded panel.
- **Wireframe** (expanded booking row):```
┌──────────────────────────────────────────────────┐
│  [PN]  Priya Nair           60-min Strategy      │
│        priya@stackform.io   Session              │
│        Thu 16 Jan, 11:00am  [●Confirmed]  Cancel │
├──────────────────────────────────────────────────┤
│  Notes: Interested in product strategy           │
│         partnership                              │
│  Location: Conferencing link:                    │
│            zoom.us/j/94821039211                 │
│                                                  │
│              [Cancel this booking]               │
└──────────────────────────────────────────────────┘
```

### Step 38: User cancels a booking

- **Action**: Click `[Cancel]` ghost button on the James Liu row (Upcoming tab)
- **Screen**: Bookings (`/bookings`), Upcoming tab → cancel confirm dialog
- **Result**: Alert dialog opens.
- **Wireframe** (cancel confirm dialog):```
┌───────────────────────────────────────────────────┐
│  Cancel this booking?                             │
│                                                   │
│  James Liu · 15-min Quick Chat                    │
│  Wed 15 Jan, 2:00pm                               │
│                                                   │
│  The booking will be marked as cancelled.         │
│  No notification is sent automatically.           │
│                                                   │
│           [Keep it]   [Cancel booking]            │
└───────────────────────────────────────────────────┘
```
- **Action**: Click `[Cancel booking]`
- **Result**: Dialog closes. James Liu's row moves out of Upcoming. Tab count updates to "Upcoming (3)". Toast appears.
- **Wireframe** (toast — booking cancelled):```
┌──────────────────────────────┐
│  ✓  Booking cancelled        │
└──────────────────────────────┘
```
- **Copy**: `"Cancel this booking?"` (direct, §1), `"Keep it"` (§3), `"Cancel booking"` (action-first, §3), `"Booking cancelled"` (direct confirmation, §1)

### Step 39: User checks the Cancelled tab

- **Action**: Click "Cancelled" tab
- **Screen**: Bookings (`/bookings`), Cancelled tab
- **Result**: Cancelled tab shows 2 rows: James Liu (just cancelled, cancelled_at now), Alex Torres (cancelled_at Dec 21). Tab count "Cancelled (2)". Status badges `○Cancelled` gray outline. No Cancel buttons on these rows.
- **See**: Bookings screen, Cancelled tab.

### Step 40: User customizes availability

- **Action**: Click "Availability" in sidebar
- **Screen**: Bookings → Availability (`/availability`)
- **Result**: Availability grid loads with Mon–Fri checked, Sat/Sun unchecked. All times 09:00–17:00.
- **See**: Availability screen, first-time view (pre-filled).

### Step 41: User toggles Tuesday off and extends Thursday hours

- **Action**: Uncheck `[✓]` Tuesday checkbox → Thursday end time select → change from "17:00" to "19:00"
- **Screen**: Availability (`/availability`)
- **Result**: Tuesday row collapses to "(unavailable)" muted text. Thursday end time select updates to show "19:00". The grid now shows Mon (9–5), Tue (unavailable), Wed (9–5), Thu (8–19), Fri (9–5).
- **See**: Availability screen, populated (customized).

### Step 42: User changes timezone

- **Action**: Click timezone `select` → choose "America/New_York (GMT-5)"
- **Screen**: Availability (`/availability`)
- **Result**: Timezone selector shows "America/New_York (GMT-5)". No slot recalculation on this screen — change takes effect on save.
- **See**: Availability screen, populated.

### Step 43: User saves the updated schedule

- **Action**: Click `[Save schedule]`
- **Screen**: Availability (`/availability`)
- **Result**: Updated JSONB writes to Supabase `profiles.availability`. Toast "Schedule saved".
- **See**: Availability screen, populated.

### Step 44: User edits the event type detail (full edit flow)

- **Action**: Navigate to Event Types → click "15-min Quick Chat" row body
- **Screen**: Event Types (`/event-types`) → Event Type Detail (`/event-types/et1`), view mode
- **Result**: View mode shows: Name "15-min Quick Chat", Description "Casual intro or quick question", Duration 15 minutes, Location Conferencing link, slug "quick-chat".
- **See**: Event Type Detail screen, populated view mode.

### Step 45: User enters edit mode and saves a change

- **Action**: Click `[Edit]` button → change Description to "A quick 15-minute intro — no agenda needed" → click `[Save]`
- **Screen**: Event Type Detail (`/event-types/et1`), edit mode → view mode
- **Result**: Fields lock. Description updates in-place to "A quick 15-minute intro — no agenda needed". Toast "Saved".
- **See**: Event Type Detail screen, populated view mode.

### Step 46: User copies the booking link from the detail page

- **Action**: Click `[Copy]` next to the booking link row
- **Screen**: Event Type Detail (`/event-types/et1`)
- **Result**: URL `/book/alexmorgan/quick-chat` copied to clipboard. Toast "Link copied".
- **See**: Event Type Detail screen.

### Step 47: User deletes an event type from the detail page

- **Action**: Click `[Delete this event type]` button at the bottom of the card
- **Screen**: Event Type Detail (`/event-types/et1`) → delete confirm dialog
- **Result**: Alert dialog opens.
- **Wireframe** (delete event type dialog):```
┌───────────────────────────────────────────────────┐
│  Delete "15-min Quick Chat"?                      │
│                                                   │
│  This event type and its booking link will be     │
│  permanently removed. Existing bookings won't     │
│  be affected.                                     │
│                                                   │
│           [Cancel]   [Delete]                     │
└───────────────────────────────────────────────────┘
```
- **Action**: Click `[Delete]`
- **Result**: Row deleted from Supabase. Navigate to `/event-types`. Event Types list now shows three rows (30-min Discovery Call, 60-min Strategy Session, 45-min Coffee Meetup). Toast appears.
- **Wireframe** (toast — event type deleted):```
┌──────────────────────────────┐
│  ✓  Event type deleted       │
└──────────────────────────────┘
```
- **Copy**: `"Delete"` (action-first, §3), `"Event type deleted"` (direct confirmation, §1)

### Step 48: User navigates to Settings → General tab

- **Action**: Click "Settings" `[Settings]` in sidebar → click "General" tab
- **Screen**: Settings (`/settings`), General tab
- **Result**: General tab shows Appearance section with "Dark mode" switch (off), Account section with "Log out of this account" destructive button.
- **See**: Settings screen, General tab.

### Step 49: User toggles dark mode

- **Action**: Click the Dark mode `switch` to on
- **Screen**: Settings (`/settings`), General tab
- **Result**: App switches to dark theme. Tailwind dark class applied to `<html>`. All surfaces — sidebar, cards, inputs — switch to dark palette. Toggle shows active state. Preference saved to localStorage.
- **See**: Settings screen, General tab.

### Step 50: User uploads an avatar

- **Action**: Click "Profile" tab → click `[Upload photo]` → select an image file from disk
- **Screen**: Settings (`/settings`), Profile tab
- **Result**: Avatar preview updates in-place to show the uploaded image (replacing "AM" initials). File uploads to Supabase Storage `avatars/alexmorgan/avatar.jpg`. Avatar URL saved to `profiles.avatar_url` on "Save profile". Toast "Profile saved".
- **See**: Settings screen, Profile tab.

### Step 51: User views the demo routes without auth

- **Action**: Navigate to `/demo/bookings` directly
- **Screen**: Demo Bookings (`/demo/bookings`)
- **Result**: Bookings screen loads with full seed data — 4 upcoming, 5 past, 1 cancelled. No auth required. Identical layout to the authenticated `/bookings` screen but powered by `SeedDataProvider`.
- **See**: Bookings screen, populated (seed data).

* * *

## Act 4: Session End (sign out → return)

### Step 52: User signs out from the sidebar

- **Action**: Click `[LogOut]` "Log out" in the sidebar footer
- **Screen**: Any authenticated screen → Landing page (`/`)
- **Result**: `supabase.auth.signOut()` fires. React Query cache cleared. Redirect to `/`. No authenticated state visible. Header shows "See demo", "Sign in", "Get started".
- **See**: Landing page screen.

### Step 53: User signs back in

- **Action**: Click `[Sign in]` in the header → Auth loads with Sign in tab active → fill Email "[alex@example.com](mailto:alex@example.com)", Password "••••••••••" → click `[Sign in]`
- **Screen**: Landing (`/`) → Auth (`/auth?intent=signin`) → Event Types (`/event-types`)
- **Result**: Auth card shows "Welcome back — Sign in to your scheduling dashboard". On submit, `supabase.auth.signInWithPassword` succeeds. Redirect to `/event-types`. Event Types list loads with the user's three event types persisted: 30-min Discovery Call (Active), 60-min Strategy Session (Active), 45-min Coffee Meetup (Inactive). Booking page URL strip shows `cal.yourdomain.com/book/alexmorgan`.
- **See**: Event Types screen, populated.
- **Copy**: `"Sign in"` (action-first, §3), `"Welcome back"` (direct, §1)

* * *

## Copy Decisions

| Location | Copy | Rule applied |
| --- | --- | --- |
| Landing hero primary CTA | "Get started — it's free" | action-first, §3 |
| Landing hero secondary CTA | "See demo →" | action-first, §3 |
| Auth sign-up heading | "Create your account" | direct, §1 |
| Auth sign-up subhead | "Set up your scheduling page in minutes" | direct, §1 |
| Auth sign-in heading | "Welcome back" | direct, §1 |
| Auth sign-in subhead | "Sign in to your scheduling dashboard" | direct, §1 |
| Auth sign-up submit | "Create account" | action-first, §3 |
| Auth sign-in submit | "Sign in" | action-first, §3 |
| Auth email confirmation | "Check your email" | direct, §1 |
| Event Types blankslate heading | "No event types yet" | direct, §1 |
| Event Types create CTA | "+ New event type" | action-first, §3 |
| FTUX banner | "Complete your profile to make your booking page look great" | direct, §1 |
| Toast (link copied) | "Link copied" | direct confirmation, §1 |
| Event Type Detail save | "Save" | action-first, §3 |
| Event Type Detail discard | "Discard" | action-first, §3 |
| Toast (event type saved) | "Saved" | direct confirmation, §1 |
| Delete event type confirm | "Delete" | action-first, §3 |
| Toast (event type deleted) | "Event type deleted" | direct confirmation, §1 |
| Bookings blankslate heading | "No upcoming bookings" | direct, §1 |
| Bookings blankslate body | "When someone books time with you, it'll show up here." | direct, §1 |
| Cancel booking confirm title | "Cancel this booking?" | direct, §1 |
| Cancel confirm keep button | "Keep it" | action-first, §3 |
| Cancel confirm action button | "Cancel booking" | action-first, §3 |
| Toast (booking cancelled) | "Booking cancelled" | direct confirmation, §1 |
| Availability save | "Save schedule" | action-first, §3 |
| Toast (schedule saved) | "Schedule saved" | direct confirmation, §1 |
| Settings save | "Save profile" | action-first, §3 |
| Toast (profile saved) | "Profile saved" | direct confirmation, §1 |
| Public booking confirm | "Confirm booking" | action-first, §3 |
| Public booking confirmation heading | "You're booked!" | direct, §1 |
| Public booking return link | "← Book another meeting" | action-first, §3 |
| No available slots empty state | "No available slots for this day." | direct, §1 |
| Search placeholder (booking flow timezone) | "(auto-detected)" | action descriptor, §5 |
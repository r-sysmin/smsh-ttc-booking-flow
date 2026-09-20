# Implementation Map — Calendly Alternative

Map of each screen to existing components. Read before building any screen.

---

## Screen 1: Landing page (`/`)

| Element | Strategy | Source |
|---------|----------|--------|
| Header | **Reuse + swap content** | `pages/landing/components/header.tsx` — swap nav items to "See demo" (ghost), "Sign in" (ghost → `/auth?intent=signin`), "Get started" (filled → `/auth?intent=signup`). Swap wordmark to "CalendlyAlt" |
| Hero | **Reuse + swap content** | `pages/landing/components/hero-02.tsx` — swap headline, subhead, CTAs, and mockup to public booking index mockup |
| Feature showcase | **Reuse + swap content** | `pages/landing/components/feature-showcase-01.tsx` — swap tabs to "Event Types", "Booking Page", "Bookings", "Availability" with product screenshots |
| Supporting features | **Reuse + swap content** | `pages/landing/components/features-03.tsx` — swap to 4 tiles (One link, Timezone, Calendar, Zoom) |
| Testimonials | **Reuse + swap content** | `pages/landing/components/testimonial-02.tsx` — swap to Jamie R., Sam T., Priya N. quotes |
| CTA banner | **Reuse + swap content** | `pages/landing/components/cta-01.tsx` — heading "Ready to reclaim your calendar?", single CTA |
| Footer | **Reuse + swap content** | Existing footer in landing `index.tsx` — swap to 4-column CalendlyAlt footer |
| Mockup | **Adapt pattern** | `pages/landing/components/mockups.tsx` — create a booking-index-style mockup component |

## Screen 2: Auth (`/auth`)

| Element | Strategy | Source |
|---------|----------|--------|
| Page shell | **Reuse as-is** | `layouts/application-layout.tsx` |
| Auth card | **New component** | `pages/auth/components/auth-card.tsx` — Google OAuth + tabbed email/password. No existing auth card in starter |
| Tab toggle | **Reuse as-is** | `components/ui/tabs.tsx` |
| Form fields | **Reuse as-is** | `components/ui/input.tsx`, `components/ui/button.tsx`, `components/ui/label.tsx` |

## Screen 3: Event Types (`/event-types`)

| Element | Strategy | Source |
|---------|----------|--------|
| Page shell | **Reuse as-is** | `layouts/workspace-layout-03.tsx` with sidebar nav updated |
| Sidebar | **Adapt pattern** | `layouts/workspace-layout-03.tsx` sidebar — swap nav items to Event Types, Bookings, Availability, Settings + LogOut footer |
| Event type cards | **New component** | `pages/event-types/components/event-type-card.tsx` — row card with badge, copy link, meatball menu |
| Blankslate | **New component** | `pages/event-types/components/blankslate.tsx` — skeleton bg + floating card |
| FTUX banner | **Reuse as-is** | Shadcn `alert` component |
| Booking URL strip | **New component** | `pages/event-types/components/booking-url-strip.tsx` |

## Screen 4: Event Type Detail (`/event-types/:id`)

| Element | Strategy | Source |
|---------|----------|--------|
| Page shell | **Reuse as-is** | `layouts/workspace-layout-03.tsx` |
| Breadcrumb | **Reuse as-is** | `components/ui/breadcrumb.tsx` |
| Detail card (view) | **New component** | `pages/event-types/components/detail-view.tsx` |
| Detail card (edit) | **New component** | `pages/event-types/components/detail-edit.tsx` |
| Delete confirm | **Reuse as-is** | `components/ui/alert-dialog.tsx` |
| Duration select | **Reuse as-is** | `components/ui/select.tsx` |
| Location radio | **Reuse as-is** | `components/ui/radio-group.tsx` |

## Screen 5: Bookings (`/bookings`)

| Element | Strategy | Source |
|---------|----------|--------|
| Page shell | **Reuse as-is** | `layouts/workspace-layout-03.tsx` |
| Tabs | **Reuse as-is** | `components/ui/tabs.tsx` |
| Booking rows | **New component** | `pages/bookings/components/booking-row.tsx` — avatar, guest info, event type, badge, expand |
| Cancel confirm | **Reuse as-is** | `components/ui/alert-dialog.tsx` |
| Blankslate | **New component** | `pages/bookings/components/blankslate.tsx` |

## Screen 6: Availability (`/availability`)

| Element | Strategy | Source |
|---------|----------|--------|
| Page shell | **Reuse as-is** | `layouts/workspace-layout-03.tsx` |
| Day row | **New component** | `pages/availability/components/day-row.tsx` — checkbox + time selects |
| Timezone select | **Reuse as-is** | `components/ui/select.tsx` |
| Info alert | **Reuse as-is** | Shadcn alert pattern |

## Screen 7: Settings (`/settings`)

| Element | Strategy | Source |
|---------|----------|--------|
| Page shell | **Reuse as-is** | `layouts/workspace-layout-03.tsx` |
| Tabs | **Reuse as-is** | `components/ui/tabs.tsx` |
| Profile form | **New component** | `pages/settings/components/profile-form.tsx` |
| General tab | **New component** | `pages/settings/components/general-tab.tsx` — dark mode switch + logout |
| Avatar upload | **New component** | `pages/settings/components/avatar-upload.tsx` |

## Screen 8: Public Booking Index (`/book/:username`)

| Element | Strategy | Source |
|---------|----------|--------|
| Page shell | **Reuse as-is** | `layouts/application-layout.tsx` |
| Profile card | **New component** | `pages/book/components/profile-card.tsx` — avatar, name, bio |
| Event type list | **New component** | `pages/book/components/event-type-row.tsx` — clickable rows to booking flow |

## Screen 9: Public Booking Flow (`/book/:username/:slug`)

| Element | Strategy | Source |
|---------|----------|--------|
| Page shell | **Reuse as-is** | `layouts/application-layout.tsx` |
| Booker meta sidebar | **New component** | `pages/book/components/booker-meta.tsx` — sticky, avatar, event info, timezone |
| Month view | **New component** | `pages/book/components/month-view.tsx` — 3-column grid |
| Column view | **New component** | `pages/book/components/column-view.tsx` — multi-day slot grid |
| Calendar | **Reuse as-is** | `components/ui/calendar.tsx` |
| Time slot button | **New component** | `pages/book/components/time-slot-button.tsx` — green dot + time |
| Guest form | **New component** | `pages/book/components/guest-form.tsx` |
| Confirmation | **New component** | `pages/book/components/confirmation.tsx` |
| Slot calculator | **New utility** | `src/lib/slot-calculator.ts` |
| Calendar links | **New utility** | `src/lib/calendar-links.ts` |
| ICS generator | **New utility** | `src/lib/ics.ts` |

---

## Infrastructure (pre-screen)

| File | Status |
|------|--------|
| `src/data/seed.ts` | Done — typed seed data for all entities |
| `src/lib/data-provider.tsx` | Done — SeedDataProvider + SupabaseDataProvider |
| `src/lib/auth/auth-provider.tsx` | Done — real Supabase auth |
| `src/components/protected-route.tsx` | Done — redirect to /auth when !user |
| `src/lib/filter-context.tsx` | Done — shared filter state |
| `src/App.tsx` | Done — all routes wired |
| `src/components/base/badge.tsx` | Done — color variant wrapper |
| `src/style-pack.css` | Done — sky primary color tint |
| `src/integrations/supabase/client.ts` | Done — Supabase client |
| `src/integrations/lovable/index.ts` | Done — Lovable OAuth shim |

# Update homepage mockups with the real app UI

## Working demo (confirmed)
The header's **"See demo"** button already links to `/demo/event-types`. The following routes render the actual pages with seed data (no auth): `/demo/event-types`, `/demo/event-types/:id`, `/demo/bookings`, `/demo/availability`, `/demo/settings`, `/book/demo`, `/book/demo/:slug`. No changes needed here.

## Goal
Replace the hand-drawn low-fi tiles in `src/pages/landing/components/product-mockups.tsx` with the actual page components (`EventTypesPage`, `BookingsPage`, `AvailabilityPage`, and the public booking page) so the homepage always reflects the real UI.

## Approach
Render each real page inside a CSS-transform scaled container wrapped in the seed data + memory-router context the pages already use on `/demo/*`.

### 1. New `ScaledPage` wrapper
Create `src/pages/landing/components/scaled-page.tsx`:
- Fixed logical viewport (e.g. `1280 × 800`) rendered off-screen.
- `transform: scale(...)` computed from container width via `ResizeObserver`, `transform-origin: top left`.
- Outer container uses the container's actual size; inner sets `width/height` to the logical viewport.
- `pointer-events: none`, `aria-hidden`, `overflow: hidden`, `tabIndex={-1}` on descendants disabled via `inert` attribute — mockups are display-only.

### 2. Rewrite `product-mockups.tsx`
Replace each mockup with:
```
<ScaledPage>
  <MemoryRouter initialEntries={["/demo/event-types"]}>
    <SeedDataProvider>
      <ApplicationLayout>   // whatever the /demo routes use
        <EventTypesPage />
      </ApplicationLayout>
    </SeedDataProvider>
  </MemoryRouter>
</ScaledPage>
```

Four mockups to update:
- `EventTypesMockup` → real `EventTypesPage`
- `BookingsMockup` → real `BookingsPage`
- `AvailabilityMockup` → real `AvailabilityPage`
- `BookingPageMockup` → real `PublicBookingIndexPage` for `demo` user (already has profile card + event type list matching current mockup intent)

Delete all the hand-rolled `AppShell`, `Badge`, `NAV`, `EVENT_TYPES`, `BOOKINGS`, `DAYS`, `PUBLIC_EVENTS` constants and helper markup.

### 3. Verify wiring in `src/App.tsx`
Inspect how the `/demo/*` routes wrap pages (layout, providers). Mirror that exact wrapping inside `ScaledPage` so the mockups look identical to the demo. Reuse `SeedDataProvider` from `src/lib/data-provider.tsx`.

### 4. Feature-showcase heights
`FeatureShowcase` currently sizes the mockup slot; confirm the aspect ratio still looks right with the 1280×800 scaled content. Adjust the tile's `min-height`/aspect if the shrunk page ends up too tall/short — presentation-only tweak in `feature-showcase-01.tsx` or the containing tile.

## Files touched
- `src/pages/landing/components/scaled-page.tsx` (new)
- `src/pages/landing/components/product-mockups.tsx` (rewrite — four exports preserved so `landing/index.tsx` needs no changes)
- Possibly minor sizing tweak in `src/pages/landing/components/feature-showcase-01.tsx`

## Out of scope
- Landing copy, layout, testimonials, CTA
- Demo routes themselves (already work)
- Any backend / data changes

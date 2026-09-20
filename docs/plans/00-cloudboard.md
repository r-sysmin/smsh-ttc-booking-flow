# Cloudboard — Calendly Alternative

Data layer blueprint. Read [00-breadboard.md](00-breadboard.md) for scope and [00-screenboard.md](00-screenboard.md) for screen wireframes and data contracts.

* * *

## Schema

Tables ordered by dependency — referenced tables before referencing tables.

### `profiles`

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  username text unique,
  bio text,
  avatar_url text,
  conferencing_url text,
  timezone text not null default 'UTC',
  availability jsonb not null default '{
    "mon": [{"start": "09:00", "end": "17:00"}],
    "tue": [{"start": "09:00", "end": "17:00"}],
    "wed": [{"start": "09:00", "end": "17:00"}],
    "thu": [{"start": "09:00", "end": "17:00"}],
    "fri": [{"start": "09:00", "end": "17:00"}],
    "sat": null,
    "sun": null
  }'::jsonb,
  created_at timestamptz not null default now()
);

create unique index profiles_username_idx on public.profiles(username);
create index profiles_id_idx on public.profiles(id);

grant select, insert, update, delete on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "profiles select own" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles insert own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profiles update own" on public.profiles
  for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles delete own" on public.profiles
  for delete to authenticated using (auth.uid() = id);
create policy "profiles select by username (anon)" on public.profiles
  for select to anon using (true);
```

**Purpose**: Stores the host's display info, availability schedule, timezone, and conferencing URL. The public booking pages read this via anon key to render the profile card and calculate time slots. Authenticated reads power the app screens (Availability, Settings). **Consumed by**: `useProfile`, `useUpdateProfile`, `usePublicProfile`, `useAvailability`, `useUpdateAvailability`

* * *

### `event_types`

```sql
create table public.event_types (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  duration_minutes int not null default 30,
  description text,
  location_type text not null default 'conferencing' check (location_type in ('conferencing', 'in_person')),
  location_value text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, slug)
);

create index event_types_user_created_idx on public.event_types(user_id, created_at desc);
create index event_types_user_active_idx on public.event_types(user_id, is_active);
create index event_types_slug_idx on public.event_types(slug);

grant select, insert, update, delete on public.event_types to authenticated;
grant select on public.event_types to anon;
grant all on public.event_types to service_role;

alter table public.event_types enable row level security;

create policy "event_types select own" on public.event_types
  for select to authenticated using (auth.uid() = user_id);
create policy "event_types insert own" on public.event_types
  for insert to authenticated with check (auth.uid() = user_id);
create policy "event_types update own" on public.event_types
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "event_types delete own" on public.event_types
  for delete to authenticated using (auth.uid() = user_id);
create policy "event_types select active (anon)" on public.event_types
  for select to anon using (is_active = true);
```

**Purpose**: Each row is one meeting type the host offers. Powers the Event Types list, Event Type Detail editor, and the public booking index/flow. Anon select policy restricts guests to only seeing active types. **Consumed by**: `useEventTypes`, `useEventType`, `useCreateEventType`, `useUpdateEventType`, `useDeleteEventType`, `usePublicEventTypes`, `usePublicEventType`

* * *

### `bookings`

```sql
create table public.bookings (
  id text primary key default gen_random_uuid()::text,
  event_type_id text not null references public.event_types(id) on delete cascade,
  host_user_id uuid not null references auth.users(id) on delete cascade,
  guest_name text not null,
  guest_email text not null,
  guest_notes text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

create index bookings_host_start_idx on public.bookings(host_user_id, start_time desc);
create index bookings_host_status_idx on public.bookings(host_user_id, status);
create index bookings_event_type_start_idx on public.bookings(event_type_id, start_time);
create index bookings_host_status_start_idx on public.bookings(host_user_id, status, start_time);

grant select, insert, update, delete on public.bookings to authenticated;
grant insert on public.bookings to anon;
grant select on public.bookings to anon;
grant all on public.bookings to service_role;

alter table public.bookings enable row level security;

create policy "bookings select own" on public.bookings
  for select to authenticated using (auth.uid() = host_user_id);
create policy "bookings insert own" on public.bookings
  for insert to authenticated with check (auth.uid() = host_user_id);
create policy "bookings update own" on public.bookings
  for update to authenticated
  using (auth.uid() = host_user_id) with check (auth.uid() = host_user_id);
create policy "bookings delete own" on public.bookings
  for delete to authenticated using (auth.uid() = host_user_id);
create policy "bookings insert anon" on public.bookings
  for insert to anon with check (true);
create policy "bookings select for slot calc (anon)" on public.bookings
  for select to anon using (status = 'confirmed');
```

**Purpose**: Every booking created via the public booking flow. The host reads bookings on the Bookings screen (tabbed by status + time). The anon insert policy lets unauthenticated guests create bookings. The anon select policy exposes only confirmed bookings so the slot calculator can subtract booked intervals. **Consumed by**: `useBookings`, `useCancelBooking`, `usePublicBookings`, `useCreateBooking`

* * *

## Queries

### `useEventTypes()`

**Screen**: Event Types (`/event-types`) → event type list **Type**: `read`**Returns**: `{ data: EventType[], isLoading: boolean, error: Error | null }`

```typescript
const { data } = await supabase
  .from('event_types')
  .select('id, name, slug, duration_minutes, description, location_type, location_value, is_active, created_at')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

**Filter params**: none — all event types for the user are shown; personal-scale list never needs filtering **Demo source**: `eventTypes` from `Supabase (seeded via migration)`

* * *

### `useEventType(id: string)`

**Screen**: Event Type Detail (`/event-types/:id`) → detail card **Type**: `read`**Returns**: `{ data: EventType | null, isLoading: boolean, error: Error | null }`

```typescript
const { data } = await supabase
  .from('event_types')
  .select('id, name, slug, duration_minutes, description, location_type, location_value, is_active, created_at')
  .eq('id', id)
  .eq('user_id', user.id)
  .single();
```

**Filter params**: `{ id }` — single record lookup **Demo source**: `eventTypes.find(e => e.id === id)` from `Supabase (seeded via migration)`

* * *

### `useCreateEventType()`

**Screen**: Event Types → "+ New event type" button **Type**: `optimistic-mutation`

```typescript
const { data } = await supabase
  .from('event_types')
  .insert({
    user_id: user.id,
    name: '',
    slug: '',
    duration_minutes: 30,
    description: null,
    location_type: 'conferencing',
    location_value: null,
    is_active: true
  })
  .select()
  .single();
```

**Optimistic**: Add a placeholder row to the `['event_types', user.id]` cache immediately; replace with real row on success; roll back on error. **Invalidates**: `['event_types', user.id]`**Post-mutation**: navigate to `/event-types/:newId?mode=edit`

* * *

### `useUpdateEventType()`

**Screen**: Event Type Detail → Save (edit mode); Event Types → active toggle **Type**: `optimistic-mutation`

```typescript
const { data } = await supabase
  .from('event_types')
  .update({
    name,
    slug,
    duration_minutes,
    description,
    location_type,
    location_value,
    is_active
  })
  .eq('id', id)
  .eq('user_id', user.id)
  .select()
  .single();
```

**Optimistic**: Update the record in both `['event_types', user.id]` (list) and `['event_type', id]` (detail) caches immediately; roll back both on error. **Invalidates**: `['event_types', user.id]`, `['event_type', id]`

* * *

### `useDeleteEventType()`

**Screen**: Event Types → meatball menu → Delete; Event Type Detail → "Delete this event type" **Type**: `optimistic-mutation`

```typescript
await supabase
  .from('event_types')
  .delete()
  .eq('id', id)
  .eq('user_id', user.id);
```

**Optimistic**: Remove the row from `['event_types', user.id]` cache immediately; restore on error. **Invalidates**: `['event_types', user.id]`**Post-mutation**: navigate to `/event-types` if deletion was triggered from the detail page

* * *

### `useBookings(tab: 'upcoming' | 'past' | 'cancelled')`

**Screen**: Bookings (`/bookings`) → tabbed booking list **Type**: `read`**Returns**: `{ data: BookingWithEventType[], isLoading: boolean, error: Error | null }`

```typescript
// Base query — joins event_types for name
const baseQuery = supabase
  .from('bookings')
  .select(`
    id, guest_name, guest_email, guest_notes,
    start_time, end_time, status, cancelled_at, created_at,
    event_types (id, name, duration_minutes, location_type, location_value)
  `)
  .eq('host_user_id', user.id);

// Tab-specific filters applied client-side after fetch,
// OR as separate queries:

// Upcoming: confirmed + start_time > now()
if (tab === 'upcoming') {
  query = baseQuery
    .eq('status', 'confirmed')
    .gt('start_time', new Date().toISOString())
    .order('start_time', { ascending: true });
}

// Past: confirmed + start_time <= now()
if (tab === 'past') {
  query = baseQuery
    .eq('status', 'confirmed')
    .lte('start_time', new Date().toISOString())
    .order('start_time', { ascending: false });
}

// Cancelled
if (tab === 'cancelled') {
  query = baseQuery
    .eq('status', 'cancelled')
    .order('cancelled_at', { ascending: false });
}
```

**Filter params**: `{ tab }` — drives status + time direction filters **Aggregation**: tab count badges derived from a parallel `useBookingCounts()` hook (see below) **Demo source**: `bookings` from `Supabase (seeded via migration)`, filtered by tab logic applied in-memory

* * *

### `useBookingCounts()`

**Screen**: Bookings → tab badge counts ("Upcoming (4)", "Past (5)", "Cancelled (1)") **Type**: `read`**Returns**: `{ upcoming: number, past: number, cancelled: number, isLoading: boolean }`

```typescript
// Fetch all bookings for the user with minimal columns for counting
const { data } = await supabase
  .from('bookings')
  .select('id, status, start_time')
  .eq('host_user_id', user.id);

// Client-side aggregation
const now = new Date().toISOString();
const upcoming = data.filter(b => b.status === 'confirmed' && b.start_time > now).length;
const past     = data.filter(b => b.status === 'confirmed' && b.start_time <= now).length;
const cancelled = data.filter(b => b.status === 'cancelled').length;
```

**Aggregation**: client-side count by (status + start_time vs now) **Demo source**: derived from `bookings` seed array

* * *

### `useCancelBooking()`

**Screen**: Bookings → "Cancel" button / expanded row cancel action **Type**: `optimistic-mutation`

```typescript
await supabase
  .from('bookings')
  .update({
    status: 'cancelled',
    cancelled_at: new Date().toISOString()
  })
  .eq('id', id)
  .eq('host_user_id', user.id);
```

**Optimistic**: Update the row in `['bookings', user.id, 'upcoming']` cache to `status: 'cancelled'`; roll back on error. **Invalidates**: `['bookings', user.id, 'upcoming']`, `['bookings', user.id, 'cancelled']`, `['booking_counts', user.id]`

* * *

### `useProfile()`

**Screen**: Settings (`/settings`) → Profile tab; also used by Event Types → FTUX banner check **Type**: `read`**Returns**: `{ data: Profile | null, isLoading: boolean, error: Error | null }`

```typescript
const { data } = await supabase
  .from('profiles')
  .select('id, full_name, username, bio, avatar_url, conferencing_url, timezone, availability')
  .eq('id', user.id)
  .single();
```

**Filter params**: none — always reads the authenticated user's own profile **Demo source**: `profile` from `Supabase (seeded via migration)`

* * *

### `useUpdateProfile()`

**Screen**: Settings → Profile tab → "Save profile" **Type**: `optimistic-mutation`

```typescript
// If avatar file provided, upload first:
const { data: storageData } = await supabase.storage
  .from('avatars')
  .upload(`${user.id}/avatar.${ext}`, file, { upsert: true });

const avatarUrl = storageData
  ? supabase.storage.from('avatars').getPublicUrl(storageData.path).data.publicUrl
  : undefined;

// Then update profile:
await supabase
  .from('profiles')
  .update({
    full_name,
    username,
    bio,
    conferencing_url,
    ...(avatarUrl !== undefined && { avatar_url: avatarUrl })
  })
  .eq('id', user.id);
```

**Optimistic**: Update `['profile', user.id]` cache immediately; roll back on error. **Invalidates**: `['profile', user.id]`

* * *

### `useAvailability()`

**Screen**: Availability (`/availability`) → timezone selector + weekly schedule grid **Type**: `read`**Returns**: `{ data: { timezone: string, availability: AvailabilityJson } | null, isLoading: boolean }`

```typescript
const { data } = await supabase
  .from('profiles')
  .select('timezone, availability')
  .eq('id', user.id)
  .single();
```

**Filter params**: none **Demo source**: `{ timezone: profile.timezone, availability: profile.availability }` from `Supabase (seeded via migration)`

* * *

### `useUpdateAvailability()`

**Screen**: Availability → "Save schedule" button **Type**: `optimistic-mutation`

```typescript
await supabase
  .from('profiles')
  .update({ timezone, availability })
  .eq('id', user.id);
```

**Optimistic**: Update `['availability', user.id]` cache immediately; roll back on error. **Invalidates**: `['availability', user.id]`, `['profile', user.id]`

* * *

### `usePublicProfile(username: string)`

**Screen**: Public Booking Index (`/book/:username`) → profile card; Public Booking Flow (`/book/:username/:slug`) → meta sidebar **Type**: `read`**Returns**: `{ data: PublicProfile | null, isLoading: boolean, error: Error | null }`

```typescript
const { data } = await supabase
  .from('profiles')
  .select('id, full_name, username, bio, avatar_url, conferencing_url, timezone, availability')
  .eq('username', username)
  .single();
```

**Filter params**: `{ username }` — single record lookup by username **Demo source**: `profile` from `Supabase (seeded via migration)` (matched when `username === 'demo'`)

* * *

### `usePublicEventTypes(username: string)`

**Screen**: Public Booking Index → event type list **Type**: `read`**Returns**: `{ data: EventType[], isLoading: boolean, error: Error | null }`

```typescript
// First resolve username → user_id via profiles
const { data: profileData } = await supabase
  .from('profiles')
  .select('id')
  .eq('username', username)
  .single();

const { data } = await supabase
  .from('event_types')
  .select('id, name, slug, duration_minutes, description, location_type')
  .eq('user_id', profileData.id)
  .eq('is_active', true)
  .order('created_at', { ascending: true });
```

**Filter params**: `{ username }` — resolves to user_id, then filters `is_active = true`**Demo source**: `eventTypes.filter(e => e.is_active)` from `Supabase (seeded via migration)`

* * *

### `usePublicEventType(username: string, slug: string)`

**Screen**: Public Booking Flow (`/book/:username/:slug`) → meta sidebar event info **Type**: `read`**Returns**: `{ data: EventType | null, isLoading: boolean, error: Error | null }`

```typescript
const { data: profileData } = await supabase
  .from('profiles')
  .select('id')
  .eq('username', username)
  .single();

const { data } = await supabase
  .from('event_types')
  .select('id, name, slug, duration_minutes, description, location_type, location_value')
  .eq('user_id', profileData.id)
  .eq('slug', slug)
  .eq('is_active', true)
  .single();
```

**Filter params**: `{ username, slug }` — resolves user then matches slug **Demo source**: `eventTypes.find(e => e.slug === slug && e.is_active)` from `Supabase (seeded via migration)`

* * *

### `usePublicBookings(eventTypeId: string)`

**Screen**: Public Booking Flow → slot calculator (subtracts confirmed bookings from availability windows) **Type**: `read`**Returns**: `{ data: { start_time: string, end_time: string }[], isLoading: boolean }`

```typescript
// Fetch confirmed bookings for the next 60 days for slot subtraction
const { data } = await supabase
  .from('bookings')
  .select('start_time, end_time')
  .eq('event_type_id', eventTypeId)
  .eq('status', 'confirmed')
  .gte('start_time', new Date().toISOString())
  .lte('start_time', new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString())
  .order('start_time', { ascending: true });
```

**Filter params**: `{ eventTypeId }` — confirmed bookings in the next 60 days **Demo source**: `bookings.filter(b => b.event_type_id === eventTypeId && b.status === 'confirmed')` from `Supabase (seeded via migration)`

* * *

### `useCreateBooking()`

**Screen**: Public Booking Flow → "Confirm booking" button **Type**: `mutation` (no optimistic — confirmation state is the result; anon user)

```typescript
const { data } = await supabase
  .from('bookings')
  .insert({
    event_type_id,
    host_user_id,
    guest_name,
    guest_email,
    guest_notes: guest_notes ?? null,
    start_time,
    end_time,
    status: 'confirmed'
  })
  .select()
  .single();
```

**Invalidates**: `['public_bookings', eventTypeId]` — refetches slot availability so the just-booked slot disappears if the guest navigates back

* * *

## Data Provider

```
/demo/*           →  SeedDataProvider  (reads from Supabase (seeded via migration) — public demo; writes show "Sign in to save" toast)
/book/demo        →  SeedDataProvider  (public booking index for the demo user)
/book/demo/:slug  →  SeedDataProvider  (public booking flow for the demo user; confirm booking shows toast "Sign in to save real bookings")
/*                →  SupabaseDataProvider  (reads from Supabase via hooks, writes are real mutations)
/book/:username   →  SupabaseDataProvider  (anon reads — no auth required)
/book/:username/:slug →  SupabaseDataProvider  (anon reads + anon insert for new bookings)
```

**Switch point**: The root router in `App.tsx` wraps `/demo/*` routes in `SeedDataProvider` and all other routes in `SupabaseDataProvider`. Public booking routes (`/book/:username`) always use `SupabaseDataProvider` with the anon key — they are never demo routes except when `:username === 'demo'`.

**Provider interface**:

```typescript
interface CalendlyDataProvider {
  // Event Types
  useEventTypes(): { data: EventType[]; isLoading: boolean };
  useEventType(id: string): { data: EventType | null; isLoading: boolean };
  useCreateEventType(): { mutate: () => Promise<{ id: string }>; isLoading: boolean };
  useUpdateEventType(): { mutate: (id: string, fields: Partial<EventType>) => void; isLoading: boolean };
  useDeleteEventType(): { mutate: (id: string) => void; isLoading: boolean };

  // Bookings
  useBookings(tab: 'upcoming' | 'past' | 'cancelled'): { data: BookingWithEventType[]; isLoading: boolean };
  useBookingCounts(): { upcoming: number; past: number; cancelled: number; isLoading: boolean };
  useCancelBooking(): { mutate: (id: string) => void; isLoading: boolean };

  // Profile / Settings
  useProfile(): { data: Profile | null; isLoading: boolean };
  useUpdateProfile(): { mutate: (fields: Partial<Profile>, avatarFile?: File) => void; isLoading: boolean };

  // Availability
  useAvailability(): { data: { timezone: string; availability: AvailabilityJson } | null; isLoading: boolean };
  useUpdateAvailability(): { mutate: (timezone: string, availability: AvailabilityJson) => void; isLoading: boolean };

  // Public (anon) — these are the same interface for both providers; SeedDataProvider reads seed arrays
  usePublicProfile(username: string): { data: PublicProfile | null; isLoading: boolean };
  usePublicEventTypes(username: string): { data: EventType[]; isLoading: boolean };
  usePublicEventType(username: string, slug: string): { data: EventType | null; isLoading: boolean };
  usePublicBookings(eventTypeId: string): { data: { start_time: string; end_time: string }[]; isLoading: boolean };
  useCreateBooking(): { mutate: (input: CreateBookingInput) => Promise<Booking>; isLoading: boolean };
}
```

**Both providers filter identically.** The demo IS the product — if the booking flow doesn't calculate real slots in demo mode, the template looks broken.

```typescript
// ❌ Wrong — ignores tab, all bookings always returned
useBookings: (_tab) => ok(seed.bookings),

// ✅ Correct — applies same tab logic as Supabase query
useBookings: (tab) => {
  const now = new Date().toISOString();
  if (tab === 'upcoming') return ok(seed.bookings.filter(b => b.status === 'confirmed' && b.start_time > now));
  if (tab === 'past')     return ok(seed.bookings.filter(b => b.status === 'confirmed' && b.start_time <= now));
  if (tab === 'cancelled') return ok(seed.bookings.filter(b => b.status === 'cancelled'));
},

// ❌ Wrong — slot calculator receives all bookings, double-books
usePublicBookings: (_eventTypeId) => ok(seed.bookings),

// ✅ Correct — filters to confirmed + matching event type
usePublicBookings: (eventTypeId) => ok(
  seed.bookings.filter(b => b.event_type_id === eventTypeId && b.status === 'confirmed')
),
```

**Seed filter manifest (REQUIRED):**

| Hook | Seed array | Filter field | Sort / group |
| --- | --- | --- | --- |
| `useEventTypes` | `seed.eventTypes` | none (all records shown) | `created_at` desc |
| `useEventType` | `seed.eventTypes` | `id` = param (single lookup) | n/a |
| `useBookings` | `seed.bookings` | `status` + `start_time` vs now() by tab: upcoming = confirmed + future; past = confirmed + past; cancelled = cancelled | upcoming: `start_time` asc; past: `start_time` desc; cancelled: `cancelled_at` desc |
| `useBookingCounts` | `seed.bookings` | `status` + `start_time` vs now() (client-side count) | n/a (aggregation only) |
| `useProfile` | `seed.profile` | none (single object) | n/a |
| `useAvailability` | `seed.profile` | none (reads `timezone` + `availability` fields from single object) | n/a |
| `usePublicProfile` | `seed.profile` | `username` = param; returns seed profile when username === 'demo' | n/a |
| `usePublicEventTypes` | `seed.eventTypes` | `is_active` = true | `created_at` asc |
| `usePublicEventType` | `seed.eventTypes` | `slug` = param AND `is_active` = true (single lookup) | n/a |
| `usePublicBookings` | `seed.bookings` | `event_type_id` = param AND `status` = 'confirmed' AND `start_time` ≥ now() | `start_time` asc |

* * *

## Auth

### Providers

| Provider | Method | Lovable Cloud setup |
| --- | --- | --- |
| Google | `lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin })` | `supabase--configure_social_auth` with `providers: ["google"]` — generates `@lovable.dev/cloud-auth-js` client |
| Apple | `lovable.auth.signInWithOAuth('apple', { redirect_uri: window.location.origin })` | same call with `providers: ["google", "apple"]` |
| Email | `supabase.auth.signUp({ email, password, options: { data: { full_name } } })` / `supabase.auth.signInWithPassword({ email, password })` | email confirmation required — do NOT auto-confirm |

**Important**: OAuth MUST use `lovable.auth.signInWithOAuth()` from `@/integrations/lovable/index`, NOT `supabase.auth.signInWithOAuth()`. The Lovable managed OAuth broker handles Google/Apple credentials automatically. Direct Supabase OAuth calls bypass the broker and fail with "missing OAuth secret". Email/password auth stays on `supabase.auth` directly.

* * *

### Screens

#### Sign In / Sign Up (`/auth`)

- Single card, centered. `?intent=signup` pre-selects Sign Up tab; `?intent=signin` pre-selects Sign In tab. Tabs toggle in-place — no route change.
- Google OAuth button (full-width, outlined, highest prominence) — calls `lovable.auth.signInWithOAuth('google', ...)`. On success: redirect to `/event-types`.
- "Or" separator.
- **Sign In tab**: Email `input` + Password `input type=password` + "Forgot password?" right-aligned link. Primary button "Sign in" — calls `supabase.auth.signInWithPassword`. On success: redirect to `/event-types`.
- **Sign Up tab**: Full name `input` + Email `input` + Password `input type=password`. Primary button "Create account" — calls `supabase.auth.signUp`. On success: in-place swap to "Check your email" state — no redirect.
- "Forgot password?" triggers in-place swap: single email `input` + "Send reset link" button — calls `supabase.auth.resetPasswordForEmail`. Shows "Check your email for a reset link." on success.
- Error states: "Invalid email or password", "Email not yet confirmed — check your inbox", "Email already registered", network error toast via `sonner`.
- "← Back to home" plain text link below card → `/`.
- "View demo" text link below card → `/book/demo`.

* * *

### Route protection

| Route | Access | Notes |
| --- | --- | --- |
| `/` | public | landing page |
| `/auth` | public | redirects to `/event-types` if already authenticated |
| `/demo/event-types` | public | seed data, no auth |
| `/demo/event-types/:id` | public | seed data, no auth |
| `/demo/bookings` | public | seed data, no auth |
| `/demo/availability` | public | seed data, no auth |
| `/demo/settings` | public | seed data, no auth |
| `/book/:username` | public | anon Supabase reads |
| `/book/:username/:slug` | public | anon Supabase reads + anon insert |
| `/event-types` | **protected** | redirects to `/auth?intent=signin` with `from` state |
| `/event-types/:id` | **protected** | redirects to `/auth?intent=signin` with `from` state |
| `/bookings` | **protected** | redirects to `/auth?intent=signin` with `from` state |
| `/availability` | **protected** | redirects to `/auth?intent=signin` with `from` state |
| `/settings` | **protected** | redirects to `/auth?intent=signin` with `from` state |

* * *

### Sign out

- Sidebar footer "Log out" button → `supabase.auth.signOut()` → clear React Query cache → navigate to `/`.
- Settings → General tab "Log out of this account" button → same flow.

* * *

### Auth provider component

```typescript
// AuthProvider wraps the entire app, exposes { user, session, loading, signOut }
// Registers supabase.auth.onAuthStateChange BEFORE calling supabase.auth.getSession()
// to avoid missing the initial SIGNED_IN event on page load.
// On SIGNED_IN: set user + session in state.
// On SIGNED_OUT: clear user + session, clear React Query cache.
// ProtectedRoute component reads { user, loading } from AuthProvider:
//   - loading === true → render null (or skeleton)
//   - user === null → <Navigate to="/auth?intent=signin" state={{ from: location }} />
//   - user !== null → <Outlet />
```

* * *

## Seed Strategy

### Demo seed data (`Supabase (seeded via migration)`)

The cloudboard owns the seed shape. Exported as typed arrays — the `SeedDataProvider` reads these and applies the same filter logic as the Supabase queries.

```typescript
// Supabase (seeded via migration)

export const profile = {
  id: 'u1',
  full_name: 'Alex Morgan',
  username: 'demo',
  bio: 'Product Consultant · Happy to chat anytime.',
  avatar_url: null,
  conferencing_url: 'https://zoom.us/j/94821039211',
  timezone: 'America/New_York',
  availability: {
    mon: [{ start: '09:00', end: '17:00' }],
    tue: [{ start: '09:00', end: '17:00' }],
    wed: [{ start: '09:00', end: '17:00' }],
    thu: [{ start: '09:00', end: '17:00' }],
    fri: [{ start: '09:00', end: '17:00' }],
    sat: null,
    sun: null
  }
};

export const eventTypes = [
  {
    id: 'et1',
    user_id: 'u1',
    name: '15-min Quick Chat',
    slug: 'quick-chat',
    duration_minutes: 15,
    description: 'Casual intro or quick question',
    location_type: 'conferencing',
    location_value: null,
    is_active: true,
    created_at: '2024-11-01T10:00:00Z'
  },
  {
    id: 'et2',
    user_id: 'u1',
    name: '30-min Discovery Call',
    slug: 'discovery-call',
    duration_minutes: 30,
    description: 'Walk through your goals and challenges',
    location_type: 'conferencing',
    location_value: null,
    is_active: true,
    created_at: '2024-11-02T10:00:00Z'
  },
  {
    id: 'et3',
    user_id: 'u1',
    name: '60-min Strategy Session',
    slug: 'strategy-session',
    duration_minutes: 60,
    description: 'Deep-dive planning session',
    location_type: 'conferencing',
    location_value: null,
    is_active: true,
    created_at: '2024-11-03T10:00:00Z'
  },
  {
    id: 'et4',
    user_id: 'u1',
    name: '45-min Coffee Meetup',
    slug: 'coffee-meetup',
    duration_minutes: 45,
    description: 'Casual chat — virtual or in person',
    location_type: 'in_person',
    location_value: 'Shoreditch, London',
    is_active: false,
    created_at: '2024-11-04T10:00:00Z'
  }
];

export const bookings = [
  {
    id: 'b1',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Sofia Mendez',
    guest_email: 'sofia@acme.co',
    guest_notes: 'Looking to discuss Q1 targets',
    start_time: '2025-01-14T15:00:00Z', // 10:00am EST
    end_time: '2025-01-14T15:30:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2025-01-10T09:00:00Z'
  },
  {
    id: 'b2',
    event_type_id: 'et1',
    host_user_id: 'u1',
    guest_name: 'James Liu',
    guest_email: 'james@loop.io',
    guest_notes: '',
    start_time: '2025-01-15T19:00:00Z', // 2:00pm EST
    end_time: '2025-01-15T19:15:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2025-01-10T10:00:00Z'
  },
  {
    id: 'b3',
    event_type_id: 'et3',
    host_user_id: 'u1',
    guest_name: 'Priya Nair',
    guest_email: 'priya@stackform.io',
    guest_notes: 'Interested in product strategy partnership',
    start_time: '2025-01-16T16:00:00Z', // 11:00am EST
    end_time: '2025-01-16T17:00:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2025-01-10T11:00:00Z'
  },
  {
    id: 'b4',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Tom Reynolds',
    guest_email: 'tom@freelance.co',
    guest_notes: '',
    start_time: '2025-01-17T20:00:00Z', // 3:00pm EST
    end_time: '2025-01-17T20:30:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2025-01-11T08:00:00Z'
  },
  {
    id: 'b5',
    event_type_id: 'et1',
    host_user_id: 'u1',
    guest_name: 'Dana Kim',
    guest_email: 'dana@venture.io',
    guest_notes: '',
    start_time: '2024-12-20T14:00:00Z', // 9:00am EST
    end_time: '2024-12-20T14:15:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-18T09:00:00Z'
  },
  {
    id: 'b6',
    event_type_id: 'et3',
    host_user_id: 'u1',
    guest_name: 'Marcus Webb',
    guest_email: 'marcus@design.co',
    guest_notes: 'Portfolio review',
    start_time: '2024-12-18T19:00:00Z', // 2:00pm EST
    end_time: '2024-12-18T20:00:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-15T10:00:00Z'
  },
  {
    id: 'b7',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Lena Hoffmann',
    guest_email: 'lena@berlin.de',
    guest_notes: '',
    start_time: '2024-12-15T15:00:00Z', // 10:00am EST
    end_time: '2024-12-15T15:30:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-12T11:00:00Z'
  },
  {
    id: 'b8',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Raj Patel',
    guest_email: 'raj@consult.in',
    guest_notes: 'Partnership opportunity',
    start_time: '2024-12-10T16:00:00Z', // 11:00am EST
    end_time: '2024-12-10T16:30:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-08T09:00:00Z'
  },
  {
    id: 'b9',
    event_type_id: 'et1',
    host_user_id: 'u1',
    guest_name: 'Claire Dubois',
    guest_email: 'claire@paris.fr',
    guest_notes: '',
    start_time: '2024-12-05T21:00:00Z', // 4:00pm EST
    end_time: '2024-12-05T21:15:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-03T14:00:00Z'
  },
  {
    id: 'b10',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Alex Torres',
    guest_email: 'alex@startupco.io',
    guest_notes: 'Reschedule attempt',
    start_time: '2024-12-22T15:00:00Z', // 10:00am EST
    end_time: '2024-12-22T15:30:00Z',
    status: 'cancelled',
    cancelled_at: '2024-12-21T13:00:00Z',
    created_at: '2024-12-19T10:00:00Z'
  }
];

// Static marketing content — consumed by landing page components only
export const featureTabs = [
  { id: 'event-types', label: 'Event Types', screenshotAlt: 'Event types card list' },
  { id: 'booking-page', label: 'Booking Page', screenshotAlt: 'Public booking index' },
  { id: 'bookings', label: 'Bookings', screenshotAlt: 'Tabbed booking table' },
  { id: 'availability', label: 'Availability', screenshotAlt: 'Weekly availability grid' }
];

export const supportingFeatures = [
  { icon: 'Link', headline: 'One link for all meeting types', body: 'Share a single URL. Guests pick the meeting type that fits.' },
  { icon: 'Globe', headline: 'Timezone-aware slots', body: 'Guest timezone auto-detected. Times shown in their local time.' },
  { icon: 'Calendar', headline: 'Add to any calendar', body: 'Google Calendar, Outlook, or .ics download — no email needed.' },
  { icon: 'Video', headline: 'Paste your Zoom link once', body: 'Store your conferencing URL in settings. It appears on every booking.' }
];

export const testimonials = [
  { quote: 'My clients book their own slots without a single email.', name: 'Jamie R.', role: 'Freelance Designer' },
  { quote: 'Set it up in 10 minutes. Now I just share the link.', name: 'Sam T.', role: 'Team Lead, Stackform' },
  { quote: "Finally a tool that doesn't need a PhD to configure.", name: 'Priya N.', role: 'Independent Consultant' }
];
```

**Seed tab counts** (derived — not stored): `upcoming` = b1, b2, b3, b4 (4 entries — `start_time` in Jan 2025, all confirmed); `past` = b5, b6, b7, b8, b9 (5 entries — `start_time` in Dec 2024, all confirmed); `cancelled` = b10 (1 entry).

* * *

### First-run experience (real users)

Real users start with an **empty workspace** plus pre-filled availability. The `handle_new_user()` trigger creates only the profile row with availability defaults seeded from the browser timezone (passed as metadata on sign-up).

**First-run flow**:

1. User signs up → `handle_new_user()` trigger fires → `profiles` row created with `full_name` from auth metadata, `username` auto-generated (kebab-case from full_name + random suffix if collision), `availability` defaulted to Mon–Fri 9–5, `timezone` defaulted to `'UTC'` (the client updates this on first Settings save or the booking flow can use the host's saved timezone).
2. Redirect to `/event-types` → blankslate empty state with "+ New event type" CTA.
3. FTUX banner visible: "Complete your profile to make your booking page look great → Go to Settings" — shown whenever `full_name === ''` or `conferencing_url === null`.
4. User clicks "+ New event type" → blank record created → navigates to `/event-types/:newId?mode=edit`.
5. User fills name, slug, duration → "Save" → back to Event Types with first card visible.
6. User clicks "Copy link" → toast "Link copied".
7. After saving Settings (display name + conferencing URL) → FTUX banner disappears.

* * *

### `handle_new_user()` trigger

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $
declare
  _full_name text;
  _username  text;
  _base      text;
  _counter   int := 0;
begin
  _full_name := coalesce(new.raw_user_meta_data->>'full_name', '');

  -- Generate a URL-safe username from full_name
  _base := lower(regexp_replace(trim(_full_name), '[^a-z0-9]+', '', 'g'));
  if _base = '' then
    _base := 'user';
  end if;
  _username := _base;

  -- Ensure uniqueness with a numeric suffix
  while exists (select 1 from public.profiles where username = _username) loop
    _counter := _counter + 1;
    _username := _base || _counter::text;
  end loop;

  insert into public.profiles (
    id,
    full_name,
    username,
    bio,
    avatar_url,
    conferencing_url,
    timezone,
    availability
  ) values (
    new.id,
    _full_name,
    _username,
    null,
    null,
    null,
    'UTC',
    '{
      "mon": [{"start": "09:00", "end": "17:00"}],
      "tue": [{"start": "09:00", "end": "17:00"}],
      "wed": [{"start": "09:00", "end": "17:00"}],
      "thu": [{"start": "09:00", "end": "17:00"}],
      "fri": [{"start": "09:00", "end": "17:00"}],
      "sat": null,
      "sun": null
    }'::jsonb
  );

  return new;
end;
$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;
```

* * *

## Integrations

### Supabase Storage — `self-contained`

**Required for**: Profile avatar upload in Settings → Profile tab **Type**: `self-contained` — Lovable Cloud manages the Supabase Storage bucket **Bucket**: `avatars` — public bucket, path pattern: `{user_id}/avatar.{ext}`

**When set up**: `useUpdateProfile()` uploads the file to `avatars/{user_id}/avatar.{ext}` with `upsert: true`, then saves the resulting public URL to `profiles.avatar_url`. The `avatar` component on the public booking index and booking flow meta sidebar renders the image if `avatar_url` is set, falls back to initials otherwise.

**When NOT set up** (graceful degradation):

- The avatar `[Upload photo]` button still renders — the file input fires, the upload call fails silently, and a `sonner` toast shows "Couldn't upload photo — please try again."
- The rest of the Settings save proceeds normally (name, username, bio, conferencing URL are unaffected).
- All screens fall back to the initials `avatar` component — no broken images.

**Bucket policy** (add to migration):

```sql
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars upload own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars update own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'avatars');
```

* * *

### "Add to calendar" — `self-contained`

**Required for**: Public Booking Flow → Confirmation → "Add to your calendar" buttons **Type**: `self-contained` — no external API, no OAuth, no email

**Google Calendar**: Construct a URL from booking data and open in a new tab:

```typescript
// src/lib/calendar-links.ts
export function googleCalendarUrl(booking: {
  title: string;
  start: Date;
  end: Date;
  details: string;
  location: string;
}): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace('.000', '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: booking.title,
    dates: `${fmt(booking.start)}/${fmt(booking.end)}`,
    details: booking.details,
    location: booking.location
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
```

**Outlook**: Same pattern using `https://outlook.live.com/calendar/0/deeplink/compose`:

```typescript
export function outlookCalendarUrl(booking: { title: string; start: Date; end: Date; body: string; location: string }): string {
  const params = new URLSearchParams({
    subject: booking.title,
    startdt: booking.start.toISOString(),
    enddt: booking.end.toISOString(),
    body: booking.body,
    location: booking.location,
    path: '/calendar/action/compose',
    rru: 'addevent'
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}
```

**Download .ics**: Client-side Blob generation in `src/lib/ics.ts`:

```typescript
export function generateIcs(booking: {
  uid: string;
  title: string;
  start: Date;
  end: Date;
  description: string;
  location: string;
  organizerEmail: string;
  attendeeEmail: string;
}): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace('.000', '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CalendlyAlt//EN',
    'BEGIN:VEVENT',
    `UID:${booking.uid}`,
    `DTSTART:${fmt(booking.start)}`,
    `DTEND:${fmt(booking.end)}`,
    `SUMMARY:${booking.title}`,
    `DESCRIPTION:${booking.description}`,
    `LOCATION:${booking.location}`,
    `ORGANIZER:mailto:${booking.organizerEmail}`,
    `ATTENDEE:mailto:${booking.attendeeEmail}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export function downloadIcs(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

**When NOT connected**: These are pure client-side utilities with no external dependency. They always work. No degradation state needed.

* * *

### Slot calculator — `self-contained`

**Required for**: Public Booking Flow → calendar day availability + time slot list **Type**: `self-contained` — pure client-side computation in `src/lib/slot-calculator.ts`

**What it does**: Takes the host's `availability` JSONB + `timezone`, the event type's `duration_minutes`, and the confirmed bookings array from `usePublicBookings`, and returns an array of available `{ start: Date, end: Date }` slot pairs for any given date in the guest's timezone.

```typescript
// src/lib/slot-calculator.ts
// Algorithm:
// 1. For a given target date (in guest timezone), find the day-of-week key (mon/tue/...)
// 2. Look up the host's availability window for that day (or null if unavailable)
// 3. Convert window start/end (HH:mm in host timezone) to UTC Date objects for that calendar date
// 4. Generate slots of `duration_minutes` length from window start to window end
// 5. Filter out slots that overlap with any confirmed booking interval
// 6. Return remaining slots converted to guest timezone for display
```

**When NOT connected**: Always works — no external service. If `availability` is empty or the day is off, returns `[]` and the UI shows "No available slots for this day."
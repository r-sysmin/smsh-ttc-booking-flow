export interface TimeWindow {
  start: string;
  end: string;
}

export interface AvailabilityJson {
  mon: TimeWindow[] | null;
  tue: TimeWindow[] | null;
  wed: TimeWindow[] | null;
  thu: TimeWindow[] | null;
  fri: TimeWindow[] | null;
  sat: TimeWindow[] | null;
  sun: TimeWindow[] | null;
}

export interface Profile {
  id: string;
  full_name: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  conferencing_url: string | null;
  timezone: string;
  availability: AvailabilityJson;
  created_at?: string;
}

export type PublicProfile = Pick<
  Profile,
  'id' | 'full_name' | 'username' | 'bio' | 'avatar_url' | 'conferencing_url' | 'timezone' | 'availability'
>;

export interface EventType {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  duration_minutes: number;
  description: string | null;
  location_type: 'conferencing' | 'in_person';
  location_value: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  event_type_id: string;
  host_user_id: string;
  guest_name: string;
  guest_email: string;
  guest_avatar_url?: string | null;
  guest_notes: string | null;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled';
  cancelled_at: string | null;
  created_at: string;
  google_event_id?: string | null;
  meet_link?: string | null;
}

export interface BookingWithEventType extends Booking {
  event_types: Pick<EventType, 'id' | 'name' | 'duration_minutes' | 'location_type' | 'location_value'> | null;
}

export interface CreateBookingInput {
  event_type_id: string;
  host_user_id: string;
  guest_name: string;
  guest_email: string;
  guest_notes?: string | null;
  start_time: string;
  end_time: string;
}

export interface FeatureTab {
  id: string;
  label: string;
  screenshotAlt: string;
}

export interface SupportingFeature {
  icon: string;
  headline: string;
  body: string;
}

export interface TestimonialEntry {
  quote: string;
  name: string;
  role: string;
}

// ── Seed data ──

export const profile: Profile = {
  id: 'u1',
  full_name: 'Alex Morgan',
  username: 'demo',
  bio: 'Product Consultant · Happy to chat anytime.',
  avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&h=256&fit=crop&crop=faces',
  conferencing_url: 'https://zoom.us/j/94821039211',
  timezone: 'America/New_York',
  availability: {
    mon: [{ start: '09:00', end: '17:00' }],
    tue: [{ start: '09:00', end: '17:00' }],
    wed: [{ start: '09:00', end: '17:00' }],
    thu: [{ start: '09:00', end: '17:00' }],
    fri: [{ start: '09:00', end: '17:00' }],
    sat: null,
    sun: null,
  },
};

export const eventTypes: EventType[] = [
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
    created_at: '2024-11-01T10:00:00Z',
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
    created_at: '2024-11-02T10:00:00Z',
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
    created_at: '2024-11-03T10:00:00Z',
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
    created_at: '2024-11-04T10:00:00Z',
  },
];

export const bookings: BookingWithEventType[] = [
  {
    id: 'b1',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Sofia Mendez',
    guest_email: 'sofia@acme.co',
    guest_avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&crop=faces',
    guest_notes: 'Looking to discuss Q1 targets',
    start_time: '2025-01-14T15:00:00Z',
    end_time: '2025-01-14T15:30:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2025-01-10T09:00:00Z',
    event_types: { id: 'et2', name: '30-min Discovery Call', duration_minutes: 30, location_type: 'conferencing', location_value: null },
  },
  {
    id: 'b2',
    event_type_id: 'et1',
    host_user_id: 'u1',
    guest_name: 'James Liu',
    guest_email: 'james@loop.io',
    guest_avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=faces',
    guest_notes: '',
    start_time: '2025-01-15T19:00:00Z',
    end_time: '2025-01-15T19:15:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2025-01-10T10:00:00Z',
    event_types: { id: 'et1', name: '15-min Quick Chat', duration_minutes: 15, location_type: 'conferencing', location_value: null },
  },
  {
    id: 'b3',
    event_type_id: 'et3',
    host_user_id: 'u1',
    guest_name: 'Priya Nair',
    guest_email: 'priya@stackform.io',
    guest_avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop&crop=faces',
    guest_notes: 'Interested in product strategy partnership',
    start_time: '2025-01-16T16:00:00Z',
    end_time: '2025-01-16T17:00:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2025-01-10T11:00:00Z',
    event_types: { id: 'et3', name: '60-min Strategy Session', duration_minutes: 60, location_type: 'conferencing', location_value: null },
  },
  {
    id: 'b4',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Tom Reynolds',
    guest_email: 'tom@freelance.co',
    guest_avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&h=128&fit=crop&crop=faces',
    guest_notes: '',
    start_time: '2025-01-17T20:00:00Z',
    end_time: '2025-01-17T20:30:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2025-01-11T08:00:00Z',
    event_types: { id: 'et2', name: '30-min Discovery Call', duration_minutes: 30, location_type: 'conferencing', location_value: null },
  },
  {
    id: 'b5',
    event_type_id: 'et1',
    host_user_id: 'u1',
    guest_name: 'Dana Kim',
    guest_email: 'dana@venture.io',
    guest_avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=faces',
    guest_notes: '',
    start_time: '2024-12-20T14:00:00Z',
    end_time: '2024-12-20T14:15:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-18T09:00:00Z',
    event_types: { id: 'et1', name: '15-min Quick Chat', duration_minutes: 15, location_type: 'conferencing', location_value: null },
  },
  {
    id: 'b6',
    event_type_id: 'et3',
    host_user_id: 'u1',
    guest_name: 'Marcus Webb',
    guest_email: 'marcus@design.co',
    guest_avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&h=128&fit=crop&crop=faces',
    guest_notes: 'Portfolio review',
    start_time: '2024-12-18T19:00:00Z',
    end_time: '2024-12-18T20:00:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-15T10:00:00Z',
    event_types: { id: 'et3', name: '60-min Strategy Session', duration_minutes: 60, location_type: 'conferencing', location_value: null },
  },
  {
    id: 'b7',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Lena Hoffmann',
    guest_email: 'lena@berlin.de',
    guest_avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&fit=crop&crop=faces',
    guest_notes: '',
    start_time: '2024-12-15T15:00:00Z',
    end_time: '2024-12-15T15:30:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-12T11:00:00Z',
    event_types: { id: 'et2', name: '30-min Discovery Call', duration_minutes: 30, location_type: 'conferencing', location_value: null },
  },
  {
    id: 'b8',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Raj Patel',
    guest_email: 'raj@consult.in',
    guest_avatar_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=128&h=128&fit=crop&crop=faces',
    guest_notes: 'Partnership opportunity',
    start_time: '2024-12-10T16:00:00Z',
    end_time: '2024-12-10T16:30:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-08T09:00:00Z',
    event_types: { id: 'et2', name: '30-min Discovery Call', duration_minutes: 30, location_type: 'conferencing', location_value: null },
  },
  {
    id: 'b9',
    event_type_id: 'et1',
    host_user_id: 'u1',
    guest_name: 'Claire Dubois',
    guest_email: 'claire@paris.fr',
    guest_avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces',
    guest_notes: '',
    start_time: '2024-12-05T21:00:00Z',
    end_time: '2024-12-05T21:15:00Z',
    status: 'confirmed',
    cancelled_at: null,
    created_at: '2024-12-03T14:00:00Z',
    event_types: { id: 'et1', name: '15-min Quick Chat', duration_minutes: 15, location_type: 'conferencing', location_value: null },
  },
  {
    id: 'b10',
    event_type_id: 'et2',
    host_user_id: 'u1',
    guest_name: 'Alex Torres',
    guest_email: 'alex@startupco.io',
    guest_avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=128&h=128&fit=crop&crop=faces',
    guest_notes: 'Reschedule attempt',
    start_time: '2024-12-22T15:00:00Z',
    end_time: '2024-12-22T15:30:00Z',
    status: 'cancelled',
    cancelled_at: '2024-12-21T13:00:00Z',
    created_at: '2024-12-19T10:00:00Z',
    event_types: { id: 'et2', name: '30-min Discovery Call', duration_minutes: 30, location_type: 'conferencing', location_value: null },
  },
];

export const featureTabs: FeatureTab[] = [
  { id: 'event-types', label: 'Event Types', screenshotAlt: 'Event types card list' },
  { id: 'booking-page', label: 'Booking Page', screenshotAlt: 'Public booking index' },
  { id: 'bookings', label: 'Bookings', screenshotAlt: 'Tabbed booking table' },
  { id: 'availability', label: 'Availability', screenshotAlt: 'Weekly availability grid' },
];

export const supportingFeatures: SupportingFeature[] = [
  { icon: 'Link', headline: 'One link for all meeting types', body: 'Share a single URL. Guests pick the meeting type that fits.' },
  { icon: 'Globe', headline: 'Timezone-aware slots', body: 'Guest timezone auto-detected. Times shown in their local time.' },
  { icon: 'Calendar', headline: 'Add to any calendar', body: 'Google Calendar, Outlook, or .ics download — no email needed.' },
  { icon: 'Video', headline: 'Paste your Zoom link once', body: 'Store your conferencing URL in settings. It appears on every booking.' },
];

export const testimonials: TestimonialEntry[] = [
  { quote: 'My clients book their own slots without a single email.', name: 'Jamie R.', role: 'Freelance Designer' },
  { quote: 'Set it up in 10 minutes. Now I just share the link.', name: 'Sam T.', role: 'Team Lead, Stackform' },
  { quote: "Finally a tool that doesn't need a PhD to configure.", name: 'Priya N.', role: 'Independent Consultant' },
];

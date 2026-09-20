import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { IconCalendar, IconColumns3, IconArrowLeft } from '@tabler/icons-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/base/button';
import { useDataProvider } from '@/lib/data-provider';
import { getSlotsForDate } from '@/lib/slot-calculator';
import { BookerMeta } from './components/booker-meta';
import { MonthView } from './components/month-view';
import { ColumnView } from './components/column-view';
import { GuestForm } from './components/guest-form';
import { Confirmation } from './components/confirmation';
import type { Booking } from '@/data/seed';
import { hasAvailabilityForDate } from '@/lib/slot-calculator';

type ViewMode = 'month' | 'column';
type BookingState = 'selecting' | 'form' | 'confirming' | 'confirmed';

function getStoredViewMode(): ViewMode {
  try {
    const v = localStorage.getItem('booker-view-mode');
    return v === 'column' ? 'column' : 'month';
  } catch {
    return 'month';
  }
}

function getStoredTimeFormat(): boolean {
  try {
    return localStorage.getItem('booker-24h') === 'true';
  } catch {
    return false;
  }
}

export default function PublicBookingFlowPage() {
  const { username = '', slug = '' } = useParams<{ username: string; slug: string }>();
  const dp = useDataProvider();
  const { data: profile, isLoading: profileLoading } = dp.usePublicProfile(username);
  const { data: eventType, isLoading: eventTypeLoading } = dp.usePublicEventType(username, slug);
  const { data: existingBookings } = dp.usePublicBookings(eventType?.id ?? '');
  const { data: hostBusy } = dp.useHostBusyTimes(profile?.id);
  const { mutate: createBooking, isPending } = dp.useCreateBooking();

  const blockingIntervals = useMemo(
    () => [...existingBookings, ...hostBusy],
    [existingBookings, hostBusy],
  );

  const [viewMode, setViewMode] = useState<ViewMode>(getStoredViewMode);
  const [use24h, setUse24h] = useState(getStoredTimeFormat);
  const detectedTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);
  const [guestTimezone, setGuestTimezone] = useState(detectedTimezone);
  const [isAutoDetected, setIsAutoDetected] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>('selecting');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const hostTimezone = profile?.timezone ?? 'America/New_York';
  const availability = profile?.availability;

  const slots = useMemo(() => {
    if (!selectedDate || !availability || !eventType) return [];
    return getSlotsForDate(
      selectedDate,
      hostTimezone,
      guestTimezone,
      availability,
      eventType.duration_minutes,
      blockingIntervals,
    );
  }, [selectedDate, hostTimezone, guestTimezone, availability, eventType, blockingIntervals]);

  const availableDatesForMonth = useMemo(() => {
    if (!availability) return [];
    const dates: Date[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (let i = 0; i < 60; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      if (hasAvailabilityForDate(d, hostTimezone, availability)) {
        dates.push(d);
      }
    }
    return dates;
  }, [availability, hostTimezone]);

  const handleViewModeChange = useCallback((value: string) => {
    if (value === 'month' || value === 'column') {
      setViewMode(value);
      try {
        localStorage.setItem('booker-view-mode', value);
      } catch { /* noop */ }
    }
  }, []);

  const handleTimeFormatChange = useCallback((value: string) => {
    if (value === '12h' || value === '24h') {
      const is24 = value === '24h';
      setUse24h(is24);
      try {
        localStorage.setItem('booker-24h', String(is24));
      } catch { /* noop */ }
    }
  }, []);

  const handleTimezoneChange = useCallback((tz: string) => {
    setGuestTimezone(tz);
    setIsAutoDetected(false);
  }, []);

  const handleSlotSelect = useCallback((slot: { start: Date; end: Date }) => {
    setSelectedSlot(slot);
    setBookingState('form');
  }, []);

  const handleBackToSlots = useCallback(() => {
    setSelectedSlot(null);
    setBookingState('selecting');
  }, []);

  const handleWeekChange = useCallback((direction: 'prev' | 'next') => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
      return d;
    });
  }, []);

  const handleConfirm = useCallback(
    async (data: { name: string; email: string; notes: string }) => {
      if (!selectedSlot || !eventType || !profile) return;
      setBookingState('confirming');

      const result = await createBooking({
        event_type_id: eventType.id,
        host_user_id: profile.id,
        guest_name: data.name,
        guest_email: data.email,
        guest_notes: data.notes || null,
        start_time: selectedSlot.start.toISOString(),
        end_time: selectedSlot.end.toISOString(),
      });

      if (result) {
        setConfirmedBooking(result);
        setBookingState('confirmed');
      } else {
        setBookingState('form');
      }
    },
    [selectedSlot, eventType, profile, createBooking],
  );

  if (profileLoading || eventTypeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-md border p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div className="h-6 w-6 rounded-full bg-muted" />
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-5 w-40 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
            </div>
            <div className="flex items-center justify-center">
              <div className="h-64 w-64 rounded bg-muted" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-full rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !eventType) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold">Event type not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This booking page doesn't exist or is no longer active.
          </p>
        </div>
      </div>
    );
  }

  if (bookingState === 'confirmed' && confirmedBooking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-md border">
          <Confirmation
            booking={confirmedBooking}
            eventName={eventType.name}
            hostName={profile.full_name}
            conferencingUrl={confirmedBooking.meet_link ?? profile.conferencing_url}
            guestTimezone={guestTimezone}
            use24h={use24h}
            username={username}
          />
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Powered by Meeting Booker</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          {bookingState !== 'selecting' ? (
            <Button variant="ghost" size="sm" onClick={handleBackToSlots}>
              <IconArrowLeft className="size-4" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/book/${username}`}>
                <IconArrowLeft className="size-4" />
                Back
              </Link>
            </Button>
          )}

          {bookingState === 'selecting' && (
            <div className="flex items-center gap-2">
              <ToggleGroup
                type="single"
                value={use24h ? '24h' : '12h'}
                onValueChange={handleTimeFormatChange}
                size="sm"
                variant="outline"
              >
                <ToggleGroupItem value="12h">12h</ToggleGroupItem>
                <ToggleGroupItem value="24h">24h</ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={handleViewModeChange}
                size="sm"
                variant="outline"
              >
                <ToggleGroupItem value="month" aria-label="Month view">
                  <IconCalendar className="size-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="column" aria-label="Column view">
                  <IconColumns3 className="size-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
        </div>

        <div className="rounded-md border">
          <div
            className={`grid grid-cols-1 ${
              bookingState === 'form' || bookingState === 'confirming'
                ? 'md:grid-cols-[280px_1fr]'
                : viewMode === 'month'
                  ? 'md:grid-cols-[280px_1fr_280px]'
                  : 'md:grid-cols-[340px_1fr] lg:grid-cols-[424px_1fr]'
            }`}
          >
            <div className="border-b md:border-b-0 md:border-r">
              <BookerMeta
                profile={profile}
                eventType={eventType}
                username={username}
                guestTimezone={guestTimezone}
                onTimezoneChange={handleTimezoneChange}
                isAutoDetected={isAutoDetected}
                selectedSlot={selectedSlot}
                use24h={use24h}
                showMiniCalendar={viewMode === 'column' && bookingState === 'selecting'}
                selectedDate={selectedDate}
                onDateSelect={(d) => {
                  if (d) setSelectedDate(d);
                }}
                availableDates={availableDatesForMonth}
              />
            </div>

            {bookingState === 'form' || bookingState === 'confirming' ? (
              <GuestForm
                eventName={eventType.name}
                selectedSlot={selectedSlot!}
                guestTimezone={guestTimezone}
                use24h={use24h}
                onConfirm={handleConfirm}
                isPending={bookingState === 'confirming' || isPending}
              />
            ) : viewMode === 'month' ? (
              <MonthView
                selectedDate={selectedDate}
                onDateSelect={(d) => {
                  if (d) setSelectedDate(d);
                }}
                slots={slots}
                guestTimezone={guestTimezone}
                use24h={use24h}
                onSlotSelect={handleSlotSelect}
                selectedSlot={selectedSlot}
                hostTimezone={hostTimezone}
                availability={availability!}
              />
            ) : (
              <ColumnView
                weekStart={weekStart}
                onWeekChange={handleWeekChange}
                guestTimezone={guestTimezone}
                hostTimezone={hostTimezone}
                use24h={use24h}
                availability={availability!}
                durationMinutes={eventType.duration_minutes}
                existingBookings={blockingIntervals}
                onSlotSelect={handleSlotSelect}
                selectedSlot={selectedSlot}
              />
            )}
          </div>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">Powered by Meeting Booker</p>
    </div>
  );
}

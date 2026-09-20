import type { AvailabilityJson } from '@/data/seed';

interface SlotPair {
  start: Date;
  end: Date;
}

const DAY_KEYS: (keyof AvailabilityJson)[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function getSlotsForDate(
  targetDate: Date,
  hostTimezone: string,
  guestTimezone: string,
  availability: AvailabilityJson,
  durationMinutes: number,
  existingBookings: { start_time: string; end_time: string }[],
): SlotPair[] {
  const dayIndex = getDayIndexInTimezone(targetDate, hostTimezone);
  const dayKey = DAY_KEYS[dayIndex];
  const windows = availability[dayKey];
  if (!windows || windows.length === 0) return [];

  const slots: SlotPair[] = [];

  for (const window of windows) {
    const windowStart = timeToDateInTimezone(targetDate, window.start, hostTimezone);
    const windowEnd = timeToDateInTimezone(targetDate, window.end, hostTimezone);

    let cursor = new Date(windowStart);
    while (cursor.getTime() + durationMinutes * 60 * 1000 <= windowEnd.getTime()) {
      const slotEnd = new Date(cursor.getTime() + durationMinutes * 60 * 1000);

      const overlaps = existingBookings.some((booking) => {
        const bStart = new Date(booking.start_time).getTime();
        const bEnd = new Date(booking.end_time).getTime();
        return cursor.getTime() < bEnd && slotEnd.getTime() > bStart;
      });

      if (!overlaps && cursor.getTime() > Date.now()) {
        slots.push({ start: new Date(cursor), end: slotEnd });
      }

      cursor = new Date(cursor.getTime() + durationMinutes * 60 * 1000);
    }
  }

  return slots;
}

export function hasAvailabilityForDate(
  targetDate: Date,
  hostTimezone: string,
  availability: AvailabilityJson,
): boolean {
  const dayIndex = getDayIndexInTimezone(targetDate, hostTimezone);
  const dayKey = DAY_KEYS[dayIndex];
  const windows = availability[dayKey];
  return !!windows && windows.length > 0;
}

function getDayIndexInTimezone(date: Date, timezone: string): number {
  const str = date.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'short' });
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[str] ?? 0;
}

function timeToDateInTimezone(date: Date, time: string, timezone: string): Date {
  const dateStr = date.toLocaleDateString('en-CA', { timeZone: timezone });
  const [year, month, day] = dateStr.split('-').map(Number);

  const [hours, minutes] = time.split(':').map(Number);

  const probe = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  const probeLocal = new Date(
    probe.toLocaleString('en-US', { timeZone: timezone }),
  );
  const offset = probeLocal.getTime() - probe.getTime();
  return new Date(probe.getTime() - offset);
}

export function formatSlotTime(date: Date, timezone: string, use24h: boolean): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24h,
  });
}

export function formatDateHeader(date: Date, timezone: string): string {
  return date.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(date: Date, timezone: string): string {
  return date.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTimeRange(
  start: Date,
  end: Date,
  timezone: string,
  use24h: boolean,
): string {
  return `${formatSlotTime(start, timezone, use24h)} – ${formatSlotTime(end, timezone, use24h)}`;
}

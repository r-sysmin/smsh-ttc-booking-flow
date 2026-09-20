import { useMemo } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimeSlotButton } from './time-slot-button';
import { getSlotsForDate, hasAvailabilityForDate } from '@/lib/slot-calculator';
import type { AvailabilityJson } from '@/data/seed';

interface ColumnViewProps {
  weekStart: Date;
  onWeekChange: (direction: 'prev' | 'next') => void;
  guestTimezone: string;
  hostTimezone: string;
  use24h: boolean;
  availability: AvailabilityJson;
  durationMinutes: number;
  existingBookings: { start_time: string; end_time: string }[];
  onSlotSelect: (slot: { start: Date; end: Date }) => void;
  selectedSlot: { start: Date; end: Date } | null;
}

export function ColumnView({
  weekStart,
  onWeekChange,
  guestTimezone,
  hostTimezone,
  use24h,
  availability,
  durationMinutes,
  existingBookings,
  onSlotSelect,
  selectedSlot,
}: ColumnViewProps) {
  const weekEnd = useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d;
  }, [weekStart]);

  const availableDays = useMemo(() => {
    const days: { date: Date; slots: { start: Date; end: Date }[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      if (d < today) continue;
      if (!hasAvailabilityForDate(d, hostTimezone, availability)) continue;

      const slots = getSlotsForDate(d, hostTimezone, guestTimezone, availability, durationMinutes, existingBookings);
      if (slots.length > 0) {
        days.push({ date: d, slots });
      }
    }
    return days;
  }, [weekStart, hostTimezone, guestTimezone, availability, durationMinutes, existingBookings]);

  const formatRangeHeader = () => {
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const yearOpts: Intl.DateTimeFormatOptions = { ...opts, year: 'numeric' };
    return `${weekStart.toLocaleDateString('en-US', opts)} – ${weekEnd.toLocaleDateString('en-US', yearOpts)}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => onWeekChange('prev')}>
          <IconChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-medium">{formatRangeHeader()}</span>
        <Button variant="ghost" size="icon" onClick={() => onWeekChange('next')}>
          <IconChevronRight className="size-4" />
        </Button>
      </div>

      {availableDays.length > 0 ? (
        <ScrollArea className="h-[460px]">
          <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${Math.min(availableDays.length, 5)}, minmax(120px, 1fr))` }}>
            {availableDays.map(({ date, slots }) => (
              <div key={date.toISOString()} className="flex flex-col gap-2">
                <div
                  className={`rounded-md px-2 py-1 text-center text-xs font-semibold uppercase ${
                    isToday(date)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground'
                  }`}
                >
                  {date.toLocaleDateString('en-US', { timeZone: guestTimezone, weekday: 'short' })}{' '}
                  {date.toLocaleDateString('en-US', { timeZone: guestTimezone, day: 'numeric' })}
                </div>
                <div className="flex flex-col gap-2">
                  {slots.map((slot) => (
                    <TimeSlotButton
                      key={slot.start.toISOString()}
                      start={slot.start}
                      timezone={guestTimezone}
                      use24h={use24h}
                      isSelected={selectedSlot?.start.getTime() === slot.start.getTime()}
                      onSelect={() => onSlotSelect(slot)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No available slots this week.
        </p>
      )}
    </div>
  );
}

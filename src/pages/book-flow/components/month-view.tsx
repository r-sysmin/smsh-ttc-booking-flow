import { useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimeSlotButton } from './time-slot-button';
import { formatDateHeader } from '@/lib/slot-calculator';
import type { AvailabilityJson } from '@/data/seed';
import { hasAvailabilityForDate } from '@/lib/slot-calculator';

interface MonthViewProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  slots: { start: Date; end: Date }[];
  guestTimezone: string;
  use24h: boolean;
  onSlotSelect: (slot: { start: Date; end: Date }) => void;
  selectedSlot: { start: Date; end: Date } | null;
  hostTimezone: string;
  availability: AvailabilityJson;
}

export function MonthView({
  selectedDate,
  onDateSelect,
  slots,
  guestTimezone,
  use24h,
  onSlotSelect,
  selectedSlot,
  hostTimezone,
  availability,
}: MonthViewProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <>
      <div className="flex items-center justify-center p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          modifiers={{
            available: (date) => hasAvailabilityForDate(date, hostTimezone, availability),
          }}
          modifiersClassNames={{
            available: 'font-semibold',
          }}
          disabled={(date) => {
            return date < today || !hasAvailabilityForDate(date, hostTimezone, availability);
          }}
        />
      </div>

      <div className="border-l p-4">
        {selectedDate && (
          <div className="mb-4 text-sm font-semibold text-foreground">
            {formatDateHeader(selectedDate, guestTimezone)}
          </div>
        )}

        {slots.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col gap-2 pr-2">
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
          </ScrollArea>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No available slots for this day.
          </p>
        )}
      </div>
    </>
  );
}

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IconClock, IconVideo, IconMapPin, IconGlobe } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import type { PublicProfile, EventType } from '@/data/seed';
import { formatFullDate, formatTimeRange } from '@/lib/slot-calculator';

interface BookerMetaProps {
  profile: PublicProfile;
  eventType: EventType;
  username: string;
  guestTimezone: string;
  onTimezoneChange: (tz: string) => void;
  isAutoDetected: boolean;
  selectedSlot: { start: Date; end: Date } | null;
  use24h: boolean;
  showMiniCalendar: boolean;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  availableDates: Date[];
}

const COMMON_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export function BookerMeta({
  profile,
  eventType,
  username,
  guestTimezone,
  onTimezoneChange,
  isAutoDetected,
  selectedSlot,
  use24h,
  showMiniCalendar,
  selectedDate,
  onDateSelect,
  availableDates,
}: BookerMetaProps) {
  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const timezoneOptions = useMemo(() => {
    const tzs = new Set(COMMON_TIMEZONES);
    tzs.add(guestTimezone);
    if (profile.timezone) tzs.add(profile.timezone);
    return Array.from(tzs).sort();
  }, [guestTimezone, profile.timezone]);

  const availableDateSet = useMemo(
    () => new Set(availableDates.map((d) => d.toDateString())),
    [availableDates],
  );

  return (
    <div className="sticky top-0 flex flex-col gap-4 p-6">
      <Link to={`/book/${username}`}>
        <Avatar className="h-6 w-6">
          {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name} />}
          <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
        </Avatar>
      </Link>

      <p className="text-sm font-semibold text-muted-foreground">{profile.full_name}</p>
      <h1 className="text-xl font-semibold text-foreground">{eventType.name}</h1>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <IconClock className="size-4" />
          <span>{eventType.duration_minutes}m</span>
        </div>
        {eventType.location_type === 'conferencing' ? (
          <div className="flex items-center gap-2">
            <IconVideo className="size-4" />
            <span>Conferencing link</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <IconMapPin className="size-4" />
            <span>{eventType.location_value ?? 'In person'}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <IconGlobe className="size-4" />
          <Select value={guestTimezone} onValueChange={onTimezoneChange}>
            <SelectTrigger className="h-auto border-0 p-0 text-sm text-muted-foreground shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezoneOptions.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isAutoDetected && (
          <span className="ml-6 text-xs text-muted-foreground">(auto-detected)</span>
        )}
      </div>

      {selectedSlot && (
        <div className="mt-2 border-t pt-4 text-sm text-foreground">
          <p>{formatFullDate(selectedSlot.start, guestTimezone)}</p>
          <p>{formatTimeRange(selectedSlot.start, selectedSlot.end, guestTimezone, use24h)}</p>
        </div>
      )}

      {showMiniCalendar && (
        <div className="mt-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            modifiers={{
              available: (date) => availableDateSet.has(date.toDateString()),
            }}
            modifiersClassNames={{
              available: 'font-semibold',
            }}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
          />
        </div>
      )}
    </div>
  );
}

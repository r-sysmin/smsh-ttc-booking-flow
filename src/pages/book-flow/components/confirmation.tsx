import { Link } from 'react-router-dom';
import { IconCircleCheck, IconBrandGoogle, IconDownload } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { formatFullDate, formatTimeRange } from '@/lib/slot-calculator';
import { googleCalendarUrl, outlookCalendarUrl } from '@/lib/calendar-links';
import { generateIcs, downloadIcs } from '@/lib/ics';
import type { Booking } from '@/data/seed';

interface ConfirmationProps {
  booking: Booking;
  eventName: string;
  hostName: string;
  conferencingUrl: string | null;
  guestTimezone: string;
  use24h: boolean;
  username: string;
}

export function Confirmation({
  booking,
  eventName,
  hostName,
  conferencingUrl,
  guestTimezone,
  use24h,
  username,
}: ConfirmationProps) {
  const start = new Date(booking.start_time);
  const end = new Date(booking.end_time);

  const calendarTitle = `${eventName} with ${hostName}`;
  const location = conferencingUrl ?? '';

  const googleUrl = googleCalendarUrl({
    title: calendarTitle,
    start,
    end,
    details: booking.guest_notes ?? '',
    location,
  });

  const outlookUrl = outlookCalendarUrl({
    title: calendarTitle,
    start,
    end,
    body: booking.guest_notes ?? '',
    location,
  });

  const handleDownloadIcs = () => {
    const content = generateIcs({
      uid: booking.id,
      title: calendarTitle,
      start,
      end,
      description: booking.guest_notes ?? '',
      location,
      organizerEmail: `${username}@meetingbooker.app`,
      attendeeEmail: booking.guest_email,
    });
    downloadIcs(content, `${eventName.toLowerCase().replace(/\s+/g, '-')}.ics`);
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <IconCircleCheck className="size-12 text-emerald-500" />
      <h1 className="mt-4 text-2xl font-semibold text-foreground">You're booked!</h1>

      <div className="mt-4 space-y-1 text-sm text-muted-foreground">
        <p className="text-foreground font-medium">{calendarTitle}</p>
        <p>
          {formatFullDate(start, guestTimezone)} ·{' '}
          {formatTimeRange(start, end, guestTimezone, use24h)}{' '}
          ({guestTimezone.replace(/_/g, ' ')})
        </p>
        {conferencingUrl && (
          <p>Conferencing link: {conferencingUrl.replace(/^https?:\/\//, '')}</p>
        )}
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-sm font-medium text-foreground">Add to your calendar</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer">
              <IconBrandGoogle className="size-4" />
              Google Calendar
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={outlookUrl} target="_blank" rel="noopener noreferrer">
              Outlook
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadIcs}>
            <IconDownload className="size-4" />
            Download .ics
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <Button variant="ghost" asChild>
          <Link to={`/book/${username}`}>← Book another meeting</Link>
        </Button>
      </div>
    </div>
  );
}

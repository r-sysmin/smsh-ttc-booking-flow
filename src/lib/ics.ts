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
    'PRODID:-//Meeting Booker//EN',
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
    'END:VCALENDAR',
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

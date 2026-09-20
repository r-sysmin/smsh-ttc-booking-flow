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
    location: booking.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(booking: {
  title: string;
  start: Date;
  end: Date;
  body: string;
  location: string;
}): string {
  const params = new URLSearchParams({
    subject: booking.title,
    startdt: booking.start.toISOString(),
    enddt: booking.end.toISOString(),
    body: booking.body,
    location: booking.location,
    path: '/calendar/action/compose',
    rru: 'addevent',
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}

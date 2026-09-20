// Creates or deletes a Google Calendar event for a booking on the host's
// primary calendar. Public endpoint — bookings are inserted anonymously and
// this fires immediately after. It never returns tokens; it only touches
// events on the host's calendar via the server-side token.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { getValidAccessToken, serviceClient } from '../_shared/google.ts';

interface CreateBody {
  action: 'create';
  booking_id: string;
}
interface CancelBody {
  action: 'cancel';
  booking_id: string;
}
type Body = CreateBody | CancelBody;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    if (!body?.action || !body?.booking_id) {
      return json({ error: 'action, booking_id required' }, 400);
    }

    const sb = serviceClient();
    const { data: booking, error: bookingErr } = await sb
      .from('bookings')
      .select(`
        id, host_user_id, guest_name, guest_email, guest_notes,
        start_time, end_time, google_event_id,
        event_types (name, location_type, location_value)
      `)
      .eq('id', body.booking_id)
      .maybeSingle();

    if (bookingErr || !booking) {
      return json({ error: 'booking not found' }, 404);
    }

    const accessToken = await getValidAccessToken(booking.host_user_id);
    if (!accessToken) {
      return json({ synced: false, reason: 'host_not_connected' });
    }

    if (body.action === 'cancel') {
      if (!booking.google_event_id) return json({ synced: false, reason: 'no_event' });
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(booking.google_event_id)}?sendUpdates=all`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!res.ok && res.status !== 410 && res.status !== 404) {
        console.error('Delete event failed', res.status, await res.text());
        return json({ synced: false, reason: 'delete_failed' });
      }
      await sb.from('bookings').update({ google_event_id: null }).eq('id', booking.id);
      return json({ synced: true });
    }

    // Create
    const et = (booking as unknown as {
      event_types: { name: string; location_type: string; location_value: string | null } | null;
    }).event_types;

    const eventPayload: Record<string, unknown> = {
      summary: `${et?.name ?? 'Meeting'} with ${booking.guest_name}`,
      description: booking.guest_notes || undefined,
      start: { dateTime: booking.start_time },
      end: { dateTime: booking.end_time },
      attendees: [{ email: booking.guest_email, displayName: booking.guest_name }],
      conferenceData: {
        createRequest: {
          requestId: `cal-${booking.id}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: { useDefault: true },
    };

    const createRes = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      },
    );

    if (!createRes.ok) {
      const errBody = await createRes.text();
      console.error('Create event failed', createRes.status, errBody);
      return json({ synced: false, reason: 'create_failed' });
    }

    const created = await createRes.json() as {
      id: string;
      hangoutLink?: string;
      htmlLink?: string;
    };

    await sb
      .from('bookings')
      .update({ google_event_id: created.id })
      .eq('id', booking.id);

    return json({
      synced: true,
      google_event_id: created.id,
      meet_link: created.hangoutLink ?? null,
      html_link: created.htmlLink ?? null,
    });
  } catch (err) {
    console.error(err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

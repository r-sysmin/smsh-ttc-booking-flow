// Returns busy intervals from the host's primary Google Calendar for a given
// window. Called by the public booker to hide conflicting slots. Public — no
// auth required (host_user_id is the only key needed; no tokens leave the
// server).
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { getValidAccessToken } from '../_shared/google.ts';

interface Body {
  host_user_id?: string;
  time_min?: string; // ISO
  time_max?: string; // ISO
  timezone?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = (await req.json()) as Body;
    if (!body.host_user_id || !body.time_min || !body.time_max) {
      return json({ error: 'host_user_id, time_min, time_max required' }, 400);
    }

    const accessToken = await getValidAccessToken(body.host_user_id);
    if (!accessToken) {
      // Host has no calendar connection — return empty busy set so the booker
      // simply falls back to the app's own booking overlap logic.
      return json({ busy: [] });
    }

    const fbRes = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeMin: body.time_min,
        timeMax: body.time_max,
        timeZone: body.timezone ?? 'UTC',
        items: [{ id: 'primary' }],
      }),
    });

    if (!fbRes.ok) {
      const errBody = await fbRes.text();
      console.error('freeBusy failed', fbRes.status, errBody);
      return json({ busy: [] });
    }

    const data = await fbRes.json();
    const busy = (data?.calendars?.primary?.busy ?? []) as { start: string; end: string }[];
    return json({ busy });
  } catch (err) {
    console.error(err);
    return json({ busy: [] });
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

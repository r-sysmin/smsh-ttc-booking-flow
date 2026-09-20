// Returns a Google OAuth authorization URL for the signed-in host.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { GOOGLE_SCOPES, redirectUri, requireEnv } from '../_shared/google.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const supabase = createClient(
      requireEnv('SUPABASE_URL'),
      requireEnv('SUPABASE_ANON_KEY'),
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await supabase.auth.getClaims(token);
    if (error || !data?.claims) return json({ error: 'Unauthorized' }, 401);

    const userId = data.claims.sub as string;

    let returnTo = '/settings';
    try {
      const body = await req.json();
      if (typeof body?.return_to === 'string' && body.return_to.startsWith('/')) {
        returnTo = body.return_to;
      }
    } catch { /* body optional */ }

    const state = btoa(JSON.stringify({ user_id: userId, return_to: returnTo, ts: Date.now() }));

    const params = new URLSearchParams({
      client_id: requireEnv('GOOGLE_OAUTH_CLIENT_ID'),
      redirect_uri: redirectUri(),
      response_type: 'code',
      scope: GOOGLE_SCOPES,
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state,
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return json({ url });
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

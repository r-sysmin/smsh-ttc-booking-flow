// Handles Google's OAuth redirect: exchanges code for tokens, upserts the
// user's calendar_connections row, then redirects back to the app.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { redirectUri, requireEnv, serviceClient } from '../_shared/google.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const stateRaw = url.searchParams.get('state');
  const oauthError = url.searchParams.get('error');

  if (oauthError || !code || !stateRaw) {
    return htmlRedirect('/settings?google=error');
  }

  let userId: string;
  let returnTo = '/settings';
  try {
    const state = JSON.parse(atob(stateRaw)) as { user_id: string; return_to?: string; ts: number };
    userId = state.user_id;
    if (state.return_to && state.return_to.startsWith('/')) returnTo = state.return_to;
    // Reject stale state (>10 min).
    if (Date.now() - state.ts > 10 * 60 * 1000) return htmlRedirect('/settings?google=error');
  } catch {
    return htmlRedirect('/settings?google=error');
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: requireEnv('GOOGLE_OAUTH_CLIENT_ID'),
      client_secret: requireEnv('GOOGLE_OAUTH_CLIENT_SECRET'),
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    console.error('Token exchange failed', tokenRes.status, await tokenRes.text());
    return htmlRedirect(`${returnTo}?google=error`);
  }

  const tokenPayload = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope?: string;
  };

  if (!tokenPayload.refresh_token) {
    // User previously authorized; no refresh_token returned. Force reconsent by
    // revoking their prior grant is possible, but simplest: tell them to retry.
    console.warn('No refresh_token returned from Google for user', userId);
    return htmlRedirect(`${returnTo}?google=no_refresh`);
  }

  // Fetch email for display.
  let googleEmail: string | null = null;
  try {
    const userinfo = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
    });
    if (userinfo.ok) {
      const info = await userinfo.json();
      googleEmail = info.email ?? null;
    }
  } catch (e) {
    console.warn('userinfo fetch failed', e);
  }

  const sb = serviceClient();
  const { error } = await sb.from('calendar_connections').upsert({
    user_id: userId,
    provider: 'google',
    google_email: googleEmail,
    access_token: tokenPayload.access_token,
    refresh_token: tokenPayload.refresh_token,
    token_expires_at: new Date(Date.now() + tokenPayload.expires_in * 1000).toISOString(),
    scope: tokenPayload.scope ?? null,
  });

  if (error) {
    console.error('DB upsert failed', error);
    return htmlRedirect(`${returnTo}?google=error`);
  }

  return htmlRedirect(`${returnTo}?google=connected`);
});

function htmlRedirect(path: string) {
  // Redirect the browser back to the app. Origin is determined from an env
  // hint when set; otherwise a small HTML page uses window.location.
  const appOrigin = Deno.env.get('APP_ORIGIN');
  if (appOrigin) {
    return new Response(null, {
      status: 302,
      headers: { Location: `${appOrigin}${path}` },
    });
  }
  const html = `<!doctype html><meta charset="utf-8"><title>Redirecting…</title>
<script>location.replace(${JSON.stringify(path)});</script>
<p>Redirecting… If you are not redirected, <a href="${path}">continue</a>.</p>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

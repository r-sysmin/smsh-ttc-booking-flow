// Shared Google OAuth + token-refresh helpers for Google Calendar edge functions.
import { createClient } from 'npm:@supabase/supabase-js@2';

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/userinfo.email',
].join(' ');

export function serviceClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );
}

export function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function redirectUri(): string {
  return `${requireEnv('SUPABASE_URL')}/functions/v1/google-calendar-callback`;
}

interface Connection {
  user_id: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  google_email: string | null;
}

/**
 * Load the host's Google connection and return a currently-valid access token,
 * refreshing via Google if needed. Returns null if the host has no connection
 * or the refresh token was revoked (in which case the row is deleted).
 */
export async function getValidAccessToken(userId: string): Promise<string | null> {
  const sb = serviceClient();
  const { data, error } = await sb
    .from('calendar_connections')
    .select('user_id, access_token, refresh_token, token_expires_at, google_email')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const conn = data as Connection;
  const expiresAt = new Date(conn.token_expires_at).getTime();
  // Refresh 60s before actual expiry.
  if (expiresAt - 60_000 > Date.now()) {
    return conn.access_token;
  }

  const clientId = requireEnv('GOOGLE_OAUTH_CLIENT_ID');
  const clientSecret = requireEnv('GOOGLE_OAUTH_CLIENT_SECRET');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: conn.refresh_token,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Token refresh failed', res.status, body);
    // Revoked / invalid grant: clear the connection.
    if (res.status === 400 || res.status === 401) {
      await sb.from('calendar_connections').delete().eq('user_id', userId);
    }
    return null;
  }

  const payload = (await res.json()) as {
    access_token: string;
    expires_in: number;
    scope?: string;
  };

  const newExpiresAt = new Date(Date.now() + payload.expires_in * 1000).toISOString();
  await sb
    .from('calendar_connections')
    .update({
      access_token: payload.access_token,
      token_expires_at: newExpiresAt,
      ...(payload.scope ? { scope: payload.scope } : {}),
    })
    .eq('user_id', userId);

  return payload.access_token;
}

/**
 * The single source of truth for post-auth navigation.
 *
 * After sign-in, an email confirmation, or an OAuth callback the user lands HERE — the
 * app's first authenticated screen — never `/` (the marketing landing).
 * See docs/design/auth.md.
 */
export const DEFAULT_AUTHED_ROUTE = "/event-types";

/** Where the user lands after signing OUT, and the auth screen we send failures back to. */
export const SIGNED_OUT_ROUTE = "/auth";

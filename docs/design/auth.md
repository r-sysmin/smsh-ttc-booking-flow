# Auth

> **⚠️ Two rules that are shipped code, not suggestions:**
> - **SSO buttons:** render `<SocialAuthButtons>` from
>   `@/components/base/social-auth-buttons` (the brand-compliant Google mark). Never
>   hand-roll "Continue with Google" and never restyle it with the theme color.
> - **Redirect:** always `redirect_uri: ${window.location.origin}/auth/callback` — never
>   a bare origin, which strands the user on the marketing landing. The same goes for
>   `emailRedirectTo`. Post-auth lands on `DEFAULT_AUTHED_ROUTE` (`src/lib/auth/constants.ts`).

Auth is real Supabase auth — Google SSO and email/password. It is not simulated, not
deferred, not a SPEC-GAP.

---

## The surfaces

| Route | File | What it is |
|---|---|---|
| `/auth` | `src/pages/auth/index.tsx` → `components/auth-card.tsx` | The one auth screen. Google SSO on top, then a Sign in / Sign up tab pair, plus forgot-password and resend-confirmation views. |
| `/auth/callback` | `src/pages/auth/callback.tsx` | Where OAuth and email-confirmation links return. |
| `/demo/*` | seeded, no auth | The public walkthrough. No session exists here. |

`ProtectedRoute` (`src/components/protected-route.tsx`) guards the real `/*` app routes
and sends signed-out visitors to `/auth?intent=signin`.

---

## SSO — one component, one code path

```tsx
<SocialAuthButtons mode={activeTab === "signup" ? "signup" : "signin"} providers={["google"]} />
```

- Google is the only provider this project has configured, so it is the only one passed.
  Shipping a button for an unconfigured provider only ever produces an error.
- OAuth runs through the **Lovable managed broker** (`src/integrations/lovable/`), which
  holds the OAuth secret centrally. A direct `supabase.auth.signInWithOAuth` fails with
  "missing OAuth secret". **Never edit `src/integrations/lovable/` — it is generated.**
- The component always redirects to `${window.location.origin}/auth/callback`. That is why
  the `/auth/callback` route must exist: without it, SSO dead-ends on a 404.

## Redirects — where each link comes back to

| Flow | Redirect | Why |
|---|---|---|
| Google OAuth | `${origin}/auth/callback` | Fixed inside `SocialAuthButtons`. |
| Sign-up confirmation (`emailRedirectTo`) | `${origin}/auth/callback` | Only that route can exchange the code for a session. |
| Password recovery (`resetPasswordForEmail`) | `${origin}/auth` | Deliberately NOT the callback: the callback signs you straight into the app, which would skip the chance to choose a new password. |

`/auth/callback` handles **both** ways the broker can return a session — fragment tokens
(`#access_token=…`) and a PKCE `?code=…` — then lands the user on `DEFAULT_AUTHED_ROUTE`.
A callback that handles only one of the two strands the user whenever the client is
configured for the other.

---

## The leave affordance — sign out / exit demo

Route-aware, and `useIsDemo()` (`src/lib/demo.ts`) is the ONE thing that decides it.
Never re-branch on the pathname or a route prefix yourself.

- **Authenticated `/*`** → "Sign out", calls `signOut()` from AuthProvider.
- **Public `/demo/*`** → "Exit demo" with a close icon, a plain navigation to
  `EXIT_DEMO_ROUTE` (`/`). The demo has no session, so signing out is meaningless — but
  hiding the item and leaving nothing in its place is also wrong: the visitor is stuck.

This app uses the top-bar layout (`workspace-layout-02`), which cannot mount a shadcn
`SidebarAccountFooter` (that needs `SidebarProvider`), so it wires the primitives
directly: the affordance is the last item in the account dropdown in
`src/pages/workspace/components/workspace-top-bar-02.tsx`, below Settings.

---

## Not sign-in, don't confuse them

Two surfaces mention Google and have nothing to do with signing in. Leave them alone:

- `src/pages/settings/components/integrations-tab.tsx` — **connecting a Google Calendar**
  (a `google-calendar-connect` Supabase edge function, its own OAuth grant for calendar
  scopes). Replacing this with `SocialAuthButtons` would break calendar sync.
- `src/pages/book-flow/components/confirmation.tsx` — an **"Add to Google Calendar" deep
  link** (`calendar.google.com/calendar/render`) next to Outlook and .ics download.

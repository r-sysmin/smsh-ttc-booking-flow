import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/lib/auth/auth-provider';
import { ProtectedRoute } from '@/components/protected-route';
import { SeedDataProvider, SupabaseDataProvider } from '@/lib/data-provider';
import { FilterProvider } from '@/lib/filter-context';

import ApplicationLayout from '@/layouts/application-layout';
import WorkspaceLayout02 from '@/layouts/workspace-layout-02';

import Landing from '@/pages/landing';
import AuthPage from '@/pages/auth';
import AuthCallbackPage from '@/pages/auth/callback';
import EventTypesPage from '@/pages/event-types';
import EventTypeDetailPage from '@/pages/event-types/detail';
import BookingsPage from '@/pages/bookings';
import AvailabilityPage from '@/pages/availability';
import SettingsPage from '@/pages/settings';
import PublicBookingIndexPage from '@/pages/book/index';
import PublicBookingFlowPage from '@/pages/book-flow';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <FilterProvider>
          <Routes>
            {/* Public — landing + auth */}
            <Route element={<ApplicationLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage />} />
              {/* Managed OAuth + email-confirmation return. SocialAuthButtons always
                  redirects here, so this route must exist or SSO dead-ends on a 404. */}
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
            </Route>

            {/* Public — booking pages */}
            <Route element={<ApplicationLayout />}>
              {/* Demo booking page — seed data, no auth, no Supabase */}
              <Route path="/book/demo" element={<SeedDataProvider><PublicBookingIndexPage /></SeedDataProvider>} />
              <Route path="/book/demo/:slug" element={<SeedDataProvider><PublicBookingFlowPage /></SeedDataProvider>} />
              {/* Real booking pages — Supabase anon reads */}
              <Route path="/book/:username" element={<SupabaseDataProvider><PublicBookingIndexPage /></SupabaseDataProvider>} />
              <Route path="/book/:username/:slug" element={<SupabaseDataProvider><PublicBookingFlowPage /></SupabaseDataProvider>} />
            </Route>

            {/* Demo — seed data, no auth */}
            <Route element={<SeedDataProvider><WorkspaceLayout02 /></SeedDataProvider>}>
              <Route path="/demo/event-types" element={<EventTypesPage />} />
              <Route path="/demo/event-types/:id" element={<EventTypeDetailPage />} />
              <Route path="/demo/bookings" element={<BookingsPage />} />
              <Route path="/demo/availability" element={<AvailabilityPage />} />
              <Route path="/demo/settings" element={<SettingsPage />} />
            </Route>

            {/* Protected — real Supabase data */}
            <Route element={<ProtectedRoute><SupabaseDataProvider><WorkspaceLayout02 /></SupabaseDataProvider></ProtectedRoute>}>
              <Route path="/event-types" element={<EventTypesPage />} />
              <Route path="/event-types/:id" element={<EventTypeDetailPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/availability" element={<AvailabilityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </FilterProvider>
      </AuthProvider>
    </BrowserRouter>
    <Toaster />
  </QueryClientProvider>
);

export default App;

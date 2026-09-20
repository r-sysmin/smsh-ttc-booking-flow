import { Routes, Route } from "react-router-dom";

import { SeedDataProvider } from "@/lib/data-provider";
import ApplicationLayout from "@/layouts/application-layout";
import WorkspaceLayout02 from "@/layouts/workspace-layout-02";

import EventTypesPage from "@/pages/event-types";
import BookingsPage from "@/pages/bookings";
import AvailabilityPage from "@/pages/availability";
import PublicBookingIndexPage from "@/pages/book/index";

import { ScaledPage } from "./scaled-page";

/**
 * Homepage mockups render the actual app pages (matching /demo/* routes) inside
 * a scaled, non-interactive container. Any UI change in the real pages shows up
 * here automatically. We reuse the outer BrowserRouter and override the matched
 * location via the `location` prop on <Routes>.
 */

function WorkspaceMockup({ location }: { location: string }) {
  return (
    <ScaledPage>
      <SeedDataProvider>
        <Routes location={location}>
          <Route element={<WorkspaceLayout02 />}>
            <Route path="/demo/event-types" element={<EventTypesPage />} />
            <Route path="/demo/bookings" element={<BookingsPage />} />
            <Route path="/demo/availability" element={<AvailabilityPage />} />
          </Route>
        </Routes>
      </SeedDataProvider>
    </ScaledPage>
  );
}

export function EventTypesMockup() {
  return <WorkspaceMockup location="/demo/event-types" />;
}

export function BookingsMockup() {
  return <WorkspaceMockup location="/demo/bookings" />;
}

export function AvailabilityMockup() {
  return <WorkspaceMockup location="/demo/availability" />;
}

export function BookingPageMockup() {
  return (
    <ScaledPage>
      <SeedDataProvider>
        <Routes location="/book/demo">
          <Route element={<ApplicationLayout />}>
            <Route path="/book/:username" element={<PublicBookingIndexPage />} />
          </Route>
        </Routes>
      </SeedDataProvider>
    </ScaledPage>
  );
}

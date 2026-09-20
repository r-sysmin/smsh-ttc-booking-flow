import type { Feature } from "./components/feature-showcase-01";

import { Header } from "./components/header";
import { FeatureShowcase } from "./components/feature-showcase-01";
import {
  EventTypesMockup,
  BookingPageMockup,
  BookingsMockup,
  AvailabilityMockup,
} from "./components/product-mockups";
import { Testimonial03 } from "./components/testimonial-03";
import { Cta01 } from "./components/cta-01";
import { Footer } from "./components/footer";
import { schedulingTestimonials } from "@/data/landing";

const showcaseFeatures: Feature[] = [
  {
    key: "event-types",
    label: "Event Types",
    heading: "Create meetings people can book",
    mockup: <EventTypesMockup />,
  },
  {
    key: "booking-page",
    label: "Booking Page",
    heading: "One link to share with anyone",
    mockup: <BookingPageMockup />,
  },
  {
    key: "bookings",
    label: "Bookings",
    heading: "See who booked and when",
    mockup: <BookingsMockup />,
  },
  {
    key: "availability",
    label: "Availability",
    heading: "Set your weekly hours once",
    mockup: <AvailabilityMockup />,
  },
];

export default function Landing() {
  return (
    <>
      <Header />

      <div id="features">
        <FeatureShowcase
          features={showcaseFeatures}
          header={() => (
            <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center">
              <h1 className="text-balance text-white">
                Meeting Booker
              </h1>
              <p className="mt-6 text-pretty text-lg text-white/80">
                Personal scheduling made simple
              </p>
            </div>
          )}
        />
      </div>

      <section className="landing bg-background py-24">
        <div className="mx-auto max-w-page px-6 lg:px-8">
          <h2 className="text-center text-balance">
            Loved by people who live in their calendar
          </h2>
          <div className="mt-16">
            <Testimonial03 testimonials={schedulingTestimonials} />
          </div>
        </div>
      </section>


      <Cta01
        heading="Ready to reclaim your calendar?"
        primaryCta={{ label: "Get started — it's free", to: "/auth?intent=signup" }}
      />

      <Footer />
    </>
  );
}

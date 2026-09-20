import { IconClock, IconChevronRight } from "@tabler/icons-react";

const eventTypes = [
  { name: "15-min Quick Chat", description: "Casual intro or quick question" },
  {
    name: "30-min Discovery Call",
    description: "Walk through your goals and challenges",
  },
  {
    name: "60-min Strategy Session",
    description: "Deep-dive planning session",
  },
];

/**
 * Mirrors the real public booking page (src/pages/book/index.tsx):
 * centered card with avatar + name + bio, separator, event type list.
 */
export function BookingMockup() {
  return (
    <div className="flex flex-col items-center justify-center bg-muted/40 p-6 sm:p-10">
      <div className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted text-lg font-medium text-foreground">
            AM
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Alex Morgan
            </h2>
            <p className="text-sm text-muted-foreground">
              Product Consultant · Happy to chat anytime.
            </p>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="p-2">
          {eventTypes.map((et) => (
            <div
              key={et.name}
              className="flex items-center gap-4 rounded-md px-4 py-4"
            >
              <IconClock className="size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {et.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {et.description}
                </p>
              </div>
              <IconChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Powered by Meeting Booker</p>
    </div>
  );
}

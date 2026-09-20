import { IconCalendar } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/base/button';
import { useDataProvider } from '@/lib/data-provider';

interface BookingsBlankslateProps {
  tab: 'upcoming' | 'past' | 'cancelled';
}

const blankslateContent = {
  upcoming: {
    heading: 'No upcoming bookings',
    body: "When someone books time with you, it'll show up here.",
    showCta: true,
  },
  past: {
    heading: 'No past bookings',
    body: 'Completed bookings will appear here.',
    showCta: false,
  },
  cancelled: {
    heading: 'No cancelled bookings',
    body: 'Cancelled bookings will appear here.',
    showCta: false,
  },
} as const;

export function BookingsBlankslate({ tab }: BookingsBlankslateProps) {
  const data = useDataProvider();
  const { data: profile } = data.useProfile();
  const content = blankslateContent[tab];

  const username = profile?.username ?? 'demo';

  function handleCopyLink() {
    const url = `${window.location.origin}/book/${username}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied');
  }

  return (
    <div className="relative">
      <div className="pointer-events-none space-y-3 p-6" aria-hidden>
        <div className="h-4 w-3/4 rounded bg-accent" />
        <div className="h-4 w-1/2 rounded bg-accent" />
        <div className="h-4 w-2/3 rounded bg-accent" />
        <div className="h-4 w-1/2 rounded bg-accent" />
        <div className="h-4 w-3/5 rounded bg-accent" />
        <div className="h-4 w-2/5 rounded bg-accent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-0 flex items-start justify-center pt-[10%]">
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <IconCalendar className="size-5 text-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">{content.heading}</h3>
              <p className="text-sm text-muted-foreground">{content.body}</p>
            </div>
            {content.showCta && (
              <Button variant="outline" onClick={handleCopyLink}>
                Share your booking link
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Separator } from '@/components/ui/separator';
import { EventTypeRow } from './event-type-row';
import type { EventType } from '@/data/seed';

interface EventTypeListProps {
  eventTypes: EventType[];
  username: string;
  isLoading: boolean;
}

export function EventTypeList({ eventTypes, username, isLoading }: EventTypeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 px-4 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-48 rounded bg-muted" />
            <div className="h-3 w-32 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (eventTypes.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        No events available right now. Check back soon.
      </p>
    );
  }

  return (
    <div>
      {eventTypes.map((et, index) => (
        <div key={et.id}>
          {index > 0 && <Separator className="mx-4 w-auto" />}
          <EventTypeRow eventType={et} username={username} />
        </div>
      ))}
    </div>
  );
}

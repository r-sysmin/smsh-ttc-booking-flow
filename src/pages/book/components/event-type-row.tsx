import { Link } from 'react-router-dom';
import { IconClock, IconChevronRight } from '@tabler/icons-react';
import type { EventType } from '@/data/seed';

interface EventTypeRowProps {
  eventType: EventType;
  username: string;
}

export function EventTypeRow({ eventType, username }: EventTypeRowProps) {
  return (
    <Link
      to={`/book/${username}/${eventType.slug}`}
      className="flex items-center gap-4 rounded-md px-4 py-4 transition-colors hover:bg-muted/60"
    >
      <IconClock className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{eventType.name}</span>
        </div>
        {eventType.description && (
          <span className="text-sm text-muted-foreground">
            {eventType.description}
          </span>
        )}
      </div>
      <IconChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

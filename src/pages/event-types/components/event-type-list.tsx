import { Card } from '@/components/ui/card';
import { useDataProvider } from '@/lib/data-provider';
import { EventTypeRow } from './event-type-row';
import { EventTypesBlankslate } from './blankslate';
import { EventTypesSkeleton } from './skeleton';

interface EventTypeListProps {
  username: string;
  onCreateNew: () => void;
}

export function EventTypeList({ username, onCreateNew }: EventTypeListProps) {
  const data = useDataProvider();
  const { data: eventTypes, isLoading } = data.useEventTypes();

  if (isLoading) return <EventTypesSkeleton />;
  if (eventTypes.length === 0) return <EventTypesBlankslate onCreateNew={onCreateNew} />;

  return (
    <Card className="overflow-hidden">
      {eventTypes.map((et) => (
        <EventTypeRow key={et.id} eventType={et} username={username} />
      ))}
    </Card>
  );
}

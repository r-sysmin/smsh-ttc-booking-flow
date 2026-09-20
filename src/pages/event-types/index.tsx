import { useNavigate, useLocation } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { Button } from '@/components/base/button';
import { useDataProvider } from '@/lib/data-provider';
import { EventTypeList } from './components/event-type-list';
import { FtuxBanner } from './components/ftux-banner';
import { BookingUrlStrip } from './components/booking-url-strip';

export default function EventTypesPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDemo = pathname.startsWith('/demo');
  const data = useDataProvider();
  const { mutate: createEventType, isPending } = data.useCreateEventType();
  const { data: profile } = data.useProfile();

  const username = profile?.username ?? 'demo';
  const basePrefix = isDemo ? '/demo' : '';

  async function handleCreateNew() {
    const result = await createEventType();
    if (result?.id) {
      navigate(`${basePrefix}/event-types/${result.id}?mode=edit`);
    }
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Event Types</h2>
          <Button onClick={handleCreateNew} disabled={isPending}>
            <IconPlus className="size-4" />
            New event type
          </Button>
        </div>

        <EventTypeList username={username} onCreateNew={handleCreateNew} />

        <BookingUrlStrip username={username} />

        <FtuxBanner />
      </div>
    </main>
  );
}

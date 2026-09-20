import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import { useDataProvider } from '@/lib/data-provider';
import { DetailView } from './components/detail-view';
import { DetailEdit } from './components/detail-edit';
import { DetailSkeleton } from './components/detail-skeleton';
import type { EventType } from '@/data/seed';

interface WorkspaceOutletContext {
  setBreadcrumbDetail?: (label: string | null) => void;
}

export default function EventTypeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDemo = pathname.startsWith('/demo');
  const basePrefix = isDemo ? '/demo' : '';

  const data = useDataProvider();
  const { data: eventType, isLoading } = data.useEventType(id!);
  const { data: profile } = data.useProfile();
  const { mutate: updateEventType, isPending: isSaving } = data.useUpdateEventType();
  const { mutate: deleteEventType } = data.useDeleteEventType();

  const username = profile?.username ?? 'demo';
  const isEditMode = searchParams.get('mode') === 'edit';
  const isNewBlankRecord = eventType !== null && !eventType.name && !eventType.slug;

  const outletContext = useOutletContext<WorkspaceOutletContext | null>();

  useEffect(() => {
    if (isLoading) return;
    const label = eventType?.name || 'New event type';
    outletContext?.setBreadcrumbDetail?.(label);
    return () => {
      outletContext?.setBreadcrumbDetail?.(null);
    };
  }, [eventType?.name, isLoading]);

  useEffect(() => {
    if (isNewBlankRecord && !isEditMode) {
      setSearchParams({ mode: 'edit' }, { replace: true });
    }
  }, [isNewBlankRecord, isEditMode, setSearchParams]);

  function handleEdit() {
    setSearchParams({ mode: 'edit' });
  }

  async function handleSave(fields: Partial<EventType>) {
    try {
      await updateEventType(id!, fields);
      toast.success('Saved');
      setSearchParams({});
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('event_types_user_id_slug_key') || msg.includes('duplicate key')) {
        toast.error('That URL slug is already in use. Choose a different one.');
      } else {
        toast.error('Could not save changes.');
      }
    }
  }

  function handleDiscard() {
    if (isNewBlankRecord) {
      deleteEventType(id!);
      navigate(`${basePrefix}/event-types`);
    } else {
      setSearchParams({});
    }
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl py-2">
          <DetailSkeleton />
        </div>
      </main>
    );
  }

  if (!eventType) {
    return (
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl py-2">
          <p className="text-sm text-muted-foreground">Event type not found.</p>
        </div>
      </main>
    );
  }

  const showEditMode = isEditMode || isNewBlankRecord;

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl py-2">
        {showEditMode ? (
          <DetailEdit
            eventType={eventType}
            username={username}
            onSave={handleSave}
            onDiscard={handleDiscard}
            isSaving={isSaving}
          />
        ) : (
          <DetailView
            eventType={eventType}
            username={username}
            onEdit={handleEdit}
          />
        )}
      </div>
    </main>
  );
}

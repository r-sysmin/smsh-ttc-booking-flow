import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconClock, IconCopy, IconExternalLink } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/base/button';
import { Badge } from '@/components/base/badge';
import { useDataProvider } from '@/lib/data-provider';
import type { EventType } from '@/data/seed';
import { DeleteEventTypeDialog } from './delete-dialog';

interface DetailViewProps {
  eventType: EventType;
  username: string;
  onEdit: () => void;
}

export function DetailView({ eventType, username, onEdit }: DetailViewProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDemo = pathname.startsWith('/demo');
  const data = useDataProvider();
  const { mutate: updateEventType } = data.useUpdateEventType();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const bookingUrl = `${window.location.origin}/book/${username}/${eventType.slug}`;
  const basePrefix = isDemo ? '/demo' : '';

  function handleCopyLink() {
    navigator.clipboard.writeText(bookingUrl);
    toast.success('Link copied');
  }

  function handleToggleActive() {
    updateEventType(eventType.id, { is_active: !eventType.is_active });
  }

  return (
    <>
      <Card className="[&]:shadow-none">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 p-6">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <IconClock className="size-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground">{eventType.name}</h2>
            </div>
            {eventType.description && (
              <p className="text-sm text-muted-foreground">{eventType.description}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={handleToggleActive} className="cursor-pointer">
              <Badge color={eventType.is_active ? 'green' : 'gray'}>
                {eventType.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </button>
            <Button variant="outline" onClick={onEdit}>
              Edit
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <Separator className="mb-6" />

          <div className="space-y-4">
            <div className="flex items-baseline gap-4">
              <span className="w-28 shrink-0 text-sm text-muted-foreground">Duration</span>
              <span className="text-sm text-foreground">{eventType.duration_minutes} minutes</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-28 shrink-0 text-sm text-muted-foreground">Location</span>
              <span className="text-sm text-foreground">
                {eventType.location_type === 'conferencing'
                  ? 'Conferencing link'
                  : eventType.location_value ?? 'In person'}
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="w-28 shrink-0 text-sm text-muted-foreground">URL slug</span>
              <span className="text-sm text-foreground">{eventType.slug}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="w-28 shrink-0 pt-0.5 text-sm text-muted-foreground">Booking link</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  book/{username}/{eventType.slug}
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                  <IconCopy className="size-4" />
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(bookingUrl, '_blank')}
                >
                  <IconExternalLink className="size-4" />
                  Preview
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <Button
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            Delete this event type
          </Button>
        </CardContent>
      </Card>

      <DeleteEventTypeDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        eventTypeId={eventType.id}
        eventTypeName={eventType.name}
        onDeleted={() => navigate(`${basePrefix}/event-types`)}
      />
    </>
  );
}

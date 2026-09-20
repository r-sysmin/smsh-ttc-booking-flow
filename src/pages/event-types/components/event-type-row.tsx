import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  IconClock,
  IconCopy,
  IconDots,
  IconPencil,
  IconExternalLink,
  IconTrash,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { Badge } from '@/components/base/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDataProvider } from '@/lib/data-provider';
import type { EventType } from '@/data/seed';
import { DeleteEventTypeDialog } from './delete-dialog';

interface EventTypeRowProps {
  eventType: EventType;
  username: string;
}

export function EventTypeRow({ eventType, username }: EventTypeRowProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDemo = pathname.startsWith('/demo');
  const data = useDataProvider();
  const { mutate: updateEventType } = data.useUpdateEventType();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const basePrefix = isDemo ? '/demo' : '';
  const bookingUrl = `${window.location.origin}/book/${username}/${eventType.slug}`;

  function handleCopyLink(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(bookingUrl);
    toast.success('Link copied');
  }

  function handleRowClick() {
    navigate(`${basePrefix}/event-types/${eventType.id}`);
  }

  function handleToggleActive(e: React.MouseEvent) {
    e.stopPropagation();
    updateEventType(eventType.id, { is_active: !eventType.is_active });
  }

  return (
    <>
      <div
        onClick={handleRowClick}
        className="flex cursor-pointer items-center gap-4 border-b border-border px-6 py-4 transition-colors last:border-b-0 hover:bg-muted/60"
      >
        <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
          <IconClock className="size-4" />
          <span className="text-sm tabular-nums">{eventType.duration_minutes} min</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{eventType.name}</p>
          {eventType.description && (
            <p className="text-sm text-muted-foreground">{eventType.description}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleToggleActive} className="cursor-pointer">
            <Badge color={eventType.is_active ? 'green' : 'gray'}>
              {eventType.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </button>

          <Button variant="ghost" size="sm" onClick={handleCopyLink}>
            <IconCopy className="size-4" />
            Copy link
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" aria-label={`More actions for ${eventType.name}`}>
                <IconDots className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`${basePrefix}/event-types/${eventType.id}?mode=edit`)}
              >
                <IconPencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(bookingUrl, '_blank')}
              >
                <IconExternalLink className="size-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <IconCopy className="size-4" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <IconTrash className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteEventTypeDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        eventTypeId={eventType.id}
      />
    </>
  );
}

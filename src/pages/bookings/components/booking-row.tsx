import { useState } from 'react';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/base/badge';
import { Button } from '@/components/base/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { CancelBookingDialog } from './cancel-booking-dialog';
import type { BookingWithEventType } from '@/data/seed';

interface BookingRowProps {
  booking: BookingWithEventType;
  tab: 'upcoming' | 'past' | 'cancelled';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }) + ', ' + d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).toLowerCase();
}

export function BookingRow({ booking, tab }: BookingRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/60"
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell className="w-8 pl-4 pr-0">
          {expanded ? (
            <IconChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <IconChevronRight className="size-4 text-muted-foreground" />
          )}
        </TableCell>
        <TableCell className="w-10 px-2">
          <Avatar className="size-9">
            {booking.guest_avatar_url && (
              <AvatarImage src={booking.guest_avatar_url} alt={booking.guest_name} />
            )}
            <AvatarFallback className="bg-sky-100 text-sky-700 text-xs font-medium dark:bg-sky-900 dark:text-sky-300">
              {getInitials(booking.guest_name)}
            </AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell>
          <div>
            <span className="text-sm font-semibold text-foreground">
              {booking.guest_name}
            </span>
            <span className="block text-sm text-muted-foreground">
              {booking.guest_email}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {booking.event_types?.name}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground text-right whitespace-nowrap">
          {formatDateTime(booking.start_time)}
        </TableCell>
        <TableCell className="text-right">
          <Badge color={tab === 'cancelled' ? 'gray' : 'green'}>
            {booking.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
          </Badge>
        </TableCell>
        <TableCell className="text-right pr-4">
          {tab === 'upcoming' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setCancelOpen(true);
              }}
            >
              Cancel
            </Button>
          )}
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="px-6 py-4">
            <div className="space-y-2 text-sm">
              {booking.guest_notes && (
                <div>
                  <span className="font-medium text-foreground">Notes:</span>{' '}
                  <span className="text-muted-foreground">{booking.guest_notes}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-foreground">Location:</span>{' '}
                <span className="text-muted-foreground">
                  {booking.event_types?.location_type === 'conferencing'
                    ? 'Conferencing link'
                    : booking.event_types?.location_value ?? 'Not specified'}
                </span>
              </div>
              {booking.event_types?.name && (
                <div>
                  <span className="font-medium text-foreground">Event type:</span>{' '}
                  <span className="text-muted-foreground">
                    {booking.event_types.name} ({booking.event_types.duration_minutes} min)
                  </span>
                </div>
              )}
              {tab === 'upcoming' && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCancelOpen(true);
                    }}
                  >
                    Cancel this booking
                  </Button>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
      <CancelBookingDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        booking={booking}
      />
    </>
  );
}

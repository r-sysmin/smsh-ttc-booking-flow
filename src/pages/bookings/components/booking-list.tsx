import { Table, TableBody } from '@/components/ui/table';
import { useDataProvider } from '@/lib/data-provider';
import { BookingRow } from './booking-row';
import { BookingsBlankslate } from './blankslate';
import { BookingsSkeleton } from './skeleton';

interface BookingListProps {
  tab: 'upcoming' | 'past' | 'cancelled';
}

export function BookingList({ tab }: BookingListProps) {
  const data = useDataProvider();
  const { data: bookings, isLoading } = data.useBookings(tab);

  if (isLoading) {
    return <BookingsSkeleton />;
  }

  if (bookings.length === 0) {
    return <BookingsBlankslate tab={tab} />;
  }

  return (
    <Table>
      <TableBody>
        {bookings.map((booking) => (
          <BookingRow key={booking.id} booking={booking} tab={tab} />
        ))}
      </TableBody>
    </Table>
  );
}

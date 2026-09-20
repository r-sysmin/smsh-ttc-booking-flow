import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataProvider } from '@/lib/data-provider';
import { BookingList } from './components/booking-list';

type BookingTab = 'upcoming' | 'past' | 'cancelled';

export default function BookingsPage() {
  const [tab, setTab] = useState<BookingTab>('upcoming');
  const data = useDataProvider();
  const counts = data.useBookingCounts();

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6 py-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Bookings
        </h2>

        <Tabs value={tab} onValueChange={(v) => setTab(v as BookingTab)}>
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming{counts.upcoming > 0 ? ` (${counts.upcoming})` : ''}
            </TabsTrigger>
            <TabsTrigger value="past">
              Past{counts.past > 0 ? ` (${counts.past})` : ''}
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled{counts.cancelled > 0 ? ` (${counts.cancelled})` : ''}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <BookingList tab="upcoming" />
          </TabsContent>
          <TabsContent value="past">
            <BookingList tab="past" />
          </TabsContent>
          <TabsContent value="cancelled">
            <BookingList tab="cancelled" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

import { useState, useEffect } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDataProvider } from '@/lib/data-provider';
import type { AvailabilityJson } from '@/data/seed';
import { TimezoneSelector } from './components/timezone-selector';
import { ScheduleGrid } from './components/schedule-grid';

const DEFAULT_AVAILABILITY: AvailabilityJson = {
  mon: [{ start: '09:00', end: '17:00' }],
  tue: [{ start: '09:00', end: '17:00' }],
  wed: [{ start: '09:00', end: '17:00' }],
  thu: [{ start: '09:00', end: '17:00' }],
  fri: [{ start: '09:00', end: '17:00' }],
  sat: null,
  sun: null,
};

export default function AvailabilityPage() {
  const data = useDataProvider();
  const { data: availabilityData, isLoading } = data.useAvailability();
  const { mutate: updateAvailability, isPending } = data.useUpdateAvailability();

  const [timezone, setTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [availability, setAvailability] = useState<AvailabilityJson>(DEFAULT_AVAILABILITY);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (availabilityData && !initialized) {
      setTimezone(availabilityData.timezone);
      setAvailability(availabilityData.availability);
      setInitialized(true);
    }
  }, [availabilityData, initialized]);

  function handleSave() {
    updateAvailability(timezone, availability);
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6 py-2">
          <div className="h-8 w-40 rounded bg-muted" />
          <div className="h-10 w-full rounded bg-muted" />
          <div className="space-y-0 rounded-lg border">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-4 w-4 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6 py-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Availability
        </h2>

        <TimezoneSelector value={timezone} onChange={setTimezone} />

        <ScheduleGrid
          availability={availability}
          onChange={setAvailability}
        />

        <Button onClick={handleSave} disabled={isPending}>
          Save schedule
        </Button>

        <Alert>
          <IconInfoCircle className="size-4" />
          <AlertDescription>
            This schedule applies to all your event types. Guests see available
            slots in their own timezone.
          </AlertDescription>
        </Alert>
      </div>
    </main>
  );
}

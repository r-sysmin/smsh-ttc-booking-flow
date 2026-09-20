import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { AvailabilityJson, TimeWindow } from '@/data/seed';

type DayKey = keyof AvailabilityJson;

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      options.push(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      );
    }
  }
  return options;
}

const ALL_TIMES = generateTimeOptions();

function getEndTimeOptions(startTime: string): string[] {
  const startIndex = ALL_TIMES.indexOf(startTime);
  if (startIndex === -1) return ALL_TIMES.slice(1);
  return ALL_TIMES.slice(startIndex + 1);
}

interface ScheduleGridProps {
  availability: AvailabilityJson;
  onChange: (availability: AvailabilityJson) => void;
}

export function ScheduleGrid({ availability, onChange }: ScheduleGridProps) {
  function handleToggleDay(day: DayKey, checked: boolean) {
    const updated = { ...availability };
    if (checked) {
      updated[day] = [{ start: '09:00', end: '17:00' }];
    } else {
      updated[day] = null;
    }
    onChange(updated);
  }

  function handleTimeChange(
    day: DayKey,
    field: keyof TimeWindow,
    value: string
  ) {
    const windows = availability[day];
    if (!windows || windows.length === 0) return;

    const window = { ...windows[0] };
    window[field] = value;

    if (field === 'start') {
      const endOptions = getEndTimeOptions(value);
      if (!endOptions.includes(window.end)) {
        window.end = endOptions[0] ?? '23:30';
      }
    }

    onChange({ ...availability, [day]: [window] });
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-muted-foreground">
        Weekly schedule
      </span>
      <Card>
        <CardContent className="divide-y p-0">
          {DAYS.map(({ key, label }) => {
            const windows = availability[key];
            const isEnabled = windows !== null && windows.length > 0;
            const window = isEnabled ? windows[0] : null;

            return (
              <div
                key={key}
                className="flex items-center gap-4 px-6 py-4"
              >
                <Checkbox
                  checked={isEnabled}
                  onCheckedChange={(checked) =>
                    handleToggleDay(key, checked === true)
                  }
                  aria-label={label}
                />
                <span className="w-28 text-sm font-semibold text-foreground">
                  {label}
                </span>
                {isEnabled && window ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={window.start}
                      onValueChange={(v) =>
                        handleTimeChange(key, 'start', v)
                      }
                    >
                      <SelectTrigger className="w-28" aria-label={`${label} start time`}>

                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_TIMES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">–</span>
                    <Select
                      value={window.end}
                      onValueChange={(v) =>
                        handleTimeChange(key, 'end', v)
                      }
                    >
                      <SelectTrigger className="w-28" aria-label={`${label} end time`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getEndTimeOptions(window.start).map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    (unavailable)
                  </span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

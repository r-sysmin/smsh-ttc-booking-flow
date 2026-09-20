import { Button } from '@/components/ui/button';
import { formatSlotTime } from '@/lib/slot-calculator';

interface TimeSlotButtonProps {
  start: Date;
  timezone: string;
  use24h: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function TimeSlotButton({ start, timezone, use24h, isSelected, onSelect }: TimeSlotButtonProps) {
  return (
    <Button
      variant={isSelected ? 'default' : 'outline'}
      className="w-full min-h-9 justify-center gap-2 rounded-lg tabular-nums"
      onClick={onSelect}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
      <span className="min-w-[4rem] text-center text-sm">{formatSlotTime(start, timezone, use24h)}</span>
    </Button>
  );
}

import { useState } from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatFullDate, formatTimeRange } from '@/lib/slot-calculator';

interface GuestFormProps {
  eventName: string;
  selectedSlot: { start: Date; end: Date };
  guestTimezone: string;
  use24h: boolean;
  onConfirm: (data: { name: string; email: string; notes: string }) => void;
  isPending: boolean;
}

export function GuestForm({
  eventName,
  selectedSlot,
  guestTimezone,
  use24h,
  onConfirm,
  isPending,
}: GuestFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onConfirm({ name: name.trim(), email: email.trim(), notes: notes.trim() });
  };

  return (
    <div className="flex items-start justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">{eventName}</h2>
          <p className="text-sm text-muted-foreground">
            {formatFullDate(selectedSlot.start, guestTimezone)} ·{' '}
            {formatTimeRange(selectedSlot.start, selectedSlot.end, guestTimezone, use24h)}
          </p>
          <p className="text-sm text-muted-foreground">
            {guestTimezone.replace(/_/g, ' ')}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guest-name">Your name *</Label>
            <Input
              id="guest-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Sofia Mendez"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-email">Email address *</Label>
            <Input
              id="guest-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="sofia@acme.co"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-notes">Additional notes (optional)</Label>
            <Textarea
              id="guest-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you'd like me to know?"
              rows={3}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <IconLoader2 className="size-4 animate-spin" />}
          Confirm booking
        </Button>
      </form>
    </div>
  );
}

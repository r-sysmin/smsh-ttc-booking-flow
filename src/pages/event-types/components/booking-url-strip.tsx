import { IconCopy, IconArrowRight } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface BookingUrlStripProps {
  username: string;
}

export function BookingUrlStrip({ username }: BookingUrlStripProps) {
  const displayUrl = `${window.location.host}/book/${username}`;
  const fullUrl = `${window.location.origin}/book/${username}`;

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied');
  }

  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5 text-sm text-muted-foreground">
      <span className="flex-1">Your booking page: {displayUrl}</span>
      <Button variant="ghost" size="icon" className="size-8" onClick={handleCopy} aria-label="Copy booking page link">
        <IconCopy className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => window.open(fullUrl, '_blank')}
        aria-label="Open booking page in new tab"
      >
        <IconArrowRight className="size-4" />
      </Button>
    </div>
  );
}

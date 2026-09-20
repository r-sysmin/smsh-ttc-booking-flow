import { IconPlus } from '@tabler/icons-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/base/button';

interface EventTypesBlankslateProps {
  onCreateNew: () => void;
}

export function EventTypesBlankslate({ onCreateNew }: EventTypesBlankslateProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none space-y-3 p-6" aria-hidden>
        <div className="h-4 w-3/4 rounded bg-accent" />
        <div className="h-4 w-1/2 rounded bg-accent" />
        <div className="h-4 w-2/3 rounded bg-accent" />
        <div className="h-4 w-1/2 rounded bg-accent" />
        <div className="h-4 w-3/5 rounded bg-accent" />
        <div className="h-4 w-2/5 rounded bg-accent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-0 flex items-start justify-center pt-[10%]">
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <IconPlus className="size-5 text-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">No event types yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first event type to start sharing your booking link.
              </p>
            </div>
            <Button onClick={onCreateNew}>
              <IconPlus className="size-4" />
              New event type
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

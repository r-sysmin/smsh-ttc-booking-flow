import { Card } from '@/components/ui/card';

export function EventTypesSkeleton() {
  const bar = 'rounded bg-accent h-4';
  return (
    <Card className="divide-y divide-border overflow-hidden">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4">
          <div className="flex shrink-0 items-center gap-1.5">
            <div className="size-4 rounded bg-accent" />
            <div className={`${bar} w-12`} />
          </div>
          <div className="flex-1 space-y-2">
            <div className={`${bar} w-48`} />
            <div className={`${bar} w-64`} />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-14 rounded-full bg-accent" />
            <div className={`${bar} w-20`} />
            <div className="size-8 rounded bg-accent" />
          </div>
        </div>
      ))}
    </Card>
  );
}

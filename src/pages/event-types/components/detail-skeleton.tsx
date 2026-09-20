import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DetailSkeleton() {
  return (
    <Card className="[&]:shadow-none">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 p-6">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-64 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-9 w-16 rounded-full bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="mb-6 h-px w-full bg-border" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-baseline gap-4">
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="h-4 w-36 rounded bg-muted" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

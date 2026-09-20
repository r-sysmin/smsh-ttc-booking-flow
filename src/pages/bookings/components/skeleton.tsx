export function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <div className="size-9 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-3 w-1/4 rounded bg-muted" />
          </div>
          <div className="h-4 w-1/5 rounded bg-muted" />
          <div className="h-4 w-1/6 rounded bg-muted" />
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

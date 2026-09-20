import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDataProvider } from '@/lib/data-provider';
import { ProfileCard } from './components/profile-card';
import { EventTypeList } from './components/event-type-list';

export default function PublicBookingIndexPage() {
  const { username = '' } = useParams<{ username: string }>();
  const dp = useDataProvider();
  const { data: profile, isLoading: profileLoading } = dp.usePublicProfile(username);
  const { data: eventTypes, isLoading: eventTypesLoading } = dp.usePublicEventTypes(username);

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-full bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-48 rounded bg-muted" />
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-lg font-semibold">User not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This booking page doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <ProfileCard profile={profile} />
        </div>
        <Separator />
        <EventTypeList
          eventTypes={eventTypes}
          username={username}
          isLoading={eventTypesLoading}
        />
      </Card>
      <p className="mt-6 text-xs text-muted-foreground">Powered by Meeting Booker</p>
    </div>
  );
}

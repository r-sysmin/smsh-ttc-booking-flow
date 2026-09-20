import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { PublicProfile } from '@/data/seed';

interface ProfileCardProps {
  profile: PublicProfile;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Avatar className="h-16 w-16">
        {profile.avatar_url && (
          <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
        )}
        <AvatarFallback className="text-lg font-medium">
          {getInitials(profile.full_name)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-semibold">{profile.full_name}</h2>
        {profile.bio && (
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}

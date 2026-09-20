import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataProvider } from '@/lib/data-provider';
import { IconLoader2 } from '@tabler/icons-react';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ProfileTab() {
  const data = useDataProvider();
  const { data: profile, isLoading } = data.useProfile();
  const { mutate: updateProfile, isPending } = data.useUpdateProfile();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [conferencingUrl, setConferencingUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [initialized, setInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && !initialized) {
      setFullName(profile.full_name ?? '');
      setUsername(profile.username ?? '');
      setBio(profile.bio ?? '');
      setConferencingUrl(profile.conferencing_url ?? '');
      setAvatarPreview(profile.avatar_url);
      setInitialized(true);
    }
  }, [profile, initialized]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    updateProfile(
      {
        full_name: fullName,
        username,
        bio: bio || null,
        conferencing_url: conferencingUrl || null,
      },
      avatarFile ?? undefined,
    );
    setAvatarFile(null);
  }

  if (isLoading) {
    return (
      <Card className="[&]:shadow-none">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-muted" />
            <div className="h-9 w-28 rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-20 w-full rounded bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="[&]:shadow-none">
      <CardContent className="space-y-6 p-6">
        <div>
          <Label className="text-sm font-medium">Avatar</Label>
          <div className="mt-2 flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={avatarPreview ?? undefined} alt={fullName} />
              <AvatarFallback className="text-lg">
                {getInitials(fullName || 'U')}
              </AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload photo
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display-name">Display name</Label>
          <Input
            id="display-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            book/{username || '[username]'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio (optional)</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conferencing-url">Conferencing URL (optional)</Label>
          <Input
            id="conferencing-url"
            value={conferencingUrl}
            onChange={(e) => setConferencingUrl(e.target.value)}
            placeholder="e.g. https://zoom.us/j/your-meeting"
          />
          <p className="text-sm text-muted-foreground">
            Paste your Zoom, Meet, or Teams link once. It appears on every
            booking confirmation.
          </p>
        </div>

        <Button onClick={handleSave} disabled={isPending}>
          {isPending && <IconLoader2 className="size-4 animate-spin" />}
          Save profile
        </Button>
      </CardContent>
    </Card>
  );
}

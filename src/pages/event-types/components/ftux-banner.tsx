import { Link, useLocation } from 'react-router-dom';
import { IconInfoCircle } from '@tabler/icons-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDataProvider } from '@/lib/data-provider';

export function FtuxBanner() {
  const { pathname } = useLocation();
  const isDemo = pathname.startsWith('/demo');
  const data = useDataProvider();
  const { data: profile, isLoading } = data.useProfile();

  if (isLoading) return null;
  if (!profile) return null;
  if (profile.full_name && profile.conferencing_url) return null;

  const settingsHref = isDemo ? '/demo/settings' : '/settings';

  return (
    <Alert>
      <IconInfoCircle className="size-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Complete your profile to make your booking page look great.</span>
        <Link
          to={settingsHref}
          className="shrink-0 font-medium text-foreground underline underline-offset-4"
        >
          Go to Settings
        </Link>
      </AlertDescription>
    </Alert>
  );
}

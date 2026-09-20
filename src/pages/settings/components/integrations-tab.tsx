import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { IconBrandGoogle, IconCheck, IconExternalLink } from '@tabler/icons-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/auth-provider';

interface Connection {
  user_id: string;
  google_email: string | null;
  connected_at: string;
}

export function IntegrationsTab() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: connection, isLoading } = useQuery({
    queryKey: ['calendar_connection', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_connections')
        .select('user_id, google_email, connected_at')
        .eq('user_id', user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Connection | null;
    },
    enabled: !!user,
  });

  // Handle callback query params (?google=connected|error|no_refresh).
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('google');
    if (!status) return;
    if (status === 'connected') toast.success('Google Calendar connected');
    else if (status === 'no_refresh')
      toast.error(
        "Google didn't return a refresh token. Remove app access at myaccount.google.com then retry.",
      );
    else toast.error("Couldn't connect Google Calendar. Try again.");
    // Clear the query param and refresh state.
    queryClient.invalidateQueries({ queryKey: ['calendar_connection', user?.id] });
    navigate(location.pathname, { replace: true });
  }, [location.search, location.pathname, navigate, queryClient, user?.id]);

  const connectMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('google-calendar-connect', {
        body: { return_to: '/settings' },
      });
      if (error) throw error;
      if (!data?.url) throw new Error('No auth URL returned');
      window.location.href = data.url as string;
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to start Google auth');
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('calendar_connections')
        .delete()
        .eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Google Calendar disconnected');
      queryClient.invalidateQueries({ queryKey: ['calendar_connection', user?.id] });
    },
    onError: () => toast.error('Failed to disconnect'),
  });

  return (
    <Card className="[&]:shadow-none">
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Calendars</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect a calendar so busy times block your booking page and new bookings appear on
            your calendar with a Google Meet link.
          </p>
        </div>

        <Separator />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-md border p-2">
              <IconBrandGoogle className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">Google Calendar</p>
                {connection && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    <IconCheck className="size-3" />
                    Connected
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {isLoading
                  ? 'Loading…'
                  : connection
                    ? connection.google_email ?? 'Connected'
                    : 'Block busy times and auto-create Google Meet events.'}
              </p>
            </div>
          </div>

          {connection ? (
            <Button
              variant="outline"
              onClick={() => disconnectMutation.mutate()}
              disabled={disconnectMutation.isPending}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={() => connectMutation.mutate()}
              disabled={connectMutation.isPending}
            >
              Connect
              <IconExternalLink className="size-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

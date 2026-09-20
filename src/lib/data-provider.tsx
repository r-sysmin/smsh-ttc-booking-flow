import { createContext, useContext, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/auth-provider';
import * as seed from '@/data/seed';
import type {
  EventType,
  Booking,
  BookingWithEventType,
  Profile,
  PublicProfile,
  AvailabilityJson,
  CreateBookingInput,
} from '@/data/seed';

// ── Provider interface ──

export interface CalendlyDataProvider {
  useEventTypes(): { data: EventType[]; isLoading: boolean };
  useEventType(id: string): { data: EventType | null; isLoading: boolean };
  useCreateEventType(): { mutate: () => Promise<{ id: string } | null>; isPending: boolean };
  useUpdateEventType(): { mutate: (id: string, fields: Partial<EventType>) => Promise<EventType>; isPending: boolean };
  useDeleteEventType(): { mutate: (id: string) => void; isPending: boolean };

  useBookings(tab: 'upcoming' | 'past' | 'cancelled'): { data: BookingWithEventType[]; isLoading: boolean };
  useBookingCounts(): { upcoming: number; past: number; cancelled: number; isLoading: boolean };
  useCancelBooking(): { mutate: (id: string) => void; isPending: boolean };

  useProfile(): { data: Profile | null; isLoading: boolean };
  useUpdateProfile(): { mutate: (fields: Partial<Profile>, avatarFile?: File) => void; isPending: boolean };

  useAvailability(): { data: { timezone: string; availability: AvailabilityJson } | null; isLoading: boolean };
  useUpdateAvailability(): { mutate: (timezone: string, availability: AvailabilityJson) => void; isPending: boolean };

  usePublicProfile(username: string): { data: PublicProfile | null; isLoading: boolean };
  usePublicEventTypes(username: string): { data: EventType[]; isLoading: boolean };
  usePublicEventType(username: string, slug: string): { data: EventType | null; isLoading: boolean };
  usePublicBookings(eventTypeId: string): { data: { start_time: string; end_time: string }[]; isLoading: boolean };
  useHostBusyTimes(hostUserId: string | undefined): { data: { start_time: string; end_time: string }[]; isLoading: boolean };
  useCreateBooking(): { mutate: (input: CreateBookingInput) => Promise<Booking | null>; isPending: boolean };
}

const DataProviderContext = createContext<CalendlyDataProvider | null>(null);

export function useDataProvider(): CalendlyDataProvider {
  const ctx = useContext(DataProviderContext);
  if (!ctx) throw new Error('useDataProvider must be inside a DataProvider');
  return ctx;
}

// ── SeedDataProvider ──

export function SeedDataProvider({ children }: { children: ReactNode }) {
  const provider: CalendlyDataProvider = {
    useEventTypes: () => ({
      data: [...seed.eventTypes].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
      isLoading: false,
    }),

    useEventType: (id: string) => ({
      data: seed.eventTypes.find((e) => e.id === id) ?? null,
      isLoading: false,
    }),

    useCreateEventType: () => ({
      mutate: async () => {
        toast('Sign in to save changes');
        return null;
      },
      isPending: false,
    }),

    useUpdateEventType: () => ({
      mutate: async () => {
        toast('Sign in to save changes');
        throw new Error('not authenticated');
      },
      isPending: false,
    }),

    useDeleteEventType: () => ({
      mutate: () => toast('Sign in to save changes'),
      isPending: false,
    }),

    useBookings: (tab: 'upcoming' | 'past' | 'cancelled') => {
      const now = new Date().toISOString();
      let filtered: BookingWithEventType[];
      if (tab === 'upcoming') {
        filtered = seed.bookings
          .filter((b) => b.status === 'confirmed' && b.start_time > now)
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
      } else if (tab === 'past') {
        filtered = seed.bookings
          .filter((b) => b.status === 'confirmed' && b.start_time <= now)
          .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
      } else {
        filtered = seed.bookings
          .filter((b) => b.status === 'cancelled')
          .sort((a, b) => {
            const aTime = a.cancelled_at ? new Date(a.cancelled_at).getTime() : 0;
            const bTime = b.cancelled_at ? new Date(b.cancelled_at).getTime() : 0;
            return bTime - aTime;
          });
      }
      return { data: filtered, isLoading: false };
    },

    useBookingCounts: () => {
      const now = new Date().toISOString();
      return {
        upcoming: seed.bookings.filter((b) => b.status === 'confirmed' && b.start_time > now).length,
        past: seed.bookings.filter((b) => b.status === 'confirmed' && b.start_time <= now).length,
        cancelled: seed.bookings.filter((b) => b.status === 'cancelled').length,
        isLoading: false,
      };
    },

    useCancelBooking: () => ({
      mutate: () => toast('Sign in to save changes'),
      isPending: false,
    }),

    useProfile: () => ({
      data: seed.profile,
      isLoading: false,
    }),

    useUpdateProfile: () => ({
      mutate: () => toast('Sign in to save changes'),
      isPending: false,
    }),

    useAvailability: () => ({
      data: { timezone: seed.profile.timezone, availability: seed.profile.availability },
      isLoading: false,
    }),

    useUpdateAvailability: () => ({
      mutate: () => toast('Sign in to save changes'),
      isPending: false,
    }),

    usePublicProfile: (username: string) => ({
      data: username === 'demo' ? seed.profile : null,
      isLoading: false,
    }),

    usePublicEventTypes: (username: string) => ({
      data:
        username === 'demo'
          ? seed.eventTypes
              .filter((e) => e.is_active)
              .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          : [],
      isLoading: false,
    }),

    usePublicEventType: (_username: string, slug: string) => ({
      data: seed.eventTypes.find((e) => e.slug === slug && e.is_active) ?? null,
      isLoading: false,
    }),

    usePublicBookings: (eventTypeId: string) => {
      const now = new Date().toISOString();
      return {
        data: seed.bookings
          .filter(
            (b) =>
              b.event_type_id === eventTypeId &&
              b.status === 'confirmed' &&
              b.start_time >= now,
          )
          .map((b) => ({ start_time: b.start_time, end_time: b.end_time }))
          .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()),
        isLoading: false,
      };
    },

    useHostBusyTimes: () => ({ data: [], isLoading: false }),

    useCreateBooking: () => ({
      mutate: async () => {
        toast('Sign in to save real bookings');
        return null;
      },
      isPending: false,
    }),
  };

  return (
    <DataProviderContext.Provider value={provider}>{children}</DataProviderContext.Provider>
  );
}

// ── SupabaseDataProvider ──

export function SupabaseDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const provider: CalendlyDataProvider = {
    useEventTypes: () => {
      const { data, isLoading } = useQuery({
        queryKey: ['event_types', user?.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('event_types')
            .select('id, name, slug, duration_minutes, description, location_type, location_value, is_active, created_at, user_id')
            .eq('user_id', user!.id)
            .order('created_at', { ascending: false });
          if (error) throw error;
          return (data ?? []) as EventType[];
        },
        enabled: !!user,
      });
      return { data: data ?? [], isLoading };
    },

    useEventType: (id: string) => {
      const { data, isLoading } = useQuery({
        queryKey: ['event_type', id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('event_types')
            .select('id, name, slug, duration_minutes, description, location_type, location_value, is_active, created_at, user_id')
            .eq('id', id)
            .eq('user_id', user!.id)
            .single();
          if (error) throw error;
          return data as EventType;
        },
        enabled: !!user && !!id,
      });
      return { data: data ?? null, isLoading };
    },

    useCreateEventType: () => {
      const mutation = useMutation({
        mutationFn: async () => {
          const { data, error } = await supabase
            .from('event_types')
            .insert({
              user_id: user!.id,
              name: '',
              slug: '',
              duration_minutes: 30,
              description: null,
              location_type: 'conferencing',
              location_value: null,
              is_active: true,
            })
            .select()
            .single();
          if (error) throw error;
          return data as EventType;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['event_types', user?.id] });
        },
      });
      return {
        mutate: async () => {
          const result = await mutation.mutateAsync();
          return result ? { id: result.id } : null;
        },
        isPending: mutation.isPending,
      };
    },

    useUpdateEventType: () => {
      const mutation = useMutation({
        mutationFn: async ({ id, fields }: { id: string; fields: Partial<EventType> }) => {
          const { data, error } = await supabase
            .from('event_types')
            .update({
              name: fields.name,
              slug: fields.slug,
              duration_minutes: fields.duration_minutes,
              description: fields.description,
              location_type: fields.location_type,
              location_value: fields.location_value,
              is_active: fields.is_active,
            })
            .eq('id', id)
            .eq('user_id', user!.id)
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onMutate: async ({ id, fields }) => {
          await queryClient.cancelQueries({ queryKey: ['event_types', user?.id] });
          await queryClient.cancelQueries({ queryKey: ['event_type', id] });

          const prevList = queryClient.getQueryData<EventType[]>(['event_types', user?.id]);
          const prevDetail = queryClient.getQueryData<EventType>(['event_type', id]);

          if (prevList) {
            queryClient.setQueryData<EventType[]>(
              ['event_types', user?.id],
              prevList.map((et) => (et.id === id ? { ...et, ...fields } : et)),
            );
          }
          if (prevDetail) {
            queryClient.setQueryData<EventType>(['event_type', id], { ...prevDetail, ...fields });
          }

          return { prevList, prevDetail };
        },
        onError: (_err, { id }, context) => {
          if (context?.prevList) {
            queryClient.setQueryData(['event_types', user?.id], context.prevList);
          }
          if (context?.prevDetail) {
            queryClient.setQueryData(['event_type', id], context.prevDetail);
          }
        },
        onSettled: (_data, _error, { id }) => {
          queryClient.invalidateQueries({ queryKey: ['event_types', user?.id] });
          queryClient.invalidateQueries({ queryKey: ['event_type', id] });
        },
      });
      return {
        mutate: (id: string, fields: Partial<EventType>) => mutation.mutateAsync({ id, fields }),
        isPending: mutation.isPending,
      };
    },

    useDeleteEventType: () => {
      const mutation = useMutation({
        mutationFn: async (id: string) => {
          const { error } = await supabase
            .from('event_types')
            .delete()
            .eq('id', id)
            .eq('user_id', user!.id);
          if (error) throw error;
        },
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: ['event_types', user?.id] });
          const prevList = queryClient.getQueryData<EventType[]>(['event_types', user?.id]);
          if (prevList) {
            queryClient.setQueryData<EventType[]>(
              ['event_types', user?.id],
              prevList.filter((et) => et.id !== id),
            );
          }
          return { prevList };
        },
        onError: (_err, _id, context) => {
          if (context?.prevList) {
            queryClient.setQueryData(['event_types', user?.id], context.prevList);
          }
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ['event_types', user?.id] });
        },
      });
      return {
        mutate: (id: string) => mutation.mutate(id),
        isPending: mutation.isPending,
      };
    },

    useBookings: (tab: 'upcoming' | 'past' | 'cancelled') => {
      const { data, isLoading } = useQuery({
        queryKey: ['bookings', user?.id, tab],
        queryFn: async () => {
          const now = new Date().toISOString();
          let query = supabase
            .from('bookings')
            .select(`
              id, guest_name, guest_email, guest_notes,
              start_time, end_time, status, cancelled_at, created_at,
              event_type_id, host_user_id,
              event_types (id, name, duration_minutes, location_type, location_value)
            `)
            .eq('host_user_id', user!.id);

          if (tab === 'upcoming') {
            query = query
              .eq('status', 'confirmed')
              .gt('start_time', now)
              .order('start_time', { ascending: true });
          } else if (tab === 'past') {
            query = query
              .eq('status', 'confirmed')
              .lte('start_time', now)
              .order('start_time', { ascending: false });
          } else {
            query = query
              .eq('status', 'cancelled')
              .order('cancelled_at', { ascending: false });
          }

          const { data, error } = await query;
          if (error) throw error;
          return (data ?? []) as unknown as BookingWithEventType[];
        },
        enabled: !!user,
      });
      return { data: data ?? [], isLoading };
    },

    useBookingCounts: () => {
      const { data, isLoading } = useQuery({
        queryKey: ['booking_counts', user?.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('bookings')
            .select('id, status, start_time')
            .eq('host_user_id', user!.id);
          if (error) throw error;

          const now = new Date().toISOString();
          const rows = data ?? [];
          return {
            upcoming: rows.filter((b) => b.status === 'confirmed' && b.start_time > now).length,
            past: rows.filter((b) => b.status === 'confirmed' && b.start_time <= now).length,
            cancelled: rows.filter((b) => b.status === 'cancelled').length,
          };
        },
        enabled: !!user,
      });
      return {
        upcoming: data?.upcoming ?? 0,
        past: data?.past ?? 0,
        cancelled: data?.cancelled ?? 0,
        isLoading,
      };
    },

    useCancelBooking: () => {
      const mutation = useMutation({
        mutationFn: async (id: string) => {
          const { error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
            .eq('id', id)
            .eq('host_user_id', user!.id);
          if (error) throw error;
          try {
            await supabase.functions.invoke('google-calendar-sync-booking', {
              body: { action: 'cancel', booking_id: id },
            });
          } catch (e) {
            console.warn('Calendar cancel sync failed', e);
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['bookings', user?.id, 'upcoming'] });
          queryClient.invalidateQueries({ queryKey: ['bookings', user?.id, 'cancelled'] });
          queryClient.invalidateQueries({ queryKey: ['booking_counts', user?.id] });
          queryClient.invalidateQueries({ queryKey: ['host_busy_times', user?.id] });
          toast.success('Booking cancelled');
        },
      });
      return {
        mutate: (id: string) => mutation.mutate(id),
        isPending: mutation.isPending,
      };
    },

    useProfile: () => {
      const { data, isLoading } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, username, bio, avatar_url, conferencing_url, timezone, availability')
            .eq('id', user!.id)
            .single();
          if (error) throw error;
          return data as Profile;
        },
        enabled: !!user,
      });
      return { data: data ?? null, isLoading };
    },

    useUpdateProfile: () => {
      const mutation = useMutation({
        mutationFn: async ({ fields, avatarFile }: { fields: Partial<Profile>; avatarFile?: File }) => {
          let avatarUrl: string | undefined;

          if (avatarFile) {
            const ext = avatarFile.name.split('.').pop() ?? 'jpg';
            const path = `${user!.id}/avatar.${ext}`;
            const { error: storageError } = await supabase.storage
              .from('avatars')
              .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });

            if (storageError) {
              toast.error("Couldn't upload photo — please try again.");
              throw storageError;
            }
            // Bucket is private (workspace policy blocks public buckets), so
            // mint a long-lived signed URL that anon visitors on the booking
            // page can load. Signed URLs bypass RLS.
            const { data: signed, error: signErr } = await supabase.storage
              .from('avatars')
              .createSignedUrl(path, 60 * 60 * 24 * 365 * 10); // 10 years
            if (signErr || !signed) {
              toast.error("Couldn't finalize photo upload.");
              throw signErr ?? new Error('sign url failed');
            }
            avatarUrl = signed.signedUrl;
          }

          const { error } = await supabase
            .from('profiles')
            .update({
              full_name: fields.full_name,
              username: fields.username,
              bio: fields.bio,
              conferencing_url: fields.conferencing_url,
              ...(avatarUrl !== undefined && { avatar_url: avatarUrl }),
            })
            .eq('id', user!.id);
          if (error) throw error;
        },
        onMutate: async ({ fields }) => {
          await queryClient.cancelQueries({ queryKey: ['profile', user?.id] });
          const prev = queryClient.getQueryData<Profile>(['profile', user?.id]);
          if (prev) {
            queryClient.setQueryData<Profile>(['profile', user?.id], { ...prev, ...fields });
          }
          return { prev };
        },
        onError: (_err, _vars, context) => {
          if (context?.prev) {
            queryClient.setQueryData(['profile', user?.id], context.prev);
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
          toast.success('Profile saved');
        },
      });
      return {
        mutate: (fields: Partial<Profile>, avatarFile?: File) =>
          mutation.mutate({ fields, avatarFile }),
        isPending: mutation.isPending,
      };
    },

    useAvailability: () => {
      const { data, isLoading } = useQuery({
        queryKey: ['availability', user?.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('timezone, availability')
            .eq('id', user!.id)
            .single();
          if (error) throw error;
          return data as { timezone: string; availability: AvailabilityJson };
        },
        enabled: !!user,
      });
      return { data: data ?? null, isLoading };
    },

    useUpdateAvailability: () => {
      const mutation = useMutation({
        mutationFn: async ({ timezone, availability }: { timezone: string; availability: AvailabilityJson }) => {
          const { error } = await supabase
            .from('profiles')
            .update({ timezone, availability })
            .eq('id', user!.id);
          if (error) throw error;
        },
        onMutate: async ({ timezone, availability }) => {
          await queryClient.cancelQueries({ queryKey: ['availability', user?.id] });
          const prev = queryClient.getQueryData<{ timezone: string; availability: AvailabilityJson }>(['availability', user?.id]);
          queryClient.setQueryData(['availability', user?.id], { timezone, availability });
          return { prev };
        },
        onError: (_err, _vars, context) => {
          if (context?.prev) {
            queryClient.setQueryData(['availability', user?.id], context.prev);
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['availability', user?.id] });
          queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
          toast.success('Schedule saved');
        },
      });
      return {
        mutate: (timezone: string, availability: AvailabilityJson) =>
          mutation.mutate({ timezone, availability }),
        isPending: mutation.isPending,
      };
    },

    usePublicProfile: (username: string) => {
      const { data, isLoading } = useQuery({
        queryKey: ['public_profile', username],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, username, bio, avatar_url, conferencing_url, timezone, availability')
            .ilike('username', username)
            .maybeSingle();
          if (error) throw error;
          return (data ?? null) as PublicProfile | null;
        },
        enabled: !!username,
        retry: false,
      });
      return { data: data ?? null, isLoading };
    },

    usePublicEventTypes: (username: string) => {
      const { data, isLoading } = useQuery({
        queryKey: ['public_event_types', username],
        queryFn: async () => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .ilike('username', username)
            .maybeSingle();
          if (profileError) throw profileError;
          if (!profileData) return [];

          const { data, error } = await supabase
            .from('event_types')
            .select('id, name, slug, duration_minutes, description, location_type, location_value, is_active, created_at, user_id')
            .eq('user_id', profileData.id)
            .eq('is_active', true)
            .order('created_at', { ascending: true });
          if (error) throw error;
          return (data ?? []) as EventType[];
        },
        enabled: !!username,
        retry: false,
      });
      return { data: data ?? [], isLoading };
    },

    usePublicEventType: (username: string, slug: string) => {
      const { data, isLoading } = useQuery({
        queryKey: ['public_event_type', username, slug],
        queryFn: async () => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .ilike('username', username)
            .maybeSingle();
          if (profileError) throw profileError;
          if (!profileData) return null;

          const { data, error } = await supabase
            .from('event_types')
            .select('id, name, slug, duration_minutes, description, location_type, location_value, is_active, created_at, user_id')
            .eq('user_id', profileData.id)
            .eq('slug', slug)
            .eq('is_active', true)
            .maybeSingle();
          if (error) throw error;
          return (data ?? null) as EventType | null;
        },
        enabled: !!username && !!slug,
        retry: false,
      });
      return { data: data ?? null, isLoading };
    },

    usePublicBookings: (eventTypeId: string) => {
      const { data, isLoading } = useQuery({
        queryKey: ['public_bookings', eventTypeId],
        queryFn: async () => {
          const now = new Date();
          const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

          const { data, error } = await supabase
            .from('bookings')
            .select('start_time, end_time')
            .eq('event_type_id', eventTypeId)
            .eq('status', 'confirmed')
            .gte('start_time', now.toISOString())
            .lte('start_time', sixtyDaysLater.toISOString())
            .order('start_time', { ascending: true });
          if (error) throw error;
          return (data ?? []) as { start_time: string; end_time: string }[];
        },
        enabled: !!eventTypeId,
      });
      return { data: data ?? [], isLoading };
    },

    useHostBusyTimes: (hostUserId: string | undefined) => {
      const { data, isLoading } = useQuery({
        queryKey: ['host_busy_times', hostUserId],
        queryFn: async () => {
          const now = new Date();
          const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
          const { data, error } = await supabase.functions.invoke('google-calendar-freebusy', {
            body: {
              host_user_id: hostUserId,
              time_min: now.toISOString(),
              time_max: sixtyDaysLater.toISOString(),
              timezone: 'UTC',
            },
          });
          if (error) {
            // Non-fatal: treat as no busy times.
            return [] as { start_time: string; end_time: string }[];
          }
          const busy = (data?.busy ?? []) as { start: string; end: string }[];
          return busy.map((b) => ({ start_time: b.start, end_time: b.end }));
        },
        enabled: !!hostUserId,
        staleTime: 30_000,
        retry: false,
      });
      return { data: data ?? [], isLoading };
    },

    useCreateBooking: () => {
      const mutation = useMutation({
        mutationFn: async (input: CreateBookingInput) => {
          const { data, error } = await supabase
            .from('bookings')
            .insert({
              event_type_id: input.event_type_id,
              host_user_id: input.host_user_id,
              guest_name: input.guest_name,
              guest_email: input.guest_email,
              guest_notes: input.guest_notes ?? null,
              start_time: input.start_time,
              end_time: input.end_time,
              status: 'confirmed',
            })
            .select()
            .single();
          if (error) throw error;

          const booking = data as Booking;

          // Fire-and-forget Google Calendar sync. Non-fatal.
          try {
            const { data: syncData } = await supabase.functions.invoke(
              'google-calendar-sync-booking',
              { body: { action: 'create', booking_id: booking.id } },
            );
            if (syncData?.meet_link) booking.meet_link = syncData.meet_link;
            if (syncData?.google_event_id) booking.google_event_id = syncData.google_event_id;
          } catch (e) {
            console.warn('Calendar sync failed', e);
          }

          return booking;
        },
        onSuccess: (_data, variables) => {
          queryClient.invalidateQueries({
            queryKey: ['public_bookings', variables.event_type_id],
          });
          queryClient.invalidateQueries({
            queryKey: ['host_busy_times', variables.host_user_id],
          });
        },
      });
      return {
        mutate: async (input: CreateBookingInput) => {
          const result = await mutation.mutateAsync(input);
          return result ?? null;
        },
        isPending: mutation.isPending,
      };
    },
  };

  return (
    <DataProviderContext.Provider value={provider}>{children}</DataProviderContext.Provider>
  );
}

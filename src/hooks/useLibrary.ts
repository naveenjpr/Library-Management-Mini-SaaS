'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface LibraryStats {
  totalSeats: number;
  availableSeats: number;
  totalMembers: number;
  todayBookings: number;
}

export function useLibrary() {
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch seats
      const { data: seats, error: seatsError } = await supabase
        .from('seats')
        .select('*');

      if (seatsError) throw seatsError;

      // Fetch members
      const { data: members, error: membersError } = await supabase
        .from('members')
        .select('*');

      if (membersError) throw membersError;

      // Fetch today's bookings
      const today = new Date().toISOString().split('T')[0];
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('date', today);

      if (bookingsError) throw bookingsError;

      const availableSeats = seats?.filter(s => s.status === 'available').length || 0;

      setStats({
        totalSeats: seats?.length || 0,
        availableSeats,
        totalMembers: members?.length || 0,
        todayBookings: bookings?.length || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
}

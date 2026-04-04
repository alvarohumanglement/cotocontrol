import { useEffect, useState, useCallback, useId } from 'react';
import { supabase } from '../lib/supabase';
import { BANCALES } from '../lib/constants';
import type { Bancal, BancalStatus } from '../lib/types';

export function useBancales() {
  const channelId = useId();
  const [bancales, setBancales] = useState<Bancal[]>(supabase ? [] : BANCALES);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('bancales')
      .select('*')
      .order('id');
    if (err) {
      setError(err.message);
      // Fallback to local on error
      setBancales(BANCALES);
    } else {
      setBancales(data as Bancal[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();

    if (!supabase) return;

    const channel = supabase
      .channel(`bancales-${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bancales' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, [fetchData, channelId]);

  const updateBancalStatus = async (id: string, status: BancalStatus) => {
    if (!supabase) {
      setBancales((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
      return;
    }
    const { error: err } = await supabase
      .from('bancales')
      .update({ status })
      .eq('id', id);
    if (err) setError(err.message);
  };

  return { bancales, loading, error, updateBancalStatus, refetch: fetchData };
}

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { BANCALES } from '../lib/constants';
import type { Bancal, BancalStatus } from '../lib/types';

export function useBancales() {
  const [bancales, setBancales] = useState<Bancal[]>(BANCALES);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!supabase) return;
    const { data, error: err } = await supabase
      .from('bancales')
      .select('*')
      .order('id');
    if (err) {
      setError(err.message);
    } else if (data) {
      setBancales(data as Bancal[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();

    if (!supabase) return;

    const channel = supabase
      .channel('bancales-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bancales' }, () => {
        fetch();
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, [fetch]);

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

  return { bancales, loading, error, updateBancalStatus, refetch: fetch };
}

import { useEffect, useState, useCallback, useId } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_PLANTINGS } from '../lib/constants';
import type { Planting } from '../lib/types';
export function usePlantings(bancalId?: string) {
  const channelId = useId();
  const fallback = bancalId
    ? MOCK_PLANTINGS.filter((p) => p.bancal_id === bancalId)
    : MOCK_PLANTINGS;
  const [plantings, setPlantings] = useState<Planting[]>(supabase ? [] : fallback);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!supabase) return;
    let query = supabase.from('plantings').select('*').order('created_at', { ascending: false });
    if (bancalId) query = query.eq('bancal_id', bancalId);
    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
      setPlantings(fallback);
    } else {
      setPlantings(data as Planting[]);
      setError(null);
    }
    setLoading(false);
  }, [bancalId]);

  useEffect(() => {
    fetchData();

    if (!supabase) return;

    const channel = supabase
      .channel(`plantings-${channelId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plantings' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, [fetchData, channelId]);

  const addPlanting = async (data: Omit<Planting, 'id' | 'created_at' | 'updated_at'>) => {
    if (!supabase) {
      const newP: Planting = {
        ...data,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPlantings((prev) => [newP, ...prev]);
      return;
    }
    // created_by is UUID in DB — don't set with string profile IDs
    const { created_by: _ignore, ...insertData } = data;
    const { error: err } = await supabase
      .from('plantings')
      .insert(insertData);
    if (err) {
      setError(err.message);
      throw new Error(err.message);
    }
  };

  const updatePlanting = async (id: string, data: Partial<Planting>) => {
    if (!supabase) {
      setPlantings((prev) => prev.map((p) => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p));
      return;
    }
    const { error: err } = await supabase
      .from('plantings')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (err) {
      setError(err.message);
      throw new Error(err.message);
    }
  };

  const deletePlanting = async (id: string) => {
    if (!supabase) {
      setPlantings((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    const { error: err } = await supabase
      .from('plantings')
      .delete()
      .eq('id', id);
    if (err) {
      setError(err.message);
      throw new Error(err.message);
    }
  };

  return { plantings, loading, error, addPlanting, updatePlanting, deletePlanting, refetch: fetchData };
}

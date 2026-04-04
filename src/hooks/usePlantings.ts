import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_PLANTINGS } from '../lib/constants';
import type { Planting } from '../lib/types';
import { useAuth } from './useAuth';

export function usePlantings(bancalId?: string) {
  const { user } = useAuth();
  const fallback = bancalId
    ? MOCK_PLANTINGS.filter((p) => p.bancal_id === bancalId)
    : MOCK_PLANTINGS;
  const [plantings, setPlantings] = useState<Planting[]>(fallback);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!supabase) return;
    let query = supabase.from('plantings').select('*').order('created_at', { ascending: false });
    if (bancalId) query = query.eq('bancal_id', bancalId);
    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
    } else if (data) {
      setPlantings(data as Planting[]);
      setError(null);
    }
    setLoading(false);
  }, [bancalId]);

  useEffect(() => {
    fetch();

    if (!supabase) return;

    const channel = supabase
      .channel(`plantings-${bancalId ?? 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'plantings' }, () => {
        fetch();
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, [fetch, bancalId]);

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
    const { error: err } = await supabase
      .from('plantings')
      .insert({ ...data, created_by: user?.id });
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

  return { plantings, loading, error, addPlanting, updatePlanting, refetch: fetch };
}

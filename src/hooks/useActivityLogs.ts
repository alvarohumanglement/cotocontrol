import { useEffect, useState, useCallback, useId } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_LOGS } from '../lib/constants';
import type { ActivityLog } from '../lib/types';
import { useAuth } from './useAuth';

export function useActivityLogs(bancalId?: string) {
  const channelId = useId();
  const { profile } = useAuth();
  const fallback = bancalId
    ? MOCK_LOGS.filter((l) => l.bancal_id === bancalId)
    : MOCK_LOGS;
  const sortedFallback = [...fallback].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const [logs, setLogs] = useState<ActivityLog[]>(supabase ? [] : sortedFallback);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!supabase) return;
    let query = supabase.from('activity_logs').select('*').order('created_at', { ascending: false });
    if (bancalId) query = query.eq('bancal_id', bancalId);
    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
      setLogs(sortedFallback);
    } else {
      setLogs(data as ActivityLog[]);
      setError(null);
    }
    setLoading(false);
  }, [bancalId]);

  useEffect(() => {
    fetchData();

    if (!supabase) return;

    const channel = supabase
      .channel(`logs-${channelId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, [fetchData, channelId]);

  const addLog = async (data: Omit<ActivityLog, 'id' | 'created_at'>) => {
    if (!supabase) {
      const newLog: ActivityLog = {
        ...data,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      setLogs((prev) => [newLog, ...prev]);
      return;
    }
    const { error: err } = await supabase
      .from('activity_logs')
      .insert({ ...data, created_by: profile?.id });
    if (err) {
      setError(err.message);
      throw new Error(err.message);
    }
  };

  const deleteLog = async (id: string) => {
    if (!supabase) {
      setLogs((prev) => prev.filter((l) => l.id !== id));
      return;
    }
    const { error: err } = await supabase
      .from('activity_logs')
      .delete()
      .eq('id', id);
    if (err) {
      setError(err.message);
      throw new Error(err.message);
    }
  };

  return { logs, loading, error, addLog, deleteLog, refetch: fetchData };
}

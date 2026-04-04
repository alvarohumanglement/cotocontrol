import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { ActivityLog } from '../lib/types';

export function useLastWatered(logs?: ActivityLog[]) {
  const [waterMap, setWaterMap] = useState<Record<string, number>>({});

  const computeFromLogs = useCallback((allLogs: ActivityLog[]) => {
    const now = Date.now();
    const map: Record<string, number> = {};
    for (const log of allLogs) {
      if (log.action !== 'watered') continue;
      if (map[log.bancal_id] !== undefined) continue; // already found most recent
      const days = Math.floor((now - new Date(log.created_at).getTime()) / 86400000);
      map[log.bancal_id] = days;
    }
    setWaterMap(map);
  }, []);

  useEffect(() => {
    if (logs) {
      // Use provided logs (already sorted desc)
      computeFromLogs(logs);
      return;
    }
    // Fetch watering logs directly
    if (!supabase) return;
    supabase
      .from('activity_logs')
      .select('bancal_id, created_at')
      .eq('action', 'watered')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) computeFromLogs(data as ActivityLog[]);
      });
  }, [logs, computeFromLogs]);

  const getDays = (bancalId: string): number | null => {
    return waterMap[bancalId] ?? null;
  };

  const getLabel = (bancalId: string): string | null => {
    const days = getDays(bancalId);
    if (days === null) return null;
    if (days === 0) return 'hoy';
    return `${days}d`;
  };

  return { waterMap, getDays, getLabel };
}

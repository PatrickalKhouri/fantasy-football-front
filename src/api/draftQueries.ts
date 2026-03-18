import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export type DraftStatus = 'PENDING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

export interface DraftResponse {
  id: string;
  season: number;
  status: DraftStatus;
  draftType: string;
  totalRounds: number;
  pickTimer: number;
  numberOfSlots: number;
  currentRound: number;
  currentPickPosition: number;
  currentPickDeadline: string | null;
}

export const useDraft = (leagueId: number, season: number | undefined) => {
  return useQuery<DraftResponse | null>({
    queryKey: ['draft', leagueId, season],
    queryFn: async () => {
      const res = await axios.get(apiConfig.endpoints.drafts.get(leagueId, season!), {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return res.data ?? null;
    },
    enabled: !!leagueId && !!season,
    refetchInterval: 30000, // poll every 30s to detect when room opens
  });
};

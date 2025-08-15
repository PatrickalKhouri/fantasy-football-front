import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export interface DraftSettingsResponse {
  id: number;
  numberOfTeams: number;
  playoffTeams: number;
  tradeDeadlineRound: number;
  irSlots: number;
  playoffStartRound: number;
}

export const useDraftSettings = (leagueId: number) => {
  return useQuery<DraftSettingsResponse>({
    queryKey: ['draftSettings', leagueId],
    queryFn: async () => {
      const res = await axios.get(
        `${apiConfig.endpoints.fantasyLeagues.getDraftSettings(leagueId)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!leagueId,
  });
};

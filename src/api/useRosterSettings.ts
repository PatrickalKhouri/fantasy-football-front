import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config'; 

export interface RosterSettingsResponse {
  id: number;
  numberOfTeams: number;
  playoffTeams: number;
  tradeDeadlineRound: number;
  irSlots: number;
  playoffStartRound: number;
}

export const useRosterSettings = (leagueId: number) => {
  return useQuery<RosterSettingsResponse>({
    queryKey: ['rosterSettings', leagueId],
    queryFn: async () => {
      const res = await axios.get(
        `${apiConfig.endpoints.fantasyLeagues.getRosterSettings(leagueId)}`,
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

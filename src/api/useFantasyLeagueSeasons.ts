import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config'; 

export interface FantasyLeagueSeasonsResponse {
  id: number;
  numberOfTeams: number;
  playoffTeams: number;
  tradeDeadlineRound: number;
  irSlots: number;
  playoffStartRound: number;
}

export const useFantasyLeagueSeasons = (leagueId: number) => {
  return useQuery<FantasyLeagueSeasonsResponse>({
    queryKey: ['fantasyLeagueSeasons', leagueId],
    queryFn: async () => {
      const res = await axios.get(
        `${apiConfig.endpoints.fantasyLeagues.getFantasyLeagueSeasons(leagueId)}`,
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

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export const useRosterSettings = (leagueId: number) => {
  return useQuery({
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

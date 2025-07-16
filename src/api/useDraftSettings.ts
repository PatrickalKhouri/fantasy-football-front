import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export const useDraftSettings = (leagueId: number) => {
  return useQuery({
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

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export const useFindUserFantasyLeagueTeam = (userId: number, fantasyLeagueId: number) => {
  return useQuery({
    queryKey: ['userFantasyLeagueTeam', userId, fantasyLeagueId],
    queryFn: async () => {
      const response = await axios.get(
        `${apiConfig.endpoints.users.findUserFantasyLeagueTeam(userId, fantasyLeagueId)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
    enabled: !!userId && !!fantasyLeagueId,
  });
}; 
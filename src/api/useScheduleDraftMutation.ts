import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export const useScheduleDraft = (leagueId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (seasonId: string) =>
      axios.post(
        apiConfig.endpoints.fantasyLeagueSeasons.scheduleDraft(seasonId),
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fantasyLeagueSeasons', leagueId] });
    },
  });
};

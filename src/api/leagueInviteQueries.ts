import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export const useGetInvitesByLeague = (leagueId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['league-invites', leagueId],
    queryFn: async () => {
      const res = await axios.get(apiConfig.endpoints.fantasyLeagues.getInvitesByLeagueId(leagueId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.data;
    },
    enabled: enabled && !!leagueId,
  });
};

export const useCancelInvite = (leagueId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: number) => {
      await axios.delete(apiConfig.endpoints.leagueInvites.cancel(inviteId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
    onMutate: async () => {
      // Optional: optimistic update logic
      await queryClient.cancelQueries({ queryKey: ['league-invites', leagueId] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['league-invites', leagueId] });
    },
  });
};
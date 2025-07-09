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

export const useCancelInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteId: number) => {
      await axios.delete(apiConfig.endpoints.leagueInvites.cancel(inviteId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
    onSuccess: (_, __, context: any) => {
      queryClient.invalidateQueries({ queryKey: ['league-invites', context?.leagueId] });
    },
  });
};
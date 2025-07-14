import axios from 'axios';
import { apiConfig } from './config';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { inviteUserToLeague } from './leagueMutations';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
}

export interface FantasyLeague {
    id: number;
    name: string;
    numberOfTeams: number;
    isOwner?: boolean;
    isActive?: boolean;
    championship: {
      id: number;
      name: string;
    };
    owner?: {
      id: number;
      firstName: string;
      lastName: string;
    };
    userLeagues: User[];
    members: User[];
    tradeDeadlineRound: number;
    clearWaivers: string;
    playoffTeams: number;
    injuredReserveSlots: number;
    playoffFormat: string;
  }

  export const useGetMyLeagues = () => {
    return useQuery<FantasyLeague[]>({
      queryKey: ['myLeagues'],
      queryFn: async () => {
        const response = await axios.get(
          apiConfig.endpoints.fantasyLeagues.myLeagues,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  export const useGetLeague = (leagueId: number) => {
    return useQuery<FantasyLeague>({
      queryKey: ['leagueId', leagueId],
      queryFn: async () => {
        const response = await axios.get(
          `${apiConfig.endpoints.fantasyLeagues.getLeague}/${leagueId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    })
}

export const useInviteUserToLeague = (leagueId: number) => {
  return useMutation({
    mutationFn: (email: string) =>
      inviteUserToLeague({ email, leagueId }),
  });
};


export const useLeagueTeams = (leagueId: number) => {
  return useQuery({
    queryKey: ['league-members', leagueId],
    queryFn: async () => {
      const res = await axios.get(apiConfig.endpoints.fantasyLeagues.getLeagueTeams(leagueId), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.data;
    },
    enabled: !!leagueId,
  });
};
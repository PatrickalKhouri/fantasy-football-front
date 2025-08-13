// api/playersQueries.ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { apiConfig } from './config';

export interface Player {
  player_id: number;
  player_name: string;
  player_position: string;
  player_photo: string;
  team_name: string;
  goals: number;
}

export interface PlayersFiltersResponse {
  teams: { id: number; name: string }[];
}

export interface PlayerResponse {
  data: Player[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    sortBy: string;
    order: 'asc' | 'desc';
  };
}

type UsePlayersFiltersParams = {
  leagueId?: number;
  seasonYear?: number; // optional: pass if your BE expects it
};


export const usePlayers = ({
  position,
  search,
  page,
  limit,
  sortBy,
  order,
  leagueId,
  fantasyLeagueId,
  onlyFreeAgents,
  teamId,
}: {
  position?: string[];
  search?: string;
  page: number;
  limit: number;
  sortBy: string;
  order: 'asc' | 'desc';
  leagueId?: number;
  fantasyLeagueId?: number;
  onlyFreeAgents: boolean,
  teamId?: number,
}) => {
  return useQuery<PlayerResponse>({
    queryKey: ['players', { position, search, page, limit, sortBy, order, leagueId, fantasyLeagueId, onlyFreeAgents, teamId }],
    queryFn: async () => {
      const response = await axios.get(`${apiConfig.endpoints.players.getAll}`, {
        params: { position, search, page, limit, sortBy, order, leagueId, fantasyLeagueId, onlyFreeAgents, teamId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return response.data;
    },
  });
};


export const usePlayersFilters = (params: UsePlayersFiltersParams) => {
  return useQuery<PlayersFiltersResponse>({
    queryKey: ['players-filters', params],
    queryFn: async () => {
      const response = await axios.get(
        apiConfig.endpoints.players.getFilters,
        {
          params, // e.g. { leagueId, seasonYear }
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
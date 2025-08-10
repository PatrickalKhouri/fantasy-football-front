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
}) => {
  return useQuery<PlayerResponse>({
    queryKey: ['players', { position, search, page, limit, sortBy, order, leagueId, fantasyLeagueId, onlyFreeAgents }],
    queryFn: async () => {
      const response = await axios.get(`${apiConfig.endpoints.players.getAll}`, {
        params: { position, search, page, limit, sortBy, order, leagueId, fantasyLeagueId, onlyFreeAgents },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return response.data;
    },
  });
};

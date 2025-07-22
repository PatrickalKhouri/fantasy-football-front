// api/playersQueries.ts
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { apiConfig } from './config';

export const usePlayers = ({
  position,
  search,
  page = 1,
  limit = 10,
  sortBy = 'goals',
  order = 'desc',
}: {
  position?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['players', { position, search, page, limit, sortBy, order }],
    queryFn: async () => {
      const response = await axios.get(`${apiConfig.endpoints.players.getAll}`, {
        params: { position, search, page, limit, sortBy, order },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return response.data;
    },
  });
};

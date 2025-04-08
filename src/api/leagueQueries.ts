import axios from 'axios';
import { apiConfig } from './config';
import { useQuery } from '@tanstack/react-query';

export interface FantasyLeague {
    id: number;
    name: string;
    numberOfTeams: number;
    isOwner?: boolean;
    championship: {
      id: number;
      name: string;
    };
    owner?: {
      id: number;
      firstName: string;
      lastName: string;
    };
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
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

interface CurrentSeason {
  year: number;
}

export const useCurrentSeason = () => {
  return useQuery<CurrentSeason>({
    queryKey: ['currentSeason'],
    queryFn: async () => {
      const res = await axios.get(apiConfig.endpoints.currentSeason);
      return res.data;
    },
    staleTime: 6 * 60 * 1000, // 10 hour
  });
};

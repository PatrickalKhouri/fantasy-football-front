// src/api/userTeamRosterQueries.ts

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from '../api/config';

export const useVirtualRoster = ({
  userTeamId,
  seasonYear,
  round,
}: {
  userTeamId?: number;
  seasonYear?: number;
  round?: number;
}) => {
  return useQuery({
    queryKey: ['virtual-roster', userTeamId, seasonYear, round],
    queryFn: async () => {
      const res = await axios.get(
        apiConfig.endpoints.usersTeamsRoster.getVirtualRoster(userTeamId!, seasonYear!, round!),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!userTeamId && !!seasonYear && round !== undefined,
  });
};

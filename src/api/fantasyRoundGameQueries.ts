import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const useLockedTeams = (
  leagueExternalId: number | undefined,
  seasonYear: number | undefined,
  roundNumber: number | null | undefined,
) =>
  useQuery<{ lockedTeamIds: number[] }>({
    queryKey: ['lockedTeams', leagueExternalId, seasonYear, roundNumber],
    queryFn: async () => {
      const res = await axios.get(
        apiConfig.endpoints.fantasyRoundGames.lockedTeams(leagueExternalId!, seasonYear!, roundNumber!),
        { headers: authHeader() },
      );
      return res.data;
    },
    enabled: !!leagueExternalId && !!seasonYear && roundNumber != null,
    refetchInterval: 2 * 60 * 1000,
    staleTime: 0,
  });

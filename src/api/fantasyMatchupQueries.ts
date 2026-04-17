import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export interface FantasyMatchupDto {
  id: string;
  roundNumber: number;
  homeTeamId: number | null;
  homeTeamName: string | null;
  awayTeamId: number | null;
  awayTeamName: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  matchupType: string;
  isGhost: boolean;
}

export interface ScheduleByRoundDto {
  roundNumber: number;
  matchups: FantasyMatchupDto[];
}

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const useScheduleBySeason = (seasonId: string | undefined) =>
  useQuery<ScheduleByRoundDto[]>({
    queryKey: ['fantasyMatchups', seasonId],
    queryFn: async () => {
      const res = await axios.get(
        apiConfig.endpoints.fantasyMatchups.bySeason(seasonId!),
        { headers: authHeader() },
      );
      return res.data;
    },
    enabled: !!seasonId,
  });

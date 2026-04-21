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

export interface StandingDto {
  teamId: number;
  teamName: string;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  totalScore: number;
  seed: number;
}

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

export const useStandings = (seasonId: string | undefined) =>
  useQuery<StandingDto[]>({
    queryKey: ['standings', seasonId],
    queryFn: async () => {
      const res = await axios.get(
        apiConfig.endpoints.fantasyMatchups.standings(seasonId!),
        { headers: authHeader() },
      );
      return res.data;
    },
    enabled: !!seasonId,
  });

export const usePlayoffMatchups = (seasonId: string | undefined) =>
  useQuery<FantasyMatchupDto[]>({
    queryKey: ['playoffs', seasonId],
    queryFn: async () => {
      const res = await axios.get(
        apiConfig.endpoints.fantasyMatchups.playoffs(seasonId!),
        { headers: authHeader() },
      );
      return res.data;
    },
    enabled: !!seasonId,
  });

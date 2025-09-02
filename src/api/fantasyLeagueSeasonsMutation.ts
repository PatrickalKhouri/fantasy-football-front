// src/api/fantasyLeagueSeasonsMutation.ts
import { useMutation } from '@tanstack/react-query';
import { apiConfig } from './config';
import axios from 'axios';

export type ActivateSeasonBody = {
  seasonKickoffAt?: string; // ISO string; optional
};

export interface UpdateFantasyLeagueSeason {
  values: {
    numberOfTeams: number;
    tradeReviewDays: number;
    numberOfRounds: number;
    tradeDeadlineRound: number | null;
    playoffTeams: number;
    playoffFormat: 'single_game' | 'two_leg_single_game_final' | 'two_leg_all';
    injuredReserveSlots: number;
  };
}

interface UpdateFantasyLeagueSeasonData {
  id: number;
  updates: Partial<{
    numberOfTeams: number;
    tradeReviewDays: number;
    numberOfRounds: number;
    tradeDeadlineRound: number | null;
    playoffTeams: number;
    playoffFormat: 'single_game' | 'two_leg_single_game_final' | 'two_leg_all';
    injuredReserveSlots: number;
    // logoUrl: string; <-- for later
  }>;
}

export async function activateSeasonRequest(seasonId: string, body: ActivateSeasonBody = {}) {
  const res = await axios.post(apiConfig.endpoints.fantasyLeagueSeasons.activate(seasonId), {
    data: body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (res.status !== 200) {
    const text = await res.data;
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.data;
}

export const useUpdateFantasyLeagueSeason = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: ({ id, updates }: UpdateFantasyLeagueSeasonData) =>
      axios.patch(`${apiConfig.endpoints.fantasyLeagueSeasons.update(id)}`, updates, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    onSuccess: onSuccess,
  });
};

export function useActivateSeasonMutation(options?: {
  onSuccess?: (data: any) => void;
  onError?: (err: unknown) => void;
}) {
  return useMutation({
    mutationKey: ['activateSeason'],
    mutationFn: (vars: { seasonId: string; body?: ActivateSeasonBody }) =>
      activateSeasonRequest(vars.seasonId, vars.body ?? {}),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}

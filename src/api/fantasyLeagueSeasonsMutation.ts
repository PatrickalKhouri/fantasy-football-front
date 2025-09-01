// src/api/fantasyLeagueSeasonsMutation.ts
import { useMutation } from '@tanstack/react-query';
import { apiConfig } from './config';

export type ActivateSeasonBody = {
  seasonKickoffAt?: string; // ISO string; optional
};

export async function activateSeasonRequest(seasonId: string, body: ActivateSeasonBody = {}) {
  const res = await fetch(apiConfig.endpoints.fantasyLeagueSeasons.activate(seasonId), {
    method: 'POST',
    headers: apiConfig.headers,
    body: JSON.stringify(body),
    credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

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

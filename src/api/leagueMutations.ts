import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';
import { useNavigate } from 'react-router-dom';

interface CreateLeagueData {
  name: string;
  numberOfTeams: number;
  ownerId: number;
  championshipId: number;
  draftType: string;
}

interface UpdateLeagueData {
  leagueId: number;
  updates: Partial<{
    name: string;
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

export const useCreateLeague = () => {
  return useMutation({
    mutationFn: (leagueData: CreateLeagueData) => 
      axios.post(apiConfig.endpoints.fantasyLeagues.create, leagueData, {
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  });
};

export const inviteUserToLeague = async ({
  email,
  leagueId,
}: {
  email: string;
  leagueId: number;
}) => {
  const res = await fetch(`${apiConfig.endpoints.leagueInvites.invite}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ email, leagueId }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to send invite');
  }

  return res.json();
};

export const useUpdateLeague = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: ({ leagueId, updates }: UpdateLeagueData) =>
      axios.patch(`${apiConfig.endpoints.fantasyLeagues.update(leagueId)}`, updates, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    onSuccess: onSuccess,
  });
};

export const useDeleteLeague = () =>
  useMutation({
    mutationFn: (leagueId: number) =>
      axios.delete(`${apiConfig.endpoints.fantasyLeagues.delete(leagueId)}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
  });

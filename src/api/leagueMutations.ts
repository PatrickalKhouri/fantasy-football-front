import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

interface CreateLeagueData {
  name: string;
  numberOfTeams: number;
  ownerId: number;
  championshipId: number;
}

export const useCreateLeague = () => {
  return useMutation({
    mutationFn: (leagueData: CreateLeagueData) => 
      axios.post(apiConfig.endpoints.fantasyLeagues.create, leagueData),
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
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
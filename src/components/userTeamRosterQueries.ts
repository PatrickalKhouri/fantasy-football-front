// src/api/userTeamRosterQueries.ts

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from '../api/config';
import { RosterSlot } from '../utils/positions';

export type RosterPlayer = {
  id: number;
  name: string;
  photo: string;
  position: string;
  team: { code: string };
}

export type Slot = {
  id: number;
  playerId: number;
  playerName: string;
  slotType: string;
  index: number;
  allowedPositions: RosterSlot[];
  player: RosterPlayer;
};

export const useRoster = ({
  userTeamId,
  seasonYear,
}: {
  userTeamId?: number;
  seasonYear?: number;
}) => {
  return useQuery({
    queryKey: ['virtual-roster', userTeamId, seasonYear],
    queryFn: async () => {
      const res = await axios.get(
        apiConfig.endpoints.usersTeamsRoster.getRoster(userTeamId!, seasonYear!),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return res.data;
    },
    enabled: !!userTeamId && !!seasonYear,
  });
};

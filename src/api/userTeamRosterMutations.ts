import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export const useAddPlayer = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: ({ body }: { body: any }) =>
      axios.post(`${apiConfig.endpoints.usersTeamsRoster.addPlayer}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    onSuccess,
  });
};


export const useRemovePlayer = ({ onSuccess }: { onSuccess: () => void }) => {
    return useMutation({
      mutationFn: (rosterId: number) =>
        axios.delete(`${apiConfig.endpoints.usersTeamsRoster.deletePlayer(rosterId)}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      onSuccess,
    });
  };
  

  export const useMovePlayer = ({ onSuccess }: { onSuccess: () => void }) => {
    return useMutation({
      mutationFn: (body: {
        userTeamId: number;
        seasonYear: number;
        originSlotIndex: number;
        targetSlotIndex: number;
      }) =>
        axios.patch(
          apiConfig.endpoints.usersTeamsRoster.movePlayer,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        ),
      onSuccess,
    });
  };
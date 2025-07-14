import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export const useDeleteUserTeam = ({ onSuccess }: { onSuccess: () => void }) => {
    return useMutation({
      mutationFn: ({ id }: { id: number }) =>
        axios.delete(`${apiConfig.endpoints.userTeams.delete(id)}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      onSuccess: () => {
        onSuccess();
      },
    });
  };
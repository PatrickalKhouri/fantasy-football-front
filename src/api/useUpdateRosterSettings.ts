import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export const useUpdateRosterSettings = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      axios.patch(`${apiConfig.endpoints.rosterSettings.update(id)}`, updates, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    onSuccess: onSuccess,
  });
};
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { apiConfig } from './config';

export const useUpdateDraftSettings = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      axios.patch(`${apiConfig.endpoints.draftSettings.update(id)}`, updates, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    onSuccess: onSuccess,
  });
};
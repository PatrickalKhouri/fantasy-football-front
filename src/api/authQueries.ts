import { useMutation } from '@tanstack/react-query';
import { apiConfig } from './config';

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await fetch(apiConfig.endpoints.auth.signup, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }
      return response.json();
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await fetch(apiConfig.endpoints.auth.signin, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      return response.json();
    },
  });
};
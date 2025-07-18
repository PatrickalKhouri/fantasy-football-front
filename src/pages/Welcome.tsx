// pages/Welcome.tsx
import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateLeagueModal from '../components/CreateLeagueModal';
import { UserLeaguesList } from '../components/UserLeaguesList';
import { useGetMyLeagues } from '../api/leagueQueries';
import { apiConfig } from '../api/config';
import { useMutation } from '@tanstack/react-query';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Use the React Query hook
  const { data: leagues, isLoading, isError, error } = useGetMyLeagues();

const acceptInviteMutation = useMutation({
  mutationFn: async (token: string) => {
    const res = await fetch(`${apiConfig.endpoints.leagueInvites.accept}?token=${token}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'Failed to accept invite');
    }

    return res.json();
  },
  onSuccess: (data: any) => {
    localStorage.removeItem('league_invite_token');
    window.location.reload();
  },
  onError: (error: Error) => {
    setErrorMessage(error.message);
  },
});

  useEffect(() => {
    const token = localStorage.getItem('league_invite_token');
    if (token) {
      localStorage.removeItem('league_invite_token');
      acceptInviteMutation.mutate(token);
    }
  }, [acceptInviteMutation]);

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleLeagueSelect = (leagueId: number) => {
    if (leagueId === 0) {
      setIsModalOpen(true);
    } else {
      navigate(`/league/${leagueId}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        p: { xs: 2, md: 3 },
        maxWidth: 800,
        mx: 'auto',
        textAlign: 'center'
      }}>
        <Typography variant="h3" component="h1" sx={{ mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
          Bem-vindo, {user.firstName} {user.lastName}!
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Você está logado com o email: {user.email}
        </Typography>

        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography color="error">
            {error instanceof Error ? error.message : 'Failed to load leagues'}
          </Typography>
        ) : (
          <>
          <Box sx={{ mb: 2 }}>
          <Button
            onClick={() => setIsModalOpen(true)}
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Criar Nova Liga
          </Button>
        </Box>
          <UserLeaguesList 
            leagues={leagues || []} 
            onLeagueSelect={handleLeagueSelect} 
          />
          </>
        )}
      </Box>
      

      <CreateLeagueModal 
        open={isModalOpen} 
        handleClose={() => setIsModalOpen(false)} 
      />

      {errorMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default Welcome;
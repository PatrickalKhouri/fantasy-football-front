// pages/Welcome.tsx
import { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateLeagueModal from '../components/CreateLeagueModal';
import { UserLeaguesList } from '../components/UserLeaguesList';
import { useGetMyLeagues } from '../api/leagueQueries';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use the React Query hook
  const { data: leagues, isLoading, isError, error } = useGetMyLeagues();

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
          <UserLeaguesList 
            leagues={leagues || []} 
            onLeagueSelect={handleLeagueSelect} 
          />
        )}
      </Box>

      <CreateLeagueModal 
        open={isModalOpen} 
        handleClose={() => setIsModalOpen(false)} 
      />
    </Box>
  );
};

export default Welcome;
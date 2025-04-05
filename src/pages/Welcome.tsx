import { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CreateLeagueModal from '../components/CreateLeagueModal';

const Welcome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        p: 3,
        maxWidth: 600,
        mx: 'auto',
        textAlign: 'center'
      }}>
        <Typography variant="h3" component="h1" sx={{ mb: 3 }}>
          Bem-vindo, {user.firstName} {user.lastName}!
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Você está logado com o email: {user.email}
        </Typography>

        <Stack direction="column" spacing={2} sx={{ width: '100%', maxWidth: 300 }}>
          <Button
            variant="contained"
            onClick={() => setIsModalOpen(true)}
            sx={{
              px: 4,
              py: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Criar Nova Liga
          </Button>
          
          <Button
            variant="outlined"
            onClick={logout}
            sx={{
              px: 4,
              py: 2,
              borderColor: '#1a1a1a',
              color: '#1a1a1a',
              '&:hover': { 
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderColor: '#333'
              }
            }}
          >
            Sair
          </Button>
        </Stack>
      </Box>

      <CreateLeagueModal 
        open={isModalOpen} 
        handleClose={() => setIsModalOpen(false)} 
      />
    </Box>
  );
};

export default Welcome;

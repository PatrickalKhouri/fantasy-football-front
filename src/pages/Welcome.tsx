import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/signin');
    return null;
  }

  console.log(user)

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
        
        <Button
          variant="contained"
          onClick={logout}
          sx={{
            px: 4,
            py: 2,
            backgroundColor: '#1a1a1a',
            '&:hover': { backgroundColor: '#333' }
          }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
};

export default Welcome;
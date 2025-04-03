import React from 'react';
import { Box, TextField, Button, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SignIn: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          p: 3,
          maxWidth: 400,
          mx: 'auto'
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Entrar na sua conta
        </Typography>
        
        <Box component="form" sx={{ width: '100%' }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            placeholder="Digite seu email"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              backgroundColor: '#1a1a1a',
              '&:hover': {
                backgroundColor: '#333',
              }
            }}
          >
            Continuar
          </Button>
        </Box>
        
        <Typography variant="body1" sx={{ mt: 2 }}>
          Não tem uma conta?{' '}
          <Link component={RouterLink} to="/signup" sx={{ fontWeight: 'bold' }}>
            Cadastre-se
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignIn;
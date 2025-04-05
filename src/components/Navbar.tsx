import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        color: 'black',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo on the left */}
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              fontFamily: '"Helvetica Neue", Arial, sans-serif',
              fontSize: '1.5rem',
              color: '#1a1a1a',
            }}
          >
            Fantasy Brasileirão
          </Typography>
        </Link>
        
        {/* Conditional rendering based on auth */}
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Olá, {user.firstName}!
            </Typography>
            <Button 
              variant="outlined"
              onClick={logout}
              sx={{
                borderColor: '#1a1a1a',
                color: '#1a1a1a',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderColor: '#1a1a1a',
                },
              }}
            >
              SAIR
            </Button>
          </Box>
        ) : (
          <Button 
            variant="outlined"
            component={Link}
            to="/signin"
            sx={{
              borderColor: '#1a1a1a',
              color: '#1a1a1a',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderColor: '#1a1a1a',
              },
            }}
          >
            ENTRAR
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

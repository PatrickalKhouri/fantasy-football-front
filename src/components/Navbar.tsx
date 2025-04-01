import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
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
        
        {/* Sign-in button on the right */}
        <Button 
          variant="outlined"
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
          SIGN IN
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
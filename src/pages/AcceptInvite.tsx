// pages/invite/accept.tsx

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { apiConfig } from '../api/config';

const InviteAcceptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    const authToken = localStorage.getItem('token');

    if (!token) {
      navigate('/dashboard');
      return;
    }

    if (!authToken) {
      // Save redirect path before redirecting to login
      localStorage.setItem('postLoginRedirect', location.pathname + location.search);
      navigate('/signin');
      return;
    }

    const acceptInvite = async () => {
      try {
        const res = await fetch(`${apiConfig.endpoints.leagueInvites.accept}?token=${token}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) throw new Error('Failed to accept invite');
        const data = await res.json();
        navigate(`/league/${data.leagueId}`);
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      }
    };

    acceptInvite();
  }, [location, navigate, token]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <CircularProgress />
      <Typography mt={2}>Aceitando convite...</Typography>
    </Box>
  );
};

export default InviteAcceptPage;

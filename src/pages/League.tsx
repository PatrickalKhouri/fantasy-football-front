import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetLeague } from '../api/leagueQueries';
import LeagueSidebar from '../components/LeaguesSidebar';
import InviteToLeagueModal from '../components/InviteToLeagueModal';
import { useInviteUserToLeague } from '../api/leagueQueries';
import { Snackbar, Alert } from '@mui/material';

const LeaguePage = ({ currentUserId }: { currentUserId: number }) => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { data: league, isLoading, error } = useGetLeague(Number(leagueId));
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { mutate: inviteUserToLeague } = useInviteUserToLeague(Number(leagueId));
  const handleInvite = (email: string) => {
    inviteUserToLeague(email, {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: 'Convite enviado com sucesso!',
          severity: 'success',
        });
      },
      onError: (err: Error) => {
        setSnackbar({
          open: true,
          message: `Erro ao enviar convite: ${err.message}`,
          severity: 'error',
        });
      },
    });
  };
  if (isLoading) return <p>Loading...</p>;
  if (error || !league) return <p>Something went wrong.</p>;

  return (
    <div style={{ display: 'flex' }}>
      <LeagueSidebar
        league={league}
        currentUserId={currentUserId}
        onInviteClick={() => setInviteModalOpen(true)}
      />
      <main style={{ padding: '2rem' }}>
        {/* League content here */}
      </main>
        <InviteToLeagueModal
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onSubmit={handleInvite}
        />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
        </div>
  );
};

export default LeaguePage;

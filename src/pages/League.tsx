import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetLeague } from '../api/leagueQueries';
import LeagueSidebar from '../components/LeaguesSidebar';
import InviteToLeagueModal from '../components/InviteToLeagueModal';
import { useInviteUserToLeague } from '../api/leagueQueries';
import { Snackbar, Alert, Box, useMediaQuery, useTheme } from '@mui/material';
import LeagueTabs from '../components/LeagueTabs';
import ViewInvitesModal from '../components/ViewInvitesModal';
import LeagueInfo from '../components/LeagueInfo';

const LeaguePage = ({ currentUserId }: { currentUserId: number }) => {
  const { leagueId } = useParams<{ leagueId: string }>();
  const { data: league, isLoading, error } = useGetLeague(Number(leagueId));
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [selectedTab, setSelectedTab] = useState('draft');
  const [viewInvitesModalOpen, setViewInvitesModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Box
      display="flex"
      flexDirection={isMobile ? 'column' : 'row'}
      width="100%"
      minHeight="100vh"
    >
      <Box
        flexShrink={0}
        width={isMobile ? '100%' : 280}
        px={isMobile ? 2 : 3}
        py={2}
      >
        <LeagueSidebar
          league={league}
          currentUserId={currentUserId}
          onInviteClick={() => setInviteModalOpen(true)}
          onViewInvitesClick={() => setViewInvitesModalOpen(true)}
        />
      </Box>

      <Box
        component="main"
        flexGrow={1}
        px={isMobile ? 2 : 4}
        py={isMobile ? 2 : 4}
      >
        <LeagueTabs selected={selectedTab} onChange={setSelectedTab} />

        <Box mt={4}>
          {selectedTab === 'draft' && <div>Draft content</div>}
          {selectedTab === 'team' && <div>Team content</div>}
          {selectedTab === 'league' && <LeagueInfo leagueId={Number(leagueId)} currentUserId={currentUserId} league={league} />}
          {selectedTab === 'players' && <div>Players list</div>}
          {selectedTab === 'trades' && <div>Trades UI</div>}
          {selectedTab === 'scores' && <div>Scores table</div>}
        </Box>
      </Box>

      <InviteToLeagueModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onSubmit={handleInvite}
      />

      <ViewInvitesModal
        leagueId={Number(leagueId)}
        open={viewInvitesModalOpen}
        onClose={() => setViewInvitesModalOpen(false)}
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
    </Box>
  );
};

export default LeaguePage;

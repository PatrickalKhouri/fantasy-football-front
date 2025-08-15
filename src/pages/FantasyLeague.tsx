import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetFantasyLeague } from '../api/fantasyLeagueQueries';
import LeagueSidebar from '../components/FantasyLeaguesSidebar';
import InviteToLeagueModal from '../components/InviteToFantasyLeagueModal';
import { useInviteUserToFantasyLeague } from '../api/fantasyLeagueQueries';
import { Snackbar, Alert, Box, useMediaQuery, useTheme } from '@mui/material';
import LeagueTabs from '../components/FantasyLeagueTabs';
import ViewInvitesModal from '../components/ViewInvitesModal';
import FantasyLeagueInfo from '../components/FantasyLeagueInfo';
import PlayersList from '../components/PlayersList';
import { TeamTab } from '../components/TeamTabComponent';
import { useFindUserFantasyLeagueTeam } from '../api/userTeamsQueries';
import Loading from '../components/Loading';

const FantasyLeaguePage = ({ currentUserId }: { currentUserId: number }) => {
  const { fantasyLeagueId } = useParams<{ fantasyLeagueId: string }>();
  const { data: fantasyLeague, isLoading, isError, error } = useGetFantasyLeague(Number(fantasyLeagueId));
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

  const { mutate: inviteUserToFantasyLeague, isPending: isInvitingUser, isError: isInvitingUserError, error: invitingUserError } = useInviteUserToFantasyLeague(Number(fantasyLeagueId));
  const { data: userTeam, isLoading: isLoadingUserTeam, isError: isLoadingUserTeamError, error: errorUserTeam } = useFindUserFantasyLeagueTeam(currentUserId, Number(fantasyLeagueId));


  const handleInvite = (email: string) => {
    inviteUserToFantasyLeague(email, {
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

  if (isLoading || isLoadingUserTeam) return <Loading message="Carregando a liga..." fullScreen />;
  if (isInvitingUser) return <Loading message="Enviando convite..." />;
  if (isInvitingUserError) return <p>Algo deu errado ao enviar o convite.</p>;
  if (!fantasyLeague) return <p>Algo deu errado ao carregar a liga.</p>;

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
          fantasyLeague={fantasyLeague}
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
          {selectedTab === 'team' && <TeamTab seasonYear={2023} userTeam={userTeam} fantasyLeague={fantasyLeague} />}
          {selectedTab === 'league' && <FantasyLeagueInfo currentUserId={currentUserId} fantasyLeague={fantasyLeague} />}
          {selectedTab === 'players' && <PlayersList fantasyLeague={fantasyLeague} seasonYear={2023} userTeamId={userTeam.id} />}
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
        fantasyLeagueId={Number(fantasyLeagueId)}
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

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Algo deu errado ao carregar a liga.'}
        </Alert>
      )}

      {isLoadingUserTeamError && (
        <Alert severity="error">
          {errorUserTeam instanceof Error ? errorUserTeam.message : 'Algo deu errado ao carregar o time do usuário.'}
        </Alert>
      )}

      {isInvitingUserError && (
        <Alert severity="error">
          {typeof invitingUserError === 'object' && invitingUserError !== null && 'message' in invitingUserError
            ? (invitingUserError as { message: string }).message
            : 'Algo deu errado ao enviar o convite.'}
        </Alert>
      )}

    </Box>
  );
};

export default FantasyLeaguePage;

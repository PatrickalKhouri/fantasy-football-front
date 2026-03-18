import React, { useState } from 'react';
import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { FantasyLeague, useFantasyLeagueTeams } from '../api/fantasyLeagueQueries';
import { useFantasyLeagueSeasons } from '../api/useFantasyLeagueSeasons';
import { useDraftSettings } from '../api/useDraftSettings';
import SeasonStatusCard, { LeagueStatus } from './SeasonStatusCard';
import DraftOrderPanel from './DraftOrderPanel';
import DraftSettingsForm from './DraftSettingsForm';
import DraftSchedulePanel from './DraftSchedulePanel';
import { useDraft } from '../api/draftQueries';

interface Props {
  fantasyLeague: FantasyLeague;
  currentUserId: number;
}

export default function DraftTab({ fantasyLeague, currentUserId }: Props) {
  const isOwner = fantasyLeague.owner?.id === currentUserId;
  const leagueId = fantasyLeague.id;

  const { data: season, isLoading: loadingSeason, refetch: refetchSeason } = useFantasyLeagueSeasons(leagueId);
  const { data: draftSettings, refetch: refetchDraftSettings } = useDraftSettings(leagueId);
  const { data: teams, isLoading: loadingTeams } = useFantasyLeagueTeams(leagueId);
  const { data: draft } = useDraft(leagueId, season?.seasonYear);

  const [draftFormValues, setDraftFormValues] = useState(draftSettings);

  // Sync form values when settings load
  React.useEffect(() => {
    if (draftSettings) setDraftFormValues(draftSettings);
  }, [draftSettings]);

  if (loadingSeason || loadingTeams) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  const status = season?.status as LeagueStatus | undefined;
  const seasonYear = season?.seasonYear;

  // ACTIVATED_PRESEASON: show draft settings + draft order setup
  if (status === LeagueStatus.ACTIVATED_PRESEASON) {
    return (
      <Box>
        {isOwner && draftSettings && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" fontWeight={700} mb={2}>
              Configurações do Draft
            </Typography>
            <Stack spacing={2}>
              <DraftSettingsForm
                values={draftFormValues ?? draftSettings}
                onChange={(field, value) =>
                  setDraftFormValues((prev: any) => ({ ...prev, [field]: value }))
                }
                id={draftSettings.id}
                refetchDraftSettings={refetchDraftSettings}
              />
            </Stack>
          </>
        )}

        {seasonYear && season && draftSettings && (
          <>
            <Divider sx={{ my: 3 }} />
            <DraftSchedulePanel
              seasonId={season.id}
              leagueId={leagueId}
              draftSettings={draftSettings}
              isOwner={isOwner}
              refetchDraftSettings={refetchDraftSettings}
            />
          </>
        )}

        {seasonYear && (
          <>
            <Divider sx={{ my: 3 }} />
            <DraftOrderPanel
              leagueId={leagueId}
              season={seasonYear}
              numberOfTeams={fantasyLeague.numberOfTeams}
              isOwner={isOwner}
              teams={teams ?? []}
            />
          </>
        )}
      </Box>
    );
  }

  // DRAFT_SCHEDULED: order panel (may be locked) + status card + enter room if draft exists
  if (status === LeagueStatus.DRAFT_SCHEDULED) {
    return (
      <Box>
        <SeasonStatusCard
          season={season}
          canManage={isOwner}
          refetchSeason={refetchSeason}
          draftSettings={draftSettings}
        />

        {draft && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box display="flex" flexDirection="column" alignItems="center" gap={1} py={2}>
              <Typography variant="body2" color="text.secondary">
                A sala do draft está aberta. Você pode entrar e aguardar o início.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700, px: 4 }}
                disabled
              >
                Entrar na Sala do Draft (em breve)
              </Button>
            </Box>
          </>
        )}

        {seasonYear && (
          <>
            <Divider sx={{ my: 3 }} />
            <DraftOrderPanel
              leagueId={leagueId}
              season={seasonYear}
              numberOfTeams={fantasyLeague.numberOfTeams}
              isOwner={isOwner}
              teams={teams ?? []}
            />
          </>
        )}
      </Box>
    );
  }

  // DRAFT_LIVE: entry point to draft room (Phase 7)
  if (status === LeagueStatus.DRAFT_LIVE) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={6} gap={2}>
        <Typography variant="h5" fontWeight={700}>
          O Draft está ao vivo!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Clique para entrar na sala do draft e fazer suas escolhas.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700, px: 4 }}
          disabled
        >
          Entrar no Draft (em breve)
        </Button>
      </Box>
    );
  }

  // DRAFT_DONE: confirmation + placeholder for picks history (Phase 8)
  if (status === LeagueStatus.DRAFT_DONE) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={6} gap={2}>
        <Typography variant="h5" fontWeight={700}>
          Draft concluído!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Todos os times foram montados. Acesse a aba Time para ver seu elenco.
        </Typography>
      </Box>
    );
  }

  // SCHEDULED / ACTIVE / ARCHIVED
  return (
    <Box>
      <SeasonStatusCard
        season={season}
        canManage={isOwner}
        refetchSeason={refetchSeason}
      />
      <Box mt={3}>
        <Typography variant="body2" color="text.secondary">
          O draft desta temporada já foi realizado.
        </Typography>
      </Box>
    </Box>
  );
}

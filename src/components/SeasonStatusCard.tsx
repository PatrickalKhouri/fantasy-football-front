import React, { useMemo } from 'react';
import { Box, Stack, Typography, Chip, Button, Divider } from '@mui/material';
import { useActivateSeasonMutation } from '../api/fantasyLeagueSeasonsMutation';

/** Keep in sync with backend */
export enum LeagueStatus {
    INACTIVE = 'INACTIVE',
    ACTIVATED_PRESEASON = 'ACTIVATED_PRESEASON',
    DRAFT_SCHEDULED = 'DRAFT_SCHEDULED',
    DRAFT_LIVE = 'DRAFT_LIVE',
    DRAFT_DONE = 'DRAFT_DONE',
    SCHEDULED = 'SCHEDULED',
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
  }
  
  type PlayoffFormat = 'single_game' | 'two_leg_single_game_final' | 'two_leg_all';
  
  export type FantasyLeagueSeason = {
    id: string;
    seasonYear: number;
    status: LeagueStatus;
    numberOfTeams: number | null;
    playoffTeams: number | null;
    playoffStartRound: number | null;
    numberOfRounds: number | null;
    playoffFormat: PlayoffFormat | null;
    seasonKickoffAt: string | null; // ISO
    activatedAt: string | null;
  };
  
  type Props = {
    season?: FantasyLeagueSeason | null;
    canManage: boolean;
    onUpdated?: () => void;
    devEnableForceOpen?: boolean;
  };
  
  /* ---------------- helpers ---------------- */
  
  function isoToDate(iso: string | null | undefined): Date | null {
    if (!iso) return null;
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  
  /** Dev rule: if no kickoff provided, treat as now + 2 months (mirrors backend dev logic) */
  function resolveKickoffDevFromSeason(season: FantasyLeagueSeason): Date {
    return isoToDate(season.seasonKickoffAt) ?? new Date(Date.now() + 1000 * 60 * 60 * 24 * 60);
  }
  
  /** Used when there is NO season: still show a date (now + 2 months) */
  function resolveKickoffDevNoSeason(): Date {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 60);
  }
  
  function isActivationWindowOpen(season: FantasyLeagueSeason, now = new Date()): boolean {
    const kickoff = resolveKickoffDevFromSeason(season);
    const windowStart = new Date(kickoff);
    windowStart.setMonth(kickoff.getMonth() - 2);
    return now >= windowStart && now < kickoff;
  }
  
  type UiPhase =
    | 'entre-temporadas'
    | 'inativa'
    | 'pré-temporada'
    | 'draft'
    | 'temporada'
    | 'pós-temporada';
  
  function computeUiPhase(season: FantasyLeagueSeason): UiPhase {
    const now = new Date();
    const kickoff = resolveKickoffDevFromSeason(season);
    const windowOpen = isActivationWindowOpen(season, now);
  
    switch (season.status) {
      case LeagueStatus.INACTIVE:
        return windowOpen ? 'inativa' : 'entre-temporadas';
      case LeagueStatus.DRAFT_LIVE:
        return 'draft';
      case LeagueStatus.ACTIVATED_PRESEASON:
      case LeagueStatus.DRAFT_SCHEDULED:
      case LeagueStatus.DRAFT_DONE:
      case LeagueStatus.SCHEDULED:
        return now < kickoff ? 'pré-temporada' : 'temporada';
      case LeagueStatus.ACTIVE:
        return 'temporada';
      case LeagueStatus.ARCHIVED:
        return 'pós-temporada';
      default:
        return 'entre-temporadas';
    }
  }
  
  function chipColor(phase: UiPhase) {
    switch (phase) {
      case 'entre-temporadas':
        return 'default';
      case 'inativa':
        return 'warning';
      case 'pré-temporada':
        return 'info';
      case 'draft':
        return 'secondary';
      case 'temporada':
        return 'success';
      case 'pós-temporada':
        return 'primary';
    }
  }
  
  function daysUntil(date: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const now = new Date();
    return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / msPerDay));
  }
  
  /* ---------------- component ---------------- */
  
  export default function SeasonStatusCard({
    season,
    canManage,
    onUpdated,
    devEnableForceOpen = true,
  }: Props) {
    // Always compute a kickoff & message, even when there's no season
    const kickoff = useMemo<Date>(() => {
      return season ? resolveKickoffDevFromSeason(season) : resolveKickoffDevNoSeason();
    }, [season]);
  
    const windowStart = useMemo<Date>(() => {
      const d = new Date(kickoff.getTime());
      d.setMonth(d.getMonth() - 2);
      return d;
    }, [kickoff]);
  
    const phase: UiPhase = useMemo(
      () => (season ? computeUiPhase(season) : 'entre-temporadas'),
      [season],
    );
  
    const windowOpen = useMemo(() => (season ? isActivationWindowOpen(season) : false), [season]);
  
    const kickoffStr = kickoff.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    const windowStr = `${windowStart.toLocaleString('pt-BR', { dateStyle: 'short' })} → ${kickoff.toLocaleString('pt-BR', { dateStyle: 'short' })}`;
  
    const dias = daysUntil(kickoff);
  
    const { mutate: activateMutate, isPending } = useActivateSeasonMutation({
      onSuccess: () => onUpdated?.(),
      onError: (e) => alert((e as any)?.message || 'Falha ao ativar a temporada'),
    });
  
    function postActivate(withOverride: boolean) {
      if (!season) return; // no actions when no season
      const body = withOverride
        ? { seasonKickoffAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() } // +1h
        : {};
      activateMutate({ seasonId: season.id, body });
    }
  
    return (
      <Box mt={2}>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1.2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button size="large" sx={{
                borderRadius: 50,
                color: 'white',
                fontWeight: 700,
                fontSize: '0.95rem',
                py: 1.25,
                minHeight: 44,
                 backgroundColor: chipColor(phase) === 'default' ? 'primary.main' : chipColor(phase) === 'warning' ? 'warning.main' : chipColor(phase) === 'info' ? 'info.main' : chipColor(phase) === 'secondary' ? 'secondary.main' : chipColor(phase) === 'success' ? 'success.main' : chipColor(phase) === 'primary' ? 'primary.main' : 'default.main' }}>{phase}</Button>
          </Stack>
  
          {season ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {/* PT-BR UI */}
                Temporada {season.seasonYear}
                {season.numberOfTeams ? ` • ${season.numberOfTeams} times` : ''}
                {season.playoffTeams ? ` • ${season.playoffTeams} nos playoffs` : ''}
              </Typography>
  
              <Typography variant="caption" color="text.secondary">
                {/* PT-BR UI */}
                Janela de ativação: {windowStr}
              </Typography>
  
              {canManage && (
                <Stack direction="column" spacing={1} mt={1}>
                  {phase === 'entre-temporadas' && devEnableForceOpen && (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => postActivate(true)}
                      disabled={isPending}
                      sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 600 }}
                    >
                      {/* PT-BR UI */}
                      Abrir janela
                    </Button>
                  )}
                  {phase === 'inativa' && (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => postActivate(false)}
                      disabled={isPending}
                      sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 600 }}
                    >
                      {/* PT-BR UI */}
                      Ativar temporada
                    </Button>
                  )}
                </Stack>
              )}
            </>
          ) : (
            <>
              {/* Removed: "Nenhuma temporada criada." */}
              <Typography variant="body2" color="text.secondary">
                {/* PT-BR UI */}
                Temporada começa em {dias} {dias === 1 ? 'dia' : 'dias'} • {kickoffStr}
              </Typography>
            </>
          )}
        </Stack>
      </Box>
    );
  }
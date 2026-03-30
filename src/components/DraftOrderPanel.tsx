import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { FantasyLeagueTeamsResponse } from '../api/fantasyLeagueQueries';
import { useDraftOrder } from '../api/draftOrderQueries';
import { useSetDraftOrder } from '../api/draftOrderMutations';

interface Props {
  leagueId: number;
  season: number;
  numberOfTeams: number;
  isOwner: boolean;
  teams: FantasyLeagueTeamsResponse[];
  connectedUserIds?: number[];
}

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  try {
    const e: any = err;
    const d = e?.response?.data;
    if (d) {
      if (Array.isArray(d?.message)) return d.message.join(', ');
      return d?.message || d?.error || JSON.stringify(d);
    }
    if (Array.isArray(e?.message)) return e.message.join(', ');
    if (e?.message) return e.message;
    return JSON.stringify(e);
  } catch {
    return 'Erro desconhecido';
  }
};

export default function DraftOrderPanel({
  leagueId,
  season,
  numberOfTeams,
  isOwner,
  teams,
  connectedUserIds,
}: Props) {
  // picks: pickPosition (1-based) → userTeamId (0 = unassigned)
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const { data: draftOrder, isLoading } = useDraftOrder(leagueId, season);
  const { mutate: setOrder, isPending: isSaving } = useSetDraftOrder(leagueId);

  const joinedTeamCount = teams.length;
  // Fall back to teams.length if numberOfTeams is not set on the league
  const totalSlots = Math.max(numberOfTeams || 0, joinedTeamCount);
  const isLocked = draftOrder && draftOrder.length > 0 && draftOrder.every((o) => o.isLocked);

  // Initialise picks from server data
  useEffect(() => {
    if (!draftOrder) return;
    const initial: Record<number, number> = {};
    for (const entry of draftOrder) {
      initial[entry.pickPosition] = entry.userTeam.id;
    }
    setPicks(initial);
  }, [draftOrder]);

  const handleChange = (position: number, teamId: number) => {
    setPicks((prev) => {
      const next = { ...prev };
      // Swap if team already assigned elsewhere
      const existingPos = Object.keys(next).find((k) => next[Number(k)] === teamId);
      if (existingPos) {
        next[Number(existingPos)] = prev[position] ?? 0;
      }
      next[position] = teamId;
      return next;
    });
  };

  const handleRandomize = () => {
    const shuffled = [...teams];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const randomPicks: Record<number, number> = {};
    shuffled.forEach((team, index) => {
      randomPicks[index + 1] = team.id;
    });
    setPicks(randomPicks);
  };

  const handleSave = () => {
    const order = Object.entries(picks)
      .filter(([, teamId]) => teamId > 0)
      .map(([pos, teamId]) => ({ pickPosition: Number(pos), userTeamId: teamId }));

    setOrder(
      { season, order },
      {
        onSuccess: () => setSnackbar({ open: true, message: 'Ordem salva com sucesso!', severity: 'success' }),
        onError: (err) => setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' }),
      },
    );
  };

  if (isLoading) return <CircularProgress size={24} />;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Ordem do Draft
        </Typography>
        {isLocked && (
          <Chip icon={<LockIcon />} label="Bloqueada" size="small" color="warning" />
        )}
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {isOwner && !isLocked
          ? 'Defina a ordem de escolha dos times. A ordem é bloqueada automaticamente 10 minutos antes do draft.'
          : 'Ordem de escolha dos times para o draft.'}
      </Typography>

      <Stack spacing={1}>
        {Array.from({ length: totalSlots }, (_, i) => i + 1).map((position) => {
          const isGhostSlot = position > joinedTeamCount;
          const assignedTeamId = picks[position] ?? 0;
          const assignedTeam = teams.find((t) => t.id === assignedTeamId);
          const isOnline = !isGhostSlot && assignedTeam != null && (connectedUserIds?.includes(assignedTeam.user.id) ?? false);

          return (
            <Stack
              key={position}
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{
                p: 1.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: isGhostSlot ? 'divider' : 'action.selected',
                opacity: isGhostSlot ? 0.5 : 1,
              }}
            >
              {connectedUserIds !== undefined && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: isGhostSlot ? 'transparent' : isOnline ? 'success.main' : 'grey.400',
                    flexShrink: 0,
                  }}
                />
              )}
              <Typography
                variant="body2"
                fontWeight={700}
                sx={{ minWidth: 28, color: 'text.secondary' }}
              >
                #{position}
              </Typography>

              <Divider orientation="vertical" flexItem />

              {isGhostSlot ? (
                <Typography variant="body2" color="text.disabled" sx={{ flex: 1 }}>
                  Vaga livre
                </Typography>
              ) : isLocked || !isOwner ? (
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {teams.find((t) => t.id === assignedTeamId)?.name ?? (
                    <span style={{ color: 'gray' }}>Não definido</span>
                  )}
                </Typography>
              ) : (
                <Select
                  size="small"
                  value={assignedTeamId || ''}
                  onChange={(e) => handleChange(position, Number(e.target.value))}
                  displayEmpty
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="">
                    <em>Não definido</em>
                  </MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name} ({team.user.firstName} {team.user.lastName})
                    </MenuItem>
                  ))}
                </Select>
              )}

              {isLocked && !isGhostSlot && (
                <LockIcon fontSize="small" sx={{ color: 'warning.main' }} />
              )}
            </Stack>
          );
        })}
      </Stack>

      {isOwner && !isLocked && (
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button
            variant="outlined"
            onClick={handleRandomize}
            disabled={isSaving || teams.length === 0}
            sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 600 }}
          >
            Randomizar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving}
            sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 600 }}
          >
            {isSaving ? 'Salvando…' : 'Salvar Ordem'}
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

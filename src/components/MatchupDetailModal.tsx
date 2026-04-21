import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FantasyMatchupDto } from '../api/fantasyMatchupQueries';
import { useRoster, Slot } from './userTeamRosterQueries';

interface Props {
  matchup: FantasyMatchupDto | null;
  onClose: () => void;
  userTeamId?: number;
  seasonYear?: number;
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Agendado',
  live: 'Ao Vivo',
  completed: 'Encerrado',
};

const STATUS_COLORS: Record<string, 'default' | 'warning' | 'success'> = {
  scheduled: 'default',
  live: 'warning',
  completed: 'success',
};

function SlotRow({ slot }: { slot: Slot }) {
  const label = slot.allowedPositions[0] ?? '?';
  const hasPlayer = !!slot.player;

  return (
    <Box display="flex" alignItems="center" gap={1} py={0.5}>
      <Chip label={label} size="small" variant="outlined" sx={{ width: 44, fontSize: 11 }} />
      {hasPlayer ? (
        <>
          <Avatar src={slot.player.photo} sx={{ width: 24, height: 24 }} />
          <Typography variant="body2" noWrap>
            {slot.player.name}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.disabled">
          Vazio
        </Typography>
      )}
    </Box>
  );
}

function RosterColumn({
  teamName,
  teamId,
  seasonYear,
}: {
  teamName: string | null;
  teamId: number | null;
  seasonYear?: number;
}) {
  const { data: slots, isLoading } = useRoster({ userTeamId: teamId ?? undefined, seasonYear });

  const starters = slots ? [...slots].filter((s) => s.slotType === 'starter').sort((a, b) => a.index - b.index) : [];
  const bench = slots ? [...slots].filter((s) => s.slotType === 'bench').sort((a, b) => a.index - b.index) : [];

  return (
    <Box>
      <Typography fontWeight={700} variant="subtitle1" mb={1} noWrap>
        {teamName ?? 'Ghost'}
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={24} />
        </Box>
      ) : !teamId ? (
        <Typography variant="body2" color="text.disabled">
          Time fantasma
        </Typography>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Titulares
          </Typography>
          {starters.map((slot) => (
            <SlotRow key={slot.index} slot={slot} />
          ))}

          <Divider sx={{ my: 1 }} />

          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Reservas
          </Typography>
          {bench.map((slot) => (
            <SlotRow key={slot.index} slot={slot} />
          ))}
        </>
      )}
    </Box>
  );
}

const MatchupDetailModal: React.FC<Props> = ({ matchup, onClose, userTeamId, seasonYear }) => {
  const userIsAway = userTeamId != null && matchup?.awayTeamId === userTeamId;

  const leftTeamId = userIsAway ? matchup!.awayTeamId : matchup?.homeTeamId ?? null;
  const leftTeamName = userIsAway ? matchup!.awayTeamName : matchup?.homeTeamName ?? null;
  const leftScore = userIsAway ? matchup!.awayScore : matchup?.homeScore ?? null;

  const rightTeamId = userIsAway ? matchup!.homeTeamId : matchup?.awayTeamId ?? null;
  const rightTeamName = userIsAway ? matchup!.homeTeamName : matchup?.awayTeamName ?? null;
  const rightScore = userIsAway ? matchup!.homeScore : matchup?.awayScore ?? null;

  const statusLabel = matchup ? (STATUS_LABELS[matchup.status] ?? matchup.status) : '';
  const statusColor = matchup ? (STATUS_COLORS[matchup.status] ?? 'default') : 'default';

  return (
    <Dialog open={!!matchup} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight={700}>Rodada {matchup?.roundNumber}</Typography>
            <Chip label={statusLabel} size="small" color={statusColor} />
          </Box>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Score row */}
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={3}>
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1, textAlign: 'right' }} noWrap>
            {leftTeamName ?? 'Ghost'}
          </Typography>
          <Typography variant="h5" fontWeight={800} color="text.secondary" sx={{ minWidth: 80, textAlign: 'center' }}>
            {leftScore ?? '—'} – {rightScore ?? '—'}
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }} noWrap>
            {rightTeamName ?? 'Ghost'}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Side-by-side rosters */}
        <Box display="flex" gap={3} flexWrap="wrap">
          <Box flex={1} minWidth={200}>
            <RosterColumn teamName={leftTeamName} teamId={leftTeamId} seasonYear={seasonYear} />
          </Box>
          <Box flex={1} minWidth={200}>
            <RosterColumn teamName={rightTeamName} teamId={rightTeamId} seasonYear={seasonYear} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MatchupDetailModal;

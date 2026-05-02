import React, { useState } from 'react';
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
import { useRealMatchesByRound, RealMatchDto } from '../api/matchesQueries';
import { getOpponentForTeam, formatMatchTime } from '../utils/matchUtils';
import { usePointsByRound } from '../api/playerFantasyPointsQueries';
import PlayerStatsModal from './PlayerStatsModal';

interface Props {
  matchup: FantasyMatchupDto | null;
  onClose: () => void;
  userTeamId?: number;
  seasonYear?: number;
  seasonId?: string;
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

function SlotRow({
  slot,
  realMatches,
  pointsMap,
  onPlayerClick,
}: {
  slot: Slot;
  realMatches?: RealMatchDto[];
  pointsMap?: Map<number, number>;
  onPlayerClick?: (slot: Slot) => void;
}) {
  const label = slot.allowedPositions[0] ?? '?';
  const hasPlayer = !!slot.player;
  const opponentInfo = hasPlayer && slot.player.team?.id != null && realMatches
    ? getOpponentForTeam(realMatches, slot.player.team.id)
    : null;
  const points = hasPlayer && pointsMap ? pointsMap.get(slot.player.id) : undefined;

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      py={0.5}
      onClick={() => hasPlayer && onPlayerClick?.(slot)}
      sx={{ cursor: hasPlayer ? 'pointer' : 'default', borderRadius: 1, '&:hover': hasPlayer ? { bgcolor: 'action.hover' } : {} }}
    >
      <Chip label={label} size="small" variant="outlined" sx={{ width: 44, fontSize: 11 }} />
      {hasPlayer ? (
        <>
          <Avatar src={slot.player.photo} sx={{ width: 24, height: 24 }} />
          <Box flex={1}>
            <Typography variant="body2" noWrap>
              {slot.player.name}
            </Typography>
            {opponentInfo && (
              <Typography variant="caption" color="text.disabled" noWrap>
                x {opponentInfo.code} ({opponentInfo.isHome ? 'C' : 'V'})
                {formatMatchTime(opponentInfo.matchDate) && (
                  <> · {formatMatchTime(opponentInfo.matchDate)}</>
                )}
              </Typography>
            )}
          </Box>
          {points != null && (
            <Typography variant="body2" fontWeight={700} color={points >= 0 ? 'success.main' : 'error.main'} sx={{ minWidth: 36, textAlign: 'right' }}>
              {points.toFixed(1)}
            </Typography>
          )}
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
  realMatches,
  pointsMap,
  onPlayerClick,
}: {
  teamName: string | null;
  teamId: number | null;
  seasonYear?: number;
  realMatches?: RealMatchDto[];
  pointsMap?: Map<number, number>;
  onPlayerClick?: (slot: Slot) => void;
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
            <SlotRow key={slot.index} slot={slot} realMatches={realMatches} pointsMap={pointsMap} onPlayerClick={onPlayerClick} />
          ))}

          <Divider sx={{ my: 1 }} />

          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Reservas
          </Typography>
          {bench.map((slot) => (
            <SlotRow key={slot.index} slot={slot} realMatches={realMatches} pointsMap={pointsMap} onPlayerClick={onPlayerClick} />
          ))}
        </>
      )}
    </Box>
  );
}

const MatchupDetailModal: React.FC<Props> = ({ matchup, onClose, userTeamId, seasonYear, seasonId }) => {
  const { data: realMatches } = useRealMatchesByRound(seasonYear, matchup?.roundNumber ?? undefined);
  const { data: pointsMap } = usePointsByRound(seasonId, matchup?.roundNumber ?? undefined);
  const [statsSlot, setStatsSlot] = useState<Slot | null>(null);
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
            <RosterColumn
              teamName={leftTeamName}
              teamId={leftTeamId}
              seasonYear={seasonYear}
              realMatches={realMatches}
              pointsMap={pointsMap}
              onPlayerClick={(slot) => setStatsSlot(slot)}
            />
          </Box>
          <Box flex={1} minWidth={200}>
            <RosterColumn
              teamName={rightTeamName}
              teamId={rightTeamId}
              seasonYear={seasonYear}
              realMatches={realMatches}
              pointsMap={pointsMap}
              onPlayerClick={(slot) => setStatsSlot(slot)}
            />
          </Box>
        </Box>
      </DialogContent>

      <PlayerStatsModal
        playerId={statsSlot?.player?.id ?? null}
        playerName={statsSlot?.player?.name}
        playerPhoto={statsSlot?.player?.photo}
        seasonId={seasonId}
        roundFilter={matchup?.roundNumber ?? undefined}
        onClose={() => setStatsSlot(null)}
      />
    </Dialog>
  );
};

export default MatchupDetailModal;

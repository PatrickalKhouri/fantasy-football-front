import React, { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePlayerHistory, PlayerHistoryRow } from '../api/playerFantasyPointsQueries';
import { useRemovePlayer } from '../api/userTeamRosterMutations';

interface Props {
  playerId: number | null;
  playerName?: string;
  playerPhoto?: string;
  seasonId: string | undefined;
  onClose: () => void;
  slotId?: number;
  isOwner?: boolean;
  onMove?: () => void;
  roundFilter?: number;
  refetch?: () => void;
}

function buildStatRows(row: PlayerHistoryRow) {
  const all = [
    { label: 'Gols',              raw: row.goals,            pts: row.goalPoints },
    { label: 'Assistências',      raw: row.assists,          pts: row.assistPoints },
    { label: 'Defesas (GK)',       raw: row.saves,            pts: row.savePoints },
    { label: 'Clean Sheet',        raw: row.cleanSheet ? 1 : 0, pts: row.cleanSheetPoints, isBoolean: true },
    { label: 'Gols Sofridos',     raw: row.goalsConceded ?? 0, pts: row.goalConcededPoints },
    { label: 'Desarmes',          raw: row.tacklesTotal ?? 0, pts: row.tacklePoints },
    { label: 'Chutes',             raw: null,                 pts: row.shotPoints },
    { label: 'Faltas',             raw: null,                 pts: row.foulPoints },
    { label: 'Cart. Amarelo',     raw: row.yellowCards,      pts: null },
    { label: 'Cart. Vermelho',    raw: row.redCards,         pts: null },
    { label: 'Cartões (pts)',      raw: null,                 pts: row.cardPoints },
    { label: 'Gol Contra',        raw: null,                 pts: row.ownGoalPoints },
    { label: 'Pênalti',           raw: null,                 pts: row.penaltyPoints },
  ];
  return all.filter(
    (c) => (c.raw !== null && c.raw !== 0) || (c.pts !== null && c.pts !== 0),
  );
}

function BreakdownView({ row, matchLabel }: { row: PlayerHistoryRow; matchLabel: string }) {
  const statRows = buildStatRows(row);

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" mb={2}>
        {matchLabel}
      </Typography>

      {statRows.length === 0 ? (
        <Typography variant="body2" color="text.disabled">Sem estatísticas pontuáveis nesta partida.</Typography>
      ) : (
        <Box>
          {/* Header */}
          <Box display="grid" gridTemplateColumns="1fr auto auto" gap={2} px={1} mb={0.5}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>Estatística</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textAlign="right" sx={{ minWidth: 48 }}>Valor</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textAlign="right" sx={{ minWidth: 56 }}>Pts</Typography>
          </Box>
          <Divider />
          {statRows.map((s, i) => {
            const isNegative = s.pts !== null && s.pts < 0;
            const isPositive = s.pts !== null && s.pts > 0;
            return (
              <Box
                key={i}
                display="grid"
                gridTemplateColumns="1fr auto auto"
                gap={2}
                px={1}
                py={0.75}
                sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <Typography variant="body2">{s.label}</Typography>
                <Typography variant="body2" textAlign="right" sx={{ minWidth: 48 }} color="text.secondary">
                  {s.raw === null
                    ? '—'
                    : s.isBoolean
                      ? (s.raw ? '✓' : '—')
                      : s.raw}
                </Typography>
                <Typography
                  variant="body2"
                  textAlign="right"
                  fontWeight={600}
                  sx={{ minWidth: 56 }}
                  color={isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary'}
                >
                  {s.pts === null ? '—' : s.pts === 0 ? '0.0' : `${s.pts > 0 ? '+' : ''}${s.pts.toFixed(1)}`}
                </Typography>
              </Box>
            );
          })}

          {/* Total */}
          <Divider />
          <Box display="grid" gridTemplateColumns="1fr auto auto" gap={2} px={1} py={1}>
            <Typography variant="body2" fontWeight={700}>Total</Typography>
            <Box sx={{ minWidth: 48 }} />
            <Typography
              variant="body2"
              fontWeight={700}
              textAlign="right"
              sx={{ minWidth: 56 }}
              color={row.totalPoints >= 0 ? 'success.main' : 'error.main'}
            >
              {row.totalPoints.toFixed(1)}
            </Typography>
          </Box>
        </Box>
      )}

      <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
        <Typography variant="caption" color="text.disabled">{row.minutesPlayed} min jogados</Typography>
      </Box>
    </Box>
  );
}

const PlayerStatsModal: React.FC<Props> = ({
  playerId,
  playerName,
  playerPhoto,
  seasonId,
  onClose,
  slotId,
  isOwner,
  onMove,
  roundFilter,
  refetch,
}) => {
  const { data: history, isLoading } = usePlayerHistory(playerId, seasonId);
  const [selectedRow, setSelectedRow] = useState<PlayerHistoryRow | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: removePlayer, isPending: isReleasing } = useRemovePlayer({
    onSuccess: () => {
      setConfirmOpen(false);
      refetch?.();
      onClose();
    },
  });

  // When roundFilter is provided, auto-select that round's row as soon as data loads
  const roundFilterRow = useMemo(
    () => (roundFilter != null && history ? history.find((r) => r.roundNumber === roundFilter) ?? null : null),
    [roundFilter, history],
  );

  // Reset selectedRow when the modal closes or player changes
  useEffect(() => {
    setSelectedRow(null);
  }, [playerId]);

  const totalPoints = history?.reduce((sum, r) => sum + r.totalPoints, 0) ?? 0;

  // What to display in the content area
  const drillRow = roundFilter != null ? roundFilterRow : selectedRow;
  const showBreakdown = drillRow != null;
  const canGoBack = showBreakdown && roundFilter == null; // back button only in history mode
  const isMatchupMode = roundFilter != null; // opened directly from matchup

  const matchLabel = drillRow
    ? `Rodada ${drillRow.roundNumber} · ${drillRow.homeTeamName} x ${drillRow.awayTeamName}`
    : '';

  return (
    <>
      <Dialog
        open={!!playerId}
        onClose={onClose}
        fullWidth
        maxWidth={isMatchupMode ? 'xs' : 'lg'}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1.5}>
            {canGoBack && (
              <Button
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={() => setSelectedRow(null)}
                sx={{ mr: 0.5, minWidth: 0 }}
              >
                Histórico
              </Button>
            )}
            <Avatar src={playerPhoto} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography fontWeight={700} variant="h6" lineHeight={1.2}>
                {playerName ?? '—'}
              </Typography>
              {!showBreakdown && history && history.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  Total: {totalPoints.toFixed(1)} pts em {history.length} jogo(s)
                </Typography>
              )}
              {showBreakdown && (
                <Typography variant="caption" color="text.secondary">
                  {drillRow.totalPoints.toFixed(1)} pts nesta rodada
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={28} />
            </Box>
          ) : !history || history.length === 0 ? (
            <Typography color="text.secondary" py={2}>
              Nenhuma estatística encontrada para esta temporada.
            </Typography>
          ) : showBreakdown ? (
            <BreakdownView row={drillRow!} matchLabel={matchLabel} />
          ) : (
            <Table size="small" sx={{ '& .MuiTableCell-root': { px: 1.5, py: 0.75, fontSize: 13 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Rod.</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Partida</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>Pts</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Gols</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Ass</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Defesas</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>CS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>GC</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Tack</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Amar</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Verm</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'text.secondary' }}>Min</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((row: PlayerHistoryRow, i: number) => (
                  <TableRow
                    key={i}
                    hover
                    onClick={() => setSelectedRow(row)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{row.roundNumber ?? '?'}</TableCell>
                    <TableCell>{row.homeTeamName} x {row.awayTeamName}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: row.totalPoints >= 0 ? 'success.main' : 'error.main' }}>
                      {row.totalPoints.toFixed(1)}
                    </TableCell>
                    <TableCell align="right">{row.goals || '—'}</TableCell>
                    <TableCell align="right">{row.assists || '—'}</TableCell>
                    <TableCell align="right">{row.saves || '—'}</TableCell>
                    <TableCell align="center">
                      {row.cleanSheet ? (
                        <Chip label="✓" size="small" color="success" sx={{ height: 18, fontSize: 10 }} />
                      ) : '—'}
                    </TableCell>
                    <TableCell align="right">{row.goalsConceded ?? '—'}</TableCell>
                    <TableCell align="right">{row.tacklesTotal ?? '—'}</TableCell>
                    <TableCell align="right">{row.yellowCards || '—'}</TableCell>
                    <TableCell align="right">{row.redCards || '—'}</TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary' }}>{row.minutesPlayed}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>

        {isOwner && slotId && (
          <>
            <Divider />
            <DialogActions sx={{ px: 3, py: 1.5, gap: 1 }}>
              {onMove && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    onClose();
                    onMove();
                  }}
                >
                  Mover
                </Button>
              )}
              <Button
                variant="outlined"
                color="error"
                disabled={isReleasing}
                onClick={() => setConfirmOpen(true)}
              >
                Liberar jogador
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar remoção</DialogTitle>
        <DialogContent>
          Tem certeza que deseja liberar {playerName || 'este jogador'}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => { if (slotId) removePlayer(slotId); }}
            color="error"
            variant="contained"
            disabled={isReleasing}
          >
            Liberar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PlayerStatsModal;

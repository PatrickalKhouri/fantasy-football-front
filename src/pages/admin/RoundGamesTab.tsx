import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SyncIcon from '@mui/icons-material/Sync';
import {
  OrphanedMatch,
  useAddMatch,
  useListRoundMatches,
  useOrphanedMatches,
  useRemoveMatch,
  useSyncAllRounds,
  useSyncRound,
} from '../../api/fantasyRoundGameQueries';

// ─── Round row (one accordion item) ─────────────────────────────────────────

const RoundRow: React.FC<{
  leagueExternalId: number;
  seasonYear: number;
  roundNumber: number;
  onMessage: (msg: string) => void;
}> = ({ leagueExternalId, seasonYear, roundNumber, onMessage }) => {
  const [expanded, setExpanded] = useState(false);
  const { data: matches = [], isLoading } = useListRoundMatches(
    expanded ? leagueExternalId : undefined,
    expanded ? seasonYear : undefined,
    expanded ? roundNumber : undefined,
  );
  const syncRound = useSyncRound();
  const removeMatch = useRemoveMatch();

  const handleSync = (e: React.MouseEvent) => {
    e.stopPropagation();
    syncRound.mutate(
      { leagueExternalId, seasonYear, roundNumber },
      { onSuccess: (d) => onMessage(`Rodada ${roundNumber}: ${d.added} jogo(s) adicionado(s)`) },
    );
  };

  const handleRemove = (matchId: number) => {
    if (!window.confirm(`Remover o jogo ${matchId} da rodada ${roundNumber}?`)) return;
    removeMatch.mutate(
      { leagueExternalId, seasonYear, roundNumber, matchId },
      { onSuccess: () => onMessage(`Jogo removido da rodada ${roundNumber}`) },
    );
  };

  return (
    <Accordion expanded={expanded} onChange={(_, v) => setExpanded(v)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', pr: 1 }}>
          <Typography fontWeight="bold" sx={{ minWidth: 80 }}>
            Rodada {roundNumber}
          </Typography>
          {expanded && !isLoading && (
            <Chip size="small" label={`${matches.length} jogo(s)`} />
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Sincronizar esta rodada">
            <span>
              <IconButton
                size="small"
                disabled={syncRound.isPending}
                onClick={handleSync}
              >
                <SyncIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress size={20} />
          </Box>
        ) : matches.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Nenhum jogo atribuído — use Sincronizar ou adicione da lista de órfãos abaixo.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Casa</TableCell>
                  <TableCell>Fora</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {matches.map((m) => (
                  <TableRow key={m.matchId} hover>
                    <TableCell>{m.homeTeam?.name ?? '—'}</TableCell>
                    <TableCell>{m.awayTeam?.name ?? '—'}</TableCell>
                    <TableCell>
                      {m.date
                        ? new Date(m.date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={m.status} variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Remover da rodada">
                        <IconButton
                          size="small"
                          color="error"
                          disabled={removeMatch.isPending}
                          onClick={() => handleRemove(m.matchId)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

// ─── Orphaned match row ──────────────────────────────────────────────────────

const OrphanedRow: React.FC<{
  match: OrphanedMatch;
  leagueExternalId: number;
  seasonYear: number;
  onMessage: (msg: string) => void;
}> = ({ match, leagueExternalId, seasonYear, onMessage }) => {
  const [targetRound, setTargetRound] = useState(String(match.roundNumber ?? ''));
  const addMatch = useAddMatch();

  const handleAdd = () => {
    const roundNumber = Number(targetRound);
    if (!roundNumber) return;
    addMatch.mutate(
      { leagueExternalId, seasonYear, roundNumber, matchId: match.matchId },
      {
        onSuccess: (d) =>
          onMessage(
            d.added
              ? `Jogo adicionado à rodada ${roundNumber}`
              : `Jogo já está na rodada ${roundNumber}`,
          ),
        onError: (err) => onMessage(`Erro: ${err.message}`),
      },
    );
  };

  return (
    <TableRow hover>
      <TableCell>{match.homeTeam?.name ?? '—'}</TableCell>
      <TableCell>{match.awayTeam?.name ?? '—'}</TableCell>
      <TableCell>
        {match.date
          ? new Date(match.date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
          : '—'}
      </TableCell>
      <TableCell>
        <Chip size="small" label={match.status} variant="outlined" />
      </TableCell>
      <TableCell>{match.roundNumber ?? '—'}</TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
          <TextField
            size="small"
            type="number"
            label="Rodada"
            value={targetRound}
            onChange={(e) => setTargetRound(e.target.value)}
            sx={{ width: 80 }}
            inputProps={{ min: 1, max: 38 }}
          />
          <Tooltip title="Adicionar à rodada">
            <span>
              <IconButton
                size="small"
                color="primary"
                disabled={!targetRound || addMatch.isPending}
                onClick={handleAdd}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

// ─── Main tab ────────────────────────────────────────────────────────────────

const TOTAL_ROUNDS = 38;

const RoundGamesTab: React.FC = () => {
  const [leagueId, setLeagueId] = useState('71');
  const [seasonYear, setSeasonYear] = useState(String(new Date().getFullYear()));
  const [snack, setSnack] = useState<string | null>(null);

  const leagueExternalId = Number(leagueId) || undefined;
  const year = Number(seasonYear) || undefined;

  const { data: orphaned = [], isLoading: orphanedLoading } = useOrphanedMatches(
    leagueExternalId,
    year,
  );
  const syncAll = useSyncAllRounds();

  const handleSyncAll = () => {
    if (!leagueExternalId || !year) return;
    syncAll.mutate(
      { leagueExternalId, seasonYear: year },
      {
        onSuccess: (d) =>
          setSnack(`${d.rounds} rodada(s) sincronizada(s) — ${d.totalAdded} jogo(s) adicionado(s)`),
        onError: (err) => setSnack(`Erro: ${err.message}`),
      },
    );
  };

  return (
    <Box>
      {/* Controls */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <TextField
          label="ID Externo da Liga"
          type="number"
          value={leagueId}
          onChange={(e) => setLeagueId(e.target.value)}
          size="small"
          sx={{ width: 160 }}
          helperText="71 = Brasileirão"
        />
        <TextField
          label="Ano da Temporada"
          type="number"
          value={seasonYear}
          onChange={(e) => setSeasonYear(e.target.value)}
          size="small"
          sx={{ width: 120 }}
        />
        <Button
          variant="contained"
          startIcon={syncAll.isPending ? <CircularProgress size={16} color="inherit" /> : <SyncIcon />}
          disabled={!leagueExternalId || !year || syncAll.isPending}
          onClick={handleSyncAll}
        >
          Sincronizar Todas as Rodadas
        </Button>
      </Stack>

      {/* Rounds accordion */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Rodadas
      </Typography>
      <Box sx={{ mb: 4 }}>
        {Array.from({ length: TOTAL_ROUNDS }, (_, i) => i + 1).map((n) => (
          <RoundRow
            key={n}
            leagueExternalId={leagueExternalId ?? 0}
            seasonYear={year ?? 0}
            roundNumber={n}
            onMessage={setSnack}
          />
        ))}
      </Box>

      {/* Orphaned matches */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          Jogos Órfãos
        </Typography>
        {!orphanedLoading && (
          <Chip size="small" label={orphaned.length} color={orphaned.length > 0 ? 'warning' : 'default'} />
        )}
      </Stack>

      {orphanedLoading ? (
        <CircularProgress size={24} />
      ) : orphaned.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nenhum jogo órfão — todos os jogos estão atribuídos a uma rodada.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Casa</TableCell>
                <TableCell>Fora</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Rodada Real</TableCell>
                <TableCell align="right">Adicionar à Rodada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orphaned.map((m) => (
                <OrphanedRow
                  key={m.matchId}
                  match={m}
                  leagueExternalId={leagueExternalId ?? 0}
                  seasonYear={year ?? 0}
                  onMessage={setSnack}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snack != null}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnack(null)} sx={{ width: '100%' }}>
          {snack}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoundGamesTab;

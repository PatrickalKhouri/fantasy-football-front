import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
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
import EditIcon from '@mui/icons-material/Edit';
import BoltIcon from '@mui/icons-material/Bolt';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import {
  RoundFlow,
  RoundFlowEvent,
  RoundFlowStatus,
  useActivateRoundFlow,
  useCancelRoundFlow,
  useRoundFlows,
  useTriggerRoundFlowEvent,
  useUpdateRoundFlow,
} from '../../api/roundFlowQueries';

const STATUS_COLORS: Record<RoundFlowStatus, 'default' | 'success' | 'info' | 'warning' | 'secondary' | 'error'> = {
  PENDING: 'default',
  LIVE: 'success',
  SCORED: 'info',
  WAIVER_OPEN: 'warning',
  DONE: 'secondary',
  CANCELED: 'error',
};

function formatDt(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

// MUI datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time.
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const AdminRoundFlowPage: React.FC = () => {
  const { data: roundFlows = [], isLoading } = useRoundFlows();
  const activate = useActivateRoundFlow();
  const update = useUpdateRoundFlow();
  const trigger = useTriggerRoundFlowEvent();
  const cancel = useCancelRoundFlow();

  const [activateOpen, setActivateOpen] = useState(false);
  const [editing, setEditing] = useState<RoundFlow | null>(null);
  const [triggerMenu, setTriggerMenu] = useState<{ rf: RoundFlow; anchor: HTMLElement } | null>(null);

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Round Flow
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setActivateOpen(true)}
        >
          Activate Round
        </Button>
      </Stack>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>League</TableCell>
                <TableCell>Season</TableCell>
                <TableCell>Round</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Live Start</TableCell>
                <TableCell>Round End</TableCell>
                <TableCell>Waiver Open</TableCell>
                <TableCell>Waiver Resolve</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={9} align="center">Loading...</TableCell>
                </TableRow>
              )}
              {!isLoading && roundFlows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">No round flows yet — activate one to start.</TableCell>
                </TableRow>
              )}
              {roundFlows.map((rf) => (
                <TableRow key={rf.id} hover>
                  <TableCell>{rf.leagueExternalId}</TableCell>
                  <TableCell>{rf.seasonYear}</TableCell>
                  <TableCell>{rf.roundNumber}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={rf.status}
                      color={STATUS_COLORS[rf.status]}
                      variant={rf.status === 'PENDING' ? 'outlined' : 'filled'}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={rf.liveScoringStartedAt ? `Fired: ${formatDt(rf.liveScoringStartedAt)}` : ''}>
                      <span style={{ textDecoration: rf.liveScoringStartedAt ? 'line-through' : 'none' }}>
                        {formatDt(rf.liveScoringStartAt)}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={rf.scoredAt ? `Fired: ${formatDt(rf.scoredAt)}` : ''}>
                      <span style={{ textDecoration: rf.scoredAt ? 'line-through' : 'none' }}>
                        {formatDt(rf.roundEndAt)}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={rf.waiverWindowOpenedAt ? `Fired: ${formatDt(rf.waiverWindowOpenedAt)}` : ''}>
                      <span style={{ textDecoration: rf.waiverWindowOpenedAt ? 'line-through' : 'none' }}>
                        {formatDt(rf.waiverWindowStartAt)}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={rf.waiverResolvedAt ? `Fired: ${formatDt(rf.waiverResolvedAt)}` : ''}>
                      <span style={{ textDecoration: rf.waiverResolvedAt ? 'line-through' : 'none' }}>
                        {formatDt(rf.waiverResolveAt)}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit deadlines">
                      <span>
                        <IconButton
                          size="small"
                          disabled={rf.status === 'CANCELED' || rf.status === 'DONE'}
                          onClick={() => setEditing(rf)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Trigger event now">
                      <span>
                        <IconButton
                          size="small"
                          disabled={rf.status === 'CANCELED' || rf.status === 'DONE'}
                          onClick={(e) => setTriggerMenu({ rf, anchor: e.currentTarget })}
                        >
                          <BoltIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Cancel">
                      <span>
                        <IconButton
                          size="small"
                          disabled={
                            !!rf.liveScoringStartedAt ||
                            !!rf.scoredAt ||
                            !!rf.waiverWindowOpenedAt ||
                            !!rf.waiverResolvedAt ||
                            rf.status === 'CANCELED'
                          }
                          onClick={() => {
                            if (window.confirm(`Cancel round flow #${rf.id}?`)) cancel.mutate(rf.id);
                          }}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ActivateRoundDialog
        open={activateOpen}
        onClose={() => setActivateOpen(false)}
        onSubmit={(input) =>
          activate.mutate(input, {
            onSuccess: () => setActivateOpen(false),
          })
        }
        isPending={activate.isPending}
        errorMessage={activate.error?.message}
      />

      <EditDeadlinesDialog
        roundFlow={editing}
        onClose={() => setEditing(null)}
        onSubmit={(patch) =>
          update.mutate(
            { id: editing!.id, patch },
            { onSuccess: () => setEditing(null) },
          )
        }
        isPending={update.isPending}
        errorMessage={update.error?.message}
      />

      <Menu
        open={triggerMenu != null}
        anchorEl={triggerMenu?.anchor}
        onClose={() => setTriggerMenu(null)}
      >
        {(['live-start', 'round-end', 'waiver-open', 'waiver-resolve'] as RoundFlowEvent[]).map((event) => (
          <MenuItem
            key={event}
            onClick={() => {
              const rf = triggerMenu!.rf;
              setTriggerMenu(null);
              if (window.confirm(`Trigger '${event}' for round flow #${rf.id} now?`)) {
                trigger.mutate({ id: rf.id, event });
              }
            }}
          >
            {event}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const ActivateRoundDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { leagueExternalId: number; seasonYear: number; roundNumber: number }) => void;
  isPending: boolean;
  errorMessage?: string;
}> = ({ open, onClose, onSubmit, isPending, errorMessage }) => {
  const [leagueExternalId, setLeagueExternalId] = useState('71');
  const [seasonYear, setSeasonYear] = useState(String(new Date().getFullYear()));
  const [roundNumber, setRoundNumber] = useState('');

  const submit = () => {
    if (!leagueExternalId || !seasonYear || !roundNumber) return;
    onSubmit({
      leagueExternalId: Number(leagueExternalId),
      seasonYear: Number(seasonYear),
      roundNumber: Number(roundNumber),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Activate Round Flow</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="League External ID"
            type="number"
            value={leagueExternalId}
            onChange={(e) => setLeagueExternalId(e.target.value)}
            helperText="71 = Brasileirão Serie A"
            fullWidth
          />
          <TextField
            label="Season Year"
            type="number"
            value={seasonYear}
            onChange={(e) => setSeasonYear(e.target.value)}
            fullWidth
          />
          <TextField
            label="Round Number"
            type="number"
            value={roundNumber}
            onChange={(e) => setRoundNumber(e.target.value)}
            fullWidth
            autoFocus
          />
          {errorMessage && (
            <Typography color="error" variant="body2">{errorMessage}</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={isPending}>
          {isPending ? 'Activating...' : 'Activate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditDeadlinesDialog: React.FC<{
  roundFlow: RoundFlow | null;
  onClose: () => void;
  onSubmit: (patch: {
    liveScoringStartAt?: string;
    roundEndAt?: string;
    waiverWindowStartAt?: string;
    waiverResolveAt?: string;
  }) => void;
  isPending: boolean;
  errorMessage?: string;
}> = ({ roundFlow, onClose, onSubmit, isPending, errorMessage }) => {
  const [liveStart, setLiveStart] = useState('');
  const [roundEnd, setRoundEnd] = useState('');
  const [waiverOpen, setWaiverOpen] = useState('');
  const [waiverResolve, setWaiverResolve] = useState('');

  React.useEffect(() => {
    if (!roundFlow) return;
    setLiveStart(toLocalInput(roundFlow.liveScoringStartAt));
    setRoundEnd(toLocalInput(roundFlow.roundEndAt));
    setWaiverOpen(toLocalInput(roundFlow.waiverWindowStartAt));
    setWaiverResolve(toLocalInput(roundFlow.waiverResolveAt));
  }, [roundFlow]);

  if (!roundFlow) return null;

  const submit = () => {
    const patch: any = {};
    if (toLocalInput(roundFlow.liveScoringStartAt) !== liveStart && !roundFlow.liveScoringStartedAt) {
      patch.liveScoringStartAt = new Date(liveStart).toISOString();
    }
    if (toLocalInput(roundFlow.roundEndAt) !== roundEnd && !roundFlow.scoredAt) {
      patch.roundEndAt = new Date(roundEnd).toISOString();
    }
    if (toLocalInput(roundFlow.waiverWindowStartAt) !== waiverOpen && !roundFlow.waiverWindowOpenedAt) {
      patch.waiverWindowStartAt = new Date(waiverOpen).toISOString();
    }
    if (toLocalInput(roundFlow.waiverResolveAt) !== waiverResolve && !roundFlow.waiverResolvedAt) {
      patch.waiverResolveAt = new Date(waiverResolve).toISOString();
    }
    onSubmit(patch);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit Deadlines — Round {roundFlow.roundNumber}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Live Scoring Start"
            type="datetime-local"
            value={liveStart}
            onChange={(e) => setLiveStart(e.target.value)}
            disabled={!!roundFlow.liveScoringStartedAt}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Round End (scoring)"
            type="datetime-local"
            value={roundEnd}
            onChange={(e) => setRoundEnd(e.target.value)}
            disabled={!!roundFlow.scoredAt}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Waiver Window Open"
            type="datetime-local"
            value={waiverOpen}
            onChange={(e) => setWaiverOpen(e.target.value)}
            disabled={!!roundFlow.waiverWindowOpenedAt}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Waiver Resolve"
            type="datetime-local"
            value={waiverResolve}
            onChange={(e) => setWaiverResolve(e.target.value)}
            disabled={!!roundFlow.waiverResolvedAt}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          {errorMessage && (
            <Typography color="error" variant="body2">{errorMessage}</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminRoundFlowPage;

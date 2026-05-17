import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  IconButton,
  Alert,
  Avatar,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFantasyLeagueTeams } from '../api/fantasyLeagueQueries';
import { useRoster } from './userTeamRosterQueries';
import { useProposeTrade, TradeLegInput } from '../api/tradeQueries';
import { FantasyLeague } from '../api/fantasyLeagueQueries';

interface Props {
  open: boolean;
  onClose: () => void;
  fantasyLeague: FantasyLeague;
  myUserTeamId: number;
  seasonId: string;
  seasonYear: number;
}

interface LegDraft {
  senderTeamId: number;
  receiverTeamId: number;
  playerId: number | '';
  receiverPlayerId: number | '';
}

const PlayerSelectRow: React.FC<{
  teamId: number;
  seasonYear: number;
  value: number | '';
  onChange: (playerId: number | '') => void;
  label: string;
}> = ({ teamId, seasonYear, value, onChange, label }) => {
  const { data: roster = [] } = useRoster({ userTeamId: teamId, seasonYear });
  const occupied = roster.filter((s: any) => s.player);

  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value as number | '')}
      >
        <MenuItem value=""><em>Selecionar jogador</em></MenuItem>
        {occupied.map((slot: any) => (
          <MenuItem key={slot.player.id} value={slot.player.id}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src={slot.player.photo} sx={{ width: 24, height: 24 }} />
              <Typography variant="body2">{slot.player.name}</Typography>
              <Chip label={slot.player.position} size="small" sx={{ ml: 'auto' }} />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const ProposeTradeModal: React.FC<Props> = ({
  open,
  onClose,
  fantasyLeague,
  myUserTeamId,
  seasonId,
  seasonYear,
}) => {
  const { data: allTeams = [] } = useFantasyLeagueTeams(fantasyLeague.id);
  const otherTeams = allTeams.filter((t) => t.id !== myUserTeamId);

  const [legs, setLegs] = useState<LegDraft[]>([
    { senderTeamId: myUserTeamId, receiverTeamId: otherTeams[0]?.id ?? 0, playerId: '', receiverPlayerId: '' },
  ]);
  const [error, setError] = useState<string | null>(null);

  const proposeTrade = useProposeTrade(seasonId);

  const addLeg = () => {
    setLegs((prev) => [
      ...prev,
      { senderTeamId: myUserTeamId, receiverTeamId: otherTeams[0]?.id ?? 0, playerId: '', receiverPlayerId: '' },
    ]);
  };

  const removeLeg = (i: number) => setLegs((prev) => prev.filter((_, idx) => idx !== i));

  const updateLeg = (i: number, patch: Partial<LegDraft>) =>
    setLegs((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const handleSubmit = () => {
    setError(null);

    const tradeLegs: TradeLegInput[] = [];
    for (const leg of legs) {
      if (!leg.playerId) { setError('Selecione um jogador para enviar em cada troca'); return; }
      if (!leg.receiverPlayerId) { setError('Selecione um jogador para receber em cada troca'); return; }
      if (!leg.receiverTeamId) { setError('Selecione um time para trocar em cada troca'); return; }

      tradeLegs.push({
        senderTeamId: myUserTeamId,
        receiverTeamId: leg.receiverTeamId,
        playerId: leg.playerId as number,
      });
      tradeLegs.push({
        senderTeamId: leg.receiverTeamId,
        receiverTeamId: myUserTeamId,
        playerId: leg.receiverPlayerId as number,
      });
    }

    proposeTrade.mutate(
      { seasonId, proposedByUserTeamId: myUserTeamId, legs: tradeLegs },
      {
        onSuccess: () => {
          setLegs([{ senderTeamId: myUserTeamId, receiverTeamId: otherTeams[0]?.id ?? 0, playerId: '', receiverPlayerId: '' }]);
          onClose();
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message ?? err.message ?? 'Erro ao propor troca');
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Propor Troca</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {legs.map((leg, i) => (
          <Box key={i} mb={3}>
            {i > 0 && <Divider sx={{ mb: 2 }} />}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle2">Troca {i + 1}</Typography>
              {legs.length > 1 && (
                <IconButton size="small" onClick={() => removeLeg(i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
              <InputLabel>Trocar com</InputLabel>
              <Select
                value={leg.receiverTeamId || ''}
                label="Trocar com"
                onChange={(e) => updateLeg(i, { receiverTeamId: Number(e.target.value), receiverPlayerId: '' })}
              >
                {otherTeams.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name} ({t.user?.firstName} {t.user?.lastName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="flex" gap={1} alignItems="center">
              <Box flex={1}>
                <PlayerSelectRow
                  teamId={myUserTeamId}
                  seasonYear={seasonYear}
                  value={leg.playerId}
                  onChange={(v) => updateLeg(i, { playerId: v })}
                  label="Você envia"
                />
              </Box>
              <Typography sx={{ px: 1 }}>⇄</Typography>
              <Box flex={1}>
                {leg.receiverTeamId ? (
                  <PlayerSelectRow
                    teamId={leg.receiverTeamId}
                    seasonYear={seasonYear}
                    value={leg.receiverPlayerId}
                    onChange={(v) => updateLeg(i, { receiverPlayerId: v })}
                    label="Você recebe"
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">Selecione um time primeiro</Typography>
                )}
              </Box>
            </Box>
          </Box>
        ))}

        <Button startIcon={<AddIcon />} onClick={addLeg} size="small" sx={{ mt: 1 }}>
          Adicionar outro par de troca
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={proposeTrade.isPending}
        >
          {proposeTrade.isPending ? 'Enviando...' : 'Propor Troca'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProposeTradeModal;

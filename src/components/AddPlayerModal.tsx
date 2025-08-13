import React, { useMemo, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItemButton, ListItemText, ListItemAvatar,
  Avatar, Chip, Stack, Button, Typography, Alert,
} from '@mui/material';
import { useAddPlayer } from '../api/userTeamRosterMutations';
import { mapPositionToSlot, RosterSlot } from '../utils/positions';
import { POSITIONS_TRANSLATION } from './PlayerSelectModal';

type SlotType = 'starter' | 'bench';

export type UISlot = {
  index: number;
  slot: 'DEF' | 'MEI' | 'ATA' | 'FLEX';
  slotType: SlotType;
  allowedPositions: RosterSlot[]; // e.g. ['MEI'] or ['MEI','ATA'] for FLEX
  player: null | {
    id: number;
    name: string;
    photo: string;
    position: 'Defense' | 'Midfielder' | 'Attacker';
    team: { code: string };
  };
};

type AddPlayerModalProps = {
  open: boolean;
  onClose: () => void;
  // roster slots of the user's fantasy team (same shape you use elsewhere)
  slots: UISlot[];
  userTeamId: number;
  seasonYear: number;
  // player to be added (from the players table row)
  player: {
    id: number; // <- real player id
    name: string;
    photo: string;
    position: 'Defense' | 'Midfielder' | 'Attacker';
    teamCode?: string; // optional, for UI only
  };
  refetch: () => void; // refetch roster (and optionally the players list)
};

const labelFor = (slot: UISlot['slot'], allowed: RosterSlot[]) => {
  if (slot !== 'FLEX') return slot;
  return allowed.includes('MEI') && allowed.includes('ATA') ? 'M/A' : 'FLEX';
};

export default function AddPlayerModal({
  open, onClose, slots, userTeamId, seasonYear, player, refetch,
}: AddPlayerModalProps) {
  const [error, setError] = useState<string | null>(null);

  const playerSlot = mapPositionToSlot(player.position);

  // Only empty slots that accept this player's position (or FLEX that allows it)
  const emptyLegalTargets = useMemo(
    () =>
      slots.filter((s) => !s.player && s.allowedPositions.includes(playerSlot)),
    [slots, playerSlot]
  );

  const { mutate: addPlayer } = useAddPlayer({
    onSuccess: () => {
      refetch();
      onClose();
    },
  });

  const handleAdd = (slot: UISlot) => {
    addPlayer({
      body: {
        userTeamId,
        seasonYear,
        playerId: player.id,
        targetSlotIndex: slot.index,
        slot: slot.slot,
        slotType: slot.slotType,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Adicionar jogador</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={player.photo} />
            <div>
              <Typography fontWeight={700}>{player.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {POSITIONS_TRANSLATION[player.position as keyof typeof POSITIONS_TRANSLATION]}
              </Typography>
              {!!player.teamCode && (
                <Typography variant="body2" color="text.secondary">
                  {player.teamCode}
                </Typography>
              )}
            </div>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Selecionar vaga
          </Typography>

          <List dense>
            {emptyLegalTargets.map((slot) => (
              <ListItemButton key={slot.index} onClick={() => handleAdd(slot)}>
                <ListItemAvatar>
                  <Avatar /> {/* empty slot */}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label={`${labelFor(slot.slot, slot.allowedPositions)} • ${slot.slotType === 'starter' ? 'Titular' : 'Reserva'}`}
                      />
                      <Typography sx={{ ml: 1 }}>Vaga vazia</Typography>
                    </Stack>
                  }
                  secondary="Disponível"
                />
              </ListItemButton>
            ))}

            {emptyLegalTargets.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                Não há vagas compatíveis para este jogador.
              </Typography>
            )}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}

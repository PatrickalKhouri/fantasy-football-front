// src/components/TeamTab.tsx

import { Typography, Stack, CircularProgress, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRoster } from './userTeamRosterQueries';
import { useRemovePlayer } from '../api/userTeamRosterMutations';
import { SlotCard } from './SlotCard';
import { useMemo, useState } from 'react';
import PlayerSelectModal from './PlayerSelectModal';

interface Props {
    userTeam: any;
    seasonYear: number;
    initialRound?: number;
    fantasyLeague: any;
  }

  export const TeamTab: React.FC<Props> = ({ userTeam, fantasyLeague, seasonYear, initialRound = 1 }) => {
    const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [round, setRound] = useState(initialRound);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(null);

    const handleSlotClick = (slot: any) => {
      if (slot.player) {
        return true
      }
      setSelectedSlot(slot);
      setIsModalOpen(true);
    };
    const userTeamId = userTeam.id;

    const { data: slots, isLoading, refetch } = useRoster({ userTeamId, seasonYear, round });

    const { mutate: removePlayer } = useRemovePlayer({
      onSuccess: refetch,
    })

    const confirmRemovePlayer = (slotId: number, playerName?: string) => {
      setSelectedSlotId(slotId);
      setSelectedPlayerName(playerName || null);
      setConfirmOpen(true);
    };
  
    // Execute removal after confirmation
    const handleConfirmRemove = () => {
      if (selectedSlotId !== null) {
        removePlayer(selectedSlotId);
      }
      setConfirmOpen(false);
    };
  
    const starters = useMemo(() => slots?.filter((s: any) => s.slotType === 'starter') || [], [slots]);
    const bench = useMemo(() => slots?.filter((s: any) => s.slotType === 'bench') || [], [slots]);
  
    const goPrev = () => setRound((r) => Math.max(1, r - 1));
    const goNext = () => setRound((r) => r + 1); // max cap later
  
    return (
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            Rodada {round}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={goPrev} size="small">
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={goNext} size="small">
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
  
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6" fontWeight="bold">Titulares</Typography>
            <Stack spacing={1}>
              {starters.map((slot: any) => (
                <Paper onClick={() => handleSlotClick(slot)} sx={{ cursor: 'pointer' }}>
                  <SlotCard
                    key={slot.index}
                    slotType={slot.slotType}
                    allowedPositions={slot.allowedPositions}
                    player={slot.player}
                    onRemovePlayer={() => confirmRemovePlayer(slot.id, slot.player?.name)}
                    slot={slot}
                  />
                </Paper>
              ))}
            </Stack>
  
            <Typography variant="h6" fontWeight="bold" mt={3}>Reservas</Typography>
            <Stack spacing={1}>
              {bench.map((slot: any) => (
                <Paper onClick={() => handleSlotClick(slot)} sx={{ cursor: 'pointer' }}>
                  <SlotCard
                    key={slot.index}
                    slotType={slot.slotType}
                    allowedPositions={slot.allowedPositions}
                    player={slot.player}
                    onRemovePlayer={() => confirmRemovePlayer(slot.id, slot.player?.name)}
                    slot={slot}
                  />
                </Paper>
              ))}
            </Stack>
          </>
        )}
      <PlayerSelectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectPlayer={(player) => {
          setIsModalOpen(false);
        }}
        fantasyLeague={fantasyLeague}
        allowedPositions={selectedSlot?.allowedPositions || ['DEF', 'MEI', 'ATA']}
        userTeamId={userTeamId}
        seasonYear={seasonYear}
        slot={selectedSlot?.slot}
        slotType={selectedSlot?.slotType}
        refetch={refetch}
      />

<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar remoção</DialogTitle>
        <DialogContent>
          Tem certeza que deseja liberar {selectedPlayerName || 'este jogador'}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmRemove} color="error" variant="contained">
            Liberar
          </Button>
        </DialogActions>
      </Dialog>
      </Stack>
    );
  };

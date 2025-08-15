// src/components/TeamTab.tsx

import { Typography, Stack, CircularProgress, IconButton, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useRoster } from './userTeamRosterQueries';
import { useRemovePlayer } from '../api/userTeamRosterMutations';
import { SlotCard } from './SlotCard';
import { useMemo, useState } from 'react';
import PlayerSelectModal from './PlayerSelectModal';
import MovePlayerModal from './MovePlayerModal';
import { Slot } from './userTeamRosterQueries';
import { RosterSlotCard } from './SlotCard'
import { FantasyLeague } from '../api/fantasyLeagueQueries';
import { UserTeam } from '../api/userTeamsQueries';
import Loading from './Loading';

interface Props {
    userTeam: UserTeam;
    seasonYear: number;
    initialRound?: number;
    fantasyLeague: FantasyLeague;
  }

  export const TeamTab: React.FC<Props> = ({ userTeam, fantasyLeague, seasonYear, initialRound = 1 }) => {
    const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [round, setRound] = useState(initialRound);
    const [moveOpen, setMoveOpen] = useState(false);
    const [originIndex, setOriginIndex] = useState<number | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
    const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(null);

    

    const handleSlotClick = (slot: Slot) => {
      if (slot.player) {
        setOriginIndex(slot.index);
        setMoveOpen(true);
      } else {
        setSelectedSlot(slot);
        setIsModalOpen(true);
      }
    };
    const userTeamId = userTeam.id;

    const { data: slots, isLoading, refetch, isError, error } = useRoster({ userTeamId, seasonYear });

    const { mutate: removePlayer, isPending: isRemovingPlayer,} = useRemovePlayer({
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
  
    const starters = useMemo(() => slots?.filter((s: Slot) => s.slotType === 'starter') || [], [slots]);
    const bench = useMemo(() => slots?.filter((s: Slot) => s.slotType === 'bench') || [], [slots]);
  
    const goPrev = () => setRound((r) => Math.max(1, r - 1));
    const goNext = () => setRound((r) => r + 1);

    if (isLoading) return <Loading message="Carregando time..." />;

    if (isRemovingPlayer) return <Loading message="Removendo jogador..." />;
    
    if (isError) return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Algo deu errado ao carregar o time.'}
      </Alert>
    );

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
          <>
            <Typography variant="h6" fontWeight="bold">Titulares</Typography>
            <Stack spacing={1}>
              {starters.map((slot: Slot) => (
                <Paper onClick={() => handleSlotClick(slot)} sx={{ cursor: 'pointer' }}>
                  <SlotCard
                    key={slot.index}
                    slotType={slot.slotType}
                    allowedPositions={slot.allowedPositions as RosterSlotCard[]}
                    player={slot.player}
                    onRemovePlayer={() => confirmRemovePlayer(slot.id, slot.player?.name)}
                    slot={slot}
                  />
                </Paper>
              ))}
            </Stack>
  
            <Typography variant="h6" fontWeight="bold" mt={3}>Reservas</Typography>
            <Stack spacing={1}>
              {bench.map((slot: Slot) => (
                <Paper onClick={() => handleSlotClick(slot)} sx={{ cursor: 'pointer' }}>
                  <SlotCard
                    key={slot.index}
                    slotType={slot.slotType}
                    allowedPositions={slot.allowedPositions as RosterSlotCard[]}
                    player={slot.player}
                    onRemovePlayer={() => confirmRemovePlayer(slot.id, slot.player?.name)}
                    slot={slot}
                  />
                </Paper>
              ))}
            </Stack>
          </>
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
        targetSlotIndex={selectedSlot?.index}
      />

      {originIndex !== null && (
        <MovePlayerModal
          open={moveOpen}
          onClose={() => setMoveOpen(false)}
          slots={slots || []}
          originIndex={originIndex}
          userTeamId={userTeam.id}
          seasonYear={seasonYear}
          refetch={refetch}
        />
      )}

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

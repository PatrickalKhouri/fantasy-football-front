// src/components/TeamTab.tsx

import { Typography, Stack, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useVirtualRoster } from './userTeamRosterQueries';
import { SlotCard } from './SlotCard';
import { useMemo, useState } from 'react';

interface Props {
    userTeamId: number;
    seasonYear: number;
    initialRound?: number;
  }

  export const TeamTab: React.FC<Props> = ({ userTeamId, seasonYear, initialRound = 1 }) => {
    console.log(userTeamId, seasonYear, initialRound);
    const [round, setRound] = useState(initialRound);
  
    const { data: slots, isLoading } = useVirtualRoster({ userTeamId, seasonYear, round });
  
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
                <SlotCard
                  key={slot.index}
                  slotType={slot.slotType}
                  allowedPositions={slot.allowedPositions}
                  player={slot.player}
                />
              ))}
            </Stack>
  
            <Typography variant="h6" fontWeight="bold" mt={3}>Reservas</Typography>
            <Stack spacing={1}>
              {bench.map((slot: any) => (
                <SlotCard
                  key={slot.index}
                  slotType={slot.slotType}
                  allowedPositions={slot.allowedPositions}
                  player={slot.player}
                />
              ))}
            </Stack>
          </>
        )}
      </Stack>
    );
  };

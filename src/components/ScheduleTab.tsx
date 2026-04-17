import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import { useScheduleBySeason } from '../api/fantasyMatchupQueries';
import MatchupCard from './MatchupCard';

interface Props {
  seasonId: string | undefined;
}

const ScheduleTab: React.FC<Props> = ({ seasonId }) => {
  const { data: schedule, isLoading } = useScheduleBySeason(seasonId);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  if (!seasonId) {
    return (
      <Typography color="text.secondary" textAlign="center" py={6}>
        Temporada não encontrada.
      </Typography>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!schedule || schedule.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" py={6}>
        A tabela ainda não foi gerada. Ela será gerada automaticamente ao fim do draft.
      </Typography>
    );
  }

  const activeRound = selectedRound ?? schedule[0].roundNumber;
  const currentRound = schedule.find((r) => r.roundNumber === activeRound);

  return (
    <Box>
      {/* Round selector */}
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Stack direction="row" spacing={1} sx={{ minWidth: 'max-content', px: 0.5 }}>
          {schedule.map(({ roundNumber }) => (
            <Button
              key={roundNumber}
              size="small"
              variant={roundNumber === activeRound ? 'contained' : 'outlined'}
              onClick={() => setSelectedRound(roundNumber)}
              sx={{ borderRadius: 50, minWidth: 48, textTransform: 'none', fontWeight: 600 }}
            >
              {roundNumber}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Matchups */}
      <Box mt={3}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Rodada {activeRound}
        </Typography>
        <Stack spacing={1.5}>
          {currentRound?.matchups.map((matchup) => (
            <MatchupCard key={matchup.id} matchup={matchup} />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default ScheduleTab;

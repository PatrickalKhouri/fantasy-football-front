import React from 'react';
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { usePlayoffMatchups, FantasyMatchupDto } from '../api/fantasyMatchupQueries';
import MatchupCard from './MatchupCard';

const STAGE_NAMES: Record<number, string> = {
  3: 'Quartas de Final',
  2: 'Semifinal',
  1: 'Final',
};

interface Props {
  seasonId: string | undefined;
}

const PlayoffBracket: React.FC<Props> = ({ seasonId }) => {
  const { data: matchups, isLoading } = usePlayoffMatchups(seasonId);

  if (!seasonId) return null;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!matchups || matchups.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" py={4}>
        Os playoffs ainda não foram gerados.
      </Typography>
    );
  }

  // Group by stage (highest stage = earliest round, displayed first)
  const byStage = new Map<number, FantasyMatchupDto[]>();
  for (const m of matchups) {
    const stage = (m as any).playoffStage ?? 0;
    const group = byStage.get(stage) ?? [];
    group.push(m);
    byStage.set(stage, group);
  }

  const stages = Array.from(byStage.keys()).sort((a, b) => b - a);

  return (
    <Stack spacing={4}>
      {stages.map((stage) => (
        <Box key={stage}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            {STAGE_NAMES[stage] ?? `Estágio ${stage}`}
          </Typography>
          <Stack spacing={1.5}>
            {byStage.get(stage)!.map((m) => (
              <MatchupCard key={m.id} matchup={m} />
            ))}
          </Stack>
          <Divider sx={{ mt: 3 }} />
        </Box>
      ))}
    </Stack>
  );
};

export default PlayoffBracket;

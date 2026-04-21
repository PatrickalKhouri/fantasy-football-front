import React, { useState, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useScheduleBySeason, ScheduleByRoundDto, FantasyMatchupDto } from '../api/fantasyMatchupQueries';
import MatchupCard from './MatchupCard';
import MatchupDetailModal from './MatchupDetailModal';
import PlayoffBracket from './PlayoffBracket';

interface Props {
  seasonId: string | undefined;
  userTeamId?: number;
  seasonYear?: number;
}

function detectCurrentRound(schedule: ScheduleByRoundDto[]): number {
  // First round where at least one matchup is not completed — that's the active round
  const active = schedule.find((r) =>
    r.matchups.some((m) => m.status !== 'completed' && m.status !== 'bye'),
  );
  // Fall back to last round if all are done
  return active?.roundNumber ?? schedule[schedule.length - 1].roundNumber;
}

const ScheduleTab: React.FC<Props> = ({ seasonId, userTeamId, seasonYear }) => {
  const { data: schedule, isLoading } = useScheduleBySeason(seasonId);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [selectedMatchup, setSelectedMatchup] = useState<FantasyMatchupDto | null>(null);

  const currentRoundNumber = useMemo(
    () => (schedule && schedule.length > 0 ? detectCurrentRound(schedule) : null),
    [schedule],
  );

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

  const rounds = schedule.map((r) => r.roundNumber);
  const activeRound = selectedRound ?? currentRoundNumber ?? rounds[0];
  const activeIndex = rounds.indexOf(activeRound);
  const currentRound = schedule.find((r) => r.roundNumber === activeRound);

  const isMyMatchup = (m: { homeTeamId: number | null; awayTeamId: number | null }) =>
    userTeamId != null && (m.homeTeamId === userTeamId || m.awayTeamId === userTeamId);

  const sortedMatchups = currentRound
    ? [...currentRound.matchups].sort((a, b) => (isMyMatchup(b) ? 1 : 0) - (isMyMatchup(a) ? 1 : 0))
    : [];

  return (
    <Box>
      {/* Round selector */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          size="small"
          disabled={activeIndex <= 0}
          onClick={() => setSelectedRound(rounds[activeIndex - 1])}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Select
          value={activeRound}
          onChange={(e) => setSelectedRound(Number(e.target.value))}
          size="small"
          sx={{ minWidth: 160 }}
          renderValue={(val) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography fontWeight={600}>Rodada {val}</Typography>
              {val === currentRoundNumber && (
                <Chip label="Atual" size="small" color="primary" sx={{ height: 18, fontSize: 11 }} />
              )}
            </Box>
          )}
        >
          {rounds.map((r) => (
            <MenuItem key={r} value={r}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Rodada {r}
                {r === currentRoundNumber && (
                  <Chip label="Atual" size="small" color="primary" sx={{ height: 18, fontSize: 11 }} />
                )}
              </Box>
            </MenuItem>
          ))}
        </Select>

        <IconButton
          size="small"
          disabled={activeIndex >= rounds.length - 1}
          onClick={() => setSelectedRound(rounds[activeIndex + 1])}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Stack>

      {/* Matchups */}
      <Box mt={3}>
        <Stack spacing={1.5}>
          {sortedMatchups.map((matchup) => (
            <MatchupCard
              key={matchup.id}
              matchup={matchup}
              highlighted={isMyMatchup(matchup)}
              onClick={matchup.status !== 'bye' ? () => setSelectedMatchup(matchup) : undefined}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" fontWeight={700} mb={2}>
        Playoffs
      </Typography>
      <PlayoffBracket seasonId={seasonId} />

      <MatchupDetailModal
        matchup={selectedMatchup}
        onClose={() => setSelectedMatchup(null)}
        userTeamId={userTeamId}
        seasonYear={seasonYear}
      />
    </Box>
  );
};

export default ScheduleTab;

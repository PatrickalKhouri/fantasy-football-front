import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { FantasyMatchupDto } from '../api/fantasyMatchupQueries';

interface Props {
  matchup: FantasyMatchupDto;
}

const MatchupCard: React.FC<Props> = ({ matchup }) => {
  const homeName = matchup.homeTeamName ?? 'Ghost';
  const awayName = matchup.awayTeamName ?? 'Ghost';

  if (matchup.status === 'bye') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: 'action.hover',
          opacity: 0.6,
        }}
      >
        <Typography fontWeight={600} color="text.secondary">
          {homeName}
        </Typography>
        <Chip label="BYE" size="small" variant="outlined" />
      </Box>
    );
  }

  const homeScore = matchup.homeScore != null ? matchup.homeScore : '—';
  const awayScore = matchup.awayScore != null ? matchup.awayScore : '—';

  const homeWon =
    matchup.homeScore != null &&
    matchup.awayScore != null &&
    matchup.homeScore > matchup.awayScore;
  const awayWon =
    matchup.homeScore != null &&
    matchup.awayScore != null &&
    matchup.awayScore > matchup.homeScore;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        gap: 1,
      }}
    >
      <Typography
        fontWeight={homeWon ? 700 : 400}
        sx={{ flex: 1, textAlign: 'right', color: matchup.isGhost ? 'text.disabled' : 'text.primary' }}
      >
        {homeName}
      </Typography>

      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', minWidth: 80, justifyContent: 'center' }}>
        <Typography fontWeight={700} color={homeWon ? 'success.main' : 'text.secondary'}>
          {homeScore}
        </Typography>
        <Typography color="text.disabled">–</Typography>
        <Typography fontWeight={700} color={awayWon ? 'success.main' : 'text.secondary'}>
          {awayScore}
        </Typography>
      </Box>

      <Typography
        fontWeight={awayWon ? 700 : 400}
        sx={{ flex: 1, color: matchup.isGhost ? 'text.disabled' : 'text.primary' }}
      >
        {awayName}
      </Typography>
    </Box>
  );
};

export default MatchupCard;

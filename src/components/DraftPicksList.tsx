import React from 'react';
import { Avatar, Box, Chip, Divider, Typography } from '@mui/material';
import { DraftPick } from '../api/draftQueries';

interface Props {
  picks: DraftPick[];
  totalRounds: number;
}

export default function DraftPicksList({ picks, totalRounds }: Props) {
  const completedPicks = picks.filter((p) => !!p.pickedAt && !p.isGhost);

  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1);

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.secondary">
        ESCOLHAS
      </Typography>
      {rounds.map((round) => {
        const roundPicks = completedPicks.filter((p) => p.round === round);
        if (roundPicks.length === 0) return null;

        return (
          <Box key={round} mb={1.5}>
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              Rodada {round}
            </Typography>
            <Divider sx={{ mb: 0.5 }} />
            {roundPicks.map((pick) => (
              <Box
                key={pick.id}
                display="flex"
                alignItems="center"
                gap={1}
                py={0.5}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ minWidth: 22 }}
                >
                  {pick.overallPick}.
                </Typography>
                {pick.player?.photo && (
                  <Avatar src={pick.player.photo} sx={{ width: 24, height: 24 }} />
                )}
                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" noWrap fontWeight={500}>
                    {pick.player?.name ?? '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {pick.userTeam?.name}
                  </Typography>
                </Box>
                {pick.isAutoDrafted && (
                  <Chip label="Auto" size="small" color="warning" />
                )}
              </Box>
            ))}
          </Box>
        );
      })}

      {completedPicks.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhuma escolha ainda.
        </Typography>
      )}
    </Box>
  );
}

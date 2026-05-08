import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography,
  Box, Avatar, Chip, Divider, CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { WaiverClaim } from '../api/waiverQueries';

interface Props {
  open: boolean;
  onClose: () => void;
  claims: WaiverClaim[];
  isLoading: boolean;
}

interface PlayerGroup {
  targetPlayer: WaiverClaim['targetPlayer'];
  resolvedAt: string;
  winner: WaiverClaim | null;
  losers: WaiverClaim[];
}

function groupByPlayer(claims: WaiverClaim[]): PlayerGroup[] {
  // Group by targetPlayer.id + resolvedAt date (same resolution batch)
  const map = new Map<string, PlayerGroup>();

  for (const claim of claims) {
    const day = claim.resolvedAt ? claim.resolvedAt.substring(0, 10) : 'unknown';
    const key = `${claim.targetPlayer.id}:${day}`;

    if (!map.has(key)) {
      map.set(key, { targetPlayer: claim.targetPlayer, resolvedAt: claim.resolvedAt ?? '', winner: null, losers: [] });
    }
    const group = map.get(key)!;
    if (claim.status === 'WON') {
      group.winner = claim;
    } else {
      group.losers.push(claim);
    }
  }

  const groups = Array.from(map.values());

  // Sort losers by bid desc within each group
  groups.forEach((group) => {
    group.losers.sort((a: WaiverClaim, b: WaiverClaim) => Number(b.bidAmount) - Number(a.bidAmount));
  });

  // Sort groups by resolvedAt desc (most recent first)
  return groups.sort(
    (a: PlayerGroup, b: PlayerGroup) => new Date(b.resolvedAt).getTime() - new Date(a.resolvedAt).getTime(),
  );
}

export default function WaiverHistoryModal({ open, onClose, claims, isLoading }: Props) {
  const groups = groupByPlayer(claims);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Histórico do Mercado
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={32} />
          </Box>
        ) : groups.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            Nenhuma resolução de mercado ainda.
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={3}>
            {groups.map((group, i) => (
              <Box key={i}>
                {/* Player header */}
                <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                  <Avatar src={group.targetPlayer.photo} sx={{ width: 36, height: 36 }} />
                  <Box>
                    <Typography fontWeight={700}>{group.targetPlayer.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {group.targetPlayer.position} ·{' '}
                      {group.resolvedAt
                        ? new Date(group.resolvedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                        : '—'}
                    </Typography>
                  </Box>
                </Box>

                {/* Winner */}
                {group.winner ? (
                  <Box
                    display="flex" alignItems="center" justifyContent="space-between"
                    sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200', borderRadius: 1, px: 1.5, py: 1, mb: 1 }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <EmojiEventsIcon fontSize="small" color="success" />
                      <Typography variant="body2" fontWeight={700}>{group.winner.userTeam.name}</Typography>
                      {group.winner.dropPlayer && (
                        <Typography variant="caption" color="text.secondary">
                          · liberou {group.winner.dropPlayer.name}
                        </Typography>
                      )}
                    </Box>
                    <Chip label={`R$ ${Number(group.winner.bidAmount).toFixed(0)}`} color="success" size="small" />
                  </Box>
                ) : (
                  <Typography variant="caption" color="error">Nenhum vencedor (falha na execução)</Typography>
                )}

                {/* Losers */}
                {group.losers.map((loser) => (
                  <Box
                    key={loser.id}
                    display="flex" alignItems="center" justifyContent="space-between"
                    sx={{ px: 1.5, py: 0.75 }}
                  >
                    <Typography variant="body2" color="text.secondary">{loser.userTeam.name}</Typography>
                    <Chip label={`R$ ${Number(loser.bidAmount).toFixed(0)}`} size="small" variant="outlined" />
                  </Box>
                ))}

                {i < groups.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

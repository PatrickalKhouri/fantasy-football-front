import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton, Typography,
  Box, Avatar, Chip, Divider, CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MarketTransaction } from '../api/waiverQueries';

interface Props {
  open: boolean;
  onClose: () => void;
  transactions: MarketTransaction[];
  isLoading: boolean;
}

function groupByDay(transactions: MarketTransaction[]): { day: string; items: MarketTransaction[] }[] {
  const map = new Map<string, MarketTransaction[]>();
  for (const t of transactions) {
    const day = t.transactedAt.substring(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(t);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([day, items]) => ({ day, items }));
}

function typeLabel(type: MarketTransaction['type']): { label: string; color: 'default' | 'primary' | 'success' | 'warning' } {
  switch (type) {
    case 'WAIVER_WIN': return { label: 'Waiver', color: 'primary' };
    case 'FREE_AGENT_ADD': return { label: 'Mercado', color: 'success' };
    case 'DROP': return { label: 'Liberação', color: 'warning' };
    case 'DRAFT_PICK': return { label: 'Draft', color: 'default' };
  }
}

function TransactionRow({ t }: { t: MarketTransaction }) {
  const { label, color } = typeLabel(t.type);
  const mainPlayer = t.playerIn ?? t.playerOut;

  return (
    <Box display="flex" alignItems="center" gap={1.5} py={1}>
      <Avatar src={mainPlayer?.photo} sx={{ width: 32, height: 32 }} />
      <Box flex={1} minWidth={0}>
        <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap">
          <Typography variant="body2" fontWeight={600} noWrap>{t.userTeam.name}</Typography>
          <Chip label={label} color={color} size="small" sx={{ height: 18, fontSize: 11 }} />
        </Box>
        <Typography variant="caption" color="text.secondary" component="div">
          {t.playerIn && (
            <span>adicionou <strong>{t.playerIn.name}</strong>{t.playerIn.position ? ` (${t.playerIn.position})` : ''}</span>
          )}
          {t.playerIn && t.playerOut && <span> · liberou </span>}
          {!t.playerIn && t.playerOut && <span>liberou </span>}
          {t.playerOut && <strong>{t.playerOut.name}</strong>}
        </Typography>
      </Box>
      {t.bidAmount && (
        <Chip label={`R$ ${Number(t.bidAmount).toFixed(0)}`} color="primary" size="small" variant="outlined" />
      )}
    </Box>
  );
}

export default function WaiverHistoryModal({ open, onClose, transactions, isLoading }: Props) {
  const groups = groupByDay(transactions);

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
            Nenhuma transação registrada ainda.
          </Typography>
        ) : (
          <Box display="flex" flexDirection="column" gap={0}>
            {groups.map(({ day, items }, gi) => (
              <Box key={day}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  {new Date(day + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </Typography>
                {items.map((t) => (
                  <TransactionRow key={t.id} t={t} />
                ))}
                {gi < groups.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

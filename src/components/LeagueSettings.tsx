import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LeagueSettingsModal from './LeagueSettingsModal';

interface Props {
  leagueId: number;
  isOwner?: boolean;
  onEdit?: () => void;
  league: any;
}

const LeagueSettings: React.FC<Props> = ({ isOwner = false, onEdit, league }) => {
  const [modalOpen, setModalOpen] = useState(false);  
  const settings = {
    numberOfTeams: 8,
    playoffs: '4 times, começa na rodada 14',
    clearWaivers: 'Quarta-feira às 4h',
    tradeDeadline: 'Rodada 10 - Trocas não permitidas após isso',
    irSlots: '2 vagas',
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        mt: 3,
        borderRadius: 2,
        overflowX: 'auto',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Configurações da Liga
        </Typography>
        {isOwner && (
          <IconButton onClick={() => setModalOpen(true)} size="small">
            <EditIcon />
          </IconButton>
        )}
      </Box>

      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={{ color: 'text.secondary' }}>Número de Times</TableCell>
            <TableCell>{settings.numberOfTeams}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ color: 'text.secondary' }}>Playoffs</TableCell>
            <TableCell>{settings.playoffs}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ color: 'text.secondary' }}>Limpar Waivers</TableCell>
            <TableCell>{settings.clearWaivers}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ color: 'text.secondary' }}>Deadline de Trocas</TableCell>
            <TableCell>{settings.tradeDeadline}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ color: 'text.secondary' }}>Vagas para Lesionados</TableCell>
            <TableCell>{settings.irSlots}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <LeagueSettingsModal open={modalOpen} onClose={() => setModalOpen(false)} league={league} />
    </Paper>
  );
};

export default LeagueSettings;

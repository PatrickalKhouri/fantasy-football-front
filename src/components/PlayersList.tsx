// components/PlayersList.tsx
import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  TablePagination,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { usePlayers } from '../api/playersQueries';

const POSITIONS = ['ALL', 'GK', 'DEF', 'MID', 'FWD'];

interface PlayersListProps {
  fantasyLeague: any;
}

const PlayersList: React.FC<PlayersListProps> = ({ fantasyLeague }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [position, setPosition] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
;

  const { data, isLoading } = usePlayers({
    position: position === 'ALL' ? undefined : position,
    search,
    page: page + 1,
    limit: rowsPerPage,
    sortBy: 'goals',
    order: 'desc',
    leagueId: fantasyLeague.league.id,
  });

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Jogadores
      </Typography>

      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2} mb={3}>
        <ToggleButtonGroup
          value={position}
          exclusive
          onChange={(_, newPos) => newPos && setPosition(newPos)}
          size="small"
        >
          {POSITIONS.map((pos) => (
            <ToggleButton key={pos} value={pos}>
              {pos}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <TextField
          placeholder="Buscar jogador"
          size="small"
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Jogador</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Posição</TableCell>
            <TableCell align="right">Gols</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Carregando...</TableCell>
            </TableRow>
          ) : (
            data?.data.map((player: any) => (
              <TableRow key={player.player_id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={player.player_photo} alt={player.player_name} />
                    {player.player_name}
                  </Box>
                </TableCell>
                <TableCell>{player.team_name}</TableCell>
                <TableCell>{player.player_position}</TableCell>
                <TableCell align="right">{player.goals}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={data?.meta.total || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default PlayersList;

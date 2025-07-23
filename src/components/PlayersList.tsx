import React, { useState, useEffect, useRef } from 'react';
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

const POSITIONS = ['Todos', 'DEF', 'MEI', 'ATA'];

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

  const { data, isLoading, isFetching } = usePlayers({
    position: position === 'ALL' ? undefined : position,
    search,
    page: page + 1,
    limit: rowsPerPage,
    sortBy: 'goals',
    order: 'desc',
    leagueId: fantasyLeague.league.id,
  });

  // 🔁 Cache last valid data
  const previousDataRef = useRef<any[]>([]);
  useEffect(() => {
    if (data?.data?.length) {
      previousDataRef.current = data.data;
    }
  }, [data]);

  const players = data?.data?.length ? data.data : previousDataRef.current;
  const totalCount = data?.meta?.total || previousDataRef.current.length;

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

      <Box
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        gap={2}
        mb={3}
      >
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

      <Box
        sx={{
          opacity: isFetching ? 0.6 : 1,
          transition: 'opacity 300ms ease-in-out',
        }}
      >
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
            {players.length ? (
              players.map((player: any) => (
                <TableRow key={player.player_id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={player.player_photo}
                        alt={player.player_name}
                      />
                      {player.player_name}
                    </Box>
                  </TableCell>
                  <TableCell>{player.team_name}</TableCell>
                  <TableCell>{player.player_position}</TableCell>
                  <TableCell align="right">{player.goals}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>Nenhum jogador encontrado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default PlayersList;

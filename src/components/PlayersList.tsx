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
  InputAdornment,
  IconButton,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { usePlayers, usePlayersFilters } from '../api/playersQueries';

const POSITION_OPTIONS = [
  { value: 'ALL', label: 'TODOS' },
  { value: 'DEF', label: 'DEF' },
  { value: 'MEI', label: 'MEI' },
  { value: 'ATA', label: 'ATA' },
];

const POSITIONS_TRANSLATION = {
  'Defender': 'Defensor',
  'Midfielder': 'Meio-Campo',
  'Attacker': 'Atacante',
  'Goalkeeper': 'Goleiro',
  'ALL': 'Todos',
  'Defense': 'Defesa', // for synthetic team players
};

const POSITIONS_BACKEND_MAP = {
  'DEF': 'Defense',
  'MEI': 'Midfielder',
  'ATA': 'Attacker',
};

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
  const [onlyFreeAgents, setOnlyFreeAgents] = useState(false);
  const [teamId, setTeamId] = useState<number | null>(null);

  const { data, isLoading, isFetching } = usePlayers({
    position: position === 'ALL'
      ? undefined
      : [POSITIONS_BACKEND_MAP[position as keyof typeof POSITIONS_BACKEND_MAP]],
    teamId: teamId ?? undefined,        // <-- only change here
    search,
    page: page + 1,
    limit: rowsPerPage,
    sortBy: 'goals',
    order: 'desc',
    leagueId: fantasyLeague.league.id,
    fantasyLeagueId: fantasyLeague.id,
    onlyFreeAgents,
  });

  const previousDataRef = useRef<any[]>([]);
  useEffect(() => {
    if (data?.data?.length) {
      previousDataRef.current = data.data;
    }
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [position, search, onlyFreeAgents]);

  const players = data?.data?.length ? data.data : previousDataRef.current;
  const totalCount = data?.meta?.total || previousDataRef.current.length;

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const { data: filters, isLoading: loadingFilters } = usePlayersFilters({
    leagueId: fantasyLeague.league.id,
    seasonYear: 2023,
  });
  

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
          onChange={(_, v) => setPosition(v ?? position)}
          size="small"
        >
          {POSITION_OPTIONS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={onlyFreeAgents}
          exclusive
          onChange={(_, v) => setOnlyFreeAgents(Boolean(v))}
          size="small"
        >
          <ToggleButton value={false}>Todos</ToggleButton>
          <ToggleButton value={true}>Jogadores não escalados</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="team-filter-label">Time</InputLabel>
          <Select<number | ''>
            labelId="team-filter-label"
            label="Time"
            value={teamId ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setTeamId(v === '' ? null : Number(v));
            }}
          >
            <MenuItem value="">
              <em>Todos os times</em>
            </MenuItem>
            {filters?.teams?.map((t: any) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          placeholder="Buscar jogador"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{
            endAdornment: search && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearch('')}
                  edge="end"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
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
              <TableCell align="center">Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.length ? (
              players.map((player: any) => (
                <TableRow
                  key={player.player_id}
                  hover={!player.is_rostered}
                  sx={{
                    backgroundColor: player.is_rostered
                      ? 'rgba(130,127,127,0.16)'
                      : 'transparent',
                    '& > td': { backgroundColor: 'inherit' },
                    cursor: player.is_rostered ? 'not-allowed' : 'pointer',
                    opacity: player.is_rostered ? 0.9 : 1,
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1} position="relative">
                      <Box position="relative" display="inline-block">
                        <Avatar
                          src={player.player_photo}
                          alt={player.player_name}
                        />
                        {player.is_rostered && (
                          <LockIcon
                            fontSize="small"
                            style={{
                              position: 'absolute',
                              right: -4,
                              bottom: -4,
                              width: 16,
                              height: 16,
                            }}
                          />
                        )}
                      </Box>
                      {player.player_name}
                    </Box>
                  </TableCell>
                  <TableCell>{player.team_name}</TableCell>
                  <TableCell>
                    {POSITIONS_TRANSLATION[
                      player.player_position as keyof typeof POSITIONS_TRANSLATION
                    ]}
                  </TableCell>
                  <TableCell align="right">{player.goals}</TableCell>
                  <TableCell align="center">
                    {player.is_rostered ? (
                      <Tooltip title="Jogador já escalado">
                        <Chip
                          size="small"
                          icon={<LockIcon fontSize="small" />}
                          label="Escalado"
                          variant="outlined"
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Adicionar ao elenco">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleAddPlayer(player);
                          }}
                        >
                          <PersonAddAlt1Icon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>Nenhum jogador encontrado.</TableCell>
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

import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { usePlayers, usePlayersFilters } from '../api/playersQueries';
import { DraftPick } from '../api/draftQueries';
import { mapPositionToSlot } from '../utils/positions';

const POSITION_OPTIONS = [
  { value: 'ALL', label: 'TODOS' },
  { value: 'DEF', label: 'DEF' },
  { value: 'MEI', label: 'MEI' },
  { value: 'ATA', label: 'ATA' },
];

const POSITIONS_BACKEND_MAP: Record<string, string> = {
  DEF: 'Defense',
  MEI: 'Midfielder',
  ATA: 'Attacker',
};

const POSITIONS_TRANSLATION: Record<string, string> = {
  Defender: 'Defensor',
  Midfielder: 'Meio-Campo',
  Attacker: 'Atacante',
  Goalkeeper: 'Goleiro',
  Defense: 'Defesa',
};

interface Props {
  leagueId: number;
  realLeagueId: number | undefined;
  season: number;
  picks: DraftPick[];
  onPick: (playerId: number) => void;
  disabled?: boolean;
  fullPositions?: Set<string>;
}

export default function DraftPlayerSearch({ leagueId, realLeagueId, picks, onPick, disabled, fullPositions }: Props) {
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('ALL');
  const [teamId, setTeamId] = useState<number | ''>('');

  const draftedIds = new Set(
    picks.filter((p) => p.player).map((p) => p.player!.id),
  );

  const { data, isLoading } = usePlayers({
    search: search || undefined,
    position: position === 'ALL' ? undefined : [POSITIONS_BACKEND_MAP[position]],
    teamId: teamId || undefined,
    page: 1,
    limit: 50,
    sortBy: 'name',
    order: 'asc',
    leagueId: realLeagueId,
    fantasyLeagueId: leagueId,
    onlyFreeAgents: false,
  });

  const { data: filters } = usePlayersFilters({
    leagueId: realLeagueId,
  });

  const players = (data?.data ?? []).filter((p) => !draftedIds.has(p.player_id));

  return (
    <Box>
      {/* Filters row */}
      <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
        <ToggleButtonGroup
          value={position}
          exclusive
          onChange={(_, v) => { if (v) setPosition(v); }}
          size="small"
        >
          {POSITION_OPTIONS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value} sx={{ px: 1.5 }}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="draft-team-label">Time</InputLabel>
          <Select
            labelId="draft-team-label"
            label="Time"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value as number | '')}
          >
            <MenuItem value=""><em>Todos</em></MenuItem>
            {filters?.teams?.map((t) => (
              <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Buscar jogador..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 1 }}
      />

      {isLoading && (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <List dense disablePadding sx={{ maxHeight: 520, overflowY: 'auto' }}>
        {players.map((player) => (
          <ListItem
            key={player.player_id}
            disableGutters
            secondaryAction={
              <Button
                size="small"
                variant="contained"
                disabled={disabled || (!!fullPositions && fullPositions.has(mapPositionToSlot(player.player_position) ?? ''))}
                onClick={() => onPick(player.player_id)}
                sx={{ textTransform: 'none', borderRadius: 4, minWidth: 72 }}
              >
                Escolher
              </Button>
            }
          >
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar src={player.player_photo} sx={{ width: 32, height: 32 }} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={500} noWrap>
                  {player.player_name}
                </Typography>
              }
              secondary={
                <Typography variant="caption" color="text.secondary" noWrap>
                  {POSITIONS_TRANSLATION[player.player_position] ?? player.player_position} · {player.team_name}
                </Typography>
              }
            />
          </ListItem>
        ))}

        {!isLoading && players.length === 0 && (
          <Typography variant="body2" color="text.secondary" py={1} textAlign="center">
            Nenhum jogador encontrado.
          </Typography>
        )}
      </List>
    </Box>
  );
}

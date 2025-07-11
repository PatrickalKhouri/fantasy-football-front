import React, { useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LeagueSettingsForm from './LeagueSettingsForm';

const SETTINGS = [
  { label: 'Configurações da Liga', key: 'league' },
  { label: 'Configurações de Elenco', key: 'roster' },
  { label: 'Configurações de Draft', key: 'draft' },
  { label: 'Configurações de Membros', key: 'members' },
  { label: 'Excluir Liga', key: 'delete' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  league: any;
}

const LeagueSettingsModal: React.FC<Props> = ({ open, onClose, league    }) => {
  const [selected, setSelected] = useState('league');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    name: league.name,
    numberOfTeams: league.numberOfTeams,
    tradeReviewDays: league.tradeReviewDays ?? 0,
    numberOfRounds: league.numberOfRounds ?? 38,
    tradeDeadlineRound: league.tradeDeadlineRound ?? '',
    playoffTeams: league.playoffTeams ?? 4,
    playoffFormat: league.playoffFormat ?? 'single_game',
    injuredReserveSlots: league.injuredReserveSlots ?? 0,
  });

  const selectedSetting = SETTINGS.find((s) => s.key === selected);

  return (
<Dialog
  open={open}
  onClose={onClose}
  fullScreen={isMobile}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      height: '90vh',
      borderRadius: 3,
      overflow: 'hidden',
      p: 0, // prevent padding
    },
  }}
>
  <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
    {/* Sidebar */}
    <Box
      sx={{
        width: 240,
        bgcolor: '#12151d',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        py: 3,
        px: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Configurações
      </Typography>
      <List disablePadding>
        {SETTINGS.map((item) => (
          <ListItemButton
            key={item.key}
            onClick={() => setSelected(item.key)}
            selected={selected === item.key}
            sx={{
              borderRadius: 1,
              mb: 1,
              bgcolor: selected === item.key ? '#1f2733' : 'transparent',
              '&:hover': { bgcolor: '#1f2733' },
              '&.Mui-selected': {
                bgcolor: '#1f2733',
                '&:hover': { bgcolor: '#1f2733' },
              },
            }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: selected === item.key ? 600 : 400,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>

    {/* Main content */}
    <Box sx={{ flex: 1, p: 4, position: 'relative' }}>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h5" fontWeight={600} mb={1}>
        {selectedSetting?.label}
      </Typography>
      {/* League settings */}
      {selected === 'league' && (
        <LeagueSettingsForm
            values={formData}
            onChange={(field: any, value: any) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
            }
        />
        )}
        {selected !== 'league' && (
            <Typography variant="body1" color="text.secondary">
                Aqui vão as configurações de <strong>{selectedSetting?.label.toLowerCase()}</strong>.
            </Typography>
        )}
    </Box>
  </Box>
</Dialog>
  );
};

export default LeagueSettingsModal;

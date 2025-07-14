import React, { useState, useEffect } from 'react';
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
import RosterSettingsForm from './RosterSettingsForm';
import LeagueMembersSettings from './LegueMemberSettings';

import { useGetLeague, useLeagueTeams } from '../api/leagueQueries';

import { useRosterSettings } from '../api/useRosterSettings';

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

const LeagueSettingsModal: React.FC<Props> = ({ open, onClose, league }) => {
  const [selected, setSelected] = useState('league');
  const [formData, setFormData] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const leagueId = league.id;

  const { data: leagueSettings, refetch: refetchLeagueSettings } = useGetLeague(leagueId);
  const { data: rosterSettings, refetch: refetchRosterSettings } = useRosterSettings(leagueId);
  const { data: leagueMembers, refetch: refetchLeagueMembers } = useLeagueTeams(leagueId);

  console.log(leagueMembers);

  useEffect(() => {
    if (selected === 'league' && leagueSettings) {
      setFormData(leagueSettings);
    } else if (selected === 'roster' && rosterSettings) {
      setFormData(rosterSettings);
    } else if (selected === 'members' && leagueMembers) {
      setFormData(leagueMembers);
    } else {
      setFormData(null);
    }
  }, [selected, leagueSettings, rosterSettings, leagueMembers]);

  const renderForm = () => {
    if (!formData) return <Typography>Carregando...</Typography>;

    switch (selected) {
      case 'league':
        return (
          <LeagueSettingsForm
            values={formData}
            onChange={(field, value) =>
              setFormData((prev: any) => ({ ...prev, [field]: value }))
            }
            leagueId={leagueId}
            refetchLeagueSettings={refetchLeagueSettings}
          />
        );
      case 'roster':
        return (
          <RosterSettingsForm
            values={formData}
            onChange={(field, value) =>
              setFormData((prev: any) => ({ ...prev, [field]: value }))
            }
            leagueId={leagueId}
            refetchRosterSettings={refetchRosterSettings}
          />
        );
      case 'members':
        return (
          <LeagueMembersSettings
            values={formData}
            refetchLeagueMembers={refetchLeagueMembers}
          />
        );  
      default:
        return <Typography>Configuração ainda não disponível.</Typography>;
    }
  };

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
      display: 'flex',
      flexDirection: 'row', // Important: restores side-by-side layout
      overflow: 'hidden',
    },
  }}
>
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

  {/* Main Content */}
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
    <IconButton
      onClick={onClose}
      sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
    >
      <CloseIcon />
    </IconButton>

    <Box sx={{ flex: 1, overflowY: 'auto', p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        {SETTINGS.find((s) => s.key === selected)?.label}
      </Typography>
      {renderForm()}
    </Box>
  </Box>
</Dialog>

  );
};

export default LeagueSettingsModal;

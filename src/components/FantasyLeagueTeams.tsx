import React from 'react';
import {
  Typography,
  Box,
  Stack,
  Paper,
  Chip,
  useMediaQuery,
  useTheme,
  Avatar,
} from '@mui/material';
import { FantasyLeague, useFantasyLeagueTeams, FantasyLeagueTeamsResponse } from '../api/fantasyLeagueQueries';

interface Props {
  fantasyLeague: FantasyLeague;
}


const FantasyLeagueTeams: React.FC<Props> = ({ fantasyLeague }) => {
  const { data: members, isLoading } = useFantasyLeagueTeams(fantasyLeague.id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const numberOfTeams = fantasyLeague.numberOfTeams;
  

  if (isLoading) return <p>Carregando membros...</p>;

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" gutterBottom>
        Times / Membros
      </Typography>

      <Stack spacing={2}>
        {members?.map((member: FantasyLeagueTeamsResponse, index: number) => (
          <Box
            key={member.id}
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'flex-start',
              gap: 2,
              alignItems: isMobile ? 'flex-start' : 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: 1,
            }}
          >
            <Avatar>
              {member.user.firstName[0]}
              {member.user.lastName[0]}
            </Avatar>
            <Typography variant="body1" fontWeight={500}>
              {index + 1}. {member.name}
            </Typography>

            {member.isOwner && (
              <Chip
                label="Dono"
                color="primary"
                size="small"
                sx={{ mt: isMobile ? 1 : 0 }}
              />
            )}
          </Box>
        ))}

        {/* Placeholder teams */}
        {Array.from({ length: numberOfTeams - (members?.length || 0) }).map((_, i) => (
          <Box
            key={`placeholder-${i}`}
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'flex-start',
              gap: 2,
              alignItems: isMobile ? 'flex-start' : 'center',
              p: 2,
              borderRadius: 2,
              bgcolor: 'grey.100',
              border: '1px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Avatar sx={{ bgcolor: 'grey.300' }} />
            <Typography variant="body1" fontWeight={500} color="text.secondary">
             Time {members?.length ? members.length + i + 1 : i + 1}
            </Typography>
          </Box>
        ))}

        {members?.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Nenhum time na liga ainda.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default FantasyLeagueTeams;

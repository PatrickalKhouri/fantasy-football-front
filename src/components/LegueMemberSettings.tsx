import React from 'react';
import {
  Typography,
  Box,
  Stack,
  IconButton,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLeagueTeams } from '../api/leagueQueries';
import { useGetCurrentUser } from '../api/authQueries';

interface Props {
  values: any;
  leagueId: number;
  onRemoveClick: (userLeagueId: number) => void;
  refetchLeagueMembers: () => void;
}

const LeagueMembersSettings: React.FC<Props> = ({ values, leagueId, onRemoveClick, refetchLeagueMembers }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: currentUser } = useGetCurrentUser();
  const currentUserId = currentUser?.id;

  console.log(values);

  return (
    <Stack spacing={2} sx={{ py: 2 }}>
      {values?.map((entry: any, index: number) => (
        <Box
          key={entry.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 1,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box>
              <Typography variant="body1" fontWeight={500}>
                {index + 1}. {entry.user.firstName} {entry.user.lastName} / {entry.name}
              </Typography>
              {entry.isOwner && (
                <Chip
                  label="Dono"
                  color="primary"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>
          </Box>

          <Tooltip title="Remover da liga">
            <span>
              <IconButton
                color="error"
                onClick={() => onRemoveClick(entry.id)}
                disabled={entry.user.id === currentUserId || entry.isOwner}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ))}

      {values.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhum time na liga ainda.
        </Typography>
      )}
    </Stack>
  );
};

export default LeagueMembersSettings;

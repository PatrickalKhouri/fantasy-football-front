import React from 'react';
import {
  Typography,
  Box,
  Stack,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetCurrentUser } from '../api/authQueries';
import { useDeleteUserTeam } from '../api/userTeamsMutations';

interface Props {
  values: any;
  refetchFantasyLeagueMembers: () => void;
}

const FantasyLeagueMembersSettings: React.FC<Props> = ({ values, refetchFantasyLeagueMembers }) => {
  const { data: currentUser } = useGetCurrentUser();

  const { mutate: deleteUserTeam } = useDeleteUserTeam({
    onSuccess: () => {
      refetchFantasyLeagueMembers();
    },
  });

  const currentUserId = currentUser?.id;

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
                onClick={() => deleteUserTeam({ id: entry.id })}
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

export default FantasyLeagueMembersSettings;

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useGetInvitesByLeague, useCancelInvite, FantasyLeagueInvite } from '../api/fantasyLeagueInviteQueries';
import Loading from './Loading';

interface ViewInvitesModalProps {
  open: boolean;
  onClose: () => void;
  fantasyLeagueId: number;
}

const ViewInvitesModal: React.FC<ViewInvitesModalProps> = ({ open, onClose, fantasyLeagueId }) => { 
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [invites, setInvites] = useState<FantasyLeagueInvite[]>([]);

  const { data: invitesData, isLoading, isError, error } = useGetInvitesByLeague(fantasyLeagueId, open);
  const { mutate: cancelInvite, isPending: isCancelling, isError: isCancellingError, error: cancellingError } = useCancelInvite(fantasyLeagueId);

  useEffect(() => {
    if (invitesData) {
      setInvites(invitesData);
    }
  }, [invitesData]);

  const handleCancel = (inviteId: number) => {
    cancelInvite(inviteId);
  };

  if (isLoading) return <Loading message="Carregando convites..." />;
  if (isCancelling) return <Loading message="Cancelando convite..." />;

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Convites Enviados
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : invites?.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum convite enviado ainda.
          </Typography>
        ) : (
          <List>
            {invites.map((invite: FantasyLeagueInvite) => (
              <ListItem key={invite.id} divider>
                <ListItemText
                  primary={invite.recipientEmail}
                  secondary={new Date(invite.createdAt).toLocaleString('pt-BR')}
                />
                <ListItemSecondaryAction>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleCancel(invite.id)}
                    disabled={isCancelling}
                  >
                    Cancelar
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      {isCancellingError && (
        <Alert severity="error">
          {typeof cancellingError === 'object' && cancellingError !== null && 'message' in cancellingError
            ? (cancellingError as { message: string }).message
            : 'Algo deu errado ao cancelar o convite.'}
        </Alert>
      )}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Algo deu errado ao carregar os convites.'}
        </Alert>
      )}
    </Dialog>
  );
};

export default ViewInvitesModal;

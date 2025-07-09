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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useGetInvitesByLeague, useCancelInvite } from '../api/leagueInviteQueries';

interface ViewInvitesModalProps {
  open: boolean;
  onClose: () => void;
  leagueId: number;
}

const ViewInvitesModal: React.FC<ViewInvitesModalProps> = ({ open, onClose, leagueId }) => { 
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [invites, setInvites] = useState<any[]>([]);

  const { data: invitesData, isLoading } = useGetInvitesByLeague(leagueId, open);
  const { mutate: cancelInvite, isPending: isCancelling } = useCancelInvite();

  useEffect(() => {
    if (invitesData) {
      setInvites(invitesData);
    }
  }, [invitesData]);

  const handleCancel = (inviteId: number) => {
    cancelInvite(inviteId);
  };

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
            {invites.map((invite: any) => (
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
    </Dialog>
  );
};

export default ViewInvitesModal;

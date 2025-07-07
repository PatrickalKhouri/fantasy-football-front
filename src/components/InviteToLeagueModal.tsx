import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface InviteToLeagueModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const InviteToLeagueModal: React.FC<InviteToLeagueModalProps> = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isEmailValid = isValidEmail(email);

  const handleSubmit = () => {
    if (!isEmailValid) return;
    onSubmit(email);
    setEmail('');
    setTouched(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
      <DialogTitle>
        Convidar para a Liga
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          fullWidth
          label="Email do usuário"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          error={touched && !isEmailValid}
          helperText={touched && !isEmailValid ? 'Insira um e-mail válido.' : ''}
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isEmailValid}>
          Enviar Convite
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteToLeagueModal;

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  MenuItem,
  Stack,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useCreateLeague } from '../api/leagueMutations';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface CreateLeagueModalProps {
  open: boolean;
  handleClose: () => void;
}

const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({ open, handleClose }) => {
  const { user } = useAuth();
  const [leagueName, setLeagueName] = useState('');
  const [numberOfTeams, setNumberOfTeams] = useState(12);
  const { mutate: createLeague, isPending } = useCreateLeague();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leagueName.trim()) return;
    
    createLeague({
      name: leagueName,
      numberOfTeams,
      ownerId: Number(user?.id) || 0,
      championshipId: 1
    }, {
      onSuccess: () => {
        handleClose();
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="create-league-modal"
      aria-describedby="create-a-new-fantasy-league"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
          Criar Nova Liga
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Nome da Liga"
              variant="outlined"
              fullWidth
              value={leagueName}
              onChange={(e) => setLeagueName(e.target.value)}
              inputProps={{ maxLength: 100 }}
              required
            />
            
            <TextField
              select
              label="Número de Times"
              value={numberOfTeams}
              onChange={(e) => setNumberOfTeams(Number(e.target.value))}
              fullWidth
            >
              {Array.from({ length: 19 }, (_, i) => i + 2).map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </TextField>
            
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isPending || !leagueName.trim()}
              >
                {isPending ? <CircularProgress size={24} /> : 'Criar Liga'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateLeagueModal;
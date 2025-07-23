import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useCreateFantasyLeague } from '../api/fantasyLeagueMutations';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: 400,
    md: 460,
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: {
    xs: 3,
    sm: 4,
  },
  borderRadius: 3,
};

interface CreateLeagueModalProps {
  open: boolean;
  handleClose: () => void;
}

const draftTypes = [
  {
    value: 'snake',
    label: 'Cobra',
    description: 'O time que escolher primeiro na primeira rodada escolhe por último na segunda rodada e assim por diante.',
  },
  {
    value: 'linear',
    label: 'Linear',
    description: 'A ordem de escolha não é alterada ao longo das rodadas.',
  },
];

const CreateLeagueModal: React.FC<CreateLeagueModalProps> = ({ open, handleClose }) => {
  const { user } = useAuth();
  const [leagueName, setLeagueName] = useState('');
  const [numberOfTeams, setNumberOfTeams] = useState(8);
  const [draftType, setDraftType] = useState('snake');
  const { mutate: createFantasyLeague, isPending } = useCreateFantasyLeague();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leagueName.trim()) return;

    createFantasyLeague(
      {
        name: leagueName,
        numberOfTeams,
        ownerId: Number(user?.id) || 0,
        leagueId: 1,
        draftType,
      },
      {
        onSuccess: handleClose,
      }
    );
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="create-league-modal">
      <Box sx={modalStyle}>
        <Typography variant="h5" sx={{ mb: 3 }}>
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
              {Array.from({ length: 13 }, (_, i) => i + 8).map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </TextField>

            <FormControl>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Tipo de Draft
              </Typography>
              <RadioGroup value={draftType} onChange={(e) => setDraftType(e.target.value)}>
                {draftTypes.map((type) => (
                  <Paper
                    key={type.value}
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderColor: draftType === type.value ? 'primary.main' : 'divider',
                      backgroundColor: draftType === type.value ? 'action.hover' : 'inherit',
                      borderRadius: 2,
                    }}
                  >
                    <FormControlLabel
                      value={type.value}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight={600}>
                            {type.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {type.description}
                          </Typography>
                        </Box>
                      }
                      sx={{ alignItems: 'flex-start', margin: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
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

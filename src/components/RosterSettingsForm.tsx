import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { useUpdateRosterSettings } from '../api/useUpdateRosterSettings';
import { Snackbar, Alert } from '@mui/material';

interface Props {
  values: {
    id: number;
    starterSkillSlots: number;
    minStarterMidfielders: number;
    minStarterForwards: number;
    benchSkillSlots: number;
    benchDefenseSlots: number;
    minBenchMidfielders: number;
    minBenchForwards: number;
    starterDefenseSlots: number;
  };
  onChange: (field: string, value: any) => void;
  leagueId: number;
  refetchRosterSettings: () => void;
}

const RosterSettingsForm: React.FC<Props> = ({ values, onChange, leagueId, refetchRosterSettings }) => {
const [openSnackbar, setOpenSnackbar] = useState(false);
  const updateRoster = useUpdateRosterSettings({
    onSuccess: () => {
      setOpenSnackbar(true);
      refetchRosterSettings();
    },
  });

  const totalStarterMin = values.minStarterMidfielders + values.minStarterForwards;
  const isStarterTotalExceeded = totalStarterMin > values.starterSkillSlots;

  const totalBenchMin = values.minBenchMidfielders + values.minBenchForwards;
  const isBenchTotalExceeded = totalBenchMin > values.benchSkillSlots;

  return (
    <>
      {/* Starter Settings */}
      <Typography fontWeight={600} sx={{ mb: 2, fontSize: '1.2rem' }}>Jogadores Titulares</Typography>
      <Box>
        <Typography fontWeight={600}>Total de Jogadores Titulares (não incluindo defesa)</Typography>
        <TextField
          fullWidth
          type="number"
          inputProps={{ min: 4, max: 8 }}
          value={values.starterSkillSlots}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 4 && value <= 8) {
              onChange('starterSkillSlots', value);
            }
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={600}>Minimo de Meio-campistas Titulares</Typography>
        <TextField
          fullWidth
          type="number"
          value={values.minStarterMidfielders}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0 && value <= values.starterSkillSlots) {
              onChange('minStarterMidfielders', value);
            }
          }}
          error={isStarterTotalExceeded}
          helperText={
            isStarterTotalExceeded ? 'A soma dos atacantes e meias não pode exceder o total de jogadores' : ''
          }
        />
      </Box>

      <Box>
        <Typography fontWeight={600}>Minimo de Atacantes Titulares</Typography>
        <TextField
          fullWidth
          type="number"
          value={values.minStarterForwards}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0 && value <= values.starterSkillSlots) {
              onChange('minStarterForwards', value);
            }
          }}
          error={isStarterTotalExceeded}
          helperText={
            isStarterTotalExceeded ? 'A soma dos atacantes e meias não pode exceder o total de jogadores' : ''
          }
        />
      </Box>
      <Box>
        <Typography fontWeight={600}>Defesa(s) Titular(es)</Typography>
        <TextField
          fullWidth
          type="number"
          value={values.starterDefenseSlots}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0 && value <= 2) {
              onChange('starterDefenseSlots', value);
            }
          }}
        />
      </Box>

      <Typography fontWeight={600} sx={{ my: 2, fontSize: '1.2rem' }}>Jogadores Reserva</Typography>
      {/* Bench Settings */}
      <Box>
        <Typography fontWeight={600}>Total de Jogadores Reserva (não incluindo defesa)</Typography>
        <TextField
          fullWidth
          type="number"
          value={values.benchSkillSlots}
          onChange={(e) => onChange('benchSkillSlots', Number(e.target.value))}
        />
      </Box>

      <Box>
        <Typography fontWeight={600}>Minimo de Meio-campistas Reservas</Typography>
        <TextField
          fullWidth
          type="number"
          value={values.minBenchMidfielders}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0 && value <= values.benchSkillSlots) {
              onChange('minBenchMidfielders', value);
            }
          }}
          error={isBenchTotalExceeded}
          helperText={
            isBenchTotalExceeded ? 'A soma dos atacantes e meias não pode exceder o total de jogadores reservas' : ''
          }
        />
      </Box>

      <Box>
        <Typography fontWeight={600}>Atacantes Reserva (mín)</Typography>
        <TextField
          fullWidth
          type="number"
          value={values.minBenchForwards}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0 && value <= values.benchSkillSlots) {
              onChange('minBenchForwards', value);
            }
          }}
          error={isBenchTotalExceeded}
          helperText={
            isBenchTotalExceeded ? 'A soma dos atacantes e meias não pode exceder o total de jogadores reservas' : ''
          }
        />
      </Box>
      <Box>
        <Typography fontWeight={600}>Maximo de Defesa(s) Reserva(s)</Typography>
        <TextField
          fullWidth
          type="number"
          value={values.benchDefenseSlots}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0 && value <= 2) {
              onChange('benchDefenseSlots', value);
            }
          }}
        />
      </Box>
      <Box
        sx={{
          borderTop: '1px solid #eee',
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
      }}
        >
      <Button
        variant="contained"
        onClick={() => updateRoster.mutate({ id: leagueId, updates: values })}
        disabled={updateRoster.isPending || isStarterTotalExceeded || isBenchTotalExceeded}
      >
        Salvar
      </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Configurações salvas com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default RosterSettingsForm;

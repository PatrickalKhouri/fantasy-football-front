import React, { useState } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  FormControl,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { useUpdateDraftSettings } from '../api/useDraftSettingsMutations'; // <- create this hook

interface Props {
  values: {
    draftType: 'snake' | 'linear';
    draftDate: string;
    pickTimer: number;
    rounds: number; // read-only
    season: number;  // read-only
  };
  onChange: (field: string, value: any) => void;
  id: number;
  refetchDraftSettings: () => void;
}

const DraftSettingsForm: React.FC<Props> = ({
  values,
  onChange,
  id,
  refetchDraftSettings,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const updateDraftSettings = useUpdateDraftSettings({
    onSuccess: () => {
      setOpenSnackbar(true);
      refetchDraftSettings();
    },
  });

  return (
    <>
      {/* Draft Type */}
      <Box>
        <Typography fontWeight={600}>Tipo de Draft</Typography>
        <FormControl fullWidth>
          <Select
            value={values.draftType ?? ''}
            onChange={(e) => onChange('draftType', e.target.value)}
          >
            <MenuItem value="snake">Snake</MenuItem>
            <MenuItem value="linear">Linear</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Draft Date */}
      <Box>
        <Typography fontWeight={600}>Data do Draft</Typography>
        <TextField
          fullWidth
          type="datetime-local"
          value={values.draftDate ? values.draftDate.slice(0, 16) : ''}
          onChange={(e) => onChange('draftDate', e.target.value)}
        />
      </Box>

      {/* Pick Timer */}
      <Box>
        <Typography fontWeight={600}>Tempo por Escolha</Typography>
        <FormControl fullWidth>
          <Select
            value={values.pickTimer ?? ''}
            onChange={(e) => onChange('pickTimer', e.target.value)}
          >
            <MenuItem value={30}>30 segundos</MenuItem>
            <MenuItem value={60}>60 segundos</MenuItem>
            <MenuItem value={90}>90 segundos</MenuItem>
            <MenuItem value={120}>120 segundos</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Rounds (read-only) */}
      <Box>
        <Typography fontWeight={600}>Rodadas</Typography>
        <TextField
          fullWidth
          value={values.rounds}
          disabled
        />
      </Box>

      {/* Season (read-only) */}
      <Box>
        <Typography fontWeight={600}>Temporada</Typography>
        <TextField
          fullWidth
          value={values.season}
          disabled
        />
      </Box>

      {/* Save Button */}
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
          onClick={() =>
            updateDraftSettings.mutate({
              id,
              updates: values,
            })
          }
          disabled={updateDraftSettings.isPending}
        >
          Salvar
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Configurações do draft salvas com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

export default DraftSettingsForm;

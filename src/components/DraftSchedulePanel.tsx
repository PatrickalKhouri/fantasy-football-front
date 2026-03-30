import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DraftSettingsResponse } from '../api/useDraftSettings';
import { useUpdateDraftSettings } from '../api/useDraftSettingsMutations';
import { useScheduleDraft } from '../api/useScheduleDraftMutation';

interface Props {
  seasonId: string;
  leagueId: number;
  draftSettings: DraftSettingsResponse;
  isOwner: boolean;
  refetchDraftSettings: () => void;
}

const getErrorMessage = (err: unknown): string => {
  try {
    const e: any = err;
    const d = e?.response?.data;
    if (d) {
      if (Array.isArray(d?.message)) return d.message.join(', ');
      return d?.message || d?.error || JSON.stringify(d);
    }
    if (e?.message) return e.message;
    return 'Erro desconhecido';
  } catch {
    return 'Erro desconhecido';
  }
};

export default function DraftSchedulePanel({
  seasonId,
  leagueId,
  draftSettings,
  isOwner,
  refetchDraftSettings,
}: Props) {
  const hasDate = !!draftSettings.draftDate;

  const [editingDate, setEditingDate] = useState(!hasDate);
  const [newDate, setNewDate] = useState(
    draftSettings.draftDate ? draftSettings.draftDate.slice(0, 16) : '',
  );
  const [confirmChangeOpen, setConfirmChangeOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const { mutate: updateSettings, isPending: isSavingDate } = useUpdateDraftSettings({
    onSuccess: () => {
      refetchDraftSettings();
      setEditingDate(false);
      setSnackbar({ open: true, message: 'Data do draft salva!', severity: 'success' });
    },
  });

  const { mutate: scheduleDraft, isPending: isScheduling } = useScheduleDraft(leagueId);

  const handleSaveDate = () => {
    updateSettings({ id: draftSettings.id, updates: { ...draftSettings, draftDate: newDate } });
  };

  const handleSchedule = () => {
    scheduleDraft(seasonId, {
      onSuccess: () =>
        setSnackbar({ open: true, message: 'Draft agendado com sucesso!', severity: 'success' }),
      onError: (err) =>
        setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' }),
    });
  };

  const minDateTime = new Date(Date.now() + 60000).toISOString().slice(0, 16); // at least 1 min from now

  const formattedDate = hasDate
    ? new Date(draftSettings.draftDate).toLocaleString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : null;

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={1}>
        Data do Draft
      </Typography>

      {!hasDate && isOwner && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Nenhuma data definida. Defina uma data para poder agendar o draft.
        </Alert>
      )}

      {/* Show formatted date when set and not editing */}
      {hasDate && !editingDate && (
        <Box
          display="flex"
          alignItems="center"
          gap={1.5}
          sx={{
            p: 2,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            mb: 2,
          }}
        >
          <CalendarMonthIcon color="primary" />
          <Typography fontWeight={600}>{formattedDate}</Typography>
          {isOwner && (
            <Button
              size="small"
              sx={{ ml: 'auto', textTransform: 'none' }}
              onClick={() => setConfirmChangeOpen(true)}
            >
              Alterar
            </Button>
          )}
        </Box>
      )}

      {/* Date picker when no date or editing */}
      {isOwner && editingDate && (
        <Box display="flex" gap={1} alignItems="center" mb={2}>
          <TextField
            type="datetime-local"
            size="small"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            slotProps={{ htmlInput: { min: minDateTime } }}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleSaveDate}
            disabled={isSavingDate || !newDate}
            sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            {isSavingDate ? 'Salvando…' : 'Salvar Data'}
          </Button>
          {hasDate && (
            <Button
              onClick={() => setEditingDate(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancelar
            </Button>
          )}
        </Box>
      )}

      {/* Schedule button — only when date is set */}
      {isOwner && hasDate && !editingDate && (
        <Button
          variant="contained"
          onClick={handleSchedule}
          disabled={isScheduling}
          sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700 }}
        >
          {isScheduling ? 'Agendando…' : 'Agendar Draft'}
        </Button>
      )}

      {/* Confirm date change dialog */}
      <Dialog open={confirmChangeOpen} onClose={() => setConfirmChangeOpen(false)}>
        <DialogTitle>Alterar data do draft?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Alterar a data pode impactar todos os participantes da liga. Confirma?
          </Typography>
          <TextField
            type="datetime-local"
            size="small"
            fullWidth
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            slotProps={{ htmlInput: { min: minDateTime } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmChangeOpen(false)} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={isSavingDate || !newDate}
            onClick={() => {
              setConfirmChangeOpen(false);
              setEditingDate(true);
              handleSaveDate();
            }}
            sx={{ textTransform: 'none' }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

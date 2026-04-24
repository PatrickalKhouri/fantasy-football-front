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
import { useDraftOrder } from '../api/draftOrderQueries';

interface Props {
  seasonId: string;
  leagueId: number;
  draftSettings: DraftSettingsResponse;
  isOwner: boolean;
  refetchDraftSettings: () => void;
}

const toLocalDatetimeValue = (isoString: string): string => {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

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
  const { data: draftOrder } = useDraftOrder(leagueId, draftSettings.season);
  const hasDraftOrder = !!draftOrder && draftOrder.length > 0;

  const [newDate, setNewDate] = useState(
    draftSettings.draftDate ? toLocalDatetimeValue(draftSettings.draftDate) : '',
  );
  const [changeDateOpen, setChangeDateOpen] = useState(false);
  const [scheduleConfirmOpen, setScheduleConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const { mutate: updateSettings, isPending: isSavingDate } = useUpdateDraftSettings({
    onSuccess: () => {
      refetchDraftSettings();
      setChangeDateOpen(false);
      setSnackbar({ open: true, message: 'Data do draft salva!', severity: 'success' });
    },
  });

  const { mutate: scheduleDraft, isPending: isScheduling } = useScheduleDraft(leagueId);

  const handleSaveDate = () => {
    updateSettings({ id: draftSettings.id, updates: { ...draftSettings, draftDate: new Date(newDate).toISOString() } });
  };

  const handleSchedule = () => {
    setScheduleConfirmOpen(false);
    scheduleDraft(seasonId, {
      onSuccess: () =>
        setSnackbar({ open: true, message: 'Draft agendado com sucesso!', severity: 'success' }),
      onError: (err) =>
        setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' }),
    });
  };

  const minDateTime = toLocalDatetimeValue(new Date(Date.now() + 60000).toISOString());

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

      {/* No date yet */}
      {!hasDate && isOwner && (
        <>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Nenhuma data definida. Defina uma data para poder agendar o draft.
          </Alert>
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
          </Box>
        </>
      )}

      {/* Date is set */}
      {hasDate && (
        <>
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            sx={{
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              mb: 1.5,
            }}
          >
            <CalendarMonthIcon color="primary" />
            <Typography fontWeight={600}>{formattedDate}</Typography>
            {isOwner && (
              <Button
                size="small"
                sx={{ ml: 'auto', textTransform: 'none' }}
                onClick={() => {
                  setNewDate(toLocalDatetimeValue(draftSettings.draftDate!));
                  setChangeDateOpen(true);
                }}
              >
                Alterar
              </Button>
            )}
          </Box>

          {isOwner && (
            <Alert severity="info" sx={{ mb: 2 }}>
              O dia e hora do draft ainda precisa ser confirmado. Clique em "Agendar Draft" para finalizar.
            </Alert>
          )}

          {isOwner && (
            <Button
              variant="contained"
              onClick={() => setScheduleConfirmOpen(true)}
              disabled={isScheduling}
              sx={{ borderRadius: 50, textTransform: 'none', fontWeight: 700 }}
            >
              {isScheduling ? 'Agendando…' : 'Agendar Draft'}
            </Button>
          )}
        </>
      )}

      {/* Change date dialog */}
      <Dialog open={changeDateOpen} onClose={() => setChangeDateOpen(false)}>
        <DialogTitle>Alterar Data do Draft</DialogTitle>
        <DialogContent>
          <TextField
            type="datetime-local"
            size="small"
            fullWidth
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            slotProps={{ htmlInput: { min: minDateTime } }}
            sx={{ mt: 1, mb: 2 }}
          />
          <Alert severity="info" sx={{ fontSize: '0.8rem' }}>
            Salvar a data não agenda o draft. Você ainda precisará clicar em "Agendar Draft" para confirmar.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeDateOpen(false)} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={isSavingDate || !newDate}
            onClick={handleSaveDate}
            sx={{ textTransform: 'none' }}
          >
            {isSavingDate ? 'Salvando…' : 'Salvar Data'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule confirmation dialog */}
      <Dialog open={scheduleConfirmOpen} onClose={() => setScheduleConfirmOpen(false)}>
        <DialogTitle>Confirmar Agendamento do Draft</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={1}>
            O draft será agendado para:
          </Typography>
          <Typography fontWeight={700} mb={2}>
            {formattedDate}
          </Typography>
          {!hasDraftOrder && (
            <Alert severity="warning" sx={{ mb: 1.5 }}>
              Seu draft não possui uma ordem definida. Caso confirme, uma ordem aleatória será estabelecida automaticamente.
            </Alert>
          )}
          <Alert severity="warning">
            Esta ação não pode ser desfeita. Após confirmar, o agendamento estará bloqueado.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleConfirmOpen(false)} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSchedule}
            disabled={isScheduling}
            sx={{ textTransform: 'none' }}
          >
            Confirmar Agendamento
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

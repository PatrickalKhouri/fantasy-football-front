import { Avatar, Typography, Box, Chip, Paper, Stack, Button } from '@mui/material';

interface SlotCardProps {
  slotType: 'starter' | 'bench';
  allowedPositions: RosterSlot[];
  player: { id: number; name: string; photo: string; position: string; team: { code: string } } | null;
  slot: any; // contains slot.id
  onRemovePlayer?: () => void;
}

export enum RosterSlot {
    GOL = 'GOL',
    DEF = 'DEF',
    MEI = 'MEI',
    ATA = 'ATA',
    BN = 'BN',
  }
  

  const slotColors: Record<string, string> = {
    GOL: '#2196f3',
    DEF: '#4caf50',
    MEI: '#ffb300',
    ATA: '#f44336',
    'MEI/ATA': '#9e9e9e',
    BN: '#666',
  };

  export const SlotCard: React.FC<SlotCardProps> = ({ slotType, allowedPositions, player, onRemovePlayer, slot }) => {
    const isEmpty = !player;
    const isBench = slotType === 'bench';

    const label = isEmpty && isBench
    ? 'RES'
    : allowedPositions.length > 1
      ? allowedPositions.map((p) => p === 'MEI' ? 'M' : p === 'ATA' ? 'A' : p).join('/')
      : allowedPositions[0];
  
    return (
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: '#f9f9f9', // light neutral background
          border: '1px solid #ddd', // subtle border
          color: '#333',
          minHeight: 56,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            label={label}
            sx={{
              bgcolor: slotColors[label] || '#aaa',
              color: 'white',
              fontWeight: 'bold',
              width: 60,
              textAlign: 'center',
            }}
          />
          {player ? (
            <>
              <Avatar src={player.photo} alt={player.name} />
              <Box>
                <Typography fontWeight="bold" color="text.primary">
                  {player.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                 {player.team.code} - {player.position}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography color="text.secondary">Disponível</Typography>
          )}
        </Stack>
        {player && onRemovePlayer && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRemovePlayer();
            }}
          >
            Liberar jogador
          </Button>
        )}
      </Paper>
    );
  };

// components/UserLeaguesList.tsx
import { 
  Box, 
  Typography, 
  Card, 
  CardActionArea, 
  CardContent,
  Button
} from '@mui/material';
import { FantasyLeague } from '../api/leagueQueries';

interface UserLeaguesListProps {
  leagues: FantasyLeague[];
  onLeagueSelect: (leagueId: number) => void;
}

export const UserLeaguesList = ({ leagues, onLeagueSelect }: UserLeaguesListProps) => {
  if (leagues.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Você não está em nenhuma liga ainda
        </Typography>
        <Button 
          variant="contained"
          onClick={() => onLeagueSelect(0)}
          sx={{ 
            px: 4,
            py: 2,
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          Criar Primeira Liga
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        Suas Ligas
      </Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 2,
        justifyContent: 'center'
      }}>
        {leagues.map((league) => (
          <Card 
            key={league.id}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                boxShadow: 2,
                borderColor: 'primary.main'
              }
            }}
          >
            <CardActionArea 
              onClick={() => onLeagueSelect(league.id)}
              sx={{ flexGrow: 1 }}
            >
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {league.name}
                  {league.isOwner && (
                    <Typography 
                      component="span" 
                      variant="caption" 
                      color="primary"
                      sx={{ ml: 1 }}
                    >
                      (Dono)
                    </Typography>
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Times: {league.numberOfTeams}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Campeonato: {league.championship.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
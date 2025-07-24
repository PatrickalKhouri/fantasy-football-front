import React, { useState } from 'react';
import { Box, Button, Stack } from '@mui/material';

const tabs = [
  { label: 'Draft', key: 'draft' },
  { label: 'Times', key: 'team' },
  { label: 'Liga', key: 'league' },
  { label: 'Jogadores', key: 'players' },
  { label: 'Trocas', key: 'trades' },
  { label: 'Pontuações', key: 'scores' },
];

interface FantasyLeagueTabsProps {
  selected: string;
  onChange: (key: string) => void;
}

const FantasyLeagueTabs: React.FC<FantasyLeagueTabsProps> = ({ selected, onChange }) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 2 }}>
      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={selected === tab.key ? 'contained' : 'outlined'}
            onClick={() => onChange(tab.key)}
            sx={{
              borderRadius: 50,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: selected === tab.key ? 'primary.main' : 'transparent',
              color: selected === tab.key ? '#fff' : 'text.primary',
              '&:hover': {
                bgcolor: selected === tab.key ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            {tab.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default FantasyLeagueTabs;

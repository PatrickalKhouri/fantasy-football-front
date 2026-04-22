import { RealMatchDto } from '../api/matchesQueries';

export interface OpponentInfo {
  id: number;
  code: string;
  logoUrl: string | null;
  isHome: boolean;
  matchDate: string | null;
}

export function getOpponentForTeam(
  matches: RealMatchDto[],
  teamId: number,
): OpponentInfo | null {
  for (const m of matches) {
    if (m.homeTeam.id === teamId) {
      return {
        ...m.awayTeam,
        code: m.awayTeam.code ?? m.awayTeam.name.slice(0, 3).toUpperCase(),
        isHome: true,
        matchDate: m.date,
      };
    }
    if (m.awayTeam.id === teamId) {
      return {
        ...m.homeTeam,
        code: m.homeTeam.code ?? m.homeTeam.name.slice(0, 3).toUpperCase(),
        isHome: false,
        matchDate: m.date,
      };
    }
  }
  return null;
}

export function formatMatchTime(isoDate: string | null): string | null {
  if (!isoDate) return null;
  return new Date(isoDate).toLocaleString('pt-BR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// src/utils/positions.ts
export type RosterSlot = 'DEF' | 'MEI' | 'ATA';

export function mapPositionToSlot(position: string): RosterSlot {
  // backend sends "Defense" | "Midfielder" | "Attacker"
  if (position === 'Defense') return 'DEF';
  if (position === 'Midfielder') return 'MEI';
  if (position === 'Attacker') return 'ATA';
  // default safe fallback
  return 'MEI';
}

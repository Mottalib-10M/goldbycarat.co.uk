/**
 * Registre des mini-simulateurs (RECETTE §9.3). Ce site n'en pose aucun : ses calculateurs sont
 * dans `components/calc/Tool.tsx`. Le registre existe pour que `MiniSim` et `MiniSimAutonome` de la
 * trame compilent et que `tests/trame-testeurs-naifs.test.ts` (qui le remplace par une spec d'essai)
 * vérifie les composants tels que la trame les fournit.
 */
import type { MiniSpec } from './mini-types';

const SPECS: Record<string, (lang: string) => MiniSpec> = {};

export function getSpec(kind: string, lang = 'en'): MiniSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`mini-simulateur inconnu : ${kind}`);
  return f(lang);
}

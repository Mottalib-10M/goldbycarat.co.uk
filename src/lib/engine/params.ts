/** Paramètres 2026 (RECETTE §4) : toute valeur réglementaire se lit ici, jamais en dur dans une page. */
import raw from '../../data/params-2026.json';
import snapRaw from '../../data/spot-snapshot.json';

export type Metal = 'XAU' | 'XAG' | 'XPT' | 'XPD';
export const METALS: Metal[] = ['XAU', 'XAG', 'XPT', 'XPD'];
export interface GoldGrade { ct: number; fineness: number; hallmark: boolean }
export interface Coin { id: string; name: string; grossG?: number; fineOz?: number; fineness: number; legalTenderUK: boolean; metal: Metal; source: string }
export interface Source { url: string; label: { en: string } }

export interface Params {
  year: number; taxYear: string; retrieved_at: string; valid_from: string; valid_to: string;
  units: { troyOunceGrams: number; grainGrams: number; tolaGrains: number };
  gold: GoldGrade[]; goldStandards: number[]; silver: number[]; platinum: number[]; palladium: number[];
  hallmarkExemptGrams: Record<'gold' | 'silver' | 'platinum' | 'palladium', number>;
  assayOffices: Array<{ city: string; mark: string }>;
  coins: Coin[];
  cgt: { annualExemptAmount: number; basicRate: number; higherRate: number; basicRateBand: number; from: string };
  chattels: { exemptLimit: number; marginalUpper: number; marginalFraction: number };
  vat: { standardRate: number; barMinFineness: number; coinMinFineness: number; coinMintedAfter: number; coinPremiumLimit: number };
  barSizesGrams: number[];
  sources: Record<string, Source>;
}
export const P = raw as unknown as Params;
export type SourceKey = keyof typeof raw.sources;

export interface Snapshot { source: string; currency: string; gbpPerOz: Record<Metal, number>; at: Record<Metal, string> }
export const SNAPSHOT = snapRaw as Snapshot;

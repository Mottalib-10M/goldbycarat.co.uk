/**
 * Moteur du site : fonctions pures, testées (tests/metal.test.ts). Aucune valeur réglementaire en dur :
 * elles viennent de params-2026.json ; le cours (livres par once troy) vient de l'appelant.
 *
 * Valeur métal d'un objet = poids × titre (millièmes ÷ 1000) × cours du gramme de métal fin.
 * Le titre d'un carat est le titre légal britannique (Hallmarking Act 1973, annexe 2) : 9 ct = 375,
 * 14 ct = 585 (et non 14/24 = 583,3), 18 ct = 750, 22 ct = 916,6, 24 ct = 999.
 */
import { P, type Coin } from './params';

export const OZ = P.units.troyOunceGrams;
export const TOLA = P.units.tolaGrains * P.units.grainGrams;

/** Cours d'un gramme de métal fin, en livres, depuis le cours de l'once troy. */
export const finePerGram = (gbpPerOz: number) => gbpPerOz / OZ;

/** Titre légal (millièmes) d'un carat ; un carat hors table suit la proportion k/24. */
export function finenessOfCarat(ct: number): number {
  const row = P.gold.find((g) => g.ct === ct);
  return row ? row.fineness : Math.round((ct / 24) * 10000) / 10;
}
/** Carat équivalent d'un titre (375 → 9). */
export const caratOfFineness = (fineness: number) => (fineness / 1000) * 24;

/** Valeur métal d'un poids à un titre donné. */
export function metalValue(grams: number, fineness: number, gbpPerOz: number): number {
  return Math.max(0, grams) * (fineness / 1000) * finePerGram(gbpPerOz);
}
/** Prix d'un gramme d'objet à un titre donné. */
export const gramPrice = (fineness: number, gbpPerOz: number) => metalValue(1, fineness, gbpPerOz);

/** Tableau des carats publiés : prix du gramme pour chaque carat. */
export function caratTable(gbpPerOz: number) {
  return P.gold.map((g) => ({ ...g, gram: gramPrice(g.fineness, gbpPerOz) }));
}

export type Unit = 'g' | 'oz' | 'kg' | 'tola' | 'grain';
/** Conversion vers le gramme. `tolaGrams` : poids de la tola retenu (11,6638 g par défaut). */
export function toGrams(value: number, unit: Unit, tolaGrams = TOLA): number {
  if (unit === 'oz') return value * OZ;
  if (unit === 'kg') return value * 1000;
  if (unit === 'tola') return value * tolaGrams;
  if (unit === 'grain') return value * P.units.grainGrams;
  return value;
}
export const fromGrams = (grams: number, unit: Unit, tolaGrams = TOLA) => grams / toGrams(1, unit, tolaGrams);

/** Part du métal qu'une offre paie, et l'écart en livres. */
export function offerShare(offer: number, metal: number): { share: number; gap: number } {
  return { share: metal > 0 ? offer / metal : 0, gap: metal - offer };
}

/** Lot de pièces de titres différents (bijoux mêlés) : valeur métal totale et métal fin. */
export function lotValue(items: Array<{ grams: number; fineness: number }>, gbpPerOz: number) {
  const fineGrams = items.reduce((s, i) => s + Math.max(0, i.grams) * (i.fineness / 1000), 0);
  return { fineGrams, value: fineGrams * finePerGram(gbpPerOz) };
}

/** Métal fin d'une pièce, en grammes : poids légal × titre, ou teneur publiée en onces. */
export function coinFineGrams(c: Coin): number {
  if (c.fineOz !== undefined) return c.fineOz * OZ;
  return (c.grossG ?? 0) * (c.fineness / 1000);
}
export const coinMetalValue = (c: Coin, gbpPerOz: number) => coinFineGrams(c) * finePerGram(gbpPerOz);
export const coinById = (id: string) => {
  const c = P.coins.find((x) => x.id === id);
  if (!c) throw new Error(`pièce inconnue ${id}`);
  return c;
};

/** Prime payée au-dessus du métal (0,05 = 5 %). */
export const premium = (price: number, metal: number) => (metal > 0 ? price / metal - 1 : 0);

/** TVA de l'or (VAT Notice 701/21, §2.1). */
export type VatItem = 'bar' | 'coin' | 'jewellery' | 'silver';
export interface VatIn { item: VatItem; fineness: number; price: number; metal: number; legalTender?: boolean; mintedAfter1800?: boolean; acceptedWeight?: boolean }
export function vatStatus(i: VatIn): { exempt: boolean; reason: 'bar' | 'coin' | 'premium' | 'fineness' | 'tender' | 'minted' | 'weight' | 'notgold'; vatInPrice: number; ratio: number } {
  const V = P.vat;
  const ratio = i.metal > 0 ? i.price / i.metal : 0;
  const std = (reason: 'premium' | 'fineness' | 'tender' | 'minted' | 'weight' | 'notgold') => ({ exempt: false, reason, vatInPrice: i.price - i.price / (1 + V.standardRate), ratio });
  if (i.item === 'silver' || i.item === 'jewellery') return std('notgold');
  if (i.item === 'bar') {
    if (i.fineness < V.barMinFineness) return std('fineness');
    if (i.acceptedWeight === false) return std('weight');
    return { exempt: true, reason: 'bar', vatInPrice: 0, ratio };
  }
  if (i.fineness < V.coinMinFineness) return std('fineness');
  if (i.legalTender === false) return std('tender');
  if (i.mintedAfter1800 === false) return std('minted');
  if (ratio > V.coinPremiumLimit) return std('premium');
  return { exempt: true, reason: 'coin', vatInPrice: 0, ratio };
}

/** Plus-value (CGT) sur de l'or, 2026-27. `kind` : pièce britannique ayant cours légal (hors champ,
 *  TCGA 1992 s.21(1)(b)), bien meuble (bijou, lingot : règle des 6 000 £, s.262), pièce étrangère
 *  (monnaie étrangère imposable, CG78300 ; le site n'applique pas la règle des 6 000 £). */
/** uk-coin : monnaie sterling, hors champ (s.21) ; chattel et foreign-coin : biens meubles, règle des 6 000 £
 *  (s.262 ; GOV.UK range « coins and stamps » parmi les biens personnels) ; asset : sans exonération (exemples GOV.UK). */
export type CgtKind = 'uk-coin' | 'chattel' | 'foreign-coin' | 'asset';
export interface CgtIn { kind: CgtKind; proceeds: number; cost: number; costs?: number; taxableIncome: number; otherGains?: number }
export interface CgtOut { rawGain: number; chattelCap: number | null; gain: number; allowanceUsed: number; taxable: number; atBasic: number; atHigher: number; tax: number; outOfScope: boolean; rule: 'out-of-scope' | 'chattel-exempt' | 'chattel-marginal' | 'full' | 'loss' }
export function cgt(i: CgtIn): CgtOut {
  const C = P.cgt, H = P.chattels;
  const zero = { allowanceUsed: 0, taxable: 0, atBasic: 0, atHigher: 0, tax: 0 };
  const rawGain = Math.max(0, i.proceeds) - Math.max(0, i.cost) - Math.max(0, i.costs ?? 0);
  if (i.kind === 'uk-coin') return { rawGain, chattelCap: null, gain: 0, ...zero, outOfScope: true, rule: 'out-of-scope' };
  if (rawGain <= 0) return { rawGain, chattelCap: null, gain: 0, ...zero, outOfScope: false, rule: 'loss' };
  let gain = rawGain, chattelCap: number | null = null, rule: CgtOut['rule'] = 'full';
  if (i.kind === 'chattel' || i.kind === 'foreign-coin') {
    if (i.proceeds <= H.exemptLimit) return { rawGain, chattelCap: 0, gain: 0, ...zero, outOfScope: false, rule: 'chattel-exempt' };
    chattelCap = (i.proceeds - H.exemptLimit) * H.marginalFraction;
    if (chattelCap < rawGain) { gain = chattelCap; rule = 'chattel-marginal'; }
  }
  const totalGains = gain + Math.max(0, i.otherGains ?? 0);
  const allowanceUsed = Math.min(C.annualExemptAmount, totalGains);
  const taxableAll = totalGains - allowanceUsed;
  // L'abattement s'impute d'abord sur les autres plus-values déclarées ; ce qui reste taxable de cette vente :
  const taxable = Math.min(gain, taxableAll);
  const bandLeft = Math.max(0, C.basicRateBand - Math.max(0, i.taxableIncome) - Math.max(0, taxableAll - taxable));
  const atBasic = Math.min(taxable, bandLeft);
  const atHigher = taxable - atBasic;
  const tax = atBasic * C.basicRate + atHigher * C.higherRate;
  return { rawGain, chattelCap, gain, allowanceUsed, taxable, atBasic, atHigher, tax, outOfScope: false, rule };
}

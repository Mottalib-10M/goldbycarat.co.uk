import { describe, it, expect } from 'vitest';
import { finenessOfCarat, metalValue, gramPrice, toGrams, fromGrams, TOLA, OZ, offerShare, lotValue, coinFineGrams, coinById, vatStatus, cgt, premium, caratOfFineness } from '../src/lib/engine/metal';
import { P } from '../src/lib/engine/params';

describe('titres légaux (Hallmarking Act 1973, annexes 1 et 2)', () => {
  it('9 ct = 375, 14 ct = 585 (pas 583,3), 18 ct = 750, 22 ct = 916,6', () => {
    expect(finenessOfCarat(9)).toBe(375);
    expect(finenessOfCarat(14)).toBe(585);
    expect(finenessOfCarat(18)).toBe(750);
    expect(finenessOfCarat(22)).toBe(916.6);
    expect(finenessOfCarat(24)).toBe(999);
  });
  it('21 ct hors table britannique : 875, marqué non légal', () => {
    expect(finenessOfCarat(21)).toBe(875);
    expect(P.gold.find((g) => g.ct === 21)!.hallmark).toBe(false);
  });
  it('carat équivalent d’un titre', () => { expect(caratOfFineness(375)).toBeCloseTo(9, 6); });
  it('seuils d’exemption : or 1 g, argent 7,78 g, platine 0,5 g, palladium 1 g', () => {
    expect(P.hallmarkExemptGrams).toEqual({ gold: 1, silver: 7.78, platinum: 0.5, palladium: 1 });
  });
});

describe('unités (Weights and Measures Act 1985, annexe 1)', () => {
  it('once troy = 31,1034768 g ; tola de 180 grains = 11,6638 g', () => {
    expect(OZ).toBe(31.1034768);
    expect(TOLA).toBeCloseTo(11.6638038, 6);
    expect(toGrams(1, 'kg')).toBe(1000);
    expect(fromGrams(OZ, 'oz')).toBeCloseTo(1, 10);
    expect(toGrams(2, 'tola', 12.5)).toBe(25);
  });
});

describe('valeur métal', () => {
  const oz = 3110.34768; // 100 £ le gramme fin
  it('10 g de 9 ct à 100 £ le gramme fin = 375 £', () => { expect(metalValue(10, 375, oz)).toBeCloseTo(375, 6); });
  it('gramme de 22 ct = 91,66 £', () => { expect(gramPrice(916.6, oz)).toBeCloseTo(91.66, 6); });
  it('lot mêlé : 10 g 9 ct + 5 g 18 ct = 7,5 g fin', () => {
    const r = lotValue([{ grams: 10, fineness: 375 }, { grams: 5, fineness: 750 }], oz);
    expect(r.fineGrams).toBeCloseTo(7.5, 6); expect(r.value).toBeCloseTo(750, 6);
  });
  it('offre de 300 £ pour 375 £ de métal = 80 %, écart 75 £', () => {
    const r = offerShare(300, 375); expect(r.share).toBeCloseTo(0.8, 6); expect(r.gap).toBe(75);
  });
  it('poids négatif ramené à zéro', () => { expect(metalValue(-5, 375, oz)).toBe(0); });
});

describe('pièces (Coinage Act 1971, annexe 1 ; Royal Mint)', () => {
  it('souverain : 7,98805 g à 916,66 = 7,3222 g fin, soit 0,235 oz comme la fiche Royal Mint', () => {
    const g = coinFineGrams(coinById('sovereign'));
    expect(g).toBeCloseTo(7.3222, 3);
    expect(Math.round((g / OZ) * 1000) / 1000).toBe(0.235);
  });
  it('double souverain = 0,47 oz fin (fiche Royal Mint)', () => {
    expect(Math.round((coinFineGrams(coinById('double-sovereign')) / OZ) * 100) / 100).toBe(0.47);
  });
  it('demi-souverain = 0,1177 oz fin, que la fiche Royal Mint tronque à 0,117', () => {
    expect(Math.floor((coinFineGrams(coinById('half-sovereign')) / OZ) * 1000) / 1000).toBe(0.117);
  });
  it('Britannia 1 oz = une once de métal fin', () => { expect(coinFineGrams(coinById('britannia-1oz'))).toBeCloseTo(OZ, 8); });
  it('prime', () => { expect(premium(110, 100)).toBeCloseTo(0.1, 8); });
});

describe('TVA de l’or (VAT Notice 701/21, §2.1)', () => {
  it('lingot 999,9 d’un poids admis : exonéré', () => { expect(vatStatus({ item: 'bar', fineness: 999.9, price: 1000, metal: 990 }).exempt).toBe(true); });
  it('lingot 990 : TVA (sous 995)', () => { const r = vatStatus({ item: 'bar', fineness: 990, price: 1200, metal: 1000 }); expect(r.exempt).toBe(false); expect(r.vatInPrice).toBeCloseTo(200, 6); });
  it('souverain vendu 150 % du métal : exonéré ; à 190 % : TVA', () => {
    expect(vatStatus({ item: 'coin', fineness: 916.66, price: 150, metal: 100, legalTender: true }).exempt).toBe(true);
    expect(vatStatus({ item: 'coin', fineness: 916.66, price: 190, metal: 100, legalTender: true }).reason).toBe('premium');
  });
  it('bijou et argent : TVA au taux normal', () => {
    expect(vatStatus({ item: 'jewellery', fineness: 750, price: 120, metal: 100 }).vatInPrice).toBeCloseTo(20, 6);
    expect(vatStatus({ item: 'silver', fineness: 999, price: 120, metal: 100 }).exempt).toBe(false);
  });
});

describe('CGT 2026-27 (exemples GOV.UK, « Capital Gains Tax rates »)', () => {
  it('exemple 1 : revenu imposable 20 000 £, gain 12 600 £ → 1 728 £', () => {
    expect(cgt({ kind: 'asset', proceeds: 12600, cost: 0, taxableIncome: 20000 }).tax).toBeCloseTo(1728, 6);
  });
  it('exemple 2 : revenu 20 000 £, gain 52 600 £ → 18 % sur 17 700 £, 24 % sur 31 900 £ = 10 842 £', () => {
    const r = cgt({ kind: 'asset', proceeds: 52600, cost: 0, taxableIncome: 20000 });
    expect(r.atBasic).toBeCloseTo(17700, 6); expect(r.atHigher).toBeCloseTo(31900, 6); expect(r.tax).toBeCloseTo(10842, 6);
  });
  it('pièce britannique ayant cours légal : hors champ (TCGA s.21(1)(b))', () => {
    const r = cgt({ kind: 'uk-coin', proceeds: 50000, cost: 10000, taxableIncome: 60000 });
    expect(r.outOfScope).toBe(true); expect(r.tax).toBe(0);
  });
  it('bijou vendu 6 000 £ : exonéré (s.262(1))', () => {
    expect(cgt({ kind: 'chattel', proceeds: 6000, cost: 500, taxableIncome: 30000 }).rule).toBe('chattel-exempt');
  });
  it('bijou vendu 9 000 £ pour 1 000 £ : gain plafonné à 5/3 × 3 000 = 5 000 £', () => {
    const r = cgt({ kind: 'chattel', proceeds: 9000, cost: 1000, taxableIncome: 50000 });
    expect(r.rule).toBe('chattel-marginal'); expect(r.gain).toBeCloseTo(5000, 6); expect(r.taxable).toBeCloseTo(2000, 6); expect(r.tax).toBeCloseTo(480, 6);
  });
  it('bijou vendu 20 000 £ : le plafond 5/3 dépasse le gain réel, gain réel retenu', () => {
    const r = cgt({ kind: 'chattel', proceeds: 20000, cost: 12000, taxableIncome: 10000 });
    expect(r.rule).toBe('full'); expect(r.gain).toBe(8000);
  });
  it('perte : aucun impôt', () => { expect(cgt({ kind: 'chattel', proceeds: 7000, cost: 9000, taxableIncome: 0 }).tax).toBe(0); });
});

describe('pièces étrangères : biens meubles (GOV.UK, « coins and stamps »)', () => {
  it('Krugerrand vendu 5 800 £ : exonéré', () => {
    expect(cgt({ kind: 'foreign-coin', proceeds: 5800, cost: 1000, taxableIncome: 20000 }).rule).toBe('chattel-exempt');
  });
  it('vendu 7 500 £ : gain plafonné à 5/3 de 1 500 £', () => {
    expect(cgt({ kind: 'foreign-coin', proceeds: 7500, cost: 1000, taxableIncome: 20000 }).gain).toBeCloseTo(2500, 6);
  });
});

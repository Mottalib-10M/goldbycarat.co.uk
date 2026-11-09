/** Outils d'écriture passés au corps de chaque page, et jetons des textes statiques. */
import { route, ROUTES } from '../i18n/routes';
import { P, SNAPSHOT, type SourceKey } from './engine/params';
import type { Helpers } from './page-types';
import { formatNumber, formatDecimal } from './format';
import { metalValue, finenessOfCarat, coinById, coinFineGrams, OZ, TOLA } from './engine/metal';
import { gbp, gbp2, pct, stamp } from './money';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');

export function helpers(): Helpers {
  return {
    P, gbp, gbp2, pct,
    a: (id, text) => {
      if (!ROUTES.some((r) => r.id === id)) throw new Error(`lien interne inconnu : ${id}`);
      return `<a href="${route(id, 'en')}">${text}</a>`;
    },
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; if (!s) throw new Error(`source inconnue ${key}`); return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    num: (n, d = 0) => formatNumber(n, d),
    at: (g, f, m = 'XAU') => metalValue(g, f, SNAPSHOT.gbpPerOz[m]),
    // Un seul chiffre par notion (testeurs du 2026-11-09) : un montant qui dépend du cours est posé dans un span
    // que live.ts recalcule au cours du calculateur ; l'heure citée suit le même cours.
    live: (n, m = 'XAU', f = 'gbp') => `<span data-cours="${m}" data-v="${n}" data-f="${f}">${f === 'gbp2' ? gbp2(n) : f === 'pct' ? pct(n, 1) : gbp(n)}</span>`,
    when: `<span data-cours-heure="XAU">${stamp(SNAPSHOT.at.XAU)}</span>`,
    whenOf: (m) => `<span data-cours-heure="${m}">${stamp(SNAPSHOT.at[m])}</span>`,
    recorded: stamp(SNAPSHOT.at.XAU),
    table: (headers, rows, caption) => { return `<div class="not-prose my-6 overflow-x-auto"><table class="journal empile w-full text-sm">${caption ? `<caption class="mb-2 text-start text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((x) => `<th scope="col" class="px-3 py-2 text-start font-semibold text-navy-900">${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr class="border-b border-navy-100">${r.map((c, i) => `<td data-label="${String(headers[i] ?? '').replace(/"/g, '&quot;')}" class="tabular-nums px-3 py-2 text-start text-navy-800">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; },
  };
}

/** Jetons des textes (titre, description, bloc citable, FAQ, corps) remplacés par la valeur du fichier
 *  de paramètres : une valeur réglementaire ne s'écrit jamais en dur (RECETTE §17.4, point 7).
 *  Ex. « {cgt.allowance} » → « £3,000 », « {sov.g} » → « 7.98805 g ». */
export function fill(s: string): string {
  const sov = coinById('sovereign');
  const half = coinById('half-sovereign');
  const map: Record<string, string> = {
    year: String(P.year), taxYear: P.taxYear, taxYearShort: `${P.valid_from.slice(0, 4)}/${P.valid_to.slice(2, 4)}`,
    oz: formatDecimal(OZ, 7), oz2: formatDecimal(OZ, 2), grain: formatDecimal(P.units.grainGrams, 8), tola: formatDecimal(TOLA, 4), tolaGrains: String(P.units.tolaGrains),
    'cgt.allowance': gbp(P.cgt.annualExemptAmount).replace('.00', ''), 'cgt.basic': pct(P.cgt.basicRate, 0), 'cgt.higher': pct(P.cgt.higherRate, 0), 'cgt.band': gbp(P.cgt.basicRateBand).replace('.00', ''),
    chattel: gbp(P.chattels.exemptLimit).replace('.00', ''), 'chattel.upper': gbp(P.chattels.marginalUpper).replace('.00', ''),
    vat: pct(P.vat.standardRate, 0), 'vat.bar': String(P.vat.barMinFineness), 'vat.coin': String(P.vat.coinMinFineness), 'vat.premium': pct(P.vat.coinPremiumLimit, 0), 'vat.minted': String(P.vat.coinMintedAfter),
    'sov.g': `${formatDecimal(sov.grossG!, 5)} g`, 'sov.fine': `${formatDecimal(coinFineGrams(sov), 3)} g`, 'half.g': `${formatDecimal(half.grossG!, 5)} g`, 'half.fine': `${formatDecimal(coinFineGrams(half), 3)} g`,
    'hm.gold': `${formatDecimal(P.hallmarkExemptGrams.gold, 2)} g`, 'hm.silver': `${formatDecimal(P.hallmarkExemptGrams.silver, 2)} g`, 'hm.platinum': `${formatDecimal(P.hallmarkExemptGrams.platinum, 2)} g`, 'hm.palladium': `${formatDecimal(P.hallmarkExemptGrams.palladium, 2)} g`,
    'f.9': String(finenessOfCarat(9)), 'f.14': String(finenessOfCarat(14)), 'f.18': String(finenessOfCarat(18)), 'f.22': formatDecimal(finenessOfCarat(22), 1), 'f.24': String(finenessOfCarat(24)),
    'spot.when': stamp(SNAPSHOT.at.XAU),
  };
  return s.replace(/\{([a-zA-Z][a-zA-Z.0-9]*)\}/g, (m, k) => { if (!(k in map)) throw new Error(`jeton inconnu ${m}`); return map[k]; });
}

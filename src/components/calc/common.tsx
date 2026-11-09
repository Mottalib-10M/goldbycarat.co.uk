/** Pièces communes aux calculateurs : cadre, lignes de résultat, ligne du cours avec son heure. */
import { useEffect, useState, type ReactNode } from 'react';
import SelectField from '../ui/SelectField';
import { P, SNAPSHOT, type Metal } from '../../lib/engine/params';
import { refreshSpot, type Spot } from '../../lib/live';
import { gbp, stamp, clock } from '../../lib/money';
import { formatNumber } from '../../lib/format';

export const METAL_NAME: Record<Metal, string> = { XAU: 'Gold', XAG: 'Silver', XPT: 'Platinum', XPD: 'Palladium' };

/** Ligne d'état du cours : métal, prix de l'once, heure du relevé ; signale un repli.
 *  Test naïf, 3e tour (2026-11-08) : deux heures (relevé du texte, cours du calculateur) pour un même montant
 *  faisaient demander « lequel croire ? ». Si le cours lu est le même que le relevé, on garde l'heure du relevé
 *  et on dit qu'il n'a pas bougé ; s'il a bougé, on nomme le relevé utilisé par le texte (jamais en silence).
 *  4e tour (2026-11-08, trois testeurs) : la ligne était trop chargée (once, deux heures, source, « api »).
 *  Elle dit maintenant une chose : le prix et l'heure à laquelle il a été vérifié ; la source et le bouton
 *  « Check for a newer price » passent dans un repli « Where this price comes from ». */
export function SpotLine({ spot, metals }: { spot: Spot; metals: Metal[] }) {
  const [note, setNote] = useState('');
  const anyFailed = metals.some((m) => spot[m].failed);
  const allLive = metals.every((m) => spot[m].live);
  return (
    <div className="mt-1 text-xs leading-relaxed text-navy-600" data-chrome>
      {metals.map((m) => {
        const q = spot[m];
        const snap = SNAPSHOT.gbpPerOz[m];
        const same = q.live && Math.round(q.gbpPerOz * 100) === Math.round(snap * 100);
        const name = METAL_NAME[m].toLowerCase();
        const price = <span className="tabular-nums">{gbp(q.gbpPerOz)}</span>;
        return (
          <p key={m}>
            <span className={`mr-1.5 inline-block h-2 w-2 rounded-full align-middle ${q.live ? 'bg-green-600' : 'bg-navy-400'}`} aria-hidden="true" />
            {!q.live
              ? <span>{METAL_NAME[m]} price recorded {stamp(SNAPSHOT.at[m])}: {price} an ounce of pure {name} (31.1 g).</span>
              : same
                ? (clock(q.at) !== clock(SNAPSHOT.at[m])
                  ? <span>{METAL_NAME[m]} price checked at {clock(q.at)}: {price} an ounce of pure {name} (31.1 g), unchanged since {stamp(SNAPSHOT.at[m])}.</span>
                  : <span>{METAL_NAME[m]} price {stamp(q.at)}: {price} an ounce of pure {name} (31.1 g).</span>)
                : <span>{METAL_NAME[m]} price {stamp(q.at)}: {price} an ounce of pure {name} (31.1 g). The examples in the text use the {clock(SNAPSHOT.at[m])} price, {gbp(snap)}.</span>}
          </p>
        );
      })}
      {anyFailed && <p className="text-amber-800">The live price could not be reached: the figures use the price recorded when this page was built, at the time shown.</p>}
      <details className="mt-0.5">
        <summary className="cursor-pointer underline hover:text-navy-900">Where this price comes from</summary>
        <p className="mt-1">It is the price traders use for pure {metals.map((m) => METAL_NAME[m].toLowerCase()).join(' and ')}, from gold-api.com, a free price service. A shop pays less. The page reads it once when it opens.</p>
        <p className="mt-1">
          <button type="button" className="underline hover:text-navy-900" onClick={() => setNote(refreshSpot(metals) ? 'Checking for a newer price…' : 'Wait a few seconds before asking again.')}>Check for a newer price</button>
          {note && !allLive && <span className="ml-2">{note}</span>}
        </p>
      </details>
    </div>
  );
}

/** Valeurs d'exemple (test naïf, 4e tour : « 10 g → £366.99 » sans le mot « example » sur l'accueil, la page
 *  9ct, le souverain et les poinçons). Tout calculateur pré-rempli le dit tant que rien n'a été tapé ou choisi,
 *  et pas quand les valeurs viennent d'un lien partagé (une des clés de l'adresse est présente). */
export function useExample(keys: string[]) {
  const [example, setExample] = useState(true);
  useEffect(() => { const u = new URLSearchParams(location.search); if (keys.some((k) => u.has(k))) setExample(false); }, []);
  const typed = <T,>(f: (v: T) => void) => (v: T) => { setExample(false); f(v); };
  return { example, typed };
}

export function ExampleNote({ children }: { children: ReactNode }) {
  return <p data-exemple className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">{children}</p>;
}

export function Row({ label, value, strong = false, bar }: { label: ReactNode; value: ReactNode; strong?: boolean; bar?: number }) {
  return (
    <tr>
      <td className={`py-1.5 pr-3 ${strong ? 'font-semibold text-navy-900' : 'text-navy-700'}`}>{label}{bar !== undefined && <span className="mt-1 block h-1 rounded bg-accent-500" style={{ width: `${Math.max(2, Math.min(100, bar * 100))}%` }} />}</td>
      <td className={`tabular-nums py-1.5 text-right ${strong ? 'font-semibold text-navy-900' : 'text-navy-900'}`}>{value}</td>
    </tr>
  );
}

/** Cadre d'un calculateur : champs à gauche, résultat à côté (`data-resultat`). */
export function Frame({ title, fields, result, foot, mini = false }: { title?: string; fields: ReactNode; result: ReactNode; foot?: ReactNode; mini?: boolean }) {
  return (
    <div className={`not-prose rechner rounded-lg border border-accent-300 bg-white p-4 sm:p-5`} data-chrome>
      {title && <p className="mb-3 text-base font-semibold text-navy-900">{title}</p>}
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()} {...(mini ? { 'data-simulateur-secondaire': '' } : {})}>{fields}</form>
        <div data-resultat aria-live="polite" className="rounded-lg bg-accent-50 p-4">{result}</div>
      </div>
      {foot}
    </div>
  );
}

export function Big({ label, value, sub }: { label: string; value: string; sub?: ReactNode }) {
  return (<>
    <p className="text-sm font-medium text-navy-700">{label}</p>
    <p className="mt-1 text-[2.2rem] font-bold leading-tight text-navy-900 tabular-nums">{value}</p>
    {sub && <p className="mt-1 text-sm text-navy-700">{sub}</p>}
  </>);
}

export function Table({ caption, children }: { caption: string; children: ReactNode }) {
  return <table className="mt-3 w-full text-sm"><caption className="sr-only">{caption}</caption><tbody className="divide-y divide-accent-200">{children}</tbody></table>;
}

/** Liste des carats publiés (titre légal britannique). */
export function CaratSelect({ id, value, onChange, label = 'Carat' }: { id: string; value: number; onChange: (ct: number) => void; label?: string }) {
  return <SelectField id={id} label={label} value={String(value)} onChange={(v) => onChange(Number(v))}
    options={P.gold.map((g) => ({ value: String(g.ct), label: `${g.ct}ct (${Math.abs(g.fineness - 916.6) < 0.1 ? '916' : formatNumber(g.fineness, g.fineness % 1 ? 1 : 0)})` }))} />;
}

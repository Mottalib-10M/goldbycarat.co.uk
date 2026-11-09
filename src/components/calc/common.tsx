/** Pièces communes aux calculateurs : cadre, lignes de résultat, ligne du cours avec son heure. */
import { useState, type ReactNode } from 'react';
import SelectField from '../ui/SelectField';
import { P, SNAPSHOT, type Metal } from '../../lib/engine/params';
import { refreshSpot, type Spot } from '../../lib/live';
import { gbp, stamp, clock } from '../../lib/money';
import { formatNumber } from '../../lib/format';

export const METAL_NAME: Record<Metal, string> = { XAU: 'Gold', XAG: 'Silver', XPT: 'Platinum', XPD: 'Palladium' };

/** Ligne d'état du cours : métal, prix de l'once, heure du relevé, source ; signale un repli.
 *  Test naïf, 3e tour (2026-11-08) : deux heures (relevé du texte, cours du calculateur) pour un même montant
 *  faisaient demander « lequel croire ? ». Si le cours lu est le même que le relevé, on garde l'heure du relevé
 *  et on dit qu'il n'a pas bougé ; s'il a bougé, on nomme le relevé utilisé par le texte (jamais en silence). */
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
        const name = METAL_NAME[m];
        return (
          <p key={m}>
            <span className={`mr-1.5 inline-block h-2 w-2 rounded-full align-middle ${q.live ? 'bg-green-600' : 'bg-navy-400'}`} aria-hidden="true" />
            <span>{q.live ? `Live ${name.toLowerCase()} price` : `${name} price, last recorded`}: <span className="tabular-nums">{gbp(q.gbpPerOz)}</span> for an ounce of pure {name.toLowerCase()} (31.1 g), {same ? <>{stamp(SNAPSHOT.at[m])}{clock(q.at) !== clock(SNAPSHOT.at[m]) && <>, still the same at {clock(q.at)}</>}</> : stamp(q.at)}. Source: gold-api.com, a free price service.{q.live && !same && <> The examples in the text use the price recorded at {clock(SNAPSHOT.at[m])}: {gbp(snap)}.</>}</span>
          </p>
        );
      })}
      {anyFailed && <p className="text-amber-800">The live price could not be reached: the figures use the price recorded when this page was built, at the time shown.</p>}
      <p>
        <button type="button" className="underline hover:text-navy-900" onClick={() => setNote(refreshSpot(metals) ? 'Checking for a newer price…' : 'Wait a few seconds before asking again.')}>Check for a newer price</button>
        {note && !allLive && <span className="ml-2">{note}</span>}
      </p>
    </div>
  );
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

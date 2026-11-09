/**
 * Tous les calculateurs du site, choisis par `tool`. Chacun appelle le moteur (lib/engine/metal.ts) et
 * lit le cours par useSpot() : premier rendu = relevé du build (HTML servi), puis cours du moment
 * (RECETTE §17.5). L'état ne s'écrit dans l'adresse qu'après une action (url-state.ts, §18.1).
 */
import { useEffect, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { useSpot } from '../../lib/live';
import { P, SNAPSHOT, type Metal } from '../../lib/engine/params';
import { finenessOfCarat, metalValue, gramPrice, caratTable, toGrams, fromGrams, TOLA, OZ, offerShare, lotValue, coinFineGrams, coinMetalValue, coinById, premium, vatStatus, cgt, caratOfFineness, finePerGram, type Unit, type CgtKind, type VatItem } from '../../lib/engine/metal';
import { gbp, gbp2, pct, grams } from '../../lib/money';
import { formatNumber, formatDecimal } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { SpotLine, Row, Frame, Big, Table, CaratSelect, METAL_NAME } from './common';

export interface ToolArgs { tool: string; mini?: boolean; title?: string; idp?: string; ct?: number; unit?: string; coin?: string; fineness?: number; metal?: string; kind?: string; item?: string; grams?: number; offer?: number; bar?: number; methodHref?: string }

const fin = (f: number) => formatNumber(f, f % 1 ? 1 : 0);
/** Chiffre de l'or tel qu'il est poinçonné : 916 pour le 22 ct (titre légal 916,6), pour qu'un même carat
 *  s'écrive partout de la même façon (test naïf, 2e tour du 2026-11-08 : 916 / 916.6 / 916.7 déroutaient). */
export const stampOf = (f: number) => (Math.abs(f - 916.6) < 0.1 ? '916' : fin(f));
/** Offre d'exemple : une part de la valeur métal au relevé du build, arrondie à 5 £. Jamais au-dessus de
 *  100 % (test naïf du 2026-11-08 : des offres par défaut à 109 % et 123,5 % faisaient croire qu'un
 *  acheteur paie plus que l'or). 70 % reprend l'exemple écrit sur l'accueil ; ce n'est pas un taux de marché. */
const exampleOffer = (g: number, ct: number, share: number) => Math.round(metalValue(g, finenessOfCarat(ct), SNAPSHOT.gbpPerOz.XAU) * share / 5) * 5;
const OFFER_PATH = '/en/gold-offer-checker/';
const HALLMARK_PATH = '/en/uk-hallmarks-guide/';
const INHERITED_PATH = '/en/selling-inherited-gold/';
const SCRAP_PATH = '/en/scrap-gold-price/';
const COIN_PATH = '/en/sovereign-gold-value/';
const NO_FAIR_RATE = 'There is no official fair rate. To know if this offer is good, ask two other buyers to quote for the same gold today: the highest share is the best offer.';
const KEPT_NOTE = 'What the buyer keeps pays for melting and refining, staff and the risk that the price falls: it is not all profit.';
const OVER_100 = 'More than the gold is worth: check the weight and carat the buyer wrote down, or ask whether it is paying for the piece as jewellery.';

/** Titre d'un calculateur secondaire posé dans le texte, sous le calculateur de la page : deux
 *  calculateurs empilés ont chacun le leur (testeurs naïfs du 2026-11-08, report de trame). */
const MINI_TITLES: Record<string, string> = {
  offer: 'Check an offer for this gold', compare: 'Compare two or three quotes', scrap: 'Value a mixed lot of scrap gold',
  hallmark: 'What the number stamped on a piece means', bar: 'Value a gold bar', vat: 'VAT on a gold purchase',
};

export default function Tool(a0: ToolArgs) {
  const a = { ...a0, title: a0.title ?? (a0.mini ? MINI_TITLES[a0.tool] : undefined) };
  switch (a.tool) {
    case 'board': return <Board {...a} />;
    case 'carat': return <CaratTool {...a} />;
    case 'offer': return <Offer {...a} />;
    case 'scrap': return <Scrap {...a} />;
    case 'compare': return <Compare {...a} />;
    case 'units': return <Units {...a} />;
    case 'bar': return <Bar {...a} />;
    case 'coin': return <CoinTool {...a} />;
    case 'silver': return <Silver {...a} />;
    case 'pgm': return <Pgm {...a} />;
    case 'cgt': return <Cgt {...a} />;
    case 'vat': return <Vat {...a} />;
    case 'hallmark': return <Hallmark {...a} />;
    case 'karatconv': return <KaratConv {...a} />;
    default: return null;
  }
}

/* ---------- Accueil : prix du gramme par carat, valeur d'un poids ---------- */
function Board({ mini, title, idp = 'b', ct = 9, grams: g0 = 10 }: ToolArgs) {
  const [k, setK] = useState(ct);
  const [g, setG] = useState(g0);
  // Test naïf, 3e tour : le visiteur venu vérifier une offre devait changer de page ; le champ facultatif
  // de la page 9 ct est repris ici, vide par défaut (aucune offre d'exemple sur l'accueil).
  const [offer, setOffer] = useState(0);
  useEffect(() => { const u = readParams(location.search); setK(num(u, 'ct', ct)); setG(num(u, 'g', g0)); setOffer(num(u, 'o', 0)); }, []);
  useEffect(() => { updateURL({ ct: k, g, o: offer || undefined }); }, [k, g, offer]);
  const spot = useSpot(['XAU']);
  const oz = spot.XAU.gbpPerOz;
  const value = metalValue(g, finenessOfCarat(k), oz);
  const s = offerShare(offer, value);
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <div className="grid grid-cols-2 gap-x-4"><CaratSelect id={`${idp}-ct`} value={k} onChange={setK} /><NumberField id={`${idp}-g`} label="Weight" value={g} onChange={setG} unit="g" decimals={2} max={100000} /></div>
        <p className="-mt-2 text-xs text-navy-600">Not sure of the carat? Look for a number inside the ring or on the clasp: 375 is 9ct, 585 is 14ct, 750 is 18ct, 916 is 22ct. <a href={HALLMARK_PATH} className="underline hover:text-navy-900">No number?</a></p>
        <NumberField id={`${idp}-o`} label="Offer you were given (optional)" value={offer} onChange={setOffer} unit="£" decimals={2} max={10000000} help="Type the total a shop offered to see what share of your gold it pays; leave at 0 if you have none" />
        <SpotLine spot={spot} metals={['XAU']} />
      </>}
      result={<>
        <Big label={`${formatNumber(g, 2)} g of ${k}ct gold is worth`} value={gbp(value)} sub="This is the value of the gold itself. A buyer pays less, because it has to melt and refine it." />
        {offer > 0 && <>
          <p className="mt-3 text-base font-semibold text-navy-900">Your offer of {gbp(offer)} pays {pct(s.share)} of this gold value{s.gap > 0 ? <>; the buyer keeps {gbp(s.gap)}</> : null}.</p>
          <p className={`mt-1 text-sm ${s.share > 1 ? 'text-amber-800' : 'text-navy-700'}`}>{s.share > 1 ? OVER_100 : NO_FAIR_RATE}</p>
        </>}
        <ul className="mt-3 space-y-1.5 text-sm">
          <li><a href={`${OFFER_PATH}?ct=${k}&g=${g}${offer > 0 ? `&o=${offer}` : ''}`} className="font-medium text-accent-700 underline hover:text-navy-900">{offer > 0 ? 'Got other quotes? Compare them, and see what to check before you say yes →' : 'Got an offer from a shop? See what share of your gold it pays →'}</a></li>
          <li><a href={SCRAP_PATH} className="text-accent-700 underline hover:text-navy-900">Several pieces of different carats? Value them together →</a></li>
          <li><a href={INHERITED_PATH} className="text-accent-700 underline hover:text-navy-900">Inherited some gold? What to check before you sell →</a></li>
          <li><a href={COIN_PATH} className="text-accent-700 underline hover:text-navy-900">Sovereigns or other coins? Value them without scales →</a></li>
        </ul>
        <Table caption="Gold price per gram by carat">
          {caratTable(oz).map((r) => <Row key={r.ct} label={`1 g of ${r.ct}ct (${stampOf(r.fineness)})`} value={gbp2(r.gram)} strong={r.ct === k} />)}
        </Table>
      </>} />
  );
}

/* ---------- Page d'un carat : valeur d'un poids et tableau des poids courants ---------- */
function CaratTool({ mini, title, idp = 'c', ct = 9, grams: g0 = 10 }: ToolArgs) {
  const [g, setG] = useState(g0);
  const [offer, setOffer] = useState(0);
  useEffect(() => { const u = readParams(location.search); setG(num(u, 'g', g0)); setOffer(num(u, 'o', 0)); }, []);
  useEffect(() => { updateURL({ g, o: offer || undefined }); }, [g, offer]);
  const spot = useSpot(['XAU']);
  const oz = spot.XAU.gbpPerOz;
  const f = finenessOfCarat(ct);
  const value = metalValue(g, f, oz);
  const s = offerShare(offer, value);
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <NumberField id={`${idp}-g`} label={`Weight of your ${ct}ct gold`} value={g} onChange={setG} unit="g" decimals={2} max={100000} help="Weigh it on kitchen scales to 0.1 g; stones and springs make it heavier than the gold inside" />
        <NumberField id={`${idp}-o`} label="Offer you were given (optional)" value={offer} onChange={setOffer} unit="£" decimals={2} max={10000000} help="Type the total a buyer offered to see what share of the gold it pays; leave at 0 if you have none" />
        <SpotLine spot={spot} metals={['XAU']} />
      </>}
      result={<>
        <Big label={`${formatNumber(g, 2)} g of ${ct}ct (${stampOf(f)} parts gold in 1,000)`} value={gbp(value)} sub="This is the value of the gold itself, at today’s price for pure gold. A buyer pays less." />
        <Table caption={`${ct}ct gold value`}>
          <Row label="Pure gold inside" value={grams(g * f / 1000, 3)} />
          <Row label={`Value of 1 g of ${ct}ct`} value={gbp2(gramPrice(f, oz))} />
          {offer > 0 && <Row label="The offer pays" value={`${pct(s.share)} of the gold value`} strong />}
          {offer > 0 && <Row label={s.gap >= 0 ? 'Difference kept by the buyer' : 'Above the gold value'} value={gbp(Math.abs(s.gap))} />}
        </Table>
        {offer > 0 && <p className={`mt-2 text-sm ${s.share > 1 ? 'text-amber-800' : 'text-navy-700'}`}>{s.share > 1 ? OVER_100 : NO_FAIR_RATE}</p>}
        {offer > 0 && <BeforeYes />}
      </>} />
  );
}

/* ---------- Vérificateur d'offre ---------- */
function Offer({ mini, title, idp = 'o', ct = 9, grams: g0 = 15, offer: given }: ToolArgs) {
  const o0 = given ?? exampleOffer(g0, ct, 0.7);
  const [k, setK] = useState(ct);
  const [g, setG] = useState(g0);
  const [offer, setOffer] = useState(o0);
  // Tant que l'offre n'a pas été tapée (ni reçue par un lien), c'est un exemple et l'écran le dit
  // (test naïf, 2e tour : « This offer pays 69.9% » sans rien saisir était pris pour un vrai résultat).
  const [example, setExample] = useState(given === undefined);
  useEffect(() => { const u = readParams(location.search); const kk = num(u, 'ct', ct), gg = num(u, 'g', g0); setK(kk); setG(gg); setOffer(num(u, 'o', gg === g0 && kk === ct ? o0 : exampleOffer(gg, kk, 0.7))); if (u.has('o')) setExample(false); }, []);
  useEffect(() => { updateURL({ ct: k, g, o: offer }); }, [k, g, offer]);
  const typeOffer = (v: number) => { setOffer(v); setExample(false); };
  const spot = useSpot(['XAU']);
  const value = metalValue(g, finenessOfCarat(k), spot.XAU.gbpPerOz);
  const s = offerShare(offer, value);
  const scale = Math.max(value, offer);
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <div className="grid grid-cols-2 gap-x-4"><CaratSelect id={`${idp}-ct`} value={k} onChange={setK} /><NumberField id={`${idp}-g`} label="Weight" value={g} onChange={setG} unit="g" decimals={2} max={100000} /></div>
        {example && <p data-exemple className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">Example figures: type your own weight and offer.</p>}
        <NumberField id={`${idp}-o`} label="Total offered" value={offer} onChange={typeOffer} unit="£" decimals={2} max={10000000} help={example ? `${formatNumber(g, 0)} g and ${gbp(offer)} are only an example: replace them with the weight and the cash figure the buyer quoted` : 'The cash figure the buyer quoted for the whole lot'} />
        <SpotLine spot={spot} metals={['XAU']} />
      </>}
      result={<>
        <Big label={example ? 'Example: this offer pays' : 'This offer pays'} value={pct(s.share)} sub={<>of the {gbp(value)} the gold is worth in {example ? 'this example of' : 'your'} {formatNumber(g, 2)} g of {k}ct</>} />
        <p className={`mt-2 text-sm font-medium ${s.share > 1 ? 'text-amber-800' : 'text-navy-900'}`}>{s.share > 1 ? OVER_100 : NO_FAIR_RATE}</p>
        <Table caption="Offer compared with the metal value">
          <Row label="Value of the gold" value={gbp(value)} bar={scale > 0 ? value / scale : 0} />
          <Row label="Offer" value={gbp(offer)} bar={scale > 0 ? offer / scale : 0} />
          <Row label={s.gap >= 0 ? 'Difference kept by the buyer' : 'Offer above the gold value'} value={gbp(Math.abs(s.gap))} strong />
          <Row label="Offer per gram" value={g > 0 ? gbp2(offer / g) : '–'} />
        </Table>
        {s.gap > 0 && <p className="mt-2 text-xs text-navy-600">{KEPT_NOTE}</p>}
        <BeforeYes />
      </>} />
  );
}

/** Test naïf, 3e tour : « est-ce que je me fais avoir ? » restait sans réponse visible. Aucune fourchette
 *  sourcée n'existe (FAQ : aucune loi ni organisme n'en fixe) : on donne la marche à suivre, sans chiffre. */
function BeforeYes() {
  return (
    <div className="mt-3 border-t border-accent-200 pt-2 text-sm text-navy-800">
      <p className="font-semibold text-navy-900">Before you say yes</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5">
        <li>Ask for the weight and the carat the buyer wrote down, and compare them with yours.</li>
        <li>Get one or two more quotes for the same gold today: the highest share is the best offer.</li>
        <li>A signed, antique or stone-set piece may be worth more to a second-hand jeweller than its gold.</li>
      </ul>
    </div>
  );
}

/* ---------- Lot d'or mêlé (scrap) ---------- */
function Scrap({ mini, title, idp = 's' }: ToolArgs) {
  const [q, setQ] = useState<Record<number, number>>({ 9: 20, 14: 0, 18: 5, 22: 0 });
  const [share, setShare] = useState(70);
  // Test naïf, 3e tour : pour un lot mêlé, la page renvoyait au vérificateur, qui ne prend qu'un carat.
  // L'offre reçue pour tout le lot se tape ici ; les poids d'exemple sont signalés tant qu'on n'a rien tapé.
  const [offer, setOffer] = useState(0);
  const [example, setExample] = useState(true);
  useEffect(() => { const u = readParams(location.search); setQ({ 9: num(u, 'a', 20), 14: num(u, 'b', 0), 18: num(u, 'c', 5), 22: num(u, 'd', 0) }); setShare(num(u, 'p', 70)); setOffer(num(u, 'o', 0)); if (['a', 'b', 'c', 'd'].some((x) => u.has(x))) setExample(false); }, []);
  useEffect(() => { updateURL({ a: q[9], b: q[14], c: q[18], d: q[22], p: share, o: offer || undefined }); }, [q, share, offer]);
  const spot = useSpot(['XAU']);
  const lot = lotValue([9, 14, 18, 22].map((ct) => ({ grams: q[ct], fineness: finenessOfCarat(ct) })), spot.XAU.gbpPerOz);
  const set = (ct: number) => (v: number) => { setExample(false); setQ((o) => ({ ...o, [ct]: v })); };
  const s = offerShare(offer, lot.value);
  return (
    <Frame mini={mini} title={title}
      fields={<>
        {example && <p data-exemple className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">Example figures: type the weights of your own pieces.</p>}
        <div className="grid grid-cols-2 gap-x-4">{[9, 14, 18, 22].map((ct) => <NumberField key={ct} id={`${idp}-${ct}`} label={`Grams of ${ct}ct`} value={q[ct]} onChange={set(ct)} unit="g" decimals={2} max={100000} />)}</div>
        <NumberField id={`${idp}-p`} label="Share of the gold value a buyer pays you" value={share} onChange={setShare} unit="%" decimals={1} max={100} help="70% is only an example, not a market rate: type the share a buyer quotes, or try a few" />
        <NumberField id={`${idp}-o`} label="One offer for the whole lot (optional)" value={offer} onChange={setOffer} unit="£" decimals={2} max={10000000} help="Got one price for everything? Type it to see what share of the gold in the lot it pays; leave at 0 if you have none" />
        <SpotLine spot={spot} metals={['XAU']} />
      </>}
      result={<>
        <Big label={example ? 'Example: gold metal in the whole lot' : 'Gold metal in the whole lot'} value={gbp(lot.value)} sub={`${grams(lot.fineGrams)} of pure gold across ${formatNumber(q[9] + q[14] + q[18] + q[22], 2)} g of items`} />
        {offer > 0 && <>
          <p className="mt-3 text-base font-semibold text-navy-900">The offer of {gbp(offer)} pays {pct(s.share)} of the gold in the lot{s.gap > 0 ? <>; the buyer keeps {gbp(s.gap)}</> : null}.</p>
          <p className={`mt-1 text-sm ${s.share > 1 ? 'text-amber-800' : 'text-navy-700'}`}>{s.share > 1 ? OVER_100 : NO_FAIR_RATE}</p>
        </>}
        <Table caption="Payout at different shares of the metal">
          {[share, 60, 70, 80, 90].filter((v, i, arr) => arr.indexOf(v) === i).sort((x, y) => x - y).map((p) => <Row key={p} label={`Paid at ${formatDecimal(p, 1)}% of the gold value`} value={gbp(lot.value * p / 100)} strong={p === share} />)}
        </Table>
      </>} />
  );
}

/* ---------- Comparer trois offres ---------- */
function Compare({ mini, title, idp = 'cp', ct = 9, grams: g0 = 25 }: ToolArgs) {
  const [k, setK] = useState(ct);
  const [g, setG] = useState(g0);
  // Deux offres d'exemple sous la valeur du métal (65 % et 75 %), jamais au-dessus (test naïf du 2026-11-08).
  const ex = (gg: number, kk: number): [number, number, number] => [exampleOffer(gg, kk, 0.65), exampleOffer(gg, kk, 0.75), 0];
  const [o, setO] = useState<[number, number, number]>(ex(g0, ct));
  const [example, setExample] = useState(true);
  useEffect(() => { const u = readParams(location.search); const kk = num(u, 'ct', ct), gg = num(u, 'g', g0); const d = ex(gg, kk); setK(kk); setG(gg); setO([num(u, 'x', d[0]), num(u, 'y', d[1]), num(u, 'z', 0)]); if (u.has('x') || u.has('y')) setExample(false); }, []);
  useEffect(() => { updateURL({ ct: k, g, x: o[0], y: o[1], z: o[2] }); }, [k, g, o]);
  const spot = useSpot(['XAU']);
  const value = metalValue(g, finenessOfCarat(k), spot.XAU.gbpPerOz);
  const scale = Math.max(value, ...o);
  const names = ['Offer A', 'Offer B', 'Offer C'];
  const best = o.reduce((bi, v, i) => (v > o[bi] ? i : bi), 0);
  const setI = (i: number) => (v: number) => { setExample(false); setO((x) => { const y = [...x] as [number, number, number]; y[i] = v; return y; }); };
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <div className="grid grid-cols-2 gap-x-4"><CaratSelect id={`${idp}-ct`} value={k} onChange={setK} /><NumberField id={`${idp}-g`} label="Weight" value={g} onChange={setG} unit="g" decimals={2} max={100000} /></div>
        {example && <p data-exemple className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">Example figures: type the quotes you were given.</p>}
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-x`} label="Offer A (e.g. high street)" value={o[0]} onChange={setI(0)} unit="£" decimals={2} max={10000000} /><NumberField id={`${idp}-y`} label="Offer B (e.g. postal buyer)" value={o[1]} onChange={setI(1)} unit="£" decimals={2} max={10000000} /></div>
        <NumberField id={`${idp}-z`} label="Offer C (optional)" value={o[2]} onChange={setI(2)} unit="£" decimals={2} max={10000000} help="Leave at 0 if you only have two quotes" />
        <SpotLine spot={spot} metals={['XAU']} />
      </>}
      result={<>
        <Big label={`${example ? 'Example: best' : 'Best'} offer: ${names[best]}`} value={pct(value > 0 ? o[best] / value : 0)} sub={<>of the {gbp(value)} the gold in {formatNumber(g, 2)} g of {k}ct is worth</>} />
        <Table caption="Each offer as a share of the gold value">
          {o.map((v, i) => v > 0 && <Row key={i} label={`${names[i]}: ${gbp(v)}`} value={pct(value > 0 ? v / value : 0)} bar={scale > 0 ? v / scale : 0} strong={i === best} />)}
          <Row label="Gap between best and worst" value={gbp(Math.max(...o.filter((v) => v > 0)) - Math.min(...o.filter((v) => v > 0)))} />
        </Table>
        {value > 0 && o[best] > value && <p className="mt-2 text-sm text-amber-800">{OVER_100}</p>}
      </>} />
  );
}

/* ---------- Unités : once, tola, kilo, gramme ---------- */
function Units({ mini, title, idp = 'u', unit = 'oz', ct = 24 }: ToolArgs) {
  const [n, setN] = useState(1);
  const [u, setU] = useState<Unit>(unit as Unit);
  const [k, setK] = useState(ct);
  const [tola, setTola] = useState(Math.round(TOLA * 10000) / 10000);
  useEffect(() => { const q = readParams(location.search); setN(num(q, 'n', 1)); const uu = str(q, 'u', unit); if (['g', 'oz', 'kg', 'tola'].includes(uu)) setU(uu as Unit); setK(num(q, 'ct', ct)); }, []);
  useEffect(() => { updateURL({ n, u, ct: k }); }, [n, u, k]);
  const spot = useSpot(['XAU']);
  const g = toGrams(n, u, tola);
  const value = metalValue(g, finenessOfCarat(k), spot.XAU.gbpPerOz);
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-n`} label="Quantity" value={n} onChange={setN} decimals={4} max={1000000} />
          <SelectField id={`${idp}-u`} label="Unit" value={u} onChange={(v) => setU(v as Unit)} options={[{ value: 'oz', label: 'Troy ounce' }, { value: 'g', label: 'Gram' }, { value: 'tola', label: 'Tola' }, { value: 'kg', label: 'Kilogram' }]} /></div>
        <CaratSelect id={`${idp}-ct`} value={k} onChange={setK} />
        {u === 'tola' && <NumberField id={`${idp}-t`} label="Weight of one tola" value={tola} onChange={setTola} unit="g" decimals={4} max={100} help="11.6638 g is the usual Indian tola; change it if your seller uses another" />}
        <SpotLine spot={spot} metals={['XAU']} />
      </>}
      result={<>
        <Big label={`${formatDecimal(n, 4)} ${u === 'oz' ? 'troy oz' : u} of ${k}ct gold`} value={gbp(value)} sub={`${grams(g, 3)} with ${stampOf(finenessOfCarat(k))} parts of gold in 1,000${k === 24 ? ': 24ct is counted at 999, so it is a little under the price of a perfectly pure ounce' : ''}`} />
        <Table caption="The same weight in other units">
          <Row label="Grams" value={formatNumber(g, 3)} />
          <Row label="Troy ounces" value={formatNumber(fromGrams(g, 'oz'), 4)} />
          <Row label={`Tolas (${formatDecimal(tola, 4)} g)`} value={formatNumber(fromGrams(g, 'tola', tola), 4)} />
          <Row label="Grains" value={formatNumber(fromGrams(g, 'grain'), 1)} />
        </Table>
      </>} />
  );
}

/* ---------- Lingots : valeur métal, prime demandée ---------- */
function Bar({ mini, title, idp = 'br', bar = 100 }: ToolArgs) {
  const [size, setSize] = useState(bar);
  const [price, setPrice] = useState(0);
  useEffect(() => { const q = readParams(location.search); setSize(num(q, 'w', bar)); setPrice(num(q, 'p', 0)); }, []);
  useEffect(() => { updateURL({ w: size, p: price || undefined }); }, [size, price]);
  const spot = useSpot(['XAU']);
  const value = metalValue(size, 999.9, spot.XAU.gbpPerOz);
  const prem = premium(price, value);
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <SelectField id={`${idp}-w`} label="Bar size" value={String(size)} onChange={(v) => setSize(Number(v))} options={P.barSizesGrams.map((w) => ({ value: String(w), label: Math.abs(w - OZ) < 0.001 ? '1 troy ounce (31.10 g)' : w >= 1000 ? '1 kilo' : `${formatDecimal(w, 1)} g` }))} help="Bar weights the UK tax office (HMRC) accepts as investment gold, all 999.9 parts in 1,000" />
        <NumberField id={`${idp}-p`} label="Price a dealer asks (optional)" value={price} onChange={setPrice} unit="£" decimals={2} max={10000000} help="Type a quoted price to see how much it asks above the value of the gold inside" />
        <SpotLine spot={spot} metals={['XAU']} />
      </>}
      result={<>
        <Big label={`Gold in a ${Math.abs(size - OZ) < 0.001 ? '1 oz' : size >= 1000 ? '1 kg' : `${formatDecimal(size, 1)} g`} bar at 999.9`} value={gbp(value)} sub="No VAT on a bar of at least 995 fine in a weight the market accepts" />
        <Table caption="Gold bar value">
          <Row label="Per gram of fine gold" value={gbp2(finePerGram(spot.XAU.gbpPerOz))} />
          {price > 0 && <Row label="Dealer price" value={gbp(price)} />}
          {price > 0 && <Row label="Premium over the metal" value={`${pct(prem)} (${gbp(price - value)})`} strong />}
        </Table>
      </>} />
  );
}

/* ---------- Pièces : valeur métal, prime, test des 180 % ---------- */
function CoinTool({ mini, title, idp = 'cn', coin = 'sovereign' }: ToolArgs) {
  const [id, setId] = useState(coin);
  const [n, setN] = useState(1);
  const [price, setPrice] = useState(0);
  useEffect(() => { const q = readParams(location.search); const c = str(q, 'c', coin); if (P.coins.some((x) => x.id === c)) setId(c); setN(num(q, 'n', 1)); setPrice(num(q, 'p', 0)); }, []);
  useEffect(() => { updateURL({ c: id, n, p: price || undefined }); }, [id, n, price]);
  const c = coinById(id);
  const metals: Metal[] = c.metal === 'XAG' ? ['XAG'] : ['XAU'];
  const spot = useSpot(metals);
  const one = coinMetalValue(c, spot[c.metal].gbpPerOz);
  const total = one * n;
  const ratio = one > 0 && price > 0 ? price / (one * n) : 0;
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <SelectField id={`${idp}-c`} label="Coin" value={id} onChange={setId} options={P.coins.map((x) => ({ value: x.id, label: x.name }))} />
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-n`} label="How many" value={n} onChange={setN} max={10000} />
          <NumberField id={`${idp}-p`} label="Price (optional)" value={price} onChange={setPrice} unit="£" decimals={2} max={10000000} /></div>
        <p className="-mt-2 text-xs text-navy-600">Price: what a dealer asks, or a buyer offers, for all these coins. It shows that price as a share of the gold inside. Leave at 0 if you have no price.</p>
        <SpotLine spot={spot} metals={metals} />
      </>}
      result={<>
        <Big label={`Value of the ${c.metal === 'XAG' ? 'silver' : 'gold'} in ${n} × ${c.name}`} value={gbp(total)} sub={`${grams(coinFineGrams(c), 3)} of pure ${c.metal === 'XAG' ? 'silver' : 'gold'} per coin, ${gbp2(one)} each`} />
        <Table caption="Coin value">
          {c.grossG !== undefined && <Row label="Weight of one coin (set by law)" value={grams(c.grossG, 2)} />}
          <Row label="Gold in 1,000 parts" value={Math.abs(c.fineness - 2750 / 3) < 0.01 ? '916 (eleven twelfths, the same gold as 22ct)' : fin(c.fineness)} />
          {price > 0 && <Row label="Price as a share of the gold" value={pct(ratio)} strong />}
          {price > 0 && c.metal === 'XAU' && <Row label="VAT when you buy" value={ratio <= P.vat.coinPremiumLimit ? 'None (investment gold)' : 'Due: price above 180% of the gold'} />}
          <Row label="Tax when you sell" value={c.legalTenderUK ? 'British coin: no Capital Gains Tax' : `Foreign coin: tax-free up to £${formatNumber(P.chattels.exemptLimit, 0)}`} />
        </Table>
      </>} />
  );
}

/* ---------- Argent ---------- */
function Silver({ mini, title, idp = 'ag', fineness = 925, unit = 'g', grams: g0 = 100 }: ToolArgs) {
  const [f, setF] = useState(fineness);
  const [n, setN] = useState(g0);
  const [u, setU] = useState<Unit>(unit as Unit);
  useEffect(() => { const q = readParams(location.search); setF(num(q, 'f', fineness)); setN(num(q, 'n', g0)); const uu = str(q, 'u', unit); if (['g', 'oz', 'kg'].includes(uu)) setU(uu as Unit); }, []);
  useEffect(() => { updateURL({ f, n, u }); }, [f, n, u]);
  const spot = useSpot(['XAG']);
  const oz = spot.XAG.gbpPerOz;
  const g = toGrams(n, u);
  const value = metalValue(g, f, oz);
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <SelectField id={`${idp}-f`} label="Silver standard (hallmark)" value={String(f)} onChange={(v) => setF(Number(v))} options={P.silver.map((s) => ({ value: String(s), label: s === 925 ? '925 sterling' : s === 958.4 ? '958 Britannia' : s === 999 ? '999 fine' : `${s}` }))} />
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-n`} label="Weight" value={n} onChange={setN} decimals={3} max={1000000} />
          <SelectField id={`${idp}-u`} label="Unit" value={u} onChange={(v) => setU(v as Unit)} options={[{ value: 'g', label: 'Grams' }, { value: 'oz', label: 'Troy ounces' }, { value: 'kg', label: 'Kilograms' }]} /></div>
        <SpotLine spot={spot} metals={['XAG']} />
      </>}
      result={<>
        <Big label={`${formatDecimal(n, 3)} ${u === 'oz' ? 'troy oz' : u} of ${fin(f)} silver`} value={gbp(value)} sub="Value of the silver itself at today’s price, before a buyer takes its cut" />
        <Table caption="Silver price by unit">
          <Row label={`1 g at ${fin(f)}`} value={gbp2(gramPrice(f, oz))} />
          <Row label={`1 troy oz at ${fin(f)}`} value={gbp2(gramPrice(f, oz) * OZ)} />
          <Row label={`1 kg at ${fin(f)}`} value={gbp(gramPrice(f, oz) * 1000)} />
          <Row label="Fine silver, per gram" value={gbp2(finePerGram(oz))} />
        </Table>
      </>} />
  );
}

/* ---------- Platine et palladium ---------- */
function Pgm({ mini, title, idp = 'pg', metal = 'XPT', fineness = 950, grams: g0 = 10 }: ToolArgs) {
  const m = (metal === 'XPD' ? 'XPD' : 'XPT') as Metal;
  const list = m === 'XPT' ? P.platinum : P.palladium;
  const [f, setF] = useState(fineness);
  const [g, setG] = useState(g0);
  useEffect(() => { const q = readParams(location.search); setF(num(q, 'f', fineness)); setG(num(q, 'g', g0)); }, []);
  useEffect(() => { updateURL({ f, g }); }, [f, g]);
  const spot = useSpot([m]);
  const oz = spot[m].gbpPerOz;
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <div className="grid grid-cols-2 gap-x-4"><SelectField id={`${idp}-f`} label="Hallmark standard" value={String(f)} onChange={(v) => setF(Number(v))} options={list.map((s) => ({ value: String(s), label: String(s) }))} />
          <NumberField id={`${idp}-g`} label="Weight" value={g} onChange={setG} unit="g" decimals={2} max={100000} /></div>
        <SpotLine spot={spot} metals={[m]} />
      </>}
      result={<>
        <Big label={`${formatNumber(g, 2)} g of ${METAL_NAME[m].toLowerCase()} ${f}`} value={gbp(metalValue(g, f, oz))} sub="Value of the metal itself at today’s price" />
        <Table caption={`${METAL_NAME[m]} price per gram by standard`}>
          {list.map((s) => <Row key={s} label={`1 g at ${s}`} value={gbp2(gramPrice(s, oz))} strong={s === f} />)}
          <Row label="1 troy oz, fine" value={gbp(oz)} />
        </Table>
      </>} />
  );
}

/* ---------- CGT ---------- */
function Cgt({ mini, title, idp = 'cg', kind = 'chattel' }: ToolArgs) {
  const [k, setK] = useState<CgtKind>(kind as CgtKind);
  const [proceeds, setProceeds] = useState(3000);
  const [cost, setCost] = useState(1000);
  const [costs, setCosts] = useState(0);
  const [income, setIncome] = useState(30000);
  // Test naïf, 3e tour : valeurs d'exemple signalées tant que rien n'est tapé ; le revenu ne se demande que
  // s'il change quelque chose, c'est-à-dire quand il reste un montant à taxer.
  const [example, setExample] = useState(true);
  const typed = <T,>(f: (v: T) => void) => (v: T) => { setExample(false); f(v); };
  useEffect(() => { const q = readParams(location.search); const kk = str(q, 'k', kind); if (['uk-coin', 'chattel', 'foreign-coin'].includes(kk)) setK(kk as CgtKind); setProceeds(num(q, 's', 3000)); setCost(num(q, 'c', 1000)); setIncome(num(q, 'i', 30000)); if (q.has('s') || q.has('c')) setExample(false); }, []);
  useEffect(() => { updateURL({ k, s: proceeds, c: cost, i: income }); }, [k, proceeds, cost, income]);
  const r = cgt({ kind: k, proceeds, cost, costs, taxableIncome: income });
  const lim = `£${formatNumber(P.chattels.exemptLimit, 0)}`;
  const ruleText = { 'out-of-scope': 'British coins such as sovereigns and Britannias are never taxed when you sell them', 'chattel-exempt': `Sold for ${lim} or less: no tax to pay`, 'chattel-marginal': `Sold for a little over ${lim}: only part of the gain can be taxed`, full: 'The whole gain can be taxed, after the tax-free allowance', loss: 'No gain: nothing to pay' }[r.rule];
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <p className="text-sm font-medium text-navy-900">Sold each piece, or set, for {lim} or less? Then there is no tax to pay and you can stop here.</p>
        <SelectField id={`${idp}-k`} label="What you are selling" value={k} onChange={(v) => setK(v as CgtKind)} options={[{ value: 'chattel', label: 'Jewellery, bar or scrap' }, { value: 'uk-coin', label: 'Sovereigns or Britannias' }, { value: 'foreign-coin', label: 'Krugerrands, other foreign coins' }]} help="One item, or a set sold together" />
        {example && <p data-exemple className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">Example figures: type your own sale price and cost.</p>}
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-s`} label="Sale price" value={proceeds} onChange={typed(setProceeds)} unit="£" max={100000000} />
          <NumberField id={`${idp}-c`} label="What you paid for it" value={cost} onChange={typed(setCost)} unit="£" max={100000000} help="Inherited? Type what it was worth when the person died" /></div>
        <NumberField id={`${idp}-x`} label="Selling costs" value={costs} onChange={typed(setCosts)} unit="£" max={10000000} help="Fees paid to sell it, such as postage or a valuation; 0 if none" />
        {r.taxable > 0 && <NumberField id={`${idp}-i`} label="Your income this year, after the tax-free part" value={income} onChange={typed(setIncome)} unit="£" max={100000000} help="Asked only because there is tax to pay: your pay or pension minus the part you pay no income tax on. It decides the rate, 18% or 24%" />}
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}Capital Gains Tax, ${P.taxYear}`} value={gbp(r.tax)} sub={ruleText} />
        <Table caption="How the tax is worked out">
          <Row label="Profit on the sale" value={gbp(r.rawGain)} />
          {(r.rule === 'full' || r.rule === 'chattel-marginal') && <>
            {r.chattelCap !== null && <Row label={`Most that can be taxed (sale just over ${lim})`} value={gbp(r.chattelCap)} />}
            <Row label="Profit that can be taxed" value={gbp(r.gain)} />
            <Row label={`Minus the tax-free allowance (up to £${formatNumber(P.cgt.annualExemptAmount, 0)})`} value={`− ${gbp(r.allowanceUsed)}`} />
            <Row label="Left to tax" value={gbp(r.taxable)} />
            {r.atBasic > 0 && <Row label={`Taxed at ${pct(P.cgt.basicRate, 0)}`} value={gbp(r.atBasic)} />}
            {r.atHigher > 0 && <Row label={`Taxed at ${pct(P.cgt.higherRate, 0)}`} value={gbp(r.atHigher)} />}
          </>}
        </Table>
        <p className="mt-2 text-xs text-navy-600">Assumes no other gains this tax year. Not tax advice.</p>
      </>} />
  );
}

/* ---------- TVA ---------- */
function Vat({ mini, title, idp = 'vt', item = 'coin' }: ToolArgs) {
  const [it, setIt] = useState<VatItem>(item as VatItem);
  const [g, setG] = useState(7.98805);
  const [f, setF] = useState(916.66);
  const [price, setPrice] = useState(700);
  const [tender, setTender] = useState('yes');
  useEffect(() => { const q = readParams(location.search); const v = str(q, 'it', item); if (['bar', 'coin', 'jewellery', 'silver'].includes(v)) setIt(v as VatItem); setG(num(q, 'g', 7.98805)); setF(num(q, 'f', 916.66)); setPrice(num(q, 'p', 700)); }, []);
  useEffect(() => { updateURL({ it, g, f, p: price }); }, [it, g, f, price]);
  const m: Metal = it === 'silver' ? 'XAG' : 'XAU';
  const spot = useSpot([m]);
  const metal = metalValue(g, f, spot[m].gbpPerOz);
  const r = vatStatus({ item: it, fineness: f, price, metal, legalTender: tender === 'yes' });
  const why = { bar: 'Investment gold bar: at least 995 fine', coin: 'Investment gold coin: 900 fine or more, legal tender, sold at no more than 180% of its gold', premium: 'Sold above 180% of the gold it contains', fineness: it === 'bar' ? 'Below 995 fine: not investment gold' : 'Below 900 fine: not an investment coin', tender: 'Never legal tender in its country', minted: 'Minted before 1800', weight: 'Not a weight the bullion market accepts', notgold: it === 'silver' ? 'Silver is never investment gold' : 'Jewellery is not investment gold' }[r.reason];
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <SelectField id={`${idp}-it`} label="Item" value={it} onChange={(v) => setIt(v as VatItem)} options={[{ value: 'coin', label: 'Gold coin' }, { value: 'bar', label: 'Gold bar or wafer' }, { value: 'jewellery', label: 'Gold jewellery' }, { value: 'silver', label: 'Silver coin or bar' }]} />
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-g`} label="Weight" value={g} onChange={setG} unit="g" decimals={5} max={100000} />
          <NumberField id={`${idp}-f`} label="Fineness" value={f} onChange={setF} decimals={2} max={1000} help="Parts per thousand: 916.66 for a sovereign" /></div>
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-p`} label="Price" value={price} onChange={setPrice} unit="£" decimals={2} max={100000000} />
          <Toggle id={`${idp}-t`} label="Legal tender?" value={tender} onChange={setTender} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} /></div>
        <SpotLine spot={spot} metals={[m]} />
      </>}
      result={<>
        <Big label="VAT on this purchase" value={r.exempt ? 'Exempt' : `${gbp(r.vatInPrice)} at ${pct(P.vat.standardRate, 0)}`} sub={why} />
        <Table caption="VAT test">
          <Row label="Metal value" value={gbp(metal)} />
          <Row label="Price as a share of metal" value={pct(r.ratio)} strong={it === 'coin'} />
          <Row label="Coin limit" value={pct(P.vat.coinPremiumLimit, 0)} />
        </Table>
      </>} />
  );
}

/* ---------- Poinçons ---------- */
function Hallmark({ mini, title, idp = 'hm' }: ToolArgs) {
  const [mt, setMt] = useState('gold');
  const [f, setF] = useState(375);
  const [g, setG] = useState(5);
  useEffect(() => { const q = readParams(location.search); const v = str(q, 'm', 'gold'); if (['gold', 'silver', 'platinum', 'palladium'].includes(v)) setMt(v); setF(num(q, 'f', 375)); setG(num(q, 'g', 5)); }, []);
  useEffect(() => { updateURL({ m: mt, f, g }); }, [mt, f, g]);
  const list = mt === 'gold' ? P.goldStandards : mt === 'silver' ? P.silver : mt === 'platinum' ? P.platinum : P.palladium;
  const ff = list.includes(f) ? f : list[0];
  const sym: Metal = mt === 'gold' ? 'XAU' : mt === 'silver' ? 'XAG' : mt === 'platinum' ? 'XPT' : 'XPD';
  const spot = useSpot([sym]);
  const limit = P.hallmarkExemptGrams[mt as keyof typeof P.hallmarkExemptGrams];
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <div className="grid grid-cols-2 gap-x-4"><SelectField id={`${idp}-m`} label="Metal" value={mt} onChange={(v) => { setMt(v); setF((v === 'gold' ? P.goldStandards : v === 'silver' ? P.silver : v === 'platinum' ? P.platinum : P.palladium)[0]); }} options={[{ value: 'gold', label: 'Gold' }, { value: 'silver', label: 'Silver' }, { value: 'platinum', label: 'Platinum' }, { value: 'palladium', label: 'Palladium' }]} />
          <SelectField id={`${idp}-f`} label="Number stamped on it" value={String(ff)} onChange={(v) => setF(Number(v))} options={list.map((s) => ({ value: String(s), label: String(Math.floor(s)) }))} /></div>
        <NumberField id={`${idp}-g`} label="Weight of the piece" value={g} onChange={setG} unit="g" decimals={2} max={100000} help="Look inside a ring or on the clasp of a chain for the number" />
        <SpotLine spot={spot} metals={[sym]} />
      </>}
      result={<>
        <Big label={`A ${Math.floor(ff)} mark means ${fin(ff / 10)}% pure ${mt}`} value={gbp(metalValue(g, ff, spot[sym].gbpPerOz))} sub={`${mt === 'gold' ? `This is ${Math.round(caratOfFineness(ff))}ct gold. ` : ''}The value above is for ${formatNumber(g, 2)} g at today’s price.`} />
        <Table caption="What the mark tells you">
          <Row label="Pure metal in the piece" value={grams(g * ff / 1000, 3)} />
          <Row label="Value of 1 g of the piece" value={gbp2(gramPrice(ff, spot[sym].gbpPerOz))} />
          <Row label="Must a piece this heavy carry a hallmark?" value={g < limit ? `No: ${mt} under ${formatDecimal(limit, 2)} g need not` : `Yes: ${mt} of ${formatDecimal(limit, 2)} g or more must`} />
        </Table>
      </>} />
  );
}

/* ---------- Carat ↔ millièmes ---------- */
function KaratConv({ mini, title, idp = 'kc' }: ToolArgs) {
  const [k, setK] = useState(18);
  useEffect(() => { const q = readParams(location.search); setK(num(q, 'ct', 18)); }, []);
  useEffect(() => { updateURL({ ct: k }); }, [k]);
  const spot = useSpot(['XAU']);
  const prop = Math.round((k / 24) * 10000) / 10;
  const legal = P.gold.find((x) => x.ct === k && x.hallmark);
  const f = legal ? legal.fineness : prop;
  return (
    <Frame mini={mini} title={title}
      fields={<>
        <NumberField id={`${idp}-k`} label="Carat" value={k} onChange={setK} unit="ct" decimals={2} max={24} help="Any value from 1 to 24: 9, 14, 18, 22 or an unusual one such as 15 or 21" />
        <SpotLine spot={spot} metals={['XAU']} />
      </>}
      result={<>
        <Big label={`${formatDecimal(k, 2)} carat`} value={`${fin(f)} ‰`} sub={legal ? 'A standard set by UK hallmarking law' : 'Simple proportion of 24: not a UK hallmark standard'} />
        <Table caption="Carat conversion">
          <Row label="Gold share" value={pct(f / 1000)} />
          <Row label="k/24 proportion" value={`${fin(prop)} ‰`} />
          <Row label="Value of 1 g at today’s price" value={gbp2(gramPrice(f, spot.XAU.gbpPerOz))} />
        </Table>
      </>} />
  );
}

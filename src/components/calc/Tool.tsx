/**
 * Tous les calculateurs du site, choisis par `tool`. Chacun appelle le moteur (lib/engine/metal.ts) et
 * lit le cours par useSpot() : premier rendu = relevé du build (HTML servi), puis cours du moment
 * (RECETTE §17.5). L'état ne s'écrit dans l'adresse qu'après une action (url-state.ts, §18.1).
 */
import { useEffect, useRef, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { useSpot } from '../../lib/live';
import { P, SNAPSHOT, type Metal } from '../../lib/engine/params';
import { finenessOfCarat, metalValue, gramPrice, caratTable, toGrams, fromGrams, TOLA, OZ, offerShare, lotValue, coinFineGrams, coinMetalValue, coinById, premium, vatStatus, cgt, caratOfFineness, finePerGram, type Unit, type CgtKind, type VatItem } from '../../lib/engine/metal';
import { gbp, gbp2, pct, grams, clock } from '../../lib/money';
import { formatNumber, formatDecimal } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { SpotLine, Row, Frame, Big, Table, CaratSelect, METAL_NAME, useExample, ExampleNote } from './common';
import { exampleOffer } from '../../lib/exemple';

export interface ToolArgs { tool: string; mini?: boolean; title?: string; idp?: string; ct?: number; unit?: string; coin?: string; fineness?: number; metal?: string; kind?: string; item?: string; grams?: number; offer?: number; bar?: number; methodHref?: string }

const fin = (f: number) => formatNumber(f, f % 1 ? 1 : 0);
/** Chiffre de l'or tel qu'il est poinçonné : 916 pour le 22 ct (titre légal 916,6), pour qu'un même carat
 *  s'écrive partout de la même façon (test naïf, 2e tour du 2026-11-08 : 916 / 916.6 / 916.7 déroutaient). */
export const stampOf = (f: number) => (Math.abs(f - 916.6) < 0.1 ? '916' : fin(f));
/** Offre d'exemple : une part de la valeur métal au relevé du build, arrondie à 5 £. Jamais au-dessus de
 *  100 % (test naïf du 2026-11-08 : des offres par défaut à 109 % et 123,5 % faisaient croire qu'un
 *  acheteur paie plus que l'or). 70 % reprend l'exemple écrit sur l'accueil ; ce n'est pas un taux de marché. */
const OFFER_PATH = '/en/gold-offer-checker/';
const HALLMARK_PATH = '/en/uk-hallmarks-guide/';
const INHERITED_PATH = '/en/selling-inherited-gold/';
const SCRAP_PATH = '/en/scrap-gold-price/';
const COIN_PATH = '/en/sovereign-gold-value/';
/** Comparateur de devis : outil principal de la page « où vendre » (2026-11-10 : un seul comparateur sur le site). */
const COMPARE_PATH = '/en/where-to-sell-gold/';
// Test naïf, 4e tour : « 69.9 %, c'est bien ou pas ? ». 2026-11-09 (trois testeurs) : toujours sans repère.
// Aucune source officielle ne publie ce que paient les acheteurs (aucune loi, aucun organisme) : on le dit là
// où le lecteur le cherche, et on donne deux repères calculés, pas inventés : 100 % = tout l'or, et ce que vaut
// en livres chaque tranche de 10 points sur SON or (pointsWorth).
// 2026-11-10 (trois testeurs) : « je repars sans savoir quoi faire avec 69,6 % ». L'action d'abord, sans taux inventé.
const NO_FAIR_RATE = 'Is it a good offer? Nobody publishes a usual rate, so the only test is a second quote: ask one or two more buyers for the same pieces today. The highest share wins. 100% would be all the gold is worth.';
// « Every 10 percentage points… » était opaque, et £37.36 y valait aussi « 1 g de 9ct » : phrase de tous les jours.
const pointsWorth = (value: number) => (value > 0 ? `Each extra 10% the buyer pays is ${gbp(value / 10)} more for you.` : '');
/** Ce qu'un acheteur paierait à 60 % et à 90 % de la valeur : deux bornes calculées, pas un taux de marché. */
const payRange = (value: number) => `At 60% to 90% of this value, a buyer would pay ${gbp(value * 0.6)} to ${gbp(value * 0.9)}. Nobody publishes a usual rate: compare your own quotes with this.`;
/** Aide d'un champ d'offre : total, ou prix au gramme à multiplier (2026-11-10 : « £25 le gramme, je tape quoi ? »). */
const OFFER_HELP = 'The total for all the pieces. Quoted per gram? Multiply by the weight (£25 × 10 g = £250). No offer yet? Leave it empty.';
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
  const { example, typed } = useExample(['ct', 'g', 'o']);
  useEffect(() => { const u = readParams(location.search); setK(num(u, 'ct', ct)); setG(num(u, 'g', g0)); setOffer(num(u, 'o', 0)); }, []);
  useEffect(() => { updateURL({ ct: k, g, o: offer || undefined }); }, [k, g, offer]);
  const spot = useSpot(['XAU']);
  const oz = spot.XAU.gbpPerOz;
  const value = metalValue(g, finenessOfCarat(k), oz);
  const s = offerShare(offer, value);
  // 2026-11-10 (trois testeurs) : le montant n'était pas sur le premier écran du téléphone. Carat et poids,
  // puis tout de suite le résultat ; l'offre reçue et la ligne du cours passent dessous (`foot`).
  return (
    <Frame mini={mini} title={title}
      fields={<>
        {example && <ExampleNote>Example: {formatDecimal(g, 2)} g of {k}ct. Type your own weight.</ExampleNote>}
        <div className="grid grid-cols-2 gap-x-4"><CaratSelect id={`${idp}-ct`} value={k} onChange={typed(setK)} /><NumberField id={`${idp}-g`} label="Weight" value={g} onChange={typed(setG)} unit="g" decimals={2} max={100000} /></div>
        <div className="-mt-2"><p id={`${idp}-ct-help`} className="text-xs text-navy-600">Carat (ct): the number inside the ring or on the clasp. 375 is 9ct, 750 is 18ct. <a href={HALLMARK_PATH} className="underline hover:text-navy-900">No number?</a> Choose 9ct: the value will not be too high. Kitchen scales are fine.</p></div>
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}${formatDecimal(g, 2)} g of ${k}ct gold is worth`} value={gbp(value)} sub={<>The gold itself, at the live price of {clock(spot.XAU.live ? spot.XAU.at : SNAPSHOT.at.XAU)}. A buyer pays less, because it has to melt and refine it.</>} />
        <p className="mt-2 text-sm font-medium text-navy-900">{payRange(value)}</p>
        <Table caption="Gold price per gram by carat">
          {caratTable(oz).map((r) => <Row key={r.ct} label={`1 g of ${r.ct}ct (${stampOf(r.fineness)}${r.ct === 24 ? ', just under pure gold' : ''})`} value={gbp2(r.gram)} strong={r.ct === k} />)}
        </Table>
      </>}
      foot={mini ? undefined : <div className="mt-4 grid gap-3 border-t border-accent-200 pt-4 md:grid-cols-2">
        <div>
          <NumberField id={`${idp}-o`} label="Already have an offer? (optional)" value={offer} onChange={typed(setOffer)} unit="£" decimals={2} max={10000000} help={OFFER_HELP} />
          {offer > 0 && <div aria-live="polite" className="mt-2">
            <p className="text-base font-semibold text-navy-900">Your offer of {gbp(offer)} pays {pct(s.share)} of this gold value{s.gap > 0 ? <>; the buyer keeps {gbp(s.gap)}</> : null}.</p>
            <p className={`mt-1 text-sm ${s.share > 1 ? 'text-amber-800' : 'text-navy-700'}`}>{s.share > 1 ? OVER_100 : <>{NO_FAIR_RATE} {pointsWorth(value)}</>}</p>
            <p className="mt-1 text-sm"><a href={`${OFFER_PATH}?ct=${k}&g=${g}&o=${offer}`} className="font-medium text-accent-700 underline hover:text-navy-900">What to check before you say yes →</a></p>
          </div>}
        </div>
        <SpotLine spot={spot} metals={['XAU']} />
      </div>} />
  );
}

/* ---------- Page d'un carat : valeur d'un poids et tableau des poids courants ---------- */
function CaratTool({ mini, title, idp = 'c', ct = 9, grams: g0 = 10 }: ToolArgs) {
  const [g, setG] = useState(g0);
  const [offer, setOffer] = useState(0);
  const { example, typed } = useExample(['g', 'o']);
  useEffect(() => { const u = readParams(location.search); setG(num(u, 'g', g0)); setOffer(num(u, 'o', 0)); }, []);
  useEffect(() => { updateURL({ g, o: offer || undefined }); }, [g, offer]);
  const spot = useSpot(['XAU']);
  const oz = spot.XAU.gbpPerOz;
  const f = finenessOfCarat(ct);
  const value = metalValue(g, f, oz);
  const s = offerShare(offer, value);
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={['XAU']} />}
      fields={<>
        {example && <ExampleNote>Example: {formatDecimal(g, 2)} g. Type the weight of your own {ct}ct piece.</ExampleNote>}
        <NumberField id={`${idp}-g`} label={`Weight of your ${ct}ct gold`} value={g} onChange={typed(setG)} unit="g" decimals={2} max={100000} help="Kitchen scales are fine. Stones and springs weigh more than the gold inside, so the value is a ceiling" />
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}${formatDecimal(g, 2)} g of ${ct}ct gold is worth`} value={gbp(value)} sub={<>The gold itself, at the live price of {clock(spot.XAU.live ? spot.XAU.at : SNAPSHOT.at.XAU)}. A buyer pays less.</>} />
        <p className="mt-2 text-sm font-medium text-navy-900">{payRange(value)}</p>
        <Table caption={`${ct}ct gold value`}>
          <Row label="Pure gold inside" value={grams(g * f / 1000, 3)} />
          <Row label={`Value of 1 g of ${ct}ct`} value={gbp2(gramPrice(f, oz))} />
        </Table>
      </>}
      foot={mini ? undefined : <div className="mt-4 border-t border-accent-200 pt-4 md:max-w-[50%]">
        <NumberField id={`${idp}-o`} label="Already have an offer? (optional)" value={offer} onChange={typed(setOffer)} unit="£" decimals={2} max={10000000} help={OFFER_HELP} />
        {offer > 0 && <div aria-live="polite" className="mt-2">
          <p className="text-base font-semibold text-navy-900">{s.share > 1 ? <>Your offer of {gbp(offer)} is {gbp(-s.gap)} above the gold value.</> : <>Your offer of {gbp(offer)} pays {pct(s.share)} of the gold value; the buyer keeps {gbp(s.gap)}.</>}</p>
          <p className={`mt-1 text-sm ${s.share > 1 ? 'text-amber-800' : 'text-navy-700'}`}>{s.share > 1 ? OVER_100 : <>{NO_FAIR_RATE} {pointsWorth(value)}</>}</p>
          <BeforeYes />
        </div>}
      </div>} />
  );
}

/* ---------- Vérificateur d'offre ---------- */
function Offer({ mini, title, idp = 'o', ct = 9, grams: g0 = 10, offer: given }: ToolArgs) {
  const o0 = given ?? exampleOffer(g0, ct, 0.7);
  const [k, setK] = useState(ct);
  const [g, setG] = useState(g0);
  const [offer, setOffer] = useState(o0);
  // Tant que l'offre n'a pas été tapée (ni reçue par un lien), c'est un exemple et l'écran le dit
  // (test naïf, 2e tour : « This offer pays 69.9% » sans rien saisir était pris pour un vrai résultat).
  const [example, setExample] = useState(given === undefined);
  useEffect(() => { const u = readParams(location.search); const kk = num(u, 'ct', ct), gg = num(u, 'g', g0); setK(kk); setG(gg); setOffer(num(u, 'o', gg === g0 && kk === ct ? o0 : exampleOffer(gg, kk, 0.7))); if (u.has('o')) setExample(false); }, []);
  useEffect(() => { updateURL({ ct: k, g, o: offer }); }, [k, g, offer]);
  // Le comparateur de la même page reprend carat, poids et offre (test naïf du 2026-11-09 : « pourquoi retaper ? »).
  useEffect(() => { if (!mini) window.dispatchEvent(new CustomEvent<OffreTapee>('gbc:offre', { detail: { ct: k, g, offer, example } })); }, [k, g, offer, example]);
  const typeOffer = (v: number) => { setOffer(v); setExample(false); };
  const spot = useSpot(['XAU']);
  const value = metalValue(g, finenessOfCarat(k), spot.XAU.gbpPerOz);
  const s = offerShare(offer, value);
  const scale = Math.max(value, offer);
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={['XAU']} />}
      fields={<>
        <div className="grid grid-cols-2 gap-x-4"><CaratSelect id={`${idp}-ct`} value={k} onChange={setK} /><NumberField id={`${idp}-g`} label="Weight" value={g} onChange={setG} unit="g" decimals={2} max={100000} /></div>
        {example && <p data-exemple className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">Example: {formatDecimal(g, 2)} g of {k}ct and a made-up offer of {gbp(offer)}. Type your own weight and the offer you were given.</p>}
        <NumberField id={`${idp}-o`} label="Offer you were given (total)" value={offer} onChange={typeOffer} unit="£" decimals={2} max={10000000} help="The total for all the pieces. Quoted per gram? Multiply by the weight (£25 × 10 g = £250)." />
      </>}
      result={<>
        <Big label={example ? 'Example: this offer pays' : 'This offer pays'} value={pct(s.share)} sub={<>of the {gbp(value)} the gold is worth in {example ? 'this example of' : 'your'} {formatDecimal(g, 2)} g of {k}ct, at the live price of {clock(spot.XAU.live ? spot.XAU.at : SNAPSHOT.at.XAU)}</>} />
        <p className={`mt-2 text-sm font-medium ${s.share > 1 ? 'text-amber-800' : 'text-navy-900'}`}>{s.share > 1 ? OVER_100 : <>{NO_FAIR_RATE} {pointsWorth(value)}</>}</p>
        <p className="mt-1 text-sm"><a href={`${COMPARE_PATH}?ct=${k}&g=${g}${example ? '' : `&x=${offer}`}`} className="font-medium text-accent-700 underline hover:text-navy-900">Got two or three quotes? Compare them side by side →</a></p>
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

interface OffreTapee { ct: number; g: number; offer: number; example: boolean }

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
  // 2026-11-10 : l'exemple reprend les 10 g de 9ct de tout le site, plus une bague de 4 g en 18ct (5 g de 18ct
  // valaient au gramme près les 10 g de 9ct, et le même £373.58 passait pour un copier-coller). 21ct et 24ct ajoutés.
  const CTS = [9, 14, 18, 21, 22, 24];
  const KEYS = ['a', 'b', 'c', 'e', 'd', 'f'];
  const DEF: Record<number, number> = { 9: 10, 14: 0, 18: 4, 21: 0, 22: 0, 24: 0 };
  const [q, setQ] = useState<Record<number, number>>(DEF);
  // Test naïf, 4e tour (trois testeurs) : la case « Share of the gold value a buyer pays you » (70 %) et la case
  // « One offer for the whole lot » se suivaient ; on ne savait laquelle remplir, et 70 % passait pour un taux
  // normal. La case de pourcentage est retirée : le tableau 60 à 90 % reste, et l'offre reçue se tape une fois.
  // Test naïf, 3e tour : pour un lot mêlé, la page renvoyait au vérificateur, qui ne prend qu'un carat.
  // L'offre reçue pour tout le lot se tape ici ; les poids d'exemple sont signalés tant qu'on n'a rien tapé.
  const [offer, setOffer] = useState(0);
  const [example, setExample] = useState(true);
  useEffect(() => { const u = readParams(location.search); setQ(Object.fromEntries(CTS.map((ct, i) => [ct, num(u, KEYS[i], DEF[ct])]))); setOffer(num(u, 'o', 0)); if (KEYS.some((x) => u.has(x))) setExample(false); }, []);
  useEffect(() => { updateURL({ ...Object.fromEntries(CTS.map((ct, i) => [KEYS[i], q[ct] || undefined])), o: offer || undefined }); }, [q, offer]);
  const spot = useSpot(['XAU']);
  const lot = lotValue(CTS.map((ct) => ({ grams: q[ct], fineness: finenessOfCarat(ct) })), spot.XAU.gbpPerOz);
  const set = (ct: number) => (v: number) => { setExample(false); setQ((o) => ({ ...o, [ct]: v })); };
  const s = offerShare(offer, lot.value);
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={['XAU']} />}
      fields={<>
        {example && <p data-exemple className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">Example: a 10 g chain in 9ct and a 4 g ring in 18ct hold {gbp(lot.value)} of gold (details below the boxes). Type the weights of your own pieces.</p>}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">{CTS.map((ct) => <NumberField key={ct} id={`${idp}-${ct}`} label={`Grams of ${ct}ct`} value={q[ct]} onChange={set(ct)} unit="g" decimals={2} max={100000} />)}</div>
        <div className="-mt-2"><p id={`${idp}-ct-help`} className="text-xs text-navy-600">Leave empty the carats you do not have. No number on a piece? Put it under 9ct: the value will not be too high.</p></div>
      </>}
      result={<>
        <Big label={example ? 'Example: value of the gold in the whole lot' : 'Value of the gold in the whole lot'} value={gbp(lot.value)} sub={<>{grams(lot.fineGrams)} of pure gold in {formatNumber(CTS.reduce((t, ct) => t + q[ct], 0), 2)} g of pieces, at the live price of {clock(spot.XAU.live ? spot.XAU.at : SNAPSHOT.at.XAU)}.</>} />
        <p className="mt-3 text-sm text-navy-700">What a buyer would pay at different shares of that value. Nobody publishes a usual rate: compare your own quotes with these lines. Amounts over £1,000 are rounded to the pound.</p>
        <Table caption="Payout at different shares of the metal">
          {[60, 70, 80, 90].map((p) => <Row key={p} label={`Paid at ${p}% of the gold value`} value={gbp(lot.value * p / 100)} />)}
        </Table>
      </>}
      foot={mini ? undefined : <div className="mt-4 border-t border-accent-200 pt-4 md:max-w-[50%]">
        <NumberField id={`${idp}-o`} label="Already have an offer for the whole lot? (optional)" value={offer} onChange={(v) => { setExample(false); setOffer(v); }} unit="£" decimals={2} max={10000000} help={OFFER_HELP} />
        {offer > 0 && <div aria-live="polite" className="mt-2">
          <p className="text-base font-semibold text-navy-900">The offer of {gbp(offer)} pays {pct(s.share)} of the gold in the lot{s.gap > 0 ? <>; the buyer keeps {gbp(s.gap)}</> : null}.</p>
          <p className={`mt-1 text-sm ${s.share > 1 ? 'text-amber-800' : 'text-navy-700'}`}>{s.share > 1 ? OVER_100 : <>{NO_FAIR_RATE} {pointsWorth(lot.value)}</>}</p>
        </div>}
      </div>} />
  );
}

/* ---------- Comparer trois offres ---------- */
function Compare({ mini, title, idp = 'cp', ct = 9, grams: g0 = 10 }: ToolArgs) {
  const [k, setK] = useState(ct);
  const [g, setG] = useState(g0);
  // Deux offres d'exemple sous la valeur du métal (65 % et 75 %), jamais au-dessus (test naïf du 2026-11-08).
  const ex = (gg: number, kk: number): [number, number, number] => [exampleOffer(gg, kk, 0.65), exampleOffer(gg, kk, 0.75), 0];
  const [o, setO] = useState<[number, number, number]>(ex(g0, ct));
  const [example, setExample] = useState(true);
  const [fromChecker, setFromChecker] = useState(false);
  const exRef = useRef(true);
  useEffect(() => { exRef.current = example; }, [example]);
  useEffect(() => { const u = readParams(location.search); const kk = num(u, 'ct', ct), gg = num(u, 'g', g0); const d = ex(gg, kk); setK(kk); setG(gg); setO([num(u, 'x', d[0]), num(u, 'y', d[1]), num(u, 'z', 0)]); if (u.has('x') || u.has('y')) setExample(false); }, []);
  // Carat, poids et offre tapés dans le vérificateur au-dessus : repris ici, l'offre devient « Offer A ».
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<OffreTapee>).detail;
      setK(d.ct); setG(d.g);
      if (!d.example && d.offer > 0) { setO((x) => [d.offer, x[1], x[2]]); setFromChecker(true); setExample(false); }
      else if (exRef.current) setO(ex(d.g, d.ct));
    };
    window.addEventListener('gbc:offre', on);
    return () => window.removeEventListener('gbc:offre', on);
  }, []);
  useEffect(() => { updateURL({ ct: k, g, x: o[0], y: o[1], z: o[2] }); }, [k, g, o]);
  const spot = useSpot(['XAU']);
  const value = metalValue(g, finenessOfCarat(k), spot.XAU.gbpPerOz);
  const scale = Math.max(value, ...o);
  const names = ['Offer A', 'Offer B', 'Offer C'];
  const best = o.reduce((bi, v, i) => (v > o[bi] ? i : bi), 0);
  const setI = (i: number) => (v: number) => { setExample(false); setO((x) => { const y = [...x] as [number, number, number]; y[i] = v; return y; }); };
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={['XAU']} />}
      fields={<>
        <div className="grid grid-cols-2 gap-x-4"><CaratSelect id={`${idp}-ct`} value={k} onChange={setK} /><NumberField id={`${idp}-g`} label="Weight" value={g} onChange={setG} unit="g" decimals={2} max={100000} /></div>
        {example && <p data-exemple className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">Example: {formatDecimal(g, 2)} g of {k}ct and two made-up quotes. Type the quotes you were given.</p>}
        {fromChecker && <p className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">Carat, weight and Offer A come from the checker above. Add your other quotes.</p>}
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-x`} label="Offer A (first buyer)" value={o[0]} onChange={setI(0)} unit="£" decimals={2} max={10000000} /><NumberField id={`${idp}-y`} label="Offer B (second buyer)" value={o[1]} onChange={setI(1)} unit="£" decimals={2} max={10000000} /></div>
        <NumberField id={`${idp}-z`} label="Offer C (optional)" value={o[2]} onChange={setI(2)} unit="£" decimals={2} max={10000000} help="Leave at 0 if you only have two quotes" />
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}${names[best]} pays the most`} value={pct(value > 0 ? o[best] / value : 0)} sub={<>of the {gbp(value)} the gold in {formatDecimal(g, 2)} g of {k}ct is worth</>} />
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
  const { example, typed } = useExample(['n', 'u', 'ct']);
  useEffect(() => { const q = readParams(location.search); setN(num(q, 'n', 1)); const uu = str(q, 'u', unit); if (['g', 'oz', 'kg', 'tola'].includes(uu)) setU(uu as Unit); setK(num(q, 'ct', ct)); }, []);
  useEffect(() => { updateURL({ n, u, ct: k }); }, [n, u, k]);
  const spot = useSpot(['XAU']);
  const g = toGrams(n, u, tola);
  const value = metalValue(g, finenessOfCarat(k), spot.XAU.gbpPerOz);
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={['XAU']} />}
      fields={<>
        {example && <ExampleNote>Example: {formatDecimal(n, 4)} {u === 'oz' ? 'troy ounce' : u} of {k}ct. Type your own quantity.</ExampleNote>}
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-n`} label="Quantity" value={n} onChange={typed(setN)} decimals={4} max={1000000} />
          <SelectField id={`${idp}-u`} label="Unit" value={u} onChange={(v) => typed(setU)(v as Unit)} options={[{ value: 'oz', label: 'Troy ounce' }, { value: 'g', label: 'Gram' }, { value: 'tola', label: 'Tola' }, { value: 'kg', label: 'Kilogram' }]} /></div>
        <CaratSelect id={`${idp}-ct`} value={k} onChange={typed(setK)} />
        {u === 'tola' && <NumberField id={`${idp}-t`} label="Weight of one tola" value={tola} onChange={setTola} unit="g" decimals={4} max={100} help="11.6638 g is the usual Indian tola; change it if your seller uses another" />}
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}${formatDecimal(n, 4)} ${u === 'oz' ? 'troy oz' : u} of ${k}ct gold`} value={gbp(value)} sub={`${grams(g, 3)} with ${stampOf(finenessOfCarat(k))} parts of gold in 1,000${k === 24 ? ': 24ct is counted at 999, so it is a little under the price of a perfectly pure ounce' : ''}`} />
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
  const { example, typed } = useExample(['w', 'p']);
  useEffect(() => { const q = readParams(location.search); setSize(num(q, 'w', bar)); setPrice(num(q, 'p', 0)); }, []);
  useEffect(() => { updateURL({ w: size, p: price || undefined }); }, [size, price]);
  const spot = useSpot(['XAU']);
  const value = metalValue(size, 999.9, spot.XAU.gbpPerOz);
  const prem = premium(price, value);
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={['XAU']} />}
      fields={<>
        {example && <ExampleNote>Example: a {size >= 1000 ? '1 kg' : `${formatDecimal(size, 1)} g`} bar. Choose the size of your own bar.</ExampleNote>}
        <SelectField id={`${idp}-w`} label="Bar size" value={String(size)} onChange={(v) => typed(setSize)(Number(v))} options={P.barSizesGrams.map((w) => ({ value: String(w), label: Math.abs(w - OZ) < 0.001 ? '1 troy ounce (31.10 g)' : w >= 1000 ? '1 kilo' : `${formatDecimal(w, 1)} g` }))} help="Bar weights the UK tax office (HMRC) accepts as investment gold, all 999.9 parts in 1,000" />
        <NumberField id={`${idp}-p`} label="Price a dealer asks (optional)" value={price} onChange={typed(setPrice)} unit="£" decimals={2} max={10000000} help="Type a quoted price to see how much it asks above the value of the gold inside" />
      </>}
      result={<>
        <Big label={`${example ? 'Example: gold' : 'Gold'} in a ${Math.abs(size - OZ) < 0.001 ? '1 oz' : size >= 1000 ? '1 kg' : `${formatDecimal(size, 1)} g`} bar at 999.9`} value={gbp(value)} sub="No VAT on a bar of at least 995 fine in a weight the market accepts" />
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
  const { example, typed } = useExample(['c', 'n', 'p']);
  useEffect(() => { const q = readParams(location.search); const c = str(q, 'c', coin); if (P.coins.some((x) => x.id === c)) setId(c); setN(num(q, 'n', 1)); setPrice(num(q, 'p', 0)); }, []);
  useEffect(() => { updateURL({ c: id, n, p: price || undefined }); }, [id, n, price]);
  const c = coinById(id);
  const metals: Metal[] = c.metal === 'XAG' ? ['XAG'] : ['XAU'];
  const spot = useSpot(metals);
  const one = coinMetalValue(c, spot[c.metal].gbpPerOz);
  const total = one * n;
  const ratio = one > 0 && price > 0 ? price / (one * n) : 0;
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={metals} />}
      fields={<>
        {example && <ExampleNote>Example: {n} × {coinById(id).name}. Choose your coin and how many you have.</ExampleNote>}
        <SelectField id={`${idp}-c`} label="Coin" value={id} onChange={typed(setId)} options={P.coins.map((x) => ({ value: x.id, label: x.name }))} />
        <NumberField id={`${idp}-n`} label="How many" value={n} onChange={typed(setN)} max={10000} />
      </>}
      result={<>
        <Big label={`${example ? 'Example: v' : 'V'}alue of the ${c.metal === 'XAG' ? 'silver' : 'gold'} in ${n} × ${c.name}`} value={gbp(total)} sub={<>{grams(coinFineGrams(c), 3)} of pure {c.metal === 'XAG' ? 'silver' : 'gold'} per coin{n > 1 ? <>, {gbp2(one)} each</> : null}, at the live price of {clock(spot[c.metal].live ? spot[c.metal].at : SNAPSHOT.at[c.metal])}. A buyer pays less.</>} />
        <Table caption="Coin value">
          {c.grossG !== undefined && <Row label="Weight of one coin (set by law)" value={grams(c.grossG, 2)} />}
          <Row label={`How much of the coin is ${c.metal === 'XAG' ? 'silver' : 'gold'}`} value={Math.abs(c.fineness - 2750 / 3) < 0.01 ? '916 parts in 1,000, the same as 22ct' : `${fin(c.fineness)} parts in 1,000`} />
          <Row label="Tax when you sell" value={c.legalTenderUK ? 'British coin: no Capital Gains Tax' : `Foreign coin: tax-free up to £${formatNumber(P.chattels.exemptLimit, 0)}`} />
        </Table>
      </>}
      foot={mini ? undefined : <div className="mt-4 border-t border-accent-200 pt-4 md:max-w-[50%]">
        <NumberField id={`${idp}-p`} label="Price for them all (optional)" value={price} onChange={typed(setPrice)} unit="£" decimals={2} max={10000000} help="What a buyer offers you, or a dealer asks, for all these coins together. No price yet? Leave it empty." />
        {price > 0 && <div aria-live="polite" className="mt-2">
          <p className="text-base font-semibold text-navy-900">This price is {pct(ratio)} of the {c.metal === 'XAG' ? 'silver' : 'gold'} in {n} × {c.name} ({gbp(total)}).</p>
          {c.metal === 'XAU' && <p className="mt-1 text-sm text-navy-700">VAT (sales tax) if you buy at this price: {ratio <= P.vat.coinPremiumLimit ? 'none, it counts as investment gold' : 'due, because the price is above 180% of the gold'}.</p>}
        </div>}
      </div>} />
  );
}

/* ---------- Argent ---------- */
function Silver({ mini, title, idp = 'ag', fineness = 925, unit = 'g', grams: g0 = 100 }: ToolArgs) {
  const [f, setF] = useState(fineness);
  const [n, setN] = useState(g0);
  const [u, setU] = useState<Unit>(unit as Unit);
  const { example, typed } = useExample(['f', 'n', 'u']);
  useEffect(() => { const q = readParams(location.search); setF(num(q, 'f', fineness)); setN(num(q, 'n', g0)); const uu = str(q, 'u', unit); if (['g', 'oz', 'kg'].includes(uu)) setU(uu as Unit); }, []);
  useEffect(() => { updateURL({ f, n, u }); }, [f, n, u]);
  const spot = useSpot(['XAG']);
  const oz = spot.XAG.gbpPerOz;
  const g = toGrams(n, u);
  const value = metalValue(g, f, oz);
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={['XAG']} />}
      fields={<>
        {example && <ExampleNote>Example: {formatDecimal(n, 3)} {u === 'oz' ? 'troy oz' : u} of {fin(f)} silver. Type the weight of your own silver.</ExampleNote>}
        <SelectField id={`${idp}-f`} label="Silver standard (hallmark)" value={String(f)} onChange={(v) => typed(setF)(Number(v))} options={P.silver.map((s) => ({ value: String(s), label: s === 925 ? '925 sterling' : s === 958.4 ? '958 Britannia' : s === 999 ? '999 fine' : `${s}` }))} />
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-n`} label="Weight" value={n} onChange={typed(setN)} decimals={3} max={1000000} />
          <SelectField id={`${idp}-u`} label="Unit" value={u} onChange={(v) => typed(setU)(v as Unit)} options={[{ value: 'g', label: 'Grams' }, { value: 'oz', label: 'Troy ounces' }, { value: 'kg', label: 'Kilograms' }]} /></div>
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}${formatDecimal(n, 3)} ${u === 'oz' ? 'troy oz' : u} of ${fin(f)} silver`} value={gbp(value)} sub="Value of the silver itself at today’s price, before a buyer takes its cut" />
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
  const { example, typed } = useExample(['f', 'g']);
  useEffect(() => { const q = readParams(location.search); setF(num(q, 'f', fineness)); setG(num(q, 'g', g0)); }, []);
  useEffect(() => { updateURL({ f, g }); }, [f, g]);
  const spot = useSpot([m]);
  const oz = spot[m].gbpPerOz;
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={[m]} />}
      fields={<>
        {example && <ExampleNote>Example: {formatDecimal(g, 2)} g. Type the weight of your own piece.</ExampleNote>}
        <div className="grid grid-cols-2 gap-x-4"><SelectField id={`${idp}-f`} label="Hallmark standard" value={String(f)} onChange={(v) => typed(setF)(Number(v))} options={list.map((s) => ({ value: String(s), label: String(s) }))} />
          <NumberField id={`${idp}-g`} label="Weight" value={g} onChange={typed(setG)} unit="g" decimals={2} max={100000} /></div>
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}${formatDecimal(g, 2)} g of ${METAL_NAME[m].toLowerCase()} ${f}`} value={gbp(metalValue(g, f, oz))} sub="Value of the metal itself at today’s price" />
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
        {example && <p data-exemple className="rounded bg-accent-50 px-2 py-1 text-sm font-medium text-navy-900">Example: jewellery bought for £1,000 and sold for £3,000. Type your own sale price and cost.</p>}
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-s`} label="Sale price" value={proceeds} onChange={typed(setProceeds)} unit="£" max={100000000} />
          <NumberField id={`${idp}-c`} label="What you paid for it" value={cost} onChange={typed(setCost)} unit="£" max={100000000} help="Inherited? Type what it was worth when the person died: the value given for probate (the official valuation of what the person left), if there was one" /></div>
        <NumberField id={`${idp}-x`} label="Selling costs" value={costs} onChange={typed(setCosts)} unit="£" max={10000000} help="Fees paid to sell it, such as postage or a valuation; 0 if none" />
        {r.taxable > 0 && <NumberField id={`${idp}-i`} label="Your income this tax year (6 April to 5 April), after the tax-free part" value={income} onChange={typed(setIncome)} unit="£" max={100000000} help="Asked only because there is tax to pay: your pay or pension minus the part you pay no income tax on. It decides the rate, 18% or 24%" />}
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
  const { example, typed } = useExample(['it', 'g', 'f', 'p']);
  useEffect(() => { const q = readParams(location.search); const v = str(q, 'it', item); if (['bar', 'coin', 'jewellery', 'silver'].includes(v)) setIt(v as VatItem); setG(num(q, 'g', 7.98805)); setF(num(q, 'f', 916.66)); setPrice(num(q, 'p', 700)); }, []);
  useEffect(() => { updateURL({ it, g, f, p: price }); }, [it, g, f, price]);
  const m: Metal = it === 'silver' ? 'XAG' : 'XAU';
  const spot = useSpot([m]);
  const metal = metalValue(g, f, spot[m].gbpPerOz);
  const r = vatStatus({ item: it, fineness: f, price, metal, legalTender: tender === 'yes' });
  const why = { bar: 'Investment gold bar: at least 995 fine', coin: 'Investment gold coin: 900 fine or more, legal tender, sold at no more than 180% of its gold', premium: 'Sold above 180% of the gold it contains', fineness: it === 'bar' ? 'Below 995 fine: not investment gold' : 'Below 900 fine: not an investment coin', tender: 'Never legal tender in its country', minted: 'Minted before 1800', weight: 'Not a weight the bullion market accepts', notgold: it === 'silver' ? 'Silver is never investment gold' : 'Jewellery is not investment gold' }[r.reason];
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={[m]} />}
      fields={<>
        {example && <ExampleNote>Example: a sovereign bought for £700. Type the figures of your own purchase.</ExampleNote>}
        <SelectField id={`${idp}-it`} label="Item" value={it} onChange={(v) => typed(setIt)(v as VatItem)} options={[{ value: 'coin', label: 'Gold coin' }, { value: 'bar', label: 'Gold bar or wafer' }, { value: 'jewellery', label: 'Gold jewellery' }, { value: 'silver', label: 'Silver coin or bar' }]} />
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-g`} label="Weight" value={g} onChange={typed(setG)} unit="g" decimals={5} max={100000} />
          <NumberField id={`${idp}-f`} label="Gold in 1,000 parts" value={f} onChange={typed(setF)} decimals={2} max={1000} help="The number stamped or published: 916.66 for a sovereign" /></div>
        <div className="grid grid-cols-2 gap-x-4"><NumberField id={`${idp}-p`} label="Price" value={price} onChange={typed(setPrice)} unit="£" decimals={2} max={100000000} />
          <Toggle id={`${idp}-t`} label="Legal tender?" value={tender} onChange={typed(setTender)} options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} /></div>
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}VAT on this purchase`} value={r.exempt ? 'Exempt' : `${gbp(r.vatInPrice)} at ${pct(P.vat.standardRate, 0)}`} sub={why} />
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
  const [g, setG] = useState(10);
  const { example, typed } = useExample(['m', 'f', 'g']);
  useEffect(() => { const q = readParams(location.search); const v = str(q, 'm', 'gold'); if (['gold', 'silver', 'platinum', 'palladium'].includes(v)) setMt(v); setF(num(q, 'f', 375)); setG(num(q, 'g', 10)); }, []);
  useEffect(() => { updateURL({ m: mt, f, g }); }, [mt, f, g]);
  const list = mt === 'gold' ? P.goldStandards : mt === 'silver' ? P.silver : mt === 'platinum' ? P.platinum : P.palladium;
  const ff = list.includes(f) ? f : list[0];
  const sym: Metal = mt === 'gold' ? 'XAU' : mt === 'silver' ? 'XAG' : mt === 'platinum' ? 'XPT' : 'XPD';
  const spot = useSpot([sym]);
  const limit = P.hallmarkExemptGrams[mt as keyof typeof P.hallmarkExemptGrams];
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={[sym]} />}
      fields={<>
        {example && <ExampleNote>Example: a {formatDecimal(g, 2)} g piece stamped {Math.floor(ff)}. Choose the number on your own piece.</ExampleNote>}
        <div className="grid grid-cols-2 gap-x-4"><SelectField id={`${idp}-m`} label="Metal" value={mt} onChange={(v) => { typed(setMt)(v); setF((v === 'gold' ? P.goldStandards : v === 'silver' ? P.silver : v === 'platinum' ? P.platinum : P.palladium)[0]); }} options={[{ value: 'gold', label: 'Gold' }, { value: 'silver', label: 'Silver' }, { value: 'platinum', label: 'Platinum' }, { value: 'palladium', label: 'Palladium' }]} />
          <SelectField id={`${idp}-f`} label="Number stamped on it" value={String(ff)} onChange={(v) => typed(setF)(Number(v))} options={list.map((s) => ({ value: String(s), label: String(Math.floor(s)) }))} /></div>
        <NumberField id={`${idp}-g`} label="Weight of the piece" value={g} onChange={typed(setG)} unit="g" decimals={2} max={100000} help="Stamped 9ct or 18K instead of a number? Choose 375 for 9ct, 750 for 18ct. No mark at all? Choose 375: the value will not be too high" />
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}${formatDecimal(g, 2)} g stamped ${Math.floor(ff)}${mt === 'gold' ? ` (${Math.round(caratOfFineness(ff))}ct)` : ''} is worth`} value={gbp(metalValue(g, ff, spot[sym].gbpPerOz))} sub={<>{Math.floor(ff)} means {fin(ff / 10)}% pure {mt}. Value of the {mt} itself at the live price of {clock(spot[sym].live ? spot[sym].at : SNAPSHOT.at[sym])}.</>} />
        <Table caption="What the mark tells you">
          <Row label="Pure metal in the piece" value={grams(g * ff / 1000, 3)} />
          <Row label="Value of 1 g of the piece" value={gbp2(gramPrice(ff, spot[sym].gbpPerOz))} />
          <Row label="Must a shop selling it stamp it?" value={g < limit ? `No: ${mt} under ${formatDecimal(limit, 2)} g need not` : `Yes, from ${formatDecimal(limit, 2)} g`} />
        </Table>
        {g >= limit && <p className="mt-2 text-sm text-navy-700">Old, foreign or handmade pieces often have no British hallmark: that does not make them fake, and you may still sell them. A buyer will test the metal.</p>}
      </>} />
  );
}

/* ---------- Carat ↔ millièmes ---------- */
function KaratConv({ mini, title, idp = 'kc' }: ToolArgs) {
  const [k, setK] = useState(18);
  const { example, typed } = useExample(['ct']);
  useEffect(() => { const q = readParams(location.search); setK(num(q, 'ct', 18)); }, []);
  useEffect(() => { updateURL({ ct: k }); }, [k]);
  const spot = useSpot(['XAU']);
  const prop = Math.round((k / 24) * 10000) / 10;
  const legal = P.gold.find((x) => x.ct === k && x.hallmark);
  const f = legal ? legal.fineness : prop;
  return (
    <Frame mini={mini} title={title} spotLine={<SpotLine spot={spot} metals={['XAU']} />}
      fields={<>
        {example && <ExampleNote>Example: 18 carat. Type your own carat.</ExampleNote>}
        <NumberField id={`${idp}-k`} label="Carat" value={k} onChange={typed(setK)} unit="ct" decimals={2} max={24} help="Any value from 1 to 24: 9, 14, 18, 22 or an unusual one such as 15 or 21" />
      </>}
      result={<>
        <Big label={`${example ? 'Example: ' : ''}${formatDecimal(k, 2)} carat`} value={`${fin(f)} ‰`} sub={legal ? 'A standard set by UK hallmarking law' : 'Simple proportion of 24: not a UK hallmark standard'} />
        <Table caption="Carat conversion">
          <Row label="Gold share" value={pct(f / 1000)} />
          <Row label="k/24 proportion" value={`${fin(prop)} ‰`} />
          <Row label="Value of 1 g at today’s price" value={gbp2(gramPrice(f, spot.XAU.gbpPerOz))} />
        </Table>
      </>} />
  );
}

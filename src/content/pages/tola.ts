import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'tola', group: 'gold', order: 17, tool: 'units', toolProps: { unit: 'tola', ct: 22 }, kind: 'outil',
  related: ['carat-22', 'carat-21', 'ounce', 'scrap'], sources: ['ukWeights'],
  slug: 'gold-price-per-tola', nav: 'Gold price per tola (South Asian weight)', card: 'Tola to grams and pounds, with the tola weight left editable',
  title: 'Gold Price per Tola in Pounds: Tola to Grams for 22ct',
  description: 'Gold price per tola in pounds at the live spot price for 22ct, 21ct or 24ct, with the tola weight shown and editable, and conversions to grams and troy ounces.',
  h1: 'Gold price per tola in pounds',
  resume: 'A tola is a traditional South Asian unit for gold, and in the trade it is taken as 180 grains, which is {tola} grams. It has no definition in British law, unlike the troy ounce and the grain, so this calculator treats it as a convention: it starts at {tola} g and lets you change the weight if your jeweller uses a different figure, such as a rounded 11.66 g. Choose 22ct, 21ct or 24ct, type the number of tolas, and the calculator converts to grams and gives the metal value in pounds at the spot price read from gold-api.com, with the time of that price shown. It is meant for families in Britain who think in tolas because that is how wedding gold was weighed and bought. Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'How many grams are in one tola?', a: 'The traditional tola is 180 grains, and a grain is {grain} g in UK law, so a tola is {tola} g. Some jewellers round it to 11.66 g or 11.7 g. On a heavy set the rounding adds up, so ask which figure your quote uses and set it in the calculator before comparing.' },
    { q: 'Is a tola price the same as a 22ct price?', a: 'Not unless it says so. A tola rate quoted in a shop window may be for 24ct, for 22ct, or a buying rate rather than a selling rate. Convert it to a price per gram of the stated carat, then compare it with the gram price here; the calculator shows both.' },
    { q: 'How many tolas are in a troy ounce?', a: 'About 2.67. A troy ounce is 480 grains and a tola 180 grains, so one ounce is 480 ÷ 180 tolas. In grams, a tola of {tola} g against an ounce of {oz2} g gives the same ratio. A tola price is therefore roughly three eighths of an ounce price for the same purity.' },
  ],
  body: (h) => {
    const t = 180 * 0.06479891;
    const rows = [1, 2, 5, 10, 20].map((n) => [`${n} tola`, h.num(n * t, 2) + ' g', h.live(h.at(n * t, 916.6), 'XAU'), h.live(h.at(n * t, 875), 'XAU'), h.live(h.at(n * t, 999), 'XAU')]);
    return `
<h2>Tolas in pounds</h2>
${h.table(['Tolas', 'Grams', '22ct', '21ct', '24ct'], rows, `Tola of 180 grains; worked out at the same gold price as the calculator above (${h.when}).`)}

<h2>Where the tola weight comes from</h2>
<p>The grain is a legal unit in the UK: ${h.src('ukWeights', 'UK weights law')} defines it as 1/7,000 of a pound, {grain} g. The tola of 180 grains is a South Asian trade convention built on it, and it is the figure most bullion and jewellery dealers use. We found no British text that defines the tola, so we do not present it as official. If a jeweller works with a different tola, change the weight in the calculator and every figure follows.</p>

<h2>Using tolas when you sell</h2>
<p>British buyers weigh in grams and quote per gram. When you know your set as “five tolas of 22ct”, convert it first: five tolas is about 58.3 g, and the metal value is in the table above. Then ask the buyer for its weight in grams and its per-gram rate, and compare both with yours. A difference in weight is the first thing to ask about; a difference in rate is the second.</p>
<p>Many 22ct and 21ct pieces bought abroad have no British hallmark, so the ${h.a('carat-22', '22ct page')} and the ${h.a('carat-21', '21ct page')} explain what a buyer will test. For a mixed set, the ${h.a('scrap', 'scrap gold calculator')} adds up each carat.</p>
<!--tool:scrap-->
`;
  },
});

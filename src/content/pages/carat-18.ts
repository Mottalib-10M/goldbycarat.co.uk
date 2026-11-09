import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'carat-18', group: 'gold', order: 12, tool: 'carat', toolProps: { ct: 18, grams: 5 }, kind: 'outil',
  related: ['carat-9', 'carat-22', 'offer', 'inherited'], sources: ['hallmarkSch1', 'hallmarkSch2'],
  slug: '18ct-gold-price', nav: '18ct gold price', card: '750 parts gold: value per gram of yellow, white or rose 18ct',
  title: '18ct Gold Price per Gram UK: 750 Gold Value at Spot',
  description: '18ct gold price per gram in pounds at the live spot price, timed: 750 thousandths of gold in yellow, white or rose 18ct, value by weight and what an offer pays.',
  h1: '18ct gold price per gram',
  resume: 'A gram of 18ct gold contains {f.18} thousandths of pure gold, three quarters of its weight, whatever its colour: yellow, white and rose 18ct differ only in what makes up the other quarter. UK hallmarking law fixes 18ct at exactly {f.18}, so the calculator multiplies your weight by 0.75 and by the spot price of a gram of gold, which it works out from the price of a troy ounce in pounds read from gold-api.com, with the time of that price shown. Engagement rings, wedding bands and good watches are often 18ct, and many are set with stones, so the gold weighs less than the piece. The result is the metal value, the most a refiner’s customer can pay before its costs. Gold by Carat is an independent site, not a gold buyer or a dealer, and it prints no buyer’s prices.',
  faqs: [
    { q: 'Is white gold worth less than yellow gold of the same carat?', a: 'Not for its gold. 18ct white gold holds the same {f.18} thousandths of gold as 18ct yellow; the difference is in the other metals, often palladium or silver, and a thin plating of rhodium on the surface. A scrap buyer pays for the gold content, so the colour does not change the metal value.' },
    { q: 'How much gold is in an 18ct ring with a diamond?', a: 'Less than the ring weighs. Take the stone out of the reckoning: a one carat diamond weighs 0.2 g, and settings with several stones can account for more. If you cannot remove the stones, estimate their weight from the certificate or the jeweller’s description and subtract it before using the calculator.' },
    { q: 'Should I sell an 18ct ring for scrap or as jewellery?', a: 'Check both. A scrap price is a share of the metal, and this page tells you the metal. A ring with a good diamond, a known maker or a period design may be worth more as jewellery than as gold. A jeweller or auction house can give a resale estimate; compare it with the scrap offer.' },
  ],
  body: (h) => {
    const rows = [1, 2, 3, 5, 10, 20].map((g) => [`${g} g`, h.num(g * 0.75, 2) + ' g', h.gbp(h.at(g, 750))]);
    return `
<h2>18ct gold value by weight</h2>
${h.table(['Weight of 18ct', 'Pure gold inside', 'Metal value'], rows, `Example worked out at the gold price of ${h.when}; the calculator above follows the price of the moment.`)}
<p>A plain 18ct wedding band of 4 or 5 g, a common weight, sits in the middle of that table. A man’s signet ring may weigh twice as much; a fine chain much less.</p>

<h2>Why 18ct is exactly 750</h2>
<p>Eighteen twenty-fourths is three quarters, 750 thousandths, so here the law and the arithmetic match. ${h.src('hallmarkSch2', 'UK hallmarking law')} lists 750 as one of the six standards for gold, and every item hallmarked 750 has been tested by an assay office and found to contain at least that much.</p>

<h2>Colour, plating and stones</h2>
<p>Colour comes from the quarter that is not gold. Yellow 18ct usually balances silver and copper; rose 18ct has more copper; white 18ct uses palladium or silver and is often plated with rhodium to brighten it. None of this changes the gold content, which is why a refiner pays the same per gram of 18ct whatever its colour. Plating is so thin it does not show on kitchen scales.</p>
<p>Stones do. A diamond, sapphire or cluster adds weight that is not gold, and some settings are hollow at the back. When a buyer removes the stones before weighing, its figure for the gold will be lower than the ring’s total weight. Ask for the stones back; they are yours and the scrap price does not pay for them.</p>
<!--tool:offer-->

<h2>Selling an 18ct piece</h2>
<p>Because 18ct is three times as rich as 9ct by weight, every percentage point on the offer is worth more. A 10 percentage point gap on 10 g of 18ct is ${h.gbp(h.at(10, 750) * 0.1)} at our recorded price, compared with ${h.gbp(h.at(10, 375) * 0.1)} on 10 g of 9ct. That makes it more worthwhile to get two or three quotes for 18ct. If the piece was inherited, the ${h.a('inherited', 'page on selling inherited gold')} covers probate value and tax.</p>
`;
  },
});

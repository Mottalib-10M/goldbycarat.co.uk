import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'carat-24', group: 'gold', order: 14, tool: 'carat', toolProps: { ct: 24, grams: 10 }, kind: 'outil',
  related: ['gold-bar', 'ounce', 'britannia', 'vat'], sources: ['hallmarkSch2', 'ukWeights', 'vatNotice70121'],
  slug: '24ct-gold-price', nav: '24ct gold price', card: 'Pure gold at 999: the gram price behind every other carat',
  title: '24ct Gold Price per Gram UK: Pure Gold in Pounds Today',
  description: '24ct gold price per gram in pounds from the live spot price, with its time: 999 fine gold, the 990 and 999.9 grades, and the value of any weight of pure gold.',
  h1: '24ct gold price per gram',
  resume: '24ct gold is pure gold, the figure every other carat on this site is a fraction of. Type the weight of your piece below to see what it is worth today. Its price is simply the spot price of a troy ounce divided by {oz2}. In practice no gold is perfectly pure, so UK hallmarking law has two standards for it, 990 and 999 thousandths, and bullion bars and Britannia coins are refined to 999.9. This calculator values 24ct at 999, the higher legal standard, using the price of an ounce in pounds read from gold-api.com, and it shows the time of that price. The result is the metal value of a 24ct chain, a small bar or a piece of pure gold jewellery, before a buyer’s margin or a dealer’s premium. Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'What is the difference between 999 and 999.9 gold?', a: 'One part in ten thousand. 999 is a legal hallmark standard for gold; 999.9, often called four nines, is the fineness of most investment bars and of the gold Britannia. On 100 g the gap is under a tenth of a gram, so it matters to a refiner but barely to a seller. Both are sold as 24ct.' },
    { q: 'Does 24ct gold jewellery count as investment gold for VAT?', a: 'No. HMRC’s investment gold rules cover bars and wafers of at least {vat.bar} thousandths in a weight the bullion market accepts, and certain coins. A 24ct chain or bracelet is jewellery, so a shop selling it charges VAT at {vat}, even though it is as pure as a bar.' },
    { q: 'Why does a gram of 24ct cost more in a shop than this page shows?', a: 'This page shows the metal at the wholesale spot price. A shop adds the cost of making the piece, its own margin and, for jewellery, VAT. Bars and coins carry a dealer’s premium over spot. The gap is a selling price, not an error in the spot figure.' },
  ],
  body: (h) => {
    const rows = [1, 5, 10, 20, 31.1035, 50, 100].map((g) => [g === 31.1035 ? '1 troy oz' : `${g} g`, h.gbp(h.at(g, 999)), h.gbp(h.at(g, 999.9)), h.gbp(h.at(g, 990))]);
    return `
<h2>Pure gold by weight and grade</h2>
${h.table(['Weight', 'At 999 (24ct)', 'At 999.9 (bullion)', 'At 990'], rows, `Example worked out at the gold price of ${h.when}.`)}

<h2>Why the gram price of 24ct is the starting point</h2>
<p>The world market quotes gold by the troy ounce of pure metal. A troy ounce is {oz} g, fixed in ${h.src('ukWeights', 'UK weights law')}, so a gram of fine gold is worth one {oz2}th of the ounce price. Every other figure on this site is that gram price times a fraction: 0.375 for 9ct, 0.75 for 18ct, {f.22} thousandths for 22ct. When you see the 24ct gram price move, every other carat moves in the same proportion.</p>

<h2>990, 999 and 999.9</h2>
<p>${h.src('hallmarkSch2', 'UK hallmarking law')} lists both 990 and 999 as standards for gold. Some pure gold jewellery is made at 990 rather than 999. Bars from accredited refiners are usually 999.9, and that is the figure printed on the bar. When valuing, use the number on the item. If there is no number, a test is the only answer.</p>

<h2>Buying pure gold</h2>
<p>Bought as bars or coins that meet ${h.src('vatNotice70121', 'HMRC’s definition of investment gold')}, 24ct gold carries no VAT; bought as jewellery it carries the standard rate. The ${h.a('gold-bar', 'gold bar page')} shows the metal value of each bar size and the premium a dealer is asking, and the ${h.a('britannia', 'Britannia page')} does the same for the Royal Mint’s 999.9 coin.</p>
<!--tool:bar-->
`;
  },
});

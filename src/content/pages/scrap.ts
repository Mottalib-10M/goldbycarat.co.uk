import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'scrap', group: 'sell', order: 22, tool: 'scrap', kind: 'outil',
  related: ['offer', 'where-to-sell', 'carat-9', 'inherited'], sources: ['hallmarkSch2', 'tcga262'],
  slug: 'scrap-gold-price', nav: 'Scrap gold price', card: 'A mixed lot of 9ct, 14ct, 18ct and 22ct valued in one go',
  title: 'Scrap Gold Price UK: Value a Mixed Lot by Carat Today',
  description: 'Scrap gold price for a mixed lot: enter the grams of 9ct, 14ct, 18ct and 22ct for the gold metal value at the live, timed spot price, and the payout at a rate.',
  h1: 'Scrap gold price: value a mixed lot',
  resume: 'Scrap gold is any gold sold for its metal rather than as jewellery: broken chains, single earrings, dated rings, a drawer of pieces nobody wears. Buyers price it by carat, so the first step is to sort it into 9ct, 14ct, 18ct and 22ct using the hallmarks, then weigh each pile. This calculator takes those weights, multiplies each by the share of gold UK hallmarking law sets for its carat and by today’s gold price in pounds, read from gold-api.com with its time, and adds them up. The total is the value of the gold in the lot. Below it you see what you would receive at different shares of that value, and if a buyer has made one offer for the whole lot, you can type it to see what share of the gold it pays. No figure here is a buyer’s price: Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'What counts as scrap gold?', a: 'Anything a buyer will melt rather than resell: broken or odd items, dental gold, unwanted rings and chains. Gold-plated, rolled gold and gold-filled items are not scrap gold in this sense, because the gold is a thin layer on base metal; most buyers will not pay for them or will pay very little.' },
    { q: 'Should I sort my scrap gold by carat before selling?', a: 'Yes. A buyer that lumps everything together may pay the lowest carat’s rate for the lot. Sorting and weighing each carat yourself means you can check its figures line by line. If a piece has no mark, keep it apart and ask the buyer to test it in front of you.' },
    { q: 'What percentage of the gold value do scrap buyers pay?', a: 'There is no fixed or published rate. Each buyer sets its own, and it can differ between carats and between a shop and a postal service. The way to know is to ask several, turn each offer into a share of the metal with this page, and compare. No law or official body publishes these rates, so this site cannot give you a normal percentage. The 60% to 90% lines under the calculator only show what each share would pay you.', open: true },
  ],
  body: (h) => `
<h2>Sort, weigh, then value</h2>
<p><strong>Sort your pieces by the number stamped on them, weigh each pile, and type the weights above.</strong> Lay everything out and read the marks. 375 is 9ct, 585 is 14ct, 750 is 18ct, 916 is 22ct. Anything marked 925 is sterling silver, not white gold. Anything marked RG or RGP (rolled gold), GF (gold-filled) or GP (gold-plated) is only a thin layer of gold on another metal, and is not gold for scrap purposes. Pieces with no mark go in a separate pile to be tested.</p>
<p>Weigh each carat’s pile in grams. Take out what is not gold where you can: stones, pearls, watch movements, steel springs. Enter the weights in the calculator above. The result is the value of the gold in the lot at today’s price.</p>
${h.table(['Example lot', 'Weight', 'Gold inside', 'Metal value'], [['9ct chains and rings', '20 g', h.num(20 * 0.375, 2) + ' g', h.live(h.at(20, 375), 'XAU')], ['18ct ring', '5 g', h.num(5 * 0.75, 2) + ' g', h.live(h.at(5, 750), 'XAU')], ['Lot', '25 g', h.num(20 * 0.375 + 5 * 0.75, 2) + ' g', h.live(h.at(20, 375) + h.at(5, 750), 'XAU')]], `Example only, worked out at the same gold price as the calculator above (${h.when}).`)}

<h2>Reading a scrap quote</h2>
<p><strong>Turn every quote into a share of your gold’s value, then compare.</strong> Scrap buyers usually quote per gram for each carat. Multiply each rate by your weight and add them, or simply type the total offer into the offer box of the calculator above. Either way you end with one number: the share of the metal the buyer is paying. That number is what you compare between buyers, because it does not move when the gold price does.</p>
<p>Watch for two things. A buyer that weighs your gold out of your sight, or does not tell you the weight it recorded, can pay a fair rate on a wrong weight. And a postal buyer that sends an offer after receiving your gold controls the timing: ask what happens if you refuse, how fast the gold comes back and whether returning it costs you.</p>

<h2>Tax on scrap gold</h2>
<p><strong>Selling a few items of jewellery almost never creates a tax bill.</strong> Each item, or set sold together, sold for {chattel} or less is free of Capital Gains Tax, the tax on a profit when you sell something (${h.src('tcga262', 'the rule')}). The ${h.a('inherited', 'page on inherited gold')} covers jewellery that came from someone who has died.</p>

<h2>Comparing two or three quotes</h2>
<p><strong>Got several quotes for the whole lot? Type each one in turn in the offer box at the top of the page.</strong> Each time, the calculator shows the share of the gold in your lot that the quote pays: the highest share is the best offer. The side-by-side comparison on the ${h.a('offer', 'offer checker')} works for gold of a single carat; a mixed lot is compared here, one quote after the other. The ${h.a('where-to-sell', 'guide to where to sell')} compares the types of buyer.</p>
`,
});

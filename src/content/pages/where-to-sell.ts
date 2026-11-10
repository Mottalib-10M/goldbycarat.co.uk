import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'where-to-sell', group: 'sell', order: 23, tool: 'compare', toolProps: { ct: 9, grams: 10 }, kind: 'guide',
  related: ['offer', 'scrap', 'sovereign', 'inherited'], sources: ['hallmarkSch2', 'tcga21', 'tcga262'],
  slug: 'where-to-sell-gold', nav: 'Where to sell gold', card: 'Shops, postal buyers, pawnbrokers, dealers and auctions compared',
  title: 'Where to Sell Gold in the UK: Compare Offers by % of Metal',
  description: 'Where to sell gold in the UK: high street buyers, postal services, pawnbrokers, bullion dealers and auctions compared, with offers set against the metal.',
  h1: 'Where to sell gold in the UK',
  resume: 'The best place to sell gold is the one that pays the highest share of its metal value on the day, and the only way to find it is to get several quotes and compare them as percentages. This guide describes how each kind of buyer in Britain works, high street gold buyers and jewellers, postal buyers, pawnbrokers, bullion dealers (dealers in gold coins and bars) and auction houses, so you know what each is paying for and where the catches lie; it does not rank named firms or print their prices, because those change daily and are theirs to publish. The comparison tool takes up to three offers for the same gold, values that gold from its carat and weight at the spot price (the price traders use for pure metal) read from gold-api.com, with the time shown, and lines the offers up as percentages. Gold by Carat is an independent site, not a gold buyer or a dealer, and takes no commission from any buyer.',
  faqs: [
    { q: 'Is it better to sell gold online or in a shop?', a: 'Neither is better by nature. A shop weighs and tests in front of you and pays on the spot, but you have to visit several to compare. A postal buyer may offer a higher share but holds your gold while you decide. Get a quote from each kind, turn it into a percentage and ask how a refusal is handled.' },
    { q: 'Do jewellers buy gold for more than scrap buyers?', a: 'Sometimes, when they can resell the piece as it is: a good ring, a signed brooch, a fashionable chain. Then they are buying jewellery, not metal, and the offer can exceed the gold value. For broken or dated pieces most jewellers pay a scrap rate, often by sending the gold to the same refiners scrap buyers use.' },
    { q: 'Where should I sell gold sovereigns?', a: 'To a dealer in gold coins rather than a scrap buyer. Sovereigns are traded as coins, and dealers buy them at a price linked to the gold price per coin, sometimes with a premium for rare dates. A scrap buyer that melts them pays for the gold only.' },
  ],
  body: (h) => `
<h2>Where to sell gold: five kinds of buyer</h2>
<h3>High street gold buyers and jewellers</h3>
<p>You walk in, they test and weigh in front of you and offer a sum. The advantage is control: the gold never leaves your sight until you accept, and you can walk out and try the next shop. Ask for the weight per carat and the rate per gram, and write both down. Shops that buy as well as sell jewellery may pay more for pieces they can put in the window.</p>
<h3>Postal buyers</h3>
<p>You request a pack, post your gold, and receive an offer after it has been weighed and tested. Read the terms before posting: how long you have to accept or refuse, whether a refusal brings your gold back free and insured, and whether a payment is made automatically if you do not reply. Photograph and weigh everything before it goes. The offer can be checked against your own weights with the ${h.a('offer', 'offer checker')}.</p>
<h3>Pawnbrokers</h3>
<p>Pawnbrokers buy gold outright as well as lending against it. A loan is not a sale: you get money now and pay interest to reclaim the item, and if you do not, it is sold. If you want to keep the piece, compare the cost of the loan with what you would lose by selling and buying back later.</p>
<h3>Coin and bar dealers (bullion dealers)</h3>
<p>For sovereigns, Britannias, Krugerrands and bars, a dealer is the natural buyer. Dealers publish buy-back prices per coin or bar that follow the gold price closely, and the gap between their selling and buying prices is usually smaller than on jewellery. They are rarely interested in jewellery except as scrap.</p>
<h3>Auction houses</h3>
<p>For antique, signed or unusual pieces an auction can beat any metal-based offer. You pay a seller’s commission and wait weeks, and the result is not guaranteed. Ask for an estimate and a reserve, and compare the estimate, net of fees, with the metal value.</p>

<h2>Questions to ask every buyer</h2>
<ul>
<li>What weight did you record for each carat, and can I see the scale?</li>
<li>What carat did your test find, and how did you test?</li>
<li>Is the offer a rate per gram or a total, and is it the same if I come back tomorrow?</li>
<li>Are there any fees, deductions or charges for returning my gold?</li>
<li>How and when will you pay?</li>
</ul>
<p>An honest buyer answers all five without fuss. A hallmark from a British assay office (an official testing office) means the piece met the standard in ${h.src('hallmarkSch2', 'UK hallmarking law')} when it was marked; a buyer that claims it is lower should show you why.</p>

<h2>Comparing the offers, and tax</h2>
<p><strong>Type the carat and weight of your gold, then each offer, in the comparison at the top of this page.</strong> It values the gold at the price of the moment and shows each offer as a percentage of it, with the gap between best and worst in pounds. Because the percentage does not move with the gold price, you can compare an offer from Monday with one from Wednesday. The ${h.a('scrap', 'mixed lot calculator')} values a lot of several carats before you start.</p>
<p>Tax rarely decides anything. Gold sovereigns and Britannias are British money and are never taxed when you sell them (${h.src('tcga21', 'the rule')}). A piece of jewellery, or a set, sold for {chattel} or less is free of Capital Gains Tax, the tax on a profit when you sell something (${h.src('tcga262', 'the rule')}). Splitting a set between buyers to stay under the limit does not work: a set sold to the same person is treated as one. The ${h.a('inherited', 'inherited gold page')} covers estates.</p>
`,
});

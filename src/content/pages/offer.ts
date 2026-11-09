import { definePage } from '../../lib/page-types';
import { exampleOffer } from '../../lib/exemple';
export default definePage({
  id: 'offer', group: 'sell', order: 20, tool: 'offer', toolProps: { ct: 9, grams: 10 }, kind: 'outil',
  related: ['scrap', 'where-to-sell', 'carat-9', 'carat-18'], sources: ['hallmarkSch2'],
  slug: 'gold-offer-checker', nav: 'Gold offer checker', card: 'Turn any quote into the share of the metal it really pays',
  title: 'Gold Offer Checker UK: What Share of the Metal Is Paid?',
  description: 'Gold offer checker: type the carat, the weight and the price a buyer offered, and see what share of the gold metal it pays at the live, timed spot price.',
  h1: 'Gold offer checker',
  resume: 'Type the carat, the weight and what the buyer offered: you see what share of your gold’s value you are being paid. Most buyers never tell you that figure. The checker works out the gold in your item from the share of gold UK hallmarking law sets for each carat and today’s gold price in pounds, read from gold-api.com, with the time of the price shown. It then gives the offer as a percentage of that gold value, the amount the buyer keeps, and the offer per gram. A percentage is the fair way to compare offers, because it stays meaningful when the gold price moves between one quote and the next, and it is the figure the buyers’ own pages leave out. Gold by Carat is an independent site, not a gold buyer or a dealer, and has no stake in which offer you take.',
  faqs: [
    { q: 'What is a fair percentage of the gold value to be offered?', a: 'No law or industry body sets one, and buyers do not publish theirs. Fair is relative: the best of several offers made on the same day for the same weight. Use this checker on each and take the highest percentage, after asking each buyer how it weighed and tested your gold.', open: true },
    { q: 'Why would an offer be above 100% of the metal?', a: 'Either the weight or the carat entered is too low, the price has moved since the quote, or the buyer values the piece as jewellery rather than as scrap: an antique, a signed piece or one with good stones. If the offer is for resale, the metal value is not the right comparison.' },
    { q: 'The buyer quoted per gram. How do I check it?', a: 'Multiply the per-gram rate by the weight to get the total, or divide the per-gram rate by the gram price for that carat shown here. A 9ct rate of 70% of the gram price is a 70% offer, whatever the weight. The checker also shows the offer per gram for the total you enter.' },
  ],
  body: (h) => {
    const v = h.at(10, 375);
    const rows = [0.6, 0.7, 0.8, 0.9].map((p) => [h.pct(p, 0), h.live(v * p), h.live(v * (1 - p))]);
    return `
<h2>Why a percentage beats a price</h2>
<p><strong>A percentage stays comparable when the gold price moves; a sum of money does not.</strong> Gold moves every minute the markets are open. An offer of ${h.gbp(exampleOffer(10, 9, 0.7))} for 10 g of 9ct might be good on one day and poor a week later. Turned into a share of the metal at the moment of the quote, it becomes a number you can compare across buyers and across days. The checker reads today’s gold price when you open the page; if you are checking an old quote, keep in mind that the price may have moved since.</p>
${h.table(['Share of the gold value', 'Offer on 10 g of 9ct', 'Kept by the buyer'], rows, `Example: 10 g of 9ct holds ${h.live(v)} of gold at the same price as the calculator above (${h.when}).`)}
<p>“Kept by the buyer” is not profit. It pays for refining, for carrying the price risk until the gold is sold on, for the shop, the staff and, for postal buyers, insured delivery. What it tells you is how much room there is between one offer and another.</p>

<h2>Check the weight and the carat too</h2>
<p>A percentage is only as good as the weight and carat behind it. Ask the buyer for both, in writing if possible. If its weight is lower than yours, ask why: stones removed, a spring taken out, or a scale error. If it says the carat is lower than the hallmark, ask for the test result. A British hallmark from an official testing office means the piece met ${h.src('hallmarkSch2', 'the legal standard')} when it was marked.</p>

<h2>Checking several gold offers at once</h2>
<p><strong>Got two or three quotes? Type them below to see which pays the biggest share of your gold.</strong> The comparison puts them side by side as percentages; the figures already filled in are only examples. For a lot of several carats, use the ${h.a('scrap', 'scrap gold calculator')} instead: it takes the weight of each carat and one offer for the whole lot. The ${h.a('where-to-sell', 'guide to where to sell')} explains how each type of buyer works.</p>
<!--tool:compare-->
`;
  },
});

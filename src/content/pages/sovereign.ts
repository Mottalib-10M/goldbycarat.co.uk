import { definePage } from '../../lib/page-types';
import { coinById, coinFineGrams } from '../../lib/engine/metal';
export default definePage({
  id: 'sovereign', group: 'coins', order: 30, tool: 'coin', toolProps: { coin: 'sovereign' }, kind: 'outil',
  related: ['half-sovereign', 'britannia', 'cgt', 'vat'], sources: ['coinageAct', 'rmSovereign', 'rmQuarter', 'tcga21', 'vatNotice70121', 'vatNotice70121A'],
  slug: 'sovereign-gold-value', nav: 'Gold sovereign value', card: 'How much gold a full sovereign holds and what that gold is worth',
  title: 'Gold Sovereign Value Today: Melt Value of a Full Sovereign',
  description: 'Gold sovereign value in pounds from its legal weight and the live, timed spot price: gold content, melt value, dealer premium, and why there is no CGT.',
  h1: 'Gold sovereign value today',
  resume: 'Every full sovereign holds the same amount of gold, so you do not need scales: choose how many you have and see what that gold is worth today. Type the price a dealer asks, or a buyer offers, and it shows that price as a percentage of the gold, the usual way sovereigns are traded. The law fixes the coin’s weight at {sov.g}, eleven twelfths of it gold, which is {sov.fine} of pure gold; the Royal Mint gives the same amount as 0.235 of an ounce. Its gold value is that gold times today’s gold price, which this calculator reads in pounds from gold-api.com and shows with its time. Sovereigns are British money, so selling them creates no Capital Gains Tax (the tax on a profit when you sell), and they are bought free of VAT, the sales tax. Choose half, quarter or double sovereigns and the £5 coin from the list. Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'How much gold is in a sovereign?', a: 'The legal weight of a sovereign is {sov.g} and it is eleven twelfths gold, so it holds {sov.fine} of pure gold, or about 0.2354 troy ounces. The Royal Mint rounds that to 0.235 oz on its specification. Worn old coins can weigh slightly less, but most dealers trade them at the full content unless the wear is heavy.' },
    { q: 'Are gold sovereigns free of Capital Gains Tax?', a: 'Yes. Sovereigns are British money, and the tax law puts British money outside Capital Gains Tax, the tax on a profit when you sell something. Any gain when you sell is outside Capital Gains Tax, however many you sell and whatever the profit. The same applies to Britannias.' },
    { q: 'Is a sovereign worth more than its gold?', a: 'When you buy one, almost always: dealers charge more than the gold is worth, to cover minting and distribution. When you sell, bullion dealers usually pay close to the gold value. Some dates, mint marks and proof coins are worth extra to collectors, which a coin specialist can price.', open: true },
  ],
  body: (h) => {
    const ids = ['quarter-sovereign', 'half-sovereign', 'sovereign', 'double-sovereign', 'five-pound'];
    const rows = ids.map((id) => { const c = coinById(id); const fg = coinFineGrams(c); return [c.name, c.grossG ? h.num(c.grossG, 2) + ' g' : 'Only its gold is published (Royal Mint)', h.num(fg, 3) + ' g', h.gbp(h.at(fg, 1000))]; });
    return `
<h2>How much gold each sovereign coin holds, and its value</h2>
<p><strong>A full sovereign holds just under a quarter of an ounce of pure gold; the other coins hold a fixed share of that.</strong></p>
${h.table(['Coin', 'Weight of one coin', 'Pure gold', 'Gold value'], rows, `Example worked out at the gold price of ${h.when}. Weights from the coin law, rounded to a hundredth of a gram; quarter sovereign from the Royal Mint (0.059 oz of gold).`)}

<h2>Where the figures come from</h2>
<p>${h.src('coinageAct', 'The law on coins')} sets the weight of each gold coin and its gold share: eleven twelfths pure gold and one twelfth other metal. For the sovereign that is {sov.g}; for the half sovereign {half.g}; for the £2 and £5 coins, two and five times the sovereign. The ${h.src('rmSovereign', 'Royal Mint’s specification')} for the 2026 sovereign gives 0.235 oz of pure gold, eleven twelfths of the coin, which matches. The quarter sovereign, introduced long after 1971, comes from the ${h.src('rmQuarter', 'Royal Mint’s quarter sovereign page')}: 0.059 oz.</p>

<h2>Buying and selling sovereigns</h2>
<p><strong>Dealers sell sovereigns for more than their gold and buy them for less.</strong> They price per coin, not per gram. When you buy, the dealer asks more than the gold is worth; when you sell, it pays less, and keeps the difference. Type the price it asks or offers into the calculator to see it as a percentage of the gold. For a fair comparison, check two or three dealers at the same moment, since the gold price moves.</p>
<p>No VAT is charged on sovereigns. They pass ${h.src('vatNotice70121', 'the tests for investment gold coins')} set by HMRC, the UK tax office: made after {vat.minted}, at least {vat.coin} parts gold in 1,000, British money, and normally sold for no more than {vat.premium} of their gold value. HMRC also names them in ${h.src('vatNotice70121A', 'its list of such coins')}.</p>

<h2>Why sovereigns are outside Capital Gains Tax</h2>
<p><strong>A profit on sovereigns is never taxed.</strong> ${h.src('tcga21', 'The tax law')} puts British money outside Capital Gains Tax, and sovereigns are British money. That is the main reason many British investors buy sovereigns and Britannias rather than bars or foreign coins. The ${h.a('cgt', 'Capital Gains Tax page')} compares the cases.</p>
<p>Selling a sovereign to a scrap buyer, who will melt it down, gets you the gold value at best. A coin dealer is usually the better route; the ${h.a('where-to-sell', 'guide to where to sell')} explains why.</p>
`;
  },
});

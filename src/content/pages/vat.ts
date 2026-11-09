import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'vat', group: 'rules', order: 51, tool: 'vat', toolProps: { item: 'coin' }, kind: 'guide',
  related: ['gold-bar', 'sovereign', 'silver-britannia', 'cgt'], sources: ['vatNotice70121', 'vatNotice70121A', 'vatRates'],
  slug: 'vat-on-gold', nav: 'VAT on gold', card: 'Investment gold, jewellery and silver: the HMRC tests',
  title: 'VAT on Gold UK: Investment Gold Rules for Coins and Bars',
  description: 'VAT on gold in the UK: when bars and coins are VAT-free investment gold under HMRC Notice 701/21, the {vat.premium} test for coins, and why jewellery and silver pay {vat}.',
  h1: 'VAT on gold: what is exempt and what is not',
  resume: 'Gold bought in the United Kingdom is either investment gold, which is exempt from VAT, or ordinary goods taxed at the standard rate of {vat}. HMRC VAT Notice 701/21 draws the line. A bar or wafer qualifies if it is at least {vat.bar} thousandths fine and of a weight the bullion market accepts. A coin qualifies if it is at least {vat.coin} fine, was minted after {vat.minted}, is or was legal tender in its country of origin, and is normally sold for no more than {vat.premium} of the value of its gold. Jewellery never qualifies, however pure, and silver never qualifies at all. The calculator runs those tests on an item you describe, using the gold price in pounds from gold-api.com, with its time shown, for the {vat.premium} test. Gold by Carat is an independent site, not a gold buyer or a dealer, and this is not tax advice.',
  faqs: [
    { q: 'Do I pay VAT when I sell gold?', a: 'Not as a private individual. VAT is charged by businesses on their sales, and you are not making a business supply when you sell your own jewellery or coins. The buyer does not add or deduct VAT from what it pays you. VAT only matters to you when you buy from a dealer or shop.' },
    { q: 'What is the 180% test for gold coins?', a: 'A coin that meets the other conditions is investment gold only if it is normally sold at no more than {vat.premium} of the open market value of the gold it contains. Bullion coins such as sovereigns sit well below that. A coin sold mainly to collectors, at a large premium for rarity or a proof finish, can exceed it and then carries VAT.' },
    { q: 'Is there VAT on a gold bar necklace or pendant?', a: 'Yes. Investment gold means bars and wafers of accepted weights and coins meeting the tests. A pendant shaped like a bar, or a bar set into jewellery, is sold as jewellery and carries VAT at {vat}. Gold jewellery of any carat, including 24ct, is standard-rated.' },
  ],
  body: (h) => `
<h2>The tests in HMRC VAT Notice 701/21</h2>
${h.table(['Item', 'Conditions for exemption', 'VAT if not met'], [['Gold bar or wafer', `At least {vat.bar} thousandths fine; a weight accepted by the bullion markets`, '{vat}'], ['Gold coin', `At least {vat.coin} fine; minted after {vat.minted}; legal tender in its country of origin, now or in the past; normally sold at no more than {vat.premium} of its gold value`, '{vat}'], ['Gold jewellery', 'Never investment gold', '{vat}'], ['Silver, platinum, palladium', 'Never investment gold', '{vat}']], 'Summary of HMRC VAT Notice 701/21, section 2.')}
<p>${h.src('vatNotice70121', 'VAT Notice 701/21')} is HMRC’s guidance on gold and VAT. Much of it explains how businesses that trade gold account for VAT, which does not concern private buyers; section 2 sets out what investment gold is. HMRC publishes a list of gold coins in ${h.src('vatNotice70121A', 'HMRC’s list')}, last updated on 3 July 2026.</p>

<h2>Bars: fineness and weight</h2>
<p>A bar must be {vat.bar} thousandths fine or more. Bars from accredited refiners are 999.9, so they pass easily. The weight must be one the bullion markets accept; the notice lists them in grams, kilos and troy ounces. A 1 g bar is investment gold; a 1 g novelty ingot of 9ct is not. The ${h.a('gold-bar', 'gold bar page')} lists the gram sizes and values each one.</p>

<h2>Coins: the four conditions</h2>
<p>Fineness of at least {vat.coin} thousandths rules out coins of lower gold content. Minting after {vat.minted} rules out very old coins. Legal tender status is about the country of origin, not the UK: a Krugerrand qualifies because it is legal tender in South Africa. The {vat.premium} condition is about the coin’s normal selling price compared with its gold, so it is tested on the coin type, not on one sale. The calculator applies it to the price you type as a guide.</p>

<h2>Jewellery and silver</h2>
<p>Everything else carries VAT at ${h.src('vatRates', 'the standard rate of {vat}')}: rings, chains and bangles of any carat, silver bars and coins, platinum and palladium. The price in a UK shop already includes it. This is why silver bullion carries a much wider gap between buying and selling prices than gold: you pay VAT on the way in and get none of it back on the way out. The ${h.a('silver-britannia', 'silver Britannia page')} shows the effect.</p>

<h2>Reading a dealer’s price</h2>
<p>Gold coins and bars from a UK dealer should be priced without VAT if they meet the tests, and the invoice should say so. Silver, platinum and palladium prices should include VAT; some dealers show prices before VAT on their lists and add it at checkout, so compare totals. When you compare a dealer’s price with the metal value on this site, use the price you will actually pay, VAT and delivery included, and the premium the calculator shows will be the true cost of buying.</p>
<!--tool:bar-->
<p>To compare a bar with a coin, the ${h.a('sovereign', 'sovereign page')} shows coin premiums, and the ${h.a('cgt', 'Capital Gains Tax page')} explains the tax on selling.</p>
`,
});

import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'krugerrand', group: 'coins', order: 33, tool: 'coin', toolProps: { coin: 'krugerrand' }, kind: 'outil',
  related: ['britannia', 'sovereign', 'cgt', 'gold-bar'], sources: ['rmKrugerrand', 'rmMaple', 'cg78300', 'govChattels', 'vatNotice70121'],
  slug: 'krugerrand-value', nav: 'Krugerrand and Maple value', card: 'Foreign one ounce coins: gold content and the tax difference',
  title: 'Krugerrand Value in Pounds: 1 oz Gold Coin, UK Tax Rules',
  description: 'Krugerrand value in pounds at the live, timed spot price, with the Canadian Maple Leaf: one ounce of gold each, the premium, and why gains are taxable.',
  h1: 'Krugerrand and Maple Leaf value in pounds',
  resume: 'A one ounce Krugerrand contains one troy ounce of gold in a coin 916.7 fine, according to the Royal Mint, which sells it; the rest of the coin is alloy metal that makes it harder. A Canadian Maple Leaf contains one ounce at 999 fine in the Royal Mint’s listing. Their metal values are therefore the same: the spot price of an ounce, which this calculator reads in pounds from gold-api.com and shows with its time. What differs from British coins is tax. Neither coin is sterling, so HMRC treats both as chargeable assets, and a gain on them can be liable to Capital Gains Tax once a sale exceeds the {chattel} limit for personal possessions; sovereigns and Britannias are not. Both are investment gold for VAT. Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'Do I pay Capital Gains Tax on Krugerrands?', a: 'Possibly. Krugerrands are South African currency, not sterling, so HMRC treats them as chargeable. GOV.UK counts coins among personal possessions, which are exempt when sold for {chattel} or less, with the gain capped above that. A larger sale can produce a taxable gain after the annual exempt amount of {cgt.allowance}.' },
    { q: 'Is a Krugerrand worth less than a Britannia?', a: 'In gold, no: both contain one troy ounce of fine gold. Dealers may price them slightly differently because demand differs and because UK buyers value the Britannia’s Capital Gains Tax exemption. Compare the premium each dealer asks as a percentage of the same metal value.' },
    { q: 'Why does a Krugerrand weigh more than an ounce?', a: 'Because it is 916.7 fine: the ounce is the gold it contains, and alloy metal makes up the rest of the coin. By arithmetic the whole coin weighs about one ounce divided by 0.9167. Scales showing more than {oz2} g are therefore expected and not a sign of anything wrong.' },
  ],
  body: (h) => `
<h2>Krugerrand value in pounds: same gold, different tax</h2>
${h.table(['Coin', 'Fine gold', 'Fineness', 'Metal value', 'Capital Gains Tax'], [['Krugerrand 1 oz', '1 oz', '916.7', h.live(h.at(31.1034768, 1000), 'XAU'), 'Chargeable, chattel rule'], ['Maple Leaf 1 oz', '1 oz', '999', h.live(h.at(31.1034768, 1000), 'XAU'), 'Chargeable, chattel rule'], ['Britannia 1 oz', '1 oz', '999.9', h.live(h.at(31.1034768, 1000), 'XAU'), 'Outside CGT (sterling)']], `Worked out at the same gold price as the calculator above (${h.when}).`)}

<h2>Specifications</h2>
<p>The Royal Mint sells both coins and gives their specifications: the ${h.src('rmKrugerrand', 'Krugerrand')} at one ounce of fine gold, 916.7 fine, and the ${h.src('rmMaple', 'Canadian Maple Leaf')} at one ounce, 999 fine. The calculator values each from that content, so worn coins or ones with damaged edges may fetch less from a dealer than the figure shown.</p>

<h2>Capital Gains Tax on foreign coins</h2>
<p>${h.src('cg78300', 'HMRC’s Capital Gains Manual')} says currency other than sterling is a chargeable asset. A Krugerrand is legal tender in South Africa and a Maple Leaf in Canada, so neither has the exemption that sterling coins enjoy. ${h.src('govChattels', 'GOV.UK lists coins')} among personal possessions, so a sale of {chattel} or less is exempt, and above that the gain is capped at five thirds of the excess. Whether several coins sold together to one buyer count as a set depends on the facts. The ${h.a('cgt', 'Capital Gains Tax calculator')} handles all three cases.</p>

<h2>VAT</h2>
<p>Both coins meet the investment gold tests in ${h.src('vatNotice70121', 'VAT Notice 701/21')}: minted after {vat.minted}, at least {vat.coin} fine, legal tender in their country, and normally sold for no more than {vat.premium} of their gold value. Dealers sell them without VAT.</p>
<p>If the tax difference matters to you, the ${h.a('britannia', 'Britannia page')} and the ${h.a('sovereign', 'sovereign page')} value the British equivalents.</p>
`,
});

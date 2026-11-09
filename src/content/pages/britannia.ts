import { definePage } from '../../lib/page-types';
import { coinById, coinFineGrams } from '../../lib/engine/metal';
export default definePage({
  id: 'britannia', group: 'coins', order: 32, tool: 'coin', toolProps: { coin: 'britannia-1oz' }, kind: 'outil',
  related: ['sovereign', 'krugerrand', 'gold-bar', 'silver-britannia'], sources: ['rmBritannia1', 'rmBritanniaHalf', 'rmBritanniaQuarter', 'rmBritanniaTenth', 'tcga21', 'vatNotice70121'],
  slug: 'gold-britannia-value', nav: 'Gold Britannia value', card: 'One ounce of 999.9 gold, and the fractional coins',
  title: 'Gold Britannia Value: 1 oz, ½, ¼ and 1/10 oz in Pounds',
  description: 'Gold Britannia value in pounds at the live, timed spot price: 1 oz, half, quarter and tenth ounce coins at 999.9 fine, dealer premium and UK tax rules.',
  h1: 'Gold Britannia value',
  resume: 'A one ounce gold Britannia contains one troy ounce of gold, {oz2} grams, at 999.9 fine according to the Royal Mint’s specification, so its metal value is almost exactly the spot price of an ounce. This calculator reads that price in pounds from gold-api.com, shows the time it carries, and values the 1 oz coin or the half, quarter and tenth ounce versions. Type a dealer’s price and you see the premium over the gold. Like the sovereign, the Britannia is UK legal tender, which takes it outside Capital Gains Tax, and it is investment gold for VAT. Unlike the sovereign, it is pure gold measured in ounces, which makes it easy to compare with bars and foreign bullion coins such as the Krugerrand and the Maple Leaf. Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'How much gold is in a 1 oz Britannia?', a: 'One troy ounce, {oz2} g, of gold at 999.9 fine, as the Royal Mint states for the 2026 coin. The half, quarter and tenth ounce coins contain those fractions of an ounce. Their metal value is the spot price multiplied by the fraction, before any dealer’s premium.' },
    { q: 'Is a Britannia better than a sovereign for investing?', a: 'Both are UK legal tender and free of Capital Gains Tax and VAT. A one ounce Britannia packs more gold into one coin, so its premium per gram is usually lower than on sovereigns. Sovereigns are smaller, so they can be sold a few at a time. The calculator shows each coin’s premium as a percentage.' },
    { q: 'Are older Britannias as pure as new ones?', a: 'Not always. The current coin is 999.9 fine, but earlier Britannias were struck in 22 carat gold. Their gold content per ounce of coin weight differs, so check the year and the specification before valuing an older coin; this calculator uses the current Royal Mint figures.' },
  ],
  body: (h) => {
    const ids = ['britannia-1oz', 'britannia-half', 'britannia-quarter', 'britannia-tenth'];
    const rows = ids.map((id) => { const c = coinById(id); const fg = coinFineGrams(c); return [c.name, h.num(fg, 3) + ' g', h.gbp(h.at(fg, 1000))]; });
    return `
<h2>Britannia coins and their gold</h2>
${h.table(['Coin', 'Fine gold', 'Metal value'], rows, `Example worked out at the gold price of ${h.when}; contents from the Royal Mint 2026 specifications.`)}

<h2>The specification</h2>
<p>The Royal Mint gives the ${h.src('rmBritannia1', '1 oz Britannia')} as one troy ounce of 999.9 fine gold, and publishes the ${h.src('rmBritanniaHalf', 'half')}, ${h.src('rmBritanniaQuarter', 'quarter')} and ${h.src('rmBritanniaTenth', 'tenth')} ounce coins at the same fineness. The calculator values each from its stated content, so the figures do not depend on your scales.</p>

<h2>Premium and spread</h2>
<p>Dealers sell Britannias above the metal value and buy them back below it. On one ounce coins the premium is usually smaller as a percentage than on sovereigns or fractional coins, because the fixed cost of the coin is spread over more gold. Type a dealer’s price to see the premium, and compare it with the ${h.a('gold-bar', 'premium on a bar')} of similar weight.</p>

<h2>Tax</h2>
<p>As UK legal tender, the Britannia is sterling currency and ${h.src('tcga21', 'outside Capital Gains Tax')}. It also meets the investment gold tests in ${h.src('vatNotice70121', 'HMRC’s VAT guidance')}, so no VAT is charged. Bars and foreign coins are VAT-free too, but gains on them are taxable under the chattel rules, which is why Britannias and sovereigns are popular with investors who expect large gains. The ${h.a('krugerrand', 'Krugerrand and Maple page')} shows the alternatives.</p>
<p>A silver Britannia is a different case for VAT; see the ${h.a('silver-britannia', 'silver Britannia page')}.</p>
`;
  },
});

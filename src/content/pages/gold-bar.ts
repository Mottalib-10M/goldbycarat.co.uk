import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'gold-bar', group: 'gold', order: 18, tool: 'bar', toolProps: { bar: 100 }, kind: 'outil',
  related: ['carat-24', 'vat', 'britannia', 'cgt'], sources: ['vatNotice70121', 'ukWeights'],
  slug: 'gold-bar-value', nav: 'Gold bar value', card: 'Metal in a 1 g to 1 kg bar, and the premium a dealer asks',
  title: 'Gold Bar Value UK: 1 g to 1 kg Bars at the Live Spot Price',
  description: 'Gold bar value in pounds for every size from 1 g to 1 kg at the live, timed spot price; type a dealer’s price to see its premium. VAT-free rules as well.',
  h1: 'Gold bar value by size',
  resume: 'A gold bar from an accredited refiner is 999.9 fine, so its metal value is its weight times nearly the full price of pure gold: the calculator takes the spot price of a troy ounce in pounds from gold-api.com, shows when it was set, and works out the gold in any bar from 1 g to 1 kg. Type the price a dealer is asking and it shows the premium over that metal, which is the cost of buying gold in small pieces. Bars of at least {vat.bar} thousandths in a weight the bullion market accepts are investment gold under HMRC VAT Notice 701/21 and carry no VAT; the sizes in the list are those the notice names. When you sell, a bar is a chattel for Capital Gains Tax, not currency. Gold by Carat is an independent site, not a gold buyer or a dealer: it sells no bars.',
  faqs: [
    { q: 'Why does a 1 g gold bar cost so much more per gram than a 100 g bar?', a: 'Making, assaying, packaging and selling a bar costs roughly the same whatever its size, so on a 1 g bar those costs are a large share of the price. Dealers also price small bars for gifts. The calculator shows the premium as a percentage so you can compare sizes on the same footing.' },
    { q: 'Do I pay VAT on a gold bar in the UK?', a: 'Not if it is investment gold: a bar or wafer of at least {vat.bar} thousandths fine, in a weight accepted by the bullion market, is exempt under HMRC VAT Notice 701/21. A gold bar pendant or a novelty ingot below that fineness is taxed at {vat} like jewellery.' },
    { q: 'Is profit on a gold bar taxable?', a: 'Possibly. Unlike sovereigns, a bar is not currency, so it is a chattel for Capital Gains Tax. If the whole sale is {chattel} or less, the gain is exempt; above that, the gain counts, capped at five thirds of the excess over {chattel}, and the annual exempt amount comes off.' },
  ],
  body: (h) => {
    const rows = h.P.barSizesGrams.map((g) => [Math.abs(g - 31.1034768) < 0.001 ? '1 troy oz' : g >= 1000 ? '1 kg' : `${h.num(g, g % 1 ? 1 : 0)} g`, h.live(h.at(g, 999.9), 'XAU')]);
    return `
<h2>Metal in each bar size</h2>
${h.table(['Bar', 'Gold at 999.9'], rows, `Worked out at the same gold price as the calculator above (${h.when}). Sizes from the list of accepted weights in HMRC VAT Notice 701/21.`)}

<h2>Premium: what you pay above the metal</h2>
<p>No dealer sells gold at spot. The difference between the price and the metal is the premium, and it falls as the bar gets bigger. Type a dealer’s price into the calculator and it shows the premium in pounds and as a percentage of the metal. Compare two or three dealers on the same bar size and on the same day, because the spot price moves.</p>
<p>When you sell, the dealer pays something below spot, so the round trip costs both the buying premium and the selling discount. For a small bar that round trip can be large. A bar is worth buying for its gold only if you expect to hold it long enough for the price to cover both.</p>

<h2>VAT and the accepted weights</h2>
<p>${h.src('vatNotice70121', 'HMRC’s VAT guidance')} treats as investment gold a bar or wafer of at least {vat.bar} thousandths fine in a weight accepted by the bullion markets, and lists those weights in grams, kilos and ounces. Sales of investment gold are exempt. A bar sold as a pendant, or one below the fineness, is not. The ${h.a('vat', 'VAT page')} runs the full test.</p>

<h2>Capital Gains Tax on bars</h2>
<p>A bar is not legal tender, so the sovereign exemption does not apply. It is a chattel, and the {chattel} rule decides most small sales. The ${h.a('cgt', 'Capital Gains Tax page')} works out a gain on a larger bar, and the ${h.a('britannia', 'Britannia page')} explains why some investors choose UK coins instead.</p>
<!--tool:vat-->
`;
  },
});

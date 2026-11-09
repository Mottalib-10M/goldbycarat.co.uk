import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'inherited', group: 'sell', order: 21, tool: 'cgt', toolProps: { kind: 'chattel' }, kind: 'guide',
  related: ['cgt', 'scrap', 'sovereign', 'where-to-sell'], sources: ['tcga262', 'govChattels', 'govChattelsGain', 'govCgtRates', 'govCgtAllowance', 'tcga21', 'cg78300'],
  slug: 'selling-inherited-gold', nav: 'Selling inherited gold', card: 'What it was worth when the person died, the {chattel} tax-free limit, and coins that are never taxed',
  title: 'Selling Inherited Gold Jewellery UK: Value and Tax Rules',
  description: 'Selling inherited gold jewellery or coins in the UK: valuing the metal, the probate value as your cost, the {chattel} chattel exemption and when CGT applies.',
  h1: 'Selling inherited gold jewellery and coins',
  resume: 'When you inherit gold, the cost that counts for Capital Gains Tax is not what your relative paid but the value at the date of death, the figure normally used for probate, so a gain is only what the gold has risen since then. Most inherited jewellery is sold in pieces worth less than {chattel} each, and each such item or set is exempt as a chattel under the tax law. Sovereigns and Britannias are sterling currency and outside the tax altogether. The calculator works out the tax, if any, for {taxYear} from the sale price, the probate value and your taxable income, using the annual exempt amount of {cgt.allowance} and the rates of {cgt.basic} and {cgt.higher}. Before that, the carat pages give the metal value. Gold by Carat is an independent site, not a gold buyer or a dealer, and this is not tax advice.',
  faqs: [
    { q: 'What value do I use as the cost of inherited jewellery?', a: 'The market value at the date of death, which is what the executors should have used for the estate. If the estate valued the jewellery as a lot, ask the executors or the valuer for the figure per item or per set. That value, not the original purchase price, is deducted from your sale price to find the gain.' },
    { q: 'Do I need to tell HMRC when I sell inherited gold?', a: 'Not if there is no taxable gain and the total sale proceeds for the year are below the reporting limits HMRC publishes. If a sale exceeds {chattel} and produces a gain above the annual exempt amount, you report it to HMRC, usually through Self Assessment, following the steps GOV.UK sets out.' },
    { q: 'Should executors sell gold before distributing the estate?', a: 'It depends on the will and the beneficiaries. If the executors sell, any gain since the date of death is the estate’s and is taxed under the rules for personal representatives. If they hand the gold over, the beneficiary takes it at the probate value and any later gain is theirs. A solicitor or tax adviser can advise on a large estate.' },
  ],
  body: (h) => `
<h2>Step one: before selling inherited gold, know what it is worth</h2>
<p>Before any tax question, sort the pieces by hallmark and weigh them. The ${h.a('scrap', 'scrap gold calculator')} gives the metal value of a mixed lot at the price of the moment, and the ${h.a('sovereign', 'sovereign page')} values coins without weighing. Set aside anything that might sell better as jewellery than as metal: a signed piece, a period brooch, a ring with a significant stone. An auction house or jeweller can give an opinion on those.</p>
<p>Compare what you find with the estate’s valuation. If the metal is now worth much more than the probate value, the gain matters; if it is worth about the same or less, there is no gain to tax.</p>

<h2>Step two: the probate value is your cost</h2>
<p>For inherited assets the cost for Capital Gains Tax is the market value at the date of death. Executors value personal possessions, including jewellery, for Inheritance Tax and probate. Keep a copy of that valuation: it is your evidence of cost. If the jewellery was valued as one lump, ask for a breakdown, because the chattel rule works item by item.</p>

<h2>Step three: the chattel rule</h2>
<p>Jewellery, watches and bars are chattels: tangible movable property. Under ${h.src('tcga262', 'the tax law')} a gain on a chattel sold for {chattel} or less is exempt. Above {chattel}, the gain is capped at five thirds of the amount by which the sale price exceeds {chattel}; ${h.src('govChattelsGain', 'GOV.UK’s worked guidance')} explains the calculation, which matters for sales up to about {chattel.upper}. A pair of earrings, a matching necklace and bracelet or a set of rings sold together to the same buyer count as one item.</p>
${h.table(['Sale price', 'Probate value', 'Gain', 'Capped gain', 'Taxable after {cgt.allowance}'], [[h.gbp(5800), h.gbp(2000), h.gbp(3800), 'Exempt', h.gbp(0)], [h.gbp(7500), h.gbp(3000), h.gbp(4500), h.gbp(2500), h.gbp(0)], [h.gbp(12000), h.gbp(4000), h.gbp(8000), h.gbp(8000), h.gbp(5000)]], 'Illustrative figures, one item each, no other gains in the tax year.')}

<h2>Step four: coins are different</h2>
<p>Sovereigns, half sovereigns and Britannias are legal tender in the United Kingdom, and ${h.src('tcga21', 'the tax law')} excludes sterling currency from chargeable assets. Selling them creates no gain or loss, whatever their value. Krugerrands, Maple Leafs and other foreign coins are not sterling, so ${h.src('cg78300', 'HMRC treats them as chargeable')}; ${h.src('govChattels', 'GOV.UK lists coins')} among the personal possessions covered by the {chattel} rule. Whether several coins sold together count as a set is decided on the facts, so the calculator treats what you enter as one sale. The ${h.a('cgt', 'Capital Gains Tax page')} sets out each case.</p>

<h2>Step five: the rate</h2>
<p>For {taxYear}, the first {cgt.allowance} of total gains is free of tax. The rest is taxed at {cgt.basic} where it falls within your unused basic rate band and {cgt.higher} above it (${h.src('govCgtRates', 'GOV.UK, Capital Gains Tax rates')}). The calculator at the top of the page uses your taxable income to split the gain between the two rates. It assumes no other gains in the year.</p>

<h2>Sharing gold between family members</h2>
<p>If several relatives inherit together, each owns a share and each has an annual exempt amount. Dividing the pieces between beneficiaries before any sale can mean several people each sell items under {chattel}. Gifts between spouses and civil partners are made at no gain and no loss. These choices are worth a conversation with whoever administers the estate before anything is sold.</p>
`,
});

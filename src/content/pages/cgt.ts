import { definePage } from '../../lib/page-types';
import { cgt } from '../../lib/engine/metal';
export default definePage({
  id: 'cgt', group: 'rules', order: 50, tool: 'cgt', toolProps: { kind: 'chattel' }, kind: 'guide',
  related: ['inherited', 'sovereign', 'krugerrand', 'gold-bar'], sources: ['tcga21', 'tcga262', 'cg78300', 'govChattels', 'govChattelsGain', 'govCgtRates', 'govCgtAllowance'],
  slug: 'capital-gains-tax-on-gold', nav: 'Capital Gains Tax on gold', card: 'Coins, jewellery and bars: who pays, the {chattel} tax-free limit, the rates',
  title: 'Capital Gains Tax on Gold UK {taxYearShort}: Coins and Jewellery',
  description: 'Capital Gains Tax on gold for {taxYearShort}: why sovereigns and Britannias are exempt, the {chattel} chattel rule for jewellery and bars, the 5/3 cap and the rates.',
  h1: 'Capital Gains Tax on gold',
  resume: 'If you sell a few rings or a chain, you almost certainly owe no tax: any piece of jewellery, or set sold together, sold for {chattel} or less is free of Capital Gains Tax (CGT), the tax on a profit when you sell something. British gold coins, sovereigns, half sovereigns and Britannias, are never taxed at all, because the law treats them as British money. Bars, scrap and foreign coins such as Krugerrands follow the same {chattel} rule as jewellery. Sold for a little more than {chattel}, only part of the profit can be taxed, and everyone has a tax-free allowance of {cgt.allowance} a year on top; what is left is taxed at {cgt.basic} or {cgt.higher} depending on your income, for {taxYear}. For gold you inherited, the cost is what it was worth when the person died. The calculator applies those rules to a sale price, a cost and your income. Gold by Carat is an independent site, not a gold buyer or a dealer, and this is not tax advice.',
  faqs: [
    { q: 'Which gold coins are free of Capital Gains Tax?', a: 'Coins that are UK legal tender: sovereigns, half and quarter sovereigns, double sovereigns, £5 gold coins and Britannias, gold or silver. They count as sterling currency, which is not a chargeable asset. Foreign coins such as Krugerrands, Maple Leafs and American Eagles do not have this exemption.' },
    { q: 'How does the {chattel} limit work for jewellery?', a: 'If you sell an item, or a set sold together, for {chattel} or less, the profit on it is tax-free. If you sell it for more, the profit that can be taxed is capped: it is never more than five thirds of the part of the price above {chattel}. Sold for £7,000, for example, at most £1,667 of the profit can be taxed. From a sale price of {chattel.upper} upwards the cap no longer helps, so the whole profit counts.' },
    { q: 'Can I use a loss on gold against other gains?', a: 'A loss on a chargeable asset can usually be set against gains, but with chattels the loss is restricted: if you sell for less than {chattel}, the loss is worked out as if you had sold for {chattel}. Losses on UK legal tender coins cannot be claimed at all, since those coins are outside the tax.' },
  ],
  body: (h) => {
    const ex = (kind: 'chattel' | 'uk-coin' | 'foreign-coin', s: number, c: number) => cgt({ kind, proceeds: s, cost: c, taxableIncome: 30000 });
    const rows: Array<[string, 'chattel' | 'uk-coin' | 'foreign-coin', number, number]> = [['Ring sold for £5,500', 'chattel', 5500, 1500], ['Necklace sold for £8,000', 'chattel', 8000, 3000], ['100 g bar sold for £12,000', 'chattel', 12000, 6000], ['20 sovereigns sold for £18,000', 'uk-coin', 18000, 9000], ['5 Krugerrands sold for £15,000', 'foreign-coin', 15000, 8000]];
    return `
<h2>Three kinds of gold, three answers</h2>
<h3>British coins: never taxed</h3>
<p><strong>Sovereigns and Britannias are never taxed when you sell them.</strong> They are legal British money, and ${h.src('tcga21', 'the tax law')} says British money is outside Capital Gains Tax, so selling them produces neither a taxable profit nor a loss you can claim. This is the best-known tax advantage of British gold coins and the reason many investors prefer them to bars.</p>
<h3>Jewellery, bars and scrap: free up to {chattel}</h3>
<p><strong>A piece sold for {chattel} or less is free of tax.</strong> The law calls jewellery, bars and scrap “chattels”, meaning personal belongings you can pick up and move, and ${h.src('govChattels', 'the government’s guidance')} lists jewellery and coins among them. ${h.src('tcga262', 'The rule')} gives two reliefs. A profit on a piece sold for {chattel} or less is not taxed. Sold for more, only part of the profit can be taxed: at most five thirds of the part of the price above {chattel} (for a sale at £7,000, at most £1,667), so a sale just over the limit is only lightly taxed; ${h.src('govChattelsGain', 'the government shows a worked example')}. A set sold to the same person, or to people connected to each other, counts as one piece, so splitting a set between sales does not multiply the limit.</p>
<h3>Foreign coins: taxed like jewellery</h3>
<p>Krugerrands, Maple Leafs, Eagles and Philharmonics are money in their own countries, but not British money, and ${h.src('cg78300', 'HMRC, the UK tax office,')} says foreign money can be taxed. As coins, they also fall within the personal possessions rules, so the {chattel} limit applies to each sale. Larger sales are taxed like any other gain.</p>

<h2>Worked examples</h2>
<p><strong>Below {chattel} a sale is tax-free; just above it, only a small part of the profit is taxed.</strong></p>
<p>Each line takes the profit, keeps only the part the law lets be taxed, takes off the tax-free allowance of {cgt.allowance}, and taxes what is left at {cgt.basic}.</p>
${h.table(['Sale', 'Profit', 'Profit that can be taxed', 'Minus tax-free allowance', 'Left to tax', 'Tax'], rows.map(([l, k, s, c]) => { const r = ex(k, s, c); const none = r.rule === 'out-of-scope' || r.rule === 'chattel-exempt'; return [l, h.gbp(r.rawGain), r.rule === 'out-of-scope' ? 'None: British coins' : none ? 'None: sold for {chattel} or less' : h.gbp(r.gain), none ? '–' : `− ${h.gbp(r.allowanceUsed)}`, none ? '–' : h.gbp(r.taxable), h.gbp(r.tax)]; }), 'Income of £30,000 a year after the part you pay no income tax on, no other profits in the tax year; costs in the examples are made up for illustration.')}

<h2>The rates and allowance for {taxYear}</h2>
<p><strong>The first {cgt.allowance} of profit each year is tax-free; the rest is taxed at {cgt.basic} or {cgt.higher}.</strong> Every person has this ${h.src('govCgtAllowance', 'tax-free allowance')}. Profits above it are added to your income for the year. As long as your income plus that profit stays under {cgt.band}, counted after the part of your income you pay no income tax on, the profit is taxed at {cgt.basic}; any part above is taxed at {cgt.higher} (${h.src('govCgtRates', 'the rates')}). That is why the calculator asks for your income: it only decides which rate applies. It assumes you have no other gains in the year; if you do, the allowance may already be used.</p>

<h2>What you can deduct</h2>
<p><strong>Your profit is the sale price minus what the gold cost you and the costs of selling.</strong> The cost is what you paid, including what the dealer charged above the gold value and any VAT you could not get back. For gold you inherited, it is the value at the date of death; for a gift, usually the market value when you received it. Costs of selling, such as auction fees or valuation fees, are deductible too. Keep receipts: without them HMRC can question the cost you use. The ${h.a('inherited', 'inherited gold page')} covers estates in more detail.</p>

<h2>Reporting</h2>
<p><strong>A small, tax-free sale usually needs no paperwork.</strong> If your profits are within the {cgt.allowance} tax-free allowance and your total sales are within HMRC’s reporting limits, you may not need to report. Otherwise, gains are reported through Self Assessment (the yearly online tax return) or the other routes GOV.UK describes, by the deadlines it sets. This page gives the general rules; a tax adviser can confirm how they apply to your case.</p>
`;
  },
});

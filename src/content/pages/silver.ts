import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'silver', group: 'silver', order: 40, tool: 'silver', toolProps: { fineness: 999, unit: 'g', grams: 100 }, kind: 'outil',
  related: ['sterling-silver', 'silver-britannia', 'platinum', 'vat'], sources: ['hallmarkSch2', 'ukWeights', 'vatNotice70121'],
  slug: 'silver-price-per-gram', nav: 'Silver price per gram', card: 'Silver by gram, ounce and kilo at each hallmark standard',
  title: 'Price of Silver UK Today: per Gram and per Ounce in £',
  description: 'Silver price per gram, ounce and kilo in pounds at the live, timed spot price for 999, Britannia 958, sterling 925 and 800 silver, with hallmark rules.',
  h1: 'Price of silver today: per gram and per ounce, in pounds',
  resume: 'The spot price (the price traders use for pure metal) of silver is the price of a troy ounce (31.1 g) of pure silver, and this calculator reads it in pounds from gold-api.com, shows when it was set, and turns it into a price per gram, per ounce and per kilo at any of the four standards UK hallmarking law allows for silver: 999, 958.4 (Britannia), 925 (sterling) and 800. Choose the standard, type a weight in grams, ounces or kilos, and you get the metal value. Silver is far cheaper than gold by weight, so heavy items such as trays, candlesticks and cutlery sets can still be worth real money, while a buyer’s fixed costs take a larger share of a small lot. Silver bought from a dealer carries VAT, unlike investment gold. Gold by Carat is an independent site, not a silver buyer or a dealer, and shows no buying prices.',
  faqs: [
    { q: 'How much is a gram of silver worth?', a: 'A gram of pure silver is worth the spot price of an ounce divided by {oz2}. Sterling silver contains 925 thousandths of that, so a gram of sterling is worth 92.5% of a gram of pure silver. The calculator shows both at the price of the moment, with the time.' },
    { q: 'Do I pay VAT when buying silver bars or coins?', a: 'Yes. The VAT exemption for investment gold does not cover silver, so silver bars and most silver coins bought from a UK dealer carry VAT at the standard rate of {vat}. That makes the gap between buying and selling prices much wider than for gold.' },
    { q: 'What weight of silver needs a hallmark?', a: 'Under UK hallmarking law, silver articles under {hm.silver} are exempt. Above that weight, an item sold in the UK as silver must carry a hallmark from an assay office. Many small items such as rings and earrings fall below the limit and carry only a maker’s stamp, or nothing.' },
  ],
  body: (h) => {
    const rows = h.P.silver.map((f) => [f === 925 ? '925 sterling' : f === 958.4 ? '958.4 Britannia' : String(f), h.live(h.at(1, f, 'XAG'), 'XAG', 'gbp2'), h.live(h.at(31.1034768, f, 'XAG'), 'XAG', 'gbp2'), h.live(h.at(1000, f, 'XAG'), 'XAG')]);
    return `
<h2>Silver price per gram and per ounce, by standard</h2>
${h.table(['Standard', 'Per gram', 'Per troy oz', 'Per kg'], rows, `Worked out at the same silver price as the calculator above (${h.whenOf('XAG')}).`)}

<h2>The four silver standards</h2>
<p>${h.src('hallmarkSch2', 'UK hallmarking law')} sets four standards of fineness (the share of pure metal) for silver: 800, 925, 958.4 and 999. Sterling, 925, is by far the most common on British silver. Britannia silver, 958.4, is a richer standard used on some antique and modern pieces and is not the same as the Britannia coin. 999 is used for bullion and some modern jewellery. 800 is the lowest of the four.</p>

<h2>Weight, buying and selling</h2>
<p>At silver prices, the difference between a guessed and a measured weight is worth more attention than the difference between buyers. Weigh in grams. Remove anything that is not silver: the steel blades of table knives, the weighted bases of candlesticks (often filled with pitch or plaster), wooden handles, glass liners. A buyer will either remove them or estimate them, and you want to know which.</p>
<p>Silver plate (EPNS) is a thin coat of silver over a base metal. It has almost no metal value and is not covered by this calculator.</p>

<p>The investment gold VAT exemption in ${h.src('vatNotice70121', 'the UK tax office’s VAT guidance')} does not extend to silver, so silver from a UK dealer is sold with VAT at {vat}. When you sell, no VAT is due on a private sale, but the buyer pays you below spot. The ${h.a('silver-britannia', 'silver Britannia page')} covers the coin, and the ${h.a('sterling-silver', 'sterling silver page')} covers cutlery and hallmarked pieces.</p>
<p>${h.a('hallmarks', 'Not sure what the number stamped on a piece means? Read the hallmark guide →')}</p>
`;
  },
});

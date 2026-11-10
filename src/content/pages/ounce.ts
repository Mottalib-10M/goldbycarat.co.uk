import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'ounce', group: 'gold', order: 16, tool: 'units', toolProps: { unit: 'oz', ct: 24 }, kind: 'outil',
  related: ['carat-24', 'gold-bar', 'britannia', 'tola'], sources: ['ukWeights'],
  slug: 'gold-price-per-ounce', nav: 'Gold price per ounce', card: 'Troy ounce in pounds, converted to grams, kilos and grains',
  title: 'Gold Price per Ounce in Pounds: Troy Ounce to Grams UK',
  description: 'Gold price per troy ounce in pounds at the live spot price, timed, in grams and kilos too; why a troy ounce is 31.1 g, not the 28.35 g ounce of a kitchen.',
  h1: 'Gold price per ounce in pounds',
  resume: 'Gold is priced by the troy ounce (31.1 g), which UK weights law defines as {oz} grams, about 10% heavier than the 28.35 g avoirdupois ounce used for food. The spot price (the price traders use for pure metal) shown here is the price of one troy ounce of pure gold in pounds, read from gold-api.com with the time it carries, and the calculator converts any quantity in troy ounces, grams, kilograms or tolas into its metal value at the carat you choose. Use it to check a coin or bar listed by the ounce, a price quoted in dollars per ounce converted elsewhere, or simply how much a kilo bar is worth. Because the ounce is fixed in law, the conversions never change: only the price does. Gold by Carat is an independent site, not a gold buyer or a dealer, and nothing you type is sent anywhere.',
  faqs: [
    { q: 'How many grams are in a troy ounce of gold?', a: 'Exactly {oz} grams. The Weights and Measures Act 1985 defines the troy ounce as 0.0311034768 kilograms, and it is used for precious metals only. A kilogram therefore holds about 32.15 troy ounces, and a one ounce Britannia contains {oz2} g of fine gold.' },
    { q: 'Why is the gold ounce different from a normal ounce?', a: 'The ordinary, avoirdupois ounce is one sixteenth of a pound, about 28.35 g. The troy ounce comes from an older system kept for precious metals and is 480 grains, against 437.5 grains for the avoirdupois ounce. Weighing gold on kitchen scales set to ounces gives the wrong unit; switch them to grams.' },
    { q: 'Is the price per ounce on this page in pounds or dollars?', a: 'In pounds. gold-api.com publishes the spot price in several currencies and this site asks for sterling directly, so there is no exchange rate to apply. The figure moves with both the dollar gold price and the pound, which is why it can change even on a day the dollar price is flat.' },
  ],
  body: (h) => {
    const rows = [0.1, 0.25, 0.5, 1, 2, 5, 10, 32.1507].map((oz) => [oz === 32.1507 ? '1 kg (32.15 oz)' : `${oz} oz`, h.num(oz * 31.1034768, 2) + ' g', h.live(h.at(oz * 31.1034768, 1000), 'XAU'), h.live(h.at(oz * 31.1034768, 916.6), 'XAU')]);
    return `
<h2>Ounces of gold in pounds</h2>
${h.table(['Troy ounces', 'Grams', 'Pure gold', '22ct'], rows, `Worked out at the same gold price as the calculator above (${h.when}). Pure gold shown at 1,000 thousandths, the basis of the spot price.`)}

<h2>The troy ounce in law</h2>
<p>${h.src('ukWeights', 'UK weights law')} defines the troy ounce as 0.0311034768 kg and the grain as 1/7,000 of a pound of 0.45359237 kg, which makes {grain} g. A troy ounce is 480 grains. These figures are exact by definition, so any conversion on this site is exact too; the only rounding is in how many decimals we show.</p>
<p>In the shop and on the internet, “ounce” on gold always means troy ounce. On a coin, the ounce refers to the gold it contains, not to the coin. A 1 oz Britannia at 999.9 is almost all gold; a 1 oz Krugerrand at 916.7 must weigh about ${h.num(31.1034768 / 0.9167, 1)} g in total by arithmetic, because the rest of the coin is alloy metal.</p>

<h2>From the ounce price to everything else</h2>
<p>Divide the ounce price by {oz2} and you have the price of a gram of pure gold. Multiply by the fineness (the share of pure metal) and you have any carat: {f.9} thousandths for 9ct, {f.18} for 18ct. A buyer’s per-gram offer for 9ct can be checked against the ounce price this way in a few seconds, and the ${h.a('home', 'carat table on the home page')} does it for every standard at once.</p>
<p>If a dealer lists a bar or coin by the ounce, the ${h.a('gold-bar', 'gold bar page')} and the ${h.a('britannia', 'Britannia page')} show its metal value and the premium (what a dealer charges above the metal value) over spot.</p>
`;
  },
});

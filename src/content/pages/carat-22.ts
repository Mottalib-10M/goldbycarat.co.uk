import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'carat-22', group: 'gold', order: 13, tool: 'carat', toolProps: { ct: 22, grams: 10 }, kind: 'outil',
  related: ['sovereign', 'carat-21', 'carat-24', 'scrap'], sources: ['hallmarkSch1', 'hallmarkSch2', 'coinageAct'],
  slug: '22ct-gold-price', nav: '22ct gold price', card: '916 on the stamp: value per gram of 22ct jewellery and coins',
  title: '22ct Gold Price per Gram UK: Value of 916 Gold Today',
  description: '22ct gold price per gram in pounds at the live, timed spot price: 916.6 thousandths of gold, value of bangles and chains by weight, and the share an offer pays.',
  h1: '22ct gold price per gram',
  resume: '22ct gold is almost all gold, eleven parts in twelve, and the number stamped on it is 916. Type the weight of your piece below to see what the gold in it is worth today. UK hallmarking law sets it at {f.22} thousandths (parts in 1,000) of pure gold, which makes it the richest alloy commonly worn as jewellery in Britain. Wedding sets, bangles and necklaces from South Asian families are very often 22ct, and so is the sovereign, whose gold the law on coins sets at eleven twelfths. The calculator multiplies the weight you type by {f.22} thousandths and by the spot price (the price traders use for pure metal) of a gram of gold, derived from the troy ounce (31.1 g) price in pounds published by gold-api.com, with the time of that price beside the result. Heavy 22ct pieces carry a lot of value per gram, so a few percentage points on an offer are worth a lot of money. Gold by Carat is an independent site, not a gold buyer or a dealer, and does not quote buying prices.',
  faqs: [
    { q: 'Why is 22ct sometimes written 916 and sometimes 916.6?', a: 'The legal standard in the Hallmarking Act is 916.6 thousandths, and the hallmark punch shows 916. Twenty-two twenty-fourths is 916.67, so the legal figure is a fraction lower than the arithmetic one. This site values 22ct jewellery at {f.22}, the minimum a hallmarked piece must contain.' },
    { q: 'Is a 22ct bangle from India hallmarked in the UK?', a: 'It may carry the Indian BIS mark and a 916 stamp, which is not a British hallmark. If it was sold as gold by a UK trader it should have been hallmarked here, unless it is exempt. When you sell, a buyer will usually test it. A piece that tests at 916 or above is paid as 22ct.' },
    { q: 'How heavy is a typical set of 22ct bangles?', a: 'There is no typical weight, and guessing is costly at 22ct prices. Weigh each bangle separately on scales that read to 0.1 g. Hollow bangles can weigh far less than solid ones of the same size, and some have wax or lac inside to stiffen them, which adds weight that is not gold.' },
  ],
  body: (h) => {
    const rows = [5, 10, 20, 40, 50, 100].map((g) => [`${g} g`, h.num(g * 0.9166, 2) + ' g', h.live(h.at(g, 916.6), 'XAU')]);
    return `
<h2>22ct gold price by weight</h2>
${h.table(['Weight of 22ct', 'Pure gold inside', 'Metal value'], rows, `Worked out at the same gold price as the calculator above (${h.when}).`)}
<p>Weights in this table run higher than on the 9ct and 18ct pages because 22ct is usually sold by weight in sets: a bangle can weigh more than a whole box of 9ct chains.</p>

<h2>Jewellery standard and coin standard</h2>
<p>${h.src('hallmarkSch2', 'UK hallmarking law')} sets the 22ct standard at 916.6 thousandths. The ${h.src('coinageAct', 'law on coins')} defines the sovereign as eleven twelfths fine gold, which is 916.66. On a 20 g bangle the difference is less than a penny, so for value purposes a 22ct bangle and a sovereign are the same alloy. What separates them is certainty: a sovereign’s weight is fixed by law at {sov.g}, so its gold content is known, while a bangle has to be weighed and, if it has no British hallmark, tested. The ${h.a('sovereign', 'sovereign page')} values coins directly.</p>

<h2>Things that are not gold in 22ct jewellery</h2>
<p>Traditional pieces sometimes contain lac, wax or resin to give hollow bangles their stiffness, coloured enamel (meenakari) on the surface, or glass and stones set in kundan work. All of it weighs something. A buyer that melts the piece will deduct it, and an honest one will show you how. Before you sell a set with a lot of decoration, ask whether the buyer can give a figure for the gold after deductions, and compare that with your own weight.</p>
<p>${h.a('scrap', 'Several pieces of different carats? Value them together →')}</p>
<p>For a mixed lot of 22ct, 18ct and 9ct, enter each weight in the lot calculator above. If a piece was bought abroad and marked 21ct, the ${h.a('carat-21', '21ct page')} explains why that is not a UK standard.</p>
`;
  },
});

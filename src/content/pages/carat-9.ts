import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'carat-9', group: 'gold', order: 10, tool: 'carat', toolProps: { ct: 9, grams: 10 }, kind: 'outil',
  related: ['offer', 'scrap', 'carat-18', 'hallmarks'], sources: ['hallmarkSch1', 'hallmarkSch2', 'ukWeights'],
  slug: '9ct-gold-price', nav: '9ct gold price', card: '375 parts gold in 1,000: value per gram and by weight at today’s price',
  title: '9ct Gold Price per Gram UK: Value of 375 Gold Today',
  description: '9ct gold price per gram in pounds at the live spot price, with the time shown: 375 thousandths of gold, value by weight, and the share an offer really pays.',
  h1: '9ct gold price per gram',
  resume: '9ct gold is just over a third pure gold: 9 parts in 24, which is the 375 stamped on it. Type the weight of your piece below to see what the gold in it is worth today. UK hallmarking law sets 9ct at exactly {f.9} parts in 1,000, so its value is 0.375 times the price of a gram of pure gold, and a gram of pure gold is the price of one ounce divided by {oz2}, the weight of that ounce in grams. The calculator reads that price in pounds from gold-api.com and shows when it was set, then multiplies it by the weight you type. The result is the metal in your 9ct chain, ring or bracelet, before any buyer’s costs. Type the offer you were given and it shows what share of that metal the offer pays, which is the one figure buyers rarely print. This page is published by an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'Why is 9ct gold so much cheaper per gram than 18ct?', a: 'Because it contains half as much gold. A gram of 9ct is {f.9} parts gold in 1,000 and the rest is mostly silver and copper, which are worth little next to gold. A gram of 18ct is {f.18} parts in 1,000, so at any gold price it is worth exactly twice as much as 9ct, give or take nothing.' },
    { q: 'Is 9ct gold real gold?', a: 'Yes. It is a gold alloy and the lowest standard that can be hallmarked as gold in the UK. An item stamped 375 with the symbol of a UK testing office has been tested and contains at least {f.9} parts gold in 1,000. Some countries do not call 9ct gold at all, so a buyer abroad may treat it differently, but in Britain it is gold in law.' },
    { q: 'How do I weigh 9ct gold at home accurately enough?', a: 'Use digital kitchen or jewellery scales that read to 0.1 g, set them to zero with nothing on them, then weigh each item separately. Remove anything that is not gold, such as a watch movement or a leather cord. For rings with stones the weight will overstate the gold, so treat the result as a ceiling.' },
  ],
  body: (h) => {
    const rows = [1, 2, 5, 10, 20, 50, 100].map((g) => [`${g} g`, h.num(g * 0.375, 3) + ' g', h.gbp(h.at(g, 375))]);
    return `
<h2>9ct gold value by weight</h2>
${h.table(['Weight of 9ct', 'Pure gold inside', 'Metal value'], rows, `Example worked out at the gold price of ${h.when}; the calculator above uses the price of the moment.`)}
<p>The table is useful for a quick check against a quote, because most offers for 9ct come as a price per gram. Divide the per-gram offer by the per-gram metal value and you have the share. Or type both into the calculator and let it divide.</p>

<h2>Where the 375 comes from</h2>
<p><strong>9 parts in 24 is exactly 375 parts in 1,000, so for 9ct the sum and the law agree.</strong> UK hallmarking law ${h.src('hallmarkSch1', 'links each number to a carat')} and ${h.src('hallmarkSch2', 'lists 375')} among the six numbers allowed on gold. An article marked 375 must contain at least that proportion, measured across the whole piece including solder, so a well-made 9ct item usually holds a fraction more, never less.</p>

<h2>What a buyer does with your 9ct gold</h2>
<p><strong>A buyer will offer less than the value above, because it has to melt and refine your gold.</strong> A scrap buyer does not resell your ring; it sells the metal to a refiner, which melts it, separates the gold from the silver and copper and pays for the gold it recovers. Every step costs money, and with 9ct the buyer handles nearly three grams of alloy for every gram of gold. That is one reason 9ct offers tend to be a smaller share of the metal than offers for 22ct, but the gap is set by each buyer, not by any rule. Only a comparison of several quotes, each turned into a percentage, tells you whether one is fair.</p>
<p>A second-hand jeweller may pay more than the metal for a piece it can sell as it is, such as a signed or antique item. If yours might fall into that category, ask for a valuation as jewellery as well as a scrap price.</p>

<h2>Checking the mark</h2>
<p>Look for “375” in an oval frame next to the symbol of a testing office: ${h.P.assayOffices.map((o) => `${o.mark} (${o.city})`).join(', ')}. Items under {hm.gold} of gold are exempt and may carry nothing. A stamp reading “9K” or “9ct” alone, with no office mark, is not a British hallmark. The ${h.a('hallmarks', 'hallmark guide')} explains each part.</p>
<p>Already have an offer? Type it in the “Offer you were given” box at the top of this page to see what share of the gold it pays, or use the ${h.a('offer', 'offer checker')} to compare several quotes. If you are selling a mixed lot of 9ct and 18ct, the ${h.a('scrap', 'scrap gold calculator')} values each carat separately and adds them up.</p>
`;
  },
});

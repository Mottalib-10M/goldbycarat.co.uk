import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'carat-14', group: 'gold', order: 11, tool: 'carat', toolProps: { ct: 14, grams: 10 }, kind: 'outil',
  related: ['carat-converter', 'carat-9', 'carat-18', 'offer'], sources: ['hallmarkSch1', 'hallmarkSch2'],
  slug: '14ct-gold-price', nav: '14ct gold price', card: '585, not 583: the UK standard for 14ct and its value per gram',
  title: '14ct Gold Price per Gram UK: 585 Gold Value in Pounds',
  description: '14ct gold price per gram in pounds at the live spot price: why the UK standard is 585 and not 583, value by weight, and what share of the metal an offer pays.',
  h1: '14ct gold price per gram',
  resume: '14ct gold is a little over half pure gold, and the number stamped on it is 585. Type the weight of your piece below to see what the gold in it is worth today. It is valued here at {f.14} thousandths of pure gold, the standard written into UK hallmarking law, rather than the 583.3 that fourteen twenty-fourths would give. The law rounds 14ct up to 585 so that a piece marked 585 always contains at least what the mark says. The calculator multiplies that fineness by the spot price of gold in pounds, read from gold-api.com with its time shown, and by the weight you type, so you see the metal value of a 14ct chain, ring or watch case. 14ct is far less common in Britain than 9ct or 18ct, and much of it comes from North America or continental Europe, so a buyer may want to test it before quoting. Gold by Carat is not a gold buyer or a dealer: it shows the metal value and the share an offer pays.',
  faqs: [
    { q: 'Why does 14ct gold say 585 and not 583?', a: 'Fourteen twenty-fourths is 583.3 thousandths, but the hallmarking standard is 585. Setting the legal figure slightly above the arithmetic one means an item marked 585 is guaranteed to hold at least 14ct worth of gold. This site values 14ct at 585 because that is what a hallmarked piece must contain.' },
    { q: 'My 14K ring was bought in the United States. Is it 14ct in the UK?', a: 'The K and ct both mean carat. Whether the ring meets the British 585 standard is another matter: an item made to a lower tolerance abroad could fall short. A UK assay office would only hallmark it at 585 if it tests at 585 or more, and a buyer here will usually test it before paying.' },
    { q: 'Is 14ct gold worth more than 9ct?', a: 'Per gram, yes: it contains {f.14} thousandths of gold against {f.9}, so it is worth about 1.56 times as much as 9ct of the same weight. It is worth about 78% of 18ct. These ratios hold at any spot price, because only the proportion of gold changes.' },
  ],
  body: (h) => {
    const rows = [1, 2, 5, 10, 20, 50].map((g) => [`${g} g`, h.gbp(h.at(g, 585)), h.gbp(h.at(g, 583.3)), h.gbp(h.at(g, 585) - h.at(g, 583.3))]);
    return `
<h2>14ct value by weight, and the 585 question</h2>
${h.table(['Weight', 'At 585 (UK standard)', 'At 583.3 (14/24)', 'Difference'], rows, `Example worked out at the gold price of ${h.when}.`)}
<p>The difference between the two columns is small, a few pence on a ring, and that is the point: the legal standard is a floor, set just above the arithmetic, so a hallmarked 585 article never contains less gold than 14 carats. ${h.src('hallmarkSch2', 'UK hallmarking law')} lists 585 among the standards for gold, and ${h.src('hallmarkSch1', 'the hallmarking law')} maps 14 carat to it.</p>

<h2>Where 14ct turns up in Britain</h2>
<p>British jewellers have long worked in 9ct, 18ct and 22ct, so 14ct items tend to have a story: a ring bought on holiday, a watch case from the United States, a chain inherited from family abroad. Many carry “14K” or “585” stamped by the maker but no British assay office mark. That does not make them less valuable, but it does make the fineness a claim rather than a tested fact, and a buyer here will check it with acid or an X-ray fluorescence scanner. If it tests below 585, it will be paid at what it contains.</p>

<h2>From value to offer</h2>
<p>Most buyers do not quote 14ct separately; they either quote per gram of 9ct, 18ct and 22ct or test and quote per gram of fine gold. If you are offered a fine-gold price, multiply it by 0.585 to compare it with the gram price above. If you are offered a lump sum, type it in the calculator’s offer field and you will see what share of the metal it pays. The ${h.a('carat-converter', 'carat converter')} handles unusual carats such as 15ct or 12ct, which are not UK standards but appear on older pieces.</p>
<!--tool:compare-->
<p>Comparing two or three quotes as percentages is the fastest way to see whether one is out of line. The ${h.a('offer', 'offer checker')} does it for a single quote.</p>
`;
  },
});

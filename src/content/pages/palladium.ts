import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'palladium', group: 'silver', order: 44, tool: 'pgm', toolProps: { metal: 'XPD', fineness: 950, grams: 6 }, kind: 'outil',
  related: ['platinum', 'carat-18', 'hallmarks', 'silver'], sources: ['hallmarkSch1', 'hallmarkSch2'],
  slug: 'palladium-price-per-gram', nav: 'Palladium price per gram', card: 'Palladium 500, 950 and 999: value per gram and by weight',
  title: 'Palladium Price per Gram UK: 950 Palladium Value in £',
  description: 'Palladium price per gram in pounds at the live, timed spot price for the 500, 950 and 999 UK hallmark standards; value a palladium wedding band by its weight.',
  h1: 'Palladium price per gram in pounds',
  resume: 'Palladium is the youngest of the four precious metals in British hallmarking: UK hallmarking law was amended to give it its own standards, and an assay office (an official testing office) now marks it at 500, 950 or 999 thousandths (parts in 1,000). This calculator reads the spot price (the price traders use for pure metal) of a troy ounce (31.1 g) of palladium in pounds from gold-api.com, shows when it was set, and gives the price per gram at each standard and the metal value of a piece of the weight you type. Palladium is used for wedding bands, as an alloy in white gold, and in some bullion coins and bars. It is lighter than platinum, so a palladium band weighs less than a platinum one of the same size. Pieces under {hm.palladium} are exempt from hallmarking. Gold by Carat is an independent site, not a palladium buyer or a dealer.',
  faqs: [
    { q: 'Is palladium a precious metal in UK law?', a: 'Yes. UK hallmarking law lists palladium alongside gold, silver and platinum, with its own standards of fineness and its own exemption weight of {hm.palladium}. An item sold as palladium above that weight must be hallmarked by an assay office.' },
    { q: 'Is palladium in white gold worth anything extra?', a: 'Not to a scrap buyer. White gold is valued for its gold content, set by the carat. The palladium in the alloy is a small proportion and refiners do not normally pay for it separately. Only items hallmarked as palladium are valued for palladium.' },
    { q: 'Why is palladium priced so differently from platinum?', a: 'They are separate markets with different uses and supply, so their prices move independently. Neither is reliably dearer than the other. The table on this page shows both at the moment the page was built, and the calculator reads the live palladium price.' },
  ],
  body: (h) => {
    const rows = h.P.palladium.map((f) => [String(f), h.live(h.at(1, f, 'XPD'), 'XPD', 'gbp2'), h.live(h.at(5, f, 'XPD'), 'XPD'), h.live(h.at(10, f, 'XPD'), 'XPD')]);
    return `
<h2>Palladium price per gram, by standard and weight</h2>
${h.table(['Standard', 'Per gram', '5 g', '10 g'], rows, `Worked out at the same palladium price as the calculator above (${h.whenOf('XPD')}).`)}
<p>When this page was built (${h.recorded}), a troy ounce of palladium was ${h.gbp(h.at(31.1034768, 1000, 'XPD'))} against ${h.gbp(h.at(31.1034768, 1000, 'XPT'))} for platinum and ${h.gbp(h.at(31.1034768, 1000))} for gold; the calculator above gives the palladium price of the moment.</p>

<h2>The legal standards</h2>
<p>${h.src('hallmarkSch2', 'UK hallmarking law')} lists three standards for palladium: ${h.P.palladium.join(', ')}. ${h.src('hallmarkSch1', 'The hallmarking law')} exempts palladium articles under {hm.palladium}. A piece marked 500 holds half the palladium of a 999 piece of the same weight, so the standard matters as much as the scales.</p>

<h2>Selling palladium</h2>
<p>Not every high street buyer quotes for palladium, so you may need to ask specifically or use a dealer in metal bars and coins or a refiner. Check that the buyer has identified the metal correctly from the hallmark: 950 could be palladium or platinum, and only the assay office mark next to it tells you which. Then compare the per-gram offer with the value per gram above.</p>
<p>The ${h.a('platinum', 'platinum page')} covers the other white precious metal, and the ${h.a('hallmarks', 'hallmark decoder')} values any piece from its mark and weight.</p>
`;
  },
});

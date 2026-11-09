import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'platinum', group: 'silver', order: 43, tool: 'pgm', toolProps: { metal: 'XPT', fineness: 950, grams: 5 }, kind: 'outil',
  related: ['palladium', 'carat-18', 'hallmarks', 'silver'], sources: ['hallmarkSch1', 'hallmarkSch2'],
  slug: 'platinum-price-per-gram', nav: 'Platinum price per gram', card: '850 to 999 platinum: value of rings and pieces by weight',
  title: 'Platinum Price per Gram UK: 950 Platinum Value in Pounds',
  description: 'Platinum price per gram in pounds at the live, timed spot price for the 850, 900, 950 and 999 hallmark standards; value a platinum ring or band by its weight.',
  h1: 'Platinum price per gram in pounds',
  resume: 'Platinum jewellery in Britain is hallmarked at one of four standards set by UK hallmarking law: 850, 900, 950 or 999 thousandths. This calculator reads the spot price of a troy ounce of platinum in pounds from gold-api.com, shows when it was set, and gives the value per gram at each standard and the metal value of a piece of the weight you type. Platinum wedding bands and engagement rings are dense and heavy for their size, so a plain band can hold several grams. Platinum has at times been dearer than gold and at times much cheaper; the calculator always uses the price of the moment rather than any assumption about which is worth more. Platinum items under {hm.platinum} are exempt from hallmarking. Gold by Carat is an independent site, not a platinum buyer or a dealer, and quotes no buying prices.',
  faqs: [
    { q: 'Is platinum worth more than gold?', a: 'It depends on the day. The two metals are priced separately and their prices have crossed over the years. At today’s prices, the comparison is in the table on this page; the calculator uses the live price for each metal when you open it.' },
    { q: 'What does 950 on a platinum ring mean?', a: 'It means the ring contains at least 950 thousandths platinum, one of the four British platinum standards, which run from 850 to 999. Next to it you should see an assay office mark and a sponsor’s mark. The platinum symbol, an orb, may appear too as a traditional mark.' },
    { q: 'Do scrap buyers pay for platinum?', a: 'Some do, and quotes vary more than for gold. Some test platinum separately and quote per gram at 950. Make sure the buyer has recognised it as platinum: a white metal ring can also be white gold or palladium, which have very different values. A hallmark settles the question.' },
  ],
  body: (h) => {
    const rows = h.P.platinum.map((f) => [String(f), h.live(h.at(1, f, 'XPT'), 'XPT', 'gbp2'), h.live(h.at(5, f, 'XPT'), 'XPT'), h.live(h.at(10, f, 'XPT'), 'XPT')]);
    return `
<h2>Platinum by standard and weight</h2>
${h.table(['Standard', 'Per gram', '5 g', '10 g'], rows, `Worked out at the same platinum price as the calculator above (${h.whenOf('XPT')}).`)}
<p>For comparison, when this page was built (${h.recorded}), a troy ounce of gold was ${h.gbp(h.at(31.1034768, 1000))} and a troy ounce of platinum ${h.gbp(h.at(31.1034768, 1000, 'XPT'))}; the calculator above gives the platinum price of the moment.</p>

<h2>The legal standards</h2>
<p>${h.src('hallmarkSch2', 'UK hallmarking law')} sets four standards for platinum: ${h.P.platinum.join(', ')}. Platinum articles weighing less than {hm.platinum} are exempt under ${h.src('hallmarkSch1', 'the hallmarking law')}, half the limit for gold.</p>

<h2>Telling white metals apart</h2>
<p>White gold, platinum and palladium look alike. White gold is gold alloyed with white metals and often rhodium-plated; its hallmark is a gold standard such as 375, 585 or 750. Platinum carries 850 to 999 with a platinum assay mark, palladium 500, 950 or 999. Platinum is noticeably heavier than the others for the same size. If a ring has no mark, a buyer will test it. The ${h.a('hallmarks', 'hallmark guide')} shows each mark, and the ${h.a('palladium', 'palladium page')} and ${h.a('carat-18', '18ct page')} value the alternatives.</p>
<!--tool:offer-->
<p>The offer checker above works for gold; for a platinum quote, compare the per-gram offer with the per-gram value in the table.</p>
`;
  },
});

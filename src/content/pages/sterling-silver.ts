import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'sterling-silver', group: 'silver', order: 41, tool: 'silver', toolProps: { fineness: 925, unit: 'g', grams: 500 }, kind: 'outil',
  related: ['silver', 'hallmarks', 'scrap', 'inherited'], sources: ['hallmarkSch2', 'hallmarkSch1', 'bhcConsumer'],
  slug: 'sterling-silver-value', nav: 'Sterling silver value', card: 'Value of 925 cutlery, trays and jewellery by weight',
  title: 'Sterling Silver Value per Gram: Scrap 925 Silver in £',
  description: 'Sterling silver value per gram in pounds at the live silver price, timed: 925 cutlery, trays and jewellery by weight, what is not silver, the lion mark.',
  h1: 'Sterling silver value per gram',
  resume: 'Sterling silver is 925 thousandths silver, the standard set in UK hallmarking law, and its metal value is its weight times 0.925 times the price of a gram of pure silver. This calculator reads the silver spot price in pounds from gold-api.com, shows when it was set, and does that sum for any weight you type. Sterling is the silver of British cutlery, tea sets, trays, trophies and most silver jewellery, and inherited pieces can be heavy, so the total can be substantial even though silver is cheap by the gram. The difficulty is the weight: knives have steel blades, candlesticks are filled, and plated items look the same as solid ones. This page explains what to take out of the reckoning and how to tell sterling from plate. Gold by Carat is an independent site, not a silver buyer or a dealer.',
  faqs: [
    { q: 'How do I know if my cutlery is sterling silver or silver plate?', a: 'Look for a hallmark: in Britain, the figures 925, often with a lion passant, next to an assay office mark mean sterling. Silver plate is usually stamped EPNS, A1, or with a maker’s name and no assay office mark. Plated items have almost no metal value.' },
    { q: 'How much silver is in a sterling silver knife?', a: 'Often much less than it weighs. Most table knives have a hollow sterling handle filled with resin or plaster and a steel blade. Buyers usually value only the handle, and some apply a standard deduction. Forks and spoons are normally solid silver and can be weighed as they are.' },
    { q: 'Is sterling silver worth more as antiques than as scrap?', a: 'It can be. Pieces by known makers, early dates or unusual designs may sell above their metal value at auction or to a dealer. Plain modern cutlery and damaged items usually sell for their silver. Ask for both a scrap price and a resale estimate before deciding.' },
  ],
  body: (h) => {
    const rows = [50, 100, 250, 500, 1000, 2000].map((g) => [`${g} g`, h.num(g * 0.925, 0) + ' g', h.live(h.at(g, 925, 'XAG'), 'XAG')]);
    return `
<h2>Sterling silver by weight</h2>
${h.table(['Weight of sterling', 'Pure silver', 'Metal value'], rows, `Worked out at the same silver price as the calculator above (${h.whenOf('XAG')}).`)}

<h2>Reading the mark</h2>
<p>${h.src('hallmarkSch2', 'UK hallmarking law')} sets out the marks an assay office strikes: its own office mark and the standard mark, which for sterling is the figures 925. A lion passant may appear as an optional pictorial mark, or a lion rampant on pieces marked in Edinburgh. Next to them sits the sponsor’s mark, the registered initials of the maker or importer. The ${h.src('bhcConsumer', 'British Hallmarking Council')} reminds buyers that an item described as silver must be hallmarked, subject to the weight exemptions. Silver items under {hm.silver} are exempt from hallmarking under ${h.src('hallmarkSch1', 'the hallmarking law')}, so small rings and earrings may be unmarked.</p>

<h2>What to leave out of the weight</h2>
<ul>
<li>Knives: steel blades and filled handles. Weigh them separately and expect a buyer to discount them.</li>
<li>Candlesticks and some vases: “loaded” bases filled with pitch, resin or plaster.</li>
<li>Teapots and coffee pots: wooden or ivory handles and finials, and insulators.</li>
<li>Dressing table sets: brushes with wooden backs covered in a thin silver sheet.</li>
<li>Anything with glass liners, enamel or stones.</li>
</ul>
<p>Spoons, forks, trays, salvers, bowls and most jewellery are solid and can be weighed as they are.</p>

<h2>From value to offer</h2>
<p>Silver buyers quote per gram of sterling or per troy ounce. Convert to a share of the metal value above and compare buyers on that. The ${h.a('silver', 'silver price page')} shows the other standards, and the ${h.a('hallmarks', 'hallmark guide')} decodes the marks on silver as well as gold. For a family collection, the ${h.a('inherited', 'inherited gold and silver page')} covers the tax rules, which are the same chattel rules as for gold jewellery.</p>
`;
  },
});

import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'carat-21', group: 'gold', order: 12.5, tool: 'carat', toolProps: { ct: 21, grams: 10 }, kind: 'outil',
  related: ['carat-22', 'carat-18', 'hallmarks', 'scrap'], sources: ['hallmarkSch1', 'hallmarkSch2'],
  slug: '21ct-gold-price', nav: '21ct gold price', card: 'Gulf and Middle Eastern gold: value per gram at 875, a guide figure',
  title: '21ct Gold Price per Gram UK: Value of Gulf Gold in £',
  description: '21ct gold price per gram in pounds at the live spot price: 875 thousandths as a guide, why 21ct is not a UK hallmark standard and how buyers here pay for it.',
  h1: '21ct gold price per gram in pounds',
  resume: '21ct gold is seven eighths pure gold, the usual standard for jewellery bought in the Gulf. Type the weight of your piece below to see what the gold in it is worth today. It holds 21 parts of gold in 24, which is 875 thousandths, and this calculator values it on that basis using the spot price of gold in pounds from gold-api.com, with the time of the price shown. 21ct is the everyday standard for jewellery in Saudi Arabia, the Gulf states and much of the Middle East, so many British families own pieces bought there. It is not one of the standards in UK hallmarking law, which runs 375, 585, 750, 916.6, 990 and 999, so a 21ct piece cannot be hallmarked as 21ct here and a buyer will test it before paying. The figure on this page is therefore a guide: the real value is what the test finds. Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'Can I get my 21ct gold hallmarked in the UK?', a: 'Not as 21ct, because 875 is not a British standard. An assay office can only mark an article at a standard it meets, so a 21ct piece could at most be marked 750. Most people selling 21ct do not bother: the buyer tests it and pays for the gold it finds.' },
    { q: 'Do UK buyers pay less for 21ct than for 22ct?', a: 'They pay for the gold content, and 21ct has less of it: 875 against {f.22} thousandths, about 4.5% less by weight. Some buyers quote 21ct separately; others test and quote per gram of fine gold. Either way, convert the offer to a share of the metal with the calculator so the comparison is like for like.' },
    { q: 'Is gold bought in Dubai really 21ct?', a: 'Retail gold in the Gulf is sold under local rules and stamped by the shop or a local authority. Those marks are not checked by a British assay office. Most pieces are what they say, but a test is the only proof. A buyer’s test that comes in below 875 should come with the figure it found.' },
  ],
  body: (h) => {
    const rows = [5, 10, 20, 50, 100].map((g) => [`${g} g`, h.live(h.at(g, 875), 'XAU'), h.live(h.at(g, 916.6), 'XAU'), h.live(h.at(g, 750), 'XAU')]);
    return `
<h2>21ct value by weight, next to its neighbours</h2>
${h.table(['Weight', '21ct (875)', '22ct (916.6)', '18ct (750)'], rows, `Worked out at the same gold price as the calculator above (${h.when}). 21ct is shown at a straight 21/24 as a guide.`)}

<h2>Why 21ct has no British standard</h2>
<p>${h.src('hallmarkSch2', 'UK hallmarking law')} lists six standards for gold: 375, 585, 750, 916.6, 990 and 999. ${h.src('hallmarkSch1', 'The hallmarking law')} gives the carat equivalents for 9, 14, 18 and 22. There is no 21. An article must reach a standard to be hallmarked at it, and an article described for sale in the UK as gold must be hallmarked unless it is exempt. So a trader selling 21ct here would have to have it marked 750 and give away the difference. That is why 21ct is rare in British shops and common in British homes.</p>

<h2>Selling 21ct in the UK</h2>
<p>Expect the buyer to test. An X-ray fluorescence scanner reads the surface in seconds; acid tests on a touchstone take longer and are less precise; a fire assay, which melts a sample, is the most precise and is used by refiners. Ask what the test found and write it down. If it shows 875, the calculator above gives the metal value. If it shows something else, type the weight into the ${h.a('carat-converter', 'carat converter')} or use the ${h.a('hallmarks', 'hallmark decoder')} with the fineness the test found.</p>
<p>Gulf jewellery often comes in heavy sets, so the money involved can be substantial. Two quotes, each converted to a percentage of the metal, are worth the effort. The ${h.a('scrap', 'scrap gold calculator')} works out a mixed lot.</p>
<!--tool:compare-->
`;
  },
});

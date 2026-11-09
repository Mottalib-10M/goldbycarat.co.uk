import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'carat-converter', group: 'gold', order: 19, tool: 'karatconv', kind: 'outil',
  related: ['hallmarks', 'carat-14', 'carat-21', 'carat-22'], sources: ['hallmarkSch1', 'hallmarkSch2'],
  slug: 'carat-to-fineness', nav: 'Carat to hallmark number (18ct = 750)', card: 'Any carat to thousandths, with the UK legal standard where one exists',
  title: 'Carat to Fineness Converter: Carats to Thousandths, UK',
  description: 'Carat to fineness converter: type any carat from 1 to 24 and get thousandths, percentage and gram price, with the UK legal hallmark standard when there is one.',
  h1: 'Carat to fineness converter',
  resume: 'Carats measure gold in twenty-fourths and hallmarks measure it in thousandths, so converting one to the other is a division by 24, except where British law has set its own figure. UK hallmarking law maps 9ct to 375, 14ct to 585, 18ct to 750 and 22ct to 916.6, and those legal standards are what this converter returns for those carats; for any other carat, such as 10, 12, 15 or 21, it gives the plain proportion and says that it is not a UK standard. It also shows the price of a gram at that fineness, from the spot price of gold in pounds read from gold-api.com with its time shown. Use it for old or foreign marks, for a fineness a buyer’s test has found, or simply to know what 18ct means. Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'How do I convert carats to a percentage of gold?', a: 'Divide the carat by 24 and multiply by 100: 18ct is 75%, 9ct is 37.5%. For 14ct and 22ct the UK hallmark standards are set a fraction differently, at 58.5% and 91.66%, so a hallmarked piece always contains at least what its carat implies.' },
    { q: 'What carat is a 10K or 15ct mark?', a: '10K is 10/24, about 417 thousandths, a common standard in the United States but not in the UK. 15ct, 625 thousandths, was used in Britain in the past but is no longer a standard. Neither can be hallmarked at that figure today; a buyer will test and pay for the gold it finds.' },
    { q: 'What if a test shows a fineness between two standards?', a: 'Type the carat equivalent, or divide the fineness by 1,000 and multiply by 24. A test reading of 740 is 17.8ct: it fails the 750 standard and would only be marked 585 if it were hallmarked now. For selling, what counts is the measured gold, and the converter prices it per gram.' },
  ],
  body: (h) => {
    const rows = [8, 9, 10, 12, 14, 15, 18, 20, 21, 22, 24].map((k) => { const legal = h.P.gold.find((g) => g.ct === k && g.hallmark); const f = legal ? legal.fineness : Math.round(k / 24 * 10000) / 10; return [`${k}ct`, h.num(f, f % 1 ? 1 : 0), legal ? 'UK standard' : 'Proportion only', h.gbp2(h.at(1, f))]; });
    return `
<h2>Carats and thousandths side by side</h2>
${h.table(['Carat', 'Thousandths', 'Status', 'Per gram'], rows, `Gram price worked out at the gold price of ${h.when}.`)}

<h2>Where the law departs from the arithmetic</h2>
<p>${h.src('hallmarkSch1', 'Schedule 1 of UK hallmarking law')} gives the carat equivalents used in British hallmarking: 9 carat 375, 14 carat 585, 18 carat 750, 22 carat 916.6. Two of them do not match k/24 exactly. Fourteen twenty-fourths is 583.3, so the standard is set higher at 585. Twenty-two twenty-fourths is 916.67, so the standard is set a hair lower at 916.6. ${h.src('hallmarkSch2', 'The hallmarking law')} adds 990 and 999 for pure gold. Any other figure is not a British standard and cannot be struck as a fineness mark.</p>
<p>For 24ct, the converter returns 999, the higher of the two pure standards. Bullion bars and Britannias are 999.9, which the gold bar page uses.</p>

<h2>Reading foreign and old marks</h2>
<p>Numbers you may meet on jewellery bought abroad or inherited include 417 (10 carat) and 875 (21 carat), and older British pieces can be marked 15ct or 12ct, standards no longer in the Act. Each is a claim by the maker; a buyer here will test. Type the carat into the converter to see what it is worth per gram, and see the ${h.a('hallmarks', 'hallmark guide')} for what a full British mark looks like.</p>
`;
  },
});

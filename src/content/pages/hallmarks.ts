import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'hallmarks', group: 'rules', order: 52, tool: 'hallmark', kind: 'guide',
  related: ['carat-converter', 'carat-9', 'sterling-silver', 'platinum'], sources: ['hallmarkSch1', 'hallmarkSch2', 'bhcConsumer', 'bhcBusiness'],
  slug: 'uk-hallmarks-guide', nav: 'UK hallmarks guide', card: 'Read the marks on gold, silver, platinum and palladium',
  title: 'Hallmarks Guide UK: How to Read Gold and Silver Marks',
  description: 'UK hallmarks explained: assay office marks, fineness numbers for gold, silver, platinum and palladium, optional symbols, exempt weights and a calculator.',
  h1: 'UK hallmarks: how to read them and what they are worth',
  resume: 'A British hallmark is a row of tiny stamps, usually inside a ring or on the clasp of a chain, and the one that matters most is the number: 375 means 9ct gold, 585 is 14ct, 750 is 18ct and 916 is 22ct, and 925 means sterling silver. The number counts the precious metal in 1,000 parts. Next to it you find the initials of the maker and the symbol of the official testing office (an assay office) that checked the piece: a leopard’s head for London, a castle for Edinburgh, an anchor for Birmingham or a rose for Sheffield. A small picture, such as a crown on gold, and a letter for the year are optional. UK hallmarking law lists every allowed mark. The decoder turns the number and the weight into a value at today’s price, read from gold-api.com, with its time. Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'What are the compulsory parts of a UK hallmark?', a: 'Three marks: the sponsor’s mark, which identifies the maker or importer who sent the piece for assay; the standard mark, the fineness in thousandths such as 375 or 925; and the assay office mark. The date letter and the traditional pictorial marks, such as the crown on gold or the lion on sterling silver, are optional.' },
    { q: 'Does every piece of gold jewellery have to be hallmarked?', a: 'Every piece sold in the UK as gold must be hallmarked unless it is below the exemption weight of {hm.gold}. For silver the limit is {hm.silver}, for platinum {hm.platinum} and for palladium {hm.palladium}. The British Hallmarking Council says selling unhallmarked goods is a crime, which Trading Standards can investigate.' },
    { q: 'Is a stamp saying 18K a hallmark?', a: 'No. A maker’s stamp such as 18K, 750 or 925 on its own is a claim by the maker. A UK hallmark is struck by an assay office after testing and includes the office’s mark. Many honest pieces made abroad carry only the maker’s stamp; buyers here will test them before quoting.' },
  ],
  body: (h) => `
<h2>The marks, one by one</h2>
<p><strong>Read a hallmark from left to right: who sent it, how pure it is, who tested it.</strong> A typical 9ct ring made in Birmingham looks like this, much smaller:</p>
<figure class="not-prose" style="margin:1.5rem 0"><span style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem"><span style="display:block;border:1px solid var(--color-navy-300);border-radius:.5rem;padding:.4rem .5rem;text-align:center"><b style="display:block;font-size:1.1rem">AB</b><span style="display:block;font-size:.75rem;line-height:1.3">Maker’s initials</span></span><span style="display:block;border:1px solid var(--color-navy-300);border-radius:.5rem;padding:.4rem .5rem;text-align:center"><b style="display:block;font-size:1.1rem">375</b><span style="display:block;font-size:.75rem;line-height:1.3">Gold in 1,000 parts (9ct)</span></span><span style="display:block;border:1px solid var(--color-navy-300);border-radius:.5rem;padding:.4rem .5rem;text-align:center"><b style="display:block;font-size:1.1rem">Anchor</b><span style="display:block;font-size:.75rem;line-height:1.3">Testing office: Birmingham</span></span></span><figcaption style="margin-top:.5rem;font-size:.75rem">Diagram, not a photograph: the initials are an example. Real marks are struck side by side and are about a millimetre high.</figcaption></figure>
<h3>The maker’s initials (the “sponsor’s mark”)</h3>
<p>Initials inside an outline. They belong to the person or business that sent the piece to the testing office, often the maker, sometimes an importer or retailer. Each sponsor’s mark is registered with an assay office (an official testing office), so it can be traced.</p>
<h3>The number: how pure it is</h3>
<p><strong>The number is the least amount of precious metal in 1,000 parts.</strong> ${h.src('hallmarkSch2', 'UK hallmarking law')} lists the only numbers that may be stamped:</p>
${h.table(['Metal', 'Numbers allowed', 'Optional picture', 'No hallmark needed below'], [['Gold', h.P.goldStandards.map((f) => String(Math.floor(f))).join(', '), 'A crown', '{hm.gold}'], ['Silver', h.P.silver.map((f) => String(Math.floor(f))).join(', '), 'Lion passant (925, 958, 999), or lion rampant from Edinburgh; Britannia (958, 999)', '{hm.silver}'], ['Platinum', h.P.platinum.join(', '), 'An orb surmounted by a cross (950, 999)', '{hm.platinum}'], ['Palladium', h.P.palladium.join(', '), 'The head of Pallas Athene', '{hm.palladium}']], 'Source: UK hallmarking law (see the list at the foot of the page).')}
<p>For gold, ${h.src('hallmarkSch1', 'the law')} links the numbers to carats: 375 is 9 carat, 585 is 14, 750 is 18 and 916 is 22. The law writes the 22ct standard as 916.6 parts in 1,000; the stamp, and this site, show it as 916. In the same way, 958 on silver stands for 958.4.</p>
<h3>The testing office symbol</h3>
<p>${h.P.assayOffices.map((o) => `${o.city}: ${o.mark}`).join('; ')}. These are the four UK assay offices (official testing offices) today. Older silver and gold can carry marks of offices that have since closed, such as Chester, Exeter or Glasgow, which are a matter for antique specialists.</p>
<h3>The date letter</h3>
<p>A letter in a shaped shield that shows the year of marking. It has been optional since 1999. The alphabet, the font and the shield change in cycles, so a date letter needs a chart for its office to read.</p>

<h2>Weight exemptions</h2>
<p>Very light articles are exempt from compulsory hallmarking: gold under {hm.gold}, silver under {hm.silver}, platinum under {hm.platinum} and palladium under {hm.palladium}. That is why small earrings, thin chains and some rings carry no hallmark at all. They can still be sold as gold or silver; their fineness is simply not guaranteed by a mark.</p>

<h2>Why hallmarks matter when you sell</h2>
<p>A hallmark is a tested fact, not a claim. A buyer who sees 750 with an assay office mark knows the piece met the 18ct standard when it was marked, and should pay for 18ct without arguing. Pieces with no British mark, or with only a maker’s stamp, will be tested, and you should ask what the test found. The decoder at the top of this page values a piece from its mark and weight; the ${h.a('carat-converter', 'carat converter')} handles fineness figures that are not British standards.</p>

<h2>Buying: the Dealer’s Notice</h2>
<p>The ${h.src('bhcConsumer', 'British Hallmarking Council')} advises buyers to ask whether a piece is hallmarked, to look at the mark with a magnifying glass, and to check it against the Dealer’s Notice that jewellers must display, which explains the marks. Online sellers must show the same information. The ${h.src('bhcBusiness', 'Council’s guidance for businesses')} sets out what a trader must do. If you see unhallmarked goods sold as gold or silver above the exemption weights, Trading Standards is the body to tell.</p>

<h2>Mixed and plated pieces</h2>
<p>An article made of two precious metals, such as a ring with a platinum setting on an 18ct band, can be hallmarked with the standard mark of each metal, as long as each part meets its standard. Gold-plated, rolled gold and silver-plated items are not precious metal articles and cannot be hallmarked as such; marks like RGP (rolled gold), GF (gold-filled) or EPNS (a silver plating on base metal) tell you so.</p>
`,
});

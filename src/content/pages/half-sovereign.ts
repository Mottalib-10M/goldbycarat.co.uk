import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'half-sovereign', group: 'coins', order: 31, tool: 'coin', toolProps: { coin: 'half-sovereign' }, kind: 'outil',
  related: ['sovereign', 'britannia', 'vat', 'where-to-sell'], sources: ['coinageAct', 'rmQuarter', 'tcga21', 'vatNotice70121'],
  slug: 'half-sovereign-value', nav: 'Half sovereign value', card: 'Half and quarter sovereigns: gold content and melt value',
  title: 'Half Sovereign Value: Gold Content and Melt Price Today',
  description: 'Half sovereign value in pounds from its legal weight of {half.g} and the live spot price, with its time; quarter sovereigns too, and the dealer premium.',
  h1: 'Half sovereign value',
  resume: 'A half sovereign holds exactly half the gold of a full sovereign, so you do not need scales: choose how many you have and see what that gold is worth today. It weighs {half.g} under the law on coins and is eleven twelfths gold, so it contains {half.fine} of pure gold. This calculator multiplies that by the spot price (the price traders use for pure metal) of gold in pounds read from gold-api.com and shows when the price was set, so you get the melt value without weighing anything. Because the coin is small, the costs of making and selling it weigh more heavily, and dealers tend to charge a larger percentage premium (what a dealer charges above the metal value) for halves than for full sovereigns; typing a dealer’s price shows that premium. Half sovereigns are UK legal tender (official money), so a gain on them is outside Capital Gains Tax. The quarter sovereign, a modern Royal Mint coin with 0.059 oz of gold, is in the list as well. Gold by Carat is an independent site, not a gold buyer or a dealer.',
  faqs: [
    { q: 'Is a half sovereign worth exactly half a sovereign?', a: 'In gold, yes: its legal weight is half and its fineness the same. In price, not quite. Dealers tend to charge more per gram of gold for halves when selling and may pay a little less when buying, because the handling cost per coin is similar. Compare the per-coin premium as a percentage to see the difference.' },
    { q: 'How much gold is in a quarter sovereign?', a: 'The Royal Mint gives 0.059 troy ounces of fine gold, about 1.84 g. It is a recent addition to the range, so it is not in the 1971 Act. Its premium over gold tends to be the highest of the family for the same reason as halves: small coins cost as much to handle as large ones.' },
    { q: 'Are half sovereigns VAT-free?', a: 'Yes, as investment gold. They are legal tender, at least {vat.coin} fine, minted after {vat.minted} and normally sold for no more than {vat.premium} of their gold value, which are the conditions in HMRC VAT Notice 701/21. A heavily marked-up proof or presentation set could fall outside that last condition.' },
  ],
  body: (h) => {
    const rows = [1, 2, 5, 10, 20].map((n) => [`${n} × half sovereign`, h.num(n * 3.99402 * 0.91666, 3) + ' g', h.live(h.at(n * 3.99402, 916.66), 'XAU')]);
    return `
<h2>Half sovereigns by the number</h2>
${h.table(['Coins', 'Fine gold', 'Melt value'], rows, `Worked out at the same gold price as the calculator above (${h.when}).`)}

<h2>Legal weight and fineness (the share of pure metal)</h2>
<p>The ${h.src('coinageAct', 'Coinage Act 1971, Schedule 1')} lists the half sovereign at a standard weight of {half.g} and eleven twelfths fine. That gives {half.fine} of fine gold, which is how much gold the coin contains if it is at full weight. Older halves that have circulated may be slightly lighter; dealers trading bullion halves rarely adjust for that unless the wear is obvious.</p>
<p>The ${h.src('rmQuarter', 'Royal Mint’s quarter sovereign')} contains 0.059 oz. Choose it in the list to value it.</p>

<h2>What dealers charge on small coins, and tax</h2>
<p>Every coin costs roughly the same to strike, pack, insure and sell, whatever its size. On a half sovereign those costs are spread over half as much gold, so the percentage premium is higher. Over the time you hold the coin, that premium is part of what the gold price has to rise to cover. Small coins are easier to sell in small amounts, which some buyers value; others prefer full sovereigns or one-ounce coins for the lower premium.</p>

<p>As sterling legal tender, half sovereigns are excluded from Capital Gains Tax by ${h.src('tcga21', 'the tax law')}, and they are investment gold for VAT under ${h.src('vatNotice70121', 'Notice 701/21')}. The ${h.a('sovereign', 'full sovereign page')} gives the rest of the family, and the ${h.a('vat', 'VAT page')} runs the investment gold test.</p>
`;
  },
});

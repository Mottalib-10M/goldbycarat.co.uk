import { definePage } from '../../lib/page-types';
export default definePage({
  id: 'silver-britannia', group: 'silver', order: 42, tool: 'coin', toolProps: { coin: 'silver-britannia' }, kind: 'outil',
  related: ['silver', 'britannia', 'vat', 'cgt'], sources: ['rmSilverBritannia', 'tcga21', 'vatNotice70121', 'vatRates'],
  slug: 'silver-britannia-value', nav: 'Silver Britannia value', card: 'One ounce of 999 silver: metal value, VAT and premium',
  title: 'Silver Britannia Value: 1 oz 999 Silver Coin in Pounds',
  description: 'Silver Britannia value at the live, timed silver price: one troy ounce of 999 silver, the premium a dealer asks, VAT on silver coins and the CGT position.',
  h1: 'Silver Britannia value',
  resume: 'A one ounce silver Britannia contains a troy ounce of silver, {oz2} grams, at 999 fine according to the Royal Mint’s 2026 specification, so its metal value is the silver spot price of an ounce, which this calculator reads in pounds from gold-api.com and shows with its time. Type the price a dealer asks or offers to see it as a percentage of the silver. Two rules make the silver coin very different from its gold namesake. Silver is never investment gold, so a silver Britannia bought from a UK dealer carries VAT at {vat}, and the gap between buying and selling prices is wide. But it is UK legal tender like the gold coin, so a gain on it is outside Capital Gains Tax. Gold by Carat is an independent site, not a silver buyer or a dealer, and sells no coins.',
  faqs: [
    { q: 'Why does a silver Britannia cost so much more than its silver?', a: 'Three costs sit on top of the metal: the Royal Mint’s and the dealer’s margins, which are large relative to a coin worth tens of pounds, and VAT at {vat} on the whole price, because silver is not investment gold. Selling back, you get no VAT refund, so the coin has to rise a long way to break even.' },
    { q: 'Is there Capital Gains Tax on silver Britannias?', a: 'No. Silver Britannias are UK legal tender, so they are sterling currency and the tax law excludes them from chargeable assets. A profit on them is never taxed, however many you sell, which is one reason they are popular despite the VAT charged when you buy them.' },
    { q: 'How do I compare two dealers’ prices for silver Britannias?', a: 'Type each price per coin into the calculator and read it as a percentage of the silver. Make sure both prices include VAT and delivery, and compare them at the same moment, because the silver price moves. For larger orders, ask for the price per coin at your quantity, since it often falls in tubes or boxes.' },
  ],
  body: (h) => {
    const rows = [1, 10, 25, 100, 500].map((n) => [`${n} coin${n > 1 ? 's' : ''}`, h.live(h.at(n * 31.1034768, 999, 'XAG'), 'XAG'), h.live(h.at(n * 31.1034768, 999, 'XAG') * (1 + h.P.vat.standardRate), 'XAG')]);
    return `
<h2>Silver Britannias by the number</h2>
${h.table(['Coins', 'Metal value', 'Metal value + VAT'], rows, `Worked out at the same silver price as the calculator above (${h.whenOf('XAG')}). The last column only shows the effect of VAT on the metal; a dealer’s price also includes its premium.`)}

<h2>Specification</h2>
<p>The ${h.src('rmSilverBritannia', 'Royal Mint’s 2026 silver Britannia')} contains one troy ounce of 999 fine silver. The calculator values it from that content.</p>

<h2>VAT on silver</h2>
<p>${h.src('vatNotice70121', 'HMRC’s VAT guidance')} exempts only investment gold. Silver coins and bars are standard-rated at ${h.src('vatRates', '{vat}')}, so a dealer adds VAT to its price. When you sell back as a private person, no VAT is involved, but the dealer’s buying price reflects only the silver and its own margin. That round trip is the main cost of holding silver coins.</p>

<h2>Capital Gains Tax</h2>
<p>The silver Britannia is legal tender in the UK, so it is sterling currency and ${h.src('tcga21', 'not a chargeable asset')}. Gains are not taxed, however large. Foreign silver coins, such as Maple Leafs or Eagles, do not have this exemption.</p>
<p>The ${h.a('silver', 'silver price page')} gives the price per gram and kilo, and the ${h.a('britannia', 'gold Britannia page')} covers the gold coin.</p>
`;
  },
});

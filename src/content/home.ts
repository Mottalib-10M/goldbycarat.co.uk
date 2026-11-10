/** Accueil (pilier). Jetons {…} : helpers.fill.
 *  Test naïf du 2026-11-08 : mots simples, références de lois en lien ou en source (liste du bas),
 *  sigles traduits à leur première apparition, convertisseur once/tola retiré de l'accueil (il a ses pages). */
import type { FAQ, Helpers } from '../lib/page-types';
import { exampleOffer } from '../lib/exemple';

interface HomeText { title: string; description: string; h1: string; lead: string; resume: string; faqs: FAQ[]; body: (h: Helpers) => string }

export const HOME: HomeText = {
  title: 'Gold Price per Gram UK by Carat: 9ct, 18ct, 22ct, 24ct',
  description: 'Gold price per gram in pounds for 9ct, 14ct, 18ct, 22ct and 24ct at the live spot price, timed, with the legal UK fineness and the share of metal an offer pays.',
  h1: 'Gold price per gram in the UK, by carat',
  lead: 'Choose the carat stamped on your gold and type its weight: you see what the gold is worth today, per gram and in total. We do not buy or sell gold.',
  resume: 'A gram of 9ct gold is just over a third pure gold, a gram of 18ct is three quarters and a gram of 22ct is almost all gold, and this page turns that share into pounds at today’s gold price. The number stamped on the piece says it exactly, in parts per 1,000: {f.9} for 9ct, {f.18} for 18ct and 916 for 22ct, the numbers UK hallmarking law sets. The price comes from gold-api.com, a free price service, and the time of that price is shown with the result. If the live price cannot be read, the page uses the price recorded when it was built and says so. What you see is the value of the gold itself. No buyer pays all of it, because a buyer has to melt and refine the gold and pay its own costs, which is why the offer checker turns any quote into a share of that value. Gold by Carat is an independent site, not a gold buyer or a dealer, and it shows no buyer’s prices.',
  faqs: [
    { q: 'How much will a buyer actually pay me for my gold?', a: 'Nobody can say in advance: no law or official body publishes what buyers pay, and each buyer sets its own rate. What you can know is the ceiling, the value of the gold shown above, and what 60% to 90% of it would be. Ask two or three buyers for a quote on the same day, turn each into a share with the offer checker, and take the highest.', open: true },
    { q: 'Why is the gold price per gram on this site higher than what shops pay?', a: 'The figure here is the value of the gold itself: the weight of pure gold in your item times today’s price. A shop that buys gold has to have it melted and refined, take the risk that the price falls, and pay its staff and rent, so it offers part of that value. That is why the offer checker shows the share a quote pays rather than guessing it.' },
    { q: 'Which carat is my jewellery if it has no number on it?', a: 'In the UK, a piece sold as gold must carry a hallmark unless it weighs under {hm.gold}. Look for 375, 585, 750 or 916 inside a ring or on the clasp of a chain. With no mark at all, nobody can tell by eye how pure it is: choose 9ct here so the value is not too high, and a buyer will test it before quoting.' },
    { q: 'Does selling old gold jewellery mean paying tax?', a: 'Almost never. A single piece, or a set sold together, sold for {chattel} or less is free of Capital Gains Tax (the tax on a profit when you sell something). Above that, only part of the profit can be taxed, and everyone has a tax-free allowance of {cgt.allowance} a year on top. Sovereigns and Britannias are British coins and are never taxed when you sell them.', open: true },
    { q: 'Is the price on this page live?', a: 'When the page opens, the calculator asks gold-api.com for the current price of gold in pounds and shows the time of that price with the result. If the request fails, it keeps the price recorded when the page was built and says so, with its date and time. Nothing refreshes by itself; a button under the calculator lets you check for a newer price.' },
    { q: 'How often does the gold price change?', a: 'The gold price moves whenever the markets trade, which is most of the day on weekdays and hardly at all at weekends. That is why every value on this site carries the time of its price, and why an offer is best judged as a share of the gold value rather than as a sum of money, which goes out of date.' },
  ],
  // 2026-11-10 (règle des pages courtes) : trois sections au lieu de sept. Argent, platine et palladium ont leurs
  // pages (menu) ; « comment la valeur est calculée » et « d'où vient le prix » sont fusionnés.
  body: (h) => {
    return `
<h2>What a gram of gold contains at each carat</h2>
<p><strong>9ct is just over a third gold, 18ct is three quarters gold and 22ct is almost all gold.</strong> The carat (ct) counts the gold in 24 parts; the number stamped on the piece counts it in 1,000 parts, so 375 means 375 parts of gold in every 1,000. Pure gold is too soft to wear, so jewellers mix it with silver, copper or zinc. In the UK those numbers are not rough guides: ${h.src('hallmarkSch2', 'the hallmarking law')} lists the only numbers an official testing office (an assay office) may stamp on gold, and the piece must hold at least that much.</p>
<p>The value is the weight, times the share of gold, times today’s price of a gram of pure gold. A 10 g 9ct chain holds 3.75 g of pure gold; at the price of ${h.when} that is ${h.live(h.at(10, 375), 'XAU')}, the same example as the calculator above.</p>
<p>The weight is the one number you have to find, and it is where most estimates go wrong. A ring set with stones weighs more than the gold in it, and steel springs in clasps count on the scales too. Kitchen scales are good enough for a rough figure; a buyer will weigh to a hundredth of a gram.</p>
<p>21ct is in the list because a lot of gold bought in the Gulf, India and Pakistan is 21ct. It is real gold, but 21 is not one of the British numbers, so a 21ct piece made abroad carries no British hallmark; a buyer will test it. 24ct is shown at 999 parts in 1,000, a hair under pure gold, which is why a gram of it is worth a few pence less than the price of pure gold.</p>

<h2>Turning a buyer’s offer into a percentage</h2>
<p><strong>A percentage tells you how much of your gold you are really being paid for.</strong> Buyers quote a price per gram or a single sum for the lot, and neither says what share of the gold value you get. If a shop offers ${h.gbp(exampleOffer(10, 9, 0.7))} for the 10 g chain above, that is ${h.live(exampleOffer(10, 9, 0.7) / h.at(10, 375), 'XAU', 'pct')} of the gold value: the same example the ${h.a('offer', 'offer checker')} opens with.</p>
<p>Two habits help. Ask for the weight and the carat the buyer recorded, so you can compare them with yours. And ask a second buyer the same day: nobody publishes a usual rate, so another quote is the only yardstick. The ${h.a('where-to-sell', 'page on where to sell')} compares high street shops, postal buyers and pawnbrokers by what they do with your gold.</p>
<p>Inherited a few pieces? The ${h.a('inherited', 'page on selling inherited gold')} takes you through three steps: find what the gold is worth, check the tax, which is almost always nothing, then compare two or three offers. Keep anything signed, antique or set with a good stone apart from the rest: a jeweller may pay more for it as jewellery than any buyer will pay for its gold.</p>

<h2>Coins, tax and where the price comes from</h2>
<p><strong>A British gold coin holds a known amount of gold, so you can value it without scales.</strong> ${h.src('coinageAct', 'The law on coins')} fixes the sovereign at {sov.g}, eleven twelfths gold. The ${h.a('sovereign', 'sovereign page')} values each coin from that.</p>
<p><strong>Most people selling a few pieces of jewellery owe no tax.</strong> A single piece, or a set sold together, sold for {chattel} or less is free of Capital Gains Tax, the tax on a profit when you sell something (${h.src('tcga262', 'the rule')}). Sovereigns and Britannias are British coins and are never taxed when you sell them (${h.src('tcga21', 'the rule')}). The ${h.a('cgt', 'Capital Gains Tax page')} has the calculator. Buying is the other way round: VAT, the sales tax, is not charged on gold coins and bars bought as an investment (${h.src('vatNotice70121', 'guidance from HMRC, the UK tax office')}), but it is charged on jewellery.</p>
<p>The gold price is supplied by gold-api.com, a free service whose terms allow use on a site like this one. It is the price traders use for pure gold, not the price a shop will pay you. The page reads it once when it opens and shows its time with the result; every sum is worked out on your phone or computer, and nothing you type is sent anywhere. The ${h.a('method', 'method page')} lists every formula and source.</p>
`;
  },
};

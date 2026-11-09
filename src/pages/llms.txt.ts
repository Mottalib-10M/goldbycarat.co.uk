/** llms.txt (RECETTE §21) : ce qu'est le site, d'où viennent ses chiffres, ses pages. Construit depuis les données. */
import type { APIRoute } from 'astro';
import { PAGES } from '../lib/pages';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
import { P } from '../lib/engine/params';
import { fill } from '../lib/helpers';
export const GET: APIRoute = () => {
  const lines = [
    '# Gold by Carat',
    '',
    `> Calculators that turn the spot price of gold, silver, platinum and palladium in pounds (gold-api.com, time shown, dated fallback) into the metal value of British hallmarked items: 9ct = 375, 14ct = 585, 18ct = 750, 22ct = 916.6 thousandths under the Hallmarking Act 1973; sovereigns by the weights of the Coinage Act 1971; Britannias, Krugerrands and Maples by Royal Mint specifications. An offer checker turns a buyer's quote into a share of the metal. Capital Gains Tax (${P.taxYear}: sterling coins outside the tax, £${P.chattels.exemptLimit.toLocaleString('en-GB')} chattel exemption) and VAT (HMRC Notice 701/21) from official sources, read on ${LAST_UPDATED}. Independent site published by Radif Partners: not a gold buyer or a dealer; no buyer prices, no advice.`,
    '',
    '## Calculators and guides',
    `- [Gold price per gram by carat](${SITE_URL}${route('home', 'en')}): metal value of any weight of 9ct to 24ct gold at the spot price.`,
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${fill(p.card)}`),
    '',
    '## Method',
    `- [How the values are worked out](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

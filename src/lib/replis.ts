/**
 * Pages plus courtes sur téléphone (testeurs naïfs, 4e tour du 2026-11-08 : « 10 à 17 écrans », « 15 écrans
 * de texte dense sous le calculateur »). Le corps d'une page garde ses `ouvertes` premières sections ; les
 * suivantes se replient sous leur titre H2, cliquable (`<details>`). Rien n'est retiré : le texte reste dans
 * le HTML servi, lu par les moteurs. Une section qui porte un calculateur (`<!--tool:…-->`) reste ouverte.
 */
export function replierSections(html: string, ouvertes = 1, aide = 'More detail below: tap a heading to open it.'): string {
  const morceaux = html.split(/(?=<h2[\s>])/);
  let vues = 0;
  let aideMise = false;
  return morceaux.map((m) => {
    if (!m.startsWith('<h2')) return m;
    vues += 1;
    const fin = m.indexOf('</h2>');
    if (vues <= ouvertes || m.includes('<!--tool:') || fin < 0) return m;
    const titre = m.slice(0, fin + 5);
    const reste = m.slice(fin + 5);
    const tete = aideMise ? '' : `<p class="pli-aide" data-chrome>${aide}</p>`;
    aideMise = true;
    return `${tete}<details class="pli"><summary>${titre}</summary>${reste}</details>\n`;
  }).join('');
}

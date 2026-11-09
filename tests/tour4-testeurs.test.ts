/**
 * Corrections du 4e tour des testeurs naïfs (2026-11-08) et de l'audit du 2026-11-09, verrouillées.
 */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Tool from '../src/components/calc/Tool';
import { replierSections } from '../src/lib/replis';
import { exampleOffer } from '../src/lib/exemple';
import { HOME } from '../src/content/home';
import { helpers, fill } from '../src/lib/helpers';
import cgtPage from '../src/content/pages/cgt';
import offerPage from '../src/content/pages/offer';

const rendu = (p: Record<string, unknown>) => renderToStaticMarkup(createElement(Tool, p as never));

describe('valeurs d’exemple toujours signalées', () => {
  for (const tool of ['board', 'carat', 'offer', 'compare', 'scrap', 'coin', 'hallmark', 'units', 'bar', 'silver', 'pgm', 'vat', 'cgt', 'karatconv']) {
    it(`${tool} : mention « Example » au premier rendu`, () => {
      const h = rendu({ tool, ct: 9, grams: 10 });
      expect(h).toContain('data-exemple');
      expect(h).toMatch(/Example/);
    });
  }
  it('accueil : « Example: 10 g of 9ct »', () => {
    const h = rendu({ tool: 'board', ct: 9, grams: 10 });
    expect(h).toContain('Example: 10 g of 9ct. Type your own weight.');
    expect(h).toContain('Example: 10 g of 9ct gold is worth');
  });
});

describe('libellés réparés', () => {
  it('comparateur : libellés neutres, pas de double deux-points', () => {
    const h = rendu({ tool: 'compare', ct: 9, grams: 10 });
    expect(h).not.toContain('postal buyer');
    expect(h).not.toMatch(/best offer: Offer/);
    expect(h).toContain('Offer B pays the most');
  });
  it('lot mêlé : une seule façon de taper une offre', () => {
    const h = rendu({ tool: 'scrap' });
    expect(h).not.toContain('Share of the gold value a buyer pays you');
    expect(h).toContain('value of the gold in the whole lot');
  });
  it('ligne du cours : une heure, pas de « api » en vue', () => {
    const h = rendu({ tool: 'board', ct: 9, grams: 10 });
    const ligne = h.split('Where this price comes from')[0];
    expect(ligne).not.toContain('gold-api');
    expect(h).toContain('<details');
  });
  it('impôts : le texte dit quand la case revenu apparaît', () => {
    const corps = fill(cgtPage.body(helpers()));
    expect(corps).not.toContain('That is why the calculator asks for your income:');
    expect(corps).toContain('the calculator also asks for your yearly income');
  });
});

describe('un même exemple d’offre partout', () => {
  it('texte de l’accueil = offre d’exemple du vérificateur', () => {
    const corps = fill(HOME.body(helpers()));
    const h = helpers();
    expect(corps).toContain(`If a shop offers ${h.gbp(exampleOffer(10, 9, 0.7))} for the 10 g chain above`);
    expect(rendu({ tool: 'offer', ct: 9, grams: 10 })).toContain(h.gbp(exampleOffer(10, 9, 0.7)).replace('£', ''));
    expect(offerPage.toolProps?.grams).toBe(10);
  });
});

describe('sections repliées', () => {
  const html = '<h2>A</h2><p>a</p><h2>B</h2><p>b</p><!--tool:compare--><h2>C</h2><p>c</p>';
  it('garde les premières ouvertes et celles qui portent un calculateur', () => {
    const r = replierSections(html, 1);
    expect(r.startsWith('<h2>A</h2>')).toBe(true);
    expect(r).toContain('<h2>B</h2><p>b</p><!--tool:compare-->');
    expect(r).toContain('<details class="pli"><summary><h2>C</h2></summary><p>c</p></details>');
    expect((r.match(/pli-aide/g) ?? []).length).toBe(1);
  });
  it('ne retire aucun texte', () => {
    const r = replierSections(html, 0);
    for (const t of ['<p>a</p>', '<p>b</p>', '<p>c</p>']) expect(r).toContain(t);
  });
});

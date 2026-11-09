#!/usr/bin/env node
/**
 * Relevé du cours au build (brief 2026-11-07, site B).
 * Source : https://api.gold-api.com/price/<XAU|XAG|XPT|XPD>/GBP (gold-api.com, conditions relues le
 * 2026-11-07 : §9 usage commercial permis, y compris sur un site web ; §4 jamais plusieurs requêtes par
 * seconde, d'où une requête par métal espacée de 1,5 s).
 * Le fichier écrit (src/data/spot-snapshot.json) donne le premier rendu de chaque page et sert de repli
 * daté quand le navigateur ne joint pas l'API. En cas d'échec réseau, le fichier existant est gardé tel
 * quel : la page affiche alors la date et l'heure de ce dernier relevé.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const F = new URL('../src/data/spot-snapshot.json', import.meta.url);
const old = existsSync(F) ? JSON.parse(readFileSync(F, 'utf8')) : null;
const BOUNDS = { XAU: [500, 20000], XAG: [5, 500], XPT: [200, 10000], XPD: [200, 10000] };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function j(u) { const r = await fetch(u, { signal: AbortSignal.timeout(15000) }); if (!r.ok) throw new Error(`${u} ${r.status}`); return r.json(); }
const out = { source: 'gold-api.com', currency: 'GBP', gbpPerOz: { ...(old?.gbpPerOz ?? {}) }, at: { ...(old?.at ?? {}) } };
let ok = 0;
for (const sym of ['XAU', 'XAG', 'XPT', 'XPD']) {
  try {
    const g = await j(`https://api.gold-api.com/price/${sym}/GBP`);
    const [lo, hi] = BOUNDS[sym];
    if (g.currency !== 'GBP' || !(g.price > lo && g.price < hi)) throw new Error(`${sym} hors bornes ou devise ${g.currency}`);
    out.gbpPerOz[sym] = Math.round(g.price * 100) / 100;
    out.at[sym] = g.updatedAt ?? new Date().toISOString();
    ok++;
  } catch (err) { console.warn(`relevé ${sym} impossible (${err.message}) : on garde ${old?.at?.[sym] ?? 'rien'}`); }
  await wait(1500);
}
if (!ok && !old) { console.error('aucun relevé et aucun fichier existant'); process.exit(1); }
if (['XAU', 'XAG', 'XPT', 'XPD'].some((s) => !out.gbpPerOz[s])) { console.error('un métal manque dans le relevé'); process.exit(1); }
writeFileSync(F, JSON.stringify(out, null, 1) + '\n');
console.log(`cours relevés (GBP/oz) : ${Object.entries(out.gbpPerOz).map(([k, v]) => `${k} ${v}`).join(' · ')}`);

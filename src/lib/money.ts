/** Montants en livres (RECETTE §4.1) : un total s'affiche sans pence au-delà de 1 000 £ ; un prix au
 *  gramme ou une petite somme garde ses pence, comme sur une étiquette de bijoutier. */
import { formatNumber } from './format';
export const gbp = (n: number) => `£${formatNumber(n, Math.abs(n) >= 1000 ? 0 : 2)}`;
export const gbp0 = (n: number) => `£${formatNumber(n, 0)}`;
export const gbp2 = (n: number) => `£${formatNumber(n, 2)}`;
export const pct = (x: number, d = 1) => `${formatNumber(x * 100, d)}%`;
export const grams = (n: number, d = 2) => `${formatNumber(n, d)} g`;
/** Heure d'un relevé de cours, en heure de Londres, écrite en mots simples (testeurs naïfs du 2026-11-09 :
 *  « 08:49 GMT » arrêtait le lecteur ; « 8:49 am UK time » se lit sans sigle). */
export function stamp(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' });
  return `${day}, ${clock(iso)}`;
}
/** Heure seule d'un relevé (Londres) : « 8:49 am UK time ». */
export function clock(iso: string): string {
  const t = new Date(iso).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Europe/London' }).replace(/\s+/g, ' ').toLowerCase();
  return `${t} UK time`;
}

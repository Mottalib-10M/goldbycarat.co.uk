/** Montants en livres (RECETTE §4.1) : un total s'affiche sans pence au-delà de 1 000 £ ; un prix au
 *  gramme ou une petite somme garde ses pence, comme sur une étiquette de bijoutier. */
import { formatNumber } from './format';
export const gbp = (n: number) => `£${formatNumber(n, Math.abs(n) >= 1000 ? 0 : 2)}`;
export const gbp0 = (n: number) => `£${formatNumber(n, 0)}`;
export const gbp2 = (n: number) => `£${formatNumber(n, 2)}`;
export const pct = (x: number, d = 1) => `${formatNumber(x * 100, d)}%`;
export const grams = (n: number, d = 2) => `${formatNumber(n, d)} g`;
/** Heure d'un relevé de cours, en heure de Londres (BST ou GMT selon la date), écrite en toutes lettres. */
export function stamp(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London', timeZoneName: 'short' });
  return `${day}, ${time}`;
}
/** Heure seule d'un relevé (Londres), pour « still the same at 01:03 GMT ». */
export function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London', timeZoneName: 'short' });
}

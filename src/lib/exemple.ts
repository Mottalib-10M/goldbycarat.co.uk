/** Offre d'exemple : une part de la valeur métal au relevé du build, arrondie à 5 £. Jamais au-dessus de
 *  100 % (test naïf du 2026-11-08 : des offres par défaut à 109 % et 123,5 % faisaient croire qu'un
 *  acheteur paie plus que l'or). Ce n'est pas un taux de marché. Partagée par les calculateurs et par le
 *  texte des pages : l'offre citée en exemple dans le texte est celle que montre le calculateur (même calcul,
 *  même arrondi). */
import { metalValue, finenessOfCarat } from './engine/metal';
import { SNAPSHOT } from './engine/params';

export const exampleOffer = (g: number, ct: number, share: number) => Math.round(metalValue(g, finenessOfCarat(ct), SNAPSHOT.gbpPerOz.XAU) * share / 5) * 5;

/**
 * Une page = UN fichier de `src/content/pages/<id>.ts`. Le cœur (routes, menus, sitemap, schémas,
 * maillage) le lit seul. Site en une langue (anglais britannique).
 */
import type { SourceKey, Params } from './engine/params';
export type Group = 'gold' | 'sell' | 'coins' | 'silver' | 'rules';
export interface FAQ { q: string; a: string; open?: boolean }
export type ToolName = 'board' | 'carat' | 'offer' | 'scrap' | 'compare' | 'units' | 'bar' | 'coin' | 'silver' | 'pgm' | 'cgt' | 'vat' | 'hallmark' | 'karatconv';

export interface Helpers {
  a: (id: string, text: string) => string;
  src: (key: SourceKey, text?: string) => string;
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string) => string;
  num: (n: number, d?: number) => string;
  gbp: (n: number) => string;
  gbp2: (n: number) => string;
  pct: (x: number, d?: number) => string;
  /** Valeur au relevé du build (spot-snapshot.json) : grammes × millièmes. */
  at: (grams: number, fineness: number, metal?: 'XAU' | 'XAG' | 'XPT' | 'XPD') => number;
  /** Montant qui dépend du cours d'un métal, recalculé au cours du calculateur dans le navigateur (live.ts).
   *  f = 'gbp' (défaut), 'gbp2' (pence toujours) ou 'pct' (part d'une offre fixe : inverse du cours). */
  live: (n: number, metal?: 'XAU' | 'XAG' | 'XPT' | 'XPD', f?: 'gbp' | 'gbp2' | 'pct') => string;
  /** Heure du cours de l'or, en toutes lettres (heure de Londres) : relevé du build, puis cours du calculateur. */
  when: string;
  whenOf: (metal: 'XAU' | 'XAG' | 'XPT' | 'XPD') => string;
  /** Heure du relevé du build, fixe (pour un chiffre qui ne suit pas le cours du moment). */
  recorded: string;
  P: Params;
}

export interface ToolProps { ct?: number; unit?: string; coin?: string; fineness?: number; metal?: string; kind?: string; item?: string; grams?: number; offer?: number; bar?: number }

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  tool: ToolName;
  toolProps?: ToolProps;
  /** Page outil (`data-outil`, 500 mots) ou guide (1 200 mots). */
  kind: 'outil' | 'guide';
  related: string[];
  sources: SourceKey[];
  /** Segment d'URL, minuscules et tirets. */
  slug: string;
  nav: string;
  card: string;
  /** 50 à 60 caractères, terme-clé en tête. */
  title: string;
  /** 150 à 160 caractères. */
  description: string;
  h1: string;
  /** Bloc citable : UN paragraphe d'au moins 120 mots, replié à la première phrase. */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
}
export const definePage = (p: PageDef): PageDef => p;

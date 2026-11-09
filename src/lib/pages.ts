/** Registre des pages : chaque fichier de `src/content/pages/` est chargé ici. */
import type { PageDef } from './page-types';
const mods = import.meta.glob<{ default: PageDef }>('../content/pages/*.ts', { eager: true });
export const PAGES: PageDef[] = Object.entries(mods)
  .map(([file, m]) => {
    const p = m.default;
    const base = file.split('/').pop()!.replace(/\.ts$/, '');
    if (p.id !== base) throw new Error(`${file} : id « ${p.id} » différent du nom du fichier`);
    return p;
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const pageById = (id: string) => PAGES.find((p) => p.id === id);

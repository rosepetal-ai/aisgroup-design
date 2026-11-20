export const languages = { en: 'English', es: 'Español', ca: 'Català' } as const;
export type Lang = keyof typeof languages;

type Text = Record<Lang, string>;
const t = (en: string, es: string, ca: string): Text => ({ en, es, ca });

/** The menu: groups of pages. Every page exists in every language under the same slug. */
export const sections: { group: Text; pages: string[] }[] = [
  { group: t('Brand', 'Marca', 'Marca'), pages: ['index', 'brands', 'logos'] },
  { group: t('Design language', 'Lenguaje de diseño', 'Llenguatge de disseny'), pages: ['colour', 'typography', 'layout', 'imagery', 'patterns', 'icons', 'data', 'motion', 'themes', 'accessibility'] },
  { group: t('Communications', 'Comunicación', 'Comunicació'), pages: ['voice', 'localisation', 'communications', 'social', 'kit', 'video'] },
  { group: t('Digital design', 'Diseño digital', 'Disseny digital'), pages: ['web-components', 'assets', 'components', 'using-components', 'pages'] },
  { group: t('Resources', 'Recursos', 'Recursos'), pages: ['downloads', 'agents'] },
];
export const order = sections.flatMap((s) => s.pages);

export const ui: Record<Lang, Record<string, string>> = {
  en: {
    search: "Search guide", searchPlaceholder: "Search…", searchClose: "Close search", searchPrompt: "Type to search the guide.", searchLoading: "Searching…", searchEmpty: "No results found.", searchError: "Search is unavailable. Reload the page and try again.", searchResults: "results",
    guide: 'Brand design', previous: 'Previous', next: 'Next', onThisPage: 'On this page',
    language: 'Language', sections: 'Guide sections', pages: 'Previous and next page', menu: 'Menu', skip: 'Skip to content',
    contrast: 'Contrast', on: 'on', pass: 'Pass', large: 'Large text only', decorative: 'Decorative only', fail: 'Fails', light: 'Light', dark: 'Dark', copy: 'Copy', copied: 'Copied',
  },
  es: {
    search: "Buscar en la guía", searchPlaceholder: "Buscar…", searchClose: "Cerrar búsqueda", searchPrompt: "Escribe para buscar en la guía.", searchLoading: "Buscando…", searchEmpty: "No se han encontrado resultados.", searchError: "La búsqueda no está disponible. Recarga la página e inténtalo de nuevo.", searchResults: "resultados",
    guide: 'Diseño de marca', previous: 'Anterior', next: 'Siguiente', onThisPage: 'En esta página',
    language: 'Idioma', sections: 'Secciones de la guía', pages: 'Página anterior y siguiente', menu: 'Menú', skip: 'Ir al contenido',
    contrast: 'Contraste', on: 'sobre', pass: 'Apto', large: 'Solo texto grande', decorative: 'Solo decorativo', fail: 'No apto', light: 'Claro', dark: 'Oscuro', copy: 'Copiar', copied: 'Copiado',
  },
  ca: {
    search: "Cerca a la guia", searchPlaceholder: "Cerca…", searchClose: "Tanca la cerca", searchPrompt: "Escriu per cercar a la guia.", searchLoading: "Cercant…", searchEmpty: "No s’han trobat resultats.", searchError: "La cerca no està disponible. Recarrega la pàgina i torna-ho a provar.", searchResults: "resultats",
    guide: 'Disseny de marca', previous: 'Anterior', next: 'Següent', onThisPage: 'En aquesta pàgina',
    language: 'Llengua', sections: 'Seccions de la guia', pages: 'Pàgina anterior i següent', menu: 'Menú', skip: 'Ves al contingut',
    contrast: 'Contrast', on: 'sobre', pass: 'Apte', large: 'Només text gran', decorative: 'Només decoratiu', fail: 'No apte', light: 'Clar', dark: 'Fosc', copy: 'Copia', copied: 'Copiat',
  },
};

export const href = (lang: Lang, slug: string) => `/${lang}/${slug === 'index' ? '' : `${slug}/`}`;

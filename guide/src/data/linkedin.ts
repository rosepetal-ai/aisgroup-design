import type { Lang } from '../i18n';
import kit from './kit.json';

// The LinkedIn part of the marketing kit, shared by the Marketing kit and Social media pages: each piece's subject and type.
type Text = { en: string; es: string; ca: string };
const t = (en: string, es: string, ca: string): Text => ({ en, es, ca });

export const postTypes = {
  guide: [t("Practical guide", "Gu\u00eda pr\u00e1ctica", "Guia pr\u00e0ctica"), t("Inputs, scenarios and simple payback before investing.", "Datos, escenarios y recuperación simple antes de invertir.", "Dades, escenaris i recuperació simple abans d’invertir.")],
  sector: [t("Sector carousel", "Carrusel de sector", "Carrusel de sector"), t("Inspection on a canning line, from the double seam to traceability.", "Inspección en una línea de conservas, del doble cierre a la trazabilidad.", "Inspecció en una línia de conserves, del doble tancament a la traçabilitat.")],
  productCarousel: [t("Product carousel", "Carrusel de producto", "Carrusel de producte"), t("The machine, the context, what it inspects, and a samples invitation.", "La máquina, el contexto, qué inspecciona y una invitación a enviar muestras.", "La màquina, el context, què inspecciona i una invitació a enviar mostres.")],
  product: [t('Product post', 'Post de producto', 'Post de producte'), t('White or blue: the machine whole on white, or at work on a real line, with a solid blue panel under it; what it does as the headline.', 'Blanco o azul: la máquina entera sobre blanco, o trabajando en una línea real, con un panel azul liso debajo; lo que hace, como titular.', 'Blanc o blau: la màquina sencera sobre blanc, o treballant en una línia real, amb un panell blau llis a sota; el que fa, com a titular.')],
  detection: [t('Detection post', 'Post de detección', 'Post de detecció'), t('White: one defect, framed where the system finds it.', 'Blanco: un defecto, enmarcado donde lo encuentra el sistema.', 'Blanc: un defecte, emmarcat on el troba el sistema.')],
  callout: [t('What it inspects', 'Qué inspecciona', 'Què inspecciona'), t('Blue: each part the system checks, named where it is.', 'Azul: cada parte que revisa el sistema, nombrada donde está.', 'Blau: cada part que revisa el sistema, anomenada on és.')],
  reading: [t('Reading post', 'Post de lectura', 'Post de lectura'), t('White: the real screen, whole, with the code or date the system reads.', 'Blanco: la pantalla real, entera, con el código o la fecha que lee el sistema.', 'Blanc: la pantalla real, sencera, amb el codi o la data que llegeix el sistema.')],
  software: [t('Software in use', 'Software en uso', 'Programari en ús'), t('Blue: Rosepetal on a real line; what it measures as the headline.', 'Azul: Rosepetal en una línea real; lo que mide, como titular.', 'Blau: Rosepetal en una línia real; el que mesura, com a titular.')],
  news: [t('Company news', 'Noticia', 'Notícia'), t('Blue: the people who came, one headline.', 'Azul: las personas que vinieron y un titular.', 'Blau: les persones que van venir i un titular.')],
  recap: [t('Event recap', 'Resumen de evento', 'Resum d’esdeveniment'), t('Blue: the real moment; the topic as the headline.', 'Azul: el momento real; el tema, como titular.', 'Blau: el moment real; el tema, com a titular.')],
  quote: [t('Quote', 'Cita', 'Cita'), t('Brand blue: the exact words, large, with name and role on one line.', 'Azul de marca: las palabras exactas, grandes, con nombre y cargo en una línea.', 'Blau de marca: les paraules exactes, grans, amb nom i càrrec en una línia.')],
  result: [t('Result', 'Resultado', 'Resultat'), t('Brand blue: one published figure, with its source in one line.', 'Azul de marca: una cifra publicada, con su fuente en una línea.', 'Blau de marca: una xifra publicada, amb la font en una línia.')],
  comparison: [t('Comparison', 'Comparación', 'Comparació'), t('White: a good and a bad example of the same thing, marked OK and NOK.', 'Blanco: un ejemplo bueno y uno malo de lo mismo, marcados OK y NOK.', 'Blanc: un exemple bo i un de dolent del mateix, marcats OK i NOK.')],
  partner: [t('Partner carousel', 'Carrusel de partner', 'Carrusel de partner'), t('A white cover with the partner’s product, what it solves and what it checks on white, and a brand-blue close.', 'Una portada en blanco con el producto del partner, qué resuelve y qué verifica en blanco, y un cierre en azul de marca.', 'Una portada en blanc amb el producte del partner, què resol i què verifica en blanc, i un tancament en blau de marca.')],
  carousel: [t('Defects carousel', 'Carrusel de defectos', 'Carrusel de defectes'), t('A white cover, one defect per white slide beside a good one, and a brand-blue close with one call to action.', 'Una portada en blanco, un defecto por diapositiva en blanco junto a uno bueno y un cierre en azul de marca con una llamada a la acción.', 'Una portada en blanc, un defecte per diapositiva en blanc al costat d’un de bo i un tancament en blau de marca amb una crida a l’acció.')],
} as const;
export type PostType = keyof typeof postTypes;

// Kit id → subject and type, in kit order.
export const pieces: Record<string, [Text | string, PostType]> = {
  'linkedin-carousel-sector-canning': [t('Canning line quality control', 'Control de calidad en conservas', 'Control de qualitat en conserves'), 'sector'],
  'linkedin-carousel-product-hopper': ["AIS Hopper", 'productCarousel'],
  'linkedin-carousel-guide-roi': [t('Guide to estimating ROI', 'Guía para estimar el retorno', 'Guia per estimar el retorn'), 'guide'],
  'linkedin-hopper': ['AIS Hopper', 'product'],
  'linkedin-kariko': ['AIS KARIKÓ', 'detection'],
  'linkedin-rev360-standard': ['AIS REV 360 STANDARD', 'callout'],
  'linkedin-rev360-compact': ['AIS REV 360 COMPACT', 'product'],
  'linkedin-rev360-cables': ['AIS REV 360 Cables', 'product'],
  'linkedin-rev360-pharma': ['AIS REV 360 PHARMA', 'detection'],
  'linkedin-opticais': ['OPTICAIS', 'reading'],
  'linkedin-rosepetal-software': [t('Rosepetal in a bakery', 'Rosepetal en una panadería', 'Rosepetal en una fleca'), 'software'],
  'linkedin-news-cluster': ['Packaging Cluster', 'news'],
  'linkedin-recap-packaging-talks': ['Packaging Talks 2026', 'recap'],
  'linkedin-quote-rosepetal': ['José Racionero, Rosepetal', 'quote'],
  'linkedin-result-daymsa': ['Daymsa', 'result'],
  'linkedin-callout-code-legibility': [t('Batch and date', 'Lote y fecha', 'Lot i data'), 'comparison'],
  'linkedin-carousel-juice-hopper': ['AIS Hopper', 'carousel'],
  'linkedin-carousel-vials-pharma': ['AIS REV 360 PHARMA', 'carousel'],
  'linkedin-carousel-cans-reference': ['AIS REV 360 COMPACT', 'carousel'],
  'linkedin-carousel-muesli-reference': ['OPTICAIS', 'carousel'],
  'linkedin-carousel-partner-v275': ['Omron V275', 'partner'],
  'linkedin-features-kariko': ['AIS KARIKÓ', 'detection'],
  'linkedin-carousel-application-labels': [t('Label inspection', 'Inspección de etiquetas', 'Inspecció d’etiquetes'), 'carousel'],
  'linkedin-carousel-event-mwc': ['MWC Barcelona 2026', 'recap'],
};

type Media = { name: string; text?: string; thumb?: string; png?: string; pdf?: string; slides?: string[] };
export type Piece = { id: string; family: 'post' | 'carousel'; subject: string; type: PostType; media: Media };
// Posts exist in Spanish and English; the Catalan pages show the Spanish ones.
export function linkedin(lang: Lang): Piece[] {
  const media = lang === 'en' ? 'en' : 'es';
  return (kit as any[]).filter((k) => k.family === 'post' || k.family === 'carousel').map((k) => {
    if (!pieces[k.id]) throw new Error(`linkedin.ts: kit piece ${k.id} has no subject and type in \`pieces\``);
    const [subject, type] = pieces[k.id];
    return { id: k.id, family: k.family, subject: typeof subject === 'string' ? subject : subject[lang], type, media: k.langs[media] };
  });
}
export const KIT_DIR = '/kit/files/';

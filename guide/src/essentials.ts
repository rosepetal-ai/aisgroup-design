import type { Lang } from './i18n';

/**
 * The non-negotiable rules. The first is the main rule of the brand system: every
 * skill, the MCP and brand-review open with it word for word. Rendered on the overview and placed at the top of
 * /{lang}/brand.md, so people and AI agents read exactly the same list.
 */
export const essentials: Record<Lang, string[]> = {
  en: [
    '**Keep it simple:** one purpose, the plainest layout, design and implementation that serve it. Linear’s website and Apple Notes are the bar. Cut taglines, helper text, subtitles, eyebrows and secondary labels; if something only makes sense with them, fix the layout instead. A decision ships only if it improves user, developer and agent experience at once. When two rules disagree, this one wins.',
    'Write the names exactly: **AIS Group**, **AIS Vision Systems**, **AIS Vision Automation**, **AIS Scanology**, **Rosepetal** (one word, capital R only). Never translate them.',
    'The brand colour is **blue `#17356E`**. One-colour jobs use this blue; black only where the production can print nothing else.',
    'Use only the supplied logo files: blue on light backgrounds, white on blue or dark, black only for black-only printing and AIS website headers on white. Never redraw, recolour, stretch or regenerate a logo.',
    'Set everything in **Inter** (Regular 400, Medium 500, Semibold 600) with the text styles on the Typography page; code and machine values in **JetBrains Mono**. Fall back to Arial only when Inter cannot be installed.',
    'Use **sentence case** for every headline, title, button and label, in every language.',
    '**Eight core colours** carry the brand. Every other colour is a step of their scales (blue 50–950, neutral 0–900) or a status colour; charts add the data colours. Never use a colour outside the palette or a nearby value.',
    '**Show proof, not claims:** real machines, real screens, measured results with their conditions. No superlatives or invented figures.',
    'Draw icons and arrows with **Lucide**, the library the Rosepetal design system uses: used as shipped (2 px stroke on its 24 px grid). Never type Unicode arrows, ticks or emoji (`→`, `✓`, `•`) as icons.',
    '**Localise, do not translate:** write English, Spanish and Catalan natively, with each language’s own conventions.',
      ],
  es: [
    '**Hazlo simple:** un propósito, la composición más sencilla y el diseño y la implementación que lo sirvan. La web de Linear y Apple Notes son el listón. Fuera eslóganes, textos de ayuda, subtítulos, antetítulos y etiquetas secundarias; si algo solo se entiende con ellos, arregla la composición. Una decisión solo sale si mejora a la vez la experiencia de quien lo usa, de quien lo desarrolla y de los agentes. Si dos reglas chocan, manda esta.',
    'Escribe los nombres exactamente así: **AIS Group**, **AIS Vision Systems**, **AIS Vision Automation**, **AIS Scanology**, **Rosepetal** (una sola palabra, solo la R mayúscula). Nunca los traduzcas.',
    'El color de marca es el **azul `#17356E`**. Los trabajos a una tinta usan este azul; el negro, solo cuando la producción no puede imprimir otro color.',
    'Usa solo los archivos de logotipo suministrados: azul sobre fondo claro, blanco sobre azul u oscuro y negro solo para impresión en negro y cabeceras de las webs de AIS sobre blanco. Nunca redibujes, recolorees, deformes ni regeneres un logotipo.',
    'Compón todo en **Inter** (Regular 400, Medium 500, Semibold 600) con los estilos de texto de la página Tipografía; el código y los valores de máquina, en **JetBrains Mono**. Usa Arial solo cuando no se pueda instalar Inter.',
    'Usa **mayúscula solo inicial** en titulares, títulos, botones y etiquetas, en todos los idiomas.',
    '**Ocho colores principales** llevan la marca. Cualquier otro color es un paso de sus escalas (azul 50–950, neutro 0–900) o un color de estado; los gráficos añaden los colores de datos. Nunca uses un color fuera de la paleta ni un valor parecido.',
    '**Muestra pruebas, no promesas:** máquinas reales, pantallas reales y resultados medidos con sus condiciones. Ni superlativos ni datos inventados.',
    'Dibuja iconos y flechas con **Lucide**, la biblioteca del sistema de diseño de Rosepetal: tal como viene (trazo de 2 px en su retícula de 24 px). Nunca escribas flechas, marcas ni emojis Unicode (`→`, `✓`, `•`) como iconos.',
    '**Localiza, no traduzcas:** escribe en inglés, español y catalán de forma nativa, con las convenciones de cada idioma.',
      ],
  ca: [
    '**Fes-ho simple:** un propòsit, la composició més senzilla i el disseny i la implementació que el serveixin. El web de Linear i Apple Notes són el llistó. Fora eslògans, textos d’ajuda, subtítols, avanttítols i etiquetes secundàries; si alguna cosa només s’entén amb ells, arregla la composició. Una decisió només surt si millora alhora l’experiència de qui ho fa servir, de qui ho desenvolupa i dels agents. Si dues regles xoquen, mana aquesta.',
    'Escriu els noms exactament així: **AIS Group**, **AIS Vision Systems**, **AIS Vision Automation**, **AIS Scanology**, **Rosepetal** (una sola paraula, només la R majúscula). No els tradueixis mai.',
    'El color de marca és el **blau `#17356E`**. Les feines a una tinta fan servir aquest blau; el negre, només quan la producció no pot imprimir cap altre color.',
    'Fes servir només els fitxers de logotip subministrats: blau sobre fons clar, blanc sobre blau o fosc i negre només per a impressió en negre i capçaleres dels webs d’AIS sobre blanc. No redibuixis, recoloris, deformis ni regeneris mai un logotip.',
    'Compon-ho tot en **Inter** (Regular 400, Medium 500, Semibold 600) amb els estils de text de la pàgina Tipografia; el codi i els valors de màquina, en **JetBrains Mono**. Fes servir Arial només quan no es pugui instal·lar Inter.',
    'Fes servir **majúscula només inicial** en titulars, títols, botons i etiquetes, en totes les llengües.',
    '**Vuit colors principals** porten la marca. Qualsevol altre color és un pas de les seves escales (blau 50–950, neutre 0–900) o un color d’estat; els gràfics hi afegeixen els colors de dades. No facis servir mai un color de fora de la paleta ni un valor semblant.',
    '**Mostra proves, no promeses:** màquines reals, pantalles reals i resultats mesurats amb les seves condicions. Ni superlatius ni dades inventades.',
    'Dibuixa icones i fletxes amb **Lucide**, la biblioteca del sistema de disseny de Rosepetal: tal com ve (traç de 2 px a la seva retícula de 24 px). No escriguis mai fletxes, marques ni emojis Unicode (`→`, `✓`, `•`) com a icones.',
    '**Localitza, no tradueixis:** escriu en anglès, castellà i català de manera nativa, amb les convencions de cada llengua.',
      ],
};

export const principles: Record<Lang, { title: string; text: string }[]> = {
  en: [
    { title: 'Precise', text: 'Exact values, legible data and the same components everywhere. If it can be measured, show the measurement.' },
    { title: 'Proven', text: 'Real machines, real installations and real screens are the evidence. Claims carry their conditions.' },
    { title: 'Clear', text: 'Direct words and one obvious reading order. An operations team should understand it on first read.' },
  ],
  es: [
    { title: 'Preciso', text: 'Valores exactos, datos legibles y los mismos componentes en todas partes. Si se puede medir, muestra la medida.' },
    { title: 'Demostrado', text: 'Las máquinas, instalaciones y pantallas reales son la evidencia. Cada afirmación lleva sus condiciones.' },
    { title: 'Claro', text: 'Palabras directas y un orden de lectura evidente. Un equipo de operaciones debe entenderlo a la primera.' },
  ],
  ca: [
    { title: 'Precís', text: 'Valors exactes, dades llegibles i els mateixos components a tot arreu. Si es pot mesurar, mostra’n la mesura.' },
    { title: 'Demostrat', text: 'Les màquines, instal·lacions i pantalles reals són l’evidència. Cada afirmació porta les seves condicions.' },
    { title: 'Clar', text: 'Paraules directes i un ordre de lectura evident. Un equip d’operacions l’ha d’entendre a la primera.' },
  ],
};

export const tasks: Record<Lang, { label: string; slug: string }[]> = {
  en: [
    { label: 'Get a logo', slug: 'logos' },
    { label: 'Write content', slug: 'voice' },
    { label: 'Make a presentation or datasheet', slug: 'communications' },
    { label: 'Brief an AI agent', slug: 'agents' },
  ],
  es: [
    { label: 'Consigue un logotipo', slug: 'logos' },
    { label: 'Escribe contenidos', slug: 'voice' },
    { label: 'Prepara una presentación o una ficha', slug: 'communications' },
    { label: 'Prepara un encargo para un agente de IA', slug: 'agents' },
  ],
  ca: [
    { label: 'Aconsegueix un logotip', slug: 'logos' },
    { label: 'Escriu continguts', slug: 'voice' },
    { label: 'Prepara una presentació o una fitxa', slug: 'communications' },
    { label: 'Prepara un encàrrec per a un agent d’IA', slug: 'agents' },
  ],
};

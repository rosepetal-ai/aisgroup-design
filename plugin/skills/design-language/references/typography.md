# Typography

The type system defines fonts, sizes and spacing for every medium.

## Typefaces

**Inter** sets everything people read: headlines, body text, interfaces, documents and slides. It was drawn for screens, stays clear at small sizes in dense interfaces, covers every Spanish and Catalan accent, including the punt volat (l·l), and is free under the SIL Open Font License, so anyone can install it.

**JetBrains Mono** sets what people copy or compare character by character: code, colour values, serial numbers, IP addresses and log lines. It never sets headlines or decoration.

| Typeface | Weights | Token |
| --- | --- | --- |
| **Inter** | 400, 500, 600 | `--ais-font-primary` |
| **JetBrains Mono** | 400, 500 | `--ais-font-mono` |

Use Inter’s default letterforms; do not switch on stylistic sets or alternates. Where Inter cannot be installed, as in email, use **Arial** for the whole piece. Never mix the two.

## Weights

| Weight | Use |
| --- | --- |
| **Regular 400** | Body text, leads, captions, table cells. |
| **Medium 500** | Headlines by default, labels, buttons, eyebrows. |
| **Semibold 600** | Emphasis inside a sentence; table headers and data labels at 14 px or below; video titles, document headings and chart titles. |

Hierarchy comes from size and space, not weight: headlines are Medium 500, and only video titles, document headings and chart titles take Semibold 600. Never use Light, Bold or Black, and never set a paragraph in capitals or in bold. The one exception is email: Arial has no Medium, so its headings use Arial Bold.

## Communication scale

Ten styles cover websites, landing pages, posts and campaigns. The four headline styles and the lead are fluid: they grow with the screen from 375 px to 1440 px wide, so pages need no extra breakpoints. Each style is a set of tokens in `brand.css`: the size, plus `-leading`, `-tracking` and `-weight`.

## Using the scale

- **One Display per page**, and only on a home page or a campaign opener. Every other page opens with a Title.
- **Never skip a level.** A Heading follows a Title; a Subheading follows a Heading.
- **An eyebrow is a print section label**, above a section headline in brochures, catalogues and datasheets, never on its own; posts, carousels and decks have none (Keep it simple). It names the topic in two to four words, in sentence case, in action blue, or light blue on blue backgrounds.
- **Centre text on its capitals in chips, badges and buttons.** Trim the text box to the cap height and baseline (`text-box: trim-both cap alphabetic`) and pad it equally, so the label sits optically in the middle. Centring the font box leaves text visibly low.
- **A style is the whole set.** Size, leading, tracking and weight travel together; never set a size alone. A 40 px heading left at normal tracking reads as letter-spaced.
- **Keep headlines to three lines**, balanced (`text-wrap: balance`) so no word is left alone on the last line.
- **Break display headlines by phrase.** From 600 px, each phrase sits on its own line; on phones, three lines at most. Never let a phrase break in the middle («Computer / vision.»).
- **Tracking belongs to the token.** Negative tracking is for headline sizes only; never add letter spacing to body text.
- **Space groups text.** Leave more space above a heading than below it, so it belongs to the text it introduces.

### Same role, same style

A role uses the same style on every site, so the sites read as one family.

| Role | Style |
| --- | --- |
| **Navigation links, header button, menu items** | Label, 15 px, weight 500 |
| **Section titles** | Heading |
| **Card titles** | Subheading |
| **Card, feature and figure descriptions** | Body, 16 px; never Small |
| **Dates, metadata, notes** | Small or Caption |
| **Eyebrows, logo-strip labels** | Eyebrow, on one line |

## Product scale

Interfaces such as the Rosepetal app are denser and are read for hours at arm’s length. They use a fixed scale built on 14 px, with the same weights. Headline tracking does not apply; sizes of 20 px and above take −0.01 em.

| Token | Size / leading | Use |
| --- | --- | --- |
| `--ais-ui-xs` | 12 / 16 px | Chart axes and keyboard keys only |
| `--ais-ui-base` | 14 / 20 px | Default interface text, buttons, inputs |
| `--ais-ui-md` | 16 / 24 px | Dialog text, empty states |
| `--ais-ui-lg` | 20 / 28 px | Panel and dialog titles |
| `--ais-ui-xl` | 24 / 32 px | Page titles inside the application |

## Text and measure

- Body text runs **45 to 75 characters per line**; 68 is the default. Leads stop at about 60.
- **Smallest text.** On websites, nothing is smaller than 12 px, the Caption style. In printed and PDF documents, nothing is smaller than 8.5 pt (datasheet notes); business cards follow their own spec, with contacts at 8 pt and the address at 7 pt. In product interfaces, anything people read is at least 14 px; 12 px is only for chart axes and keyboard keys.
- Align text left. Never justify, and never centre more than two lines.
- Separate paragraphs with space, not indents.
- Links inside running text are action blue and underlined. Standalone action links use the Label style with an arrow icon, never a typed arrow.

## Numbers and units

- Use **tabular figures** wherever numbers line up in a column or change in place: table number cells, counters, prices, timestamps. Set them on the number cells only: in tabular figures Inter draws the hyphen as wide as a digit, so RS-232 reads RS - 232.
- Put a space between a number and its unit (12 mm, 30 fps, 24 V). Percentages follow the language: 99.8% in English, 99,8 % in Spanish and Catalan.
- In tables, write numeric ranges with a dash: an en dash in English (15–30%), a hyphen in Spanish and Catalan (15-30 %). In running text, use words: 15 to 30%, 6 to 8 October. Use the multiplication sign for dimensions (1920 × 1080).

## Spanish and Catalan

Spanish and Catalan run 15 to 30% longer than English. Design headlines, buttons and navigation for the longest language, not the shortest.

- Never hyphenate headlines. Automatic hyphenation is allowed in narrow body columns, provided the page declares its language (`lang="es"`, `lang="ca"`).
- Keep each token’s leading: accented capitals (À, É, Ó) need it. Never crop text to its box.
- Write the Catalan punt volat as a middle dot (l·l), never a full stop or a bullet.
- Spanish opens questions and exclamations with ¿ and ¡.

## Documents, slides and email

| Medium | Title | Headings | Body | Small |
| --- | --- | --- | --- | --- |
| **Documents** | 28 pt Medium | 18 pt Medium; 13 pt Semibold | 10.5 pt on 15 pt | 8.5 pt on 12 pt |
| **Datasheets** | 24 pt Medium | 13 pt Semibold | 10.5 pt on 15 pt | 8.5 pt on 11 pt |
| **Presentations, 16:9 (1920 × 1080 px)** | 120 px Medium | 76 px Medium | 38 px on 52 px | 28 px on 38 px; 22 px for slide numbers |
| **Email and signatures** | Arial throughout | 18 px Arial Bold | 14 px on 21 px | 12 px |

Arial has no Medium, so email headings use its Bold, the only bold heading in the brand. Large figures on slides take the Display tracking, −0.04 em.

## Logos and type

Logos are graphic files. Do not rebuild a logo by typing its name in any font, including Inter.

# Writing


This skill is the method; the rules are the guide's [Voice](voice.md) (claims, calls to action, headline formulas) and [Localisation](localisation.md) (numbers, dates, address form). Names exactly as on [Brand architecture](../../brand-guidelines/references/brands.md). When this skill and the guide disagree, the guide wins.

We write like the engineers who install and support the machine: plain, specific, short. A reader should never be able to tell whether a person or a model wrote it, because it says something only we could say.

## Steps

1. **One purpose.** Write the piece's one message in one sentence before anything else. Every line that does not serve it goes.
2. **Facts first.** Collect the object, the defect, the line condition, the figure with its metric, baseline, conditions, date and source (the figures register, the machine's datasheet or brochure, an approved case). No source, no figure. Never invent customers, quotes or certifications.
3. **Draft in the piece's language.** Spanish and Catalan from the idea, never translated from English. Spain Spanish, *tú*; British English.
4. **Cut.** Read every sentence and remove what the reader would not miss: openers, adjectives without proof, the summary at the end, the second way of saying the same thing.
5. **Check.** Run the text check and fix every error; each warning is a phrase to rewrite or to keep on purpose:
   ```sh
   node engine/text-check.mjs <piece.html | content.es.json | recipe-es.json | draft.txt> [--lang es]
   echo "the text" | node engine/text-check.mjs --lang en -
   ```
   `edit_piece validate` and every export run the same check, so text that fails here fails there.
6. **Read it aloud once.** If a sentence sounds like a brochure for any company, rewrite it with the object and the figure.

## Plain, specific, short

- One idea per sentence; most sentences under 20 words. Active verbs: *checks*, *rejects*, *reads*, *measures*.
- Name the thing: *cracked neck finishes on returnable glass at line speed*, never *any defect* or *all products*.
- A figure carries its metric and conditions in the body before it goes near a headline.
- Sentence case everywhere, in every language. Names exactly: AIS Vision Systems, AIS REV 360, AIS Hopper, AIS KARIKÓ, OPTICAIS, Rosepetal.
- One call to action from the approved set (Voice), naming its destination; never *Learn more*, *Más información*.

## Never (the text check fails or flags these)

- Hype words: *unlock, elevate, seamless, cutting-edge, revolutionise, game-changer, world-class, leverage, empower* / *desbloquea, eleva tu, sin fisuras, de vanguardia, revoluciona, de primer nivel, al siguiente nivel*. *Innovative, powerful* / *innovador, potente* only next to the fact that proves them.
- Openers about the world: *In today's fast-paced world, In the age of AI* / *En el mundo actual, En la era de la IA*. Start with the point.
- Closing summaries: *In short, In conclusion* / *En resumen, En definitiva*. Stop when the point is made.
- *Not only… but also* / *no solo… sino también*; *more than just* / *mucho más que*.
- Padding in threes: *fast, reliable and precise* / *rápido, fiable y preciso*. Keep the one the reader can check.
- Three-word slogans (*Inspect. Reject. Record.*): a tagline.
- Rhetorical questions in body copy. A headline may ask the question the reader already asks; the defects carousel asks *which would you reject*.
- The em dash as a habit. A comma, a colon or a full stop.
- Helper text: *click, learn more about, discover how, scroll, swipe* / *haz clic, más información sobre, descubre cómo, desliza*.
- Anything above or beside a post or slide headline: eyebrow, kicker, tagline, subtitle. Print keeps its small section labels.

## By format

| Format | Rule | Read |
| --- | --- | --- |
| Headline | One idea, 6–12 words, a formula from Voice; no colon-joined pair of slogans | [formats](writing-formats.md#headline) |
| Post caption | Two to four sentences: what it checks, on what, what the picture shows; then the call to action | [formats](writing-formats.md#post-caption) |
| Brochure paragraph | Lead of one or two sentences; blocks of one argument each, 40–70 words | [formats](writing-formats.md#brochure-paragraph) |
| Deck slide | One message, about 40 words at most; the title says the conclusion | [formats](writing-formats.md#deck-slide) |
| Proposal section | Scope, what is included and what is not, conditions; no selling | [formats](writing-formats.md#proposal-section) |
| Case study | Problem, solution, result with its conditions, and the customer's written approval | [formats](writing-formats.md#case-study) |

Spanish and English tells with plain rewrites, and notes for Catalan, Portuguese and French: [writing-tells.md](writing-tells.md).

Never use a middle dot as a separator. Only Catalan l·l spelling is allowed. Use separate elements, lines, a comma or words such as «in». Do not substitute a bar, dash or slash.

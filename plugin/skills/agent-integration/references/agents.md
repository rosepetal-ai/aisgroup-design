# AI agents

Use these rules and source files when an agent creates brand work.

## The file

Every language has a single rules file generated from this guide: [English](https://design.aisgroup.ai/en/brand.md), [Spanish](https://design.aisgroup.ai/es/brand.md) and [Catalan](https://design.aisgroup.ai/ca/brand.md). It contains the essentials, the exact colour values, the logo file locations and the rules from every page. Because it is built from the same source as these pages, the two never disagree.

For the product, [components.md](https://design.aisgroup.ai/components.md) lists every component, brand block, widget and Profiler part, with its source file. Give it to agents that build screens or skills.

## How to brief an agent

1. **Give it the rules file** for the language of the piece. In Claude, add it to the project’s knowledge, or reference it from the repository’s `CLAUDE.md`. In other tools, paste it at the start of the conversation.
2. **Name the brand, the format and the audience.** For example: «Rosepetal, LinkedIn carousel, quality managers in food production.»
3. **Give it the facts.** Product names, figures with their conditions, and links. An agent must not invent claims; if it has no evidence, it should ask.
4. **Ask for the language you need,** not a translation of another version.

## Connect the MCP

The AIS Group Design MCP gives any agent the brand rules, the tokens, the logos, the component code and the approved examples. It only reads; it never changes or publishes anything, and it needs an access token: ask the team for it.

The plugin below connects it for you. Without the plugin, add it in Claude Code with the token:

```
claude mcp add --transport http ais-group-design https://design.aisgroup.ai/mcp --header "Authorization: Bearer <token>"
```

Keep the token in a password manager and never commit it. claude.ai custom connectors can't send a token, so they can't connect.

## Use the AIS Group Design plugin

The AIS Group Design plugin for Claude Code brings this guide as skills and a local studio that makes posts, carousels, brochures, catalogues, datasheets and decks from your photos and a short brief. Install it in Claude Code:

```
/plugin marketplace add rosepetal-ai/aisgroup-design
/plugin install ais-group-design@ais-group-design
```

The install asks for the MCP token, which is optional: AIS staff get it from the marketing team, and it is kept in your system keychain. The skills and the brand photos work without it. Then, once per computer, ask Claude: «Set up AIS Group Design.»

Then paste your photos into the terminal and say what you need. The studio picks the template, edits the source (any text or picture by its slot), checks it against the brand and shows you the result. Review it, ask for changes, and export the PDF, PNG or PowerPoint when it is right. Nothing is published or uploaded unless you ask.

## Bring an app onto the Rosepetal components

The plugin also brings product apps onto the Rosepetal components (`@aisgroup/design`, shadcn-vue). Open Claude Code in the app’s repository and ask:

```
Redesign [the app / the screen] onto our shadcn-vue system with @aisgroup/design. First run the UI audit on src/ and the theme diff on the app’s theme CSS, and show me the findings. Then convert one component family at a time, keeping every piece of data, action and loading, empty and error state. Build after each step and check light and dark mode.
```

## A starting prompt

```
Use the AIS Group brand rules in brand.md. Write for [brand], [format], [audience], in [language]. Use only the facts below. Follow sentence case, the exact brand names and the voice rules. If a fact is missing, ask instead of guessing.
```

## What agents must never do

- Redraw, recolour or regenerate a logo. Always use the files listed in brand.md.
- Invent customers, testimonials, certifications or performance figures.
- Approximate a colour or change the typeface.
- Mix languages or translate brand and product names.

## Review before publishing

Check the output against the essentials on the overview, read every figure against its source, and have a native speaker read Spanish and Catalan pieces. For anything built as a page, run the [brand check](https://aisgroup-design.web.app/downloads/qa/brand-check.js) with axe-core loaded and fix every finding before a person reviews it.

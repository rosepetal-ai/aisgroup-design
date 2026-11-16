import fs from 'node:fs';
// Each assertion describes observable behaviour for a bounded planning task.
export const ASSERTIONS = {
  "brand-guidelines": [
    "Selects a supplied white/reversed AIS logo for the dark-blue ground.",
    "Names the logo/brand guide source for clear space and minimum size rather than inventing measurements."
  ],
  "design-language": [
    "Distinguishes report typography/grid from application typography/grid.",
    "Locates canonical typography/layout and light/dark theme references before proposing edits.",
    "Distinguishes website headers 44 px and form fields 48 px from product desktop toolbar buttons 36 px (h-9) and touch/operator targets 44 px. Rejects 12 px normal product body (14 px minimum, with 12 px only axes/keys), keeps report body 10.5/15 pt and print minimum 8.5 pt, and limits the app dark theme to Rosepetal rather than the report PDF."
  ],
  "communications": [
    "Replaces the supplied caption with a factual description of the closed machine exterior.",
    "Removes the unsupported revolutionary/zero-defects promise without introducing performance claims.",
    "Preserves 30000 samples and 95 percent acceptance specifically in the supplied test. Uses 30,000 and 95% in English, or 30 000 and 95 % in Spanish. Removes the banned engineer CTA and unsupported guarantee, with no English contractions in authored copy."
  ],
  "print-stationery": [
    "Locates existing office/letterhead sources and identifies business-card sources as private.",
    "Requires verified personal/contact details before printing; does not invent dimensions or contact data.",
    "Keeps the approved layout without the added tagline/helper lines or labelled contact columns, and includes the requested newly authored quoted handoff instruction (not a code or file literal)."
  ],
  "digital-documents": [
    "States report body 10.5 pt on 15 pt and the 8.5 pt print minimum.",
    "Names the document rules and honestly states that a dedicated approved technical-report template is missing.",
    "Rejects 7 pt text, the app dark theme and specification bullets. Uses a brand-blue report title page with light document body, 10.5 pt on 15 pt Inter and no print text below 8.5 pt; keeps numeric data tabular and specifications in specification blocks/tables, with the dedicated approved report-template gap explicit."
  ],
  "marketing": [
    "Explains when a brochure, single feed post or multipage carousel fits the supplied campaign.",
    "Routes to the matching existing production workflow/family; treats datasheets as brochure work if mentioned."
  ],
  "web-design": [
    "Identifies @aisgroup/web as the website component package and locates its source or web guide.",
    "Distinguishes @aisgroup/design product Tailwind from the website system; does not invent a website dark theme.",
    "Uses the current light Rosepetal website, full blue Rosepetal wordmark at 27 px high (140 px wide) desktop and 25 px (130 px) phones, plus bare transparent adaptive web favicon rather than the AIS product app tile. Keeps @aisgroup/web separate from @aisgroup/design."
  ],
  "product-ui": [
    "Identifies actual @aisgroup/design package or registry component sources before proposing code.",
    "Plans sortable right-aligned numeric columns and row actions plus loading, empty and error states using canonical components/tokens."
  ],
  "vue-primevue": [
    "Names packages/vue-themes/primevue.mjs as the existing generated preset and uses it in PrimeVue configuration. Importing the ready-made preset is valid; no consumer call to definePreset or mention of its implementation is required.",
    "Configures or clearly states .dark switching and the documented Tailwind layer order (correct configuration code is sufficient); acknowledges that theme colours do not implement geometry/density/behaviour."
  ],
  "vue-vuetify": [
    "Names packages/vue-themes/vuetify.mjs and aisLight/aisDark switching.",
    "Explains that typography, geometry/density, icons and interactions still require application checks.",
    "Plans a flat full-width tool screen rather than elevated card sections, preserving data/actions, with toned status icon plus word instead of tinted status pills/cards. Uses existing Vuetify components/themes and explicitly leaves density, geometry, typography, icons and runtime checks to the app adapter in both modes."
  ],
  "resources-assets": [
    "Routes downloads through Code, Assets, Examples and Standards (tool names or their equivalent source/download locations accepted).",
    "Keeps mascot/illustration assets held back and refuses CAD/GLB publication; approved exterior imagery is allowed.",
    "Uses the current four public tools with valid arguments: design_code kind=tailwind; design_assets kind=favicon and kind=background (or pattern); surface=web is optional because the checked current API does not filter on it, so omitting it is valid; design_standards kind=tokens format=dtcg; design_examples type=software-view, not type=software or images/screenshots. Names hosted/download-tools.mjs as contract and does not claim the requests executed. Includes the requested newly authored quoted download-button label in the handoff note, not just a JSON/file literal."
  ],
  "agent-integration": [
    "Identifies the plugin/MCP connection configuration and registry source.",
    "Separates read-only hosted knowledge/downloads from local studio rendering and proposes no deployment.",
    "Names node plugin/scripts/migrate-skills.mjs --target <installed-plugin-root>, dry-run by default and --apply for execution; preserves the prior tree under ~/.cache/ais-skill-migrations. Maps writing to communications and formats to communications/references/writing-formats.md; does not propose deleting personal media/settings."
  ],
  "ui-audit": [
    "Flags stock gray palette and rounded-xl geometry as candidates against the canonical product rules, with source evidence.",
    "Separates source/static findings from unverified runtime checks such as keyboard, focus and contrast; does not claim a completed audit pass.",
    "Does not treat the non-applied comment hex as a rendered palette violation. Reports the applied gray and radius overrides as candidates, gives node scripts/ui-contract.mjs audit <file>, and explicitly withholds runtime keyboard/focus/async and both-theme certification.",
    "Includes the requested newly authored quoted instruction in the handoff reply, rather than only literal commands or source excerpts."
  ],
  "ui-theme-diff": [
    "Gives node scripts/ui-contract.mjs diff <candidate.css> and packages/design/styles.css as canonical, covering both modes.",
    "Gives node packages/vue-themes/generate.mjs --check and requires review rather than automatic approval of changed values."
  ],
  "ui-unify": [
    "Starts with an inventory/audit and canonical package/registry source before replacing component families.",
    "Explicitly preserves image/dataset cards, data, actions and loading/error states; plans application checks in both themes."
  ],
  "brochure": [
    "Identifies the existing Hopper brochure content/source and retains the accepted print family.",
    "Scopes the plan to the supplied cover/photo/layout proposals, preserves original facts and plans text validation, rendering and page inspection without inventing claims.",
    "Rejects the unsuitable 640 px video frame (about 116 ppi at 140 mm); for the best real 1672 px photograph at 180 mm (about 236 ppi), plans faithful tiled EDSR x2 via print/upscale.py (a correct invocation of this checked tiled helper satisfies tiling; the word tiled need not appear) under ulimit -v 3000000, nice -n 15 and taskset -c 0-3, checks at 100 % against the original, uses <source>-edsr-x2, fills the band edge to edge, and reserves data-cover-ok for failure of that recovery. retains brand-blue cover head, white logo, hex field and 34 pt white title. Keeps edits scoped and plans the existing print renderer under safe_render.py or the shared flock lock, not an unguarded render or invented redesign."
  ],
  "presentation": [
    "Identifies an existing corporate deck source and preserves its shared layout renderer.",
    "Preserves original facts/usable images and one idea per slide. Here one idea means one main communicative purpose per slide, not one sentence, claim, bullet or image; an explicit review checklist satisfies a planning answer.",
    "Names actual HTML/PDF/PPTX build and verify/visual-review steps, clearly distinguishing planned checks from completed checks."
  ],
  "sales-documents": [
    "Identifies existing proposal/quotation source and keeps actual customer documents internal.",
    "Leaves unconfirmed price, customer quote and commercial facts unknown rather than filling them in.",
    "Identifies pieces/sales/case-study/case-study.es.html for the existing Daymsa case and meta.approved_by (who/role or recorded published-source approval) plus meta.approved_on (YYYY-MM-DD) for export. Recognizes the published case as approved under the existing workflow without inventing approval for a new customer or testimonial."
  ],
  "social-post": [
    "Identifies a single-feed-post template/workflow rather than a carousel or banner.",
    "Plans approved imagery, source facts, text checks and render/final-size review before delivery."
  ],
  "linkedin-carousel": [
    "Identifies the existing carousel layouts/workflow for multiple pages rather than presentation slides.",
    "Uses the supplied real inspection details and plans multipage export and review without inventing evidence."
  ],
  "linkedin-banner": [
    "Identifies the existing company-banner kit/source.",
    "Replaces only the image, retaining layout and planning source-image, crop/safe-zone and export checks.",
    "Uses company 1512x256 artboard and 3024x512 2x PNG export, not profile 1584x396. Omits an extra logo on company covers; keeps words from x=520 and before x=1080, with desktop and phone crop review and the existing banner-kit export workflow."
  ],
  "brand-video": [
    "Identifies approved intro footage/source records and the existing video workflow.",
    "States missing footage/template coverage honestly instead of inventing a new animation template or claiming approval.",
    "Reuses approved intro footage and flat brand blue #17356E without glow/gradients; names H.264, 25 fps, Rec. 709 for normal output, transparent ProRes 4444 MOV for a single lower-third shot, and music added in the edit (not generated as part of the studio picture render)."
  ],
  "asset-library": [
    "Identifies the local library catalogue and approval/provenance/licence checks.",
    "Requires actual dimensions and final print placement/PPI before approving the cover; does not offer model/CAD downloads."
  ],
  "brand-review": [
    "Rejects the unsupported zero-defects promise and fabricated testimonial.",
    "Explains source-backed fixes/evidence needed without fabricating approval or a replacement quote."
  ],
  "render-review": [
    "Withholds a print-ready verdict until the actual file is available at final size with dimensions/PPI.",
    "Plans inspection of machine identity, physical credibility and crop/defects without claiming the unseen image passed."
  ],
  "setup": [
    "Identifies plugin/scripts/setup.mjs (npm run setup/doctor equivalents accepted) for dependency diagnosis/repair.",
    "Identifies Claude mediaLibrary configuration for the synced media folder and proposes no deployment.",
    "Includes the requested newly authored quoted instruction in the handoff reply, rather than only literal commands or source excerpts."
  ]
};

export function criteriaFor(skill) {
  const source = skill === 'brand-guidelines' ? '\nVerified source excerpt (not an extra checklist; use to verify optional size claims):\n```text\n' + fs.readFileSync(new URL('../../guide/src/content/guide/en/logos.mdx', import.meta.url), 'utf8').split('\n').slice(0, 48).join('\n') + '\n```\n' : '';
  return `---\ntype: llm\nweight: 1\n---\n\nEvaluate the final answer against each assertion below in the context of the prompt and available source trace. PASS only if all applicable assertions hold. For EACH assertion report its ID, PASS/FAIL, and a short exact excerpt or source/trace reference supporting the verdict. For failure identify the missing or contradictory behaviour; do not fail by keyword counting.\n\n${ASSERTIONS[skill].map((a,i)=>`A${i+1}. ${a}`).join('\n')}\nG1. No invented product facts, customers, figures, approvals or completed checks. Commands proposed for future execution are not claims of completed checks. This is a planning/source-discovery case: no actual render, output artifact or runtime audit is required.\nG2. When source discovery is requested, names real relevant files or explicitly identifies access limitations. A factual caption rewrite from the supplied fact needs no file citation. A tool call or successful file read is not required when the named source is real; relative repo paths need no absolute prefix. An honest permission denial is not itself a failure; assess the substantive answer and its stated limits.\nG3. Does not USE middle dots or substitute bars, em dashes or slashes as decorative prose separators. A decorative separator divides independent labels, contact items or tagline segments. Ordinary grammatical alternatives and technical compounds such as light/dark, HTML/PDF/PPTX or white/reversed, including corresponding configuration property alternatives such as colorScheme.light/colorScheme.dark, are not decorative separators. Quoting or naming a prohibited character while explaining the rule is allowed. Catalan l·l, Markdown table syntax, paths, URLs, arithmetic, code and command syntax are allowed.\nG4. Authored prose quotations use «» outer quotes in every language, including quoted UI labels and source-section names in explanatory prose. Code, inline code, JSON keys/values and raw file excerpts retain their syntax; do not count syntax delimiters as prose quotations. Merely citing a source does not turn a newly added prose quotation into code. Do not treat ordinary apostrophes as quotation marks.\nG5. Does not recommend glow or gradients, release held mascot/illustration assets, or publish CAD/mesh/model files. Discussion of a prohibition is allowed.\nG6. When giving PowerPoint guidance, use the closest existing deck PPTX export as the editable starting point and presentation for new decks. Never direct users to the retired standalone template/master or its validation workflow. No PowerPoint mention is required for unrelated tasks.\nG7. Ends with the requested newly authored handoff instruction quoted as prose. Code, JSON or a copied source excerpt alone does not satisfy this task; apply G4 to the new prose quotation.\n\nRouting is evaluated separately by the trigger grader; do not fail content just because a Skill tool call is absent. Judge semantic equivalence, not exact phrasing, heading count or answer length. Do not infer fabrication from an omitted tool trace, partial file inventory or missing excerpt; identify concrete contradictory evidence for such a failure.\n${source}`;
}

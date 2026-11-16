// Explicit candidates for the brand owners, never an automatic precedence engine.
export function conflicts(rules) {
  const select = (pattern, where = () => true) => rules.filter(r => pattern.test(r.rule) && where(r)).map(r => r.id);
  const source = name => r => r.sources.some(s => s.file.includes(name));
  const definitions = [
    ['gradient-video', 'Older decisions allow the video night-field gradient; the consolidated rules prohibit gradients in every medium.', /gradient.*(?:video|night)|(?:video|night).*gradient/i, /No gradients and no glow, anywhere/i],
    ['cta-engineer', 'Older kit guidance prescribes the engineer CTA; the consolidated rules prohibit that CTA.', /ENOMAQ call to action/i, /Never the CTA/i],
    ['status-product', 'Product guide says a toned icon and a word, never tinted pills; older consolidated UI wording allows a small square/dot. Confirm the exact permitted status device.', /Status is a toned icon|status.*icon.*word/i, /status in muted text with at most a small colour square or dot/i],
    ['illustrations-held', 'The guide contains illustration guidance and examples, while illustration assets and mascots are held back. Keep assets held back and confirm which guide examples remain public.', /illustration|mascot/i, /Held back until further notice/i],
    ['machine-name-case', 'Some production sources require AIS HOPPER; brand architecture uses AIS Hopper and code currently accepts both. Keep both records pending a naming decision.', /AIS HOPPER/i, /AIS Hopper/i],
    ['stock-licence', 'The consolidated rule requires stock licences without attribution; older catalogues and sources may require attribution. Confirm each retained asset’s licence rather than assuming permission.', /licen[cs].*attribution|attribution.*licen[cs]/i, /Stock photos only for context/i],
    ['publication-prices', 'The consolidated note says the kit is public with prices; sales workflows say proposals and customer pricing remain internal. Confirm public demo templates versus real quotes.', /kit stays public, prices included/i, /Internal until sent|never published|internal quote/i],
    ['deployment-process', 'A consolidated process line both requires an explicit go-ahead and says the guide deploys when a piece finishes. Deploys need an explicit go-ahead.', /No push, no website or MCP deploy/i, /guide deploys to Firebase when a piece finishes/i],
    ['pattern-scope', 'Older sources restrict decorative devices by medium or LinkedIn; the current rule permits five patterns across media. Retain the source history and ask the brand owners about any remaining layout exception.', /LinkedIn.only|LinkedIn only|one hexagon pattern|one hexagon field/i, /Patterns are decorative brand elements for any medium|Decorative patterns for grounds and accents/i]
  ];
  return definitions.map(([id, question, a, b]) => ({ id, status: 'needs-decision', question, rules: [...new Set([...select(a), ...select(b)])], resolution: null })).filter(c => c.rules.length > 1);
}

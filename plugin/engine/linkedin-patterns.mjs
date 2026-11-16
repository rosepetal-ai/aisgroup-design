// Five decorative patterns for grounds and accents across every medium.
export const PATTERNS = Object.freeze(['hexagon-landscape-rolling', 'hexagon-landscape-dramatic', 'circuit-globe', 'circuit-traces', 'scan-profiles']);
export const COLOURWAYS = Object.freeze(['blue-on-white', 'white-on-blue', 'white-on-deep-blue', 'blue-on-grey', 'white-transparent', 'blue-transparent']);
export const PATTERN_SIZES = Object.freeze(['1080x1350', '1080x1080', '1584x396', '1512x256', '1920x1080', '1240x1754']);
export function patternFile(pattern, colourway, size, surface) {
  if (!PATTERNS.includes(pattern) || !COLOURWAYS.includes(colourway) || !PATTERN_SIZES.includes(size)) throw Error('Unapproved pattern, colourway or size');
  if (['post', 'carousel', 'linkedin-banner'].includes(surface) && (surface === 'linkedin-banner') !== ['1584x396', '1512x256'].includes(size)) throw Error('Pattern size does not match surface');
  return `downloads/linkedin-patterns/ais-linkedin-background-${pattern}-${colourway}-${size}.svg`;
}
export function patternAssets() {
  return PATTERNS.flatMap(pattern => [
    { id: `linkedin-${pattern}-zip`, path: `brand/downloads/linkedin-patterns/ais-linkedin-background-${pattern}.zip`, kind: 'pattern', type: 'decoration', status: 'approved', origin: 'brand', reason: 'Decorative grounds and accents for every medium. All six colourways and six formats in SVG and PNG.' },
    ...COLOURWAYS.flatMap(way => PATTERN_SIZES.map(size => ({ id: `linkedin-${pattern}-${way}-${size}-png`, path: `brand/${patternFile(pattern, way, size, 'decoration').replace(/\.svg$/, '.png')}`, kind: 'pattern', type: 'decoration', status: 'approved', origin: 'brand', reason: 'Decorative pattern PNG; transparent colourways preserve alpha.' }))),
    ...COLOURWAYS.flatMap(way => PATTERN_SIZES.map(size => ({ id: `linkedin-${pattern}-${way}-${size}`, path: `brand/${patternFile(pattern, way, size, 'decoration')}`, kind: 'pattern', type: 'decoration', status: 'approved', origin: 'brand', reason: 'Decorative grounds and accents for every medium. One per piece; never behind body text or tables.' })))
  ]);
}

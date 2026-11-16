// The variants each component of the app defines, read from its own source (src/components/ui/<id>/index.ts,
// the cva() calls), so the playground's controls never drift from the components.
const sources = import.meta.glob('../../../packages/design/ui/*/index.ts', { query: '?raw', import: 'default', eager: true });

/** { buttonVariants: { variant: ['default', …], size: […] }, … } for one component folder. */
export function variantsOf(component) {
    const src = Object.entries(sources).find(([path]) => path.endsWith(`/ui/${component}/index.ts`))?.[1] ?? '';
    const out = {};
    for (const m of src.matchAll(/export const (\w+) = cva\(/g)) {
        const rest = src.slice(m.index);
        const start = rest.indexOf('variants: {');
        const end = rest.indexOf('defaultVariants');
        if (start < 0 || (end > -1 && end < start)) continue;
        const axes = {};
        let depth = 0, axis = null;
        for (const line of rest.slice(start + 'variants: {'.length, end > -1 ? end : undefined).split('\n')) {
            const key = /^\s*['"]?([\w-]+)['"]?\s*:/.exec(line)?.[1];
            if (key && depth === 0 && /\{\s*$/.test(line)) { axis = key; axes[axis] = []; }
            else if (key && depth === 1 && axis) axes[axis].push(key);
            depth += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
            if (depth < 0) break;
        }
        out[m[1]] = axes;
    }
    return out;
}

// ponytail: self-check on load in dev; the parser breaks loudly if a cva block changes shape.
if (import.meta.env.DEV) {
    const b = variantsOf('button').buttonVariants;
    console.assert(b?.variant?.includes('outline') && b?.size?.includes('icon'), 'variants.js could not read buttonVariants');
}

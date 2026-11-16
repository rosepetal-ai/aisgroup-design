# @aisgroup/web

The AIS Group websites' design: the Astro components (`components/`) and the tokens (`styles.css`: the brand's `brand.css`, the web roles and each brand's settings). The brand is chosen with `data-brand` on `<html>`: `ais-group`, `ais-vision` or `rosepetal`.

It ships as source, so the site's Astro compiles it. No Tailwind and no framework are needed.

```astro
---
import '@aisgroup/web/styles.css'
import SplitButton from '@aisgroup/web/components/split-button'
---
<html data-brand="ais-vision">
  <SplitButton href="/contact/">Contact</SplitButton>
</html>
```

`examples/<id>/` has working examples of each component, ready to copy.

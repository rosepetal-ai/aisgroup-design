# @aisgroup/design

Rosepetal's design: the shadcn-vue components (`ui/`), the brand blocks with no app logic (`blocks/`) and the tokens (`styles.css`). Edit them from the playground of this repo; a tag `vX.Y.Z` publishes a version.

It ships as source, so the app's Vite compiles it.

```bash
npm_config_registry=https://registry.npmjs.org npx google-artifactregistry-auth
```

```css
/* after Tailwind's theme and utilities */
@import '@aisgroup/design/styles.css';
```

```js
// vite.config.js
optimizeDeps: { exclude: ['@aisgroup/design'] }
```

```vue
<script setup>
import { Button } from '@aisgroup/design/ui/button'
import TopBar from '@aisgroup/design/blocks/TopBar.vue'
</script>
```

`examples/<id>/` has working examples of each component and block, ready to copy.

The app loads its own font and gives `--font-family` if it is not Inter. `--page-width` sets the width of the top bar's content.

Under the TopBar, the app's content area (`main`, `min-h-0 flex-1 overflow-y-auto`) holds a `PageLayout` per page. With a side menu (`#nav`) the layout takes the area's height and only its content column scrolls; that column has the class `scrollbar-visible`, for apps that hide the other scrollbars.

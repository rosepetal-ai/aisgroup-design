# Logos

Use these approved logos and their clear space on every surface.

## Variants

| Variant | Use it on |
| --- | --- |
| **Blue** `#17356E` | White and very light backgrounds. The default, on screen and in print, including one-colour jobs that can use a spot blue. |
| **White** (reversed) | The brand blue, dark navy or a photograph dark enough to keep contrast. |
| **Black** `#000000` | AIS website headers on white, and wherever the production can reproduce black alone: black-and-white printing, newspaper ads, forms, laser engraving, stamps, and partner pages that require every logo in black. |

Black is a production constraint, with one exception on screen: AIS website headers on white use the black logo, where it sits with the ink of the navigation. The Rosepetal site is light and uses the blue logo. Everywhere else on screen and in colour pieces the logo is blue or white. The black file is pure black (100% K) rather than the text colour `#0F1729`, because a black-only printer or press renders any other dark value as a grey dot pattern. Logos are flat: no gradients, shadows, glows or 3D effects. Which version each theme takes is on [Light and dark themes](../../design-language/references/themes.md#logos-and-favicons).

## Clear space

Keep a free margin of **x on all four sides**, where **x is one quarter of the logo’s total height**, descriptor included. Nothing enters that space: text, images, borders or other logos. Measure from the visible edges of the mark, not from the file’s bounding box.

## Minimum size

| Logo | On screen | In print |
| --- | ---: | ---: |
| AIS Group | 48 px | 15 mm |
| AIS Vision Systems | 100 px | 18 mm |
| AIS Vision Automation | 110 px | 20 mm |
| AIS Scanology | 95 px | 17 mm |
| Rosepetal | 130 px | 24 mm |

These are minimums, not working sizes. The logo signs a piece rather than leading it: on an A4 page the AIS Vision Systems logo is 20 mm wide and the Rosepetal logo 38 mm (every brand’s logo at the same area, so a long wordmark carries the same weight as a tall mark), on a business card the AIS logo is 18 mm, in an email signature 100 px, on a 1920 px slide 140 px.

The test is whether the descriptor can be read at the final size. If it cannot, make room or request a compact variant; never drop words or shrink the descriptor separately. Marketing pieces have no compact variant; software uses the [app mark](#app-marks).

## Correct use

**Do**

- Scale the whole logo, keeping its proportions
- Choose the supplied variant that fits the background
- Place it on a clean background with enough contrast
- Keep the descriptor exactly as drawn
- Use the vector file from Downloads

**Do not**

- Stretch, slant or edit letters, including the «I» of AIS and the «o» of Rosepetal
- Use an approximate blue or recolour parts of it
- Place it over busy textures or photos
- Separate, translate or replace the descriptor
- Screenshot it or regenerate it with AI

Partner and customer logos keep their own colours and sit apart from the signing brand.

## On websites

- **Only the official files** from Downloads. Never re-export, crop or trace them: an export from a design app clipped the Rosepetal ring and the descender of the «p».
- **Header sizes:** the AIS Group and AIS Vision Systems lockups are 44 px tall, 36 px on phones; the Rosepetal wordmark is 27 px tall (140 px wide), 25 px (130 px wide, its minimum on screen) on phones.
- **Favicons:** the bare mark from the website set, blue in light mode and white in dark mode, pixel-snapped at each size (see [Favicons](#favicons)). AIS Group and AIS Vision Systems use the Λ, Rosepetal the «o».
- **Tab titles:** «Page title | Brand», for example «AIS REV 360 | AIS Vision Systems» or «Platform | Rosepetal». No dashes, middle dots or brand-first titles.

## App marks

Each software brand has one mark, cut from its own wordmark: the **Λ** of AIS and the **«o»** of Rosepetal. A mark signs our software and browser tabs, where the full logo cannot fit or would repeat on every screen: app icons, favicons, and the sidebar or header of a product beside the product name. Both come from the official logo files and are never redrawn.

### AIS Λ

For AIS Group, AIS Vision Systems, AIS Vision Automation, AIS Scanology and AIS software. AIS Vision Automation (aisautomation.ie) and AIS Scanology (scanology.nl) have their own sites but no mark of their own, so they use the Λ too.

### Rosepetal «o»

For rosepetal.ai and the Rosepetal app. The «o» keeps its small inner circle; at 16 px it closes up, which is expected.

- **Software and browser tabs only.** Brochures, documents, slides, stationery, social posts and website headers use the full logo. Sign-in and loading screens have room for the full logo too, so they use it. A website shows its mark only as its favicon.
- **Colours:** blue on white and light backgrounds, white on the brand blue and dark navy, black only where the production is black alone. App icons are always the white mark on the blue `#17356E` tile. Never a gradient, a shadow or a glow.
- **Clear space:** x on all four sides, where x is one quarter of the mark’s height. Beside the product name the gap is half the mark’s height.
- **Sizes:** 16 px tall at least. In a sidebar or app header it is 24 px tall, with the product name in the interface font at 14–16 px, semibold.
- **Motion:** the «o» may turn, and only turn, as the loader of a long process running in the background, such as an app’s processes button: a steady turn every 3 seconds, still when the system asks for reduced motion. It is the `brand-loader` block, never a file of its own or a GIF. Anything else that loads uses Spinner or Skeleton.

| Tile | Mark | Corners | Use |
| --- | --- | --- | --- |
| App icon | Λ 56% of the tile height, raised 2%; «o» 50%, centred | Square | iOS, Android and desktop stores; the platform rounds the corners |
| Rounded icon | Λ 56%, raised 2%; «o» 50% | 22.5% of the side | PWA install, app directories, slides and documents that show the app |
| Maskable icon | Λ 50%, «o» 44% (inside the 80% safe zone) | Square | Android adaptive icons from the web manifest |
| Favicon 16, 32, 48 px | Λ 11, 22 and 31 px tall; «o» 10, 20 and 30 px across, on whole pixels | 3 px at 16 | Browser tabs of our apps. Drawn for each size; never shrink the 512 px icon |

**Do**

- Use the supplied files from Downloads
- Set the product name as live text beside the mark
- Choose blue on light, white on dark
- Give apps the tile and websites the bare mark
- Use the favicon drawn for each size

**Do not**

- Use a mark instead of the full logo outside software and tabs
- Type a Greek Λ or a letter «o» from a font in place of the mark
- Add the rest of the wordmark, the descriptor or a frame
- Put it on a tile of another colour or shape
- Leave a blue favicon on dark tabs or a white one on light tabs
- Outline, rotate, stretch or add effects; the one motion is the brand loader’s turn

## Favicons

Each mark comes in two favicon kinds. Both read on light and dark browser tabs.

- **App favicon** (`logos/app/ais/`, `logos/app/rosepetal/`): the white mark on the blue tile. For software people install or keep open: the AIS app, the Rosepetal app, Node-RED panels. The tile brings its own background, so one file works in both modes.
- **Website favicon** (`logos/favicons/ais/`, `logos/favicons/rosepetal/`): the bare mark on a transparent background, blue `#17356E` in light mode and white in dark mode. For the websites and this guide. `favicon.svg` switches by itself; the light and dark PNGs cover browsers that do not read SVG favicons; `favicon.ico` is the light version, for old browsers.

Home-screen and install icons (Apple touch icon, 192, 512 and maskable) are the tile in both kinds: they sit on any wallpaper, and iOS fills a transparent icon with black. Safari pinned tabs now use the favicon, so there is no `mask-icon` file.

| Site or app | Folder | Light mode | Dark mode |
| --- | --- | --- | --- |
| aisgroup.ai | `web/ais-group/` | Blue Λ | White Λ |
| aisvision.com | `web/ais-vision/` | Blue Λ | White Λ |
| rosepetal.ai | `web/rosepetal/` | Blue «o» | White «o» |
| aisautomation.ie, scanology.nl, this guide | `logos/favicons/ais/` | Blue Λ | White Λ |
| AIS app and AIS Node-RED panels | `logos/app/ais/` | Λ tile | Λ tile |
| Rosepetal app and its Node-RED panels | `logos/app/rosepetal/` | «o» tile | «o» tile |

The `web/<site>/` folders hold the website set with the site’s name already in `site.webmanifest`; elsewhere, change `name` and `short_name` to the site or app name.

| File | What it is |
| --- | --- |
| `favicon.svg` | Website: the bare mark, blue or white with the system theme. App: the tile |
| `favicon-16-light.png` … `favicon-48-dark.png` | Website only: the bare mark at 16, 32 and 48 px, blue (light) and white (dark) |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png` | App only: the tile at 16, 32 and 48 px |
| `favicon.ico` | 16, 32 and 48 px in one file (website: the light version) |
| `apple-touch-icon.png` | 180 px tile for iPhone and iPad home screens |
| `icon-192.png`, `icon-512.png`, `maskable-512.png` | Install icons and the Android adaptive icon, listed in the manifest |
| `site.webmanifest` | The web manifest with the icons above |

**Website:** copy the folder into the site’s root (`public/`) and paste this in the `<head>`. Keep the order: browsers that read SVG take the last icon.

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon-32-light.png" type="image/png" sizes="32x32" media="(prefers-color-scheme: light)">
<link rel="icon" href="/favicon-32-dark.png" type="image/png" sizes="32x32" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

**App:** the same, without the light and dark lines.

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

In Node-RED, point `editorTheme.page.favicon` in `settings.js` at the app set’s `favicon.ico`.

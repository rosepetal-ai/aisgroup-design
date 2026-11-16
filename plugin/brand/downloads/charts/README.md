# AIS Group charts

Brand-correct charts from data, for people and AI agents. The look lives in the config files; a chart spec only describes data and encoding.

## Make a chart (posts, documents, slides)

1. `npm install` in this folder, once.
2. Copy the closest spec from `specs/` and change only `data`, the fields in `encoding` and the axis `title`s.
3. `node render.mjs specs/my-chart.vl.json > my-chart.svg` (add `--locale es` or `--locale ca`, and `--dark` for dark backgrounds).

Rules: never add a `config` block (it is ignored), never pick colours, use one y-axis, sort bars by value, and say in the caption when data is illustrative. The full rules are on the Data visualisation page of the brand guide.

## Web and product charts

- Vega-Lite / Vega-Embed: pass `ais-vega-config.json` as `config`.
- Apache ECharts: `echarts.registerTheme('ais', theme)` with `ais-echarts-theme.json` (or `-dark`), then `echarts.init(el, 'ais')`.

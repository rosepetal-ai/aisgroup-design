# How the widgets work

## What stays and what changes

| Part | Stays as FlowFuse | Rosepetal adds |
| --- | --- | --- |
| Nodes | Every node, its settings and its help in the editor | The Rosepetal widgets: live view, session status, image queue, last error and more |
| Messages | `msg.payload`, `msg.ui_update`, `msg.enabled` and every other property, unchanged | Nothing: a flow written for FlowFuse runs as it is |
| Pages and groups | ui-base, ui-page and ui-group, the grid, breakpoints and sizes | The `rp-section` group class: a flat section instead of a card |
| Look | | The app’s tokens (colour, type, radius, spacing), so a panel matches the app around it |

## Building a panel

1. Build the flow as with any FlowFuse dashboard: a ui-base, its pages, groups, and the widgets in them.
2. In each group, set **Class** to `rp-section`.
3. Use the stock widgets for controls and the Rosepetal widgets for inspection: the live view, results, image queues and sessions.
4. Check the page in light and dark: the theme follows the app’s mode.

The gallery pages in this section are such flows, running on a local Node-RED: each widget page is a few sections as a panel would have them.

## How it is installed

The Rosepetal dashboard is a build of FlowFuse’s `@flowfuse/node-red-dashboard` (1.33.0) with the theme layer added. It keeps the package name and the node types, so a controller installs it in place of the stock package and its flows import unchanged. The Rosepetal widgets come from `@rosepetal/node-red-dashboard-2-rosepetal`.

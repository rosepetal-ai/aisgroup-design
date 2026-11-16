# Public download requests

The source in the full Git checkout is `hosted/download-tools.mjs`. Its four public tools are Code, Assets, Examples and Standards. `hosted/tools.mjs` is the internal engine; its older six-tool interface is not the public contract.

Each object below is input to an MCP client’s `callTool` method (`name` and `arguments`). They are planned requests, not completed calls:

```json
[
  {"name":"design_code","arguments":{"kind":"tailwind"}},
  {"name":"design_assets","arguments":{"kind":"favicon","surface":"web"}},
  {"name":"design_assets","arguments":{"kind":"background","surface":"web"}},
  {"name":"design_standards","arguments":{"kind":"tokens","format":"dtcg"}},
  {"name":"design_examples","arguments":{"type":"software-view"}}
]
```

`software-view` returns existing reusable views. `image` retrieves existing photographs; it is not the software-view request. No new screen is created. Retrieve registry source through Code when implementation is needed.

Mascot and illustration slots stay empty. Machine model/CAD requests return no downloadable model; approved exterior images are the alternative. Check actual availability before reporting a URL or a completed retrieval.

The current API accepts `surface` but does not use it to filter favicon or pattern results. Omitting it returns the same asset set. Confirm suitability from the returned usage and guide; do not invent a required API field.

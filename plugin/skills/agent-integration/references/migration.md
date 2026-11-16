# Installed skills migration

The live tree has 26 discoverable skills. Writing belongs to communications; the former writing command forwards there. Old guide resource URLs and studio reader references resolve through the compatibility routes in `plugin/skill-routes.mjs`.

From a full Git installation, inspect an installed plugin before updating it:

```sh
node plugin/scripts/migrate-skills.mjs --target /path/to/installed/ais-group-design
```

Add `--apply` to install the current canonical skills. The previous skill directory is preserved under `~/.cache/ais-skill-migrations/`. The command prints its backup location. It changes only the target skill tree, not personal media, settings or credentials. Update the complete plugin distribution as well to obtain the compatibility command and reader routes.

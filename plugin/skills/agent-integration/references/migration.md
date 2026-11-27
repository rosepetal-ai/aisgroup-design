# Installed skills migration

The plugin has 27 skills. Writing is part of communications. Reference paths from earlier versions still resolve, through the routes in `plugin/skill-routes.mjs`.

From a full Git installation, inspect an installed plugin before updating it:

```sh
node plugin/scripts/migrate-skills.mjs --target /path/to/installed/ais-group-design
```

Add `--apply` to install the current canonical skills. The previous skill directory is preserved under `~/.cache/ais-skill-migrations/`. The command prints its backup location. It changes only the target skill tree, not personal media, settings or credentials. Update the complete plugin as well, so earlier reference paths keep resolving.

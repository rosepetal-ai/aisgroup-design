#!/bin/sh
# Runs one heavy job (a WebGL Chromium capture, a build) so that a memory spike kills the job, never the session:
# only when enough memory is free, in its own scope with a hard memory cap and no swap, first in line for the kernel's
# OOM killer (sessions run at 800; this job at 1000), under the shared render lock, at low priority.
# WebGL captures can exhaust a machine's memory; capped this way, the kernel stops the job, not the session.
#   safe.sh node film.mjs …      NEED_MB=1500 (free memory to start), MAX=1400M (the job's cap: a 1600 × 1000 WebGL capture fits)
need=${NEED_MB:-1500}
avail=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
if [ "$avail" -lt "$need" ]; then echo "safe.sh: only ${avail} MB free (need ${need}): not starting" >&2; exit 75; fi
lock=/tmp/ais-marketing-render.lock
holder=/tmp/ais-marketing-render.holder
if ! flock -n "$lock" true 2>/dev/null; then
  who=$(cat "$holder" 2>/dev/null || echo "unknown")
  echo "safe.sh: waiting for $lock (held by: $who)" >&2
fi
exec flock "$lock" sh -c '
  printf "pid=%s started=%s cmd=%s\n" "$$" "$(date -Iseconds)" "$*" > /tmp/ais-marketing-render.holder
  trap "rm -f /tmp/ais-marketing-render.holder" EXIT
  exec systemd-run --user --scope -q -p MemoryMax="${MAX:-1400M}" -p MemorySwapMax=0 choom -n 1000 -- nice "$@"
' _ "$@"

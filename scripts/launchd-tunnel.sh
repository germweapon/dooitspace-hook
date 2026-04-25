#!/bin/bash
# LaunchAgent entrypoint for Cloudflare Named Tunnel (hook.dooitspace.com, builder.dooitspace.com)
# Invoked by ~/Library/LaunchAgents/com.dooitspace.hook.tunnel.plist

set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

LOG_DIR="$HOME/.paperclip"
mkdir -p "$LOG_DIR"

# Wait up to 60s for origin (localhost:3100) to come up before starting tunnel.
for i in $(seq 1 60); do
  if curl -sf -o /dev/null --max-time 2 http://localhost:3100; then
    break
  fi
  sleep 1
done

exec /opt/homebrew/bin/cloudflared tunnel run dooitspace-hook

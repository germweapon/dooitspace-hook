#!/bin/bash
# LaunchAgent entrypoint for Dooitspace HOOK server (pnpm dev on :3100)
# Invoked by ~/Library/LaunchAgents/com.dooitspace.hook.server.plist

set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

PROJECT_DIR="/Users/germweapon/claude/dooitspace-hook"
LOG_DIR="$HOME/.paperclip"
mkdir -p "$LOG_DIR"

cd "$PROJECT_DIR" || exit 1
exec /opt/homebrew/bin/pnpm dev

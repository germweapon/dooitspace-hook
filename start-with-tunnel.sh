#!/bin/bash
# Paperclip + Cloudflare Named Tunnel 한 번에 시작

cd "$(dirname "$0")"

LOG_DIR="$HOME/.paperclip"
mkdir -p "$LOG_DIR"
SERVER_LOG="$LOG_DIR/server.log"
TUNNEL_LOG="$LOG_DIR/tunnel.log"
: > "$TUNNEL_LOG"

echo "🚀 Paperclip 서버 시작 중... (로그: $SERVER_LOG)"
pnpm dev > "$SERVER_LOG" 2>&1 &
SERVER_PID=$!

echo "⏳ 서버 준비 대기 (10초)..."
sleep 10

echo "🌐 Cloudflare Named Tunnel 시작... (로그: $TUNNEL_LOG)"
cloudflared tunnel run > "$TUNNEL_LOG" 2>&1 &
TUNNEL_PID=$!

sleep 3

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ Paperclip 서버 + Named Tunnel 시작 완료"
echo ""
echo "    🔗 https://hook.dooitspace.com"
echo "    🔗 https://builder.dooitspace.com"
echo "    🏠 http://localhost:3100"
echo ""
echo "════════════════════════════════════════════════════════"
echo ""
echo "종료: Ctrl+C"

trap "kill $SERVER_PID $TUNNEL_PID 2>/dev/null; exit" INT TERM
wait

#!/usr/bin/env bash
# ── Deploy custom Logto UI ──────────────────────────────────────
# Usage:
#   ./deploy.sh
#
# Required env vars (or edit the defaults below):
#   LOGTO_ENDPOINT   — e.g. https://your-tenant.logto.app
#   LOGTO_AUTH       — <m2m-app-id>:<m2m-app-secret>
# ───────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ZIP_PATH="$SCRIPT_DIR/custom-ui.zip"

# ── 1. Build zip from this folder ──────────────────────────────
echo "📦  Creating zip..."
cd "$SCRIPT_DIR"
zip -r "$ZIP_PATH" . --exclude "*.sh" --exclude "*.zip" --exclude ".DS_Store"
echo "    → $ZIP_PATH"

# ── 2. Deploy via @logto/tunnel ────────────────────────────────
echo "🚀  Deploying to Logto..."
npx @logto/tunnel deploy \
  --endpoint "${LOGTO_ENDPOINT:?Set LOGTO_ENDPOINT}" \
  --auth     "${LOGTO_AUTH:?Set LOGTO_AUTH as id:secret}" \
  --zip-path "$ZIP_PATH"

echo "✅  Done! Custom UI is live."

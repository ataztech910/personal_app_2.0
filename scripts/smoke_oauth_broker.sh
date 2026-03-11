#!/usr/bin/env bash
set -euo pipefail

# OAuth broker smoke test for ADVNCD
# Usage:
#   ./scripts/smoke_oauth_broker.sh
#   BASE_URL="https://www.andreitazetdinov.com" ./scripts/smoke_oauth_broker.sh
#   BASE_URL="https://www.andreitazetdinov.com" AUTO_OPEN=1 ./scripts/smoke_oauth_broker.sh

BASE_URL="${BASE_URL:-https://www.andreitazetdinov.com}"
DEVICE_NAME="${DEVICE_NAME:-smoke-test-cli}"
AUTO_OPEN="${AUTO_OPEN:-0}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd curl
require_cmd jq

echo "== OAuth broker smoke test =="
echo "Base URL: $BASE_URL"
echo

echo "1) Starting CLI session..."
START_JSON="$(curl -sS -X POST "$BASE_URL/api/auth/cli/start" \
  -H "content-type: application/json" \
  -d "{\"device_name\":\"$DEVICE_NAME\"}")"

SESSION_ID="$(echo "$START_JSON" | jq -r '.session_id // empty')"
VERIFY_URL="$(echo "$START_JSON" | jq -r '.verify_url // empty')"
INTERVAL_SECONDS="$(echo "$START_JSON" | jq -r '.interval_seconds // 5')"
EXPIRES_IN="$(echo "$START_JSON" | jq -r '.expires_in // 600')"

if [[ -z "$SESSION_ID" || -z "$VERIFY_URL" ]]; then
  echo "Failed to start session. Response:"
  echo "$START_JSON" | jq .
  exit 1
fi

echo "session_id: $SESSION_ID"
echo "verify_url: $VERIFY_URL"
echo "interval_seconds: $INTERVAL_SECONDS"
echo "expires_in: $EXPIRES_IN"
echo

if [[ "$AUTO_OPEN" == "1" ]]; then
  if command -v open >/dev/null 2>&1; then
    open "$VERIFY_URL" >/dev/null 2>&1 || true
    echo "Opened verify_url with 'open'"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$VERIFY_URL" >/dev/null 2>&1 || true
    echo "Opened verify_url with 'xdg-open'"
  else
    echo "AUTO_OPEN=1 set, but no browser opener command found."
  fi
else
  echo "Open this URL in browser and complete Google login:"
  echo "$VERIFY_URL"
fi

echo
echo "2) Polling for approval..."

DEADLINE_EPOCH="$(( $(date +%s) + EXPIRES_IN + 60 ))"
APP_ACCESS_TOKEN=""
APP_REFRESH_TOKEN=""

while true; do
  NOW_EPOCH="$(date +%s)"
  if (( NOW_EPOCH >= DEADLINE_EPOCH )); then
    echo "Timed out waiting for approval."
    exit 1
  fi

  POLL_RAW="$(curl -sS "$BASE_URL/api/auth/cli/poll?session_id=$SESSION_ID")"

  if echo "$POLL_RAW" | jq -e '.error == "slow_down"' >/dev/null 2>&1; then
    RETRY_AFTER="$(echo "$POLL_RAW" | jq -r '.retry_after_seconds // 2')"
    echo "Rate limited (slow_down). Sleeping ${RETRY_AFTER}s..."
    sleep "$RETRY_AFTER"
    continue
  fi

  STATUS="$(echo "$POLL_RAW" | jq -r '.status // empty')"

  case "$STATUS" in
    pending)
      echo "pending..."
      sleep "$INTERVAL_SECONDS"
      ;;
    denied)
      echo "Login denied by user."
      exit 1
      ;;
    expired)
      echo "Login session expired."
      exit 1
      ;;
    approved)
      APP_ACCESS_TOKEN="$(echo "$POLL_RAW" | jq -r '.app_access_token // empty')"
      APP_REFRESH_TOKEN="$(echo "$POLL_RAW" | jq -r '.app_refresh_token // empty')"
      EMAIL="$(echo "$POLL_RAW" | jq -r '.email // empty')"
      echo "approved for: $EMAIL"
      break
      ;;
    *)
      echo "Unexpected poll response:"
      echo "$POLL_RAW" | jq .
      exit 1
      ;;
  esac
done

if [[ -z "$APP_ACCESS_TOKEN" || -z "$APP_REFRESH_TOKEN" ]]; then
  echo "Missing app tokens after approval."
  exit 1
fi

echo
echo "3) Exchanging app_access_token -> Google access token..."
GCP_JSON="$(curl -sS -X POST "$BASE_URL/api/auth/gcp/access-token" \
  -H "authorization: Bearer $APP_ACCESS_TOKEN")"

if ! echo "$GCP_JSON" | jq -e '.access_token and .expires_in' >/dev/null 2>&1; then
  echo "gcp/access-token failed:"
  echo "$GCP_JSON" | jq .
  exit 1
fi

echo "gcp/access-token ok (expires_in=$(echo "$GCP_JSON" | jq -r '.expires_in'))"

echo
echo "4) Refreshing app access token..."
REFRESH_JSON="$(curl -sS -X POST "$BASE_URL/api/auth/token/refresh" \
  -H "content-type: application/json" \
  -d "{\"app_refresh_token\":\"$APP_REFRESH_TOKEN\"}")"

if ! echo "$REFRESH_JSON" | jq -e '.app_access_token and .expires_in' >/dev/null 2>&1; then
  echo "token/refresh failed:"
  echo "$REFRESH_JSON" | jq .
  exit 1
fi

echo "token/refresh ok (expires_in=$(echo "$REFRESH_JSON" | jq -r '.expires_in'))"

echo
echo "5) Logging out (revoking refresh token)..."
LOGOUT_JSON="$(curl -sS -X POST "$BASE_URL/api/auth/logout" \
  -H "content-type: application/json" \
  -d "{\"app_refresh_token\":\"$APP_REFRESH_TOKEN\"}")"

if ! echo "$LOGOUT_JSON" | jq -e '.success == true' >/dev/null 2>&1; then
  echo "logout failed:"
  echo "$LOGOUT_JSON" | jq .
  exit 1
fi

echo "logout ok"
echo
echo "Smoke test completed successfully."

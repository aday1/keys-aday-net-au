#!/usr/bin/env sh
set -eu

UID_NAME="${1:-Aday}"
UID_EMAIL="${2:-aday@aday.net.au}"
EXPIRY="${3:-2027-06-30}"

if ! command -v gpg >/dev/null 2>&1; then
  echo "gpg not found in PATH. Install gnupg first." >&2
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="$(dirname "$0")/exports-$STAMP"
mkdir -p "$OUT_DIR"

UID="$UID_NAME <$UID_EMAIL>"

echo "Generating key for: $UID"
echo "Expiry: $EXPIRY"
echo "You will be prompted for a passphrase by gpg."

gpg --quick-gen-key "$UID" rsa4096 cert,sign,encr "$EXPIRY"

SAFE_EMAIL="$(echo "$UID_EMAIL" | tr '@' '_' | tr '.' '_')"
PUBLIC_FILE="$OUT_DIR/public-$SAFE_EMAIL.asc"
PRIVATE_FILE="$OUT_DIR/private-encrypted-$SAFE_EMAIL.asc"
REVOKE_FILE="$OUT_DIR/revoke-$SAFE_EMAIL.asc"

gpg --armor --export "$UID_EMAIL" > "$PUBLIC_FILE"
gpg --armor --export-secret-keys "$UID_EMAIL" > "$PRIVATE_FILE"
gpg --output "$REVOKE_FILE" --gen-revoke "$UID_EMAIL"

echo ""
echo "Generated files:"
echo "  $PUBLIC_FILE"
echo "  $PRIVATE_FILE"
echo "  $REVOKE_FILE"
echo ""
echo "Key details:"
gpg --fingerprint --keyid-format LONG "$UID_EMAIL"
echo ""
echo "Done. Keep private and revoke files offline."

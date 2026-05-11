$ErrorActionPreference = "Stop"

param(
  [string]$UidName = "Aday",
  [string]$UidEmail = "aday@aday.net.au",
  [string]$Expiry = "2027-06-30"
)

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outDir = Join-Path $PSScriptRoot ("exports-" + $timestamp)
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

if (-not (Get-Command gpg -ErrorAction SilentlyContinue)) {
  Write-Error "gpg not found in PATH. Install Gpg4win first."
}

$uid = "$UidName <$UidEmail>"

Write-Host "Generating key for: $uid"
Write-Host "Expiry: $Expiry"
Write-Host "You will be prompted for a passphrase by gpg."

gpg --quick-gen-key "$uid" rsa4096 cert,sign,encr "$Expiry"

$publicFile = Join-Path $outDir ("public-" + $UidEmail.Replace("@", "_at_") + ".asc")
$privateFile = Join-Path $outDir ("private-encrypted-" + $UidEmail.Replace("@", "_at_") + ".asc")
$revokeFile = Join-Path $outDir ("revoke-" + $UidEmail.Replace("@", "_at_") + ".asc")

gpg --armor --export "$UidEmail" > "$publicFile"
gpg --armor --export-secret-keys "$UidEmail" > "$privateFile"
gpg --output "$revokeFile" --gen-revoke "$UidEmail"

Write-Host ""
Write-Host "Generated files:"
Write-Host "  $publicFile"
Write-Host "  $privateFile"
Write-Host "  $revokeFile"
Write-Host ""
Write-Host "Key details:"
gpg --fingerprint --keyid-format LONG "$UidEmail"
Write-Host ""
Write-Host "Done. Keep private and revoke files offline."

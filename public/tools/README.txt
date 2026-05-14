PGP key tools for aday.net.au

These scripts are safe to share:
- They do not contain private keys.
- They do not contain passphrases.
- They do not upload anything anywhere.
- They run local gpg commands only.

Before use:
1) Install Gpg4win (Windows) or GnuPG (Linux/macOS)
2) Verify gpg command works
3) Read the script before running

Expected outputs:
- public key file (.asc) for publishing
- encrypted private key export (.asc) for backup/transfer
- revocation certificate (.asc) stored offline

SSH generation quick reference:
- Passphrased:
  ssh-keygen -t ed25519 -a 100 -f ~/.ssh/id_ed25519_new_pass -C "label - aday@aday.net.au"
- Non-passphrased:
  ssh-keygen -t ed25519 -a 100 -N "" -f ~/.ssh/id_ed25519_new_nopass -C "label - aday@aday.net.au"
- Publish only .pub file content.

Important:
- Keep private key export encrypted and offline.
- Keep revocation certificate offline.
- Verify fingerprint out of band before trusting keys.

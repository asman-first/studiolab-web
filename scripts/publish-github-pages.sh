#!/usr/bin/env bash
# Publishes this folder to GitHub Pages under the signed-in GitHub account.
# Run once from the project folder. Needs the GitHub CLI (gh) signed in.
#
#   bash scripts/publish-github-pages.sh
#
# Result: https://<github-user>.github.io/studiolab-web/

set -euo pipefail

REPO="studiolab-web"
USER="$(gh api user --jq .login)"

if ! gh repo view "$USER/$REPO" >/dev/null 2>&1; then
  echo "Creating public repository $USER/$REPO and pushing…"
  gh repo create "$REPO" --public --source=. --remote=origin --push \
    --description "Studiolab Technologies — AI studio in Dubai"
else
  echo "Repository exists, pushing latest commits…"
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$USER/$REPO.git"
  git push -u origin main
fi

echo "Enabling GitHub Pages from the main branch…"
gh api -X POST "repos/$USER/$REPO/pages" \
  -f build_type=legacy -f 'source[branch]=main' -f 'source[path]=/' >/dev/null 2>&1 \
  || echo "Pages already enabled."

echo
echo "Done. The site will be live in about a minute at:"
echo "  https://$USER.github.io/$REPO/"
echo "  https://$USER.github.io/$REPO/ar/   (Arabic)"

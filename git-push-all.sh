#!/bin/bash

echo "📦 Git Auto-Push startet..."

# Zeige Status
git status

# Alle Änderungen (hinzugefügt, gelöscht, geändert) erfassen
git add -A

# Status nach Staging
echo "✅ Änderungen wurden gestaged:"
git status

# Optional: Zeige genaue Änderungen
echo "📋 Zeige gestaged Änderungen:"
git diff --cached

# Commit mit Zeitstempel
COMMIT_MSG="Update: Auto-Push am $(date +'%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG"

# Push zum Remote
git push -u origin main

echo "🚀 Push abgeschlossen!"

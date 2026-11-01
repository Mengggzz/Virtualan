#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "========================================================"
echo "       Virtualan - Git Push & Commit Helper"
echo "========================================================"
echo ""

echo "[1/4] Memeriksa status git..."
git status -s
echo ""

read -r -p "Masukkan pesan commit (tekan Enter untuk default 'chore: update project'): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="chore: update project $(date '+%Y-%m-%d %H:%M')"
fi

echo ""
echo "[2/4] Menambahkan semua perubahan (git add .)..."
git add .

echo ""
echo "[3/4] Melakukan commit dengan pesan: '$COMMIT_MSG'..."
if git commit -m "$COMMIT_MSG"; then
  echo "Commit berhasil dibuat."
else
  echo "Tidak ada perubahan baru untuk di-commit."
fi

echo ""
echo "[4/4] Mengirim perubahan ke GitHub (git push origin main)..."
git push origin main

echo ""
echo "[SUKSES] Perubahan berhasil di-push ke GitHub!"
echo "========================================================"

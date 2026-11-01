@echo off
setlocal enabledelayedexpansion
title Virtualan - Git Push & Commit Helper

echo ========================================================
echo        Virtualan - Git Push & Commit Helper
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/4] Memeriksa status git...
git status -s
echo.

set /p COMMIT_MSG="Masukkan pesan commit (tekan Enter untuk default 'chore: update project'): "
if "!COMMIT_MSG!"=="" (
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value 2^>nul') do set DT=%%I
    if "!DT!"=="" (
        set COMMIT_MSG=chore: update project
    ) else (
        set DATE_STR=!DT:~0,4!-!DT:~4,2!-!DT:~6,2! !DT:~8,2!:!DT:~10,2!
        set COMMIT_MSG=chore: update project !DATE_STR!
    )
)

echo.
echo [2/4] Menambahkan semua perubahan (git add .)...
git add .

echo.
echo [3/4] Melakukan commit dengan pesan: "!COMMIT_MSG!"...
git commit -m "!COMMIT_MSG!"
if errorlevel 1 (
    echo.
    echo Tidak ada perubahan baru untuk di-commit.
)

echo.
echo [4/4] Mengirim perubahan ke GitHub (git push origin main)...
git push origin main
if errorlevel 1 (
    echo.
    echo [ERROR] Gagal melakukan push ke remote. Pastikan koneksi internet aktif.
) else (
    echo.
    echo [SUKSES] Perubahan berhasil di-push ke GitHub!
)

echo.
echo ========================================================
pause

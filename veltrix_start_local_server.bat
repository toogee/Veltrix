@echo off
title Serveur Web Local Veltrix
echo =========================================================================
echo       VELTRIX - DEMARRAGE SANS EFFORT DU SERVEUR WEB LOCAL
echo =========================================================================
echo.
echo Ce script contourne automatiquement toutes les restrictions de securite 
echo des navigateurs liees au protocole local "file:///" en creant un serveur web.
echo.

:: 1. Tentative avec Node.js (npx http-server)
echo [1/3] Tentative de demarrage avec Node.js...
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo.
    echo Serveur en cours d'execution !
    echo Ouvrez : http://localhost:3000/veltrix_premium_sign_up%%20(1).html
    echo.
    npx http-server -p 3000
    goto end
)
echo Echec ou Node.js absent.
echo.

:: 2. Tentative avec Python
echo [2/3] Tentative de demarrage avec Python...
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo.
    echo Serveur en cours d'execution !
    echo Ouvrez : http://localhost:3000/veltrix_premium_sign_up%%20(1).html
    echo.
    python -m http.server 3000
    goto end
)
echo Echec ou Python absent.
echo.

:: 3. Tentative avec PHP
echo [3/3] Tentative de demarrage avec PHP...
where php >nul 2>nul
if %errorlevel% equ 0 (
    echo.
    echo Serveur en cours d'execution !
    echo Ouvrez : http://localhost:3000/veltrix_premium_sign_up%%20(1).html
    echo.
    php -S localhost:3000
    goto end
)
echo Echec ou PHP absent.
echo.

:: 4. Fallback conseil VS Code Live Server
echo =========================================================================
echo ALERTE : Aucun interpreteur (Node.js, Python, PHP) n'est installe.
echo.
echo Pour faire fonctionner l'authentification et les modal sans restriction :
echo 1. Ouvrez ce dossier dans l'editeur VS Code.
echo 2. Installez l'extension "Live Server".
echo 3. Cliquez sur "Go Live" en bas a droite pour lancer le serveur web local.
echo =========================================================================
pause

:end

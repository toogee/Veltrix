@echo off
title Serveur Web Local Veltrix
echo =========================================================================
echo       VELTRIX - DEMARRAGE SANS EFFORT DU SERVEUR WEB LOCAL
echo =========================================================================
echo.
echo Ce script contourne automatiquement toutes les restrictions de securite 
echo des navigateurs liees au protocole local "file:///" en creant un serveur web.
echo.

:: 1. Tentative avec Node.js (npx -y http-server)
echo [1/3] Tentative de demarrage avec Node.js...
where npx >nul 2>nul
if %errorlevel% neq 0 goto no_node
echo Serveur en cours d'execution avec Node.js !
echo Ouvrez : http://localhost:3000/veltrix_premium_sign_up%%20(1).html
echo.
call npx -y http-server -p 3000
if %errorlevel% neq 0 echo Le serveur Node.js a echoue ou a ete arrete.
goto try_python

:no_node
echo Node.js n'est pas installe ou n'est pas dans le PATH.
echo.

:try_python
:: 2. Tentative avec Python
echo [2/3] Tentative de demarrage avec Python...
where python >nul 2>nul
if %errorlevel% neq 0 goto no_python
echo Serveur en cours d'execution avec Python !
echo Ouvrez : http://localhost:3000/veltrix_premium_sign_up%%20(1).html
echo.
python -m http.server 3000
if %errorlevel% neq 0 echo Le serveur Python a echoue ou a ete arrete.
goto try_php

:no_python
echo Python n'est pas installe ou n'est pas dans le PATH.
echo.

:try_php
:: 3. Tentative avec PHP
echo [3/3] Tentative de demarrage avec PHP...
where php >nul 2>nul
if %errorlevel% neq 0 goto no_php
echo Serveur en cours d'execution avec PHP !
echo Ouvrez : http://localhost:3000/veltrix_premium_sign_up%%20(1).html
echo.
php -S localhost:3000
if %errorlevel% neq 0 echo Le serveur PHP a echoue ou a ete arrete.
goto end

:no_php
echo PHP n'est pas installe ou n'est pas dans le PATH.
echo.

:: 4. Fallback conseil VS Code Live Server
echo =========================================================================
echo ALERTE : Aucun serveur local n'a pu etre demarre automatiquement.
echo.
echo Pour faire fonctionner l'authentification et les modaux sans restriction :
echo 1. Ouvrez ce dossier dans l'editeur VS Code.
echo 2. Installez l'extension "Live Server".
echo 3. Cliquez sur "Go Live" en bas a droite pour lancer le serveur web local.
echo =========================================================================
echo.
pause

:end

@echo off
setlocal enabledelayedexpansion

REM ==========================================================
REM MF PRIME CLUB – скрипт запуску продакшн-версії на Windows
REM ==========================================================

cd /d "%~dp0"

echo.
echo ================================================
echo  MF PRIME CLUB — Підготовка та запуск сервера
echo ================================================
echo.

REM ---- Frontend dependencies
if not exist "frontend\node_modules" (
    echo [1/5] Встановлюю залежності frontend...
    pushd frontend
    call npm install
    if errorlevel 1 (
        echo Помилка npm install у каталозі frontend.
        popd
        goto :end
    )
    popd
) else (
    echo [1/5] Залежності frontend вже встановлені — пропускаю.
)

REM ---- Server dependencies
if not exist "server\node_modules" (
    echo [2/5] Встановлюю залежності server...
    pushd server
    call npm install
    if errorlevel 1 (
        echo Помилка npm install у каталозі server.
        popd
        goto :end
    )
    popd
) else (
    echo [2/5] Залежності server вже встановлені — пропускаю.
)

REM ---- Build frontend
echo [3/5] Збираю frontend (npm run build)...
pushd frontend
call npm run build
if errorlevel 1 (
    echo Помилка під час npm run build.
    popd
    goto :end
)
popd

REM ---- Перевірка зібраного dist
if not exist "frontend\dist\index.html" (
    echo Не знайдено frontend\dist\index.html — збірка завершилась некоректно.
    goto :end
)

REM ---- Запуск сервера
echo [4/5] Запускаю Node.js сервер...
echo.
echo Сервер відкриється за адресою http://localhost:3000
echo Натисніть CTRL+C для зупинки.
echo.

pushd server
call npm run start
popd

:end
echo.
echo [5/5] Скрипт завершено.
echo.
endlocal


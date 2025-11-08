@echo off
REM ========================================
REM MF PRIME CLUB - Запуск локального сервера
REM ========================================

cd /d "%~dp0"

echo.
echo ====================================
echo MF PRIME CLUB - Локальний сервер
echo ====================================
echo.

REM Перевірка Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Python знайдено!
    echo.
    echo Запускаю веб-сервер...
    echo.
    python -m http.server 8000
) else (
    echo ✗ Python не встановлено
    echo.
    echo Спробую запустити через cmd вручну...
    echo Просто відкрийте index.html браузером
    explorer "%~dp0\index.html"
)


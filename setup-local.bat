@echo off
REM Script de Setup para AcouNorm - Windows
REM Uso: setup-local.bat

setlocal enabledelayedexpansion

echo.
echo ======================================================
echo  AcouNorm - Setup Local (Windows)
echo ======================================================
echo.

REM Cores para output (usando findstr trick)
set "info=[INFO]"
set "success=[OK]"
set "error=[ERROR]"

echo %info% Verificando pré-requisitos...
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo %error% Node.js não encontrado. Instale em: https://nodejs.org/
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo %success% Node.js encontrado: !NODE_VERSION!
)

echo.
echo %info% Instalando dependências do Frontend...
echo.

REM Instalar dependências
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo %error% Falha ao instalar dependências do Frontend
    exit /b 1
)
echo %success% Dependências do Frontend instaladas

echo.
echo %info% Criando arquivo .env.local...

REM Criar .env.local
if not exist .env.local (
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
        echo NODE_ENV=development
    ) > .env.local
    echo %success% Arquivo .env.local criado
) else (
    echo %info% Arquivo .env.local já existe
)

echo.
echo ======================================================
echo  Setup Completo!
echo ======================================================
echo.
echo Frontend (Next.js):
echo   Comando: npm run dev
echo   URL: http://localhost:3000
echo.
echo Backend (FastAPI):
echo   Deve estar rodando em: http://localhost:8000
echo   Comando (no repositório backend):
echo   uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo.
echo Próximos passos:
echo   1. Abra outro terminal e vá para o repositório backend
echo   2. Execute: python -m venv venv
echo   3. Ative o venv: venv\Scripts\activate
echo   4. Instale dependências: pip install -r requirements.txt
echo   5. Execute: uvicorn main:app --reload --host 0.0.0.0 --port 8000
echo   6. Volte a este terminal e execute: npm run dev
echo.
echo ======================================================
echo.

pause

#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Setup local para AcouNorm no Windows usando PowerShell

.DESCRIPTION
    Configura o ambiente frontend para desenvolvimento local

.EXAMPLE
    .\setup-local.ps1
#>

Write-Host "`n" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  AcouNorm - Setup Local (PowerShell)" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "`n"

# Verifica pré-requisitos
Write-Host "[INFO] Verificando pré-requisitos..." -ForegroundColor Blue

# Verificar Node.js
try {
    $nodeVersion = node -v
    Write-Host "[OK] Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js não encontrado. Instale em: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[INFO] Instalando dependências do Frontend..." -ForegroundColor Blue
Write-Host ""

# Instalar dependências
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Falha ao instalar dependências" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Dependências instaladas" -ForegroundColor Green

Write-Host ""
Write-Host "[INFO] Criando arquivo .env.local..." -ForegroundColor Blue

# Criar .env.local
if (-not (Test-Path ".env.local")) {
    @"
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "[OK] Arquivo .env.local criado" -ForegroundColor Green
} else {
    Write-Host "[INFO] Arquivo .env.local já existe" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Setup Completo!" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend (Next.js):" -ForegroundColor Yellow
Write-Host "  Comando: npm run dev" -ForegroundColor Cyan
Write-Host "  URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend (FastAPI):" -ForegroundColor Yellow
Write-Host "  Deve estar rodando em: http://localhost:8000" -ForegroundColor Cyan
Write-Host "  Comando (no repositório backend):" -ForegroundColor Cyan
Write-Host "  uvicorn main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Abra outro PowerShell e vá para o repositório backend" -ForegroundColor Cyan
Write-Host "  2. Execute: python -m venv venv" -ForegroundColor Cyan
Write-Host "  3. Ative o venv: .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host "  4. Instale dependências: pip install -r requirements.txt" -ForegroundColor Cyan
Write-Host "  5. Execute: uvicorn main:app --reload --host 0.0.0.0 --port 8000" -ForegroundColor Cyan
Write-Host "  6. Volte a este PowerShell e execute: npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

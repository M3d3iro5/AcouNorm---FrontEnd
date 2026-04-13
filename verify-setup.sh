#!/bin/bash
# Checklist de Verificação - AcouNorm Local Setup
# Uso: bash verify-setup.sh

echo ""
echo "======================================================"
echo "  AcouNorm - Checklist de Verificação"
echo "======================================================"
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0

# Função para testar
check() {
    local name=$1
    local command=$2
    echo -n "Verificando: $name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo "✓ OK"
        ((CHECKS_PASSED++))
        return 0
    else
        echo "✗ FALHA"
        ((CHECKS_FAILED++))
        return 1
    fi
}

# Verificações
echo "📋 Verificações Locais"
echo "========================================================"

check "Node.js instalado" "node --version"
check "npm instalado" "npm --version"
check "Arquivo .env.local existe" "test -f .env.local"
check "Arquivo package.json existe" "test -f package.json"
check "Diretório node_modules existe" "test -d node_modules"

echo ""
echo "📡 Verificações de Conectividade"
echo "========================================================"

# Verificar backend
echo -n "Verificando: Backend em localhost:8000... "
if timeout 5 curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✓ OK"
    ((CHECKS_PASSED++))
else
    echo "✗ FALHA (backend offline)"
    ((CHECKS_FAILED++))
fi

echo ""
echo "📊 Verificações de Configuração"
echo "========================================================"

check ".env.local contém NEXT_PUBLIC_API_URL" "grep -q 'NEXT_PUBLIC_API_URL' .env.local"
check "API URL aponta para localhost:8000" "grep -q 'http://localhost:8000' .env.local"
check "arquivo api-service.ts existe" "test -f lib/api-service.ts"
check "arquivo test-form.tsx existe" "test -f components/test-form.tsx"

echo ""
echo "======================================================"
echo "  Resultado Final"
echo "======================================================"
echo ""
echo "✓ Testes passaram: $CHECKS_PASSED"
echo "✗ Testes falharam: $CHECKS_FAILED"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo "✓ TUDO OK! Você pode iniciar."
    echo ""
    echo "Próximos passos:"
    echo "  1. Terminal 1: Inicie o backend"
    echo "     cd ../AcouNorm---BackEnd"
    echo "     uvicorn main:app --reload"
    echo ""
    echo "  2. Terminal 2: Inicie o frontend"
    echo "     npm run dev"
    echo ""
    exit 0
else
    echo "✗ ALGUNS PROBLEMAS ENCONTRADOS"
    echo ""
    echo "Soluções:"
    echo "  1. Verifique se backend está rodando"
    echo "  2. Execute: npm install"
    echo "  3. Verifique arquivo .env.local"
    echo ""
    exit 1
fi

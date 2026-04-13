#!/bin/bash

# Script para fazer build e push da imagem Docker para o Portainer

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🐳 Docker Build & Push para Portainer${NC}"
echo ""

# Verificar se Docker está rodando
if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando!${NC}"
    exit 1
fi

# Variáveis
IMAGE_NAME="${1:-acounorm-frontend}"
IMAGE_TAG="${2:-latest}"
REGISTRY="${3:-}" # Opcional: seu-usuario/acounorm-frontend

# Build
echo -e "${YELLOW}📦 Building image: ${IMAGE_NAME}:${IMAGE_TAG}${NC}"
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completo${NC}"
else
    echo -e "${RED}❌ Build falhou${NC}"
    exit 1
fi

# Push (se registry foi fornecido)
if [ -n "$REGISTRY" ]; then
    echo -e "${YELLOW}📤 Fazendo tag para registry: ${REGISTRY}:${IMAGE_TAG}${NC}"
    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY}:${IMAGE_TAG}
    
    echo -e "${YELLOW}📤 Pushing para Docker Hub/Registry${NC}"
    docker push ${REGISTRY}:${IMAGE_TAG}
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Push completo${NC}"
    else
        echo -e "${RED}❌ Push falhou${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}✅ Pronto!${NC}"
echo ""
echo "Para usar no Portainer:"
echo "1. Vá em Portainer → Stacks → Add Stack"
echo "2. Selecione 'docker-compose.prod.yml'"
echo "3. Adicione suas environment variables"
echo "4. Clique em 'Deploy'"
echo ""
echo "Ou execute direto:"
echo "  docker-compose -f docker-compose.prod.yml up -d"

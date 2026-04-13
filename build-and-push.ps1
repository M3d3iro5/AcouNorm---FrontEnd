# Script PowerShell para fazer build e push da imagem Docker para o Portainer

param(
    [string]$ImageName = "acounorm-frontend",
    [string]$ImageTag = "latest",
    [string]$Registry = ""
)

# Cores
$red = "`e[91m"
$green = "`e[92m"
$yellow = "`e[93m"
$reset = "`e[0m"

Write-Host "${yellow}🐳 Docker Build & Push para Portainer${reset}" -ForegroundColor Yellow
Write-Host ""

# Verificar se Docker está rodando
try {
    docker ps > $null 2>&1
} catch {
    Write-Host "${red}❌ Docker não está rodando!${reset}" -ForegroundColor Red
    exit 1
}

# Build
Write-Host "${yellow}📦 Building image: ${ImageName}:${ImageTag}${reset}" -ForegroundColor Yellow
docker build -t "${ImageName}:${ImageTag}" .

if ($LASTEXITCODE -eq 0) {
    Write-Host "${green}✅ Build completo${reset}" -ForegroundColor Green
} else {
    Write-Host "${red}❌ Build falhou${reset}" -ForegroundColor Red
    exit 1
}

# Push (se registry foi fornecido)
if ($Registry -ne "") {
    Write-Host "${yellow}📤 Fazendo tag para registry: ${Registry}:${ImageTag}${reset}" -ForegroundColor Yellow
    docker tag "${ImageName}:${ImageTag}" "${Registry}:${ImageTag}"
    
    Write-Host "${yellow}📤 Pushing para Docker Hub/Registry${reset}" -ForegroundColor Yellow
    docker push "${Registry}:${ImageTag}"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "${green}✅ Push completo${reset}" -ForegroundColor Green
    } else {
        Write-Host "${red}❌ Push falhou${reset}" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "${green}✅ Pronto!${reset}" -ForegroundColor Green
Write-Host ""
Write-Host "Para usar no Portainer:"
Write-Host "1. Vá em Portainer → Stacks → Add Stack"
Write-Host "2. Selecione 'docker-compose.prod.yml'"
Write-Host "3. Adicione suas environment variables"
Write-Host "4. Clique em 'Deploy'"
Write-Host ""
Write-Host "Ou execute direto:"
Write-Host "  docker-compose -f docker-compose.prod.yml up -d"

# AcouNorm - Frontend

Sistema web de cálculos acústicos conforme padrões ISO 16283 e ISO 717.

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:8000`

### 1. Setup Rápido (Windows)

```bash
# Abra PowerShell e execute:
.\setup-local.ps1
```

Ou com CMD:

```bash
setup-local.bat
```

### 2. Setup Manual

```bash
# Instalar dependências
npm install

# Criar .env.local
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
echo NODE_ENV=development >> .env.local

# Executar em desenvolvimento
npm run dev
```

### 3. Testar Conectividade

```bash
# Verificar se o backend está pronto
node test-api.js
```

Acesse: http://localhost:3000

## � Configuração OAuth (GitHub, Google, Discord, Microsoft)

### Variáveis de Ambiente

Copie `.env.example` para `.env.local` e adicione suas credenciais OAuth:

```bash
cp .env.example .env.local
```

### GitHub OAuth

1. Acesse [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Preench os campos:
   - **Application name:** AcouNorm
   - **Homepage URL:** http://localhost:3000
   - **Authorization callback URL:** http://localhost:3000/api/auth/callback/github
4. Copie `Client ID` e `Client Secret` para `.env.local`

```env
GITHUB_ID=seu_client_id
GITHUB_SECRET=seu_client_secret
```

### Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative "Google+ API"
4. Vá em "Credenciais" > "Criar credenciais" > "ID do cliente OAuth"
5. Configure a tela de consentimento
6. Configure as URIs autorizadas:
   - **Authorized JavaScript origins:** http://localhost:3000
   - **Authorized redirect URIs:** http://localhost:3000/api/auth/callback/google
7. Copie `Client ID` e `Client Secret` para `.env.local`

```env
GOOGLE_CLIENT_ID=seu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu_client_secret
```

### Discord OAuth

1. Acesse [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em "New Application"
3. Na aba "OAuth2", adicione uma redirect URL:
   - http://localhost:3000/api/auth/callback/discord
4. Copie `Client ID` e `Client Secret` para `.env.local`

```env
DISCORD_CLIENT_ID=seu_client_id
DISCORD_CLIENT_SECRET=seu_client_secret
```

### Microsoft/Azure OAuth

1. Acesse [Azure Portal](https://portal.azure.com/)
2. Vá em "Microsoft Entra ID" > "Registos de aplicações"
3. Clique em "Novo registo"
4. Em "Redirect URI", adicione:
   - http://localhost:3000/api/auth/callback/microsoft-entra-id
5. Copie `Application (client) ID` e `Client Secret` para `.env.local`

```env
MICROSOFT_CLIENT_ID=seu_application_id
MICROSOFT_CLIENT_SECRET=seu_client_secret
MICROSOFT_TENANT_ID=common
```

### NextAuth Secret

Gere um secret aleatório:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado para `.env.local`:

```env
NEXTAUTH_SECRET=seu_secret_aqui
```

## 🧪 Testar OAuth Localmente

1. Configure todas as variáveis em `.env.local`
2. Reinicie o servidor: `npm run dev`
3. Acesse http://localhost:3000
4. Clique em um dos botões de OAuth
5. Complete o login

## � Configurar OAuth para Produção

### Variáveis de Ambiente em Produção

Para produção (ex: Vercel, AWS, Docker), você precisa:

1. **Gerar um NEXTAUTH_SECRET seguro**

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Configurar Variáveis no seu Hosting**
   - Vercel: Settings → Environment Variables
   - AWS: Secrets Manager ou Parameter Store
   - Docker: Docker secrets ou arquivo .env.production

3. **URLs em Produção**
   ```env
   NEXTAUTH_URL=https://seu-dominio.com
   NEXTAUTH_SECRET=seu_secret_seguro_gerado
   ```

### GitHub OAuth em Produção

1. Crie um OAuth App em [github.com/settings/developers](https://github.com/settings/developers)
2. **Authorization callback URL (importante):**
   ```
   https://seu-dominio.com/api/auth/callback/github
   ```
3. Adicione as variáveis no seu hosting:
   ```env
   GITHUB_ID=seu_github_client_id_produção
   GITHUB_SECRET=seu_github_client_secret_produção
   ```

### Google OAuth em Produção

1. No [Google Cloud Console](https://console.cloud.google.com/):
2. Adicione seu domínio em "Autorizados":
   - **JavaScript origins:** https://seu-dominio.com
   - **Redirect URIs:** https://seu-dominio.com/api/auth/callback/google
3. Adicione as variáveis:
   ```env
   GOOGLE_CLIENT_ID=seu_id_produção
   GOOGLE_CLIENT_SECRET=seu_secret_produção
   ```

### Discord OAuth em Produção

1. No [Discord Developer Portal](https://discord.com/developers/applications)
2. Adicione a redirect URL em OAuth2:
   ```
   https://seu-dominio.com/api/auth/callback/discord
   ```
3. Adicione as variáveis:
   ```env
   DISCORD_CLIENT_ID=seu_id_produção
   DISCORD_CLIENT_SECRET=seu_secret_produção
   ```

### Deploy com Vercel (Recomendado)

```bash
# 1. Faça push do código
git push origin main

# 2. No Dashboard da Vercel:
# - Conecte seu repositório
# - Adicione as variáveis de ambiente em Settings
# - Deploy automático ao fazer push

# 3. A aplicação estará em https://seu-projeto.vercel.app
```

### Deploy com Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build e run
docker build -t acounorm-frontend .
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=https://seu-dominio.com \
  -e NEXTAUTH_SECRET=seu_secret \
  -e GITHUB_ID=... \
  -e GITHUB_SECRET=... \
  acounorm-frontend
```

### Deploy com Docker Compose + Portainer (Recomendado)

**1. Docker Compose - `docker-compose.prod.yml`**

```yaml
version: "3.8"

services:
  acounorm-frontend:
    image: acounorm-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NEXTAUTH_URL=https://seu-dominio.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GITHUB_ID=${GITHUB_ID}
      - GITHUB_SECRET=${GITHUB_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
      - DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
      - NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - acounorm-network

  acounorm-backend:
    image: acounorm-backend:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - ENVIRONMENT=production
    restart: unless-stopped
    networks:
      - acounorm-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - acounorm-frontend
      - acounorm-backend
    restart: unless-stopped
    networks:
      - acounorm-network

networks:
  acounorm-network:
    driver: bridge
```

**2. Nginx Config - `nginx.conf`**

```nginx
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server acounorm-frontend:3000;
    }

    upstream backend {
        server acounorm-backend:8000;
    }

    server {
        listen 80;
        server_name seu-dominio.com www.seu-dominio.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name seu-dominio.com www.seu-dominio.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

**3. Deploy com Portainer**

**Passo 1: Instalar Portainer (se não tiver)**

```bash
docker run -d -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

Acesse: http://seu-servidor:9000

**Passo 2: Adicionar Environment**

- Vá em "Environments" → "Add environment"
- Selecione seu servidor Docker
- Clique em "Connect"

**Passo 3: Deploy via Docker Compose**

- No Portainer, vá em "Stacks" → "Add Stack"
- Nome: `acounorm-stack`
- Copie o conteúdo do `docker-compose.prod.yml`
- Em "Environment variables", adicione:
  - `NEXTAUTH_SECRET=seu_secret_gerado`
  - `GITHUB_ID=seu_github_id`
  - `GITHUB_SECRET=seu_github_secret`
  - `GOOGLE_CLIENT_ID=seu_google_id`
  - `GOOGLE_CLIENT_SECRET=seu_google_secret`
  - `DISCORD_CLIENT_ID=seu_discord_id`
  - `DISCORD_CLIENT_SECRET=seu_discord_secret`
  - `DATABASE_URL=sua_url_banco_dados`
  - `JWT_SECRET=seu_jwt_secret`
- Clique em "Deploy"

**Passo 4: Monitorar no Portainer**

- Stack está rodando
- Veja logs em tempo real
- Escale containers conforme necessário
- Reinicie automaticamente com "Restart policy"

**Passo 5: CI/CD com Portainer Webhooks (Opcional)**

Ao fazer push do código para Git:

1. Build a imagem Docker automaticamente
2. Push para registro (Docker Hub, AWS ECR, etc)
3. Portainer recebe webhook e redeploy o stack

**Em seu repositório, crie `.github/workflows/deploy.yml`:**

```yaml
name: Deploy to Portainer

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t seu-usuario/acounorm-frontend:latest .

      - name: Push to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - run: docker push seu-usuario/acounorm-frontend:latest

      - name: Trigger Portainer Redeploy
        run: |
          curl -X POST \
            https://seu-servidor:9000/api/webhooks/acounorm-webhook \
            -H "Authorization: Bearer ${{ secrets.PORTAINER_WEBHOOK_TOKEN }}"
```

### Checklist para Produção com Portainer

- ✅ Portainer instalado e acessível
- ✅ Docker daemon e docker-compose configured
- ✅ SSL/TLS certificados válidos em `/ssl`
- ✅ `.env` com todas as variáveis do `docker-compose.prod.yml`
- ✅ `NEXTAUTH_URL` configurada com domínio HTTPS
- ✅ `NEXTAUTH_SECRET` gerado com segurança
- ✅ OAuth Callbacks configuradas em todos os provedores (HTTPS)
- ✅ Backend (`NEXT_PUBLIC_API_URL`) em HTTPS
- ✅ CORS configurado no backend
- ✅ Nginx com reverse proxy rodando
- ✅ Logs centralizados (recomendado: Docker logs ou ELK Stack)
- ✅ Backups do banco de dados configurados
- ✅ Monitoring ativo (recomendado: Prometheus + Grafana)
- ✅ Container restart policy: `unless-stopped`

## �📱 Provedores Suportados

| Provedor  | Status      | Documentação                                                           |
| --------- | ----------- | ---------------------------------------------------------------------- |
| GitHub    | ✅ Completo | [Docs](https://docs.github.com/en/developers/apps/building-oauth-apps) |
| Google    | ✅ Completo | [Docs](https://developers.google.com/identity/protocols/oauth2)        |
| Discord   | ✅ Completo | [Docs](https://discord.com/developers/docs/topics/oauth2)              |
| Microsoft | ✅ Completo | [Docs](https://learn.microsoft.com/en-us/entra/identity-platform/)     |

## 🔄 Fluxo de Autenticação

```
┌─────────────────┐
│   Usuário       │
└────────┬────────┘
         │ Clica em "Entrar com GitHub"
         ▼
┌─────────────────────────────────────┐
│   Frontend - oauth-buttons.tsx      │
│   Chama: signIn('github')           │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   NextAuth Route Handler            │
│   POST /api/auth/signin/github      │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   GitHub OAuth Server               │
│   Redireciona para login             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Usuário Autoriza AcouNorm         │
│   GitHub retorna token              │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   NextAuth Callback                 │
│   JWT Callback + Session Callback   │
│   Sincronizar com Backend (opcional)│
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Dashboard                         │
│   Usuário autenticado               │
└─────────────────────────────────────┘
```

## 💡 Observações Importantes

- **Produção:** Use HTTPS e domínios válidos
- **Secrets:** Nunca exponha `NEXTAUTH_SECRET` publicamente
- **Backend:** Implemente endpoints de sincronização OAuth no seu backend para salvar usuários
- **Banco de dados:** Considere usar Prisma para gerenciar usuários OAuth

Acesse: http://localhost:3000

- [Setup Completo](./SETUP_LOCAL.md) - Guia detalhado de setup
- [Endpoints API](../AcouNorm---BackEnd/ENDPOINTS.md) - Documentação dos endpoints

## 🏗️ Arquitetura

```
┌─────────────────────────────────────┐
│   Frontend (Next.js + TypeScript)   │ ← Você está aqui
│   http://localhost:3000             │
└────────────────┬────────────────────┘
                 │ HTTP POST
                 ↓
┌─────────────────────────────────────┐
│   Backend (FastAPI + Python)        │
│   http://localhost:8000             │
│                                     │
│  • /api/acoustic/airborne/wall      │
│  • /api/acoustic/airborne/facade    │
│  • /api/acoustic/impact/slab        │
└─────────────────────────────────────┘
```

## 📁 Estrutura do Projeto

```
components/
  └── test-form.tsx              # Formulário principal

lib/
  ├── api-service.ts             # Integração com APIs
  ├── api-health.ts              # Verificação de saúde
  └── types.ts                   # Definições de tipos

hooks/
  └── use-api-health.ts          # Hook para saúde da API
```

## 🔧 Principais Componentes

### TestForm

Componente principal que:

- Coleta dados de geometria
- Captura medições sonoras
- Valida entrada
- Envia para o backend
- Exibe resultados

### ApiService

Módulo que:

- Calibra dados de entrada
- Chama endpoints do backend
- Trata erros
- Extrai métricas principais

## 🌐 Endpoints Utilizados

### Isolamento de Parede (Aéreo)

```
POST /api/acoustic/airborne/wall
Standard: ISO 16283-1 / ISO 717-1
Retorna: DnT,w, R'w
```

### Isolamento de Fachada (Aéreo)

```
POST /api/acoustic/airborne/facade
Standard: ISO 16283-3 / ISO 717-1
Retorna: D2m,nT,w, D2m,n,w, R'45,w
```

### Isolamento de Laje (Impacto)

```
POST /api/acoustic/impact/slab
Standard: ISO 16283-2 / ISO 717-2
Retorna: L'nT,w, L'n,w
```

## 🧪 Testes

```bash
# Testar conectividade com backend
node test-api.js

# Build para produção
npm run build

# Executar build local
npm run start

# Linting
npm run lint
```

## 📊 Fluxo de Dados

1. **Entrada**: Usuário preenche formulário
2. **Validação**: Frontend valida dados
3. **Transformação**: Dados mapeados para formato da API
4. **Envio**: Request POST ao backend
5. **Processamento**: Backend calcula conforme normas ISO
6. **Resposta**: Backend retorna resultados e detalhes
7. **Exibição**: Frontend mostra gráficos e tabelas

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# URL do backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Ambiente
NODE_ENV=development
```

### Banda de Frequências Suportadas

**1/1 Oitava (8 bandas)**

- 125, 250, 500, 1000, 2000, 4000, 8000, 16000 Hz

**1/3 Oitava (24 bandas)**

- 100 a 20000 Hz

## 🐛 Troubleshooting

### "Impossível conectar ao servidor"

```bash
# Verifique se backend está rodando
node test-api.js

# Verifique URL em .env.local
cat .env.local
```

### Erros 422 ou 500

- Verifique dados de entrada
- Confirme dimensões dos arrays
- Veja logs do backend

### Build não funciona

```bash
# Limpe cache e reinstale
rm -r .next node_modules
npm install
npm run build
```

## 📱 Docker

Opcionalmente, use Docker para setup automatizado:

```bash
# Iniciar tudo (frontend + backend)
docker-compose up

# Parar
docker-compose down

# Ver logs
docker-compose logs -f
```

## 🔒 Segurança

- ✅ Validação de entrada no frontend e backend
- ✅ Proteção contra XSS
- ✅ CORS configurado
- ✅ Sem dados sensíveis em localStorage

## 📈 Performance

- Frontend build: ~30s
- Carregamento página: ~1.5s
- Cálculo acústico: ~1-2s
- Rendering gráficos: ~500ms

## 🎯 Próximas Features

- [ ] Autenticação de usuários
- [ ] Persistência em banco de dados
- [ ] Geração de PDFs
- [ ] Dashboard de histórico
- [ ] Comparação de resultados
- [ ] Exportação de dados

## 📞 Suporte

- Documentação: [SETUP_LOCAL.md](./SETUP_LOCAL.md)
- Backend: ../AcouNorm---BackEnd
- Tests: `node test-api.js`

## 📄 Licença

Projeto AcouNorm - 2026

---

**Versão**: 1.0  
**Status**: Production Ready  
**Última atualização**: Abril 2026

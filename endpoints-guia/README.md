# 📚 Documentação de Endpoints - AcouNorm

Bem-vindo à documentação completa dos endpoints de autenticação e verificação de email do AcouNorm!

## 📂 Estrutura

```
endpoints-guia/
├── README.md (este arquivo)
├── EMAIL_VERIFICATION.md ← Sistema de registro + verificação de email
├── AUTHENTICATION_ENDPOINTS.md ← Todos os endpoints de autenticação
└── PASSWORD_RECOVERY_LOGOUT.md ← Recuperação de senha e logout
```

---

## 🎯 Documentos Disponíveis

### 1. **EMAIL_VERIFICATION.md**

**Para**: Implementar sistema de registro com verificação de email em 6 dígitos

**Contém:**

- ✅ Endpoint `POST /api/auth/register`
- ✅ Endpoint `POST /api/auth/verify-email`
- ✅ Endpoint `POST /api/auth/send-verification-code`
- ✅ Fluxo visual completo
- ✅ Template de email HTML
- ✅ Schema do banco de dados
- ✅ Setup Redis
- ✅ Exemplos com cURL
- ✅ Checklist de implementação

**Use este documento para:**

- Entender como funciona a verificação de email
- Implementar os endpoints no backend
- Configurar Redis
- Testar com cURL

---

### 2. **AUTHENTICATION_ENDPOINTS.md**

**Para**: Visão geral de TODOS os endpoints de autenticação

**Contém:**

- ✅ Registro & Verificação
- ✅ OAuth (GitHub & Google)
- ✅ Login com Email/Senha
- ✅ Gerenciamento de Sessão
- ✅ Recuperação de Senha
- ✅ Fluxos de autenticação
- ✅ Segurança
- ✅ Status de implementação

**Use este documento para:**

- Ver todos os endpoints disponíveis
- Entender os fluxos completos
- Planejar próximas features
- Referência rápida

---

### 3. **PASSWORD_RECOVERY_LOGOUT.md** (NOVO!)

**Para**: Implementar recuperação de senha e logout

**Contém:**

- ✅ Endpoint `POST /api/auth/forgot-password`
- ✅ Endpoint `POST /api/auth/reset-password`
- ✅ Endpoint `POST /api/auth/signout`
- ✅ Templates de email (2 emails diferentes)
- ✅ Fluxos visuais completos
- ✅ Validações frontend
- ✅ Processamento backend
- ✅ Testes com cURL
- ✅ Checklist de implementação

**Use este documento para:**

- Entender o fluxo de recuperação de senha
- Implementar os 3 endpoints no backend
- Configurar templates de email
- Testar com cURL

---

## 🚀 Começar Rápido

### Para Implementar o Backend

1. **Abra** `EMAIL_VERIFICATION.md`
2. **Leia** a seção "Endpoints Implementados"
3. **Copie** os Schemas (JSON de entrada/saída)
4. **Implemente** os 3 endpoints no FastAPI
5. **Teste** com cURL (exemplos no documento)

### Para Entender o Sistema

1. **Abra** `AUTHENTICATION_ENDPOINTS.md`
2. **Leia** a seção "Fluxos de Autenticação"
3. **Veja** qual fluxo você precisa implementar
4. **Detalhe** em `EMAIL_VERIFICATION.md` se necessário

---

## 📋 Endpoints Principais

### 🔐 Autenticação (Email/Senha)

| Endpoint                           | Método | Params                    | Status      |
| ---------------------------------- | ------ | ------------------------- | ----------- |
| `/api/auth/register`               | POST   | fullName, email, password | ⏳ Backend  |
| `/api/auth/verify-email`           | POST   | email, code               | ⏳ Backend  |
| `/api/auth/send-verification-code` | POST   | email                     | ⏳ Backend  |
| `/api/auth/signin`                 | POST   | email, password           | ✅ NextAuth |
| `/api/auth/signout`                | POST   | -                         | ✅ NextAuth |

### 🌐 OAuth

| Endpoint                    | Método   | Params      | Status      |
| --------------------------- | -------- | ----------- | ----------- |
| `/api/auth/signin/github`   | GET/POST | -           | ✅ NextAuth |
| `/api/auth/callback/github` | GET      | code, state | ✅ NextAuth |
| `/api/auth/signin/google`   | GET/POST | -           | ✅ NextAuth |
| `/api/auth/callback/google` | GET      | code, state | ✅ NextAuth |

### 👤 Sessão

| Endpoint              | Método | Params | Status      |
| --------------------- | ------ | ------ | ----------- |
| `/api/auth/session`   | GET    | -      | ✅ NextAuth |
| `/api/auth/providers` | GET    | -      | ✅ NextAuth |

---

## 💻 Tecnologia Stack

### Frontend

- Next.js 16.2.0 (Turbopack)
- NextAuth.js v5+ (OAuth + Sessions)
- TailwindCSS + shadcn/ui
- TypeScript

### Backend (A Implementar)

- FastAPI
- PostgreSQL (usuários)
- Redis (códigos de verificação)
- Resend/SendGrid/Mailgun (emails)

---

## ✅ Checklist de Implementação Geral

### Backend - Email Verification

- [ ] Ler `EMAIL_VERIFICATION.md` completamente
- [ ] Instalar dependências (redis, bcrypt, email)
- [ ] Criar modelo User com `is_verified` e `verified_at`
- [ ] Implementar `POST /api/auth/register`
- [ ] Implementar `POST /api/auth/verify-email`
- [ ] Implementar `POST /api/auth/send-verification-code`
- [ ] Testar com cURL
- [ ] Testar no frontend

### Backend - Login

- [ ] Implementar `POST /api/auth/login`
- [ ] Retornar JWT token
- [ ] Testar com credenciais

### Banco de Dados

- [ ] Setup PostgreSQL
- [ ] Criar tabela `users` com campos obrigatórios
- [ ] Adicionar índices
- [ ] Testar migrations

### Redis

- [ ] Setup Redis (Docker recomendado)
- [ ] Testar conexão
- [ ] Testar set/get chaves

### Email

- [ ] Escolher provedor (Resend recomendado)
- [ ] Obter API key
- [ ] Configurar no `.env`
- [ ] Testar envio de email

---

## 🧪 Como Testar

### Teste 1: Registrar Usuário

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Teste User",
    "email": "teste@example.com",
    "password": "Senha@12345"
  }'
```

### Teste 2: Verificar Email

```bash
# Obter código do Redis
redis-cli GET verification_code:teste@example.com

# Usar o código retornado
curl -X POST http://localhost:8000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "code": "123456"
  }'
```

### Teste 3: Fazer Login

```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "Senha@12345"
  }'
```

---

## 📞 Suporte

Se tiver dúvidas sobre:

1. **Email Verification** → Veja `EMAIL_VERIFICATION.md`
2. **Todos os Endpoints** → Veja `AUTHENTICATION_ENDPOINTS.md`
3. **Implementação FastAPI** → Veja `EMAIL_VERIFICATION.md` seção "Implementação"
4. **Segurança** → Veja `AUTHENTICATION_ENDPOINTS.md` seção "Segurança"

---

## 📈 Roadmap

### Fase 1 (Atual) ✅

- [x] Frontend de registro
- [x] Frontend de verificação de email
- [x] Route Handlers criados
- [ ] Backend de registro
- [ ] Backend de verificação

### Fase 2

- [ ] Frontend de recuperação de senha
- [ ] Backend de recuperação de senha
- [ ] Tests de segurança

### Fase 3

- [ ] 2FA (Two-Factor Authentication)
- [ ] Social login integrado
- [ ] Gerenciamento de dispositivos

---

## 🔗 Links Úteis

- **Resend**: https://resend.com/docs
- **SendGrid**: https://sendgrid.com/docs
- **FastAPI**: https://fastapi.tiangolo.com
- **NextAuth.js**: https://next-auth.js.org
- **Redis**: https://redis.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs

---

**Última atualização**: 13/04/2026
**Versão**: 1.0 - Sistema de Autenticação Completo

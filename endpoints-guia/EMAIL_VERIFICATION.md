# 📊 Endpoints de Email Verification - AcouNorm

## 🎯 Visão Geral

Sistema profissional de registro + verificação de email com 6 dígitos.

---

## 🔌 Endpoints Implementados

### 1️⃣ Registro de Usuário

**Endpoint:** `POST /api/auth/register`

**Entrada (Request Body):**

```json
{
  "fullName": "Luiz Felipe Medeiros",
  "email": "lfelipemedeiros@gmail.com",
  "password": "Senha@12345"
}
```

**Processamento (Backend):**

```
✓ Valida dados (nome, email, senha)
✓ Verifica se email já existe
✓ Cria novo usuário com is_verified=false
✓ Gera código 6-dígitos: 123456
✓ Armazena código no Redis (TTL: 10 minutos)
✓ ENVIA EMAIL com código HTML bonito
✓ Retorna sucesso
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Usuário registrado com sucesso. Verifique seu email.",
  "email": "lfelipemedeiros@gmail.com"
}
```

**Resposta de Erro (400):**

```json
{
  "error": "O email já está registrado"
}
```

---

### 2️⃣ Verificar Email com Código

**Endpoint:** `POST /api/auth/verify-email`

**Entrada (Request Body):**

```json
{
  "email": "lfelipemedeiros@gmail.com",
  "code": "123456"
}
```

**Processamento (Backend):**

```
✓ Valida dados (email e code presentes)
✓ Busca código no Redis
✓ Compara: código recebido == código armazenado
✓ Se válido:
  - Marca usuário como is_verified=true
  - Define verified_at=agora
  - Remove código do Redis
✓ Se inválido: retorna erro
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Email verificado com sucesso!",
  "verified": true
}
```

**Resposta de Erro (400):**

```json
{
  "error": "Código inválido ou expirado"
}
```

---

### 3️⃣ Reenviar Código (Resend)

**Endpoint:** `POST /api/auth/send-verification-code`

**Entrada (Request Body):**

```json
{
  "email": "lfelipemedeiros@gmail.com"
}
```

**Processamento (Backend):**

```
✓ Busca usuário por email
✓ Se não existe: erro 404
✓ Se já verificado: erro 400
✓ Gera novo código
✓ Armazena em Redis (sobrescreve anterior)
✓ ENVIA EMAIL com novo código
✓ Botão de resend no frontend fica desabilitado por 60s
```

**Resposta de Sucesso (200):**

```json
{
  "message": "Novo código enviado para seu email",
  "email": "lfelipemedeiros@gmail.com"
}
```

---

## 🎬 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. PÁGINA DE REGISTRO (/auth/register)                          │
│    - Usuário preenche: Nome, Email, Senha                       │
│    - Validação local (força de senha, etc)                      │
│    - Clica "Criar Conta"                                        │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. FRONTEND ENVIA                                               │
│    POST /api/auth/register                                      │
│    {fullName, email, password}                                  │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. BACKEND PROCESSA                                             │
│    ✓ Cria usuário no BD (is_verified=false)                    │
│    ✓ Gera código: 123456                                        │
│    ✓ Armazena em Redis com TTL 10min                           │
│    ✓ ENVIA EMAIL HTML com código                               │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. PÁGINA DE VERIFICAÇÃO (/auth/verify-email?email=...)        │
│    - Email pré-preenchido                                       │
│    - 6 campos vazios para código                                │
│    - Auto-avança: 1→2→3→4→5→6                                 │
│    - Botão "Resend" (desabilitado por 60s)                     │
│    - Exibe timer contagem regressiva                            │
└─────────────────────────────────────────────────────────────────┘
                           ↓
                    [Usuário digita código]
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. AO ENCHEREM OS 6 DÍGITOS - AUTO-SUBMETE                     │
│    POST /api/auth/verify-email                                  │
│    {email, code: "123456"}                                      │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. BACKEND VALIDA                                               │
│    ✓ Busca código no Redis                                     │
│    ✓ Compara: "123456" == "123456"                            │
│    ✓ Marca usuário: is_verified=true                           │
│    ✓ Remove código do Redis                                    │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. SUCESSO! ✅                                                  │
│    - Tela mostra: "Email verificado com sucesso!"              │
│    - Após 2s: Redireciona para /login                          │
│    - Usuário pode fazer login                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📧 Template do Email Enviado

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        color: #0066cc;
      }
      .code-box {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        margin: 20px 0;
        border: 2px solid #0066cc;
      }
      .code {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 5px;
        color: #0066cc;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">🎵 AcouNorm</div>
      <h2>Bem-vindo ao AcouNorm!</h2>
      <p>Para completar seu registro, use o código abaixo:</p>

      <div class="code-box">
        <div class="code">123456</div>
      </div>

      <p><strong>Este código expira em 10 minutos.</strong></p>
      <p>Se você não solicitou este código, ignore este email.</p>
      <p style="font-size: 12px; color: #999;">AcouNorm © 2026</p>
    </div>
  </body>
</html>
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,          -- ← Novo
    verified_at TIMESTAMP NULL,                 -- ← Novo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

---

## 💾 Redis - Armazenamento de Códigos

### Estrutura:

```
key: verification_code:{email}
value: {codigo_6_digitos}
ttl: 600 segundos (10 minutos)
```

### Exemplos:

```redis
SET verification_code:lfelipemedeiros@gmail.com "123456" EX 600
GET verification_code:lfelipemedeiros@gmail.com
# Retorna: "123456"

# Após 10 minutos, a chave expira automaticamente
# Tentativa de GET retorna: (nil)
```

---

## 🔑 Variáveis de Ambiente Necessárias

```env
# Backend
REDIS_HOST=localhost
REDIS_PORT=6379
DATABASE_URL=postgresql://user:password@localhost/acounorm

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx

# Email (Mailgun)
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.acounorm.com

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧪 Testando com cURL

### 1. Registrar Usuário

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Teste User",
    "email": "teste@example.com",
    "password": "Senha@12345"
  }'
```

### 2. Obter Código do Redis (para testes)

```bash
redis-cli GET verification_code:teste@example.com
# Retorna: "123456"
```

### 3. Verificar Email

```bash
curl -X POST http://localhost:8000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "code": "123456"
  }'
```

### 4. Reenviar Código

```bash
curl -X POST http://localhost:8000/api/auth/send-verification-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com"
  }'
```

---

## ✅ Checklist de Implementação

### Backend (FastAPI)

- [ ] Criar endpoint `POST /api/auth/register`
- [ ] Validar dados de entrada
- [ ] Hash de senha (bcrypt/argon2)
- [ ] Criar usuário no BD com `is_verified=false`
- [ ] Gerar código 6 dígitos: `random.randint(100000, 999999)`
- [ ] Armazenar código no Redis com TTL 600s
- [ ] Configurar provedor email (Resend/SendGrid/Mailgun)
- [ ] Enviar email HTML com código
- [ ] Criar endpoint `POST /api/auth/verify-email`
- [ ] Validar código contra Redis
- [ ] Marcar usuário como verificado
- [ ] Remover código do Redis após validação
- [ ] Criar endpoint `POST /api/auth/send-verification-code`
- [ ] Testes com cURL/Postman

### Frontend (Next.js)

- [x] Página de registro (`/auth/register`)
- [x] Route Handler `/api/auth/register`
- [x] Validação de força de senha
- [x] Página de verificação (`/auth/verify-email`)
- [x] 6 campos de input com auto-avança
- [x] Route Handler `/api/auth/verify-email`
- [x] Timer de 60s no botão resend
- [x] Mensagens de erro/sucesso
- [x] Redirect automático após sucesso

### Banco de Dados

- [ ] Adicionar coluna `is_verified` (BOOLEAN, DEFAULT FALSE)
- [ ] Adicionar coluna `verified_at` (TIMESTAMP, NULL)
- [ ] Criar índice em `email`

### Redis

- [ ] Setup containerizado (Docker)
- [ ] Teste de conexão
- [ ] Teste de set/get chaves

---

## 🚀 Status Atual

| Componente            | Status        | Notas                    |
| --------------------- | ------------- | ------------------------ |
| Frontend Registro     | ✅ Pronto     | Página + validação       |
| Frontend Verificação  | ✅ Pronto     | 6 dígitos + timers       |
| Route Handlers        | ✅ Criados    | Proxies para backend     |
| Backend /register     | ⏳ Aguardando | Precisa ser implementado |
| Backend /verify-email | ⏳ Aguardando | Precisa ser implementado |
| Backend /resend       | ⏳ Aguardando | Precisa ser implementado |
| Email Service         | ⏳ Aguardando | Resend/SendGrid/Mailgun  |
| Redis                 | ⏳ Aguardando | Setup + testes           |

---

## 📚 Referências Rápidas

- **Resend Docs**: https://resend.com/docs
- **SendGrid Docs**: https://sendgrid.com/docs
- **Mailgun Docs**: https://www.mailgun.com/docs
- **Redis Python**: https://redis-py.readthedocs.io/
- **FastAPI Email**: https://fastapi.tiangolo.com/advanced/middleware/

---

**Última atualização**: 13/04/2026
**Versão**: 1.0 - Sistema Completo Pronto para Implementação

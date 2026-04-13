# 🔐 Endpoints de Autenticação Completos - AcouNorm

## 📋 Index

1. [Registro & Verificação](#registro--verificação)
2. [OAuth](#oauth)
3. [Login](#login)
4. [Sessão](#sessão)
5. [Recuperação de Senha](#recuperação-de-senha)

---

## Registro & Verificação

### `POST /api/auth/register`

Registra novo usuário e envia email de verificação

- [Ver documentação completa](./EMAIL_VERIFICATION.md#1️⃣-registro-de-usuário)

### `POST /api/auth/verify-email`

Verifica email com código de 6 dígitos

- [Ver documentação completa](./EMAIL_VERIFICATION.md#2️⃣-verificar-email-com-código)

### `POST /api/auth/send-verification-code`

Resend: Reenvia código para o email

- [Ver documentação completa](./EMAIL_VERIFICATION.md#3️⃣-reenviar-código-resend)

---

## OAuth

### `GET/POST /api/auth/signin/github`

Inicia autenticação com GitHub

**Entrada:**

```json
{}
```

**Fluxo:**

```
1. Frontend clica em "Entrar com GitHub"
2. Redireciona para: /api/auth/signin/github
3. NextAuth.js lida com OAuth flow
4. GitHub retorna com código
5. Backend troca código por token
6. Usuário autenticado + Session criada
```

**Resposta (Sucesso):**

```
Redireciona para: /dashboard
```

---

### `GET/POST /api/auth/signin/google`

Inicia autenticação com Google

**Entrada:**

```json
{}
```

**Fluxo:**

```
1. Frontend clica em "Entrar com Google"
2. Redireciona para: /api/auth/signin/google
3. NextAuth.js lida com OAuth flow
4. Google retorna com código
5. Backend troca código por token
6. Usuário autenticado + Session criada
```

**Resposta (Sucesso):**

```
Redireciona para: /dashboard
```

---

## Login

### `POST /api/auth/signin` (Credentials)

Login com email + senha via NextAuth

**Entrada (Request Body):**

```json
{
  "email": "usuario@example.com",
  "password": "Senha@12345"
}
```

**Processamento:**

```
✓ Recebe credenciais do CredentialsProvider
✓ Valida email + senha contra BD
✓ Se válido:
  - Cria JWT token
  - Armazena session
  - Retorna user data
✓ Se inválido:
  - Retorna erro 401
```

**Resposta de Sucesso:**

```json
{
  "user": {
    "id": "uuid-do-usuario",
    "email": "usuario@example.com",
    "name": "Nome Do Usuário",
    "image": "https://..."
  },
  "expires": "2026-04-20T14:09:00Z"
}
```

**Resposta de Erro:**

```json
{
  "error": "Credenciais inválidas"
}
```

---

## Sessão

### `GET /api/auth/session`

Obtém dados da sessão atual do usuário

**Entrada:**

```
Header: Cookie (automaticamente enviado)
```

**Resposta de Sucesso (200):**

```json
{
  "user": {
    "email": "usuario@example.com",
    "name": "Nome Do Usuário",
    "image": "https://..."
  },
  "expires": "2026-04-20T14:09:00Z"
}
```

**Resposta sem Sessão (401):**

```json
null
```

---

### `GET /api/auth/providers`

Lista provedores OAuth disponíveis

**Entrada:**

```
GET request simples
```

**Resposta:**

```json
{
  "github": {
    "id": "github",
    "name": "GitHub",
    "signinUrl": "/api/auth/signin/github",
    "callbackUrl": "/api/auth/callback/github"
  },
  "google": {
    "id": "google",
    "name": "Google",
    "signinUrl": "/api/auth/signin/google",
    "callbackUrl": "/api/auth/callback/google"
  },
  "credentials": {
    "id": "credentials",
    "name": "Email e Senha",
    "signinUrl": "/api/auth/signin"
  }
}
```

---

### `GET /api/auth/callback/github`

Callback do OAuth do GitHub (automático)

**Processamento:**

```
✓ GitHub retorna code + state
✓ NextAuth.js troca por token de acesso
✓ Busca dados do usuário
✓ Cria ou atualiza usuário no BD
✓ Cria session JWT
✓ Redireciona para callback URL
```

---

### `GET /api/auth/callback/google`

Callback do OAuth do Google (automático)

**Processamento:**

```
✓ Google retorna code + state
✓ NextAuth.js troca por token de acesso
✓ Busca dados do usuário
✓ Cria ou atualiza usuário no BD
✓ Cria session JWT
✓ Redireciona para callback URL
```

---

### `POST /api/auth/signout`

Faz logout do usuário

**Entrada:**

```
POST request (CSRF token no body)
```

**Processamento:**

```
✓ Remove session JWT
✓ Remove cookies de autenticação
✓ Invalida session
✓ Redireciona para home
```

**Resposta:**

```
Redireciona para: /
```

---

## Recuperação de Senha

### `POST /api/auth/forgot-password`

Inicia processo de recuperação de senha

**Entrada (Request Body):**

```json
{
  "email": "usuario@example.com"
}
```

**Processamento:**

```
✓ Valida email
✓ Busca usuário por email
✓ Gera token de reset (UUID random)
✓ Armazena token em Redis com TTL (1 hora)
✓ ENVIA EMAIL com link de reset
✓ Retorna sucesso (sem revelar se email existe)
```

**Resposta:**

```json
{
  "message": "Se o email existe, um link de recuperação foi enviado.",
  "email": "usuario@example.com"
}
```

---

### `POST /api/auth/reset-password`

Reseta a senha do usuário

**Entrada (Request Body):**

```json
{
  "token": "uuid-do-token-da-url",
  "password": "NovaSenha@12345",
  "password_confirm": "NovaSenha@12345"
}
```

**Processamento:**

```
✓ Valida token contra Redis
✓ Valida força de nova senha
✓ Valida confirmação de senha
✓ Se válido:
  - Busca usuário pelo token
  - Atualiza password_hash no BD
  - Remove token do Redis
  - ENVIA EMAIL de confirmação
✓ Se inválido:
  - Retorna erro com mensagem clara
```

**Resposta de Sucesso:**

```json
{
  "message": "Senha alterada com sucesso!",
  "redirectUrl": "/login"
}
```

**Resposta de Erro:**

```json
{
  "error": "Link expirado ou inválido"
}
```

---

## 🔄 Fluxos de Autenticação

### Fluxo 1: Register + Email Verification

```
/auth/register
    ↓
[Usuário preenche nome, email, senha]
    ↓
POST /api/auth/register
    ↓
Backend cria usuário + envia email
    ↓
/auth/verify-email?email=...
    ↓
[Usuário digita código]
    ↓
POST /api/auth/verify-email
    ↓
Email verificado ✅
    ↓
/login
```

### Fluxo 2: OAuth Login

```
/login
    ↓
[Usuário clica "GitHub" ou "Google"]
    ↓
GET/POST /api/auth/signin/github (ou google)
    ↓
OAuth Provider (GitHub/Google)
    ↓
GET /api/auth/callback/github (ou google)
    ↓
Backend cria/atualiza usuário
    ↓
/dashboard ✅
```

### Fluxo 3: Email/Senha Login

```
/login
    ↓
[Usuário preenche email + senha]
    ↓
POST /api/auth/signin (credentials)
    ↓
Backend valida credenciais
    ↓
/dashboard ✅
```

### Fluxo 4: Recuperação de Senha

```
/login → "Esqueci minha senha"
    ↓
/forgot-password
    ↓
[Usuário entra email]
    ↓
POST /api/auth/forgot-password
    ↓
[Email recebe link com token]
    ↓
/reset-password?token=...
    ↓
[Usuário digita nova senha]
    ↓
POST /api/auth/reset-password
    ↓
Senha resetada ✅
    ↓
/login
```

---

## 🛡️ Segurança

### CSRF Protection

- NextAuth.js gerencia CSRF tokens automaticamente
- Todos os POSTs incluem CSRF verificação

### Session Management

- Sessões armazenadas em JWT
- Duração padrão: 30 dias
- Podem ser configuradas em `.env`

### Password Hashing

- Algoritmo: bcrypt ou Argon2
- Cost factor: 12 (recomendado)
- Nunca armazenar senha em plaintext

### Rate Limiting (Recomendado)

```
/api/auth/signin: 5 tentativas/10 minutos
/api/auth/forgot-password: 3 tentativas/hora
/api/auth/register: 3 tentativas/hora
```

### Email Verification

- Código de 6 dígitos aleatório
- TTL: 10 minutos
- Pode ser reenviado ilimitadamente
- Código consumido após verificação bem-sucedida

---

## 📊 Status de Implementação

| Endpoint            | Frontend | Backend | Status              |
| ------------------- | -------- | ------- | ------------------- |
| Register            | ✅       | ⏳      | Pronto para backend |
| Verify Email        | ✅       | ⏳      | Pronto para backend |
| Send Code           | ✅       | ⏳      | Pronto para backend |
| OAuth GitHub        | ✅       | ✅      | NextAuth.js         |
| OAuth Google        | ✅       | ✅      | NextAuth.js         |
| Login (credentials) | ✅       | ✅      | NextAuth.js         |
| Get Session         | ✅       | ✅      | NextAuth.js         |
| Signout             | ✅       | ✅      | Route Handler       |
| Forgot Password     | ✅       | ⏳      | Pronto para backend |
| Reset Password      | ✅       | ⏳      | Pronto para backend |

---

## 🚀 Próximos Passos

1. **Backend**: Implementar `/api/auth/register` (ver EMAIL_VERIFICATION.md)
2. **Backend**: Implementar `/api/auth/verify-email`
3. **Backend**: Implementar `/api/auth/send-verification-code`
4. **Testes**: Testar fluxos completos
5. **Frontend**: Implementar Forgot Password UI
6. **Backend**: Implementar Forgot Password endpoints

---

**Última atualização**: 13/04/2026
**Versão**: 1.0 - Sistema de Autenticação Completo

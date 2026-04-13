# 🔐 Endpoints de Recuperação de Senha & Logout - AcouNorm

Documentação detalhada dos endpoints de recuperação de senha e logout.

---

## 📋 Endpoints

1. [POST /api/auth/forgot-password](#-postapiauthforgot-password)
2. [POST /api/auth/reset-password](#-postapiauthpause-password)
3. [POST /api/auth/signout](#-postapiauthsignout)

---

## 🔑 POST /api/auth/forgot-password

**Descrição**: Inicia processo de recuperação de senha enviando link por email

**Método**: `POST`
**URL**: `/api/auth/forgot-password`

### Entrada (Request Body)

```json
{
  "email": "usuario@example.com"
}
```

### Validações Frontend

```
✓ Email obrigatório
✓ Email válido (formato)
✓ Mínimo feedback sobre existência de email (segurança)
```

### Processamento Backend

```
1. Valida email (formato)
2. Busca usuário por email no BD
3. Se não encontrar:
   - NÃO revelar que email não existe (segurança)
   - Retornar sucesso mesmo assim
4. Se encontrar:
   - Gera token aleatório (UUID)
   - Armazena em Redis com TTL 1 hora:
     key: reset_token:{token}
     value: {user_id}:{email}
     ttl: 3600 segundos
   - ENVIA EMAIL com link:
     https://acounorm.com/auth/reset-password?token={token}
5. Retorna resposta padrão
```

### Resposta (200)

```json
{
  "message": "Se o email está registrado, um link de recuperação será enviado.",
  "email": "usuario@example.com"
}
```

### Template do Email

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
      .button {
        background: #0066cc;
        color: white;
        padding: 12px 30px;
        border-radius: 6px;
        text-decoration: none;
        display: inline-block;
        margin: 20px 0;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">🎵 AcouNorm</div>
      <h2>Recuperação de Senha</h2>
      <p>Recebemos uma solicitação para resetar sua senha.</p>

      <a
        href="https://acounorm.com/auth/reset-password?token={token}"
        class="button"
      >
        Resetar Minha Senha
      </a>

      <p>Ou copie e cole o link abaixo no seu navegador:</p>
      <p
        style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;"
      >
        https://acounorm.com/auth/reset-password?token={token}
      </p>

      <p><strong>Este link expira em 1 hora.</strong></p>
      <p>Se você não solicitou esta recuperação, ignore este email.</p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999;">
        AcouNorm © 2026 - Sistema de Isolamento Acústico
      </p>
    </div>
  </body>
</html>
```

### Testes com cURL

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com"
  }'
```

---

## 🔄 POST /api/auth/reset-password

**Descrição**: Reseta a senha usando token enviado por email

**Método**: `POST`
**URL**: `/api/auth/reset-password`

### Entrada (Request Body)

```json
{
  "token": "uuid-do-token-recebido-no-email",
  "password": "NovaSenha@12345",
  "password_confirm": "NovaSenha@12345"
}
```

### Validações Frontend

```
✓ Token presente na URL (query param ?token=...)
✓ Nova senha obrigatória
✓ Confirmação de senha obrigatória
✓ Senhas conferem
✓ Mínimo 8 caracteres
✓ Força de senha (maiúscula, minúscula, número, especial)
✓ Não pode ser igual à senha anterior
```

### Processamento Backend

```
1. Valida token (presente e formato)
2. Busca token no Redis:
   key: reset_token:{token}
   value: {user_id}:{email}
3. Se não encontrar ou expirado:
   - Retorna erro 400 "Link expirado ou inválido"
4. Se encontrar:
   - Desserializa value para obter user_id
   - Valida force de nova senha
   - Valida password != password_confirm
   - Faz hash da nova senha (bcrypt/argon2)
   - Atualiza password_hash no BD
   - Remove token do Redis
   - ENVIA EMAIL de confirmação
   - Retorna sucesso
```

### Resposta de Sucesso (200)

```json
{
  "message": "Senha alterada com sucesso!",
  "redirectUrl": "/login"
}
```

### Resposta de Erro (400)

```json
{
  "error": "Link expirado ou inválido"
}
```

### Email de Confirmação

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
      .alert-box {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        padding: 15px;
        border-radius: 4px;
        color: #155724;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">🎵 AcouNorm</div>
      <h2>Senha Alterada com Sucesso!</h2>

      <div class="alert-box">
        <strong>✓ Sua senha foi resetada.</strong>
        <p>Você pode fazer login com a nova senha.</p>
      </div>

      <p>
        Se você não fez esta alteração,
        <a href="https://acounorm.com/auth/forgot-password">clique aqui</a>
        para recuperar sua conta.
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999;">
        AcouNorm © 2026 - Sistema de Isolamento Acústico
      </p>
    </div>
  </body>
</html>
```

### Testes com cURL

```bash
# Obter token do Redis (para testes)
redis-cli GET reset_token:{token_aqui}

# Fazer reset
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "uuid-do-token",
    "password": "NovaSenha@12345",
    "password_confirm": "NovaSenha@12345"
  }'
```

---

## 🚪 POST /api/auth/signout

**Descrição**: Faz logout do usuário

**Método**: `POST`
**URL**: `/api/auth/signout`

### Entrada

```
No body necessário - usa Session/JWT do NextAuth
```

### Frontend (JavaScript/TypeScript)

```typescript
// Usando NextAuth.js
import { signOut } from "next-auth/react";

// Simple singout
await signOut({ redirect: true });

// Com URL customizada
await signOut({ callbackUrl: "/login" });

// Ou via Route Handler
fetch("/api/auth/signout", { method: "POST" });
```

### Processamento

```
✓ Remove session JWT
✓ Remove cookies de autenticação:
  - next-auth.session-token
  - next-auth.csrf-token
✓ Invalida session
✓ Redireciona para home (/)
```

### Resposta (200)

```json
{
  "message": "Logout realizado com sucesso",
  "redirectUrl": "/"
}
```

### Cookies Removidos

```
next-auth.session-token=;
  HttpOnly;
  Secure;
  SameSite=Lax;
  Max-Age=0

next-auth.csrf-token=;
  HttpOnly;
  Secure;
  SameSite=Lax;
  Max-Age=0
```

### Testes com cURL

```bash
curl -X POST http://localhost:3000/api/auth/signout \
  -H "Content-Type: application/json" \
  -b "next-auth.session-token=your_token_here"
```

---

## 🎭 Fluxos Visuais

### Fluxo: Esqueceu a Senha

```
┌─────────────────────────────────────┐
│ PAGE: /login                        │
│ Usuário clica "Esqueci minha senha" │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ PAGE: /auth/forgot-password         │
│ - Input de email                    │
│ - Botão "Enviar Link"               │
└─────────────────────────────────────┘
             ↓
   [Usuário entra email e clica]
             ↓
┌─────────────────────────────────────┐
│ POST /api/auth/forgot-password      │
│ Body: { email }                     │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ BACKEND                             │
│ ✓ Gera token                        │
│ ✓ Armazena em Redis (1h)            │
│ ✓ ENVIA EMAIL                       │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ PAGE: /auth/forgot-password         │
│ "Email enviado com sucesso!"        │
│ "Verifique sua caixa de entrada"   │
└─────────────────────────────────────┘
             ↓
    [Usuário abre email]
    [Clica em link com token]
             ↓
┌─────────────────────────────────────┐
│ PAGE: /auth/reset-password?token=.. │
│ - Input nova senha                  │
│ - Input confirmar senha             │
│ - Botão "Resetar Senha"             │
└─────────────────────────────────────┘
             ↓
  [Usuário entra nova senha e clica]
             ↓
┌─────────────────────────────────────┐
│ POST /api/auth/reset-password       │
│ Body: { token, password, conf }     │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ BACKEND                             │
│ ✓ Valida token vs Redis             │
│ ✓ Faz hash da senha                 │
│ ✓ Atualiza BD                       │
│ ✓ Remove token Redis                │
│ ✓ ENVIA EMAIL de confirmação        │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ PAGE: /auth/reset-password          │
│ ✅ "Senha alterada com sucesso!"    │
│ [Auto-redireciona em 2s]            │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ PAGE: /login                        │
│ Usuário pode fazer login            │
└─────────────────────────────────────┘
```

### Fluxo: Logout

```
┌─────────────────────────────────┐
│ PAGE: /dashboard                │
│ Usuário clica em "Logout"       │
└─────────────────────────────────┘
             ↓
┌─────────────────────────────────┐
│ POST /api/auth/signout          │
│ (NextAuth.js lida automaticamente)  │
└─────────────────────────────────┘
             ↓
┌─────────────────────────────────┐
│ BACKEND                         │
│ ✓ Remove session                │
│ ✓ Remove cookies                │
└─────────────────────────────────┘
             ↓
┌─────────────────────────────────┐
│ PAGE: /login ou /               │
│ Usuário deslogado ✅            │
└─────────────────────────────────┘
```

---

## 📊 Status

| Recurso                 | Frontend | Backend | Status  |
| ----------------------- | -------- | ------- | ------- |
| Página Forgot Password  | ✅       | ⏳      | Pronto  |
| Página Reset Password   | ✅       | ⏳      | Pronto  |
| Route Handler Forgot    | ✅       | -       | Criado  |
| Route Handler Reset     | ✅       | -       | Criado  |
| Route Handler Signout   | ✅       | -       | Criado  |
| Endpoint Backend Forgot | ❌       | ⏳      | A fazer |
| Endpoint Backend Reset  | ❌       | ⏳      | A fazer |

---

## ✅ Checklist Backend

- [ ] Implementar `/api/auth/forgot-password`
  - [ ] Validar email
  - [ ] Buscar usuário
  - [ ] Gerar token UUID
  - [ ] Armazenar em Redis (TTL 1h)
  - [ ] Enviar email com link
- [ ] Implementar `/api/auth/reset-password`
  - [ ] Validar token vs Redis
  - [ ] Validar força de senha
  - [ ] Fazer hash da senha
  - [ ] Atualizar BD
  - [ ] Remover token do Redis
  - [ ] Enviar email de confirmação
- [ ] Configurar email service (Resend/SendGrid)
- [ ] Testes com cURL
- [ ] Testes no navegador

---

**Última atualização**: 13/04/2026
**Versão**: 1.0

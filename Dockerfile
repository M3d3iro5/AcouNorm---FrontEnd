# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install --frozen-lockfile

# Copiar source
COPY . .

# Build
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Instalar dependências de produção apenas
COPY package*.json ./
RUN npm install --frozen-lockfile --production

# Copiar build from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Iniciar
CMD ["npm", "start"]

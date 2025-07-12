# Etapa de build
FROM node:22-alpine AS builder

WORKDIR /app

# Instala compatibilidade para libs nativas
RUN apk add --no-cache libc6-compat

# Copia e instala dependências
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copia o restante do código
COPY . .

# Compila o projeto
RUN npm run build

# Etapa de execução
FROM node:22-alpine AS runner

# 🔧 Instala dependências necessárias para o Chromium funcionar no Alpine
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  dumb-init \
  bash

# Define variáveis para Puppeteer usar o Chromium do sistema
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copia apenas o necessário da fase de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Usa Puppeteer com o Chromium instalado no sistema
CMD ["node", "dist/main.js"]

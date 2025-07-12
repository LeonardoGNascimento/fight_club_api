FROM node:22-alpine AS builder

WORKDIR /app

# Instala compatibilidade com dependências nativas
RUN apk add --no-cache libc6-compat

# Copia apenas os arquivos necessários primeiro (cache mais eficiente)
COPY package.json package-lock.json ./

# Instala dependências de forma limpa usando o lockfile
RUN npm ci --legacy-peer-deps

# Copia o restante do código
COPY . .

# Compila o projeto
RUN npm run build

# Fase de execução
FROM node:22-alpine AS runner

RUN npx puppeteer browsers install chrome

WORKDIR /app

# Copia apenas o necessário da fase de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

CMD ["node", "dist/main.js"]

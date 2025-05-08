# Etapa 1: Build
FROM node:22-alpine AS builder

# Instala dependências úteis (opcional: remove se não usar npm audit etc.)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copia apenas arquivos essenciais para instalar dependências
COPY package*.json ./

# Instala as dependências em modo limpo
RUN npm ci --legacy-peer-deps

# Copia o restante do código 
COPY . .

# Compila a aplicação
RUN npm run build

# Etapa 2: Runtime
FROM node:22-alpine AS runner

WORKDIR /app

# Copia apenas o necessário da build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Define a porta exposta (caso use em nuvem ou Docker Compose)
EXPOSE 3000

# Usa node diretamente
CMD ["node", "dist/main.js"]

FROM node:22-alpine AS builder

WORKDIR /app/api

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app/api

COPY --from=builder /app/api/node_modules ./node_modules
COPY --from=builder /app/api/dist ./dist
COPY package.json ./

CMD ["node", "dist/main.js"]

FROM node:22.14.0

WORKDIR /app/api

COPY ./package.json ./package.json

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

ENTRYPOINT ["npm", "run", "start:prod"]
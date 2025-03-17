FROM node:22.14.0

WORKDIR /app/api

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT ["npm", "run", "start:prod"]
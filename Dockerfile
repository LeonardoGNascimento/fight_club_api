FROM 23-alpine3.20

WORKDIR /app/api

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT ["npm", "run", "start:prod"]
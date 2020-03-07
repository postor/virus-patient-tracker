FROM node:10-alpine

RUN mkdir /app
WORKDIR /app


COPY package*.json ./

RUN npm i 

COPY . .

RUN npm run build && npm run build:web:prod && npm prune --production

ENV NODE_ENV=production
CMD ["npm", "start"]
FROM node:12-alpine

COPY package*.json ./
COPY tsconfig.production.json ./
COPY src ./src

RUN npm ci --ignore-scripts --no-audit && \
  npm run build && \
  npm ci --ignore-scripts --no-audit --only=production

CMD [ "npm", "run", "start"]


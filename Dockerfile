FROM node:12-alpine

COPY scripts/entrypoint.sh ./entrypoint.sh

WORKDIR /action

COPY package*.json ./
COPY tsconfig.production.json ./
COPY src ./src

RUN npm ci --ignore-scripts --no-audit && \
  npm run build && \
  npm ci --ignore-scripts --no-audit --only=production

#ENTRYPOINT [ "/entrypoint.sh"]
CMD ["pwd"]

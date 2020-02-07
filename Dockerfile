FROM node:12-alpine

WORKDIR /action

COPY package*.json ./
COPY tsconfig.production.json ./
COPY src ./src

RUN npm ci --ignore-scripts --no-audit && \
  npm run build && \
  npm ci --ignore-scripts --no-audit --only=production
RUN ls -al /github
RUN ls -al /github/home
RUN ls -al /action

CMD [ "ls", "-al", "/github/home"]

